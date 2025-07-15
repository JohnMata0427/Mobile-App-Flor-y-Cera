import Constants from 'expo-constants';
import {
  AndroidImportance,
  AndroidNotificationPriority,
  getExpoPushTokenAsync,
  getPermissionsAsync,
  requestPermissionsAsync,
  setNotificationChannelAsync,
  setNotificationHandler,
} from 'expo-notifications';
import { Platform } from 'react-native';

setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
    priority: AndroidNotificationPriority.HIGH,
  }),
});

export async function registerForPushNotificationsAsync() {
  try {
    if (Platform.OS === 'android') {
      setNotificationChannelAsync('default', {
        name: 'default',
        importance: AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
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
      const { projectId } = Constants?.expoConfig?.extra?.eas ?? Constants?.easConfig;

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
