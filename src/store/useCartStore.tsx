import type { CartItem } from '@/interfaces/Cart';
import type { Client } from '@/interfaces/Client';
import type { Invoice } from '@/interfaces/Invoice';
import type { PersonalizedProduct } from '@/interfaces/PersonalizedProduct';
import type { Product } from '@/interfaces/Product';
import {
  addProductToCartRequest,
  checkoutCartRequest,
  clearCartRequest,
  getClientCartRequest,
  modifyProductQuantityRequest,
  removeProductFromCartRequest,
} from '@/services/CartService';
import { create } from 'zustand';

type ProductType = 'normal' | 'personalizado' | 'ia';

interface CartState {
  products: CartItem[];
  totalProducts: number;
  totalPrice: number;
  actionInCart: string;
  getClientCart: () => Promise<void>;
  addProductToCart: (
    product: Product | PersonalizedProduct,
    quantity: number,
    productType: ProductType,
  ) => Promise<void>;
  modifyProductQuantity: (
    product: Product | PersonalizedProduct,
    quantity: number,
    productType: ProductType,
  ) => void;
  removeProductFromCart: (product_id: string, productType: ProductType) => Promise<void>;
  checkout: (
    paymentMethodId: string,
  ) => Promise<{ ok: boolean; venta: Invoice; msg: string; cliente: Client }>;
  clearCart: () => void;
}

export const useCartStore = create<CartState>(set => ({
  products: [],
  totalProducts: 0,
  totalPrice: 0,
  actionInCart: '',
  getClientCart: async () => {
    const { ok, carrito } = await getClientCartRequest();
    const { productos, total } = carrito;

    if (ok) {
      set({
        products: productos,
        totalProducts: productos.length,
        totalPrice: total,
      });
    }
  },
  addProductToCart: async (product, quantity = 1, productType = 'normal') => {
    const { ok, carrito } = await addProductToCartRequest({
      producto_id: product._id,
      cantidad: quantity,
      tipo_producto: productType,
    });

    if (ok) {
      const { total } = carrito;
      const precio_unitario = product.precio;

      set(({ products, totalProducts }) => {
        const existingProductIndex = products.findIndex(p => p.producto_id === product._id);

        if (existingProductIndex !== -1) {
          const updatedProducts = [...products];
          const existingProduct = { ...updatedProducts[existingProductIndex] };
          existingProduct.cantidad += quantity;
          existingProduct.subtotal += precio_unitario * quantity;
          updatedProducts[existingProductIndex] = existingProduct;

          return {
            products: updatedProducts,
            totalPrice: total,
            actionInCart: '¡Producto añadido al carrito!',
          };
        } else {
          return {
            products: [
              ...products,
              {
                _id: '',
                producto: product,
                producto_id: product._id,
                cantidad: quantity,
                precio_unitario,
                subtotal: precio_unitario * quantity,
                tipo_producto: productType,
              },
            ],
            totalProducts: totalProducts + 1,
            totalPrice: total,
            actionInCart: '¡Producto añadido al carrito!',
          };
        }
      });

      setTimeout(() => {
        set({ actionInCart: '' });
      }, 2000);
    }
  },
  modifyProductQuantity: async (product, quantity, productType) => {
    const { ok, carrito } = await modifyProductQuantityRequest({
      producto_id: product._id,
      cantidad: quantity,
      tipo_producto: productType,
    });

    if (ok) {
      const { total } = carrito;

      set(state => {
        const { products } = state;

        const existingProductIndex = products.findIndex(p => p.producto_id === product._id);

        const updatedProducts = [...products];
        const existingProduct = { ...updatedProducts[existingProductIndex] };
        existingProduct.cantidad += quantity;
        existingProduct.subtotal += existingProduct.precio_unitario * quantity;
        updatedProducts[existingProductIndex] = existingProduct;

        return {
          products: updatedProducts,
          totalPrice: total,
          actionInCart: '¡Cantidad modificada en el carrito!',
        };
      });

      setTimeout(() => {
        set({ actionInCart: '' });
      }, 2000);
    }
  },
  removeProductFromCart: async (productId, productType) => {
    const { ok, carrito } = await removeProductFromCartRequest({
      producto_id: productId,
      tipo_producto: productType,
    });

    if (ok) {
      const { total } = carrito;

      set(({ products, totalProducts }) => ({
        products: products.filter(
          p => !(p.producto_id === productId && p.tipo_producto === productType),
        ),
        totalProducts: totalProducts - 1,
        totalPrice: total,
        actionInCart: '¡Producto eliminado del carrito!',
      }));

      setTimeout(() => {
        set({ actionInCart: '' });
      }, 2000);
    }
  },
  checkout: async paymentMethodId => {
    const { ok, msg, venta, cliente } = await checkoutCartRequest(paymentMethodId);

    if (ok) set({ products: [], totalProducts: 0, totalPrice: 0 });

    return { ok, msg, venta, cliente };
  },

  clearCart: async () => {
    await clearCartRequest();

    set({ products: [], totalProducts: 0, totalPrice: 0 });
  },
}));
