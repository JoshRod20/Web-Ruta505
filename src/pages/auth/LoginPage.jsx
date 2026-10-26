import { Link, useNavigate } from 'react-router-dom';
import SplitLayout from '../../components/layout/SplitLayout';
import TextField from '../../components/common/TextField';
import PasswordField from '../../components/common/PasswordField';
import { ROUTE_PATHS } from '../../constants/routePaths';
import useLogin from '../../hooks/useLogin';
import { LOGIN_CLOUDS } from '../../constants/sceneClouds';
import logoWhite from '../../assets/images/logo-ruta505-white.png';
import mascot from '../../assets/images/mascot-login.png';

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { identifier, setIdentifier, password, setPassword, error, loading, submit } =
    useLogin({ onSuccess: () => navigate(ROUTE_PATHS.home) });

  return (
    <SplitLayout
      sceneCols={4}
      clouds={LOGIN_CLOUDS}
      scene={
        <>
          <img src={logoWhite} alt="Ruta 505" className="login__logo" />
          <img src={mascot} alt="Mascota de Ruta 505 saludando" className="login__mascot" />
        </>
      }
    >
      <button
        type="button"
        className="login__back"
        onClick={() => navigate(ROUTE_PATHS.welcome)}
        aria-label="Volver"
      >
        <BackIcon />
      </button>

      <form className="login__form" onSubmit={submit} noValidate>
        <h1 className="login__title">¡Bienvenido!</h1>
        <p className="login__subtitle">
          Inicia sesión con tu cuenta de <strong>Ruta 505</strong>
        </p>

        <div className="d-grid gap-4">
          <TextField
            id="identifier"
            label="Nombre de usuario o correo"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            autoComplete="username"
          />

          <div>
            <PasswordField
              id="password"
              label="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <div className="text-end mt-1">
              <Link to={ROUTE_PATHS.forgotPassword} className="login__forgot">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>
        </div>

        {error && <p role="alert" className="login__error">{error}</p>}

        <button type="submit" className="btn btn-r505 w-100 mt-4" disabled={loading}>
          {loading ? 'Iniciando…' : 'Iniciar sesión'}
        </button>
      </form>
    </SplitLayout>
  );
}