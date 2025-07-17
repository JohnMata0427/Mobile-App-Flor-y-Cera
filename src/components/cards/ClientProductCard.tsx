import { Button } from '@/components/Button';
import {
  GRAY_COLOR,
  GRAY_COLOR_DARK,
  GRAY_COLOR_LIGHT,
  PRIMARY_COLOR,
  PRIMARY_COLOR_DARK,
  TERTIARY_COLOR_DARK,
} from '@/constants/Colors';
import { BOLD_BODY_FONT } from '@/constants/Fonts';
import type { Product } from '@/interfaces/Product';
import { useCartStore } from '@/store/useCartStore';
import { capitalizeWord } from '@/utils/textTransform';
import { router } from 'expo-router';
import { memo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View, type DimensionValue } from 'react-native';
import { CartMessageModal } from '../modals/CartMessageModal';

interface ClientProductCardProps {
  data: Product;
  width?: DimensionValue;
}

export const ClientProductCard = memo(({ data, width = 170 }: ClientProductCardProps) => {
  const { addProductToCart } = useCartStore();

  const { imagen, nombre, precio, aroma, tipo, id_categoria, descripcion } = data;
  const [int, decimal] = precio.toFixed(2).split('.');
  const [modalVisible, setModalVisible] = useState<boolean>(false)

  const handleAddToCart = () => {
    addProductToCart(data, 1, 'normal');
    setModalVisible(true);
    const timeout = setTimeout(() => {
      setModalVisible(false)
    }, 1500)

    return () => clearTimeout(timeout);
  };

  return (
    <View style={[styles.productCard, { width }]}>
      <Pressable
        onPress={() => {
          router.push({
            pathname: '/(client)/(catalog)/[product_id]',
            params: { product_id: data._id },
          });
        }}
      >
        <Image source={{ uri: imagen }} resizeMode="cover" style={styles.productImage} />
      </Pressable>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1} ellipsizeMode="tail">
          {nombre}
        </Text>
        <View style={styles.badgesContainer}>
          <Text style={[styles.badge, styles.categoryBadge]}>{id_categoria?.nombre}</Text>
          <Text style={[styles.badge, styles.aromaBadge]}>{capitalizeWord(aroma)}</Text>
          <Text style={[styles.badge, styles.typeBadge]}>{capitalizeWord(tipo)}</Text>
        </View>

        <Text style={styles.descriptionText} numberOfLines={1} ellipsizeMode="tail">
          {descripcion}
        </Text>

        <View style={styles.footerContainer}>
          <Text style={styles.priceText}>
            $ {int}.<Text style={styles.decimalText}>{decimal}</Text>
          </Text>
          <View style={styles.actionRow}>
            <Button
              label="¡Lo quiero!"
              icon="cart-plus"
              onPress={handleAddToCart}
              buttonStyle={styles.button}
              textStyle={styles.buttonText}
            />
            {/* <MaterialCommunityIcons name="heart-outline" size={20} color={GRAY_COLOR_DARK} /> */}
          </View>
        </View>
      </View>

      <CartMessageModal message="¡Producto añadido al carrito!" visible={modalVisible} />
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
    elevation: 4,
    shadowColor: PRIMARY_COLOR,
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
    gap: 3,
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  descriptionText: {
    fontSize: 12,
    color: GRAY_COLOR,
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceText: {
    color: PRIMARY_COLOR_DARK,
    fontWeight: 'bold',
    fontSize: 16,
  },
  decimalText: {
    fontSize: 10,
  },
  actionRow: {
    flexDirection: 'row',
    columnGap: 5,
    alignItems: 'center',
  },
  button: {
    paddingVertical: 5,
  },
  buttonText: {
    fontSize: 12,
  },
});
