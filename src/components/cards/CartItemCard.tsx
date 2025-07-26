import {
  GRAY_COLOR,
  GRAY_COLOR_DARK,
  GRAY_COLOR_LIGHT,
  PRIMARY_COLOR_DARK,
  PRIMARY_COLOR_LIGHT,
  TERTIARY_COLOR_DARK,
} from '@/constants/Colors';
import { CategoriesContext } from '@/contexts/CategoryContext';
import type { CartItem } from '@/interfaces/Cart';
import type { Ingredient } from '@/interfaces/Ingredient';
import { useCartStore } from '@/store/useCartStore';
import { capitalizeWord } from '@/utils/textTransform';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { memo, use, useEffect, useOptimistic, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

interface CartItemCardProps {
  data: CartItem;
}

export const CartItemCard = memo(({ data }: CartItemCardProps) => {
  const { removeProductFromCart, modifyProductQuantity } = useCartStore();
  const { categories } = use(CategoriesContext);

  const { producto, cantidad, tipo_producto } = data;

  const [optimisticQuantity, setOptimisticQuantity] = useOptimistic(cantidad);

  const {
    _id = '',
    imagen,
    nombre = '',
    aroma,
    tipo,
    beneficios = [],
    precio = 0,
    id_categoria = '',
    ingredientes = [],
  } = (producto as any) || {};

  const [int, decimal] = precio.toFixed(2).split('.');

  const [esencias, setEsencias] = useState<string[]>([]);
  const [molde, setMolde] = useState<string>('');
  const [color, setColor] = useState<string>('');

  useEffect(() => {
    setEsencias([]);

    ingredientes.forEach(({ nombre, tipo }: Ingredient) => {
      if (tipo === 'esencia') {
        setEsencias(prev => [...prev, nombre]);
      } else if (tipo === 'molde') {
        setMolde(nombre);
      } else if (tipo === 'color') {
        setColor(nombre);
      }
    });
  }, [ingredientes]);

  const handleIncreaseQuantity = async () => {
    setOptimisticQuantity(currentQuantity => currentQuantity + 1);
    await modifyProductQuantity(producto, 1, tipo_producto);
  };

  const handleDecreaseQuantity = async () => {
    if (optimisticQuantity <= 1) return;
    setOptimisticQuantity(currentQuantity => currentQuantity - 1);
    await modifyProductQuantity(producto, -1, tipo_producto);
  };

  return (
    <View style={styles.cartItemCard}>
      <Pressable
        onPress={() =>
          tipo_producto === 'normal'
            ? router.push({
                pathname: '/(client)/(catalog)/[product_id]',
                params: { product_id: _id },
              })
            : router.push({
                pathname: '/(client)/(personalization)/[category]',
                params: { category: id_categoria, personalizedProductId: _id },
              })
        }
      >
        <Image source={{ uri: imagen }} style={styles.cardImage} />
      </Pressable>
      <View style={styles.cardContainer}>
        <View style={styles.cardEnds}>
          <Text style={styles.cardTitle}>
            {nombre
              ? nombre
              : tipo_producto === 'personalizado'
                ? 'Producto personalizado'
                : 'Recomendación de IA'}
          </Text>
          <Pressable
            onPress={() => {
              Alert.alert(
                'Mensaje del sistema',
                'Está seguro que desea eliminar este producto del carrito?',
                [
                  {
                    text: 'Cancelar',
                    style: 'cancel',
                  },
                  {
                    text: 'Eliminar',
                    onPress: () => removeProductFromCart(_id, tipo_producto),
                  },
                ],
              );
            }}
            hitSlop={10}
          >
            <MaterialCommunityIcons name="trash-can-outline" size={20} color="gray" />
          </Pressable>
        </View>
        <View style={styles.badgesContainer}>
          <Text style={[styles.badge, styles.categoryBadge]}>
            {categories.find(cat => cat?._id === id_categoria)?.nombre ?? 'Sin categoría'}
          </Text>
          <Text style={[styles.badge, styles.aromaBadge]}>{capitalizeWord(aroma)}</Text>
          {tipo ? (
            <Text style={[styles.badge, styles.typeBadge]}>{capitalizeWord(tipo)}</Text>
          ) : (
            <FlatList
              data={esencias}
              contentContainerStyle={{ columnGap: 2 }}
              renderItem={({ item }) => (
                <Text style={[styles.badge, styles.typeBadge]}>{capitalizeWord(item)}</Text>
              )}
              keyExtractor={item => item}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          )}
        </View>
        <Text style={styles.benefitsText}>
          {beneficios.join(', ') ||
            `Producto con forma ${molde} de color ${color} y aroma ${aroma} con esencias ${esencias.join(', ')}`}
        </Text>

        <View style={styles.cardEnds}>
          <Text style={styles.cardIntPrice}>
            ${int}
            <Text style={styles.cardDecimalPrice}>.{decimal}</Text>
          </Text>
          <View style={styles.quantityContainer}>
            <Pressable onPress={handleIncreaseQuantity}>
              <MaterialCommunityIcons name="plus" size={16} color="gray" />
            </Pressable>
            <Text style={styles.quantityText}>{optimisticQuantity}</Text>
            <Pressable onPress={handleDecreaseQuantity}>
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
    elevation: 4,
    shadowColor: PRIMARY_COLOR_LIGHT,
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

  badgesContainer: { flexDirection: 'row', gap: 2, flexWrap: 'wrap' },
  badge: {
    fontWeight: 'bold',
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

  benefitsText: { color: GRAY_COLOR, fontSize: 12 },

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
