const MESSAGES = {
  'permission-denied': 'No tienes permisos para realizar esta acción.',
  unavailable: 'Sin conexión. Revisa tu internet e inténtalo de nuevo.',
  'deadline-exceeded': 'La operación tardó demasiado. Inténtalo de nuevo.',
  'resource-exhausted': 'Se alcanzó el límite de uso de Firebase. Inténtalo más tarde.',
};

export const mapFirestoreError = (error) =>
  MESSAGES[error?.code] ?? 'No pudimos completar la acción. Intenta de nuevo.';