import { loginRequest } from '@/services/AuthService';
import { deleteItemAsync, getItemAsync, setItemAsync } from 'expo-secure-store';
import { create } from 'zustand';

interface Response {
  msg: string;
  success: boolean;
  isAdmin?: boolean;
}

interface User {
  id: string;
  role: string;
}

interface UserStore {
  token: string;
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: User;
  login: (userData: { email: string; password: string }) => Promise<Response>;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<UserStore>(set => ({
  token: '',
  isAuthenticated: false,
  isAdmin: false,
  user: { id: '', role: '' },
  login: async credentials => {
    try {
      const { token = '', msg } = await loginRequest(credentials);
      const success = !!token;
      let isAdmin = false;

      if (token) {
        const { rol: role = '', id = '' } = JSON.parse(
          atob(token.split('.')[1]),
        );
        isAdmin = role === 'admin';

        await setItemAsync('token', token);
        await setItemAsync('user', JSON.stringify({ id, role }));

        set({ token, isAuthenticated: success, isAdmin, user: { id, role } });
      }

      return { msg, success, isAdmin };
    } catch {
      return { msg: 'Ocurrio un error al iniciar sesión', success: false };
    }
  },
  logout: async () => {
    await deleteItemAsync('token');
    await deleteItemAsync('user');

    set({
      token: '',
      isAuthenticated: false,
      isAdmin: false,
      user: { id: '', role: '' },
    });
  },
  checkAuth: async () => {
    const token = (await getItemAsync('token')) ?? '';
    const { rol: role = '', id = '' } = JSON.parse(
      (await getItemAsync('user')) ?? '{}',
    );
    const isAdmin = role === 'admin';

    set({ token, isAuthenticated: !!token, isAdmin, user: { id, role } });
  },
}));
