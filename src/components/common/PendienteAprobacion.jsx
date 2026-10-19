import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROLES, ESTADOS_VERIFICACION } from "../../constants/roles";
import LogoutButton from "./LogoutButton";

// Pantalla intermedia del flujo de verificación de Ruta 505.
// Si INTUR aprueba la cuenta, este bloque redirige a la zona correcta.
const PendienteAprobacion = () => {
  const { profile, estadoVerificacion, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Al pasar a APROBADO, el origen de la navegación depende del rol.
    if (estadoVerificacion === ESTADOS_VERIFICACION.APROBADO) {
      navigate(role === ROLES.INSTITUCION ? "/panel-intur" : "/home", {
        replace: true,
      });
    }
  }, [estadoVerificacion, role, navigate]);

  return (
    <div className="registro-page">
      <div className="registro-shell">
        <div className="registro-header">
          <h1 className="registro-header__title">Tu cuenta está en revisión</h1>
          <p className="registro-header__subtitle">
            {profile?.role === ROLES.INSTITUCION
              ? "INTUR debe validar manualmente tu acceso institucional antes de que puedas entrar al panel."
              : "INTUR está revisando tu perfil. Te notificaremos por correo cuando sea aprobado."}
          </p>
        </div>

        <div className="registro-card">
          {/* Mensaje heredado del flujo de revisión del proyecto. */}
          <p>
            Mientras tanto, puedes seguir explorando Ruta 505 como visitante,
            pero no podrás publicar contenido hasta que tu cuenta sea
            verificada.
          </p>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
};

export default PendienteAprobacion;