import { useNavigate } from "react-router-dom";
import { useRegistroForm } from "../../hooks/useRegistroForm";
import { ROLES, ESTADOS_VERIFICACION } from "../../constants/roles";
import "../../styles/RegistroFormularios.css";

const RegistroInstitucion = () => {
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
      nombreInstitucion: "",
      cargo: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    rutaExito: "/pendiente-aprobacion",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    registrar({
      role: ROLES.INSTITUCION,
      estadoVerificacion: ESTADOS_VERIFICACION.PENDIENTE,
      nombreInstitucion: form.nombreInstitucion,
      cargo: form.cargo,
    });
  };

  return (
    <div className="registro-page">
      <div className="registro-shell">
        <div className="registro-header">
          <h1 className="registro-header__title">Acceso Institucional</h1>
          <p className="registro-header__subtitle">
            INTUR y otras instituciones de turismo
          </p>
        </div>

        <div className="registro-card">
          <button
            type="button"
            className="registro-back"
            onClick={() => navigate("/seleccionar-tipo")}
          >
            <i className="bi bi-arrow-left"></i> Volver
          </button>

          <form className="registro-form" onSubmit={handleSubmit}>
            <input
              className="registro-input"
              type="text"
              name="nombreInstitucion"
              placeholder="Nombre de la institución"
              value={form.nombreInstitucion}
              onChange={handleChange}
              required
            />
            <input
              className="registro-input"
              type="text"
              name="cargo"
              placeholder="Cargo del usuario"
              value={form.cargo}
              onChange={handleChange}
              required
            />
            <input
              className="registro-input"
              type="email"
              name="email"
              placeholder="Correo institucional"
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
              {cargando ? "Creando cuenta..." : "Solicitar acceso"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistroInstitucion;