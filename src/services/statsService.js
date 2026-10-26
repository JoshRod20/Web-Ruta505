import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from './firebaseConfig';
import {
  COLLECTIONS,
  USER_FIELDS,
  USER_ROLES,
  ROUTE_FIELDS,
  ROUTE_STATUS,
} from '../constants/firestoreSchema';
import { MONTHS_TO_SHOW, MAX_PIE_SLICES } from '../constants/chartConfig';
import { listFieldPaths, readDate, readFirstText, readMunicipality } from '../utils/userFields';
import {
  capitalize,
  countByLabel,
  countByMonth,
  limitWithOthers,
  normalizeKey,
} from '../utils/chartData';

// Pon true para ver en consola cómo se calcularon los municipios.
const DEBUG_MUNICIPALITIES = true;

const EMPTY_CHARTS = { category: [], actorType: [], monthly: [], municipality: [] };

/**
 * Se suscribe a los datos del inicio y llama a `onChange` cada vez que algo
 * cambia en Firestore:
 *   onChange({ stats, charts, loading, failed, errors })
 * Devuelve una función para cancelar las suscripciones.
 */
export function subscribeDashboardStats(onChange) {
  const state = {
    stats: { tourists: null, culturalActors: null, routes: null, municipalities: null },
    charts: EMPTY_CHARTS,
    pending: new Set(['users', 'routes']), // fuentes que aún no responden por primera vez
    errors: {}, // fuente -> mensaje
  };

  const publish = () =>
    onChange({
      stats: { ...state.stats },
      charts: state.charts,
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

  // Una sola suscripción a `users` alimenta las tarjetas y los gráficos.
  const unsubscribeUsers = onSnapshot(
    collection(db, COLLECTIONS.users),
    safely('users', (snap) => {
      let tourists = 0;
      let actors = 0;
      const uniqueMunicipalities = new Map(); // clave normalizada -> texto original

      // Datos de los actores culturales para los gráficos
      const categories = [];
      const actorTypes = [];
      const actorMunicipalities = [];
      const registrationDates = [];

      // Diagnóstico
      const withoutMunicipality = [];
      const sourcePaths = {};
      const missingFields = {};

      snap.forEach((doc) => {
        const role = doc.get(USER_FIELDS.role);
        const municipality = readMunicipality(doc);

        if (role === USER_ROLES.tourist) tourists += 1;

        if (role === USER_ROLES.culturalActor) {
          actors += 1;
          categories.push(readFirstText(doc, USER_FIELDS.tourismCategory));
          actorTypes.push(readFirstText(doc, USER_FIELDS.actorType));
          actorMunicipalities.push(municipality?.value ?? null);
          registrationDates.push(readDate(doc, USER_FIELDS.createdAt));
        }

        if (municipality) {
          // Municipios de todas las cuentas, sin repetir
          const key = normalizeKey(municipality.value);
          if (!uniqueMunicipalities.has(key)) uniqueMunicipalities.set(key, municipality.value);
          sourcePaths[municipality.path] = (sourcePaths[municipality.path] ?? 0) + 1;
        } else {
          withoutMunicipality.push({ id: doc.id, role });
          listFieldPaths(doc.data()).forEach((p) => {
            missingFields[p] = (missingFields[p] ?? 0) + 1;
          });
        }
      });

      if (DEBUG_MUNICIPALITIES) {
        console.groupCollapsed(
          `[stats] ${snap.size} cuentas, ${uniqueMunicipalities.size} municipios distintos`
        );
        console.log('Municipios:', [...uniqueMunicipalities.values()]);
        console.log('Campo de origen (cuentas por campo):', sourcePaths);
        console.log(`Cuentas sin municipio (${withoutMunicipality.length}):`, withoutMunicipality);
        console.log('Campos que tienen esas cuentas:', missingFields);
        console.groupEnd();
      }

      state.stats.tourists = tourists;
      state.stats.culturalActors = actors;
      state.stats.municipalities = uniqueMunicipalities.size;

      state.charts = {
        category: countByLabel(categories, { emptyLabel: 'Sin categoría', format: capitalize }),
        actorType: countByLabel(actorTypes, { emptyLabel: 'Sin tipo', format: capitalize }),
        monthly: countByMonth(registrationDates, MONTHS_TO_SHOW),
        municipality: limitWithOthers(
          countByLabel(actorMunicipalities, { emptyLabel: 'Sin municipio' }),
          MAX_PIE_SLICES
        ),
      };
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