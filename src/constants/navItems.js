import { ROUTE_PATHS } from './routePaths';
import { canManageProfiles } from '../utils/permissions';
import homeIcon from '../assets/images/icon-home.png';
import inventoryIcon from '../assets/images/icon-inventory.png';
import profilesIcon from '../assets/images/icon-profiles.png';
import actorsIcon from '../assets/images/icon-actors.png';
import logoutIcon from '../assets/images/icon-logout.png';

// Para agregar una opción al menú, se añade una línea aquí.
// `allowed` (opcional): función que recibe al usuario; si no existe, la ve todo el mundo.
export const NAV_ITEMS = [
  { label: 'Inicio', path: ROUTE_PATHS.home, icon: homeIcon },
  { label: 'Inventario', path: ROUTE_PATHS.inventory, icon: inventoryIcon },
  { label: 'Gestión de perfiles', path: ROUTE_PATHS.profiles, icon: profilesIcon, allowed: canManageProfiles },
  { label: 'Actores', path: ROUTE_PATHS.actors, icon: actorsIcon },
];

export const LOGOUT_ICON = logoutIcon;