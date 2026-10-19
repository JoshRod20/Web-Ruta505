import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../styles/Home/HomeStyle.css";
import LogoutButton from "./LogoutButton";
import { useAuth } from "../../context/AuthContext";
import { ROLES, ESTADOS_VERIFICACION } from "../../constants/roles";

const Home = () => {
  const { role, estadoVerificacion } = useAuth();
console.log("DEBUG →", { role, estadoVerificacion });
  const esInstitucionAprobada =
    role === ROLES.INSTITUCION && estadoVerificacion === ESTADOS_VERIFICACION.APROBADO;

  return (
    <div className="home-page">
      <main className="home-main">
        {/* Barra de búsqueda — versión web de la barra de "Buscar" de la app */}
        <div className="home-search">
          <div className="home-search-input-wrap">
            <i className="bi bi-search" aria-hidden="true" />
            <input
              type="search"
              placeholder="Buscar experiencias, lugares, artesanos..."
              className="home-search-input"
            />
          </div>
          <button
            type="button"
            aria-label="Filtros de búsqueda"
            title="Filtros"
            className="home-search-filter"
          >
            <i className="bi bi-funnel-fill" aria-hidden="true" />
          </button>
        </div>

        {/* Contenido restante (Perfil/Pasaporte/Escáner, recomendados,
            filtros por categoría) se agrega en una próxima iteración. */}
        <div className="home-welcome">
          <h1 className="home-welcome__title">¡Ya estás dentro!</h1>
          <p className="home-welcome__subtitle">
            Aquí vivirá el resto del Home de Ruta 505 (recomendados, mapa...).
          </p>
        </div>
      </main>
    </div>
  );
};

export default Home;