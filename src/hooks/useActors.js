import { useCallback, useEffect, useMemo, useState } from 'react';
import { subscribeApprovedActors, subscribeBusinesses } from '../services/actorsService';
import { COUNTRY } from '../constants/actors';
import { mapFirestoreError } from '../utils/firestoreErrors';

const byName = (a, b) => a.nombre.localeCompare(b.nombre, 'es');

export default function useActors() {
  const [approved, setApproved] = useState(null); // null = aún no responde
  const [businesses, setBusinesses] = useState(null);
  const [error, setError] = useState('');
  const [photosFailed, setPhotosFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    setApproved(null);
    setBusinesses(null);
    setError('');
    setPhotosFailed(false);

    const stopActors = subscribeApprovedActors(setApproved, (err) => {
      console.error('[actors]', err);
      setError(mapFirestoreError(err));
      setApproved([]);
    });

    // Si fallan los negocios, igual se muestran los actores (sin fotos).
    const stopBusinesses = subscribeBusinesses(setBusinesses, (err) => {
      console.error('[actors:negocios]', err);
      setPhotosFailed(true);
      setBusinesses(new Map());
    });

    return () => {
      stopActors();
      stopBusinesses();
    };
  }, [attempt]);

  // Une cada actor con su negocio y prepara los textos de la tarjeta.
  const actors = useMemo(() => {
    if (!approved || !businesses) return [];

    return approved
      .map((actor) => {
        const business = businesses.get(actor.id);
        const area = [actor.municipio, actor.departamento].filter(Boolean).join(', ');

        return {
          id: actor.id,
          nombre: business?.titulo || actor.nombre || 'Sin nombre',
          imagen: business?.imagen ?? null,
          departamento: actor.departamento,
          municipio: actor.municipio,
          telefono: actor.telefono,
          tipoActor: actor.tipoActor,
          direccion: business?.direccion || actor.direccion,
          // Textos de las tres filas de la tarjeta
          lugar: actor.departamento ? `${actor.departamento}, ${COUNTRY}` : '',
          zona: area || business?.direccion || actor.direccion,
        };
      })
      .sort(byName);
  }, [approved, businesses]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);

  return {
    actors,
    loading: approved === null || businesses === null,
    error,
    photosFailed,
    reload,
  };
}