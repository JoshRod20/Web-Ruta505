import { isMainAdmin, isAdmin } from './permissions';

export const getDisplayName = (user) =>
  user?.nombreCompleto ?? user?.nombre ?? user?.name ?? user?.email ?? '';

// esAdminPrincipal -> "Administrador" | role "institucion" -> "INTUR"
export function getRoleLabel(user) {
  if (isMainAdmin(user)) return 'Administrador';
  if (isAdmin(user)) return 'INTUR';
  return '';
}