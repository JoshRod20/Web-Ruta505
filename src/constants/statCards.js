import touristsIcon from '../assets/images/icon-tourists.png';
import actorsIcon from '../assets/images/icon-actors.png';
import routesIcon from '../assets/images/icon-routes.png';
import municipalitiesIcon from '../assets/images/icon-municipalities.png';

// `key` coincide con las claves que devuelve getDashboardStats().
export const STAT_CARDS = [
  { key: 'tourists', label: 'Turistas', icon: touristsIcon, color: 'var(--r505-orange)' },
  { key: 'culturalActors', label: 'Actores Culturales', icon: actorsIcon, color: 'var(--r505-green-dark)' },
  { key: 'routes', label: 'Rutas Creativas', icon: routesIcon, color: 'var(--r505-blue)' },
  { key: 'municipalities', label: 'Municipios', icon: municipalitiesIcon, color: 'var(--r505-green-lime)' },
];