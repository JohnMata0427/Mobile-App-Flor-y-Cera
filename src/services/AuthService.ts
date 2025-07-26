import type { Client } from '@/interfaces/Client';
import { requestAPI } from '@/utils/requestAPI';

export const loginRequest = (body: { email: string; password: string }) =>
  requestAPI('/login?environment=mobile', { method: 'POST', body });

export const registerClientRequest = (body: Partial<Client>) =>
  requestAPI('/registro', { method: 'POST', body });

export const forgotPasswordRequest = async (email: string) => {
  const { ok, msg } = await requestAPI('/recuperarContraseniaAdmin', {
    method: 'POST',
    body: { email },
  });

  if (!ok) {
    return await requestAPI('/recuperar-contrasenia', {
      method: 'POST',
      body: { email },
    });
  }

  return { ok, msg };
};

export const resetPasswordRequest = async (
  codigoRecuperacion: string,
  body: {
    email: string;
    nuevaPassword: string;
  },
) => {
  const { ok, msg } = await requestAPI(
    `/cambiarContraseniaAdmin?codigoRecuperacion=${codigoRecuperacion}`,
    {
      method: 'POST',
      body,
    },
  );

  if (!ok) {
    return await requestAPI(`/cambiar-contrasenia?codigoRecuperacion=${codigoRecuperacion}`, {
      method: 'POST',
      body,
    });
  }

  return { ok, msg };
};

export const getClientProfileRequest = () => requestAPI('/perfil');

export const updateClientProfileRequest = (body: FormData) =>
  requestAPI('/perfil', { method: 'PUT', body });
