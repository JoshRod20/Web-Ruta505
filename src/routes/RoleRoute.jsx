import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { ROUTE_PATHS } from '../constants/routePaths';

// Deja pasar solo a quien cumpla `allowed`; los demás vuelven a Inicio.
// Va dentro de ProtectedLayout, así que el usuario ya está cargado.
export default function RoleRoute({ allowed, children }) {
  const { user } = useAuth();
  return allowed(user) ? children : <Navigate to={ROUTE_PATHS.home} replace />;
}