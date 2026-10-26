import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { ROUTE_PATHS } from '../constants/routePaths';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null; // aquí puedes poner un spinner
  return user ? children : <Navigate to={ROUTE_PATHS.login} replace />;
}