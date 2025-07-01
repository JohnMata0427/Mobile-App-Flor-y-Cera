import { AdminFilter } from '@/components/AdminFilter';
import { AdminHeader } from '@/components/AdminHeader';
import { ClientCard } from '@/components/cards/ClientCard';
import { Loading } from '@/components/Loading';
import { ClientInformationModal } from '@/components/modals/ClientInformationModal';
import {
  GREEN_COLOR,
  GREEN_COLOR_DARK,
  PRIMARY_COLOR,
  PRIMARY_COLOR_DARK,
  RED_COLOR,
  RED_COLOR_DARK,
  SECONDARY_COLOR,
  TERTIARY_COLOR,
} from '@/constants/Colors';
import { BODY_FONT } from '@/constants/Fonts';
import { ClientsContext, ClientsProvider } from '@/contexts/ClientsContext';
import type { Client, ClientFilter } from '@/interfaces/Client';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { memo, use, useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface FilterButton {
  label: string;
  filter: ClientFilter;
}

const filterButtons: FilterButton[] = [
  { label: 'Todos', filter: { key: 'estado', value: '' } },
  { label: 'Masculino', filter: { key: 'genero', value: 'masculino' } },
  { label: 'Femenino', filter: { key: 'genero', value: 'femenino' } },
  { label: 'Activos', filter: { key: 'estado', value: 'activo' } },
  { label: 'Inactivos', filter: { key: 'estado', value: 'inactivo' } },
];

const Clients = memo(() => {
  const [selectedClient, setSelectedClient] = useState<Client>({} as Client);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const {
    searchedClients,
    loading,
    refreshing,
    page,
    totalPages,
    filter,
    setRefreshing,
    setPage,
    setFilter,
    setSearch,
    getClients,
    activateClientAccount,
    deleteClientAccount,
  } = use(ClientsContext);

  const showChangeStateAlert = useCallback(
    (isActive: boolean, client: Client) => {
      const { nombre, apellido, _id } = client;

      Alert.alert(
        'Cambiar estado de cuenta',
        `¿Está seguro/a que desea ${
          isActive ? 'desactivar' : 'activar'
        } la cuenta de ${nombre} ${apellido}?`,
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Aceptar',
            onPress: async () => {
              await (isActive ? deleteClientAccount(_id) : activateClientAccount(_id));
            },
          },
        ],
      );
    },
    [activateClientAccount, deleteClientAccount],
  );

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
          colors={[PRIMARY_COLOR, SECONDARY_COLOR, TERTIARY_COLOR]}
        />
      }
    >
      <View style={styles.container}>
        <AdminHeader setSearch={setSearch} placeholder="Buscar por nombre, apellido o correo..." />
        <ClientInformationModal
          isVisible={modalVisible}
          client={selectedClient}
          onClose={() => setModalVisible(false)}
        />

        {loading ? (
          <Loading />
        ) : (
          <FlatList
            data={searchedClients}
            scrollEnabled={false}
            contentContainerStyle={styles.listContent}
            keyExtractor={({ _id }) => _id}
            renderItem={({ item }) => {
              const { estado } = item;
              const isActive = estado === 'activo';

              return (
                <ClientCard data={item} isActive={isActive}>
                  <View style={styles.actionButtons}>
                    <Pressable
                      style={[styles.actionButton, styles.infoButtonClients]}
                      onPress={() => {
                        setModalVisible(true);
                        setSelectedClient(item);
                      }}
                    >
                      <MaterialCommunityIcons name="information-variant" size={20} color="white" />
                    </Pressable>
                    <Pressable
                      style={[
                        styles.actionButton,
                        isActive ? styles.toggleButtonActive : styles.toggleButtonInactive,
                      ]}
                      onPress={() => showChangeStateAlert(isActive, item)}
                    >
                      <MaterialCommunityIcons
                        name={isActive ? 'account-lock' : 'account-lock-open'}
                        size={20}
                        color="white"
                      />
                    </Pressable>
                  </View>
                </ClientCard>
              );
            }}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons name="account-off" size={30} />
                <Text style={styles.emptyText}>No se encontraron clientes, intente más tarde.</Text>
              </View>
            }
            ListHeaderComponent={
              <AdminFilter filterButtons={filterButtons} filter={filter} setFilter={setFilter as any} />
            }
          />
        )}
      </View>
    </ScrollView>
  );
});

export default function AdminClients() {
  return (
    <ClientsProvider>
      <Clients />
    </ClientsProvider>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: { flexGrow: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 10,
    rowGap: 10,
  },
  listContent: { rowGap: 10 },
  actionButtons: { rowGap: 5 },
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 5,
  },
  emptyText: { fontFamily: BODY_FONT },
});
