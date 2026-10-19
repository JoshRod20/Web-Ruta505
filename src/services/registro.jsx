import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";

/**
 * Crea la cuenta en Firebase Auth y el documento de perfil en Firestore.
 * @param {string} email
 * @param {string} password
 * @param {object} datosPerfil - role, actorType, estadoVerificacion y campos propios del formulario
 */
export const registrarUsuario = async (email, password, datosPerfil) => {
  const credenciales = await createUserWithEmailAndPassword(auth, email, password);
  const uid = credenciales.user.uid;

  await setDoc(doc(db, "users", uid), {
    ...datosPerfil,
    email,
    createdAt: serverTimestamp(),
  });

  return uid;
};