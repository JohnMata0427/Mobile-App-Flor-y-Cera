import {
  GRAY_COLOR,
  GRAY_COLOR_DARK,
  GRAY_COLOR_LIGHT,
  PRIMARY_COLOR_DARK,
  TERTIARY_COLOR_DARK,
} from '@/constants/Colors';
import { BOLD_BODY_FONT } from '@/constants/Fonts';
import type { CartItem } from '@/interfaces/Cart';
import { useCartStore } from '@/store/useCartStore';
import { capitalizeWord } from '@/utils/textTransform';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { memo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

interface CartItemCardProps {
  data: CartItem;
}

export const CartItemCard = memo(({ data }: CartItemCardProps) => {
  const { removeProductFromCart, modifyProductQuantity } = useCartStore();

  const { producto, cantidad } = data;
  const { _id, imagen, nombre, aroma, tipo, beneficios = [], precio = 0 } = producto;

  const [int, decimal] = precio.toFixed(2).split('.');
  const priceWithoutDiscount = precio * 1.123;

  const [quantity, setQuantity] = useState(cantidad);

  return (
    <View style={styles.cartItemCard}>
      <Image source={{ uri: imagen }} style={styles.cardImage} />
      <View style={styles.cardContainer}>
        <View style={styles.cardEnds}>
          <Text style={styles.cardTitle}>{nombre}</Text>
          <Pressable onPress={() => removeProductFromCart(_id)} hitSlop={10}>
            <MaterialCommunityIcons name="trash-can-outline" size={20} color="gray" />
          </Pressable>
        </View>
        <View style={styles.badgesContainer}>
          <Text style={[styles.badge, styles.categoryBadge]}>Productos artesanales</Text>
          <Text style={[styles.badge, styles.aromaBadge]}>{capitalizeWord(aroma)}</Text>
          <Text style={[styles.badge, styles.typeBadge]}>{capitalizeWord(tipo)}</Text>
        </View>
        <Text style={styles.benefitsText}>{beneficios.join(', ')}</Text>

        <View style={styles.cardEnds}>
          <Text style={styles.cardIntPrice}>
            ${int}
            <Text style={styles.cardDecimalPrice}>
              .{decimal}
              <Text style={styles.cardPriceWithoutDiscount}>
                {'  $' + priceWithoutDiscount.toFixed(2)}
              </Text>
            </Text>
          </Text>
          <View style={styles.quantityContainer}>
            <Pressable
              onPress={() => {
                setQuantity(prev => prev + 1);
                modifyProductQuantity(producto, 1);
              }}
            >
              <MaterialCommunityIcons name="plus" size={16} color="gray" />
            </Pressable>
            <Text style={styles.quantityText}>{quantity}</Text>
            <Pressable
              onPress={() => {
                if (quantity > 1) {
                  modifyProductQuantity(producto, -1);
                  setQuantity(prev => prev - 1);
                }
              }}
            >
              <MaterialCommunityIcons name="minus" size={16} color="gray" />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  cartItemCard: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 10,
    columnGap: 10,
  },
  cardImage: {
    borderColor: GRAY_COLOR_LIGHT,
    borderRadius: 10,
    borderWidth: 2,
    aspectRatio: 1,
    width: 100,
    height: 100,
  },
  cardContainer: {
    alignItems: 'flex-start',
    flex: 1,
    rowGap: 3,
  },
  cardEnds: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: GRAY_COLOR_DARK,
  },
  cardIntPrice: {
    color: PRIMARY_COLOR_DARK,
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardDecimalPrice: {
    fontSize: 10,
  },

  cardPriceWithoutDiscount: {
    color: GRAY_COLOR,
    fontWeight: 'normal',
    textDecorationLine: 'line-through',
  },

  badgesContainer: { flexDirection: 'row', columnGap: 2 },
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

  benefitsText: { color: GRAY_COLOR, fontFamily: BOLD_BODY_FONT, fontSize: 12 },

  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: GRAY_COLOR_LIGHT,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    padding: 2,
  },
  quantityText: {
    color: GRAY_COLOR_DARK,
    paddingHorizontal: 10,
  },
});
