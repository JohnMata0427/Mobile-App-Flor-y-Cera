import type { Ingredient, IngredientFilter } from '@/interfaces/Ingredient';
import {
  createIngredientRequest,
  deleteIngredientRequest,
  getIngredientsRequest,
  updateIngredientRequest,
} from '@/services/IngredientService';
import { useAuthStore } from '@/store/useAuthStore';
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';

interface Response {
  msg: string;
}

interface IngredientsContextProps {
  searchedIngredients: Ingredient[];
  ingredients: Ingredient[];
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

export const IngredientsContext = createContext<IngredientsContextProps>({
  searchedIngredients: [],
  ingredients: [],
  loading: false,
  refreshing: false,
  page: 1,
  totalPages: 0,
  filter: { key: 'tipo', value: '' },
  setRefreshing: () => {},
  setPage: () => {},
  setLimit: () => {},
  setFilter: () => {},
  setSearch: () => {},
  getIngredients: async () => {},
  createIngredient: async (_: FormData) => ({ msg: '' }),
  updateIngredient: async (_: string, __: FormData) => ({ msg: '' }),
  deleteIngredient: async (_: string) => ({ msg: '' }),
});

export const IngredientsProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useAuthStore();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(100);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [filter, setFilter] = useState<IngredientFilter>({ key: 'tipo', value: '' });
  const [search, setSearch] = useState<string>('');

  const filteredIngredients = useMemo<Ingredient[]>(() => {
    const { key, value } = filter;
    if (value) {
      return ingredients.filter(({ id_categoria, tipo }) => {
        if (key === 'id_categoria') {
          return id_categoria.some(cat => cat === value);
        }
        return tipo === value;
      });
    }
    return ingredients;
  }, [ingredients, filter]);

  const searchedIngredients = useMemo<Ingredient[]>(() => {
    if (search) {
      return filteredIngredients.filter(({ nombre }) =>
        nombre.toLowerCase().includes(search.toLowerCase()),
      );
    }
    return filteredIngredients;
  }, [filteredIngredients, search]);

  const getIngredients = useCallback(async () => {
    try {
      setLoading(true);
      setIngredients([]);
      const { ingredientes, totalPaginas } = await getIngredientsRequest(page, limit);
      setTotalPages(totalPaginas);
      setIngredients(ingredientes);
    } catch {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [page, limit]);

  const createIngredient = async (ingredient: FormData) => {
    try {
      const { ingrediente, msg } = await createIngredientRequest(ingredient, token);
      ingrediente?._id && setIngredients(prev => [...prev, ingrediente]);
      return { msg };
    } catch {
      return { msg: 'Ocurrio un error al crear el ingrediente' };
    }
  };

  const updateIngredient = async (id: string, ingredient: FormData) => {
    try {
      const { ingrediente, msg } = await updateIngredientRequest(id, ingredient, token);
      ingrediente?._id && setIngredients(prev => prev.map(p => (p._id === id ? ingrediente : p)));
      return { msg };
    } catch {
      return { msg: 'Ocurrio un error al actualizar el ingrediente' };
    }
  };

  const deleteIngredient = async (id: string) => {
    try {
      await deleteIngredientRequest(id, token);
      setIngredients(prev => prev.filter(({ _id }) => _id !== id));
      return { msg: 'Ingrediente eliminado exitosamente' };
    } catch {
      return { msg: 'Ocurrio un error al eliminar el ingrediente' };
    }
  };

  useEffect(() => {
    getIngredients();
  }, [page, limit]);

  const contextValue = useMemo(
    () => ({
      searchedIngredients,
      ingredients,
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
      searchedIngredients,
      loading,
      refreshing,
      page,
      totalPages,
      filter,
      getIngredients,
      createIngredient,
      updateIngredient,
      deleteIngredient,
    ],
  );

  return <IngredientsContext.Provider value={contextValue}>{children}</IngredientsContext.Provider>;
};
