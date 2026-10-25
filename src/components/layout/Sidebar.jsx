import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { ROUTE_PATHS } from '../../constants/routePaths';
import { NAV_ITEMS, LOGOUT_ICON } from '../../constants/navItems';
import { CloseIcon } from '../icons/NavIcons';
import logoFull from '../../assets/images/logo-ruta505-white.png';
import logoCompact from '../../assets/images/logo-ruta505-compact-white.png';

/**
 * Escritorio: colapsado (íconos), se expande al pasar el cursor.
 * Móvil: drawer controlado por `open` / `onClose`.
 */
export default function Sidebar({ open = false, onClose }) {
  const navigate = useNavigate();
  // 1) Dentro del componente, junto a `logout`:
const { user, logout } = useAuth();
const items = NAV_ITEMS.filter(({ allowed }) => !allowed || allowed(user));

  const handleLogout = async () => {
    await logout();
    navigate(ROUTE_PATHS.login, { replace: true });
  };
  

  return (
    <>
      <nav className={`sidebar ${open ? 'sidebar--open' : ''}`} aria-label="Navegación principal">
        <div className="sidebar__brand">
          <img src={logoCompact} alt="" className="sidebar__logo sidebar__logo--compact" />
          <img src={logoFull} alt="Ruta 505" className="sidebar__logo sidebar__logo--full" />
          <button type="button" className="sidebar__close" onClick={onClose} aria-label="Cerrar menú">
            <CloseIcon />
          </button>
        </div>

        <ul className="sidebar__nav">
          {items.map(({ label, path, icon }) => (
            <li key={path}>
              <NavLink
                to={path}
                onClick={onClose}
                className={({ isActive }) => `sidebar__item ${isActive ? 'active' : ''}`}
              >
                <img src={icon} alt="" className="sidebar__icon" />
                <span className="sidebar__label">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="sidebar__footer">
          <button type="button" className="sidebar__item" onClick={handleLogout}>
            <img src={LOGOUT_ICON} alt="" className="sidebar__icon" />
            <span className="sidebar__label">Cerrar sesión</span>
          </button>
        </div>
      </nav>

      {/* Debe ir justo después del <nav>: el CSS lo oscurece con el selector hermano (+) */}
      <div className="sidebar__backdrop" onClick={onClose} aria-hidden="true" />
    </>
  );
}