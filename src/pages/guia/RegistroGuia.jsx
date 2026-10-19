import { useNavigate } from "react-router-dom";
import { useRegistroForm } from "../../hooks/useRegistroForm";
import { ROLES, ACTOR_TYPES, ESTADOS_VERIFICACION } from "../../constants/roles";
import "../../styles/RegistroFormularios.css";

const RegistroGuia = () => {
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
      nombreGuia: "",
      especialidadTematica: "",
      zonaCobertura: "",
      idiomasQueDomina: "",
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
      actorType: ACTOR_TYPES.GUIA,
      estadoVerificacion: ESTADOS_VERIFICACION.PENDIENTE,
      nombreGuia: form.nombreGuia,
      especialidadTematica: form.especialidadTematica,
      zonaCobertura: form.zonaCobertura,
      idiomasQueDomina: form.idiomasQueDomina
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean),
    });
  };

  return (
    <div className="registro-page">
      <div className="registro-shell">
        <div className="registro-header">
          <h1 className="registro-header__title">Regístrate como Guía</h1>
          <p className="registro-header__subtitle">
            Comparte tus recorridos con los visitantes
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
              name="nombreGuia"
              placeholder="Nombre completo"
              value={form.nombreGuia}
              onChange={handleChange}
              required
            />
            <input
              className="registro-input"
              type="text"
              name="especialidadTematica"
              placeholder="Especialidad temática (historia, naturaleza...)"
              value={form.especialidadTematica}
              onChange={handleChange}
              required
            />
            <input
              className="registro-input"
              type="text"
              name="zonaCobertura"
              placeholder="Zona de cobertura"
              value={form.zonaCobertura}
              onChange={handleChange}
              required
            />
            <input
              className="registro-input"
              type="text"
              name="idiomasQueDomina"
              placeholder="Idiomas que dominas (separados por coma)"
              value={form.idiomasQueDomina}
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

export default RegistroGuia;