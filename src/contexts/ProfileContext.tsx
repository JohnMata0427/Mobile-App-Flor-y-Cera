import type { Client } from '@/interfaces/Client';
import { getProfileRequest, updateProfileRequest } from '@/services/ProfileService';
import { useAuthStore } from '@/store/useAuthStore';
import { createContext, useCallback, useEffect, useMemo, useState } from 'react';

interface ProfileContextProps {
  client: Client;
  loading: boolean;
  getProfile: () => Promise<void>;
  updateProfile: (client: Client) => Promise<void>;
}

export const ProfileContext = createContext<ProfileContextProps>({
  client: {} as Client,
  loading: false,
  getProfile: async () => {},
  updateProfile: async (client: Client) => {},
});

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuthStore();
  const [client, setClient] = useState<Client>({} as Client);
  const [loading, setLoading] = useState<boolean>(false);

  const getProfile = useCallback(async () => {
    setLoading(true);
    try {
      const { cliente } = await getProfileRequest(token);
      setClient(cliente);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [token]);

  const updateProfile = useCallback(
    async (updatedClient: Client) => {
      try {
        const { cliente } = await updateProfileRequest(token, updatedClient);
        setClient(cliente);
      } catch {}
    },
    [token],
  );

  useEffect(() => {
    getProfile();
  }, []);

  const contextValue = useMemo(
    () => ({ client, loading, getProfile, updateProfile }),
    [client, loading, getProfile, updateProfile],
  );

  return (
    <ProfileContext.Provider value={contextValue}>{children}</ProfileContext.Provider>
  );
}
