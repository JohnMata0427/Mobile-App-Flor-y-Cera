import { useEntityManagement, type Filter } from '@/hooks/useEntityManagement';
import type { Promotion } from '@/interfaces/Promotion';
import { sendNotificationToAllClients } from '@/services/NotificationService';
import {
  createPromotionRequest,
  deletePromotionRequest,
  getPromotionsRequest,
  updatePromotionRequest,
} from '@/services/PromotionService';
import {
  createContext,
  useCallback,
  useMemo,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';

interface PromotionsContextProps {
  promotions: Promotion[];
  searchedPromotions: Promotion[];
  loading: boolean;
  refreshing: boolean;
  page: number;
  totalPages: number;
  setRefreshing: Dispatch<SetStateAction<boolean>>;
  setPage: Dispatch<SetStateAction<number>>;
  setLimit: Dispatch<SetStateAction<number>>;
  setSearch: Dispatch<SetStateAction<string>>;
  getPromotions: () => Promise<void>;
  createPromotion: (product: FormData) => Promise<{
    msg: string;
  }>;
  updatePromotion: (
    productId: string,
    product: FormData,
  ) => Promise<{
    msg: string;
  }>;
  deletePromotion: (productId: string) => Promise<{
    msg: string;
  }>;
}

export const PromotionsContext = createContext<PromotionsContextProps>(
  {} as PromotionsContextProps,
);

const searchFunction = (promotions: Promotion[], search: string) => {
  const searchLower = search.toLowerCase().trim();
  if (searchLower) {
    return promotions?.filter(({ nombre }) => nombre.toLowerCase().includes(searchLower));
  }
  return promotions;
};

export const PromotionsProvider = ({ children }: { children: ReactNode }) => {
  const fetchEntities = async (page: number, limit: number) => {
    const { promociones, totalPaginas } = await getPromotionsRequest(page, limit);
    return { data: promociones, totalPages: totalPaginas };
  };

  const {
    entities: promotions,
    setEntities: setPromotions,
    loading,
    refreshing,
    page,
    totalPages,
    searchedEntities: searchedPromotions,
    setRefreshing,
    setPage,
    setLimit,
    setSearch,
    getEntities: getPromotions,
  } = useEntityManagement<Promotion>({
    fetchEntities,
    filterFunction: p => p,
    searchFunction,
    initialFilter: {} as Filter<Promotion>,
  });

  const createPromotion = useCallback(
    async (product: FormData) => {
      try {
        const { promocion, msg } = await createPromotionRequest(product);
        if (promocion?._id) {
          setPromotions(prev => [...prev, promocion]);
          await sendNotificationToAllClients({
            titulo: '¡Nueva promoción disponible 🎉!',
            mensaje: promocion.nombre,
            imagen: promocion.imagen,
          });
        }
        return { msg };
      } catch {
        return { msg: 'Ocurrio un error al crear el promocion' };
      }
    },
    [setPromotions],
  );

  const updatePromotion = useCallback(
    async (id: string, product: FormData) => {
      try {
        const { promocion, msg } = await updatePromotionRequest(id, product);
        if (promocion?._id) setPromotions(prev => prev.map(p => (p._id === id ? promocion : p)));
        return { msg };
      } catch {
        return { msg: 'Ocurrio un error al actualizar el promocion' };
      }
    },
    [setPromotions],
  );

  const deletePromotion = useCallback(
    async (id: string) => {
      try {
        await deletePromotionRequest(id);
        setPromotions(prev => prev.filter(({ _id }) => _id !== id));
        return { msg: 'Promotiono eliminado exitosamente' };
      } catch {
        return { msg: 'Ocurrio un error al eliminar el promocion' };
      }
    },
    [setPromotions],
  );

  const contextValue = useMemo(
    () => ({
      promotions,
      searchedPromotions,
      loading,
      refreshing,
      page,
      totalPages,
      setRefreshing,
      setPage,
      setLimit,
      setSearch,
      getPromotions,
      createPromotion,
      updatePromotion,
      deletePromotion,
    }),
    [
      promotions,
      searchedPromotions,
      loading,
      refreshing,
      page,
      totalPages,
      getPromotions,
      createPromotion,
      updatePromotion,
      deletePromotion,
      setRefreshing,
      setPage,
      setLimit,
      setSearch,
    ],
  );

  return <PromotionsContext.Provider value={contextValue}>{children}</PromotionsContext.Provider>;
};
