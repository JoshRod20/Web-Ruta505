import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from './firebaseConfig';
import {
  BUSINESS_FIELDS,
  COLLECTIONS,
  USER_FIELDS,
  USER_ROLES,
  VERIFICATION_STATUS,
} from '../constants/firestoreSchema';
import { readFirstText, readMunicipality } from '../utils/userFields';
import { firstImageSrc } from '../utils/images';
import { normalizeText } from '../utils/text';

const text = (snapshot, fields) => readFirstText(snapshot, fields) ?? '';

function mapActor(snapshot) {
  return {
    id: snapshot.id,
    nombre: text(snapshot, USER_FIELDS.fullName),
    departamento: text(snapshot, USER_FIELDS.department),
    municipio: readMunicipality(snapshot)?.value ?? '',
    telefono: text(snapshot, USER_FIELDS.phone),
    direccion: text(snapshot, USER_FIELDS.address),
    tipoActor: normalizeText(text(snapshot, USER_FIELDS.actorType)),
  };
}

function mapBusiness(snapshot) {
  const images = snapshot.get(BUSINESS_FIELDS.images);
  const imagen = firstImageSrc(images);

  if (Array.isArray(images) && images.length > 0 && !imagen) {
    console.warn(`[actors] negocios/${snapshot.id} tiene imágenes en un formato no reconocido.`);
  }

  return {
    titulo: (snapshot.get(BUSINESS_FIELDS.title) ?? '').toString().trim(),
    direccion: (snapshot.get(BUSINESS_FIELDS.exactLocation) ?? '').toString().trim(),
    imagen,
  };
}

// Tiempo real: actores culturales con acceso aprobado.
export function subscribeApprovedActors(onData, onError) {
  const q = query(
    collection(db, COLLECTIONS.users),
    where(USER_FIELDS.role, '==', USER_ROLES.culturalActor),
    where(USER_FIELDS.verificationStatus, '==', VERIFICATION_STATUS.approved)
  );
  return onSnapshot(q, (snap) => onData(snap.docs.map(mapActor)), onError);
}

// Tiempo real: negocios, indexados por el uid del actor (que es el id del documento).
export function subscribeBusinesses(onData, onError) {
  return onSnapshot(
    collection(db, COLLECTIONS.businesses),
    (snap) => onData(new Map(snap.docs.map((doc) => [doc.id, mapBusiness(doc)]))),
    onError
  );
}