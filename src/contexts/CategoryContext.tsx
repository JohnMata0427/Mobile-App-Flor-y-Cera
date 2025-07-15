import type { Category } from '@/interfaces/Category';
import { getCategoriesRequest, updateCategoryRequest } from '@/services/CategoryService';
import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';

interface CategoriesContextProps {
  categories: Category[];
  loading: boolean;
  refreshing: boolean;
  setRefreshing: Dispatch<SetStateAction<boolean>>;
  getCategories: () => Promise<void>;
  updateCategory: (
    categoryId: string,
    category: FormData,
  ) => Promise<{
    msg: string;
  }>;
}

export const CategoriesContext = createContext<CategoriesContextProps>(
  {} as CategoriesContextProps,
);

export const CategoriesProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const getCategories = async () => {
    setLoading(true);
    try {
      const { categorias } = await getCategoriesRequest();
      setCategories(categorias);
    } catch {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const updateCategory = async (id: string, category: FormData) => {
    try {
      const { categoria, msg } = await updateCategoryRequest(id, category);
      if (categoria?._id) setCategories(prev => prev.map(p => (p._id === id ? categoria : p)));
      return { msg };
    } catch {
      return { msg: 'Ocurrio un error al actualizar el categoria' };
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const contextValue = useMemo(
    () => ({
      categories,
      loading,
      refreshing,
      setRefreshing,
      getCategories,
      updateCategory,
    }),
    [loading, refreshing, categories],
  );

  return <CategoriesContext.Provider value={contextValue}>{children}</CategoriesContext.Provider>;
};
