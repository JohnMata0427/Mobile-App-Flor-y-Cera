import { loginRequest } from '@/services/AuthService';
import { deleteItemAsync, getItemAsync, setItemAsync } from 'expo-secure-store';
import { create } from 'zustand';

interface Response {
  msg: string;
  success: boolean;
}

interface UserStore {
  token: string;
  isAuthenticated: boolean;
  login: (userData: { email: string; password: string }) => Promise<Response>;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<UserStore>(set => ({
  token: '',
  isAuthenticated: false,
  login: async credentials => {
    try {
      const { token = '', msg } = await loginRequest(credentials);
      const success = !!token;

      await setItemAsync('token', token);
      set({ token, isAuthenticated: success });

      return { msg, success };
    } catch {
      return { msg: 'Ocurrio un error al iniciar sesión', success: false };
    }
  },
  logout: async () => {
    await deleteItemAsync('token');
    set({ isAuthenticated: false, token: '' });
  },
  checkAuth: async () => {
    const token = (await getItemAsync('token')) ?? '';
    set({ token, isAuthenticated: !!token });
  },
}));
