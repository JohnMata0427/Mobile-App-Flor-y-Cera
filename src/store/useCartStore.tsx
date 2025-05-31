import type { Product } from '@/interfaces/Product';
import {
  addProductToCartRequest,
  clearCartRequest,
  getClientCartRequest,
  modifyProductQuantityRequest,
  removeProductFromCartRequest,
} from '@/services/CartService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getItem } from 'expo-secure-store';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface CartProduct {
  producto_id: string;
  cantidad: number;
}

interface CartState {
  products: Product[];
  totalProducts: number;
  totalPrice: number;
  getClientCart: () => Promise<void>;
  addProductToCart: (_: CartProduct) => void;
  modifyProductQuantity: (_: CartProduct) => void;
  removeProductFromCart: (_: string) => void;
  clearCart: () => void;
}

const token = getItem('token') ?? '';

export const useCartStore = create<CartState>()(
  persist(
    set => ({
      products: [],
      totalProducts: 0,
      totalPrice: 0,
      getClientCart: async () => {
        const { carrito } = await getClientCartRequest(token);

        set({
          products: carrito.productos,
          totalProducts: carrito.totalProductos,
          totalPrice: carrito.totalPrecio,
        });
      },
      addProductToCart: async product => {
        const { carrito } = await addProductToCartRequest(token, product);

        set({ products: carrito.productos });
      },
      modifyProductQuantity: async product => {
        const { carrito } = await modifyProductQuantityRequest(token, product);

        set({ products: carrito.productos });
      },
      removeProductFromCart: async productId => {
        const { carrito } = await removeProductFromCartRequest(
          token,
          productId,
        );

        set({ products: carrito.productos });
      },
      clearCart: async () => {
        await clearCartRequest(token);

        set({ products: [] });
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
