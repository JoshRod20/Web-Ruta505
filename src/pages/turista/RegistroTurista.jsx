import { useNavigate } from "react-router-dom";
import { useRegistroForm } from "../../hooks/useRegistroForm";
import { ROLES } from "../../constants/roles";
import "../../styles/RegistroFormularios.css";

const RegistroTurista = () => {
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
      nombreCompleto: "",
      email: "",
      password: "",
      confirmPassword: "",
      paisOrigen: "Nicaragua",
      idiomaPreferido: "Español",
    },
    rutaExito: "/home",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    registrar({
      role: ROLES.TURISTA,
      nombreCompleto: form.nombreCompleto,
      tipoTurista: form.paisOrigen === "Nicaragua" ? "nacional" : "extranjero",
      paisOrigen: form.paisOrigen,
      idiomaPreferido: form.idiomaPreferido,
    });
  };

  return (
    <div className="registro-page">
      <div className="registro-shell">
        <div className="registro-header">
          <h1 className="registro-header__title">Regístrate como Turista</h1>
          <p className="registro-header__subtitle">
            Descubre experiencias culturales junto a Pinolito
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
              name="nombreCompleto"
              placeholder="Nombre completo"
              value={form.nombreCompleto}
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

            <select
              className="registro-select"
              name="paisOrigen"
              value={form.paisOrigen}
              onChange={handleChange}
            >
              <option value="Nicaragua">Nicaragua (nacional)</option>
              <option value="Otro">Otro país (extranjero)</option>
            </select>

            <select
              className="registro-select"
              name="idiomaPreferido"
              value={form.idiomaPreferido}
              onChange={handleChange}
            >
              <option value="Español">Español</option>
              <option value="English">English</option>
              <option value="Otro">Otro</option>
            </select>

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

export default RegistroTurista;