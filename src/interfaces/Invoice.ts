import type { Client } from './Client';
import type { Product } from './Product';

export interface Invoice {
  _id: string;
  cliente_id: Pick<Client, '_id' | 'apellido' | 'email' | 'nombre'>;
  productos: ProductInfo[];
  total: number;
  fecha_venta: `${number}-${number}-${number}`;
  estado: 'pendiente' | 'finalizado';
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductInfo {
  _id: string;
  producto_id: Product;
  cantidad: number;
  subtotal: number;
}

export interface InvoiceFilter {
  key: keyof Invoice;
  value: string;
}
