import type { PersonalizedProduct } from '@/interfaces/PersonalizedProduct';
import { requestAPI } from '@/utils/requestAPI';

const PERSONALIZED_PRODUCTS_ENDPOINT = '/productos-personalizados';

export const getPersonalizedProductsRequest = (page: number, limit: number) =>
  requestAPI(`${PERSONALIZED_PRODUCTS_ENDPOINT}?page=${page}&limit=${limit}`);

export const getPersonalizedProductByIdRequest = (id: string) =>
  requestAPI(`${PERSONALIZED_PRODUCTS_ENDPOINT}/${id}`);

export const createPersonalizedProductRequest = (body: Partial<PersonalizedProduct>) =>
  requestAPI(PERSONALIZED_PRODUCTS_ENDPOINT, { method: 'POST', body });

export const uploadPersonalizedProductImageRequest = (id: string, body: FormData) =>
  requestAPI(`${PERSONALIZED_PRODUCTS_ENDPOINT}/${id}/imagen`, { method: 'PUT', body });

export const updatePersonalizedProductRequest = (id: string, body: Partial<PersonalizedProduct>) =>
  requestAPI(`${PERSONALIZED_PRODUCTS_ENDPOINT}/${id}`, { method: 'PUT', body });

export const deletePersonalizedProductRequest = (id: string) =>
  requestAPI(`${PERSONALIZED_PRODUCTS_ENDPOINT}/${id}`, { method: 'DELETE' });
