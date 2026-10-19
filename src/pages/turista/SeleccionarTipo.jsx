import { useNavigate } from "react-router-dom";
import "../../styles/SeleccionarTipo.css";

const tiposUsuario = [
  {
    id: "turista",
    titulo: "Turista",
    descripcion: "Nacional o extranjero, descubre experiencias culturales",
    icono: "bi-backpack2",
    ruta: "/registro/turista",
  },
  {
    id: "actor-cultural",
    titulo: "Actor Cultural",
    descripcion: "Comunidad, artesano, guía o emprendedor",
    icono: "bi-people",
    ruta: "/seleccionar-actor",
  },
];

const SeleccionarTipo = () => {
  const navigate = useNavigate();

  return (
    <div className="tipo-usuario-page">
      <div className="tipo-usuario-header">
        <h1 className="tipo-usuario-title">¿Cómo quieres usar Ruta 505?</h1>
        <p className="tipo-usuario-subtitle">
          Elige el tipo de cuenta que se ajusta a ti
        </p>
      </div>

      <div className="tipo-usuario-grid">
        {tiposUsuario.map((tipo) => (
          <button
            key={tipo.id}
            type="button"
            className="tipo-usuario-card"
            onClick={() => navigate(tipo.ruta)}
          >
            <span className="tipo-usuario-icon-wrap">
              <i className={`bi ${tipo.icono}`}></i>
            </span>
            <span className="tipo-usuario-card-title">{tipo.titulo}</span>
            <span className="tipo-usuario-card-desc">{tipo.descripcion}</span>
          </button>
        ))}
              <button className="tipo-usuario-link" onClick={() => navigate("/login")}>
                Ya tengo cuenta
              </button>
      </div>
    </div>
  );
};

export default SeleccionarTipo;