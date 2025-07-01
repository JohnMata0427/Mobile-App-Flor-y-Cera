import type { Promotion } from '@/interfaces/Promotion';
import {
  createPromotionRequest,
  deletePromotionRequest,
  getPromotionsRequest,
  updatePromotionRequest,
} from '@/services/PromotionService';
import { useAuthStore } from '@/store/useAuthStore';
import { createContext, useCallback, useEffect, useMemo, useState } from 'react';

interface Response {
  msg: string;
}

interface PromotionsContextProps {
  searchedPromotions: Promotion[];
  loading: boolean;
  refreshing: boolean;
  page: number;
  totalPages: number;
  setRefreshing: React.Dispatch<React.SetStateAction<boolean>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  getPromotions: () => Promise<void>;
  createPromotion: (product: FormData) => Promise<Response>;
  updatePromotion: (productId: string, product: FormData) => Promise<Response>;
  deletePromotion: (productId: string) => Promise<Response>;
}

export const PromotionsContext = createContext<PromotionsContextProps>({
  searchedPromotions: [],
  loading: false,
  refreshing: false,
  page: 1,
  totalPages: 0,
  setRefreshing: () => {},
  setPage: () => {},
  setSearch: () => {},
  getPromotions: async () => {},
  createPromotion: async (_: FormData) => ({ msg: '' }),
  updatePromotion: async (_: string, __: FormData) => ({ msg: '' }),
  deletePromotion: async (_: string) => ({ msg: '' }),
});

export const PromotionsProvider = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuthStore();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(4);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState<string>('');

  const searchedPromotions = useMemo(() => {
    if (search) {
      return promotions.filter(({ nombre }) => nombre.toLowerCase().includes(search.toLowerCase()));
    }
    return promotions;
  }, [promotions, search]);

  const getPromotions = useCallback(async () => {
    try {
      setLoading(true);
      setPromotions([]);
      const { promociones, totalPaginas } = await getPromotionsRequest(page, limit);
      setTotalPages(totalPaginas);
      setPromotions(promociones);
    } catch {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [page, limit]);

  const createPromotion = useCallback(async (product: FormData) => {
    try {
      const { promocion, msg } = await createPromotionRequest(product, token);

      if (promocion?._id && page === totalPages) {
        setPromotions(prev => [...prev, promocion]);
      }

      return { msg };
    } catch {
      return { msg: 'Ocurrio un error al crear el promocion' };
    }
  }, [promotions, token]);

  const updatePromotion = useCallback(async (id: string, product: FormData) => {
    try {
      const { promocion, msg } = await updatePromotionRequest(id, product, token);
      promocion?._id && setPromotions(prev => prev.map(p => (p._id === id ? promocion : p)));
      return { msg };
    } catch {
      return { msg: 'Ocurrio un error al actualizar el promocion' };
    }
  }, [promotions, token]);

  const deletePromotion = useCallback(async (id: string) => {
    try {
      await deletePromotionRequest(id, token);
      setPromotions(prev => prev.filter(({ _id }) => _id !== id));
      return { msg: 'Promotiono eliminado exitosamente' };
    } catch {
      return { msg: 'Ocurrio un error al eliminar el promocion' };
    }
  }, [promotions, token]);

  useEffect(() => {
    getPromotions();
  }, [page, limit]);

  const contextValue = useMemo(
    () => ({
      searchedPromotions,
      loading,
      refreshing,
      page,
      totalPages,
      setRefreshing,
      setPage,
      setSearch,
      getPromotions,
      createPromotion,
      updatePromotion,
      deletePromotion,
    }),
    [
      searchedPromotions,
      loading,
      refreshing,
      page,
      totalPages,
      getPromotions,
      createPromotion,
      updatePromotion,
      deletePromotion,
    ],
  );

  return <PromotionsContext.Provider value={contextValue}>{children}</PromotionsContext.Provider>;
};
