const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL + '/admin/clientes';

export const getClientsRequest = async (page: number, limit: number, token: string) => {
  const response = await fetch(`${BACKEND_URL}?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
};

export const activateClientAccountRequest = async (id: string, token: string) => {
  const response = await fetch(`${BACKEND_URL}/activar/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
};

export const deleteClientAccountRequest = async (id: string, token: string) => {
  const response = await fetch(`${BACKEND_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
};
