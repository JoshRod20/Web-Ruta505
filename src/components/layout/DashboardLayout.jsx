import { useCallback, useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import UserBadge from './UserBadge';
import { MenuIcon } from '../icons/NavIcons';
import logoFull from '../../assets/images/logo-ruta505-white.png';

export default function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMenu = useCallback(() => setMobileOpen(false), []);

  // Con el drawer abierto: Esc lo cierra y se bloquea el scroll del fondo.
  useEffect(() => {
    if (!mobileOpen) return undefined;

    const onKeyDown = (e) => e.key === 'Escape' && closeMenu();
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [mobileOpen, closeMenu]);

  return (
    <div className="dashboard">
      {/* Escritorio: solo el usuario, arriba a la derecha.
          Móvil: barra verde con menú, logo y usuario. */}
      <header className="dashboard__topbar">
        <button
          type="button"
          className="dashboard__menu-btn"
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menú"
          aria-expanded={mobileOpen}
        >
          <MenuIcon />
        </button>
        <img src={logoFull} alt="Ruta 505" className="dashboard__mobile-logo" />
        <UserBadge />
      </header>

      <Sidebar open={mobileOpen} onClose={closeMenu} />

      <main className="dashboard__content">{children}</main>
    </div>
  );
}