import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  signOut,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../services/firebase";
import { mapFirebaseError } from "../../utils/firebaseErrors";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../styles/Auth.css";

const AuthPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const resetFeedback = () => {
    setError("");
    setFeedback("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetFeedback();

    if (!email || !password) {
      setError("Completa tu correo y contraseña.");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigate("/home", { replace: true });
    } catch (err) {
      setError(mapFirebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    resetFeedback();
    if (!email) {
      setError("Escribe tu correo para enviarte el enlace.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (err) {
      // Por seguridad, no distinguimos si el correo existe o no
      // (auth/user-not-found no debe revelar esa información),
      // salvo que sea un problema real como formato inválido o de red.
      if (err.code !== "auth/invalid-email" && err.code !== "auth/network-request-failed") {
        setFeedback(
          "Si el correo está registrado, te enviamos un enlace para restablecer tu contraseña."
        );
        return;
      }
      setError(mapFirebaseError(err.code));
      return;
    }
    setFeedback(
      "Si el correo está registrado, te enviamos un enlace para restablecer tu contraseña."
    );
  };

  const handleSocialLogin = async (providerName) => {
    resetFeedback();
    let provider;
    if (providerName === "google") provider = new GoogleAuthProvider();
    if (providerName === "facebook") provider = new FacebookAuthProvider();
    if (providerName === "apple") provider = new OAuthProvider("apple.com");

    try {
      const credenciales = await signInWithPopup(auth, provider);
      const uid = credenciales.user.uid;

      // El login social solo es válido si ya existe un perfil registrado.
      // Si no existe, no dejamos la sesión abierta sin role.
      const perfilRef = doc(db, "users", uid);
      const perfilSnap = await getDoc(perfilRef);

      if (!perfilSnap.exists()) {
        await signOut(auth);
        setError(
          "No encontramos una cuenta registrada con este proveedor. Regístrate primero."
        );
        navigate("/seleccionar-tipo");
        return;
      }

      navigate("/home", { replace: true });
    } catch (err) {
      setError(mapFirebaseError(err.code));
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <div className="auth-header">
          <h1 className="auth-header__title">Bienvenid@ de vuelta</h1>
          <p className="auth-header__subtitle">
            Inicia sesión para continuar tu ruta cultural.
          </p>
        </div>

        <div className="auth-card">
          <form onSubmit={handleSubmit} className="auth-form">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              autoComplete="email"
              className="auth-input"
            />

            <div className="auth-input-wrap">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                autoComplete="current-password"
                className="auth-input auth-input--password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                className="auth-input-eye"
              >
                <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`} />
              </button>
            </div>

            <button type="button" onClick={handleForgotPassword} className="auth-forgot">
              Olvidé la contraseña
            </button>

            {error && <p className="auth-error">{error}</p>}
            {feedback && !error && <p className="auth-feedback">{feedback}</p>}

            <button type="submit" disabled={loading} className="auth-submit">
              {loading ? "Un momento..." : "Iniciar sesión"}
            </button>
          </form>

          <div className="auth-divider">
            <span>O inicia sesión con</span>
          </div>

          <div className="auth-socials">
            <button
              type="button"
              onClick={() => handleSocialLogin("facebook")}
              aria-label="Continuar con Facebook"
              className="auth-social-btn auth-social-btn--facebook"
            >
              <i className="bi bi-facebook" />
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin("google")}
              aria-label="Continuar con Google"
              className="auth-social-btn auth-social-btn--google"
            >
              <i className="bi bi-google" />
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin("apple")}
              aria-label="Continuar con Apple"
              className="auth-social-btn auth-social-btn--apple"
            >
              <i className="bi bi-apple" />
            </button>
          </div>

          <p className="auth-switch">
            ¿No tienes cuenta?{" "}
            <button type="button" onClick={() => navigate("/seleccionar-tipo")}>
              Regístrate
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;