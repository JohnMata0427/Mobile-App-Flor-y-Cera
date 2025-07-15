import { useEntityManagement, type Filter } from '@/hooks/useEntityManagement';
import type { Client } from '@/interfaces/Client';
import {
  activateClientAccountRequest,
  deleteClientAccountRequest,
  getClientsRequest,
} from '@/services/ClientService';
import {
  createContext,
  useCallback,
  useMemo,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';

interface ClientsContextProps {
  searchedClients: Client[];
  loading: boolean;
  refreshing: boolean;
  page: number;
  totalPages: number;
  filter: Filter<Client>;
  setRefreshing: Dispatch<SetStateAction<boolean>>;
  setPage: Dispatch<SetStateAction<number>>;
  setFilter: Dispatch<SetStateAction<Filter<Client>>>;
  setSearch: Dispatch<SetStateAction<string>>;
  getClients: () => Promise<void>;
  activateClientAccount: (clientId: string) => Promise<{
    msg: string;
  }>;
  deleteClientAccount: (clientId: string) => Promise<{
    msg: string;
  }>;
}

export const ClientsContext = createContext<ClientsContextProps>({} as ClientsContextProps);

const filterFunction = (clients: Client[], filter: Filter<Client>) => {
  const { key, value } = filter;
  if (value) return clients?.filter(client => client[key]?.toLowerCase() === value);
  return clients;
};

const searchFunction = (clients: Client[], search: string) => {
  const searchLower = search.toLowerCase().trim();
  if (!searchLower) return clients;
  return clients?.filter(
    ({ nombre, apellido, email }) =>
      nombre.toLowerCase().includes(searchLower) ||
      apellido.toLowerCase().includes(searchLower) ||
      email.toLowerCase().includes(searchLower),
  );
};

export const ClientsProvider = ({ children }: { children: ReactNode }) => {
  const fetchEntities = async (page: number, limit: number) => {
    const { clientes, totalPaginas } = await getClientsRequest(page, limit);
    return { data: clientes, totalPages: totalPaginas };
  };

  const {
    setEntities: setClients,
    loading,
    refreshing,
    page,
    totalPages,
    filter,
    searchedEntities: searchedClients,
    setRefreshing,
    setPage,
    setFilter,
    setSearch,
    getEntities: getClients,
  } = useEntityManagement<Client>({
    fetchEntities,
    filterFunction,
    searchFunction,
    initialFilter: { key: 'estado', value: '' },
  });

  const activateClientAccount = useCallback(
    async (id: string) => {
      try {
        const { msg } = await activateClientAccountRequest(id);
        setClients(prev => prev.map(p => (p._id === id ? { ...p, estado: 'activo' } : p)));
        return { msg };
      } catch {
        return { msg: 'Ocurrió un error al actualizar el cliente' };
      }
    },
    [setClients],
  );

  const deleteClientAccount = useCallback(
    async (id: string) => {
      try {
        const { msg } = await deleteClientAccountRequest(id);
        setClients(prev => prev.map(p => (p._id === id ? { ...p, estado: 'inactivo' } : p)));
        return { msg };
      } catch {
        return { msg: 'Ocurrió un error al eliminar el cliente' };
      }
    },
    [setClients],
  );

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
      filter,
      setRefreshing,
      setPage,
      setFilter,
      setSearch,
      getClients,
      activateClientAccount,
      deleteClientAccount,
    ],
  );

  return <ClientsContext.Provider value={contextValue}>{children}</ClientsContext.Provider>;
};
