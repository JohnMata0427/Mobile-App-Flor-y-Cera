import type { Client } from '@/interfaces/Client';
import { requestAPI } from '@/utils/requestAPI';

export const loginRequest = (body: { email: string; password: string }) =>
  requestAPI('/login?environment=mobile', { method: 'POST', body });

export const registerClientRequest = (body: Partial<Client>) =>
  requestAPI('/registro', { method: 'POST', body });

export const forgotPasswordRequest = async (email: string) => {
  try {
    return await requestAPI('/recuperarContraseniaAdmin', {
      method: 'POST',
      body: { email },
    });
  } catch (error) {
    return requestAPI('/recuperar-contrasenia', {
      method: 'POST',
      body: { email },
    });
  }
};

export const resetPasswordRequest = async (
  codigoRecuperacion: string,
  body: {
    email: string;
    nuevaPassword: string;
  },
) => {
  try {
    return await requestAPI(`/cambiarContraseniaAdmin?codigoRecuperacion=${codigoRecuperacion}`, {
      method: 'POST',
      body,
    });
  } catch (error) {
    return requestAPI(`/cambiar-contrasenia?codigoRecuperacion=${codigoRecuperacion}`, {
      method: 'POST',
      body,
    });
  }
};

export const getClientProfileRequest = () => requestAPI('/perfil');

export const updateClientProfileRequest = (body: FormData) =>
  requestAPI('/perfil', { method: 'PUT', body });
