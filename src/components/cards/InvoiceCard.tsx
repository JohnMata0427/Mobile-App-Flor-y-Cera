import {
  GRAY_COLOR_DARK,
  GRAY_COLOR_LIGHT,
  GREEN_COLOR_DARK,
  GREEN_COLOR_LIGHT,
} from '@/constants/Colors';
import type { Invoice } from '@/interfaces/Invoice';
import { toLocaleDate } from '@/utils/toLocaleDate';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { memo, type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BaseCard } from './BaseCard';

interface InvoiceCardProps {
  data: Invoice;
  isPending: boolean;
  children?: ReactNode;
}

export const InvoiceCard = memo(({ data, isPending, children }: InvoiceCardProps) => {
  const {
    cliente,
    fecha_venta,
    productos: { length },
    estado,
  } = data;
  const { nombre, apellido, email } = cliente ?? {};

  return (
    <BaseCard styles={styles.card}>
      <View style={styles.invoiceInfo}>
        <Text style={styles.customerName}>
          {nombre} {apellido}
        </Text>
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="email-check-outline" size={14} color={GRAY_COLOR_DARK} />
          <Text style={styles.detailText}>{email}</Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="calendar" size={14} color={GRAY_COLOR_DARK} />
          <Text style={styles.detailText}>{toLocaleDate(fecha_venta)}</Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="shopping-outline" size={14} color={GRAY_COLOR_DARK} />
          <Text style={styles.detailText}>
            {length + (length > 1 ? ' productos' : ' producto')}
          </Text>
        </View>
        <View
          style={[
            styles.detailRow,
            styles.statusBadge,
            {
              backgroundColor: isPending ? GRAY_COLOR_LIGHT : GREEN_COLOR_LIGHT,
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
    </BaseCard>
  );
});

const styles = StyleSheet.create({
  card: { flexDirection: 'row', justifyContent: 'space-between' },
  invoiceInfo: {
    width: '60%',
    rowGap: 3,
  },
  customerName: {
    fontWeight: 'bold',
  },
  detailRow: {
    flexDirection: 'row',
    columnGap: 3,
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    columnGap: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GRAY_COLOR_LIGHT,
    paddingVertical: 3,
    borderRadius: 5,
  },
});
