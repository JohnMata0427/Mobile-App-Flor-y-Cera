const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL + '/ventas';

export const getInvoicesRequest = async (page: number, limit: number, token: string) => {
  const response = await fetch(`${BACKEND_URL}?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
};

export const updateInvoiceStatusRequest = async (
  id: string,
  estado: string,
  token: string,
) => {
  const response = await fetch(`${BACKEND_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ estado }),
  });

  return await response.json();
};

export const getInvoicesDashboardRequest = async (
  token: string,
  dateRange: { fechaInicio: string; fechaFin: string },
) => {
  const response = await fetch(`${BACKEND_URL}/dashboard`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dateRange),
  });

  return await response.json();
};
