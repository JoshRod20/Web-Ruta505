import { USER_FIELDS } from '../constants/firestoreSchema';

const MUNICIPALITY_KEY = /municip/i;

const isPlainObject = (value) =>
  value !== null &&
  typeof value === 'object' &&
  !Array.isArray(value) &&
  typeof value.toDate !== 'function'; // excluye Timestamps

// Busca cualquier campo cuyo nombre contenga "municip", a cualquier profundidad.
function deepFindMunicipality(data, path = '', depth = 0) {
  if (!isPlainObject(data) || depth > 3) return null;

  for (const [key, child] of Object.entries(data)) {
    const childPath = path ? `${path}.${key}` : key;

    if (MUNICIPALITY_KEY.test(key)) {
      if (typeof child === 'string' && child.trim()) {
        return { path: childPath, value: child.trim() };
      }
      const nested = isPlainObject(child) ? (child.nombre ?? child.name) : null;
      if (typeof nested === 'string' && nested.trim()) {
        return { path: `${childPath}.nombre`, value: nested.trim() };
      }
    }

    const found = deepFindMunicipality(child, childPath, depth + 1);
    if (found) return found;
  }
  return null;
}

// Primero los campos configurados; si no hay, la búsqueda automática.
export function readMunicipality(doc) {
  for (const field of USER_FIELDS.municipality) {
    const value = doc.get(field);
    if (typeof value === 'string' && value.trim()) {
      return { path: field, value: value.trim() };
    }
  }
  return deepFindMunicipality(doc.data());
}

// Devuelve el primer campo de texto con valor, o null.
export function readFirstText(doc, fields) {
  for (const field of fields) {
    const value = doc.get(field);
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return null;
}

// Convierte un Timestamp de Firestore en Date (o null si no existe).
export function readDate(doc, field) {
  const value = doc.get(field);
  if (value && typeof value.toDate === 'function') return value.toDate();
  return value instanceof Date ? value : null;
}

// Lista las rutas de campos de un documento (para el diagnóstico).
export function listFieldPaths(data, path = '', depth = 0, out = []) {
  if (!isPlainObject(data) || depth > 3) return out;
  Object.entries(data).forEach(([key, child]) => {
    const childPath = path ? `${path}.${key}` : key;
    out.push(childPath);
    listFieldPaths(child, childPath, depth + 1, out);
  });
  return out;
}