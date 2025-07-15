import { Button } from '@/components/Button';
import { PRIMARY_COLOR, SECONDARY_COLOR, TERTIARY_COLOR } from '@/constants/Colors';
import { ProfileContext, ProfileProvider } from '@/contexts/ProfileContext';
import { globalStyles } from '@/globalStyles';
import { getNotificationsClient, updateNotificationPushToken } from '@/services/NotificationService';
import { registerForPushNotificationsAsync } from '@/utils/notifications';
import { getPermissionsAsync, PermissionStatus } from 'expo-notifications';
import { memo, use, useEffect, useState } from 'react';
import { Alert, Linking, RefreshControl, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Notifications = memo(() => {
  const { top } = useSafeAreaInsets();
  const { client, modifyNotificationPushToken } = use(ProfileContext);
  const [isPermissionsGranted, setIsPermissionsGranted] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const checkPermissions = async () => {
    const { status } = await getPermissionsAsync();
    setIsPermissionsGranted(status === PermissionStatus.GRANTED && !!client?.notificationPushToken);
  };

  useEffect(() => {
    (async () => {
      await checkPermissions();
      const response = await getNotificationsClient();
      console.log(response);
    })();
  }, []);

  const handleToggleNotifications = async () => {
    setLoading(true);

    if (isPermissionsGranted) {
      const { ok } = await updateNotificationPushToken(null);
      if (ok) {
        modifyNotificationPushToken(null);
        setIsPermissionsGranted(false);
        Alert.alert(
          'Mensaje del sistema',
          'Las notificaciones han sido deshabilitadas de nuestros sistemas, si desea deshabilitarlas por completo hágalo desde la configuración',
          [{ text: 'OK' }, { text: 'Ir a configuración', onPress: () => Linking.openSettings() }],
        );
      } else {
        Alert.alert(
          'Mensaje del sistema',
          'Ocurrió un error al deshabilitar las notificaciones, intente de nuevo más tarde',
          [{ text: 'OK' }],
        );
      }
    } else {
      const pushToken = await registerForPushNotificationsAsync();

      if (pushToken === 'denied') {
        Alert.alert(
          'Mensaje del sistema',
          'Los permisos están completamente denegados, para habilitar las notificaciones, primero habilitelas desde la configuración e intente de nuevo',
          [{ text: 'OK' }, { text: 'Ir a configuración', onPress: () => Linking.openSettings() }],
        );
      } else if (pushToken) {
        const { ok } = await updateNotificationPushToken(pushToken);
        if (ok) {
          modifyNotificationPushToken(pushToken);
          setIsPermissionsGranted(true);
          Alert.alert(
            'Mensaje del sistema',
            'Las notificaciones han sido habilitadas correctamente',
            [{ text: 'OK' }],
          );
        } else {
          Alert.alert(
            'Mensaje del sistema',
            'Ocurrió un error al habilitar las notificaciones, intente de nuevo más tarde',
            [{ text: 'OK' }],
          );
        }
      }
    }

    setLoading(false);
  };

  return (
    <ScrollView
      contentContainerStyle={[
        globalStyles.scrollViewContent,
        { paddingTop: top + 10, paddingHorizontal: 15, paddingBottom: 10 },
      ]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={checkPermissions}
          colors={[PRIMARY_COLOR, SECONDARY_COLOR, TERTIARY_COLOR]}
        />
      }
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Notificaciones</Text>
        <Button
          label={isPermissionsGranted ? 'Deshabilitar' : 'Habilitar'}
          icon={isPermissionsGranted ? 'bell-off' : 'bell'}
          onPress={handleToggleNotifications}
          buttonStyle={{
            paddingHorizontal: 10,
            paddingVertical: 5,
          }}
          textStyle={{
            fontSize: 12,
          }}
          disabled={loading}
        />
      </View>
    </ScrollView>
  );
});

export default function NotificationsScreen() {
  return (
    <ProfileProvider>
      <Notifications />
    </ProfileProvider>
  );
}
