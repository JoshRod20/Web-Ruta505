import { useNavigate } from "react-router-dom";
import SplashScreen from "./SplashScreen";

const SplashGate = () => {
  const navigate = useNavigate();

  const handleFinish = () => {
    const hasVisited = localStorage.getItem("ruta505_hasVisited");
    navigate(hasVisited ? "/home" : "/onboarding", { replace: true });
  };

  return <SplashScreen onFinish={handleFinish} />;
};

export default SplashGate;