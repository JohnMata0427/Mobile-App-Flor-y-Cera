import { PRIMARY_COLOR } from '@/constants/Colors';
import Constants from 'expo-constants';
import {
  AndroidImportance,
  AndroidNotificationPriority,
  AndroidNotificationVisibility,
  getExpoPushTokenAsync,
  getPermissionsAsync,
  requestPermissionsAsync,
  setNotificationChannelAsync,
  setNotificationHandler,
} from 'expo-notifications';
import { Platform } from 'react-native';

setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
    priority: AndroidNotificationPriority.MAX,
  }),
});

export async function registerForPushNotificationsAsync() {
  try {
    if (Platform.OS === 'android') {
      setNotificationChannelAsync('default', {
        name: 'default',
        importance: AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: PRIMARY_COLOR,
        showBadge: true,
        description: 'Canal de notificaciones por defecto',
        enableVibrate: true,
        enableLights: true,
        lockscreenVisibility: AndroidNotificationVisibility.PUBLIC,
        sound: 'default',
      });
    }

    let { status: existingStatus } = await getPermissionsAsync();

    if (existingStatus !== 'granted') {
      const { status } = await requestPermissionsAsync();
      existingStatus = status;
    }

    if (existingStatus === 'denied') {
      return 'denied';
    }

    if (existingStatus === 'granted') {
      const { projectId } = Constants.expoConfig?.extra?.eas ?? Constants?.easConfig;

      if (projectId) {
        const { data } = await getExpoPushTokenAsync({ projectId });

        return data;
      }
    }

    return null;
  } catch {
    return null;
  }
}
