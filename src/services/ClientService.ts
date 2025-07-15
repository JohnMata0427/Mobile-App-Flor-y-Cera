import { requestAPI } from '@/utils/requestAPI';

const CLIENTS_ENDPOINT = '/admin/clientes';

export const getClientsRequest = (page: number, limit: number) =>
  requestAPI(`${CLIENTS_ENDPOINT}?page=${page}&limit=${limit}`);

export const activateClientAccountRequest = (id: string) =>
  requestAPI(`${CLIENTS_ENDPOINT}/activar/${id}`, { method: 'PATCH' });

export const deleteClientAccountRequest = (id: string) =>
  requestAPI(`${CLIENTS_ENDPOINT}/${id}`, { method: 'DELETE' });