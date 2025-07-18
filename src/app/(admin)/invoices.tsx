import { AdminFilter } from '@/components/AdminFilter';
import { AdminHeader } from '@/components/AdminHeader';
import { AdminSearch } from '@/components/AdminSearch';
import { InvoiceCard } from '@/components/cards/InvoiceCard';
import { Loading } from '@/components/Loading';
import { InvoiceDetailsModal } from '@/components/modals/InvoiceDetailsModal';
import {
  GRAY_COLOR_DARK,
  GREEN_COLOR,
  GREEN_COLOR_DARK,
  PRIMARY_COLOR,
  PRIMARY_COLOR_DARK,
  PRIMARY_COLOR_EXTRA_LIGHT,
  RED_COLOR,
  RED_COLOR_DARK,
  SECONDARY_COLOR,
  TERTIARY_COLOR,
} from '@/constants/Colors';
import { InvoicesContext, InvoicesProvider } from '@/contexts/InvoicesContext';
import { globalStyles } from '@/globalStyles';
import type { Invoice, InvoiceFilter } from '@/interfaces/Invoice';
import { showConfirmationAlert } from '@/utils/showAlert';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { memo, use, useCallback, useState } from 'react';
import {
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
  filter: InvoiceFilter;
}

const filterButtons: FilterButton[] = [
  { label: 'Todas', filter: { key: 'estado', value: '' } },
  { label: 'Pendientes', filter: { key: 'estado', value: 'pendiente' } },
  { label: 'Finalizadas', filter: { key: 'estado', value: 'finalizado' } },
];

const RenderItem = memo(
  ({
    item,
    showChangeStateAlert,
    setSelectedInvoice,
    setModalVisible,
  }: {
    item: Invoice;
    showChangeStateAlert: (isPending: boolean, _id: string, nombre: string) => void;
    setSelectedInvoice: (invoice: Invoice) => void;
    setModalVisible: (visible: boolean) => void;
  }) => {
    const { _id, total, estado, cliente } = item;
    const isPending = estado === 'pendiente';
    const { nombre, apellido } = cliente ?? {};

    return (
      <InvoiceCard data={item} isPending={isPending}>
        <View style={styles.actionContainer}>
          <View style={styles.amountContainer}>
            <MaterialCommunityIcons name="cash-multiple" size={26} color={GRAY_COLOR_DARK} />
            <Text style={globalStyles.labelText}>${total?.toFixed(2)} USD</Text>
          </View>
          <View style={styles.actionButtons}>
            <Pressable
              style={[styles.actionButton, styles.infoButton]}
              onPress={() => {
                setSelectedInvoice(item);
                setModalVisible(true);
              }}
            >
              <MaterialCommunityIcons name="information-variant" size={20} color="white" />
            </Pressable>
            <Pressable
              style={[
                styles.actionButton,
                isPending ? styles.toggleButtonPending : styles.toggleButtonCompleted,
              ]}
              onPress={() => showChangeStateAlert(isPending, _id, `${nombre} ${apellido}`)}
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
  },
);

const Invoices = memo(function Invoices() {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice>({} as Invoice);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const {
    searchedInvoices,
    loading,
    refreshing,
    filter,
    setFilter,
    setSearch,
    setRefreshing,
    getInvoices,
    updateInvoiceStatus,
  } = use(InvoicesContext);

  const showChangeStateAlert = useCallback(
    (isPending: boolean, _id: string, nombre: string) => {
      showConfirmationAlert({
        message: `¿Está seguro de que desea ${
          isPending ? 'completar' : 'cancelar'
        } la factura de ${nombre}?`,
        onConfirm: async () => {
          await updateInvoiceStatus(_id, isPending ? 'finalizado' : 'pendiente');
        },
      });
    },
    [updateInvoiceStatus],
  );

  return (
    <ScrollView
      contentContainerStyle={globalStyles.scrollViewContent}
      stickyHeaderIndices={[1]}
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
      <AdminHeader />

      <View key="search-bar-container">
        <View style={styles.stickyHeader}>
          <AdminSearch
            setSearch={setSearch}
            placeholder="Buscar factura por nombre del cliente..."
          />

          <AdminFilter filterButtons={filterButtons} filter={filter} setFilter={setFilter as any} />
        </View>
      </View>

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
          renderItem={({ item }) => (
            <RenderItem
              item={item}
              showChangeStateAlert={showChangeStateAlert}
              setSelectedInvoice={setSelectedInvoice}
              setModalVisible={setModalVisible}
            />
          )}
          ListEmptyComponent={
            <View style={globalStyles.centeredContainer}>
              <MaterialCommunityIcons name="file-document-outline" size={30} />
              <Text style={globalStyles.bodyText}>No hay facturas registradas</Text>
            </View>
          }
        />
      )}
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
  stickyHeader: {
    rowGap: 10,
    backgroundColor: PRIMARY_COLOR_EXTRA_LIGHT,
    paddingTop: 5,
    paddingBottom: 10,
    paddingHorizontal: 15,
  },
  listContent: {
    rowGap: 10,
    paddingHorizontal: 15,
  },
  actionContainer: {
    rowGap: 5,
    justifyContent: 'center',
  },
  amountContainer: {
    alignItems: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
});