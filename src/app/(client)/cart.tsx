import { Button } from '@/components/Button';
import { CartItemCard } from '@/components/cards/CartItemCard';
import {
  GRAY_COLOR,
  GRAY_COLOR_DARK,
  GRAY_COLOR_LIGHT,
  PRIMARY_COLOR,
  SECONDARY_COLOR,
  TERTIARY_COLOR,
  TERTIARY_COLOR_DARK,
} from '@/constants/Colors';
import { BODY_FONT, BOLD_BODY_FONT } from '@/constants/Fonts';
import { useCartStore } from '@/store/useCartStore';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { CardField, StripeProvider, useStripe } from '@stripe/stripe-react-native';
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const EXPO_PUBLIC_STRIPE_API_KEY = process.env.EXPO_PUBLIC_STRIPE_API_KEY ?? '';

export default function CartScreen() {
  const { createPaymentMethod } = useStripe();
  const { top } = useSafeAreaInsets();
  const { products, totalProducts, getClientCart, checkout, totalPrice } = useCartStore();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState(null);

  const handlePayment = async () => {
    if (cardDetails) {
      const { error, paymentMethod } = await createPaymentMethod({
        paymentMethodType: 'Card',
        paymentMethodData: cardDetails,
      });

      if (error) {
        console.error('Payment method creation failed:', error);
      }

      const message = await checkout(paymentMethod?.id ?? '');
      Alert.alert('Mensaje del sistema', message);
    }
  };

  useEffect(() => {
    setLoading(true);
    getClientCart();
    setLoading(false);
  }, [refreshing]);

  return (
    <StripeProvider publishableKey={EXPO_PUBLIC_STRIPE_API_KEY}>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <View style={[styles.header, { paddingTop: top + 10 }]}>
          <Pressable style={styles.todoButton}>
            <MaterialCommunityIcons name="circle-outline" size={20} color={GRAY_COLOR_DARK} />
            <Text style={styles.todoText}>Todo</Text>
          </Pressable>
          <View style={styles.cartInfo}>
            <MaterialCommunityIcons name="cart-variant" size={18} />
            <View>
              <Text style={styles.cartText}>Mi carrito ({totalProducts})</Text>
              <Text style={styles.cartInfoText}>Envíos a todo Ecuador</Text>
            </View>
          </View>
          <Pressable style={styles.buyButton}>
            <Text style={styles.buyText}>Comprar</Text>
            <MaterialCommunityIcons name="chevron-right" size={18} />
          </Pressable>
        </View>

        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={async () => setRefreshing(!refreshing)}
              colors={[PRIMARY_COLOR, SECONDARY_COLOR, TERTIARY_COLOR]}
            />
          }
          data={products}
          contentContainerStyle={styles.flatListContent}
          keyExtractor={({ _id }: any) => _id}
          renderItem={({ item }: any) => <CartItemCard data={item} />}
        />

        {/* <PlatformPayButton
          style={{ height: 50 }}
          onPress={() => {}}
        /> */}

        <Text style={{ alignSelf: 'center', paddingBottom: 10, color: GRAY_COLOR }}>
          Ingresa los datos de tu tarjeta para continuar con el pago
        </Text>

        <CardField
          postalCodeEnabled={false}
          style={{ height: 50 }}
          onCardChange={(details: any) => setCardDetails(details)}
          cardStyle={{
            fontFamily: BOLD_BODY_FONT,
          }}
        />

        {totalProducts > 0 && (
          <View style={styles.footerContainer}>
            <View>
              <Text style={styles.priceText}>${totalPrice?.toFixed(2)}</Text>
              <Text style={{ fontSize: 12, color: GRAY_COLOR }}>
                Total de productos: {totalProducts} producto(s)
              </Text>
            </View>
            <Button
              label="Hacer pedido"
              icon="tag"
              onPress={handlePayment}
              buttonStyle={{
                paddingVertical: 10,
                paddingHorizontal: 15,
              }}
            />
          </View>
        )}
      </KeyboardAvoidingView>
    </StripeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: GRAY_COLOR_LIGHT,
  },
  todoButton: {
    flexDirection: 'row',
    columnGap: 5,
    alignItems: 'center',
  },
  todoText: {
    fontFamily: BODY_FONT,
    color: GRAY_COLOR_DARK,
  },
  cartInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5,
  },
  cartText: {
    fontFamily: BOLD_BODY_FONT,
    textAlign: 'center',
    fontSize: 16,
  },
  cartInfoText: { fontSize: 12, color: GRAY_COLOR, textAlign: 'center' },

  buyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 2,
  },
  buyText: {
    fontWeight: 'bold',
  },
  flatListContent: {
    padding: 10,
    rowGap: 10,
  },

  footerContainer: {
    backgroundColor: 'white',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderColor: GRAY_COLOR_LIGHT,
  },
  priceText: {
    fontFamily: BOLD_BODY_FONT,
    fontSize: 18,
    color: TERTIARY_COLOR_DARK,
  },
});
