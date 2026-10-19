// src/hooks/usePermisosIntur.js
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import { dentroDeHorarioLaboral } from "../utils/horarioLaboral";

// Resuelve los permisos de la cuenta actual dentro del panel INTUR:
// - esAdmin: acceso total, sin restricción de horario.
// - accesoCrudHabilitado: la cuenta tiene el toggle activado por el admin
//   (independiente de si es horario laboral o no).
// - dentroDeHorario: chequeo de UI, informativo.
// - puedeGestionar: true si puede ejecutar acciones de CRUD ahora mismo
//   (esAdmin, o accesoCrudHabilitado + dentro de horario).
//
// Este hook solo controla la UI. La validación real y obligatoria vive
// en las Firestore Security Rules.
export function usePermisosIntur() {
  const { user } = useAuth();
  const [datosCuenta, setDatosCuenta] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!user) {
      setDatosCuenta(null);
      setCargando(false);
      return;
    }
    const ref = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(ref, (snap) => {
      setDatosCuenta(snap.exists() ? snap.data() : null);
      setCargando(false);
    });
    return () => unsubscribe();
  }, [user]);

  const esAdmin = datosCuenta?.esAdminPrincipal === true;
  const accesoCrudHabilitado = datosCuenta?.accesoCrud?.habilitado === true;
  const dentroDeHorario = dentroDeHorarioLaboral();
  const puedeGestionar = esAdmin || (accesoCrudHabilitado && dentroDeHorario);

  return {
    cargando,
    esAdmin,
    accesoCrudHabilitado,
    dentroDeHorario,
    puedeGestionar,
  };
}