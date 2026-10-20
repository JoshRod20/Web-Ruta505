const BASE_URL = import.meta.env.VITE_API_URL ?? '';

export async function login({ identifier, password }) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password }),
  });

  if (!response.ok) {
    throw new Error(
      response.status === 401
        ? 'Usuario o contraseña incorrectos.'
        : 'No pudimos iniciar sesión. Intenta de nuevo.'
    );
  }

  const data = await response.json();
  return {
    token: data.token,
    user: { id: data.user.id, name: data.user.name, email: data.user.email },
  };
}