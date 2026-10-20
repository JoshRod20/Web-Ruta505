// La web es solo para administradores.
// `esAdminPrincipal` no es un rol: es un campo aparte del perfil (ver utils/permissions.js).
export const ROLES = {
  admin: 'institucion',
};

// Tipos de cuenta de la app móvil. Se usan solo para las estadísticas.
export const ACCOUNT_TYPES = {
  tourist: 'turista',
  culturalActor: 'actor-cultural',
};