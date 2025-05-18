import { AdminHeader } from '@/components/AdminHeader';
import { Pagination } from '@/components/Pagination';
import {
  GRAY_COLOR,
  GRAY_COLOR_DARK,
  GRAY_COLOR_LIGHT,
  GREEN_COLOR,
  GREEN_COLOR_DARK,
  GREEN_COLOR_LIGHT,
  PRIMARY_COLOR,
  PRIMARY_COLOR_DARK,
  RED_COLOR,
  RED_COLOR_DARK,
  RED_COLOR_LIGHT,
} from '@/constants/Colors';
import { BODY_FONT, BOLD_BODY_FONT } from '@/constants/Fonts';
import { ClientsContext, ClientsProvider } from '@/contexts/ClientsContext';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { use } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

function Clients() {
  const {
    clients,
    loading,
    refreshing,
    page,
    totalPages,
    setRefreshing,
    setPage,
    getClients,
    activateClientAccount,
    deleteClientAccount,
  } = use(ClientsContext);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollViewContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true);
            await getClients();
          }}
          colors={[PRIMARY_COLOR]}
        />
      }
    >
      <View style={styles.container}>
        <AdminHeader />
        <FlatList
          data={clients}
          scrollEnabled={false}
          contentContainerStyle={styles.listContent}
          keyExtractor={({ _id }) => _id}
          renderItem={({
            item: {
              _id,
              nombre,
              apellido,
              email,
              genero,
              imagen,
              direccion,
              estado,
              createdAt,
            },
          }) => {
            const isActive = estado === 'activo';
            return (
              <View style={styles.clientCard}>
                <View style={styles.clientInfoRow}>
                  <View style={styles.clientInnerInfo}>
                    <Image
                      style={styles.clientImage}
                      resizeMode="cover"
                      source={{
                        uri:
                          imagen ??
                          'https://thumbs.dreamstime.com/b/default-avatar-profile-icon-social-media-user-image-gray-blank-silhouette-vector-illustration-305503988.jpg',
                      }}
                    />
                    <Text
                      style={[
                        styles.stateBadge,
                        isActive ? styles.badgeActive : styles.badgeInactive,
                      ]}
                    >
                      {estado}
                    </Text>
                  </View>
                  <View style={styles.detailsContainer}>
                    <View style={styles.detailRow}>
                      <Text
                        style={[
                          styles.detailText,
                          { fontFamily: BOLD_BODY_FONT },
                        ]}
                      >
                        {nombre} {apellido}
                      </Text>
                      <MaterialCommunityIcons
                        name={
                          genero === 'Masculino'
                            ? 'gender-male'
                            : 'gender-female'
                        }
                        size={14}
                        color={genero === 'Masculino' ? '#007AFF' : '#FF1493'}
                      />
                    </View>
                    <View style={styles.detailRow}>
                      <MaterialCommunityIcons
                        name="email-check-outline"
                        size={14}
                        color={GRAY_COLOR_DARK}
                      />
                      <Text style={styles.detailText}>{email}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <MaterialCommunityIcons
                        name="home-outline"
                        size={14}
                        color={GRAY_COLOR_DARK}
                      />
                      <Text style={styles.detailText}>
                        {direccion ?? 'Dirección no registrada'}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <MaterialCommunityIcons
                        name="calendar"
                        size={14}
                        color={GRAY_COLOR_DARK}
                      />
                      <Text style={styles.detailText}>
                        Registrado el{' '}
                        {new Intl.DateTimeFormat('es-ES', {
                          dateStyle: 'long',
                        }).format(new Date(createdAt))}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.actionButtons}>
                  <Pressable
                    style={[styles.actionButton, styles.infoButtonClients]}
                    onPress={() => {}}
                  >
                    <MaterialCommunityIcons
                      name="information-variant"
                      size={20}
                      color="white"
                    />
                  </Pressable>
                  <Pressable
                    style={[
                      styles.actionButton,
                      isActive
                        ? styles.toggleButtonActive
                        : styles.toggleButtonInactive,
                    ]}
                    onPress={() => {
                      isActive
                        ? deleteClientAccount(_id)
                        : activateClientAccount(_id);
                    }}
                  >
                    <MaterialCommunityIcons
                      name={isActive ? 'account-lock' : 'account-lock-open'}
                      size={20}
                      color="white"
                    />
                  </Pressable>
                </View>
              </View>
            );
          }}
          ListEmptyComponent={
            loading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.emptyText}>Cargando datos...</Text>
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons name="account-off" size={30} />
                <Text style={styles.emptyText}>
                  No se encontraron clientes, intente más tarde.
                </Text>
              </View>
            )
          }
          ListFooterComponent={
            <Pagination page={page} setPage={setPage} totalPages={totalPages} />
          }
        />
      </View>
    </ScrollView>
  );
}

export default function AdminClients() {
  return (
    <ClientsProvider>
      <Clients />
    </ClientsProvider>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    paddingHorizontal: 25,
    rowGap: 10,
  },
  listContent: {
    rowGap: 10,
  },
  clientCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    rowGap: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: GRAY_COLOR_LIGHT,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },
  clientInfoRow: {
    flexDirection: 'row',
    columnGap: 10,
    alignItems: 'center',
  },
  clientInnerInfo: {
    rowGap: 4,
    justifyContent: 'center',
  },
  clientImage: {
    width: 45,
    height: 45,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: GRAY_COLOR,
  },
  stateBadge: {
    fontFamily: BODY_FONT,
    fontSize: 10,
    textAlign: 'center',
    borderWidth: 0.5,
    paddingHorizontal: 2,
    borderRadius: 20,
  },
  badgeActive: {
    backgroundColor: GREEN_COLOR_LIGHT,
    color: GREEN_COLOR_DARK,
    borderColor: GREEN_COLOR_DARK,
  },
  badgeInactive: {
    backgroundColor: RED_COLOR_LIGHT,
    color: RED_COLOR_DARK,
    borderColor: RED_COLOR_DARK,
  },
  detailsContainer: {
    rowGap: 2,
  },
  detailRow: {
    flexDirection: 'row',
    columnGap: 2,
    alignItems: 'center',
  },
  detailText: {
    fontFamily: BODY_FONT,
    fontSize: 12,
  },
  actionButtons: {
    rowGap: 5,
  },
  actionButton: {
    borderRadius: 5,
    padding: 2,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },
  infoButtonClients: {
    backgroundColor: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR_DARK,
  },
  toggleButtonActive: {
    backgroundColor: RED_COLOR,
    borderColor: RED_COLOR_DARK,
  },
  toggleButtonInactive: {
    backgroundColor: GREEN_COLOR,
    borderColor: GREEN_COLOR_DARK,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 5,
  },
  emptyText: {
    fontFamily: BODY_FONT,
  },
});
