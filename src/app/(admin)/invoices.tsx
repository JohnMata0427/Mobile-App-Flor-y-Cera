import { AdminHeader } from '@/components/AdminHeader';
import { InvoiceDetailsModal } from '@/components/InvoiceDetailsModal';
import { Pagination } from '@/components/Pagination';
import {
  GRAY_COLOR_DARK,
  GRAY_COLOR_LIGHT,
  GREEN_COLOR,
  GREEN_COLOR_DARK,
  GREEN_COLOR_LIGHT,
  PRIMARY_COLOR,
  PRIMARY_COLOR_DARK,
  RED_COLOR,
  RED_COLOR_DARK,
  SECONDARY_COLOR,
  TERTIARY_COLOR,
} from '@/constants/Colors';
import { BODY_FONT, BOLD_BODY_FONT } from '@/constants/Fonts';
import { InvoicesContext, InvoicesProvider } from '@/contexts/InvoicesContext';
import type { Invoice } from '@/interfaces/Invoice';
import { toLocaleDate } from '@/utils/toLocaleDate';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { use, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

function Invoices() {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice>(
    {} as Invoice,
  );
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const {
    invoices,
    loading,
    page,
    totalPages,
    refreshing,
    setPage,
    setRefreshing,
    getInvoices,
    updateInvoiceStatus,
  } = use(InvoicesContext);

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
        <AdminHeader />
        {modalVisible && (
          <InvoiceDetailsModal
            invoice={selectedInvoice}
            isVisible={modalVisible}
            onClose={() => setModalVisible(false)}
          />
        )}
        <FlatList
          data={invoices}
          scrollEnabled={false}
          contentContainerStyle={styles.listContent}
          keyExtractor={({ _id }) => _id}
          renderItem={({ item }) => {
            const {
              _id,
              cliente_id: { nombre, apellido, email },
              fecha_venta,
              productos: { length },
              total,
              estado,
            } = item;
            const isPending = estado === 'pendiente';

            return (
              <View style={styles.invoiceCard}>
                <View style={styles.invoiceInfo}>
                  <Text style={styles.customerName}>
                    {nombre} {apellido}
                  </Text>
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
                      name="calendar"
                      size={14}
                      color={GRAY_COLOR_DARK}
                    />
                    <Text style={styles.detailText}>
                      {toLocaleDate(fecha_venta)}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <MaterialCommunityIcons
                      name="format-list-bulleted"
                      size={14}
                      color={GRAY_COLOR_DARK}
                    />
                    <Text style={styles.detailText}>
                      {length + (length > 1 ? ' productos' : ' producto')}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.detailRow,
                      styles.statusBadge,
                      {
                        backgroundColor: isPending
                          ? GRAY_COLOR_LIGHT
                          : GREEN_COLOR_LIGHT,
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="file-document-outline"
                      size={14}
                      color={isPending ? GRAY_COLOR_DARK : GREEN_COLOR_DARK}
                    />
                    <Text
                      style={[
                        styles.detailText,
                        {
                          color: isPending ? GRAY_COLOR_DARK : GREEN_COLOR_DARK,
                          textTransform: 'capitalize',
                        },
                      ]}
                    >
                      {estado}
                    </Text>
                  </View>
                </View>
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
                          borderColor: isPending
                            ? GREEN_COLOR_DARK
                            : RED_COLOR_DARK,
                        },
                      ]}
                      onPress={() => {
                        updateInvoiceStatus(
                          _id,
                          isPending ? 'finalizado' : 'pendiente',
                        );
                      }}
                    >
                      <MaterialCommunityIcons
                        name={isPending ? 'truck-check' : 'truck-fast'}
                        size={20}
                        color="white"
                      />
                    </Pressable>
                  </View>
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
                <MaterialCommunityIcons
                  name="file-document-outline"
                  size={30}
                />
                <Text style={styles.emptyText}>
                  No hay facturas registradas
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
    paddingHorizontal: 25,
    rowGap: 10,
  },
  listContent: {
    rowGap: 10,
  },
  invoiceCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    rowGap: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  invoiceInfo: {
    rowGap: 2,
  },
  customerName: {
    fontFamily: BOLD_BODY_FONT,
  },
  detailRow: {
    flexDirection: 'row',
    columnGap: 3,
    alignItems: 'center',
  },
  detailText: {
    fontFamily: BODY_FONT,
    fontSize: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    columnGap: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GRAY_COLOR_LIGHT,
    padding: 2,
    borderRadius: 5,
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
