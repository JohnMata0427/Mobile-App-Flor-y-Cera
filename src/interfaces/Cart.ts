import type { PersonalizedProduct } from './PersonalizedProduct';
import type { Product } from './Product';

export interface Cart {
  _id: string;
  cliente_id: string;
  productos: CartItem[];
  total: number;
  fecha_creacion: string;
  estado: 'pendiente' | 'finalizado';
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItemPayload {
  producto_id: string;
  cantidad: number;
  tipo_producto: 'normal' | 'personalizado' | 'ia';
}

export interface CartItem extends CartItemPayload {
  _id: string;
  producto: Product | PersonalizedProduct;
  precio_unitario: number;
  subtotal: number;
}
