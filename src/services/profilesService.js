import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import {
  COLLECTIONS,
  USER_FIELDS,
  USER_ROLES,
  VERIFICATION_STATUS,
} from '../constants/firestoreSchema';
import { readDate, readFirstText, readMunicipality } from '../utils/userFields';
import { normalizeText } from '../utils/text';

const text = (snapshot, fields) => readFirstText(snapshot, fields) ?? '';

// Convierte el documento de Firestore en el objeto que usa la pantalla.
function mapProfile(snapshot) {
  return {
    id: snapshot.id,
    nombre: text(snapshot, USER_FIELDS.fullName),
    departamento: text(snapshot, USER_FIELDS.department),
    municipio: readMunicipality(snapshot)?.value ?? '',
    telefono: text(snapshot, USER_FIELDS.phone),
    turismo: text(snapshot, USER_FIELDS.tourismCategory),
    descripcion: text(snapshot, USER_FIELDS.description),
    tipoActor: normalizeText(text(snapshot, USER_FIELDS.actorType)),
    estado: normalizeText(snapshot.get(USER_FIELDS.verificationStatus) ?? ''),
    createdAt: readDate(snapshot, USER_FIELDS.createdAt),
  };
}

const userRef = (id) => doc(db, COLLECTIONS.users, id);

// Tiempo real: todos los actores culturales; la pantalla separa
// pendientes y aprobados según `estadoVerificacion`.
export function subscribeActorProfiles(onData, onError) {
  const q = query(
    collection(db, COLLECTIONS.users),
    where(USER_FIELDS.role, '==', USER_ROLES.culturalActor)
  );
  return onSnapshot(q, (snap) => onData(snap.docs.map(mapProfile)), onError);
}

const review = (id, status, adminUid) =>
  updateDoc(userRef(id), {
    [USER_FIELDS.verificationStatus]: status,
    revisadoPor: adminUid,
    revisadoAt: serverTimestamp(),
  });

export const approveProfile = (id, adminUid) => review(id, VERIFICATION_STATUS.approved, adminUid);
export const rejectProfile = (id, adminUid) => review(id, VERIFICATION_STATUS.rejected, adminUid);
export const returnProfileToPending = (id, adminUid) =>
  review(id, VERIFICATION_STATUS.pending, adminUid);


// Borra solo el perfil (users/{uid}). Ver nota sobre Authentication.
export const deleteProfile = (id) => deleteDoc(userRef(id));