// src/components/intur/GestionCuentas.jsx
import { useEffect, useState } from "react";
import {
  obtenerTodasLasCuentas,
  otorgarAccesoCrud,
  revocarAccesoCrud,
  solicitarEliminacionCuenta,
  cancelarEliminacionCuenta,
  diasRestantesParaEliminacion,
} from "../../services/gestionCuentas";
import { usePermisosIntur } from "../../hooks/usePermisosIntur";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../constants/roles";
import "../../styles/GestionCuentas.css";

const ETIQUETA_ROL = {
  [ROLES.TURISTA]: "Turista",
  [ROLES.ACTOR_CULTURAL]: "Actor cultural",
  [ROLES.INSTITUCION]: "Institución",
};

const GestionCuentas = () => {
  const { user } = useAuth();
  const { esAdmin, puedeGestionar, dentroDeHorario, accesoCrudHabilitado } =
    usePermisosIntur();

  const [cuentas, setCuentas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [procesandoId, setProcesandoId] = useState(null);

  const cargarCuentas = async () => {
    setCargando(true);
    setError("");
    try {
      const datos = await obtenerTodasLasCuentas();
      setCuentas(datos);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las cuentas registradas.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (puedeGestionar) cargarCuentas();
  }, [puedeGestionar]);

  const ejecutar = async (uid, accion) => {
    setProcesandoId(uid);
    setError("");
    try {
      await accion();
      await cargarCuentas();
    } catch (err) {
      console.error(err);
      setError(
        "No se pudo completar la acción. Verifica tus permisos y el horario laboral."
      );
    } finally {
      setProcesandoId(null);
    }
  };

  if (!puedeGestionar) {
    return (
      <div className="gestion-cuentas-bloqueado">
        <p>
          No tienes acceso a la gestión de cuentas en este momento.
          {!esAdmin && !accesoCrudHabilitado &&
            " Tu cuenta no tiene acceso CRUD temporal habilitado por el administrador."}
          {!esAdmin && accesoCrudHabilitado && !dentroDeHorario &&
            " Tu acceso CRUD temporal solo funciona en horario laboral (8:00 am – 5:00 pm)."}
        </p>
      </div>
    );
  }

  return (
    <div className="gestion-cuentas">
      {error && <p className="panel-intur-error">{error}</p>}

      {cargando ? (
        <p className="panel-intur-mensaje">Cargando cuentas...</p>
      ) : (
        <div className="gestion-cuentas-lista">
          {cuentas.map((cuenta) => {
            const esUno = cuenta.id === user?.uid;
            const diasRestantes = cuenta.eliminacion?.solicitada
              ? diasRestantesParaEliminacion(cuenta.eliminacion.ejecutarEn)
              : null;

            return (
              <div key={cuenta.id} className="gestion-cuentas-card">
                <div className="gestion-cuentas-info">
                  <p className="gestion-cuentas-nombre">
                    {cuenta.email || cuenta.id}
                    {cuenta.esAdminPrincipal && (
                      <span className="gestion-cuentas-badge gestion-cuentas-badge--admin">
                        Admin
                      </span>
                    )}
                  </p>
                  <p className="gestion-cuentas-rol">
                    {ETIQUETA_ROL[cuenta.role] || cuenta.role || "Sin rol"}
                  </p>

                  {cuenta.role === ROLES.INSTITUCION && !cuenta.esAdminPrincipal && (
                    <p className="gestion-cuentas-crud">
                      Acceso CRUD:{" "}
                      <strong>
                        {cuenta.accesoCrud?.habilitado ? "Habilitado" : "Deshabilitado"}
                      </strong>
                    </p>
                  )}

                  {diasRestantes !== null && (
                    <p className="gestion-cuentas-eliminacion">
                      Se eliminará en {diasRestantes} día{diasRestantes === 1 ? "" : "s"}
                    </p>
                  )}
                </div>

                <div className="gestion-cuentas-acciones">
                  {esAdmin && cuenta.role === ROLES.INSTITUCION && !cuenta.esAdminPrincipal && (
                    cuenta.accesoCrud?.habilitado ? (
                      <button
                        type="button"
                        className="panel-intur-btn panel-intur-btn--rechazar"
                        disabled={procesandoId === cuenta.id}
                        onClick={() =>
                          ejecutar(cuenta.id, () => revocarAccesoCrud(cuenta.id))
                        }
                      >
                        Quitar acceso CRUD
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="panel-intur-btn panel-intur-btn--aprobar"
                        disabled={procesandoId === cuenta.id}
                        onClick={() =>
                          ejecutar(cuenta.id, () => otorgarAccesoCrud(cuenta.id, user.uid))
                        }
                      >
                        Dar acceso CRUD
                      </button>
                    )
                  )}

                  {!cuenta.esAdminPrincipal && !esUno && (
                    cuenta.eliminacion?.solicitada ? (
                      <button
                        type="button"
                        className="panel-intur-btn panel-intur-btn--aprobar"
                        disabled={procesandoId === cuenta.id}
                        onClick={() =>
                          ejecutar(cuenta.id, () => cancelarEliminacionCuenta(cuenta.id))
                        }
                      >
                        Reactivar cuenta
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="panel-intur-btn panel-intur-btn--rechazar"
                        disabled={procesandoId === cuenta.id}
                        onClick={() =>
                          ejecutar(cuenta.id, () =>
                            solicitarEliminacionCuenta(cuenta.id, user.uid)
                          )
                        }
                      >
                        Eliminar cuenta
                      </button>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GestionCuentas;