import { Navigate } from 'react-router-dom';
import { ROUTE_PATHS } from '../constants/routePaths';
import WelcomePage from '../pages/welcome/WelcomePage';
import LoginPage from '../pages/auth/LoginPage';
import HomePage from '../pages/home/HomePage';
import InventoryPage from '../pages/inventory/InventoryPage';
import GuestRoute from './GuestRoute';
import ProtectedLayout from './ProtectedLayout';

const appRoutes = [
  { path: ROUTE_PATHS.welcome, element: <GuestRoute><WelcomePage /></GuestRoute> },
  { path: ROUTE_PATHS.login, element: <GuestRoute><LoginPage /></GuestRoute> },

  // Pantallas internas: comparten el sidebar
  {
    element: <ProtectedLayout />,
    children: [
      { path: ROUTE_PATHS.home, element: <HomePage /> },
      { path: ROUTE_PATHS.inventory, element: <InventoryPage /> },
      // Provisional: reemplazar por la pantalla real
      { path: ROUTE_PATHS.actors, element: <h1 className="home__title">Actores</h1> },
    ],
  },

  { path: '*', element: <Navigate to={ROUTE_PATHS.welcome} replace /> },
];

export default appRoutes;