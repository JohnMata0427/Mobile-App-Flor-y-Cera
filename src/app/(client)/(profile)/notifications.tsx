import { Button } from '@/components/Button';
import {
  GRAY_COLOR,
  GRAY_COLOR_DARK,
  GRAY_COLOR_LIGHT,
  PRIMARY_COLOR,
  PRIMARY_COLOR_DARK,
  REFRESH_COLORS,
} from '@/constants/Colors';
import { ProfileContext, ProfileProvider } from '@/contexts/ProfileContext';
import { globalStyles } from '@/globalStyles';
import type { Notification } from '@/interfaces/Notification';
import {
  getNotificationsClient,
  updateNotificationPushToken,
} from '@/services/NotificationService';
import { registerForPushNotificationsAsync } from '@/utils/notifications';
import { Image } from 'expo-image';
import { getPermissionsAsync, PermissionStatus } from 'expo-notifications';
import { memo, use, useEffect, useState } from 'react';
import { Alert, FlatList, Linking, RefreshControl, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Notifications = memo(() => {
  const { top } = useSafeAreaInsets();
  const { client, modifyNotificationPushToken } = use(ProfileContext);
  const [isPermissionsGranted, setIsPermissionsGranted] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const getDataAndConfig = async () => {
    const { status } = await getPermissionsAsync();
    setIsPermissionsGranted(status === PermissionStatus.GRANTED && !!client?.notificationPushToken);
    const { notificaciones } = await getNotificationsClient();
    setNotifications(notificaciones);
  };

  useEffect(() => {
    getDataAndConfig();
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
          onRefresh={getDataAndConfig}
          colors={REFRESH_COLORS}
        />
      }
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Notificaciones</Text>
        <Button
          label={isPermissionsGranted ? 'Habilitadas' : 'Deshabilitadas'}
          icon={isPermissionsGranted ? 'bell' : 'bell-off'}
          onPress={handleToggleNotifications}
          buttonStyle={{
            paddingHorizontal: 10,
            paddingVertical: 5,
            backgroundColor: isPermissionsGranted ? PRIMARY_COLOR : GRAY_COLOR_DARK,
            borderColor: isPermissionsGranted ? PRIMARY_COLOR_DARK : 'black',
          }}
          textStyle={{
            fontSize: 12,
          }}
          disabled={loading}
        />
      </View>
      <FlatList
        data={notifications}
        scrollEnabled={false}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View
            style={{
              marginVertical: 10,
              padding: 10,
              backgroundColor: 'white',
              borderRadius: 10,
              rowGap: 5,
              borderWidth: 1,
              borderColor: GRAY_COLOR_LIGHT,
            }}
          >
            <Text style={{ fontWeight: 'bold' }}>{item.titulo}</Text>
            <Text style={{ color: GRAY_COLOR, fontSize: 12, marginBottom: 5 }}>{item.mensaje}</Text>

            <Image
              source={{ uri: item.imagen }}
              style={{ width: '100%', height: 100, borderRadius: 10 }}
              contentFit="contain"
            />
          </View>
        )}
      />
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
