import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Guard genérico de rutas que toma su estado desde AuthContext.
 *
 * Uso:
 *   <RequireAuth roles={["turista"]}>...</RequireAuth>
 *   <RequireAuth roles={["actor-cultural"]} estados={["aprobado"]}>...</RequireAuth>
 *   <RequireAuth roles={["institucion"]} estados={["aprobado"]}>...</RequireAuth>
 *
 * Si no se pasa `estados`, cualquier estado de verificación es válido
 * (útil para rutas donde el actor cultural puede entrar aunque esté pendiente,
 * como su propio Home con banner de "en revisión").
 */
const RequireAuth = ({ roles, estados, children }) => {
  const { isLoggedIn, loadingAuth, role, estadoVerificacion } = useAuth();
  const location = useLocation();

  if (loadingAuth) {
    return null; // o un spinner de carga, según tu UI
  }

  // Si no hay sesión, volvemos al login y guardamos desde dónde venía.
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // El rol permitido viene del catálogo de roles del proyecto.
  if (roles && !roles.includes(role)) {
    return <Navigate to="/home" replace />;
  }

  // Algunos flujos exigen estado de verificación aprobado antes de entrar.
  if (estados && !estados.includes(estadoVerificacion)) {
    return <Navigate to="/pendiente-aprobacion" replace />;
  }

  return children;
};

export default RequireAuth;