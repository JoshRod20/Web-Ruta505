// Error propio de la app: su mensaje ya es apto para mostrarse al usuario.
export class AppError extends Error {}

const FIREBASE_MESSAGES = {
  'auth/invalid-credential': 'Usuario o contraseña incorrectos.',
  'auth/wrong-password': 'Usuario o contraseña incorrectos.',
  'auth/user-not-found': 'Usuario o contraseña incorrectos.',
  'auth/invalid-email': 'El correo no tiene un formato válido.',
  'auth/user-disabled': 'Esta cuenta está deshabilitada.',
  'auth/too-many-requests': 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.',
  'auth/network-request-failed': 'Sin conexión. Revisa tu internet e inténtalo de nuevo.',
  'permission-denied': 'No tienes permisos para acceder a esta información.',
};

export function mapAuthError(error) {
  if (error instanceof AppError) return error.message;
  return FIREBASE_MESSAGES[error?.code] ?? 'No pudimos iniciar sesión. Intenta de nuevo.';
}