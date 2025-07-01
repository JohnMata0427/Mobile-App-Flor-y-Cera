import { AdminFilter } from '@/components/AdminFilter';
import { AdminHeader } from '@/components/AdminHeader';
import { InvoiceCard } from '@/components/cards/InvoiceCard';
import { Loading } from '@/components/Loading';
import { InvoiceDetailsModal } from '@/components/modals/InvoiceDetailsModal';
import {
  GRAY_COLOR_DARK,
  GREEN_COLOR,
  GREEN_COLOR_DARK,
  PRIMARY_COLOR,
  PRIMARY_COLOR_DARK,
  PRIMARY_COLOR_LIGHT,
  RED_COLOR,
  RED_COLOR_DARK,
  SECONDARY_COLOR,
  TERTIARY_COLOR,
} from '@/constants/Colors';
import { BODY_FONT, BOLD_BODY_FONT } from '@/constants/Fonts';
import { InvoicesContext, InvoicesProvider } from '@/contexts/InvoicesContext';
import type { Invoice, InvoiceFilter } from '@/interfaces/Invoice';
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
  filter: InvoiceFilter
}

const filterButtons: FilterButton[] = [
  { label: 'Todas', filter: { key: 'estado', value: '' } },
  { label: 'Pendientes', filter: { key: 'estado', value: 'pendiente' } },
  { label: 'Finalizadas', filter: { key: 'estado', value: 'finalizado' } },
];

const Invoices = memo(() => {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice>({} as Invoice);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const {
    searchedInvoices,
    loading,
    page,
    totalPages,
    refreshing,
    filter,
    setPage,
    setFilter,
    setSearch,
    setRefreshing,
    getInvoices,
    updateInvoiceStatus,
  } = use(InvoicesContext);

  const showChangeStateAlert = useCallback(
    (isPending: boolean, _id: string, nombre: string) => {
      Alert.alert(
        'Actualizar estado',
        `¿Está seguro de que desea ${
          isPending ? 'completar' : 'cancelar'
        } la factura de ${nombre}?`,
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Aceptar',
            onPress: async () => {
              await updateInvoiceStatus(_id, isPending ? 'finalizado' : 'pendiente');
            },
          },
        ],
      );
    },
    [updateInvoiceStatus],
  );

  return (
    <ScrollView
      contentContainerStyle={styles.scrollViewContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true);
            await getInvoices();
          }}
          colors={[PRIMARY_COLOR, SECONDARY_COLOR, TERTIARY_COLOR]}
        />
      }
    >
      <View style={styles.container}>
        <AdminHeader 
          setSearch={setSearch}
          placeholder="Buscar por nombre del cliente..."
        />
        <InvoiceDetailsModal
          isVisible={modalVisible}
          invoice={selectedInvoice}
          onClose={() => setModalVisible(false)}
        />
        {loading ? (
          <Loading />
        ) : (
          <FlatList
            data={searchedInvoices}
            scrollEnabled={false}
            contentContainerStyle={styles.listContent}
            keyExtractor={({ _id }) => _id}
            renderItem={({ item }) => {
              const {
                _id,
                total,
                estado,
                cliente_id,
              } = item;
              const isPending = estado === 'pendiente';
              const { nombre, apellido } = cliente_id ?? {};

              return (
                <InvoiceCard data={item} isPending={isPending}>
                  <View style={styles.actionContainer}>
                    <View style={styles.amountContainer}>
                      <MaterialCommunityIcons
                        name="cash-multiple"
                        size={26}
                        color={GRAY_COLOR_DARK}
                      />
                      <Text style={styles.amountText}>${total} USD</Text>
                    </View>
                    <View style={styles.actionButtons}>
                      <Pressable
                        style={[styles.actionButton, styles.infoButton]}
                        onPress={() => {
                          setSelectedInvoice(item);
                          setModalVisible(true);
                        }}
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
                          {
                            backgroundColor: isPending ? GREEN_COLOR : RED_COLOR,
                            borderColor: isPending ? GREEN_COLOR_DARK : RED_COLOR_DARK,
                          },
                        ]}
                        onPress={() =>
                          showChangeStateAlert(isPending, _id, `${nombre} ${apellido}`)
                        }
                      >
                        <MaterialCommunityIcons
                          name={isPending ? 'truck-check' : 'truck-fast'}
                          size={20}
                          color="white"
                        />
                      </Pressable>
                    </View>
                  </View>
                </InvoiceCard>
              );
            }}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons name="file-document-outline" size={30} />
                <Text style={styles.emptyText}>No hay facturas registradas</Text>
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

export default function AdminInvoices() {
  return (
    <InvoicesProvider>
      <Invoices />
    </InvoicesProvider>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 10,
    rowGap: 10,
  },
  listContent: {
    rowGap: 10,
  },
  actionContainer: {
    rowGap: 5,
    justifyContent: 'center',
  },
  amountContainer: {
    alignItems: 'center',
  },
  amountText: {
    fontFamily: BOLD_BODY_FONT,
  },
  actionButtons: {
    flexDirection: 'row',
    columnGap: 5,
  },
  actionButton: {
    borderRadius: 5,
    padding: 2,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },
  infoButton: {
    backgroundColor: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR_DARK,
  },
  toggleButtonPending: {
    backgroundColor: GREEN_COLOR,
    borderColor: GREEN_COLOR_DARK,
  },
  toggleButtonCompleted: {
    backgroundColor: RED_COLOR,
    borderColor: RED_COLOR_DARK,
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
