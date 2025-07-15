import type { Category } from './Category';
import type { Ingredient } from './Ingredient';

export interface Product {
  _id: string;
  nombre: string;
  descripcion: string;
  beneficios: string[];
  ingredientes: Ingredient[];
  aroma: string;
  tipo: string;
  precio: number;
  imagen: string;
  stock: number;
  descuento: number;
  id_categoria: Category;
  activo: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFilter {
  key: keyof Product;
  value: string;
}
