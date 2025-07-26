import { useEntityManagement, type Filter } from '@/hooks/useEntityManagement';
import type { Client } from '@/interfaces/Client';
import {
  activateClientAccountRequest,
  deleteClientAccountRequest,
  getClientsRequest,
} from '@/services/ClientService';
import { sendNotificationToAllClients } from '@/services/NotificationService';
import { createContext, useMemo, type Dispatch, type ReactNode, type SetStateAction } from 'react';

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

  const activateClientAccount = async (id: string) => {
    try {
      const { msg } = await activateClientAccountRequest(id);
      setClients(prev =>
        prev.map(c => {
          if (c._id === id) {
            sendNotificationToAllClients({
              titulo: 'Su cuenta ha sido habilitada ✅',
              mensaje:
                'Hemos realizado una revisión de su cuenta y concluimos en que puede volver a utilizar su cuenta, lamentamos los inconvenientes.',
              imagen: 'https://cdn-icons-png.flaticon.com/512/300/300220.png',
              clienteId: c._id,
            });

            return { ...c, estado: 'activo' };
          }
          return c;
        }),
      );
      return { msg };
    } catch {
      return { msg: 'Ocurrió un error al actualizar el cliente' };
    }
  };

  const deleteClientAccount = async (id: string) => {
    try {
      const { msg } = await deleteClientAccountRequest(id);
      setClients(prev =>
        prev.map(c => {
          if (c._id === id) {
            sendNotificationToAllClients({
              titulo: 'Su cuenta ha sido inhabilitada 🚫',
              mensaje:
                'Lamentamos informarle que su cuenta no cumple con nuestros terminos y condiciones de uso.',
              imagen: 'https://cdn-icons-png.flaticon.com/512/300/300220.png',
              clienteId: c._id,
            });

            return { ...c, estado: 'inactivo' };
          }
          return c;
        }),
      );
      return { msg };
    } catch {
      return { msg: 'Ocurrió un error al eliminar el cliente' };
    }
  };

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
