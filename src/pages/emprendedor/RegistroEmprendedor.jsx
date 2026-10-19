import { useNavigate } from "react-router-dom";
import { useRegistroForm } from "../../hooks/useRegistroForm";
import { ROLES, ACTOR_TYPES, ESTADOS_VERIFICACION } from "../../constants/roles";
import "../../styles/RegistroFormularios.css";

const RegistroEmprendedor = () => {
  const navigate = useNavigate();
  const {
    form,
    handleChange,
    mostrarPassword,
    setMostrarPassword,
    mostrarConfirmPassword,
    setMostrarConfirmPassword,
    error,
    cargando,
    registrar,
  } = useRegistroForm({
    initialValues: {
      nombreEmprendimiento: "",
      tipoOferta: "evento",
      descripcion: "",
      ubicacion: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    rutaExito: "/pendiente-aprobacion",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    registrar({
      role: ROLES.ACTOR_CULTURAL,
      actorType: ACTOR_TYPES.EMPRENDEDOR,
      estadoVerificacion: ESTADOS_VERIFICACION.PENDIENTE,
      nombreEmprendimiento: form.nombreEmprendimiento,
      tipoOferta: form.tipoOferta,
      descripcion: form.descripcion,
      ubicacion: form.ubicacion,
    });
  };

  return (
    <div className="registro-page">
      <div className="registro-shell">
        <div className="registro-header">
          <h1 className="registro-header__title">Regístrate como Emprendedor Cultural</h1>
          <p className="registro-header__subtitle">
            Publica tus eventos y experiencias culturales
          </p>
        </div>

        <div className="registro-card">
          <button
            type="button"
            className="registro-back"
            onClick={() => navigate("/seleccionar-actor")}
          >
            <i className="bi bi-arrow-left"></i> Volver
          </button>

          <form className="registro-form" onSubmit={handleSubmit}>
            <input
              className="registro-input"
              type="text"
              name="nombreEmprendimiento"
              placeholder="Nombre del emprendimiento"
              value={form.nombreEmprendimiento}
              onChange={handleChange}
              required
            />

            <select
              className="registro-select"
              name="tipoOferta"
              value={form.tipoOferta}
              onChange={handleChange}
            >
              <option value="evento">Evento cultural</option>
              <option value="temporal">Experiencia temporal</option>
              <option value="permanente">Experiencia permanente</option>
            </select>

            <textarea
              className="registro-textarea"
              name="descripcion"
              placeholder="Descripción de tu propuesta"
              value={form.descripcion}
              onChange={handleChange}
              required
            />
            <input
              className="registro-input"
              type="text"
              name="ubicacion"
              placeholder="Ubicación"
              value={form.ubicacion}
              onChange={handleChange}
              required
            />
            <input
              className="registro-input"
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <div className="registro-input-wrap">
              <input
                className="registro-input registro-input--password"
                type={mostrarPassword ? "text" : "password"}
                name="password"
                placeholder="Contraseña"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="registro-input-eye"
                onClick={() => setMostrarPassword((v) => !v)}
              >
                <i className={`bi ${mostrarPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
              </button>
            </div>

            <div className="registro-input-wrap">
              <input
                className="registro-input registro-input--password"
                type={mostrarConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirmar contraseña"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="registro-input-eye"
                onClick={() => setMostrarConfirmPassword((v) => !v)}
              >
                <i className={`bi ${mostrarConfirmPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
              </button>
            </div>

            {error && <p className="registro-error">{error}</p>}

            <button className="registro-submit" type="submit" disabled={cargando}>
              {cargando ? "Creando cuenta..." : "Registrarse"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistroEmprendedor;