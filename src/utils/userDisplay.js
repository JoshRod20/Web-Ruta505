import { isMainAdmin, isAdmin } from './permissions';

// Ajusta los campos al nombre que guardes en users/{uid}
export const getDisplayName = (user) => user?.nombre ?? user?.name ?? user?.email ?? '';

export function getRoleLabel(user) {
  if (isMainAdmin(user)) return 'Administrador principal';
  if (isAdmin(user)) return 'Administrador';
  return '';
}