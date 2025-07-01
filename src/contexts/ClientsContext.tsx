import type { Client, ClientFilter } from '@/interfaces/Client';
import {
  activateClientAccountRequest,
  deleteClientAccountRequest,
  getClientsRequest,
} from '@/services/ClientService';
import { useAuthStore } from '@/store/useAuthStore';
import { createContext, useCallback, useEffect, useMemo, useState, type Dispatch, type SetStateAction } from 'react';

interface Response {
  msg: string;
}

interface ClientsContextProps {
  searchedClients: Client[];
  loading: boolean;
  refreshing: boolean;
  page: number;
  totalPages: number;
  filter: ClientFilter;
  setRefreshing: Dispatch<SetStateAction<boolean>>;
  setPage: Dispatch<SetStateAction<number>>;
  setFilter: Dispatch<SetStateAction<ClientFilter>>;
  setSearch: Dispatch<SetStateAction<string>>;
  getClients: () => Promise<void>;
  activateClientAccount: (clientId: string) => Promise<Response>;
  deleteClientAccount: (clientId: string) => Promise<Response>;
}

export const ClientsContext = createContext<ClientsContextProps>({
  searchedClients: [],
  loading: false,
  refreshing: false,
  page: 1,
  totalPages: 0,
  filter: { key: 'estado', value: '' },
  setRefreshing: () => {},
  setPage: () => {},
  setFilter: () => {},
  setSearch: () => {},
  getClients: async () => {},
  activateClientAccount: async (_: string) => ({ msg: '' }),
  deleteClientAccount: async (_: string) => ({ msg: '' }),
});

export const ClientsProvider = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuthStore();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(500);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<ClientFilter>({ key: 'estado', value: '' });
  const [search, setSearch] = useState<string>('');

  const filteredClients = useMemo<Client[]>(() => {
    const { key, value } = filter;

    if (value) return clients.filter(client => client[key]?.toLowerCase() === value);

    return clients;
  }, [clients, filter]);

  const searchedClients = useMemo<Client[]>(() => {
    if (!search) return filteredClients;

    return filteredClients.filter(({ nombre, apellido }) =>
      `${nombre} ${apellido}`.toLowerCase().includes(search.toLowerCase()),
    );
  }, [filteredClients, search]);

  const getClients = useCallback(async () => {
    try {
      setLoading(true);
      setClients([]);
      const { clientes, totalPaginas } = await getClientsRequest(page, limit, token);

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
      setClients(prev => prev.map(p => (p._id === id ? { ...p, estado: 'activo' } : p)));
      return { msg };
    } catch {
      return { msg: 'Ocurrio un error al actualizar el cliente' };
    }
  }, [clients, token]);

  const deleteClientAccount = useCallback(async (id: string) => {
    try {
      const { msg } = await deleteClientAccountRequest(id, token);
      setClients(prev => prev.map(p => (p._id === id ? { ...p, estado: 'inactivo' } : p)));
      return { msg };
    } catch {
      return { msg: 'Ocurrio un error al eliminar el cliente' };
    }
  }, [clients, token]);

  useEffect(() => {
    getClients();
  }, [page, limit]);

  const contextValue = useMemo<ClientsContextProps>(
    () => ({
      searchedClients,
      loading,
      refreshing,
      page,
      totalPages,
      filter,
      setRefreshing,
      setPage,
      setFilter,
      setSearch,
      getClients,
      activateClientAccount,
      deleteClientAccount,
    }),
    [
      searchedClients,
      loading,
      refreshing,
      page,
      totalPages,
      getClients,
      activateClientAccount,
      deleteClientAccount,
    ],
  );

  return <ClientsContext.Provider value={contextValue}>{children}</ClientsContext.Provider>;
};
