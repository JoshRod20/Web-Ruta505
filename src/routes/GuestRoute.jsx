import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { ROUTE_PATHS } from '../constants/routePaths';

export default function GuestRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;
  return user ? <Navigate to={ROUTE_PATHS.home} replace /> : children;
}