import { useNavigate } from "react-router-dom";
import "../../styles/SeleccionarTipo.css";

const actoresCulturales = [
  {
    id: "comunidad",
    titulo: "Comunidad",
    descripcion: "Comunidad local que ofrece experiencias culturales",
    icono: "bi-houses",
    ruta: "/registro/comunidad",
  },
  {
    id: "artesano",
    titulo: "Artesano",
    descripcion: "Oficio artesanal y catálogo de productos",
    icono: "bi-palette",
    ruta: "/registro/artesano",
  },
  {
    id: "guia",
    titulo: "Guía",
    descripcion: "Guía comunitario o independiente",
    icono: "bi-signpost-2",
    ruta: "/registro/guia",
  },
  {
    id: "emprendedor",
    titulo: "Emprendedor Cultural",
    descripcion: "Eventos y experiencias culturales",
    icono: "bi-stars",
    ruta: "/registro/emprendedor",
  },
];

const SeleccionarActor = () => {
  const navigate = useNavigate();

  return (
    <div className="tipo-usuario-page">
      <button
        type="button"
        className="tipo-usuario-back"
        onClick={() => navigate("/seleccionar-tipo")}
      >
        <i className="bi bi-arrow-left"></i> Volver
      </button>

      <div className="tipo-usuario-header">
        <h1 className="tipo-usuario-title">¿Qué tipo de actor cultural eres?</h1>
        <p className="tipo-usuario-subtitle">
          Esto define el formulario de registro que verás
        </p>
      </div>

      <div className="tipo-usuario-grid tipo-usuario-grid--2col">
        {actoresCulturales.map((actor) => (
          <button
            key={actor.id}
            type="button"
            className="tipo-usuario-card"
            onClick={() => navigate(actor.ruta)}
          >
            <span className="tipo-usuario-icon-wrap">
              <i className={`bi ${actor.icono}`}></i>
            </span>
            <span className="tipo-usuario-card-title">{actor.titulo}</span>
            <span className="tipo-usuario-card-desc">{actor.descripcion}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SeleccionarActor;