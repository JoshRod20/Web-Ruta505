import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';
import { getUserProfile } from './userService';
import { canAccessWeb } from '../utils/permissions';
import { AppError, mapAuthError } from '../utils/authErrors';

// Si el usuario escribió un nombre de usuario, lo convierte en correo
// usando la colección `usernames/{usuario}` -> { email }.
async function resolveEmail(identifier) {
  const value = identifier.trim();
  if (value.includes('@')) return value;

  const snap = await getDoc(doc(db, 'usernames', value.toLowerCase()));
  // Mismo mensaje que una contraseña incorrecta, para no revelar qué usuarios existen.
  if (!snap.exists()) throw new AppError('Usuario o contraseña incorrectos.');
  return snap.data().email;
}

// Devuelve el perfil si la cuenta puede usar la web; si no, lanza un error legible.
export async function getAuthorizedProfile(uid) {
  const profile = await getUserProfile(uid);
  if (!profile) throw new AppError('Tu cuenta no tiene un perfil registrado.');
  if (!canAccessWeb(profile)) {
  throw new AppError('Esta plataforma es solo para administradores.');
}
  return profile;
}

export async function login({ identifier, password }) {
  try {
    const email = await resolveEmail(identifier);
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return await getAuthorizedProfile(credential.user.uid);
  } catch (error) {
    // Si la contraseña era correcta pero la cuenta no puede entrar, se cierra la sesión.
    if (auth.currentUser) await signOut(auth);
    throw new Error(mapAuthError(error));
  }
}

export function logout() {
  return signOut(auth);
}