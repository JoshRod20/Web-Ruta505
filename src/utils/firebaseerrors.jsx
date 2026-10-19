/**
 * Traduce un código de error de Firebase Auth (err.code) a un mensaje
 * legible en español. Si el código no está mapeado, devuelve un mensaje
 * genérico en vez de mostrar el texto técnico de Firebase.
 */
export const mapFirebaseError = (code) => {
  switch (code) {
    case "auth/invalid-email":
      return "El correo electrónico no es válido.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Correo o contraseña incorrectos.";
    case "auth/email-already-in-use":
      return "Ya existe una cuenta con este correo.";
    case "auth/weak-password":
      return "La contraseña debe tener al menos 6 caracteres.";
    case "auth/popup-closed-by-user":
      return "Cerraste la ventana antes de completar el acceso.";
    case "auth/too-many-requests":
      return "Demasiados intentos. Espera unos minutos e inténtalo de nuevo.";
    case "auth/network-request-failed":
      return "Problema de conexión. Revisa tu internet e inténtalo de nuevo.";
    case "permission-denied":
      return "Firebase rechazó el guardado por permisos. Revisa las reglas de Firestore.";
    case "unauthenticated":
      return "Tu sesión no está autenticada para guardar este documento.";
    case "unavailable":
      return "Firestore no está disponible en este momento. Inténtalo de nuevo.";
    case "failed-precondition":
      return "Firestore no pudo completar el guardado por una condición previa faltante.";
    default:
      return "Ocurrió un error. Inténtalo de nuevo.";
  }
};