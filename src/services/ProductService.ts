import { requestAPI } from '@/utils/requestAPI';

const PRODUCTS_ENDPOINT = '/productos';

export const getProductsRequest = (page = 1, limit = 10) =>
  requestAPI(`${PRODUCTS_ENDPOINT}?page=${page}&limit=${limit}`);

export const getProductByIdRequest = (id: string) => requestAPI(`${PRODUCTS_ENDPOINT}/${id}`);

export const getProductsByNameRequest = (name: string) =>
  requestAPI(`${PRODUCTS_ENDPOINT}?nombre=${encodeURIComponent(name)}`);

export const createProductRequest = (body: FormData) =>
  requestAPI(PRODUCTS_ENDPOINT, { method: 'POST', body });

export const updateProductRequest = (id: string, body: FormData) =>
  requestAPI(`${PRODUCTS_ENDPOINT}/${id}`, { method: 'PUT', body });

export const deleteProductRequest = (id: string) =>
  requestAPI(`${PRODUCTS_ENDPOINT}/${id}`, { method: 'DELETE' });

export const getIntelligenceArtificialRecomendation = (id_categoria: string) =>
  requestAPI(`${PRODUCTS_ENDPOINT}/recomendacion`, { method: 'POST', body: { id_categoria } });
