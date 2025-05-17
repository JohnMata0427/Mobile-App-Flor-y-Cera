import type { Product } from '@/interfaces/Product';
import {
  createProductRequest,
  deleteProductRequest,
  getProductsRequest,
  updateProductRequest,
} from '@/services/ProductService';
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

interface ProductsContextProps {
  products: Product[];
  loading: boolean;
  refreshing: boolean;
  page: number;
  totalPages: number;
  setRefreshing: React.Dispatch<React.SetStateAction<boolean>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  getProducts: () => Promise<void>;
  createProduct: (product: FormData) => Promise<Response>;
  updateProduct: (productId: string, product: FormData) => Promise<Response>;
  deleteProduct: (productId: string) => Promise<Response>;
}

export const ProductsContext = createContext<ProductsContextProps>({
  products: [],
  loading: false,
  refreshing: false,
  page: 1,
  totalPages: 0,
  setRefreshing: () => {},
  setPage: () => {},
  getProducts: async () => {},
  createProduct: async (_: FormData) => ({ msg: '' }),
  updateProduct: async (_: string, __: FormData) => ({ msg: '' }),
  deleteProduct: async (_: string) => ({ msg: '' }),
});

export const ProductsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { token } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(4);
  const [refreshing, setRefreshing] = useState(false);

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

  const createProduct = useCallback(async (product: FormData) => {
    try {
      const { producto, msg } = await createProductRequest(product, token);

      if (producto?._id && page === totalPages) {
        setProducts(prev => [...prev, producto]);
      }

      return { msg };
    } catch (error) {
      console.error('Error creating product:', error);
      return { msg: 'Ocurrio un error al crear el producto' };
    }
  }, []);

  const updateProduct = useCallback(async (id: string, product: FormData) => {
    try {
      const { producto, msg } = await updateProductRequest(id, product, token);
      producto?._id &&
        setProducts(prev => prev.map(p => (p._id === id ? producto : p)));
      return { msg };
    } catch (error) {
      console.error('Error updating product:', error);
      return { msg: 'Ocurrio un error al actualizar el producto' };
    }
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    try {
      await deleteProductRequest(id, token);
      setProducts(prev => prev.filter(({ _id }) => _id !== id));
      return { msg: 'Producto eliminado exitosamente' };
    } catch (error) {
      console.error('Error deleting product:', error);
      return { msg: 'Ocurrio un error al eliminar el producto' };
    }
  }, []);

  useEffect(() => {
    getProducts();
  }, [page, limit]);

  const contextValue = useMemo(
    () => ({
      products,
      loading,
      refreshing,
      page,
      totalPages,
      setRefreshing,
      setPage,
      getProducts,
      createProduct,
      updateProduct,
      deleteProduct,
    }),
    [
      products,
      loading,
      refreshing,
      page,
      totalPages,
      setRefreshing,
      setPage,
      getProducts,
      createProduct,
      updateProduct,
      deleteProduct,
    ],
  );

  return (
    <ProductsContext.Provider value={contextValue}>
      {children}
    </ProductsContext.Provider>
  );
};
