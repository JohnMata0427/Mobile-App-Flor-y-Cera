export interface Ingredient {
  _id: string;
  nombre: string;
  imagen: string;
  stock: number;
  id_categoria: string[];
  precio: number;
  tipo: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IngredientFilter {
  key: keyof Ingredient;
  value: string;
}