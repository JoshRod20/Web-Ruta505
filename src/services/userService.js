import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

// Lee users/{uid}. Las reglas solo permiten leerlo al dueño o a un moderador.
export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? { uid, ...snap.data() } : null;
}