const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export const loginRequest = async (credentials: {
  email: string;
  password: string;
}) => {
  const response = await fetch(`${BACKEND_URL}/login?environment=mobile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  return await response.json();
};
