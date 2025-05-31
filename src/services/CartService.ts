const BACKEND_URL = `${process.env.EXPO_PUBLIC_BACKEND_URL}/carritos`;

export const getClientCartRequest = async (token: string) => {
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
  },
) => {
  const response = await fetch(`${BACKEND_URL}/agregar`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(product),
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
  },
) => {
  const response = await fetch(`${BACKEND_URL}/modificar-cantidad`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(product),
  });

  const { ok } = response;
  const { msg, carrito } = await response.json();

  return { ok, msg, carrito };
};

export const removeProductFromCartRequest = async (
  token: string,
  producto_id: string,
) => {
  const response = await fetch(`${BACKEND_URL}/eliminar`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ producto_id }),
  });

  const { ok } = response;
  const { msg, carrito } = await response.json();

  return { ok, msg, carrito };
};

export const clearCartRequest = async (token: string) => {
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
