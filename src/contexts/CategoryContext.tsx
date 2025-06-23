import type { Category } from '@/interfaces/Category';
import {
  createCategoryRequest,
  deleteCategoryRequest,
  getCategoriesRequest,
  updateCategoryRequest,
} from '@/services/CategoryService';
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
  createCategory: (category: FormData) => Promise<Response>;
  updateCategory: (categoryId: string, category: FormData) => Promise<Response>;
  deleteCategory: (categoryId: string) => Promise<Response>;
}

export const CategoriesContext = createContext<CategoriesContextProps>({
  categories: [],
  loading: false,
  refreshing: false,
  setRefreshing: () => {},
  getCategories: async () => {},
  createCategory: async (_: FormData) => ({ msg: '' }),
  updateCategory: async (_: string, __: FormData) => ({ msg: '' }),
  deleteCategory: async (_: string) => ({ msg: '' }),
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

  const createCategory = useCallback(async (category: FormData) => {
    try {
      const { categoria, msg } = await createCategoryRequest(category, token);

      if (categoria?._id) {
        setCategories(prev => [...prev, categoria]);
      }

      return { msg };
    } catch {
      return { msg: 'Ocurrio un error al crear el categoria' };
    }
  }, []);

  const updateCategory = useCallback(async (id: string, category: FormData) => {
    try {
      const { categoria, msg } = await updateCategoryRequest(id, category, token);
      categoria?._id &&
        setCategories(prev => prev.map(p => (p._id === id ? categoria : p)));
      return { msg };
    } catch {
      return { msg: 'Ocurrio un error al actualizar el categoria' };
    }
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    try {
      await deleteCategoryRequest(id, token);
      setCategories(prev => prev.filter(({ _id }) => _id !== id));
      return { msg: 'Categoryo eliminado exitosamente' };
    } catch {
      return { msg: 'Ocurrio un error al eliminar el categoria' };
    }
  }, []);

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
      createCategory,
      updateCategory,
      deleteCategory,
    }),
    [
      categories,
      loading,
      refreshing,
      setRefreshing,
      getCategories,
      createCategory,
      updateCategory,
      deleteCategory,
    ],
  );

  return (
    <CategoriesContext.Provider value={contextValue}>
      {children}
    </CategoriesContext.Provider>
  );
};
