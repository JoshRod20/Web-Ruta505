import React, { createContext, useContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { appfirebase, db } from "../services/firebase";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null); // role, actorType, estadoVerificacion, etc.
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const auth = getAuth(appfirebase);
    let unsubscribeProfile = () => {};

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      // Cierra cualquier listener de perfil anterior antes de abrir uno nuevo
      unsubscribeProfile();

      setUser(firebaseUser);
      setIsLoggedIn(!!firebaseUser);

      if (firebaseUser) {
        // Aún no sabemos el role/estadoVerificacion: hay que esperar
        // el primer snapshot antes de dejar que el guard evalúe nada.
        setLoadingAuth(true);
        const ref = doc(db, "users", firebaseUser.uid);
        unsubscribeProfile = onSnapshot(
          ref,
          (snap) => {
            setProfile(snap.exists() ? snap.data() : null);
            setLoadingAuth(false);
          },
          (error) => {
            console.error("Error escuchando el perfil del usuario:", error);
            setProfile(null);
            setLoadingAuth(false);
          }
        );
      } else {
        setProfile(null);
        setLoadingAuth(false);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeProfile();
    };
  }, []);

  // Detectar estado de conexión
  useEffect(() => {
    const handleOnline = () => {
      console.log("¡Conexión restablecida!");
      alert("¡Conexión restablecida!");
    };
    const handleOffline = () => {
      console.log(
        "Estás offline. Los cambios se sincronizarán cuando vuelvas a conectarte."
      );
      alert("Estás offline. Los cambios se sincronizarán cuando vuelvas a conectarte.");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const logout = async () => {
    const auth = getAuth(appfirebase);
    await signOut(auth);
    setIsLoggedIn(false);
    setProfile(null);
  };

  // Turista no tiene estadoVerificacion en su doc: se trata como aprobado.
  const estadoVerificacion = profile?.estadoVerificacion ?? "aprobado";
  const role = profile?.role ?? null;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        estadoVerificacion,
        isLoggedIn,
        loadingAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;