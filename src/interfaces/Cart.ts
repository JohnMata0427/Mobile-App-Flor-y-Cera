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

export interface CartItem {
  _id: string;
  producto: Product;
  producto_id: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  tipo_producto: 'normal' | 'personalizado';
}
