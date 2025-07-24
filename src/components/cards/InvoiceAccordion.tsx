import { GRAY_COLOR_LIGHT, PRIMARY_COLOR_LIGHT } from '@/constants/Colors';
import { globalStyles } from '@/globalStyles';
import type { Invoice } from '@/interfaces/Invoice';
import { toLocaleDate } from '@/utils/toLocaleDate';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import { memo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

interface InvoiceAccordionProps {
  invoice: Invoice;
}

export const InvoiceAccordion = memo(({ invoice }: InvoiceAccordionProps) => {
  const [opened, setOpened] = useState<boolean>(false);

  return (
    <View style={styles.invoiceCard}>
      <Pressable
        style={[
          styles.invoiceHeader,
          {
            backgroundColor:
              invoice.estado === 'finalizado' ? PRIMARY_COLOR_LIGHT : GRAY_COLOR_LIGHT,
          },
        ]}
        onPress={() => setOpened(!opened)}
      >
        <View>
          <Text style={globalStyles.labelText}>
            Pedido: {invoice._id.slice(invoice._id.length - 8, invoice._id.length)}
          </Text>
          <Text style={globalStyles.bodyText}>Fecha: {toLocaleDate(invoice.fecha_venta)}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <MaterialCommunityIcons
            name={invoice.estado === 'finalizado' ? 'wallet-giftcard' : 'clock-outline'}
            size={16}
            color="black"
          />
          <Text style={[globalStyles.labelText, { fontWeight: 'bold' }]}>
            $ {invoice.total.toFixed(2)}
          </Text>
          <MaterialCommunityIcons
            name={opened ? 'chevron-up' : 'chevron-down'}
            size={16}
            color="black"
          />
        </View>
      </Pressable>

      {opened && (
        <FlatList
          data={invoice.productos}
          keyExtractor={({ _id }) => _id}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          renderItem={({
            item: { _id, nombre, descripcion, imagen, cantidad, precio, tipo, ingredientes },
          }) => (
            <View key={_id} style={styles.productRow}>
              <View style={styles.productInfo}>
                <Image source={{ uri: imagen }} style={styles.productImage} contentFit="cover" />
                <View>
                  <Text style={globalStyles.labelText}>
                    {nombre ??
                      (tipo === 'personalizado' ? 'Producto Personalizado' : 'Recomendación de IA')}
                  </Text>
                  <Text style={styles.productDescription} numberOfLines={3} ellipsizeMode="tail">
                    {descripcion ??
                      `Ingredientes: ${ingredientes?.map(ing => ing.nombre).join(', ')}`}
                  </Text>
                </View>
              </View>
              <View style={styles.productDetails}>
                <Text style={globalStyles.labelText}>$ {precio.toFixed(2)}</Text>
                <Text style={globalStyles.bodyText}>x {cantidad}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  invoiceCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: GRAY_COLOR_LIGHT,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: GRAY_COLOR_LIGHT,
  },
  productInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  productDescription: {
    color: 'gray',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    fontSize: 10,
    maxWidth: 170,
  },
  productDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
});
