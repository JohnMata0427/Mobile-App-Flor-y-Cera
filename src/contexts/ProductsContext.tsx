import type { Product, ProductFilter } from '@/interfaces/Product';
import {
  createProductRequest,
  deleteProductRequest,
  getProductsRequest,
  updateProductRequest,
} from '@/services/ProductService';
import { useAuthStore } from '@/store/useAuthStore';
import { createContext, useCallback, useEffect, useMemo, useState, type Dispatch, type SetStateAction } from 'react';

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

export const ProductsContext = createContext<ProductsContextProps>({
  searchedProducts: [],
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
  getProducts: async () => {},
  createProduct: async (_: FormData) => ({ msg: '' }),
  updateProduct: async (_: string, __: FormData) => ({ msg: '' }),
  deleteProduct: async (_: string) => ({ msg: '' }),
});

export const ProductsProvider = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(500);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<ProductFilter>({ key: 'tipo', value: '' });
  const [search, setSearch] = useState<string>('');

  const filteredProducts = useMemo<Product[]>(() => {
    const { key, value } = filter;
    if (value) {
      return products.filter(({ id_categoria, tipo }) => {
        if (key === 'id_categoria') {
          return id_categoria?._id === value
        }
        return tipo === value;
      });
    }

    return products;
  }, [products, filter]);

  const searchedProducts = useMemo<Product[]>(() => {
    if (search) {
      return filteredProducts.filter(({ nombre }) =>
        nombre.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return filteredProducts;
  }, [filteredProducts, search]);

  const getProducts = useCallback(async () => {
    try {
      setLoading(true);
      setProducts([]);
      const { productos, totalPaginas } = await getProductsRequest(page, limit);
      setTotalPages(totalPaginas);
      setProducts(productos);
    } catch {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [page, limit]);

  const createProduct = async (product: FormData) => {
    try {
      const { producto, msg } = await createProductRequest(product, token);

      if (producto?._id) setProducts(prev => [...prev, producto]);
      
      return { msg };
    } catch {
      return { msg: 'Ocurrio un error al crear el producto' };
    }
  }

  const updateProduct = async (id: string, product: FormData) => {
    try {
      const { producto, msg } = await updateProductRequest(id, product, token);
      producto?._id && setProducts(prev => prev.map(p => (p._id === id ? producto : p)));
      return { msg };
    } catch {
      return { msg: 'Ocurrio un error al actualizar el producto' };
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteProductRequest(id, token);
      setProducts(prev => prev.filter(({ _id }) => _id !== id));
      return { msg: 'Producto eliminado exitosamente' };
    } catch {
      return { msg: 'Ocurrio un error al eliminar el producto' };
    }
  };

  useEffect(() => {
    getProducts();
  }, [page, limit]);

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
      createProduct,
      updateProduct,
      deleteProduct,
    ],
  );

  return <ProductsContext.Provider value={contextValue}>{children}</ProductsContext.Provider>;
};
