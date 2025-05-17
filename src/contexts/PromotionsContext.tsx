import type { Promotion } from '@/interfaces/Promotion';
import {
  createPromotionRequest,
  deletePromotionRequest,
  getPromotionsRequest,
  updatePromotionRequest,
} from '@/services/PromotionService';
import { useAuthStore } from '@/store/useAuthStore';
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

interface Response {
  msg: string;
}

interface PromotionsContextProps {
  promotions: Promotion[];
  loading: boolean;
  refreshing: boolean;
  page: number;
  totalPages: number;
  setRefreshing: React.Dispatch<React.SetStateAction<boolean>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  getPromotions: () => Promise<void>;
  createPromotion: (product: FormData) => Promise<Response>;
  updatePromotion: (productId: string, product: FormData) => Promise<Response>;
  deletePromotion: (productId: string) => Promise<Response>;
}

export const PromotionsContext = createContext<PromotionsContextProps>({
  promotions: [],
  loading: false,
  refreshing: false,
  page: 1,
  totalPages: 0,
  setRefreshing: () => {},
  setPage: () => {},
  getPromotions: async () => {},
  createPromotion: async (_: FormData) => ({ msg: '' }),
  updatePromotion: async (_: string, __: FormData) => ({ msg: '' }),
  deletePromotion: async (_: string) => ({ msg: '' }),
});

export const PromotionsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { token } = useAuthStore();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(4);
  const [refreshing, setRefreshing] = useState(false);

  const getPromotions = useCallback(async () => {
    try {
      setLoading(true);
      setPromotions([]);
      const { promociones, totalPaginas } = await getPromotionsRequest(
        page,
        limit,
      );
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
      const { producto, msg } = await createPromotionRequest(product, token);

      if (producto?._id && page === totalPages) {
        setPromotions(prev => [...prev, producto]);
      }

      return { msg };
    } catch (error) {
      console.error('Error creating product:', error);
      return { msg: 'Ocurrio un error al crear el producto' };
    }
  }, []);

  const updatePromotion = useCallback(async (id: string, product: FormData) => {
    try {
      const { producto, msg } = await updatePromotionRequest(
        id,
        product,
        token,
      );
      producto?._id &&
        setPromotions(prev => prev.map(p => (p._id === id ? producto : p)));
      return { msg };
    } catch (error) {
      console.error('Error updating product:', error);
      return { msg: 'Ocurrio un error al actualizar el producto' };
    }
  }, []);

  const deletePromotion = useCallback(async (id: string) => {
    try {
      await deletePromotionRequest(id, token);
      setPromotions(prev => prev.filter(({ _id }) => _id !== id));
      return { msg: 'Promotiono eliminado exitosamente' };
    } catch (error) {
      console.error('Error deleting product:', error);
      return { msg: 'Ocurrio un error al eliminar el producto' };
    }
  }, []);

  useEffect(() => {
    getPromotions();
  }, [page, limit]);

  const contextValue = useMemo(
    () => ({
      promotions,
      loading,
      refreshing,
      page,
      totalPages,
      setRefreshing,
      setPage,
      getPromotions,
      createPromotion,
      updatePromotion,
      deletePromotion,
    }),
    [
      promotions,
      loading,
      refreshing,
      page,
      totalPages,
      setRefreshing,
      setPage,
      getPromotions,
      createPromotion,
      updatePromotion,
      deletePromotion,
    ],
  );

  return (
    <PromotionsContext.Provider value={contextValue}>
      {children}
    </PromotionsContext.Provider>
  );
};
