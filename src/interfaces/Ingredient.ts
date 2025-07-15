export type IngredientType = 'molde' | 'aroma' | 'esencia' | 'color';

export interface Ingredient {
  _id: string;
  nombre: string;
  imagen: string;
  stock: number;
  id_categoria: string[];
  precio: number;
  tipo: IngredientType;
  createdAt?: string;
  updatedAt?: string;
}

export interface IngredientFilter {
  key: keyof Ingredient;
  value: string;
}
