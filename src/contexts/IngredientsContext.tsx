import { useEntityManagement } from '@/hooks/useEntityManagement';
import type { Ingredient, IngredientFilter } from '@/interfaces/Ingredient';
import {
  createIngredientRequest,
  deleteIngredientRequest,
  getIngredientsRequest,
  updateIngredientRequest,
} from '@/services/IngredientService';
import { createContext, useMemo, type Dispatch, type ReactNode, type SetStateAction } from 'react';

interface Response {
  msg: string;
}

interface IngredientsContextProps {
  ingredients: Ingredient[];
  searchedIngredients: Ingredient[];
  loading: boolean;
  refreshing: boolean;
  page: number;
  totalPages: number;
  filter: IngredientFilter;
  setRefreshing: Dispatch<SetStateAction<boolean>>;
  setPage: Dispatch<SetStateAction<number>>;
  setLimit: Dispatch<SetStateAction<number>>;
  setFilter: Dispatch<SetStateAction<IngredientFilter>>;
  setSearch: Dispatch<SetStateAction<string>>;
  getIngredients: () => Promise<void>;
  createIngredient: (ingredient: FormData) => Promise<Response>;
  updateIngredient: (ingredientId: string, ingredient: FormData) => Promise<Response>;
  deleteIngredient: (ingredientId: string) => Promise<Response>;
}

export const IngredientsContext = createContext<IngredientsContextProps>(
  {} as IngredientsContextProps,
);

const filterFunction = (ingredients: Ingredient[], filter: IngredientFilter) => {
  const { key, value } = filter;
  if (value) {
    return ingredients?.filter(({ id_categoria, tipo }) => {
      if (key === 'id_categoria') {
        return id_categoria.some(cat => cat === value);
      }
      return tipo === value;
    });
  }
  return ingredients;
};

const searchFunction = (ingredients: Ingredient[], search: string) => {
  if (search.trim()) {
    const searchLower = search.toLowerCase().trim();
    return ingredients?.filter(({ nombre }) => nombre.toLowerCase().includes(searchLower)) || [];
  }
  return ingredients;
};

export const IngredientsProvider = ({ children }: { children: ReactNode }) => {
  const fetchEntities = async (page: number, limit: number) => {
    const { ingredientes, totalPaginas } = await getIngredientsRequest(page, limit);
    return { data: ingredientes, totalPages: totalPaginas };
  };

  const {
    entities: ingredients,
    setEntities: setIngredients,
    loading,
    refreshing,
    page,
    totalPages,
    filter,
    searchedEntities: searchedIngredients,
    setRefreshing,
    setPage,
    setLimit,
    setFilter,
    setSearch,
    getEntities: getIngredients,
  } = useEntityManagement<Ingredient>({
    fetchEntities,
    filterFunction,
    searchFunction,
    initialFilter: { key: 'tipo', value: '' },
  });

  const createIngredient = async (ingredient: FormData) => {
    try {
      const { ingrediente, msg } = await createIngredientRequest(ingredient);
      if (ingrediente?._id) setIngredients(prev => [...prev, ingrediente]);
      return { msg };
    } catch {
      return { msg: 'Ocurrió un error al crear el ingrediente' };
    }
  };

  const updateIngredient = async (id: string, ingredient: FormData) => {
    try {
      const { ingrediente, msg } = await updateIngredientRequest(id, ingredient);
      if (ingrediente?._id) setIngredients(prev => prev.map(p => (p._id === id ? ingrediente : p)));
      return { msg };
    } catch {
      return { msg: 'Ocurrió un error al actualizar el ingrediente' };
    }
  };

  const deleteIngredient = async (id: string) => {
    try {
      await deleteIngredientRequest(id);
      setIngredients(prev => prev.filter(({ _id }) => _id !== id));
      return { msg: 'Ingrediente eliminado exitosamente' };
    } catch {
      return { msg: 'Ocurrió un error al eliminar el ingrediente' };
    }
  };

  const contextValue = useMemo(
    () => ({
      ingredients,
      searchedIngredients,
      loading,
      refreshing,
      page,
      totalPages,
      filter,
      setRefreshing,
      setPage,
      setLimit,
      setFilter,
      setSearch,
      getIngredients,
      createIngredient,
      updateIngredient,
      deleteIngredient,
    }),
    [
      ingredients,
      searchedIngredients,
      loading,
      refreshing,
      page,
      totalPages,
      filter,
      getIngredients,
      setRefreshing,
      setPage,
      setLimit,
      setFilter,
      setSearch,
      createIngredient,
      updateIngredient,
      deleteIngredient,
    ],
  );

  return <IngredientsContext.Provider value={contextValue}>{children}</IngredientsContext.Provider>;
};
