import type { Cart } from '@/interfaces/Cart';

const BACKEND_URL = `${process.env.EXPO_PUBLIC_BACKEND_URL}/carritos`;

interface CartResponse {
  ok: boolean;
  msg: string;
  carrito: Cart;
}

export const getClientCartRequest = async (token: string): Promise<CartResponse> => {
  const response = await fetch(BACKEND_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const { ok } = response;
  const { msg, carrito } = await response.json();

  return { ok, msg, carrito };
};

export const addProductToCartRequest = async (
  token: string,
  product: {
    producto_id: string;
    cantidad: number;
    tipo_producto?: string;
  },
): Promise<CartResponse> => {
  const response = await fetch(`${BACKEND_URL}/agregar`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ...product, tipo_producto: 'normal' }),
  });

  const { ok } = response;
  const { msg, carrito } = await response.json();

  return { ok, msg, carrito };
};

export const modifyProductQuantityRequest = async (
  token: string,
  product: {
    producto_id: string;
    cantidad: number;
    tipo_producto?: string;
  },
): Promise<CartResponse> => {
  const response = await fetch(`${BACKEND_URL}/modificar-cantidad`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ...product, tipo_producto: 'normal' }),
  });

  const { ok } = response;
  const { msg, carrito } = await response.json();

  return { ok, msg, carrito };
};

export const removeProductFromCartRequest = async (
  token: string,
  producto_id: string,
): Promise<CartResponse> => {
  const response = await fetch(`${BACKEND_URL}/eliminar`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ producto_id, tipo_producto: 'normal' }),
  });

  const { ok } = response;
  const { msg, carrito } = await response.json();

  return { ok, msg, carrito };
};

export const checkoutCartRequest = async (token: string, paymentMethodId: string): Promise<any> => {
  const response = await fetch(`${BACKEND_URL}/pagar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ paymentMethodId }),
  });
  const { ok } = response;
  const { msg, venta } = await response.json();

  return { ok, msg, venta };
};

export const clearCartRequest = async (token: string): Promise<CartResponse> => {
  const response = await fetch(`${BACKEND_URL}/limpiar`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const { ok } = response;
  const { msg, carrito } = await response.json();

  return { ok, msg, carrito };
};
