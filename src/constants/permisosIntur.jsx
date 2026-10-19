// src/constants/permisosIntur.js
// Reglas de acceso temporal para cuentas de institución dentro del panel INTUR.

// Horario laboral en el que una cuenta con acceso CRUD temporal puede operar.
// Hora local de Nicaragua (America/Managua, UTC-6, sin horario de verano).
export const HORARIO_LABORAL = {
  HORA_INICIO: 8, // 8:00 am
  HORA_FIN: 17, // 5:00 pm (exclusivo)
  OFFSET_UTC_HORAS: -6,
};

// Días de gracia antes de que una cuenta marcada para eliminación
// se considere lista para borrado definitivo (borrado manual por ahora).
export const DIAS_GRACIA_ELIMINACION = 30;