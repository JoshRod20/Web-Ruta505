import { useNavigate } from "react-router-dom";
import { useRegistroForm } from "../../hooks/useRegistroForm";
import { ROLES, ACTOR_TYPES, ESTADOS_VERIFICACION } from "../../constants/roles";
import "../../styles/RegistroFormularios.css";

const RegistroComunidad = () => {
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
      nombreComunidad: "",
      descripcion: "",
      ubicacion: "",
      telefonoContacto: "",
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
      actorType: ACTOR_TYPES.COMUNIDAD,
      estadoVerificacion: ESTADOS_VERIFICACION.PENDIENTE,
      nombreComunidad: form.nombreComunidad,
      descripcion: form.descripcion,
      ubicacion: form.ubicacion,
      telefonoContacto: form.telefonoContacto,
    });
  };

  return (
    <div className="registro-page">
      <div className="registro-shell">
        <div className="registro-header">
          <h1 className="registro-header__title">Registra tu Comunidad</h1>
          <p className="registro-header__subtitle">
            Comparte tus experiencias culturales con los turistas
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
              name="nombreComunidad"
              placeholder="Nombre de la comunidad"
              value={form.nombreComunidad}
              onChange={handleChange}
              required
            />
            <textarea
              className="registro-textarea"
              name="descripcion"
              placeholder="Descripción de la comunidad"
              value={form.descripcion}
              onChange={handleChange}
              required
            />
            <input
              className="registro-input"
              type="text"
              name="ubicacion"
              placeholder="Ubicación (departamento/municipio)"
              value={form.ubicacion}
              onChange={handleChange}
              required
            />
            <input
              className="registro-input"
              type="tel"
              name="telefonoContacto"
              placeholder="Teléfono de contacto"
              value={form.telefonoContacto}
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

export default RegistroComunidad;