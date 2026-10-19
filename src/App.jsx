import AppRouter from "./routes/AppRouter";
import { AuthProvider } from "./context/AuthContext";

const App = () => (
  <AuthProvider>
    <AppRouter />
  </AuthProvider>
);

export default App;