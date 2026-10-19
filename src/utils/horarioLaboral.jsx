// src/utils/horarioLaboral.js
import { HORARIO_LABORAL } from "../constants/permisosIntur";

// Hora actual en Nicaragua (UTC-6 fijo, sin horario de verano), calculada
// a partir de la hora UTC del navegador. No depende del huso horario
// configurado en el dispositivo del usuario.
export function horaActualNicaragua() {
  const ahoraUTC = new Date();
  let hora = ahoraUTC.getUTCHours() + HORARIO_LABORAL.OFFSET_UTC_HORAS;
  if (hora < 0) hora += 24;
  return hora;
}

// Chequeo del lado del cliente: solo sirve para mostrar/ocultar botones.
// La validación obligatoria vive en las Firestore Security Rules, que usan
// request.time del servidor y no pueden manipularse cambiando la hora
// del dispositivo.
export function dentroDeHorarioLaboral() {
  const hora = horaActualNicaragua();
  return hora >= HORARIO_LABORAL.HORA_INICIO && hora < HORARIO_LABORAL.HORA_FIN;
}