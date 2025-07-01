const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL + '/categorias';

export const getCategoriesRequest = async () => {
  const response = await fetch(BACKEND_URL, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return await response.json();
};

export const createCategoryRequest = async (body: FormData, token: string) => {
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

export const updateCategoryRequest = async (id: string, body: FormData, token: string) => {
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

export const deleteCategoryRequest = async (id: string, token: string) => {
  const response = await fetch(`${BACKEND_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
};
