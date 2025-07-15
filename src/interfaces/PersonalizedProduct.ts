import type { Category } from './Category';
import type { Client } from './Client';
import type { Ingredient } from './Ingredient';

export interface PersonalizedProduct {
  _id: string;
  cliente_id: Client | string;
  ingredientes: Ingredient[] | string[];
  id_categoria: Category | string;
  precio: number;
  imagen: string;
  aroma: string;
  tipo_producto: 'personalizado' | 'ia';
  createdAt?: string;
  updatedAt?: string;
}
