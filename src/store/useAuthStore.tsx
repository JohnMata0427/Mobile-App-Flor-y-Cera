import { loginRequest } from '@/services/AuthService';
import { router } from 'expo-router';
import { deleteItemAsync, getItemAsync, setItemAsync } from 'expo-secure-store';
import { create } from 'zustand';

interface UserStore {
  token: string;
  loading: boolean;
  isAdmin: boolean;
  login: (credentials: { email: string; password: string }) => Promise<{ msg: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<UserStore>(set => ({
  token: '',
  loading: true,
  isAdmin: false,
  login: async credentials => {
    try {
      const { token = '', msg = '', ok } = await loginRequest(credentials);

      if (token) {
        const { rol = '' } = JSON.parse(atob(token.split('.')[1]));
        const isAdmin = rol === 'admin';

        await setItemAsync('token', token);

        set({ token, isAdmin });

        if (isAdmin) router.replace('/(admin)/dashboard');
        else router.replace('/(client)/home');
      }

      return { msg };
    } catch {
      return { msg: 'Ocurrió un error al iniciar sesión' };
    }
  },
  logout: async () => {
    await deleteItemAsync('token');
    router.replace('/(auth)/login');

    set({ token: '', isAdmin: false });
  },
  checkAuth: async () => {
    let welcomeCompleted = !!(await getItemAsync('welcomeCompleted'));
    let isAdmin = false;
    let isAuth = false;
    try {
      if (welcomeCompleted) {
        const token = (await getItemAsync('token')) ?? '';
        if (token) {
          const { rol = '' } = JSON.parse(atob(token.split('.')[1]));
          isAdmin = rol === 'admin';
          isAuth = true;

          set({ token, isAdmin });
        }
      }
    } catch {
    } finally {
      set({ loading: false });

      if (!welcomeCompleted) router.replace('/(welcome)/first');
      else if (isAdmin) router.replace('/(admin)/dashboard');
      else if (isAuth) router.replace('/(client)/home');
      else router.replace('/(auth)/login');
    }
  },
}));
