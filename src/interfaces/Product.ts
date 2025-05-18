import type { Ingredient } from './Ingredient';

export interface Product {
  __v: number;
  _id: string;
  activo: boolean;
  aroma: string;
  beneficios: string[];
  createdAt: Date;
  descripcion: string;
  descuento: string;
  id_categoria: IDCategoria | string;
  imagen: string;
  imagen_id: string;
  ingredientes: string[] | Ingredient[];
  nombre: string;
  precio: string;
  stock: string;
  tipo: string;
  updatedAt: Date;
}

export interface IDCategoria {
  __v: number;
  _id: string;
  createdAt: Date;
  descripcion: string;
  imagen: string;
  imagen_id: string;
  nombre: string;
  updatedAt: Date;
}
