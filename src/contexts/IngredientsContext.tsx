import type { Ingredient } from '@/interfaces/Ingredient';
import {
  createIngredientRequest,
  deleteIngredientRequest,
  getIngredientsRequest,
  updateIngredientRequest,
} from '@/services/IngredientService';
import { useAuthStore } from '@/store/useAuthStore';
import { createContext, useCallback, useEffect, useMemo, useState } from 'react';

interface Response {
  msg: string;
}

interface IngredientsContextProps {
  ingredients: Ingredient[];
  loading: boolean;
  setRefreshing: React.Dispatch<React.SetStateAction<number>>;
  createIngredient: (ingredient: FormData) => Promise<Response>;
  updateIngredient: (ingredientId: string, ingredient: FormData) => Promise<Response>;
  deleteIngredient: (ingredientId: string) => Promise<Response>;
}

export const IngredientsContext = createContext<IngredientsContextProps>({
  ingredients: [],
  loading: false,
  setRefreshing: () => {},
  createIngredient: async (_: FormData) => ({ msg: '' }),
  updateIngredient: async (_: string, __: FormData) => ({ msg: '' }),
  deleteIngredient: async (_: string) => ({ msg: '' }),
});

export const IngredientsProvider = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuthStore();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(100);
  const [refreshing, setRefreshing] = useState(0);

  const createIngredient = useCallback(async (ingredient: FormData) => {
    try {
      const { ingrediente } = await createIngredientRequest(ingredient, token);
      setIngredients(prev => [...prev, ingrediente]);
      return { msg: 'Ingrediento creado exitosamente' };
    } catch {
      return { msg: 'Ocurrio un error al crear el ingrediente' };
    }
  }, []);

  const updateIngredient = useCallback(async (id: string, ingredient: FormData) => {
    try {
      const { ingrediente } = await updateIngredientRequest(id, ingredient, token);
      setIngredients(prev => prev.map(p => (p._id === id ? ingrediente : p)));
      return { msg: 'Ingrediento actualizado exitosamente' };
    } catch {
      return { msg: 'Ocurrio un error al actualizar el ingrediente' };
    }
  }, []);

  const deleteIngredient = useCallback(async (id: string) => {
    try {
      await deleteIngredientRequest(id, token);
      setIngredients(prev => prev.filter(({ _id }) => _id !== id));
      return { msg: 'Ingrediento eliminado exitosamente' };
    } catch {
      return { msg: 'Ocurrio un error al eliminar el ingrediente' };
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { ingredientes } = await getIngredientsRequest(page, limit);
        setIngredients(ingredientes);
      } catch {
      } finally {
        setLoading(false);
      }
    })();
  }, [page, limit, refreshing]);

  const contextValue = useMemo(
    () => ({
      ingredients,
      loading,
      setRefreshing,
      createIngredient,
      updateIngredient,
      deleteIngredient,
    }),
    [
      ingredients,
      loading,
      setRefreshing,
      createIngredient,
      updateIngredient,
      deleteIngredient,
    ],
  );

  return (
    <IngredientsContext.Provider value={contextValue}>
      {children}
    </IngredientsContext.Provider>
  );
};
