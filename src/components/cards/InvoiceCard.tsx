import {
  GRAY_COLOR_DARK,
  GRAY_COLOR_LIGHT,
  GREEN_COLOR_DARK,
  GREEN_COLOR_LIGHT,
} from '@/constants/Colors';
import { BODY_FONT, BOLD_BODY_FONT } from '@/constants/Fonts';
import type { Invoice } from '@/interfaces/Invoice';
import { toLocaleDate } from '@/utils/toLocaleDate';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface InvoiceCardProps {
  data: Invoice;
  isPending: boolean;
  children?: React.ReactNode;
}

export const InvoiceCard = memo(
  ({ data, isPending, children }: InvoiceCardProps) => {
    const {
      cliente_id: { nombre, apellido, email },
      fecha_venta,
      productos: { length },
      estado,
    } = data;

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
            <Text style={styles.detailText}>{toLocaleDate(fecha_venta)}</Text>
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
        {children}
      </View>
    );
  },
);

const styles = StyleSheet.create({
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
});
