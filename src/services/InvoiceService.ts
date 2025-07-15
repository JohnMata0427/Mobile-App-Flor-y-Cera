import type { DashboardResume } from '@/interfaces/DashboardResume';
import { requestAPI } from '@/utils/requestAPI';

const INVOICES_ENDPOINT = '/ventas';


export const getInvoicesRequest = (page: number, limit: number) =>
  requestAPI(`${INVOICES_ENDPOINT}?page=${page}&limit=${limit}`);

export const updateInvoiceStatusRequest = (id: string, estado: string) =>
  requestAPI(`${INVOICES_ENDPOINT}/${id}`, { method: 'PUT', body: { estado } });

export const getClientInvoicesRequest = () => requestAPI(`${INVOICES_ENDPOINT}/cliente/mis-ventas`);

type DateString = `${number}-${number}-${number}`;

interface DateRange {
  fechaInicio: DateString;
  fechaFin: DateString;
}

export const getInvoicesDashboardRequest = (dateRange?: DateRange): Promise<DashboardResume> => {
  let { fechaInicio, fechaFin } = dateRange ?? {};
  const now = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };

  fechaFin ??= now
    .toLocaleDateString('es-EC', dateOptions)
    .split('/')
    .reverse()
    .join('-') as DateString;

  now.setDate(now.getDate() - 13);

  fechaInicio ??= now
    .toLocaleDateString('es-EC', dateOptions)
    .split('/')
    .reverse()
    .join('-') as DateString;

  return requestAPI(
    `${INVOICES_ENDPOINT}/dashboard?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`,
  );
};
