const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL + '/promociones';

export const getPromotionsRequest = async (page: number, limit: number) => {
  const response = await fetch(`${BACKEND_URL}?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return await response.json();
};

export const createPromotionRequest = async (body: FormData, token: string) => {
  const response = await fetch(BACKEND_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
    body,
  });

  return await response.json();
};

export const updatePromotionRequest = async (id: string, body: FormData, token: string) => {
  const response = await fetch(`${BACKEND_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
    body,
  });

  return await response.json();
};

export const deletePromotionRequest = async (id: string, token: string) => {
  const response = await fetch(`${BACKEND_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
};
