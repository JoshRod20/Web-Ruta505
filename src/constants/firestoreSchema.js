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

// Valores de `estadoVerificacion` en users/{uid}
export const VERIFICATION_STATUS = {
  pending: 'pendiente',
  approved: 'aprobado',
  rejected: 'rechazado',
};

export const USER_FIELDS = {
  role: 'role',
  // Se prueban en orden; si ninguno tiene valor, userFields.js busca
  // automáticamente cualquier campo que contenga "municip".
  municipality: ['municipio', 'ubicacion.municipio'],
  tourismCategory: ['tipoTurismo'], // categoría de turismo que ofrece el actor
  actorType: ['tipoActor'], // tipo de actor (artesano, guía, etc.)
  createdAt: 'createdAt', // fecha de registro (Timestamp)

  // Perfil del actor cultural (gestión de perfiles)
  fullName: ['nombreCompleto', 'nombre'],
  department: ['departamento'],
  phone: ['telefono'],
  description: ['descripcion'],
  verificationStatus: 'estadoVerificacion',
};

export const ROUTE_FIELDS = {
  status: 'estado',
};

export const ROUTE_STATUS = {
  active: 'publicada', // las demás son: borrador, en_espera y cancelada
};