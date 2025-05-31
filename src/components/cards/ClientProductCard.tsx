import {
  GRAY_COLOR_DARK,
  GRAY_COLOR_LIGHT,
  PRIMARY_COLOR_DARK,
  TERTIARY_COLOR_DARK,
} from '@/constants/Colors';
import { BOLD_BODY_FONT } from '@/constants/Fonts';
import type { Product } from '@/interfaces/Product';
import { useCartStore } from '@/store/useCartStore';
import { capitalizeFirstLetter } from '@/utils/textTransform';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { memo, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Button } from '../Button';

interface ClientProductCardProps {
  data: Product;
  children?: React.ReactNode;
}

export const ClientProductCard = memo(({ data }: ClientProductCardProps) => {
  const { _id, imagen, nombre, precio, aroma, tipo, id_categoria } = data;
  const [int, decimal] = (precio - 0.01).toString().split('.');

  const { addProductToCart } = useCartStore();
  const [quantity, setQuantity] = useState(1);

  return (
    <View style={styles.productCard}>
      <Image
        source={{ uri: imagen }}
        resizeMode="cover"
        style={styles.productImage}
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1} ellipsizeMode="tail">
          {nombre}
        </Text>
        <View style={styles.badgesContainer}>
          <Text style={[styles.badge, styles.categoryBadge]}>
            {id_categoria?.nombre}
          </Text>
          <View style={{ flexDirection: 'row', columnGap: 2 }}>
            <Text style={[styles.badge, styles.aromaBadge]}>
              {capitalizeFirstLetter(aroma)}
            </Text>
            <Text style={[styles.badge, styles.typeBadge]}>
              {capitalizeFirstLetter(tipo)}
            </Text>
          </View>
        </View>
        <Text style={styles.priceText}>
          $ {int}.<Text style={{ fontSize: 9 }}>{decimal}</Text>
        </Text>
        <View
          style={{ flexDirection: 'row', columnGap: 5, alignItems: 'center' }}
        >
          <Button
            label="¡Lo quiero!"
            icon="cart-plus"
            onPress={() =>
              addProductToCart({ producto_id: _id, cantidad: quantity })
            }
            paddingVertical={5}
          />
          <MaterialCommunityIcons
            name="heart-outline"
            size={20}
            color={GRAY_COLOR_DARK}
          />
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
    backgroundColor: GRAY_COLOR_LIGHT,
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
  },
});
