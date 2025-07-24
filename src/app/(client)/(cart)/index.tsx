import { Button } from '@/components/Button';
import { CartItemCard } from '@/components/cards/CartItemCard';
import { GRAY_COLOR_LIGHT, REFRESH_COLORS, TERTIARY_COLOR, TERTIARY_COLOR_DARK } from '@/constants/Colors';
import { CategoriesProvider } from '@/contexts/CategoryContext';
import { globalStyles } from '@/globalStyles';
import { useCartStore } from '@/store/useCartStore';
import { showConfirmationAlert } from '@/utils/showAlert';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CartScreen() {
  const { top } = useSafeAreaInsets();
  const { products, totalProducts, getClientCart, totalPrice, clearCart } = useCartStore();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const showDeleteAlert = useCallback(() => {
    showConfirmationAlert({
      message: '¿Está seguro/a de eliminar todos los productos de su carrito?',
      onConfirm: clearCart,
      confirmButtonText: 'Eliminar',
    });
  }, [clearCart]);

  useEffect(() => {
    setLoading(true);
    getClientCart();
    setLoading(false);
  }, [refreshing]);

  return (
    <CategoriesProvider>
      <View style={[styles.header, { paddingTop: top + 10 }]}>
        <Button
          label="Vaciar"
          icon="trash-can-outline"
          onPress={showDeleteAlert}
          buttonStyle={styles.emptyButton}
          textStyle={styles.emptyText}
        />
        <View style={styles.cartInfo}>
          <MaterialCommunityIcons name="cart-variant" size={18} />
          <View>
            <Text style={[globalStyles.labelText, { textAlign: 'center' }]}>Mi carrito ({totalProducts})</Text>
            <Text style={globalStyles.subtitle}>Envíos a todo Ecuador</Text>
          </View>
        </View>
        <Pressable
          style={styles.buyButton}
          onPress={async () => {
            if (totalProducts === 0) return;
            router.push('/(client)/(cart)/checkout');
          }}
        >
          <Text style={globalStyles.labelText}>Comprar</Text>
          <MaterialCommunityIcons name="chevron-right" size={18} />
        </Pressable>
      </View>

      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={async () => setRefreshing(!refreshing)}
            colors={REFRESH_COLORS}
          />
        }
        data={products}
        contentContainerStyle={styles.flatListContent}
        keyExtractor={({ _id }: any) => _id}
        renderItem={({ item }: any) => <CartItemCard data={item} />}
      />

      {totalProducts > 0 && (
        <View style={styles.footerContainer}>
          <View>
            <Text style={styles.priceText}>Total (IVA incluido): ${totalPrice?.toFixed(2)}</Text>
            <Text style={globalStyles.subtitle}>
              Total de productos: {totalProducts} producto(s)
            </Text>
          </View>
          <Button
            label="Hacer pedido"
            icon="tag"
            onPress={() => router.push('/(client)/(cart)/checkout')}
            buttonStyle={styles.orderButton}
            textStyle={styles.orderText}
          />
        </View>
      )}
    </CategoriesProvider>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: GRAY_COLOR_LIGHT,
  },
  emptyButton: {
    backgroundColor: TERTIARY_COLOR,
    borderColor: TERTIARY_COLOR_DARK,
    paddingVertical: 5,
  },
  emptyText: {
    fontSize: 12,
  },
  cartInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5,
  },
  buyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 2,
  },
  flatListContent: {
    padding: 10,
    rowGap: 10,
  },
  orderButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  orderText: {
    fontSize: 12,
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
    fontSize: 16,
    fontWeight: 'bold',
    color: TERTIARY_COLOR_DARK,
  },
});
