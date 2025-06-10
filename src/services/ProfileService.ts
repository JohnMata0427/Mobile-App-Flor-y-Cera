import type { Client } from '@/interfaces/Client';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL + '/perfil';

interface ProfileResponse {
  msg: string;
  cliente: Client;
}

export const getProfileRequest = async (
  token: string,
): Promise<ProfileResponse> => {
  const response = await fetch(BACKEND_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return await response.json();
};

export const updateProfileRequest = async (
  token: string,
  data: Client,
): Promise<ProfileResponse> => {
  const response = await fetch(BACKEND_URL, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return await response.json();
};
