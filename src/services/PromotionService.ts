import { requestAPI } from '@/utils/requestAPI';

const PROMOTIONS_ENDPOINT = '/promociones';

export const getPromotionsRequest = (page: number, limit: number) =>
  requestAPI(`${PROMOTIONS_ENDPOINT}?page=${page}&limit=${limit}`);

export const createPromotionRequest = (body: FormData) =>
  requestAPI(PROMOTIONS_ENDPOINT, { method: 'POST', body });

export const updatePromotionRequest = (id: string, body: FormData) =>
  requestAPI(`${PROMOTIONS_ENDPOINT}/${id}`, { method: 'PUT', body });

export const deletePromotionRequest = (id: string) =>
  requestAPI(`${PROMOTIONS_ENDPOINT}/${id}`, { method: 'DELETE' });
