import { useCallback, useEffect, useState } from 'react';
import { subscribeDashboardStats } from '../services/statsService';

const INITIAL = {
  stats: { tourists: null, culturalActors: null, routes: null, municipalities: null },
  loading: true,
  failed: false,
  errors: [],
};

export default function useDashboardStats() {
  const [state, setState] = useState(INITIAL);
  const [attempt, setAttempt] = useState(0);

  // Mientras la pantalla esté abierta, Firestore empuja cada cambio.
  useEffect(() => {
    setState(INITIAL);
    return subscribeDashboardStats(setState);
  }, [attempt]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);

  return { ...state, reload };
}