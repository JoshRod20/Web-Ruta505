// src/pages/turista/Onboarding.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Onboarding.css";

import pinolito from "../../assets/images/pinolito.png";
import rama from "../../assets/images/rama-pinolito.png";
import escenaBienvenida from "../../assets/images/escena-bienvenida.png";
import catedral from "../../assets/images/catedral.png";
import bailarina from "../../assets/images/bailarina.png";
import gigantona from "../../assets/images/gigantona.png";
import nube1 from "../../assets/images/nube-3.png";
import nube2 from "../../assets/images/nube-4.png";
import flor1 from "../../assets/images/flor-1.png";
import flor2 from "../../assets/images/flor-2.png";

// nube1 / nube2 se siguen usando para la decoración lateral de tablet
// (lateralLeft / lateralRight). nube3 / nube4 son las nuevas nubes que
// se mueven en carrusel dentro del cielo (onboarding-sky).
const SLIDES = [
  {
    id: "bienvenida",
    title: "Bienvenid@ a Ruta 505",
    subtitle: "Explora la cultura viva de Nicaragua junto a Pinolito, tu guía virtual.",
    cta: "Siguiente",
    ground: "sky",
    lateralLeft: nube1,
    lateralRight: nube2,
  },
  {
    id: "esencia",
    title: "Descubre la esencia de Nicaragua",
    subtitle: "Historia, arquitectura colonial y tradiciones que laten en cada rincón del país.",
    cta: "Siguiente",
    ground: "grass",
    lateralLeft: nube1,
    lateralRight: nube2,
  },
  {
    id: "comunidades",
    title: "Conecta con comunidades auténticas",
    subtitle: "Vive experiencias culturales creadas por artesanos, guías y comunidades locales.",
    cta: "Siguiente",
    ground: "grass",
    lateralLeft: nube1,
    lateralRight: nube2,
  },
  {
    id: "experiencia",
    title: "Tu próxima experiencia comienza aquí",
    subtitle: "Crea tu cuenta y arma tu propia ruta cultural por Nicaragua.",
    cta: "Comenzar",
    ground: "soil",
    lateralLeft: flor1,
    lateralRight: flor2,
  },
];

