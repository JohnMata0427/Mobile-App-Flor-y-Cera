import { getNotificationsClient } from '@/services/NotificationService';
import { getItemAsync, setItemAsync } from 'expo-secure-store';
import { create } from 'zustand';

interface NotificationsState {
  notifications: Notification[];
  totalNotifications: number;
  readNotifications: boolean;
  setReadNotifications: (readNotifications: boolean) => void;
  getNotificationsClient: () => Promise<void>;
}

export const useNotificationsStore = create<NotificationsState>(set => ({
  notifications: [],
  totalNotifications: 0,
  readNotifications: false,
  setReadNotifications: readNotifications => {
    set({ readNotifications });
  },
  getNotificationsClient: async () => {
    const previousTotalNotifications = parseInt(
      (await getItemAsync('previousTotalNotifications')) ?? '0',
    );

    const { notificaciones } = await getNotificationsClient();
    const totalNotifications = notificaciones.length;

    const readNotifications =
      previousTotalNotifications < totalNotifications ||
      !!!(await getItemAsync('readNotifications'));

    await setItemAsync('previousTotalNotifications', totalNotifications);

    set({ notifications: notificaciones, totalNotifications, readNotifications });
  },
}));
