// src/services/gestionCuentas.js
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { DIAS_GRACIA_ELIMINACION } from "../constants/permisosIntur";

const COLECCION_USUARIOS = "users";

// Trae todas las cuentas registradas (cualquier rol), para la vista
// "Cuentas registradas" del panel. Las Firestore rules ya restringen
// quién puede leer la colección completa (admin o institución con
// acceso CRUD vigente); no dupliques ese chequeo aquí, solo úsalo
// desde una vista ya protegida por usePermisosIntur().
export async function obtenerTodasLasCuentas() {
  const snap = await getDocs(collection(db, COLECCION_USUARIOS));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// Otorga acceso CRUD temporal a una cuenta de institución.
// Las rules rechazan esta escritura si quien la ejecuta no es
// esAdminPrincipal.
export async function otorgarAccesoCrud(uidCuenta, uidAdmin) {
  const ref = doc(db, COLECCION_USUARIOS, uidCuenta);
  await updateDoc(ref, {
    "accesoCrud.habilitado": true,
    "accesoCrud.habilitadoPor": uidAdmin,
    "accesoCrud.habilitadoEn": serverTimestamp(),
  });
}

// Revoca el acceso CRUD temporal. Solo el admin puede ejecutarlo
// (validado en las rules).
export async function revocarAccesoCrud(uidCuenta) {
  const ref = doc(db, COLECCION_USUARIOS, uidCuenta);
  await updateDoc(ref, {
    "accesoCrud.habilitado": false,
  });
}

// Marca una cuenta para eliminación e inicia el periodo de gracia.
// Puede ejecutarlo el admin o una institución con acceso CRUD vigente
// (dentro de horario laboral); las rules validan ambos casos.
export async function solicitarEliminacionCuenta(uidCuenta, uidSolicitante) {
  const ejecutarEn = new Date();
  ejecutarEn.setDate(ejecutarEn.getDate() + DIAS_GRACIA_ELIMINACION);

  const ref = doc(db, COLECCION_USUARIOS, uidCuenta);
  await updateDoc(ref, {
    "eliminacion.solicitada": true,
    "eliminacion.solicitadaPor": uidSolicitante,
    "eliminacion.solicitadaEn": serverTimestamp(),
    "eliminacion.ejecutarEn": Timestamp.fromDate(ejecutarEn),
    cuentaActiva: false,
  });
}

// Cancela una eliminación pendiente y reactiva la cuenta.
export async function cancelarEliminacionCuenta(uidCuenta) {
  const ref = doc(db, COLECCION_USUARIOS, uidCuenta);
  await updateDoc(ref, {
    "eliminacion.solicitada": false,
    "eliminacion.solicitadaPor": null,
    "eliminacion.solicitadaEn": null,
    "eliminacion.ejecutarEn": null,
    cuentaActiva: true,
  });
}

// Días restantes antes de que se cumpla el plazo de 30 días.
// Puramente informativo: no hay borrado automático todavía.
export function diasRestantesParaEliminacion(timestampEjecutarEn) {
  if (!timestampEjecutarEn) return null;
  const fechaEjecucion = timestampEjecutarEn.toDate
    ? timestampEjecutarEn.toDate()
    : new Date(timestampEjecutarEn);
  const diffMs = fechaEjecucion.getTime() - Date.now();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}