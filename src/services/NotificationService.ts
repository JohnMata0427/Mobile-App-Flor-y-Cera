import { requestAPI } from '@/utils/requestAPI';

export const updateNotificationPushToken = (pushToken: string | null) =>
  requestAPI(`/notificaciones/${pushToken}`, { method: 'PATCH' });

export const sendNotificationToAllClients = (body: {
  titulo: string;
  mensaje: string;
  imagen: string;
}) => requestAPI('/enviar-notificacion', { method: 'POST', body });

export const getNotificationsClient = () => requestAPI('/notificaciones/cliente');

export const getAllNotifications = () => requestAPI('/notificaciones');