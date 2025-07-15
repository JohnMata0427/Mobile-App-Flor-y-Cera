import { requestAPI } from '@/utils/requestAPI';

const INGREDIENTS_ENDPOINT = '/ingredientes';

export const getIngredientsRequest = (page: number, limit: number) =>
  requestAPI(`${INGREDIENTS_ENDPOINT}?page=${page}&limit=${limit}`);

export const createIngredientRequest = (body: FormData) =>
  requestAPI(INGREDIENTS_ENDPOINT, { method: 'POST', body });

export const updateIngredientRequest = (id: string, body: FormData) =>
  requestAPI(`${INGREDIENTS_ENDPOINT}/${id}`, { method: 'PUT', body });

export const deleteIngredientRequest = (id: string) =>
  requestAPI(`${INGREDIENTS_ENDPOINT}/${id}`, { method: 'DELETE' });
