import { Button } from '@/components/Button';
import { ClientHeader } from '@/components/ClientHeader';
import {
  GRAY_COLOR_DARK,
  GRAY_COLOR_LIGHT,
  PRIMARY_COLOR_DARK,
  SECONDARY_COLOR_DARK,
  TERTIARY_COLOR_DARK,
} from '@/constants/Colors';
import { BODY_FONT, BOLD_BODY_FONT } from '@/constants/Fonts';
import { ProductsContext, ProductsProvider } from '@/contexts/ProductsContext';
import type { IDCategoria } from '@/interfaces/Product';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Link } from 'expo-router';
import { use } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

function Home() {
  const { products } = use(ProductsContext);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ rowGap: 10, flexGrow: 1 }}
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={() => {}}
          colors={[
            PRIMARY_COLOR_DARK,
            SECONDARY_COLOR_DARK,
            TERTIARY_COLOR_DARK,
          ]}
        />
      }
    >
      <ClientHeader />

      <View style={styles.headerList}>
        <MaterialCommunityIcons
          name="gift-open"
          size={18}
          color={GRAY_COLOR_DARK}
        />
        <Text style={styles.headerListText}>Beneficios</Text>
      </View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        legacyImplementation={false}
        data={cards}
        contentContainerStyle={{
          paddingHorizontal: 15,
          columnGap: 10,
        }}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item: { name, title, description } }) => (
          <View style={styles.benefitCard}>
            <MaterialCommunityIcons
              name={name as keyof typeof MaterialCommunityIcons.glyphMap}
              size={32}
              color="white"
            />
            <Text style={styles.benefitCardTitle}>{title}</Text>
            <Text style={styles.benefitCardDescription}>{description}</Text>
          </View>
        )}
      />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View style={styles.headerList}>
          <MaterialCommunityIcons
            name="star-plus"
            size={18}
            color={GRAY_COLOR_DARK}
          />
          <Text style={styles.headerListText}>Nuevos productos</Text>
        </View>
        <Link style={styles.headerList} href="/(client)/catalog">
          <Text
            style={{
              color: GRAY_COLOR_DARK,
              fontSize: 12,
            }}
          >
            Ver más
          </Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={18}
            color={GRAY_COLOR_DARK}
          />
        </Link>
      </View>
      <FlatList
        data={products}
        contentContainerStyle={styles.benefitsContainer}
        horizontal
        showsHorizontalScrollIndicator={false}
        legacyImplementation={false}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({
          item: { imagen, nombre, precio, aroma, id_categoria },
        }) => {
          return (
            <View style={styles.productCard}>
              <Image
                source={{ uri: imagen }}
                resizeMode="cover"
                style={styles.productImage}
              />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{nombre}</Text>
                <View style={styles.badgesContainer}>
                  <Text style={[styles.badge, styles.categoryBadge]}>
                    {(id_categoria as IDCategoria)?.nombre?.split(' ')[0] ??
                      'Ninguna'}
                  </Text>
                  <Text style={[styles.badge, styles.aromaBadge]}>{aroma}</Text>
                </View>
                <Text style={styles.priceText}>
                  ${parseFloat(precio).toFixed(2)} USD
                </Text>
              </View>
              <Button
                label="¡Lo quiero!"
                icon="cart-plus"
                onPress={() => {}}
                paddingVertical={5}
              />
            </View>
          );
        }}
      />

      <Image
        source={require('@/assets/ia-banner.png')}
        style={styles.bannerIA}
      />
    </ScrollView>
  );
}

export default function HomeScreen() {
  return (
    <ProductsProvider>
      <Home />
    </ProductsProvider>
  );
}

const styles = StyleSheet.create({
  headerList: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    columnGap: 5,
    alignItems: 'center',
  },
  headerListText: {
    fontWeight: 'bold',
    color: GRAY_COLOR_DARK,
    fontSize: 18,
  },
  benefitsContainer: {
    paddingHorizontal: 15,
    columnGap: 10,
  },
  benefitCard: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    rowGap: 5,
    backgroundColor: GRAY_COLOR_DARK,
  },
  benefitCardTitle: {
    fontFamily: BOLD_BODY_FONT,
    color: 'white',
  },
  benefitCardDescription: {
    fontFamily: BODY_FONT,
    fontSize: 12,
    textAlign: 'center',
    color: 'white',
  },

  productCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: 140,
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
  },
  badgesContainer: {
    flexDirection: 'row',
    columnGap: 5,
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
  priceText: {
    color: PRIMARY_COLOR_DARK,
    fontWeight: 'bold',
  },
  
  bannerIA: {
    width: '100%',
    height: 250,
  },
});

const cards = [
  {
    name: 'leaf',
    title: 'Ingredientes naturales',
    description:
      'Utilizamos ingredientes de origen natural y de la más alta calidad.',
  },
  {
    name: 'diamond-stone',
    title: 'Producción artesanal',
    description:
      'Cuidamos cada detalle en la producción de nuestros productos.',
  },
  {
    name: 'flower',
    title: 'Personalización',
    description:
      'Crea tu propio producto con ingredientes y aromas a tu gusto.',
  },
  {
    name: 'earth',
    title: 'Beneficios ecológicos',
    description:
      'Contribuimos al cuidado del planeta reduciendo el uso de plástico.',
  },
];
