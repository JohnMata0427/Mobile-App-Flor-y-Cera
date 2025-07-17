import { Button } from '@/components/Button';
import { ClientProductCard } from '@/components/cards/ClientProductCard';
import { Loading } from '@/components/Loading';
import { CartMessageModal } from '@/components/modals/CartMessageModal';
import {
  GRAY_COLOR_DARK,
  PRIMARY_COLOR_DARK,
  PRIMARY_COLOR_EXTRA_LIGHT,
  SECONDARY_COLOR_DARK,
  TERTIARY_COLOR_DARK,
} from '@/constants/Colors';
import { BODY_FONT } from '@/constants/Fonts';
import { ProductsContext, ProductsProvider } from '@/contexts/ProductsContext';
import { globalStyles } from '@/globalStyles';
import type { Product } from '@/interfaces/Product';
import { getProductByIdRequest } from '@/services/ProductService';
import { useCartStore } from '@/store/useCartStore';
import { capitalizeWord } from '@/utils/textTransform';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router, useLocalSearchParams } from 'expo-router';
import { memo, use, useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export const ProductDetails = memo(() => {
  const { product_id } = useLocalSearchParams<{ product_id: string }>();
  const { addProductToCart } = useCartStore();
  const { searchedProducts, refreshing, setRefreshing, getProducts } = use(ProductsContext);
  const [loading, setLoading] = useState<boolean>(true);
  const [product, setProduct] = useState<Product>({} as Product);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { producto } = await getProductByIdRequest(product_id);
        setProduct(producto);
      } catch {
      } finally {
        setLoading(false);
      }
    })();
  }, [product_id]);

  useEffect(() => {
    if (searchedProducts.length > 0) {
      const without = searchedProducts.filter((p) => p._id !== product_id);
      const related = without.sort(() => 0.5 - Math.random()).slice(0, 4);
      setRelatedProducts(related);
    }
  }, [searchedProducts]);

  const handleAddToCart = () => {
    addProductToCart(product, 1, 'normal');
    setIsModalVisible(true);
    const timeout = setTimeout(() => {
      setIsModalVisible(false);
    }, 1500);

    return () => clearTimeout(timeout);
  };

  if (loading) return <Loading />;

  return (
    <>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await getProducts();
            }}
            colors={[PRIMARY_COLOR_DARK, SECONDARY_COLOR_DARK, TERTIARY_COLOR_DARK]}
          />
        }
      >
        <Image source={{ uri: product?.imagen }} style={styles.productImage} resizeMode="cover" />

        <Pressable style={styles.backButton} onPress={() => router.push('/(client)/(catalog)')}>
          <MaterialCommunityIcons name="arrow-left" size={20} color={GRAY_COLOR_DARK} />
        </Pressable>

        <View style={styles.productInfo}>
          <Text style={[globalStyles.title, { textAlign: 'left' }]}>{product?.nombre}</Text>

          <View style={styles.badgesContainer}>
            <Text style={[styles.badge, styles.categoryBadge]}>
              {product?.id_categoria?.nombre}
            </Text>
            <Text style={[styles.badge, styles.aromaBadge]}>
              {capitalizeWord(product?.aroma ?? '')}
            </Text>
            <Text style={[styles.badge, styles.typeBadge]}>
              {capitalizeWord(product?.tipo ?? '')}
            </Text>
          </View>

          <Text style={globalStyles.bodyText}>{product?.descripcion}</Text>

          <View style={styles.benefitsSection}>
            <Text style={globalStyles.labelText}>Beneficios del producto</Text>
            {product?.beneficios.map((benefit, index) => (
              <Text key={index}>
                ✅ <Text style={globalStyles.bodyText}>{capitalizeWord(benefit)}</Text>
              </Text>
            ))}
          </View>

          <Text style={styles.priceText}>$ {product?.precio.toFixed(2)}</Text>

          <Button label="Añadir al carrito" icon="cart-plus" onPress={handleAddToCart} />
        </View>

        <FlatList
          data={relatedProducts}
          keyExtractor={({ _id }) => _id}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.flatListContainer}
          legacyImplementation={false}
          numColumns={2}
          renderItem={({ item }) => <ClientProductCard data={item} width="48%" />}
        />
      </ScrollView>
      <CartMessageModal message="¡Producto añadido al carrito!" visible={isModalVisible} />
    </>
  );
});

export default function ProductDetailsScreen() {
  return (
    <ProductsProvider>
      <ProductDetails />
    </ProductsProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    rowGap: 10,
    backgroundColor: PRIMARY_COLOR_EXTRA_LIGHT,
    paddingBottom: 40,
  },
  productImage: {
    width: '100%',
    height: 300,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  backButton: {
    position: 'absolute',
    top: 45,
    left: 15,
    padding: 10,
    zIndex: 1,
    backgroundColor: 'white',
    borderRadius: 50,
    shadowColor: '#000',
    elevation: 2,
  },
  productInfo: {
    paddingTop: 10,
    paddingHorizontal: 20,
    rowGap: 8,
  },
  benefitsSection: {
    rowGap: 4,
  },
  priceText: {
    color: PRIMARY_COLOR_DARK,
    fontSize: 28,
    fontWeight: 'bold',
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  badge: {
    fontFamily: BODY_FONT,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 5,
    color: 'white',
  },
  categoryBadge: {
    backgroundColor: GRAY_COLOR_DARK,
  },
  aromaBadge: {
    backgroundColor: TERTIARY_COLOR_DARK,
  },
  typeBadge: {
    backgroundColor: PRIMARY_COLOR_DARK,
  },

  columnWrapper: {
    justifyContent: 'center',
    columnGap: 10,
  },
  flatListContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    rowGap: 10,
  },
});
