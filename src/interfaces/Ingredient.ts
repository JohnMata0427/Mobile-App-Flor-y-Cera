import type { Category } from "./Category";

export interface Ingredient {
  _id: string;
  nombre: string;
  imagen: string;
  stock: number;
  id_categoria: Category;
  precio: number;
  tipo: string;
  createdAt?: string;
  updatedAt?: string;
}