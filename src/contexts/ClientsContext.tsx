import type { Client } from '@/interfaces/Client';
import {
  activateClientAccountRequest,
  deleteClientAccountRequest,
  getClientsRequest,
} from '@/services/ClientService';
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

interface ClientsContextProps {
  clients: Client[];
  loading: boolean;
  refreshing: boolean;
  page: number;
  totalPages: number;
  setRefreshing: React.Dispatch<React.SetStateAction<boolean>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  getClients: () => Promise<void>;
  activateClientAccount: (clientId: string) => Promise<Response>;
  deleteClientAccount: (clientId: string) => Promise<Response>;
}

export const ClientsContext = createContext<ClientsContextProps>({
  clients: [],
  loading: false,
  refreshing: false,
  page: 1,
  totalPages: 0,
  setRefreshing: () => {},
  setPage: () => {},
  getClients: async () => {},
  activateClientAccount: async (_: string) => ({ msg: '' }),
  deleteClientAccount: async (_: string) => ({ msg: '' }),
});

export const ClientsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { token } = useAuthStore();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [refreshing, setRefreshing] = useState(false);

  const getClients = useCallback(async () => {
    try {
      setLoading(true);
      setClients([]);
      const { clientes, totalPaginas } = await getClientsRequest(
        page,
        limit,
        token,
      );

      setTotalPages(totalPaginas);
      setClients(clientes);
    } catch {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [page, limit]);

  const activateClientAccount = useCallback(async (id: string) => {
    try {
      const { msg } = await activateClientAccountRequest(id, token);
      setClients(prev =>
        prev.map(p => (p._id === id ? { ...p, estado: 'activo' } : p)),
      );
      return { msg };
    } catch (error) {
      console.error('Error updating client:', error);
      return { msg: 'Ocurrio un error al actualizar el cliente' };
    }
  }, []);

  const deleteClientAccount = useCallback(async (id: string) => {
    try {
      const { msg } = await deleteClientAccountRequest(id, token);
      setClients(prev =>
        prev.map(p => (p._id === id ? { ...p, estado: 'inactivo' } : p)),
      );
      return { msg };
    } catch (error) {
      console.error('Error deleting client:', error);
      return { msg: 'Ocurrio un error al eliminar el cliente' };
    }
  }, []);

  useEffect(() => {
    getClients();
  }, [page, limit]);

  const contextValue = useMemo(
    () => ({
      clients,
      loading,
      refreshing,
      page,
      totalPages,
      setRefreshing,
      setPage,
      getClients,
      activateClientAccount,
      deleteClientAccount,
    }),
    [
      clients,
      loading,
      refreshing,
      page,
      totalPages,
      setRefreshing,
      setPage,
      getClients,
      activateClientAccount,
      deleteClientAccount,
    ],
  );

  return (
    <ClientsContext.Provider value={contextValue}>
      {children}
    </ClientsContext.Provider>
  );
};
