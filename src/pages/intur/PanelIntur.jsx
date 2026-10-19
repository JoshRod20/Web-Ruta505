import { useEffect, useState } from "react";
import {
  obtenerSolicitudesPendientes,
  actualizarEstadoVerificacion,
} from "../../services/panelIntur";
import { crearCuentaInstitucion } from "../../services/crearCuentaInstitucion";
import { ACTOR_TYPES, ESTADOS_VERIFICACION } from "../../constants/roles";
import { usePermisosIntur } from "../../hooks/usePermisosIntur";
import GestionCuentas from "../intur/GestionCuentas";
import LogoutButton from "../../components/common/LogoutButton";
import "../../styles/PanelIntur.css";

// Solo actores culturales pasan por esta cola de aprobación.
// Institución ya no aparece aquí: esas cuentas las crea directamente
// otra cuenta de INTUR desde el panel, sin pasar por "pendiente".
const TABS = [
  {
    id: ACTOR_TYPES.COMUNIDAD,
    label: "Comunidad",
    matches: (u) => u.actorType === ACTOR_TYPES.COMUNIDAD,
  },
  {
    id: ACTOR_TYPES.ARTESANO,
    label: "Artesano",
    matches: (u) => u.actorType === ACTOR_TYPES.ARTESANO,
  },
  {
    id: ACTOR_TYPES.GUIA,
    label: "Guía",
    matches: (u) => u.actorType === ACTOR_TYPES.GUIA,
  },
  {
    id: ACTOR_TYPES.EMPRENDEDOR,
    label: "Emprendedor",
    matches: (u) => u.actorType === ACTOR_TYPES.EMPRENDEDOR,
  },
];

const CAMPOS_POR_TAB = {
  [ACTOR_TYPES.COMUNIDAD]: [
    { key: "nombreComunidad", label: "Nombre" },
    { key: "descripcion", label: "Descripción" },
    { key: "ubicacion", label: "Ubicación" },
    { key: "telefonoContacto", label: "Teléfono" },
  ],
  [ACTOR_TYPES.ARTESANO]: [
    { key: "nombreArtesano", label: "Nombre" },
    { key: "especialidad", label: "Especialidad" },
    { key: "historiaBreve", label: "Historia" },
    { key: "ubicacionTaller", label: "Ubicación del taller" },
  ],
  [ACTOR_TYPES.GUIA]: [
    { key: "nombreGuia", label: "Nombre" },
    { key: "especialidadTematica", label: "Especialidad" },
    { key: "zonaCobertura", label: "Zona de cobertura" },
    { key: "idiomasQueDomina", label: "Idiomas", isArray: true },
  ],
  [ACTOR_TYPES.EMPRENDEDOR]: [
    { key: "nombreEmprendimiento", label: "Emprendimiento" },
    { key: "tipoOferta", label: "Tipo de oferta" },
    { key: "descripcion", label: "Descripción" },
    { key: "ubicacion", label: "Ubicación" },
  ],
};

const VISTAS = [
  { id: "solicitudes", label: "Solicitudes" },
  { id: "cuentas", label: "Cuentas registradas" },
];

