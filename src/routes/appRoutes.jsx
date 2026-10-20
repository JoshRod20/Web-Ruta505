import { Navigate } from 'react-router-dom';
import { ROUTE_PATHS } from '../constants/routePaths';
import WelcomePage from '../pages/welcome/WelcomePage';
import LoginPage from '../pages/auth/LoginPage';

// Lista de rutas de la app. Para agregar una pantalla, se añade una línea aquí.
const appRoutes = [
  { path: ROUTE_PATHS.welcome, element: <WelcomePage /> },
  { path: ROUTE_PATHS.login, element: <LoginPage /> },
  // Placeholder: reemplazar cuando exista la pantalla de inicio
  { path: ROUTE_PATHS.home, element: <h1 className="p-4">Inicio</h1> },
  { path: '*', element: <Navigate to={ROUTE_PATHS.welcome} replace /> },
];

export default appRoutes;