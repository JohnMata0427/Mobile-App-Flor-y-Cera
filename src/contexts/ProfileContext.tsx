import type { Client } from '@/interfaces/Client';
import { getClientProfileRequest, updateClientProfileRequest } from '@/services/AuthService';
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';

interface ProfileContextProps {
  client: Client;
  loading: boolean;
  refreshing: boolean;
  setRefreshing: Dispatch<SetStateAction<boolean>>;
  getProfile: () => Promise<void>;
  updateProfile: (client: FormData) => Promise<{ ok: boolean; msg: string }>;
  modifyNotificationPushToken: (token: string | null) => void;
}

export const ProfileContext = createContext<ProfileContextProps>({} as ProfileContextProps);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [client, setClient] = useState<Client>({} as Client);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const getProfile = useCallback(async () => {
    setLoading(true);
    try {
      const { cliente } = await getClientProfileRequest();

      cliente.fecha_nacimiento = cliente?.fecha_nacimiento?.split('T')[0] ?? undefined;

      setClient(cliente);
    } catch {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const updateProfile = async (formData: FormData) => {
    try {
      const { ok, cliente, msg } = await updateClientProfileRequest(formData);

      cliente.fecha_nacimiento = cliente?.fecha_nacimiento?.split('T')[0] ?? undefined;

      setClient(cliente);

      return { ok, msg };
    } catch {
      return { ok: false, msg: 'Error al actualizar el perfil' };
    }
  };

  const modifyNotificationPushToken = useCallback((token: string | null) => {
    setClient(prev => ({ ...prev, notificationPushToken: token }));
  }, []);

  useEffect(() => {
    getProfile();
  }, []);

  const contextValue = useMemo(
    () => ({
      client,
      loading,
      refreshing,
      setRefreshing,
      getProfile,
      updateProfile,
      modifyNotificationPushToken,
    }),
    [client, loading, refreshing, updateProfile],
  );

  return <ProfileContext.Provider value={contextValue}>{children}</ProfileContext.Provider>;
}
