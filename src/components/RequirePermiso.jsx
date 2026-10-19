import { usePermisos } from "../../hooks/usePermisos";

/**
 * Guard a nivel de UI (no de ruta). RequireAuth.jsx ya protege páginas
 * completas por rol; este componente es para el caso de un componente
 * COMPARTIDO por varios roles (Navbar, tarjetas de experiencia, etc.)
 * donde solo una parte de lo que se renderiza depende del permiso,
 * no la página entera.
 *
 * Uso:
 *   <RequirePermiso permiso={PERMISOS.PUBLICAR_EXPERIENCIA}>
 *     <button onClick={irAPublicar}>Publicar experiencia</button>
 *   </RequirePermiso>
 *
 * Con fallback opcional (ej. mostrar un candado o un mensaje en vez
 * de simplemente ocultar):
 *   <RequirePermiso permiso={PERMISOS.MODERAR_CONTENIDO} fallback={<Candado />}>
 */
const RequirePermiso = ({ permiso, children, fallback = null }) => {
  const { puede } = usePermisos();
  return puede(permiso) ? children : fallback;
};

export default RequirePermiso;