// Nombres de colecciones y campos de Firestore que usa la web.
// Si algo se renombra en la base de datos, se cambia solo aquí.

export const COLLECTIONS = {
  users: 'users',
  creativeRoutes: 'rutas_creativas',
};

export const USER_ROLES = {
  tourist: 'turista',
  culturalActor: 'actor-cultural',
};

export const USER_FIELDS = {
  role: 'role',
  // Se prueban en orden; si ninguno tiene valor, statsService busca
  // automáticamente cualquier campo que contenga "municip".
  municipality: ['municipio', 'ubicacion.municipio'],
};

export const ROUTE_FIELDS = {
  status: 'estado',
};

export const ROUTE_STATUS = {
  active: 'publicada', // las demás son: borrador, en_espera y cancelada
};