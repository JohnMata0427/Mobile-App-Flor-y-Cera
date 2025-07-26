import { useEntityManagement } from '@/hooks/useEntityManagement';
import type { Invoice, InvoiceFilter } from '@/interfaces/Invoice';
import { getInvoicesRequest, updateInvoiceStatusRequest } from '@/services/InvoiceService';
import { sendNotificationToAllClients } from '@/services/NotificationService';
import { createContext, useMemo, type Dispatch, type ReactNode, type SetStateAction } from 'react';

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
  setRefreshing: Dispatch<SetStateAction<boolean>>;
  setPage: Dispatch<SetStateAction<number>>;
  setLimit: Dispatch<SetStateAction<number>>;
  setFilter: Dispatch<SetStateAction<InvoiceFilter>>;
  setSearch: Dispatch<SetStateAction<string>>;
  getInvoices: () => Promise<void>;
  updateInvoiceStatus: (id: string, estado: 'pendiente' | 'finalizado') => Promise<Response>;
}

export const InvoicesContext = createContext<InvoicesContextProps>({} as InvoicesContextProps);

const filterFunction = (invoices: Invoice[], filter: InvoiceFilter) => {
  const { key, value } = filter;
  if (value) {
    return invoices?.filter(invoice => invoice[key] === value);
  }
  return invoices;
};

const searchFunction = (invoices: Invoice[], search: string) => {
  if (search) {
    return invoices?.filter(({ cliente }) => {
      const { nombre = '', apellido = '' } = cliente ?? {};
      return (
        nombre.toLowerCase().includes(search.toLowerCase()) ||
        apellido.toLowerCase().includes(search.toLowerCase())
      );
    });
  }
  return invoices;
};

export const InvoicesProvider = ({ children }: { children: ReactNode }) => {
  const fetchEntities = async (page: number, limit: number) => {
    const { ventas, totalPaginas } = await getInvoicesRequest(page, limit);
    return { data: ventas, totalPages: totalPaginas };
  };

  const {
    setEntities: setInvoices,
    loading,
    refreshing,
    page,
    totalPages,
    filter,
    searchedEntities: searchedInvoices,
    setRefreshing,
    setPage,
    setLimit,
    setFilter,
    setSearch,
    getEntities: getInvoices,
  } = useEntityManagement<Invoice>({
    fetchEntities,
    filterFunction,
    searchFunction,
    initialFilter: { key: 'estado', value: '' },
  });

  const updateInvoiceStatus = async (id: string, estado: 'pendiente' | 'finalizado') => {
    try {
      const { msg } = await updateInvoiceStatusRequest(id, estado);
      setInvoices(prev =>
        prev.map(i => {
          if (i._id === id) {
            if (estado === 'finalizado') {
              sendNotificationToAllClients({
                titulo: '¡Disfrute de sus productos 🕯️🧼!',
                mensaje: 'Su pedido ha sido entregado exitosamente, muchas gracias por su compra.',
                imagen:
                  'https://static.vecteezy.com/system/resources/thumbnails/003/340/078/large/motorcycle-delivering-order-to-customer-door-woman-getting-parcel-vector.jpg',
                clienteId: i.cliente._id,
              });
            }

            return { ...i, estado };
          }
          return i;
        }),
      );
      return { msg };
    } catch {
      return {
        msg: 'Ocurrio un error al actualizar el estado de la factura',
      };
    }
  };

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
      setLimit,
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
      setRefreshing,
      setPage,
      setLimit,
      setFilter,
      setSearch,
      getInvoices,
      updateInvoiceStatus,
    ],
  );

  return <InvoicesContext.Provider value={contextValue}>{children}</InvoicesContext.Provider>;
};
