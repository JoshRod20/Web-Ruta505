import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { ESTADOS_VERIFICACION } from "../constants/roles";

/**
 * Trae todos los usuarios con estadoVerificacion === "pendiente"
 * (actor cultural e institución, ya que ambos usan ese campo).
 * Turista no aparece nunca aquí porque no tiene ese campo.
 *
 * @returns {Promise<Array>} lista de perfiles pendientes, cada uno
 *   con su `id` (uid) incluido junto a los demás campos del doc.
 */
export const obtenerSolicitudesPendientes = async () => {
  const usuariosRef = collection(db, "users");
  const q = query(
    usuariosRef,
    where("estadoVerificacion", "==", ESTADOS_VERIFICACION.PENDIENTE)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
};

/**
 * Aprueba o rechaza una solicitud, actualizando estadoVerificacion.
 * @param {string} uid
 * @param {"aprobado" | "rechazado"} nuevoEstado
 */
export const actualizarEstadoVerificacion = async (uid, nuevoEstado) => {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, { estadoVerificacion: nuevoEstado });
};