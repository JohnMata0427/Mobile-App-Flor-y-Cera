import type { CartItem } from '@/interfaces/Cart';
import type { Product } from '@/interfaces/Product';
import {
  addProductToCartRequest,
  checkoutCartRequest,
  clearCartRequest,
  getClientCartRequest,
  modifyProductQuantityRequest,
  removeProductFromCartRequest,
} from '@/services/CartService';
import { getItem } from 'expo-secure-store';
import { create } from 'zustand';

interface CartState {
  products: CartItem[];
  totalProducts: number;
  totalPrice: number;
  getClientCart: () => Promise<void>;
  addProductToCart: (product: Product, quantity: number) => void;
  modifyProductQuantity: (product: Product, quantity: number) => void;
  removeProductFromCart: (product_id: string) => void;
  checkout: (paymentMethodId: string) => Promise<string>;
  clearCart: () => void;
}

const token = getItem('token') ?? '';

export const useCartStore = create<CartState>(set => ({
  products: [],
  totalProducts: 0,
  totalPrice: 0,
  getClientCart: async () => {
    const { carrito } = await getClientCartRequest(token);
    const { productos, total } = carrito;

    set({
      products: productos,
      totalProducts: productos.length,
      totalPrice: total,
    });
  },
  addProductToCart: async (product, quantity = 1) => {
    const { ok, carrito } = await addProductToCartRequest(token, {
      producto_id: product._id,
      cantidad: quantity,
    });

    if (ok) {
      const { total } = carrito;
      const precio_unitario = product.precio;

      set(({ products, totalProducts }) => {
        const existingProductIndex = products.findIndex(p => p.producto_id._id === product._id);

        if (existingProductIndex !== -1) {
          const existingProduct = products[existingProductIndex];
          existingProduct.cantidad += quantity;
          existingProduct.subtotal += precio_unitario * quantity;

          products[existingProductIndex] = existingProduct;
        } else {
          products.push({
            _id: '',
            producto_id: product,
            cantidad: quantity,
            precio_unitario,
            subtotal: precio_unitario * quantity,
          });

          totalProducts += 1;
        }

        return { products, totalProducts, totalPrice: total };
      });
    }
  },
  modifyProductQuantity: async (product, quantity) => {
    const { ok, carrito } = await modifyProductQuantityRequest(token, {
      producto_id: product._id,
      cantidad: quantity,
    });

    if (ok) {
      const { total } = carrito;

      set(({ products }) => {
        const existingProductIndex = products.findIndex(p => p.producto_id._id === product._id);

        if (existingProductIndex !== -1) {
          const existingProduct = products[existingProductIndex];
          existingProduct.cantidad += quantity;
          existingProduct.subtotal += existingProduct.precio_unitario * quantity;

          products[existingProductIndex] = existingProduct;
        }

        return {
          products,
          totalPrice: total,
        };
      });
    }
  },
  removeProductFromCart: async productId => {
    const { ok, carrito } = await removeProductFromCartRequest(token, productId);

    if (ok) {
      const { total } = carrito;

      set(({ products, totalProducts }) => {
        const updatedProducts = products.filter(p => p.producto_id._id !== productId);

        totalProducts -= 1;

        return {
          products: updatedProducts,
          totalProducts,
          totalPrice: total,
        };
      });
    }
  },
  checkout: async paymentMethodId => {
    const { ok, msg } = await checkoutCartRequest(token, paymentMethodId);

    if (ok) set({ products: [], totalProducts: 0, totalPrice: 0 });

    return msg;
  },

  clearCart: async () => {
    await clearCartRequest(token);

    set({ products: [], totalProducts: 0, totalPrice: 0 });
  },
}));
