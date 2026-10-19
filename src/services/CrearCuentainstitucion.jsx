import { initializeApp, deleteApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, auth as authPrincipal, appfirebase } from "./firebase";
import { ROLES, ESTADOS_VERIFICACION } from "../constants/roles";

// Contraseña temporal aleatoria: nadie la usa realmente, ya que
// el correo de restablecimiento obliga a la persona a definir la suya.
const generarPasswordTemporal = () =>
  Math.random().toString(36).slice(-10) + "Aa1!";

/**
 * Crea una nueva cuenta de institución (INTUR) sin cerrar la sesión
 * del admin que la está creando.
 *
 * Cómo evita el problema de "crear usuario = perder tu sesión":
 * 1. Se crea una instancia secundaria de Firebase, aislada de la app
 *    principal, solo para dar de alta el usuario en Authentication.
 * 2. Esa instancia secundaria se cierra y se destruye de inmediato.
 * 3. El documento de perfil en Firestore se crea con la sesión
 *    normal del admin (la principal), que nunca se tocó.
 * 4. Se envía un correo de restablecimiento de contraseña a la
 *    persona real, para que ella defina su propia contraseña.
 *
 * @param {object} datos - { nombreInstitucion, cargo, email }
 * @returns {Promise<string>} el uid de la cuenta creada
 */
export const crearCuentaInstitucion = async ({ nombreInstitucion, cargo, email }) => {
  const nombreAppSecundaria = `secundaria-${Date.now()}`;
  const appSecundaria = initializeApp(appfirebase.options, nombreAppSecundaria);
  const authSecundaria = getAuth(appSecundaria);

  let uid;
  try {
    const passwordTemporal = generarPasswordTemporal();
    const credenciales = await createUserWithEmailAndPassword(
      authSecundaria,
      email,
      passwordTemporal
    );
    uid = credenciales.user.uid;
  } finally {
    await signOut(authSecundaria).catch(() => {});
    await deleteApp(appSecundaria).catch(() => {});
  }

  // A partir de aquí seguimos con la sesión normal del admin.
  await setDoc(doc(db, "users", uid), {
    role: ROLES.INSTITUCION,
    estadoVerificacion: ESTADOS_VERIFICACION.APROBADO,
    nombreInstitucion,
    cargo,
    email,
    createdAt: serverTimestamp(),
  });

  await sendPasswordResetEmail(authPrincipal, email);

  return uid;
};