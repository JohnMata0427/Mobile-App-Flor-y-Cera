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

export const checkoutCartRequest = (paymentMethodId: string) =>
  requestAPI(`${CARTS_ENDPOINT}/pagar`, {
    method: 'POST',
    body: { paymentMethodId },
  });

export const clearCartRequest = () =>
  requestAPI(`${CARTS_ENDPOINT}`, {
    method: 'DELETE',
  });
