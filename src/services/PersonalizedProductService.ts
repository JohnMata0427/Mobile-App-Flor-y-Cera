import type { PersonalizedProduct } from '@/interfaces/PersonalizedProduct';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL + '/productos-personalizados';

export const getPersonalizedProductsRequest = async (page: number, limit: number) => {
  const response = await fetch(`${BACKEND_URL}?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return await response.json();
};

export const getPersonalizedProductByIdRequest = async (id: string) => {
  const response = await fetch(`${BACKEND_URL}/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return await response.json();
};

export const createPersonalizedProductRequest = async (
  body: Partial<PersonalizedProduct>,
  token: string,
) => {
  const response = await fetch(BACKEND_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  return await response.json();
};

export const updatePersonalizedProductRequest = async (
  id: string,
  body: Partial<PersonalizedProduct>,
  token: string,
) => {
  const response = await fetch(`${BACKEND_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  return await response.json();
};

export const deletePersonalizedProductRequest = async (id: string, token: string) => {
  const response = await fetch(`${BACKEND_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
};
