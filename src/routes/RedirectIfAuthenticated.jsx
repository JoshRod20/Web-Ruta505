import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Protege rutas públicas tomadas del flujo de acceso del proyecto:
 * login, onboarding, selección de tipo y formularios de registro.
 * Si ya hay sesión iniciada, la UI se va directo a /home.
 */
const RedirectIfAuthenticated = ({ children }) => {
  const { isLoggedIn, loadingAuth } = useAuth();

  if (loadingAuth) {
    return null;
  }

  if (isLoggedIn) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default RedirectIfAuthenticated;