import Constants from 'expo-constants';
import { getItemAsync } from 'expo-secure-store';

const { BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL } = Constants.expoConfig?.extra ?? {};

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
}

export const requestAPI = async (
  endpoint: string,
  options: RequestOptions = {},
  anotherUrl?: string,
) => {
  const token = await getItemAsync('token');
  const { method = 'GET', body } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    if (body instanceof FormData) {
      delete headers['Content-Type'];
      config.body = body;
    } else {
      config.body = JSON.stringify(body);
    }
  }

  try {
    const response = await fetch(`${anotherUrl ?? BACKEND_URL}${endpoint}`, config);
    const { ok } = response;
    const data = await response.json();
    return { ok, ...data };
  } catch (error) {
    throw error;
  }
};
