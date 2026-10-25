import { INVENTORY_FIELDS, STATUS_OPTIONS } from '../constants/inventory';

// Devuelve un mensaje de error, o null si los datos son válidos.
export function validateLogin({ identifier, password }) {
  if (!identifier.trim()) return 'Ingresa tu nombre de usuario o correo.';
  if (!password) return 'Ingresa tu contraseña.';
  return null;
}

// Devuelve { campo: mensaje } con los errores; vacío si todo es válido.
// Los valores deben venir ya limpios (ver cleanText).
export function validateInventoryFields(values, { withStatus = false } = {}) {
  const errors = {};

  INVENTORY_FIELDS.forEach(({ key, label, maxLength }) => {
    const value = values[key] ?? '';
    if (!value) errors[key] = `El campo «${label}» es obligatorio.`;
    else if (value.length > maxLength) {
      errors[key] = `El campo «${label}» no puede superar ${maxLength} caracteres.`;
    }
  });

  if (withStatus && !STATUS_OPTIONS.some(({ value }) => value === values.estado)) {
    errors.estado = 'Selecciona un estado válido.';
  }

  return errors;
}