const Onboarding = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const slide = SLIDES[step];
  const isLast = step === SLIDES.length - 1;

  // ---------- Parallax de nubes con el mouse ----------
  const [cloudOffset, setCloudOffset] = useState({ x: 0, y: 0 });

  const handleSkyMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setCloudOffset({ x, y });
  };

  const handleSkyMouseLeave = () => setCloudOffset({ x: 0, y: 0 });

  const finish = () => {
    localStorage.setItem("ruta505_hasVisited", "true");
    navigate("/seleccionar-tipo", { replace: true });
  };

  const skip = () => {
  localStorage.setItem("ruta505_hasVisited", "true");
  navigate("/login", { replace: true });
};

  const handleNext = () => (isLast ? finish() : setStep((s) => s + 1));

  const renderIllustration = () => {
    switch (slide.id) {
      case "bienvenida":
        return (
          <div className="onboarding-scene">
            <img
              src={escenaBienvenida}
              alt="Volcán y laguna de Nicaragua"
              className="onboarding-scene__bg"
            />
            <img src={rama} alt="" className="onboarding-scene__rama" />
            <img
              src={pinolito}
              alt="Pinolito"
              className="onboarding-scene__pinolito"
            />
          </div>
        );
      case "esencia":
        return (
          <div className="onboarding-scene onboarding-scene--bottom">
            <img
              src={catedral}
              alt="Catedral de León"
              className="onboarding-scene__catedral"
            />
            <img
              src={bailarina}
              alt="Bailarina de folclor"
              className="onboarding-scene__bailarina"
            />
          </div>
        );
      case "comunidades":
        return (
          <div className="onboarding-scene onboarding-scene--bottom">
            <img
              src={gigantona}
              alt="Gigantona y Enano Cabezón"
              className="onboarding-scene__gigantona"
            />
          </div>
        );
      case "experiencia":
        return (
          <div className="onboarding-scene">
            <img
              src={flor1}
              alt=""
              className="onboarding-mobile-deco onboarding-scene__flor-left"
            />
            <img
              src={flor2}
              alt=""
              className="onboarding-mobile-deco onboarding-scene__flor-right"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="onboarding-page">
      {/* Lateral izquierdo — solo se usa en desktop split-screen (>=1024px);
          en mobile/tablet ahora la tarjeta ocupa toda la pantalla */}
      <div className="onboarding-lateral onboarding-lateral--left">
        <img src={slide.lateralLeft} alt="" className="onboarding-lateral__img" />
      </div>

      <div className="onboarding-card">
        <button onClick={skip} className="onboarding-skip">
          Saltar
        </button>

        <div className="onboarding-card__inner">
          <div
            className={`onboarding-sky onboarding-sky--${slide.ground}`}
            onMouseMove={handleSkyMouseMove}
            onMouseLeave={handleSkyMouseLeave}
          >
            <img
              src={nube1}
              alt=""
              className="onboarding-mobile-deco onboarding-mobile-deco--cloud-left onboarding-cloud--carousel-a"
              style={{
                "--parallax-x": `${cloudOffset.x * 14}px`,
                "--parallax-y": `${cloudOffset.y * 8}px`,
              }}
            />
            <img
              src={nube2}
              alt=""
              className="onboarding-mobile-deco onboarding-mobile-deco--cloud-right onboarding-cloud--carousel-b"
              style={{
                "--parallax-x": `${cloudOffset.x * 22}px`,
                "--parallax-y": `${cloudOffset.y * 12}px`,
              }}
            />

            {/* key={slide.id}: fuerza a React a remontar este nodo en cada
                cambio de slide, lo que reinicia la animación CSS de entrada
                sin alterar la estructura ni el posicionamiento existente. */}
            <div className="onboarding-title-wrap" key={`title-${slide.id}`}>
              <h1 className="onboarding-title onboarding-anim-in">{slide.title}</h1>
              {/* Subtítulo mobile/tablet — se oculta automáticamente en
                  desktop (>=1024px), donde se muestra el de .onboarding-footer */}
              <p className="onboarding-subtitle-mobile onboarding-anim-in onboarding-anim-in--delay-1">
                {slide.subtitle}
              </p>
            </div>

            <div className="onboarding-illustration" key={`illu-${slide.id}`}>
              <div className="onboarding-anim-in onboarding-anim-in--illustration">
                {renderIllustration()}
              </div>
            </div>
          </div>

          <div className={`onboarding-footer onboarding-footer--${slide.ground}`}>
            <p
              className="onboarding-subtitle onboarding-anim-in onboarding-anim-in--delay-1"
              key={`subtitle-${slide.id}`}
            >
              {slide.subtitle}
            </p>

            <div className="onboarding-dots">
              {SLIDES.map((s, i) => (
                <span
                  key={s.id}
                  className={`onboarding-dot ${
                    i === step ? "onboarding-dot--active" : ""
                  }`}
                />
              ))}
            </div>

            <button
              className="onboarding-cta onboarding-anim-in onboarding-anim-in--delay-2"
              key={`cta-${slide.id}`}
              onClick={handleNext}
            >
              {slide.cta}
            </button>

            {/*
            {isLast && (
              <button className="onboarding-secondary" onClick={finish}>
                Ya tengo cuenta
              </button>
            )}
            */}
          </div>
        </div>
      </div>

      {/* Lateral derecho — solo desktop split-screen */}
      <div className="onboarding-lateral onboarding-lateral--right">
        <img src={slide.lateralRight} alt="" className="onboarding-lateral__img" />
      </div>
    </div>
  );
};

export default Onboarding;