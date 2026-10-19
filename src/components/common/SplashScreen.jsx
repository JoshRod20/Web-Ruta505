import { useEffect, useState } from "react";
import logo from "../../assets/images/logo-principal.png";
import "../../styles/SplashScreen.css";

const SplashScreen = ({ onFinish, minDuration = 2400 }) => {
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const leaveTimer = setTimeout(() => {
      setIsLeaving(true);
    }, minDuration - 400);

    const finishTimer = setTimeout(() => {
      onFinish?.();
    }, minDuration);

    return () => {
      clearTimeout(leaveTimer);
      clearTimeout(finishTimer);
    };
  }, [minDuration, onFinish]);

  return (
    <main className={`splash ${isLeaving ? "splash--hide" : ""}`}>

      <section className="splash__content">

        <figure className="splash__logo-wrapper">
          <img
            src={logo}
            alt="Ruta 505"
            className="splash__logo"
            draggable={false}
          />
        </figure>

        <div
          className="splash__loader"
          aria-label="Cargando Ruta 505"
        >
          {[...Array(6)].map((_, index) => (
            <span
              key={index}
              className="splash__dot"
              style={{
                animationDelay: `${index * 0.12}s`,
              }}
            />
          ))}
        </div>

      </section>

    </main>
  );
};

export default SplashScreen;