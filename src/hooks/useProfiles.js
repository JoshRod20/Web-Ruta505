import { useCallback, useEffect, useMemo, useState } from 'react';
import useAuth from './useAuth';
import {
  approveProfile,
  deleteProfile,
  rejectProfile,
  returnProfileToPending,
  subscribeActorProfiles,
} from '../services/profilesService';
import { VERIFICATION_STATUS } from '../constants/firestoreSchema';
import { ACTOR_TYPES } from '../constants/profiles';
import { mapFirestoreError } from '../utils/firestoreErrors';

const KNOWN_TYPES = new Set(ACTOR_TYPES.map(({ value }) => value));

const byOldest = (a, b) => (a.createdAt?.getTime() ?? 0) - (b.createdAt?.getTime() ?? 0);
const byName = (a, b) => a.nombre.localeCompare(b.nombre, 'es');

// Ejecuta una acción y convierte cualquier error en un mensaje legible.
async function run(action) {
  try {
    return await action();
  } catch (err) {
    console.error('[profiles]', err);
    throw new Error(mapFirestoreError(err));
  }
}

export default function useProfiles() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  // Tiempo real: Firestore empuja cada registro, aprobación, rechazo o baja.
  useEffect(() => {
    setLoading(true);
    setError('');

    return subscribeActorProfiles(
      (list) => {
        setProfiles(list);
        setLoading(false);
      },
      (err) => {
        console.error('[profiles]', err);
        setError(mapFirestoreError(err));
        setLoading(false);
      }
    );
  }, [attempt]);

  // Solicitudes: las más antiguas primero. Activas y rechazadas: orden alfabético.
  const pending = useMemo(
    () => profiles.filter((p) => p.estado === VERIFICATION_STATUS.pending).sort(byOldest),
    [profiles]
  );
  const active = useMemo(
    () => profiles.filter((p) => p.estado === VERIFICATION_STATUS.approved).sort(byName),
    [profiles]
  );
  const rejected = useMemo(
    () => profiles.filter((p) => p.estado === VERIFICATION_STATUS.rejected).sort(byName),
    [profiles]
  );

  // Cantidad de solicitudes por tipo de actor (para los números naranjas).
  const pendingCounts = useMemo(
    () => pending.reduce((acc, p) => ({ ...acc, [p.tipoActor]: (acc[p.tipoActor] ?? 0) + 1 }), {}),
    [pending]
  );

  // Aviso de diagnóstico: una cuenta con un tipo distinto a los cuatro no sale en los filtros.
  useEffect(() => {
    const unclassified = [...pending, ...active, ...rejected].filter(
      (p) => !KNOWN_TYPES.has(p.tipoActor)
    );
    if (unclassified.length > 0) {
      console.warn(
        `[profiles] ${unclassified.length} cuenta(s) con tipo de actor no reconocido:`,
        unclassified.map(({ id, tipoActor }) => ({ id, tipoActor }))
      );
    }
  }, [pending, active, rejected]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);
  const approve = useCallback((id) => run(() => approveProfile(id, user.uid)), [user.uid]);
  const reject = useCallback((id) => run(() => rejectProfile(id, user.uid)), [user.uid]);
  const returnToPending = useCallback(
    (id) => run(() => returnProfileToPending(id, user.uid)),
    [user.uid]
  );
  const remove = useCallback((id) => run(() => deleteProfile(id)), []);

  return {
    all: profiles,
    pending,
    active,
    rejected,
    pendingCounts,
    loading,
    error,
    reload,
    approve,
    reject,
    returnToPending,
    remove,
  };
}