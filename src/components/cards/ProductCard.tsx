import {
  GRAY_COLOR_DARK,
  GRAY_COLOR_LIGHT,
  PRIMARY_COLOR,
  PRIMARY_COLOR_DARK,
  SECONDARY_COLOR,
  SECONDARY_COLOR_DARK,
  TERTIARY_COLOR,
  TERTIARY_COLOR_DARK,
} from '@/constants/Colors';
import { BODY_FONT, BOLD_BODY_FONT } from '@/constants/Fonts';
import type { IDCategoria, Product } from '@/interfaces/Product';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { memo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

interface ProductCardProps {
  data: Product;
  children?: React.ReactNode;
}

export const ProductCard = memo(({ data, children }: ProductCardProps) => {
  const { imagen, nombre, precio, stock, id_categoria } = data;

  const categoria = (id_categoria as IDCategoria)?.nombre?.split(' ')[0] ?? 'Ninguna';

  return (
    <View style={styles.productCard}>
      <Image source={{ uri: imagen }} resizeMode="cover" style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{nombre}</Text>
        <View style={styles.priceStockRow}>
          <Text style={styles.priceText}>${precio} USD</Text>
          <Text style={styles.categoryBadge}>{categoria}</Text>
        </View>
        <View style={styles.stockRow}>
          <MaterialCommunityIcons name="cart-outline" size={14} color="green" />
          <Text style={styles.stockText}>{stock} en stock</Text>
        </View>
        {children}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  productCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    width: '48.45%',
    padding: 10,
    paddingBottom: 5,
    justifyContent: 'space-between',
  },
  productImage: {
    aspectRatio: 1 / 1,
    borderRadius: 10,
    backgroundColor: GRAY_COLOR_LIGHT,
  },
  productInfo: {
    rowGap: 2,
    paddingVertical: 5,
    borderTopColor: GRAY_COLOR_LIGHT,
    borderTopWidth: 1,
  },
  productName: {
    fontFamily: BOLD_BODY_FONT,
    fontSize: 15,
  },
  priceStockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontFamily: BODY_FONT,
    fontSize: 12,
  },
  categoryBadge: {
    fontFamily: BOLD_BODY_FONT,
    fontSize: 10,
    color: 'white',
    backgroundColor: GRAY_COLOR_DARK,
    paddingVertical: 1,
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  stockRow: {
    flexDirection: 'row',
    columnGap: 4,
    alignItems: 'center',
  },
  stockText: {
    fontFamily: BODY_FONT,
    color: 'green',
    fontSize: 12,
  },
  actionRow: {
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
  editButton: {
    backgroundColor: SECONDARY_COLOR,
    borderColor: SECONDARY_COLOR_DARK,
  },
  deleteButton: {
    backgroundColor: TERTIARY_COLOR,
    borderColor: TERTIARY_COLOR_DARK,
  },
});
