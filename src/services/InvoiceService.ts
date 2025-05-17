const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL + '/ventas';

export const getInvoicesRequest = async (
  page: number,
  limit: number,
  token: string,
) => {
  const response = await fetch(`${BACKEND_URL}?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
};