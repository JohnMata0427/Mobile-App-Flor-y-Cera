import type { Invoice } from '@/interfaces/Invoice';
import { getInvoicesRequest } from '@/services/InvoiceService';
import { useAuthStore } from '@/store/useAuthStore';
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

interface InvoicesContextProps {
  invoices: Invoice[];
  loading: boolean;
  refreshing: boolean;
  page: number;
  totalPages: number;
  setRefreshing: React.Dispatch<React.SetStateAction<boolean>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  getInvoices: () => Promise<void>;
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
    ],
  );

  return (
    <InvoicesContext.Provider value={contextValue}>
      {children}
    </InvoicesContext.Provider>
  );
};
