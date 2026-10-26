import { useNavigate } from 'react-router-dom';
import SplitLayout from '../../components/layout/SplitLayout';
import { ROUTE_PATHS } from '../../constants/routePaths';
import { WELCOME_CLOUDS } from '../../constants/sceneClouds';
import mascot from '../../assets/images/mascot-welcome.png';
import logo from '../../assets/images/logo-ruta505.png';

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <SplitLayout
      sceneCols={6}
      clouds={WELCOME_CLOUDS}
      scene={
        <img
          src={mascot}
          alt="Mascota de Ruta 505 con un mapa"
          className="welcome__mascot"
        />
      }
    >
      <div className="welcome__body text-center">
        <img src={logo} alt="Ruta 505" className="welcome__logo" />
        <h1 className="welcome__tagline">¡La cultura viva conectada contigo!</h1>
        <button
          type="button"
          className="btn btn-r505 w-100"
          onClick={() => navigate(ROUTE_PATHS.login)}
        >
          Continuar
        </button>
      </div>
    </SplitLayout>
  );
}