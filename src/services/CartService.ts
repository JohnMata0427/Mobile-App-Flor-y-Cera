import type { CartItemPayload } from '@/interfaces/Cart';
import { requestAPI } from '@/utils/requestAPI';

const CARTS_ENDPOINT = '/carritos';

export const getClientCartRequest = () => requestAPI(CARTS_ENDPOINT);

export const addProductToCartRequest = (body: CartItemPayload) =>
  requestAPI(`${CARTS_ENDPOINT}/agregar`, {
    method: 'PUT',
    body,
  });

export const modifyProductQuantityRequest = (body: CartItemPayload) =>
  requestAPI(`${CARTS_ENDPOINT}/modificar-cantidad`, {
    method: 'PUT',
    body,
  });

export const removeProductFromCartRequest = (body: Omit<CartItemPayload, 'cantidad'>) =>
  requestAPI(`${CARTS_ENDPOINT}/eliminar`, {
    method: 'PUT',
    body,
  });

export const getPaymentIntentRequest = () => requestAPI(`${CARTS_ENDPOINT}/iniciar-pago`);

export const checkoutCartRequest = (paymentIntentId: string) =>
  requestAPI(`${CARTS_ENDPOINT}/finalizar-pago`, {
    method: 'POST',
    body: { paymentIntentId },
  });

export const clearCartRequest = () =>
  requestAPI(`${CARTS_ENDPOINT}`, {
    method: 'DELETE',
  });
