import { ROLES } from '../constants/roles';

// Administrador principal: acceso total.
export const isMainAdmin = (profile) => profile?.esAdminPrincipal === true;

// Admin: acceso a funciones limitadas.
export const isAdmin = (profile) => profile?.role === ROLES.admin;

// Quién puede entrar a la plataforma web.
// Coincide con `esModerador()` de las reglas de Firestore.
export const canAccessWeb = (profile) => isMainAdmin(profile) || isAdmin(profile);

/**
 * Permisos por función. El admin principal puede todo; el Admin solo lo que
 * esté marcado aquí. Cuando definas sus funciones limitadas, cambia el
 * valor a `true` o agrega más permisos.
 */
const ADMIN_PERMISSIONS = {
  // Ejemplos (ajusta a tu gusto):
  // 'verificar-actores': true,
  // 'moderar-contenido': true,
  // 'gestionar-admins': false,
};

export function can(profile, permission) {
  if (isMainAdmin(profile)) return true;
  if (isAdmin(profile)) return ADMIN_PERMISSIONS[permission] === true;
  return false;
}