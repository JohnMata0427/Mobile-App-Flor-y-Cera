import { Button } from '@/components/Button';
import { Loading } from '@/components/Loading';
import {
  GRAY_COLOR_DARK,
  PRIMARY_COLOR,
  SECONDARY_COLOR,
  TERTIARY_COLOR,
} from '@/constants/Colors';
import { ProfileContext, ProfileProvider } from '@/contexts/ProfileContext';
import { globalStyles } from '@/globalStyles';
import { useAuthStore } from '@/store/useAuthStore';
import { showConfirmationAlert } from '@/utils/showAlert';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { memo, use, useCallback } from 'react';
import { Image, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ClientProfile = memo(() => {
  const { logout } = useAuthStore();
  const { top } = useSafeAreaInsets();
  const { client, loading, refreshing, setRefreshing, getProfile } = use(ProfileContext);
  const { nombre, apellido, email, imagen, genero } = client ?? {};

  const defaultImage =
    genero?.toLowerCase() === 'masculino'
      ? require('@/assets/male-user-default.jpg')
      : require('@/assets/female-user-default.jpg');

  const requestLogout = useCallback(() => {
    showConfirmationAlert({
      message: '¿Está seguro/a de que desea cerrar sesión?',
      onConfirm: () => logout(),
      confirmButtonText: 'Cerrar sesión',
    });
  }, [logout]);

  return (
    <ScrollView
      contentContainerStyle={[styles.scrollContainer, { paddingTop: top + 10 }]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true);
            await getProfile();
          }}
          colors={[PRIMARY_COLOR, SECONDARY_COLOR, TERTIARY_COLOR]}
        />
      }
    >
      {loading ? (
        <Loading />
      ) : (
        <>
          <Pressable
            onPress={() => router.push('/(client)/(profile)/update')}
            style={styles.profileHeader}
          >
            <Image
              source={imagen ? { uri: imagen } : defaultImage}
              style={styles.profileImage}
              loadingIndicatorSource={require('@/assets/images/icon.png')}
              resizeMode="contain"
            />
            <Text style={globalStyles.title}>
              {nombre} {apellido}
            </Text>
            <Text style={globalStyles.subtitle}>{email}</Text>
          </Pressable>
          <View style={styles.settingsSection}>
            <Text style={globalStyles.labelText}>Configuración de la cuenta</Text>

            <Pressable
              onPress={() => router.push('/(client)/(profile)/notifications')}
              style={styles.menuItem}
            >
              <View style={styles.menuItemLeft}>
                <MaterialCommunityIcons name="bell" size={20} color={GRAY_COLOR_DARK} />
                <Text style={globalStyles.bodyText}>Notificaciones</Text>
              </View>
              <View style={styles.menuItemRight}>
                <Text style={styles.notificationBadge}>4</Text>
                <MaterialCommunityIcons name="chevron-right" size={20} color={GRAY_COLOR_DARK} />
              </View>
            </Pressable>

            <Pressable
              onPress={() => router.push('/(client)/(profile)/update')}
              style={styles.menuItem}
            >
              <View style={styles.menuItemLeft}>
                <MaterialCommunityIcons name="account-circle" size={20} color={GRAY_COLOR_DARK} />
                <Text style={globalStyles.bodyText}>Editar mi perfil</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color={GRAY_COLOR_DARK} />
            </Pressable>

            <Pressable
              onPress={() => router.push('/(client)/(personalization)/history')}
              style={styles.menuItem}
            >
              <View style={styles.menuItemLeft}>
                <MaterialCommunityIcons name="shimmer" size={20} color={GRAY_COLOR_DARK} />
                <Text style={globalStyles.bodyText}>Mis productos personalizados</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color={GRAY_COLOR_DARK} />
            </Pressable>

            <Text style={globalStyles.labelText}>Facturación</Text>

            <Pressable
              onPress={() => router.push('/(client)/(profile)/orders')}
              style={styles.menuItem}
            >
              <View style={styles.menuItemLeft}>
                <MaterialCommunityIcons name="truck-delivery" size={20} color={GRAY_COLOR_DARK} />
                <Text style={globalStyles.bodyText}>Mis pedidos</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color={GRAY_COLOR_DARK} />
            </Pressable>

            <Pressable
              onPress={() => router.push('/(client)/(profile)/invoices')}
              style={styles.menuItem}
            >
              <View style={styles.menuItemLeft}>
                <MaterialCommunityIcons name="script-text" size={20} color={GRAY_COLOR_DARK} />
                <Text style={globalStyles.bodyText}>Mis facturas</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color={GRAY_COLOR_DARK} />
            </Pressable>
          </View>
          <Button
            label="Cerrar sesión"
            icon="logout"
            onPress={() => requestLogout()}
            buttonStyle={styles.logoutButton}
          />
        </>
      )}
    </ScrollView>
  );
});

export default function ClientProfileScreen() {
  return (
    <ProfileProvider>
      <ClientProfile />
    </ProfileProvider>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    rowGap: 10,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'white',
  },
  settingsSection: {
    rowGap: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5,
  },
  notificationBadge: {
    color: 'white',
    backgroundColor: PRIMARY_COLOR,
    width: 20,
    height: 20,
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 5,
  },
  logoutButton: {
    backgroundColor: GRAY_COLOR_DARK,
    borderColor: 'black',
  },
});