const PanelIntur = () => {
  const {
    puedeGestionar,
    dentroDeHorario,
    accesoCrudHabilitado,
    esAdmin,
    cargando: cargandoPermisos,
  } = usePermisosIntur();

  const [vista, setVista] = useState("solicitudes");

  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [tabActiva, setTabActiva] = useState(TABS[0].id);
  const [procesandoId, setProcesandoId] = useState(null);

  const [mostrarFormularioCrear, setMostrarFormularioCrear] = useState(false);
  const [formCrear, setFormCrear] = useState({
    nombreInstitucion: "",
    cargo: "",
    email: "",
  });
  const [creandoCuenta, setCreandoCuenta] = useState(false);
  const [errorCrear, setErrorCrear] = useState("");
  const [exitoCrear, setExitoCrear] = useState("");

  const cargarSolicitudes = async () => {
    setCargando(true);
    setError("");
    try {
      const datos = await obtenerSolicitudesPendientes();
      setSolicitudes(datos);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las solicitudes. Intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    // Espera a saber si la cuenta puede gestionar antes de consultar.
    // Si no puede, ni siquiera intenta: Firestore rechazaría la lectura
    // por permisos, y eso no es un "error" real que debamos mostrar.
    if (cargandoPermisos) return;

    if (!puedeGestionar) {
      setSolicitudes([]);
      setError("");
      setCargando(false);
      return;
    }

    cargarSolicitudes();
  }, [cargandoPermisos, puedeGestionar]);

  const handleDecision = async (uid, nuevoEstado) => {
    if (!puedeGestionar) {
      setError(
        "No tienes permiso para aprobar o rechazar en este momento (falta acceso CRUD o estás fuera de horario laboral)."
      );
      return;
    }
    setError("");
    setProcesandoId(uid);
    try {
      await actualizarEstadoVerificacion(uid, nuevoEstado);
      setSolicitudes((prev) => prev.filter((u) => u.id !== uid));
    } catch (err) {
      console.error(err);
      setError("No se pudo actualizar la solicitud. Intenta de nuevo.");
    } finally {
      setProcesandoId(null);
    }
  };

  const handleChangeCrear = (e) => {
    const { name, value } = e.target;
    setFormCrear((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitCrear = async (e) => {
    e.preventDefault();
    setErrorCrear("");
    setExitoCrear("");

    if (!puedeGestionar) {
      setErrorCrear(
        "No tienes permiso para crear cuentas en este momento (falta acceso CRUD o estás fuera de horario laboral)."
      );
      return;
    }

    if (!formCrear.nombreInstitucion || !formCrear.cargo || !formCrear.email) {
      setErrorCrear("Completa todos los campos.");
      return;
    }

    setCreandoCuenta(true);
    try {
      await crearCuentaInstitucion({
        nombreInstitucion: formCrear.nombreInstitucion,
        cargo: formCrear.cargo,
        email: formCrear.email.trim(),
      });
      setExitoCrear(
        `Cuenta creada. Se envió un correo a ${formCrear.email.trim()} para que defina su contraseña.`
      );
      setFormCrear({ nombreInstitucion: "", cargo: "", email: "" });
    } catch (err) {
      console.error(err);
      setErrorCrear(
        err.code === "auth/email-already-in-use"
          ? "Ya existe una cuenta con ese correo."
          : "No se pudo crear la cuenta. Intenta de nuevo."
      );
    } finally {
      setCreandoCuenta(false);
    }
  };

  const tabActual = TABS.find((t) => t.id === tabActiva);
  const solicitudesTab = solicitudes.filter(tabActual.matches);
  const campos = CAMPOS_POR_TAB[tabActiva] || [];

  return (
    <div className="panel-intur-page">
      <div className="panel-intur-header">
        <h1 className="panel-intur-title">Panel de INTUR</h1>
      </div>

      {!esAdmin && accesoCrudHabilitado && !dentroDeHorario && (
        <p className="panel-intur-mensaje">
          Tienes acceso CRUD habilitado, pero solo funciona en horario laboral
          (8:00 am – 5:00 pm). Fuera de ese horario puedes ver el panel, pero
          no aprobar, crear ni eliminar cuentas.
        </p>
      )}

      <div className="panel-intur-vistas">
        {VISTAS.map((v) => (
          <button
            key={v.id}
            type="button"
            className={`panel-intur-vista ${
              vista === v.id ? "panel-intur-vista--activa" : ""
            }`}
            onClick={() => setVista(v.id)}
          >
            {v.label}
          </button>
        ))}
      </div>

      {vista === "cuentas" ? (
        <GestionCuentas />
      ) : (
        <>
          {puedeGestionar && (
            <div className="panel-intur-crear-wrap">
              <button
                type="button"
                className="panel-intur-btn panel-intur-btn--crear"
                onClick={() => {
                  setMostrarFormularioCrear((v) => !v);
                  setErrorCrear("");
                  setExitoCrear("");
                }}
              >
                {mostrarFormularioCrear ? "Cancelar" : "+ Crear cuenta INTUR"}
              </button>

              {mostrarFormularioCrear && (
                <form className="panel-intur-crear-form" onSubmit={handleSubmitCrear}>
                  <input
                    className="panel-intur-input"
                    type="text"
                    name="nombreInstitucion"
                    placeholder="Nombre de la institución"
                    value={formCrear.nombreInstitucion}
                    onChange={handleChangeCrear}
                    required
                  />
                  <input
                    className="panel-intur-input"
                    type="text"
                    name="cargo"
                    placeholder="Cargo del usuario"
                    value={formCrear.cargo}
                    onChange={handleChangeCrear}
                    required
                  />
                  <input
                    className="panel-intur-input"
                    type="email"
                    name="email"
                    placeholder="Correo institucional"
                    value={formCrear.email}
                    onChange={handleChangeCrear}
                    required
                  />

                  {errorCrear && <p className="panel-intur-error">{errorCrear}</p>}
                  {exitoCrear && <p className="panel-intur-exito">{exitoCrear}</p>}

                  <button
                    type="submit"
                    className="panel-intur-btn panel-intur-btn--aprobar"
                    disabled={creandoCuenta}
                  >
                    {creandoCuenta ? "Creando..." : "Crear cuenta"}
                  </button>
                </form>
              )}
            </div>
          )}

          <div className="panel-intur-tabs">
            {TABS.map((tab) => {
              const cantidad = solicitudes.filter(tab.matches).length;
              return (
                <button
                  key={tab.id}
                  type="button"
                  className={`panel-intur-tab ${
                    tab.id === tabActiva ? "panel-intur-tab--activa" : ""
                  }`}
                  onClick={() => setTabActiva(tab.id)}
                >
                  {tab.label}
                  {cantidad > 0 && <span className="panel-intur-badge">{cantidad}</span>}
                </button>
              );
            })}
          </div>

          {error && <p className="panel-intur-error">{error}</p>}

          {cargandoPermisos || cargando ? (
            <p className="panel-intur-mensaje">Cargando solicitudes...</p>
          ) : !puedeGestionar ? (
            <p className="panel-intur-mensaje">
              No tienes acceso a las solicitudes en este momento.
              {!esAdmin && !accesoCrudHabilitado &&
                " Tu cuenta no tiene acceso CRUD temporal habilitado por el administrador."}
              {!esAdmin && accesoCrudHabilitado && !dentroDeHorario &&
                " Tu acceso CRUD temporal solo funciona en horario laboral (8:00 am – 5:00 pm)."}
            </p>
          ) : solicitudesTab.length === 0 ? (
            <p className="panel-intur-mensaje">
              No hay solicitudes pendientes en esta categoría.
            </p>
          ) : (
            <div className="panel-intur-lista">
              {solicitudesTab.map((usuario) => (
                <div key={usuario.id} className="panel-intur-card">
                  {campos.map(({ key, label, isArray }) => (
                    <p key={key} className="panel-intur-campo">
                      <strong>{label}:</strong>{" "}
                      {isArray ? (usuario[key] || []).join(", ") : usuario[key]}
                    </p>
                  ))}
                  <p className="panel-intur-campo">
                    <strong>Email:</strong> {usuario.email}
                  </p>

                  {puedeGestionar && (
                    <div className="panel-intur-acciones">
                      <button
                        type="button"
                        className="panel-intur-btn panel-intur-btn--aprobar"
                        disabled={procesandoId === usuario.id}
                        onClick={() =>
                          handleDecision(usuario.id, ESTADOS_VERIFICACION.APROBADO)
                        }
                      >
                        Aprobar
                      </button>
                      <button
                        type="button"
                        className="panel-intur-btn panel-intur-btn--rechazar"
                        disabled={procesandoId === usuario.id}
                        onClick={() =>
                          handleDecision(usuario.id, ESTADOS_VERIFICACION.RECHAZADO)
                        }
                      >
                        Rechazar
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PanelIntur;