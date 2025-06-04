import { CartItemCard } from '@/components/cards/CartItemCard';
import { GRAY_COLOR_DARK } from '@/constants/Colors';
import { BODY_FONT, BOLD_BODY_FONT } from '@/constants/Fonts';
import { useCartStore } from '@/store/useCartStore';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useEffect } from 'react';
import { FlatList, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CartScreen() {
  const { top } = useSafeAreaInsets();
  const { products, getClientCart } = useCartStore();

  useEffect(() => {
    getClientCart();
  }, []);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View
        style={{
          paddingTop: top + 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'white',
          padding: 10,
        }}
      >
        <Pressable
          style={{
            flexDirection: 'row',
            columnGap: 5,
            alignItems: 'center',
          }}
          onPress={() => {}}
        >
          <MaterialCommunityIcons
            name="circle-outline"
            size={20}
            color={GRAY_COLOR_DARK}
          />
          <Text
            style={{
              fontFamily: BODY_FONT,
              color: GRAY_COLOR_DARK,
            }}
          >
            Todo
          </Text>
        </Pressable>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', columnGap: 5 }}
        >
          <MaterialCommunityIcons name="cart-variant" size={18} />
          <Text style={{ fontFamily: BOLD_BODY_FONT, fontSize: 16 }}>
            Mi carrito ({products.length})
          </Text>
        </View>
        <Pressable
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: 2,
          }}
          onPress={() => {}}
        >
          <Text style={{ fontWeight: 'bold' }}>Comprar</Text>
          <MaterialCommunityIcons name="chevron-right" size={18} />
        </Pressable>
      </View>
      <FlatList
        data={products}
        scrollEnabled={false}
        contentContainerStyle={{ padding: 10, rowGap: 10 }}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => <CartItemCard data={item} />}
      />
    </ScrollView>
  );
}
