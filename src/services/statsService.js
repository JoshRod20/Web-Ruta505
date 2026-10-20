import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from './firebaseConfig';
import {
  COLLECTIONS,
  USER_FIELDS,
  USER_ROLES,
  ROUTE_FIELDS,
  ROUTE_STATUS,
} from '../constants/firestoreSchema';

// Pon true para ver en consola cómo se calcularon los municipios.
const DEBUG_MUNICIPALITIES = true;

const MUNICIPALITY_KEY = /municip/i;

// "León", "leon" y " LEÓN " cuentan como el mismo municipio.
const normalize = (text) =>
  text.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const isPlainObject = (value) =>
  value !== null &&
  typeof value === 'object' &&
  !Array.isArray(value) &&
  typeof value.toDate !== 'function'; // excluye Timestamps

// Busca en el documento cualquier campo cuyo nombre contenga "municip",
// a cualquier profundidad (por ejemplo `ubicacion.municipio`).
function deepFindMunicipality(data, path = '', depth = 0) {
  if (!isPlainObject(data) || depth > 3) return null;

  for (const [key, child] of Object.entries(data)) {
    const childPath = path ? `${path}.${key}` : key;

    if (MUNICIPALITY_KEY.test(key)) {
      if (typeof child === 'string' && child.trim()) {
        return { path: childPath, value: child.trim() };
      }
      // Por si el municipio es un objeto con el nombre dentro
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
function readMunicipality(doc) {
  for (const field of USER_FIELDS.municipality) {
    const value = doc.get(field);
    if (typeof value === 'string' && value.trim()) {
      return { path: field, value: value.trim() };
    }
  }
  return deepFindMunicipality(doc.data());
}

// Lista las rutas de campos de un documento (para el diagnóstico).
function listFieldPaths(data, path = '', depth = 0, out = []) {
  if (!isPlainObject(data) || depth > 3) return out;
  Object.entries(data).forEach(([key, child]) => {
    const childPath = path ? `${path}.${key}` : key;
    out.push(childPath);
    listFieldPaths(child, childPath, depth + 1, out);
  });
  return out;
}

/**
 * Se suscribe a los datos de las tarjetas y llama a `onChange` cada vez que
 * algo cambia en Firestore:
 *   onChange({ stats, loading, failed, errors })
 * Devuelve una función para cancelar las suscripciones.
 */
export function subscribeDashboardStats(onChange) {
  const state = {
    stats: { tourists: null, culturalActors: null, routes: null, municipalities: null },
    pending: new Set(['users', 'routes']), // fuentes que aún no responden por primera vez
    errors: {}, // fuente -> mensaje
  };

  const publish = () =>
    onChange({
      stats: { ...state.stats },
      loading: state.pending.size > 0,
      failed: Object.keys(state.errors).length > 0,
      errors: Object.entries(state.errors).map(([source, message]) => `${source}: ${message}`),
    });

  const fail = (source) => (error) => {
    console.error(`[stats:${source}]`, error);
    state.errors[source] = error?.code ?? error?.message ?? 'error desconocido';
    state.pending.delete(source);
    publish();
  };

  // Ejecuta el cálculo de una fuente y reporta cualquier excepción en lugar de perderla.
  const safely = (source, compute) => (snap) => {
    try {
      compute(snap);
      delete state.errors[source];
      state.pending.delete(source);
      publish();
    } catch (error) {
      fail(source)(error);
    }
  };

  // Todas las cuentas: turistas y actores se cuentan por rol, y los municipios
  // salen de cualquier cuenta que tenga el campo.
  const unsubscribeUsers = onSnapshot(
    collection(db, COLLECTIONS.users),
    safely('users', (snap) => {
      let tourists = 0;
      let actors = 0;
      const municipalities = new Map(); // clave normalizada -> texto original
      const withoutMunicipality = [];
      const sourcePaths = {}; // de qué campo salió cada municipio
      const missingFields = {}; // campos que tienen las cuentas sin municipio

      snap.forEach((doc) => {
        const role = doc.get(USER_FIELDS.role);
        if (role === USER_ROLES.tourist) tourists += 1;
        if (role === USER_ROLES.culturalActor) actors += 1;

        const found = readMunicipality(doc);
        if (found) {
          const key = normalize(found.value);
          if (!municipalities.has(key)) municipalities.set(key, found.value);
          sourcePaths[found.path] = (sourcePaths[found.path] ?? 0) + 1;
        } else {
          withoutMunicipality.push({ id: doc.id, role });
          listFieldPaths(doc.data()).forEach((p) => {
            missingFields[p] = (missingFields[p] ?? 0) + 1;
          });
        }
      });

      if (DEBUG_MUNICIPALITIES) {
        console.groupCollapsed(`[stats] ${snap.size} cuentas, ${municipalities.size} municipios distintos`);
        console.log('Municipios:', [...municipalities.values()]);
        console.log('Campo de origen (cuentas por campo):', sourcePaths);
        console.log(`Cuentas sin municipio (${withoutMunicipality.length}):`, withoutMunicipality);
        console.log('Campos que tienen esas cuentas:', missingFields);
        console.groupEnd();
      }

      state.stats.tourists = tourists;
      state.stats.culturalActors = actors;
      state.stats.municipalities = municipalities.size;
    }),
    fail('users')
  );

  // Rutas creativas activas (publicadas).
  const routesQuery = query(
    collection(db, COLLECTIONS.creativeRoutes),
    where(ROUTE_FIELDS.status, '==', ROUTE_STATUS.active)
  );

  const unsubscribeRoutes = onSnapshot(
    routesQuery,
    safely('routes', (snap) => {
      state.stats.routes = snap.size;
    }),
    fail('routes')
  );

  return () => {
    unsubscribeUsers();
    unsubscribeRoutes();
  };
}