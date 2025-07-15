import { useEntityManagement, type Filter } from '@/hooks/useEntityManagement';
import type { PersonalizedProduct } from '@/interfaces/PersonalizedProduct';
import {
  createPersonalizedProductRequest,
  deletePersonalizedProductRequest,
  getPersonalizedProductsRequest,
  updatePersonalizedProductRequest,
  uploadPersonalizedProductImageRequest,
} from '@/services/PersonalizedProductService';
import { createContext, useMemo, type Dispatch, type ReactNode, type SetStateAction } from 'react';

interface PersonalizedProductsContextProps {
  searchedPersonalizedProducts: PersonalizedProduct[];
  loading: boolean;
  refreshing: boolean;
  page: number;
  totalPages: number;
  setRefreshing: Dispatch<SetStateAction<boolean>>;
  setPage: Dispatch<SetStateAction<number>>;
  setLimit: Dispatch<SetStateAction<number>>;
  setSearch: Dispatch<SetStateAction<string>>;
  getPersonalizedProducts: () => Promise<void>;
  createPersonalizedProduct: (product: Partial<PersonalizedProduct>) => Promise<any>;
  uploadPersonalizedProductImage: (productId: string, image: FormData) => Promise<any>;
  updatePersonalizedProduct: (
    productId: string,
    product: Partial<PersonalizedProduct>,
  ) => Promise<any>;
  deletePersonalizedProduct: (productId: string) => Promise<any>;
}

export const PersonalizedProductsContext = createContext<PersonalizedProductsContextProps>(
  {} as PersonalizedProductsContextProps,
);

const searchFunction = (products: PersonalizedProduct[], search: string) => {
  const searchLower = search.toLowerCase().trim();
  if (searchLower) {
    return products?.filter(
      ({ tipo_producto, aroma }) =>
        tipo_producto.toLowerCase().includes(searchLower) ||
        aroma.toLowerCase().includes(searchLower),
    );
  }
  return products;
};

export const PersonalizedProductsProvider = ({ children }: { children: ReactNode }) => {
  const fetchEntities = async (page: number, limit: number) => {
    const { productos, totalPaginas } = await getPersonalizedProductsRequest(page, limit);
    return { data: productos, totalPages: totalPaginas };
  };

  const {
    setEntities: setPersonalizedProducts,
    loading,
    refreshing,
    page,
    totalPages,
    searchedEntities: searchedPersonalizedProducts,
    setRefreshing,
    setPage,
    setLimit,
    setSearch,
    getEntities: getPersonalizedProducts,
  } = useEntityManagement<PersonalizedProduct>({
    fetchEntities,
    filterFunction: p => p,
    searchFunction,
    initialFilter: {} as Filter<PersonalizedProduct>,
  });

  const uploadPersonalizedProductImage = async (id: string, image: FormData) => {
    try {
      const { producto_personalizado, msg, ok } = await uploadPersonalizedProductImageRequest(
        id,
        image,
      );
      if (producto_personalizado?._id) getPersonalizedProducts();
      return { msg, ok };
    } catch {
      return { msg: 'Ocurrio un error al subir la imagen del producto', ok: false };
    }
  };

  const createPersonalizedProduct = async (product: Partial<PersonalizedProduct>) => {
    try {
      const { producto_personalizado, msg } = await createPersonalizedProductRequest(product);
      const { _id } = producto_personalizado || {};
      return { msg, _id };
    } catch {
      return { msg: 'Ocurrio un error al crear el producto' };
    }
  };

  const updatePersonalizedProduct = async (id: string, product: Partial<PersonalizedProduct>) => {
    try {
      const { producto, msg } = await updatePersonalizedProductRequest(id, product);
      if (producto?._id) getPersonalizedProducts();
      return { msg };
    } catch {
      return { msg: 'Ocurrio un error al actualizar el producto' };
    }
  };

  const deletePersonalizedProduct = async (id: string) => {
    try {
      await deletePersonalizedProductRequest(id);
      setPersonalizedProducts(prev => prev.filter(({ _id }) => _id !== id));
      return { msg: 'PersonalizedProducto eliminado exitosamente' };
    } catch {
      return { msg: 'Ocurrio un error al eliminar el producto' };
    }
  };

  const contextValue = useMemo(
    () => ({
      searchedPersonalizedProducts,
      loading,
      refreshing,
      page,
      totalPages,
      setRefreshing,
      setPage,
      setLimit,
      setSearch,
      getPersonalizedProducts,
      createPersonalizedProduct,
      uploadPersonalizedProductImage,
      updatePersonalizedProduct,
      deletePersonalizedProduct,
    }),
    [
      searchedPersonalizedProducts,
      loading,
      refreshing,
      page,
      totalPages,
      getPersonalizedProducts,
      createPersonalizedProduct,
      uploadPersonalizedProductImage,
      updatePersonalizedProduct,
      deletePersonalizedProduct,
      setRefreshing,
      setPage,
      setLimit,
      setSearch,
    ],
  );

  return (
    <PersonalizedProductsContext.Provider value={contextValue}>
      {children}
    </PersonalizedProductsContext.Provider>
  );
};
