import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import * as authService from '../services/authService';
import { can as canDo, isMainAdmin } from '../utils/permissions';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true mientras Firebase restaura la sesión

  // Restaura la sesión al abrir o recargar la página.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        setUser(await authService.getAuthorizedProfile(firebaseUser.uid));
      } catch {
        await signOut(auth);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const login = useCallback(async (credentials) => {
    const profile = await authService.login(credentials);
    setUser(profile);
    return profile;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const value = useMemo(
  () => ({
    user,
    loading,
    login,
    logout,
    isMainAdmin: isMainAdmin(user),
    can: (permission) => canDo(user, permission),
  }),
  [user, loading, login, logout]
);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}