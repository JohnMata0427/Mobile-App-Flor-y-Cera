import type { Client } from './Client';

export interface Invoice {
  __v: number;
  _id: string;
  cliente_id: Pick<Client, '_id' | 'apellido' | 'email' | 'nombre'>;
  createdAt: Date;
  estado: string;
  fecha_venta: Date;
  productos: ProductInfo[];
  total: number;
  updatedAt: Date;
}

export interface ProductInfo {
  _id: string;
  cantidad: number;
  producto_id: string;
  subtotal: number;
}
