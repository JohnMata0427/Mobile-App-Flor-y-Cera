import {
  GRAY_COLOR_LIGHT,
  PRIMARY_COLOR,
  PRIMARY_COLOR_DARK,
  SECONDARY_COLOR_DARK,
} from '@/constants/Colors';
import type { Invoice } from '@/interfaces/Invoice';
import { capitalizeWord } from '@/utils/textTransform';
import { toLocaleDate } from '@/utils/toLocaleDate';
import { Image } from 'expo-image';
import { memo } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

interface InvoiceDetailsModalProps {
  invoice: Invoice;
  isVisible: boolean;
  onClose: () => void;
}

export const InvoiceDetailsModal = memo(
  ({ invoice, isVisible, onClose }: InvoiceDetailsModalProps) => {
    if (!isVisible) return null;

    const { _id, cliente, fecha_venta, updatedAt, productos, estado, total } = invoice;
    const { nombre, apellido, email, cedula, direccion, telefono } = cliente ?? {};

    const subtotalWithoutTax = total / 1.15;

    return (
      <Modal
        visible={isVisible}
        backdropColor={'rgba(0, 0, 0, 0.1)'}
        animationType="slide"
        onRequestClose={onClose}
        statusBarTranslucent
        navigationBarTranslucent
      >
        <View style={styles.modalContainer}>
          <Text style={styles.titleText}>Detalles de la Factura</Text>
          <View style={styles.invoiceHeader}>
            <View style={styles.invoiceHeaderDetails}>
              <Text style={styles.detailText}>
                <Text style={styles.detailTextBold}>ID de Factura: </Text>
                {_id}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.detailTextBold}>Cliente: </Text>
                {nombre} {apellido}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.detailTextBold}>Cédula: </Text>
                {cedula}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.detailTextBold}>Dirección: </Text>
                {direccion}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.detailTextBold}>Teléfono: </Text>
                {telefono}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.detailTextBold}>Email: </Text>
                {email}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.detailTextBold}>Fecha de Venta: </Text>
                {toLocaleDate(fecha_venta ?? Date.now())}
              </Text>
            </View>
            <Image source={require('@/assets/logo.png')} style={styles.image} />
          </View>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>#</Text>
              <Text style={[styles.tableHeaderText, styles.tableDescriptionColumn]}>
                Descripción
              </Text>
              <Text style={styles.tableHeaderText}>Cantidad</Text>
              <Text style={styles.tableHeaderText}>Precio</Text>
              <Text style={styles.tableHeaderText}>Total</Text>
            </View>
            <View>
              {productos?.map(
                ({ cantidad, subtotal, nombre, producto_id, tipo, producto }, index) => {
                  const subtotalWithoutTaxProduct = subtotal / 1.15;
                  const unitPrice = subtotalWithoutTaxProduct / cantidad;

                  return (
                    <View key={producto_id} style={styles.tableBody}>
                      <Text style={styles.tableBodyText}>{index + 1}</Text>
                      <Text style={[styles.tableBodyText, styles.tableDescriptionColumn]}>
                        {nombre ??
                          producto?.nombre ??
                          ((tipo ?? producto?.tipo) === 'personalizado'
                            ? 'Producto Personalizado'
                            : 'Recomendación de IA')}
                      </Text>
                      <Text style={styles.tableBodyText}>{cantidad}</Text>
                      <Text style={styles.tableBodyText}>${unitPrice?.toFixed(2)}</Text>
                      <Text style={styles?.tableBodyText}>
                        ${subtotalWithoutTaxProduct.toFixed(2)}
                      </Text>
                    </View>
                  );
                },
              )}
            </View>
          </View>
          <View style={styles.tableFooter}>
            <Text style={styles.detailText}>
              <Text style={styles.tableHeaderText}>Subtotal: </Text>$
              {subtotalWithoutTax?.toFixed(2)}
            </Text>
            <Text style={styles.detailText}>
              <Text style={styles.tableHeaderText}>IVA (15%): </Text>$
              {(total - subtotalWithoutTax)?.toFixed(2)}
            </Text>
            <Text style={styles.detailText}>
              <Text style={styles.tableHeaderText}>Total: </Text>${total?.toFixed(2)}
            </Text>
          </View>
          <View style={styles.footer}>
            <Text style={styles.detailText}>
              <Text style={styles.tableHeaderText}>Estado de entrega: </Text>
              {capitalizeWord(estado)}
            </Text>
            <Text style={styles.detailText}>
              <Text style={styles.tableHeaderText}>Actualizado: </Text>
              {toLocaleDate(updatedAt ?? Date.now())}
            </Text>
          </View>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </Pressable>
        </View>
      </Modal>
    );
  },
);

const styles = StyleSheet.create({
  modalContainer: {
    margin: 'auto',
    width: '90%',
    minHeight: '10%',
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 15,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'left',
    marginBottom: 5,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  invoiceHeaderDetails: {
    rowGap: 2,
  },
  detailText: {
    fontSize: 11,
  },
  detailTextBold: {
    color: SECONDARY_COLOR_DARK,
  },
  image: {
    width: 50,
    height: 50,
    aspectRatio: 1,
  },
  table: {
    borderWidth: 1,
    borderColor: GRAY_COLOR_LIGHT,
    borderRadius: 5,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: GRAY_COLOR_LIGHT,
    padding: 5,
  },
  tableDescriptionColumn: {
    flex: 2,
  },
  tableHeaderText: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: 11,
    paddingHorizontal: 4,
  },
  tableBody: {
    flexDirection: 'row',
    paddingHorizontal: 5,
  },
  tableBodyText: {
    fontSize: 11,
    padding: 4,
  },
  tableFooter: {
    alignSelf: 'flex-end',
    marginTop: 10,
    marginRight: 10,
    rowGap: 2,
  },
  footer: { marginTop: 20, rowGap: 2 },
  closeButtonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
  closeButton: {
    backgroundColor: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR_DARK,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
  },
});
