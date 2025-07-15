import { requestAPI } from '@/utils/requestAPI';

const CATEGORIES_ENDPOINT = '/categorias';

export const getCategoriesRequest = () => requestAPI(CATEGORIES_ENDPOINT);

export const createCategoryRequest = (body: FormData) =>
  requestAPI(CATEGORIES_ENDPOINT, { method: 'POST', body });

export const updateCategoryRequest = (id: string, body: FormData) =>
  requestAPI(`${CATEGORIES_ENDPOINT}/${id}`, { method: 'PUT', body });

export const deleteCategoryRequest = (id: string) =>
  requestAPI(`${CATEGORIES_ENDPOINT}/${id}`, { method: 'DELETE' });
