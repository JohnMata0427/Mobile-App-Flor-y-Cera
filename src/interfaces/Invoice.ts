import type { Client } from './Client';
import type { Ingredient } from './Ingredient';
import type { Product } from './Product';

export interface Invoice {
  _id: string;
  cliente_id?: string; // <-- Client Response
  cliente: Client;
  total: number;
  estado: 'pendiente' | 'finalizado';
  productos: ProductInfo[];
  fecha_venta?: `${number}-${number}-${number}`;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductInfo {
  _id: string;
  producto_id: string;
  imagen: string;
  precio: number;
  cantidad: number;
  subtotal: number;
  nombre?: string;
  descripcion?: string;
  tipo?: string;
  categoria?: string;
  aroma?: string;
  ingredientes?: Pick<Ingredient, '_id' | 'nombre' | 'imagen'>[];
  producto?: Product;
}

export interface InvoiceFilter {
  key: keyof Invoice;
  value: string;
}
