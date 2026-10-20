import { useState } from 'react';
import useAuth from './useAuth';
import { validateLogin } from '../utils/validators';

export default function useLogin({ onSuccess } = {}) {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();

    const validationError = validateLogin({ identifier, password });
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setLoading(true);
    try {
      const profile = await login({ identifier, password });
      onSuccess?.(profile);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { identifier, setIdentifier, password, setPassword, error, loading, submit };
}