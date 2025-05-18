import type { Invoice } from '@/interfaces/Invoice';
import {
  getInvoicesRequest,
  updateInvoiceStatusRequest,
} from '@/services/InvoiceService';
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

interface InvoicesContextProps {
  invoices: Invoice[];
  loading: boolean;
  refreshing: boolean;
  page: number;
  totalPages: number;
  setRefreshing: React.Dispatch<React.SetStateAction<boolean>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  getInvoices: () => Promise<void>;
  updateInvoiceStatus: (id: string, estado: string) => Promise<Response>;
}

export const InvoicesContext = createContext<InvoicesContextProps>({
  invoices: [],
  loading: false,
  refreshing: false,
  page: 1,
  totalPages: 0,
  setRefreshing: () => {},
  setPage: () => {},
  getInvoices: async () => {},
  updateInvoiceStatus: async (_: string, __: string) => ({ msg: '' }),
});

export const InvoicesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { token } = useAuthStore();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [refreshing, setRefreshing] = useState(false);

  const getInvoices = useCallback(async () => {
    try {
      setLoading(true);
      setInvoices([]);
      const { ventas, totalPaginas } = await getInvoicesRequest(
        page,
        limit,
        token,
      );

      setTotalPages(totalPaginas);
      setInvoices(ventas);
    } catch {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [page, limit]);

  const updateInvoiceStatus = useCallback(
    async (id: string, estado: string) => {
      try {
        const { msg } = await updateInvoiceStatusRequest(id, estado, token);
        setInvoices(invoices =>
          invoices.map(i => (i._id === id ? { ...i, estado } : i)),
        );
        return { msg };
      } catch {
        return {
          msg: 'Ocurrio un error al actualizar el estado de la factura',
        };
      }
    },
    [],
  );

  useEffect(() => {
    getInvoices();
  }, [page, limit]);

  const contextValue = useMemo(
    () => ({
      invoices,
      loading,
      refreshing,
      page,
      totalPages,
      setRefreshing,
      setPage,
      getInvoices,
      updateInvoiceStatus,
    }),
    [
      invoices,
      loading,
      refreshing,
      page,
      totalPages,
      setRefreshing,
      setPage,
      getInvoices,
      updateInvoiceStatus,
    ],
  );

  return (
    <InvoicesContext.Provider value={contextValue}>
      {children}
    </InvoicesContext.Provider>
  );
};
