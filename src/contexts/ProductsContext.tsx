import { useEntityManagement } from '@/hooks/useEntityManagement';
import type { Product, ProductFilter } from '@/interfaces/Product';
import {
  createProductRequest,
  deleteProductRequest,
  getProductsRequest,
  updateProductRequest,
} from '@/services/ProductService';
import { createContext, useMemo, type Dispatch, type ReactNode, type SetStateAction } from 'react';

interface Response {
  msg: string;
}

interface ProductsContextProps {
  searchedProducts: Product[];
  loading: boolean;
  refreshing: boolean;
  page: number;
  totalPages: number;
  filter: ProductFilter;
  setRefreshing: Dispatch<SetStateAction<boolean>>;
  setPage: Dispatch<SetStateAction<number>>;
  setLimit: Dispatch<SetStateAction<number>>;
  setFilter: Dispatch<SetStateAction<ProductFilter>>;
  setSearch: Dispatch<SetStateAction<string>>;
  getProducts: () => Promise<void>;
  createProduct: (product: FormData) => Promise<Response>;
  updateProduct: (productId: string, product: FormData) => Promise<Response>;
  deleteProduct: (productId: string) => Promise<Response>;
}

export const ProductsContext = createContext<ProductsContextProps>({} as ProductsContextProps);

const filterFunction = (products: Product[], filter: ProductFilter) => {
  const { key, value } = filter;
  if (value) {
    return products?.filter(({ id_categoria, tipo }) => {
      if (key === 'id_categoria') {
        return (typeof id_categoria === 'string' ? id_categoria : id_categoria._id) === value;
      }
      return tipo === value;
    });
  }
  return products;
};

const searchFunction = (products: Product[], search: string) => {
  if (search.trim()) {
    const searchLower = search.toLowerCase().trim();
    return products?.filter(({ nombre }) => nombre.toLowerCase().includes(searchLower)) || [];
  }
  return products;
};

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const fetchEntities = async (page: number, limit: number) => {
    const { productos, totalPaginas } = await getProductsRequest(page, limit);
    return { data: productos, totalPages: totalPaginas };
  };

  const {
    setEntities: setProducts,
    loading,
    refreshing,
    page,
    totalPages,
    filter,
    searchedEntities: searchedProducts,
    setRefreshing,
    setPage,
    setLimit,
    setFilter,
    setSearch,
    getEntities: getProducts,
  } = useEntityManagement<Product>({
    fetchEntities,
    filterFunction,
    searchFunction,
    initialFilter: { key: 'tipo', value: '' },
  });

  const createProduct = async (product: FormData) => {
    try {
      const { producto, msg } = await createProductRequest(product);
      if (producto?._id) setProducts(prev => [...prev, producto]);
      return { msg };
    } catch {
      return { msg: 'Ocurrió un error al crear el producto' };
    }
  };

  const updateProduct = async (id: string, product: FormData) => {
    try {
      const { producto, msg } = await updateProductRequest(id, product);
      if (producto?._id) setProducts(prev => prev.map(p => (p._id === id ? producto : p)));
      return { msg };
    } catch {
      return { msg: 'Ocurrió un error al actualizar el producto' };
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteProductRequest(id);
      setProducts(prev => prev.filter(({ _id }) => _id !== id));
      return { msg: 'Producto eliminado exitosamente' };
    } catch {
      return { msg: 'Ocurrió un error al eliminar el producto' };
    }
  };

  const contextValue = useMemo(
    () => ({
      searchedProducts,
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
      getProducts,
      createProduct,
      updateProduct,
      deleteProduct,
    }),
    [
      searchedProducts,
      loading,
      refreshing,
      page,
      totalPages,
      filter,
      getProducts,
      setRefreshing,
      setPage,
      setLimit,
      setFilter,
      setSearch,
    ],
  );

  return <ProductsContext.Provider value={contextValue}>{children}</ProductsContext.Provider>;
};
