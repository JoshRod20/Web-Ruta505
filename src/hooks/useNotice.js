import { useCallback, useEffect, useState } from 'react';

const NOTICE_MS = 5000;

// Aviso temporal (éxito o error) que desaparece solo.
export default function useNotice() {
  const [notice, setNotice] = useState(null); // { type: 'success' | 'danger', text }

  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => setNotice(null), NOTICE_MS);
    return () => clearTimeout(timer);
  }, [notice]);

  const success = useCallback((text) => setNotice({ type: 'success', text }), []);
  const error = useCallback((text) => setNotice({ type: 'danger', text }), []);

  return { notice, success, error };
}