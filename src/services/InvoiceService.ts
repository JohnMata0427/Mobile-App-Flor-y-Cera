import type { DashboardResume } from '@/interfaces/DashboardResume';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL + '/ventas';

type DateString = `${number}-${number}-${number}`;

interface DateRange {
  fechaInicio: DateString;
  fechaFin: DateString;
}

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

export const updateInvoiceStatusRequest = async (id: string, estado: string, token: string) => {
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
  dateRange?: DateRange,
): Promise<DashboardResume> => {
  let { fechaInicio, fechaFin } = dateRange ?? {};
  const now = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };

  if (!fechaFin) {
    fechaFin ??= now.toLocaleDateString('es-EC', dateOptions).split('/').reverse().join('-') as DateString;
  }

  if (!fechaInicio) {
    now.setDate(now.getDate() - 13);
    fechaInicio ??= now.toLocaleDateString('es-EC', dateOptions).split('/').reverse().join('-') as DateString;
  }

  const response = await fetch(
    `${BACKEND_URL}/dashboard?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return await response.json();
};
