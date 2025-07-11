import {
  GRAY_COLOR,
  GRAY_COLOR_DARK,
  GRAY_COLOR_LIGHT,
  PRIMARY_COLOR_DARK,
  TERTIARY_COLOR_DARK,
} from '@/constants/Colors';
import { BOLD_BODY_FONT } from '@/constants/Fonts';
import type { Product } from '@/interfaces/Product';
import { useCartStore } from '@/store/useCartStore';
import { capitalizeWord } from '@/utils/textTransform';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { memo } from 'react';
import { Image, StyleSheet, Text, View, type DimensionValue } from 'react-native';
import { Button } from '../Button';

interface ClientProductCardProps {
  data: Product;
  width?: DimensionValue;
}

export const ClientProductCard = memo(({ data, width = 150 }: ClientProductCardProps) => {
  const { addProductToCart } = useCartStore();

  const { imagen, nombre, precio, aroma, tipo, id_categoria, descripcion } = data;
  const [int, decimal] = precio.toFixed(2).split('.');
  const priceWithoutDiscount = precio * 1.1;

  return (
    <View style={[styles.productCard, { width }]}>
      <Image source={{ uri: imagen }} resizeMode="cover" style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1} ellipsizeMode="tail">
          {nombre}
        </Text>
        <View style={styles.badgesContainer}>
          <Text style={[styles.badge, styles.categoryBadge]}>{id_categoria?.nombre}</Text>
          <View style={{ flexDirection: 'row', columnGap: 2 }}>
            <Text style={[styles.badge, styles.aromaBadge]}>{capitalizeWord(aroma)}</Text>
            <Text style={[styles.badge, styles.typeBadge]}>{capitalizeWord(tipo)}</Text>
          </View>
        </View>

        <Text style={{ fontSize: 12, color: GRAY_COLOR }} numberOfLines={1} ellipsizeMode="tail">
          {descripcion}
        </Text>

        <Text style={styles.priceText}>
          $ {int}.
          <Text style={{ fontSize: 10 }}>
            {decimal}{' '}
            <Text
              style={{
                color: GRAY_COLOR,
                fontWeight: 'normal',
                textDecorationLine: 'line-through',
              }}
            >
              $ {priceWithoutDiscount.toFixed(2)}
            </Text>
          </Text>
        </Text>
        <View style={styles.actionRow}>
          <Button
            label="¡Lo quiero!"
            icon="cart-plus"
            onPress={() => addProductToCart(data, 1)}
            buttonStyle={{
              flex: 1,
              paddingVertical: 5,
            }}
            textStyle={{ fontSize: 12 }}
          />
          <MaterialCommunityIcons name="heart-outline" size={20} color={GRAY_COLOR_DARK} />
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  productCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: 150,
    padding: 8,
    justifyContent: 'space-between',
  },
  productImage: {
    aspectRatio: 1 / 1,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: GRAY_COLOR_LIGHT,
  },
  productInfo: {
    rowGap: 2,
    paddingVertical: 5,
  },
  productName: {
    fontFamily: BOLD_BODY_FONT,
    color: GRAY_COLOR_DARK,
  },
  badgesContainer: {
    rowGap: 2,
    alignItems: 'flex-start',
  },
  badge: {
    fontFamily: BOLD_BODY_FONT,
    fontSize: 10,
    paddingVertical: 1,
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  categoryBadge: {
    color: 'white',
    backgroundColor: GRAY_COLOR_DARK,
  },
  aromaBadge: {
    color: 'white',
    backgroundColor: TERTIARY_COLOR_DARK,
  },
  typeBadge: {
    color: 'white',
    backgroundColor: PRIMARY_COLOR_DARK,
  },
  priceText: {
    color: PRIMARY_COLOR_DARK,
    fontWeight: 'bold',
    fontSize: 16,
  },
  actionRow: { flexDirection: 'row', columnGap: 5, alignItems: 'center' },
});
