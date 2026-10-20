import { ROUTE_PATHS } from './routePaths';
import homeIcon from '../assets/images/icon-home.png';
import inventoryIcon from '../assets/images/icon-inventory.png';
import actorsIcon from '../assets/images/icon-actors.png';
import logoutIcon from '../assets/images/icon-logout.png';

// Para agregar una opción al menú, se añade una línea aquí.
export const NAV_ITEMS = [
  { label: 'Inicio', path: ROUTE_PATHS.home, icon: homeIcon },
  { label: 'Inventario', path: ROUTE_PATHS.inventory, icon: inventoryIcon },
  { label: 'Actores', path: ROUTE_PATHS.actors, icon: actorsIcon },
];

export const LOGOUT_ICON = logoutIcon;