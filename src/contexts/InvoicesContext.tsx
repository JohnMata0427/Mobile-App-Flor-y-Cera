import type { Invoice, InvoiceFilter } from '@/interfaces/Invoice';
import { getInvoicesRequest, updateInvoiceStatusRequest } from '@/services/InvoiceService';
import { useAuthStore } from '@/store/useAuthStore';
import { createContext, useCallback, useEffect, useMemo, useState } from 'react';

interface Response {
  msg: string;
}

interface InvoicesContextProps {
  searchedInvoices: Invoice[];
  loading: boolean;
  refreshing: boolean;
  page: number;
  totalPages: number;
  filter: InvoiceFilter;
  setRefreshing: React.Dispatch<React.SetStateAction<boolean>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setFilter: React.Dispatch<React.SetStateAction<InvoiceFilter>>;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  getInvoices: () => Promise<void>;
  updateInvoiceStatus: (id: string, estado: 'pendiente' | 'finalizado') => Promise<Response>;
}

export const InvoicesContext = createContext<InvoicesContextProps>({
  searchedInvoices: [],
  loading: false,
  refreshing: false,
  page: 1,
  totalPages: 0,
  filter: { key: 'estado', value: '' },
  setRefreshing: () => {},
  setPage: () => {},
  setFilter: () => {},
  setSearch: () => {},
  getInvoices: async () => {},
  updateInvoiceStatus: async (_: string, __: 'pendiente' | 'finalizado') => ({ msg: '' }),
});

export const InvoicesProvider = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuthStore();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<InvoiceFilter>({ key: 'estado', value: '' });
  const [search, setSearch] = useState<string>('');

  const filteredInvoices = useMemo(() => {
    const { key, value } = filter;

    if (value) {
      return invoices.filter(invoice => invoice[key] === value);
    }

    return invoices;
  }, [invoices, filter]);

  const searchedInvoices = useMemo(() => {
    if (search) {
      return filteredInvoices.filter(
        ({ cliente_id }) => {
          const { nombre = '', apellido = '' } = cliente_id ?? {};
          return (
            nombre.toLowerCase().includes(search.toLowerCase()) ||
            apellido.toLowerCase().includes(search.toLowerCase())
          );
        },
      );
    }

    return filteredInvoices;
  }, [filteredInvoices, search]);

  const getInvoices = useCallback(async () => {
    try {
      setLoading(true);
      setInvoices([]);
      const { ventas, totalPaginas } = await getInvoicesRequest(page, limit, token);

      setTotalPages(totalPaginas);
      setInvoices(ventas);
    } catch {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [page, limit]);

  const updateInvoiceStatus = useCallback(
    async (id: string, estado: 'pendiente' | 'finalizado') => {
      try {
        const { msg } = await updateInvoiceStatusRequest(id, estado, token);
        setInvoices(invoices => invoices.map(i => (i._id === id ? { ...i, estado } : i)));
        return { msg };
      } catch {
        return {
          msg: 'Ocurrio un error al actualizar el estado de la factura',
        };
      }
    },
    [invoices, token],
  );

  useEffect(() => {
    getInvoices();
  }, [page, limit]);

  const contextValue = useMemo(
    () => ({
      searchedInvoices,
      loading,
      refreshing,
      page,
      totalPages,
      filter,
      setRefreshing,
      setPage,
      setFilter,
      setSearch,
      getInvoices,
      updateInvoiceStatus,
    }),
    [
      searchedInvoices,
      loading,
      refreshing,
      page,
      totalPages,
      filter,
      getInvoices,
      updateInvoiceStatus,
    ],
  );

  return <InvoicesContext.Provider value={contextValue}>{children}</InvoicesContext.Provider>;
};
