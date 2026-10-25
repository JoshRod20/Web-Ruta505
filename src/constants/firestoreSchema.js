// Nombres de colecciones y campos de Firestore que usa la web.
// Si algo se renombra en la base de datos, se cambia solo aquí.

export const COLLECTIONS = {
  users: 'users',
  creativeRoutes: 'rutas_creativas',
  inventory: 'inventario',
};

export const USER_ROLES = {
  tourist: 'turista',
  culturalActor: 'actor-cultural',
};

export const USER_FIELDS = {
  role: 'role',
  // Se prueban en orden; si ninguno tiene valor, userFields.js busca
  // automáticamente cualquier campo que contenga "municip".
  municipality: ['municipio', 'ubicacion.municipio'],
  tourismCategory: ['tipoTurismo'], // categoría de turismo que ofrece el actor
  actorType: ['tipoActor'], // tipo de actor (emprendedor, etc.)
  createdAt: 'createdAt', // fecha de registro (Timestamp)
};

export const ROUTE_FIELDS = {
  status: 'estado',
};

export const ROUTE_STATUS = {
  active: 'publicada', // las demás son: borrador, en_espera y cancelada
};