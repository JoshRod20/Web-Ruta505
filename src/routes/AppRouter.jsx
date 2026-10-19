import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import SplashGate from "../components/common/SplashGate";
import Onboarding from "../pages/onboarding/Onboarding";
import AuthPage from "../pages/auth/AuthPage";
import Home from "../components/common/Home";
import Navbar from "../navigation/Navbar";
import SeleccionarTipo from "../pages/turista/SeleccionarTipo";
import SeleccionarActor from "../pages/turista/SeleccionarActor";

import RegistroTurista from "../pages/turista/RegistroTurista";
import RegistroComunidad from "../pages/comunidad/RegistroComunidad";
import RegistroArtesano from "../pages/artesano/RegistroArtesano";
import RegistroGuia from "../pages/guia/RegistroGuia";
import RegistroEmprendedor from "../pages/emprendedor/RegistroEmprendedor";
import PanelIntur from "../pages/intur/PanelIntur";
import RequireAuth from "../routes/RequireAuth.jsx";
import RedirectIfAuthenticated from "../routes/RedirectIfAuthenticated.jsx";
import PendienteAprobacion from "../components/common/PendienteAprobacion";
import ExperienciaForm from "../pages/comunidad/ExperienciaForm.jsx";
import MapaNicaragua from "../pages/comunidad/MapaNicaragua.jsx";
import { ROLES, ESTADOS_VERIFICACION } from "../constants/roles";
import { useAuth } from "../context/AuthContext";
import { ACTOR_TYPES } from "../constants/roles";

// Layout compartido para todas las pantallas autenticadas.
// El Navbar viene del layout del proyecto y el Outlet pinta la vista activa.
const ProtectedLayout = () => (
  <div className="min-h-screen bg-[var(--color-ruta-cream,#fbf6ec)]">
    <Navbar />
    <main className="pt-20">
      <Outlet />
    </main>
  </div>
);

const RequireActorType = ({ actorTypes, children }) => {
  const { loadingAuth, profile } = useAuth();

  if (loadingAuth) {
    return null;
  }

  if (!actorTypes.includes(profile?.actorType)) {
    return <Home />;
  }

  return children;
};

const MapaSegunRol = () => {
  const { loadingAuth, profile } = useAuth();

  if (loadingAuth) {
    return null;
  }

  const modo =
    profile?.role === ROLES.ACTOR_CULTURAL && profile?.actorType === ACTOR_TYPES.COMUNIDAD
      ? "seleccionar"
      : "visualizar";

  return <MapaNicaragua modo={modo} />;
};

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      {/* Rutas públicas: pantalla de carga, onboarding y registros. */}
      <Route path="/" element={<SplashGate />} />
      <Route
        path="/onboarding"
        element={
          <RedirectIfAuthenticated>
            <Onboarding />
          </RedirectIfAuthenticated>
        }
      />
      <Route
        path="/seleccionar-tipo"
        element={
          <RedirectIfAuthenticated>
            <SeleccionarTipo />
          </RedirectIfAuthenticated>
        }
      />
      <Route
        path="/seleccionar-actor"
        element={
          <RedirectIfAuthenticated>
            <SeleccionarActor />
          </RedirectIfAuthenticated>
        }
      />

      <Route
        path="/registro/turista"
        element={
          <RedirectIfAuthenticated>
            <RegistroTurista />
          </RedirectIfAuthenticated>
        }
      />
      <Route
        path="/registro/comunidad"
        element={
          <RedirectIfAuthenticated>
            <RegistroComunidad />
          </RedirectIfAuthenticated>
        }
      />
      <Route
        path="/registro/artesano"
        element={
          <RedirectIfAuthenticated>
            <RegistroArtesano />
          </RedirectIfAuthenticated>
        }
      />
      <Route
        path="/registro/guia"
        element={
          <RedirectIfAuthenticated>
            <RegistroGuia />
          </RedirectIfAuthenticated>
        }
      />
      <Route
        path="/registro/emprendedor"
        element={
          <RedirectIfAuthenticated>
            <RegistroEmprendedor />
          </RedirectIfAuthenticated>
        }
      />

      {/* Acceso público controlado: si ya hay sesión, se redirige a /home. */}
      <Route
        path="/login"
        element={
          <RedirectIfAuthenticated>
            <AuthPage />
          </RedirectIfAuthenticated>
        }
      />

      {/* Zona protegida: requiere sesión y rol permitido por AuthContext. */}
      <Route
        element={
          <RequireAuth roles={[ROLES.TURISTA, ROLES.ACTOR_CULTURAL, ROLES.INSTITUCION]}>
            <ProtectedLayout />
          </RequireAuth>
        }
      >
        {/* Home general del usuario autenticado. */}
        <Route path="home" element={<Home />} />
        {/* Formulario para que actores culturales publiquen experiencias. */}
        <Route path="registro-experiencia" element={<ExperienciaForm />} />
        <Route path="pendiente-aprobacion" element={<PendienteAprobacion />} />
        <Route path="mapa-nicaragua" element={<MapaSegunRol />} />
        {/* Panel exclusivo de INTUR, además condicionado a estado aprobado. */}
        <Route
          path="panel-intur"
          element={
            <RequireAuth
              roles={[ROLES.INSTITUCION]}
              estados={[ESTADOS_VERIFICACION.APROBADO]}
            >
              <PanelIntur />
            </RequireAuth>
          }
        />
        {/* Fallback dentro del layout protegido para volver al home. */}
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default AppRouter;