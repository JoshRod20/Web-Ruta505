import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import { usePermisos } from "../hooks/usePermisos";
import { PERMISOS } from "../constants/permissions";
import { useAuth } from "../context/AuthContext";
import "../styles/navigation/NavigationStyle.css";
import iconoRuta505 from "../assets/images/Icono.png";

// Menú base del layout autenticado: navegación principal de Ruta 505.
// Los enlaces que dependen del rol se agregan abajo con la matriz de permisos.
const NAV_ITEMS = [
  { id: "home", 
    label: "Inicio", 
    icon: "bi-house-door-fill", 
    path: "/home" 
  },
  { id: "mapa", 
    label: "Mapa", 
    icon: "bi-geo-alt-fill", 
    path: "/mapa-nicaragua" 
  },
  {
    id: "rutas",
    label: "Rutas",
    icon: "bi-signpost-split-fill",
    path: "/home",
  },
  {
    id: "mural",
    label: "Mural Cultural",
    icon: "bi-calendar3",
    path: "home",
    variant: "accent",
  },

];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { puede } = usePermisos();
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;
  const isMapaRoute = location.pathname.startsWith("/mapa-nicaragua");

  const handleNavigate = (path) => {
    navigate(path);
    setMobileOpen(false);
    setProfileOpen(false);
  };

  // El menú se arma con la base visual del proyecto y luego se amplía
  // según los permisos que expone usePermisos() desde constants/permissions.
  const navItems = useMemo(() => {
    const items = [...NAV_ITEMS];

    if (puede(PERMISOS.PUBLICAR_EXPERIENCIA)) {
      items.push({
        id: "publicar",
        label: "Publicar Experiencia",
        icon: "bi-plus-circle-fill",
        path: "/registro-experiencia",
        variant: "accent",
      });
    }
    if (puede(PERMISOS.APROBAR_PERFILES)) {
      items.push({
        id: "panel-intur",
        label: "Panel INTUR",
        icon: "bi-shield-check",
        path: "/panel-intur",
        variant: "accent",
      });
    }

    return items;
  }, [puede]);

  const handleLogout = async () => {
    try {
      await logout();
      setMobileOpen(false);
      setProfileOpen(false);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Error cerrando sesión:", error);
    }
  };

  return (
    <header className="ruta-navbar fixed inset-x-0 top-0 z-50">
      {/* Marca y navegación principal del layout autenticado. */}
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-2.5 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => handleNavigate("/home")}
          className="ruta-navbar__brand"
        >
          <span className="ruta-navbar__brand-icon">
            {/* <i className="bi bi-compass-fill text-lg" aria-hidden="true" /> */}
            <img src={iconoRuta505} alt="Ruta 505" className="ruta-navbar__brand-img" />
          </span>
          <span className="ruta-navbar__brand-text">Ruta 505</span>
        </button>

        <nav className="ruta-navbar__desktop-nav ml-2 hidden flex-1 items-center justify-end gap-1 md:flex">
          {navItems.map((item) => {
            if (item.id === "mapa") {
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavigate(item.path)}
                  className={`ruta-navbar__item ${isMapaRoute ? "ruta-navbar__item--active" : ""}`}
                >
                  <i className={`bi ${item.icon}`} aria-hidden="true" />
                  {item.label}
                </button>
              );
            }

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigate(item.path)}
                className={`ruta-navbar__item ${isActive(item.path) ? "ruta-navbar__item--active" : ""} ${item.variant === "accent" ? "ruta-navbar__item--accent" : ""}`}
              >
                <i className={`bi ${item.icon}`} aria-hidden="true" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Menú de perfil: usa AuthContext para cerrar sesión y volver al login. */}
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Abrir menú de navegación"
            aria-expanded={mobileOpen}
            className="ruta-navbar__mobile-toggle md:hidden"
          >
            <i className="bi bi-list text-xl" aria-hidden="true" />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((v) => !v)}
              aria-label="Abrir menú de perfil"
              aria-expanded={profileOpen}
              className="ruta-navbar__profile-button"
            >
              <i className="bi bi-person-fill text-xl" aria-hidden="true" />
            </button>

            {profileOpen && (
              <div className="ruta-navbar__profile-menu absolute right-0 mt-2 w-44 p-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="ruta-navbar__profile-action"
                >
                  <i className="bi bi-box-arrow-right" aria-hidden="true" />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navegación móvil: misma fuente de datos que el menú desktop. */}
      {mobileOpen && (
        <nav className="ruta-navbar__mobile-nav px-4 py-3 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-wrap gap-2">
            {navItems.map((item) => {
              if (item.id === "mapa") {
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavigate(item.path)}
                    className={`ruta-navbar__item ruta-navbar__item--mobile ${isMapaRoute ? "ruta-navbar__item--active" : ""}`}
                  >
                    <i className={`bi ${item.icon}`} aria-hidden="true" />
                    {item.label}
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavigate(item.path)}
                  className={`ruta-navbar__item ruta-navbar__item--mobile ${isActive(item.path) ? "ruta-navbar__item--active" : ""} ${item.variant === "accent" ? "ruta-navbar__item--accent" : ""}`}
                >
                  <i className={`bi ${item.icon}`} aria-hidden="true" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;