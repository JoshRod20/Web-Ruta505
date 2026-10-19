import { useAuth } from "../context/AuthContext";
import { tienePermiso } from "../constants/permissions";

/**
 * Hook de permisos: envuelve el `role` que ya expone AuthContext
 * (leído de users/{uid} en Firestore) y da una función `puede(permiso)`
 * para usar en cualquier componente compartido.
 *
 * Uso:
 *   const { puede } = usePermisos();
 *   {puede(PERMISOS.PUBLICAR_EXPERIENCIA) && <BotonPublicar />}
 */
export function usePermisos() {
  const { role, estadoVerificacion } = useAuth();

  const puede = (permiso) => tienePermiso(role, permiso);

  return { role, estadoVerificacion, puede };
}