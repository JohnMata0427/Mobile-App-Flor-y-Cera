import type { Category } from '@/interfaces/Category';
import { getCategoriesRequest, updateCategoryRequest } from '@/services/CategoryService';
import { useAuthStore } from '@/store/useAuthStore';
import { createContext, useCallback, useEffect, useMemo, useState } from 'react';

interface Response {
  msg: string;
}

interface CategoriesContextProps {
  categories: Category[];
  loading: boolean;
  refreshing: boolean;
  setRefreshing: React.Dispatch<React.SetStateAction<boolean>>;
  getCategories: () => Promise<void>;
  updateCategory: (categoryId: string, category: FormData) => Promise<Response>;
}

export const CategoriesContext = createContext<CategoriesContextProps>({
  categories: [],
  loading: false,
  refreshing: false,
  setRefreshing: () => {},
  getCategories: async () => {},
  updateCategory: async (_: string, __: FormData) => ({ msg: '' }),
});

export const CategoriesProvider = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuthStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const getCategories = useCallback(async () => {
    try {
      setLoading(true);
      setCategories([]);
      const { categorias } = await getCategoriesRequest();
      setCategories(categorias);
    } catch {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const updateCategory = async (id: string, category: FormData) => {
    try {
      const { categoria, msg } = await updateCategoryRequest(id, category, token);
      categoria?._id && setCategories(prev => prev.map(p => (p._id === id ? categoria : p)));
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
    [categories, loading, refreshing, getCategories],
  );

  return <CategoriesContext.Provider value={contextValue}>{children}</CategoriesContext.Provider>;
};
