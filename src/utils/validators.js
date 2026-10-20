// Devuelve un mensaje de error, o null si los datos son válidos.
export function validateLogin({ identifier, password }) {
  if (!identifier.trim()) return 'Ingresa tu nombre de usuario o correo.';
  if (!password) return 'Ingresa tu contraseña.';
  return null;
}