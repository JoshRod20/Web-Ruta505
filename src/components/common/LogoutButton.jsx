import { useAuth } from "../../context/AuthContext";

/**
 * Botón reutilizable de cerrar sesión.
 * No necesita navegar manualmente: al cambiar isLoggedIn a false,
 * RequireAuth redirige solo a /login en el siguiente render.
 */
const LogoutButton = ({ className = "registro-submit" }) => {
  const { logout } = useAuth();

  return (
    <button type="button" className={className} onClick={logout}>
      Cerrar sesión
    </button>
  );
};

export default LogoutButton;