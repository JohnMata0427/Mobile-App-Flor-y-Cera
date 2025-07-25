import { ClientProductCard } from '@/components/cards/ClientProductCard';
import { ClientSearchBar } from '@/components/ClientSearchBar';
import {
  GRAY_COLOR_DARK,
  PRIMARY_COLOR_DARK,
  REFRESH_COLORS,
  SECONDARY_COLOR,
  SECONDARY_COLOR_DARK,
  TERTIARY_COLOR_LIGHT,
} from '@/constants/Colors';
import { ProductsContext, ProductsProvider } from '@/contexts/ProductsContext';
import { PromotionsContext, PromotionsProvider } from '@/contexts/PromotionsContext';
import { globalStyles } from '@/globalStyles';
import { useCartStore } from '@/store/useCartStore';
import { useNotificationsStore } from '@/store/useNotificationsStore';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { BlurView } from 'expo-blur';
import { Link, router } from 'expo-router';
import { memo, use, useEffect } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';

const { width } = Dimensions.get('window');

const Home = memo(() => {
  const { searchedProducts, refreshing, setRefreshing, getProducts } = use(ProductsContext);
  const { promotions, getPromotions } = use(PromotionsContext);
  const progress = useSharedValue<number>(0);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      stickyHeaderIndices={[0]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true);
            await getProducts();
            await getPromotions();
          }}
          colors={REFRESH_COLORS}
        />
      }
    >
      <Pressable
        style={styles.searchBarContainer}
        onPress={() => router.push('/(client)/(catalog)/search')}
      >
        <BlurView intensity={20} experimentalBlurMethod="dimezisBlurView" style={styles.blurView}>
          <ClientSearchBar />
        </BlurView>
      </Pressable>

      <Carousel
        width={width}
        height={250}
        data={promotions}
        onProgressChange={progress}
        autoPlay
        autoPlayInterval={5000}
        renderItem={({ item: { imagen } }) => (
          <Image source={{ uri: imagen }} style={styles.promotionImage} resizeMode="contain" />
        )}
      />

      <View style={styles.headerList}>
        <MaterialCommunityIcons name="gift-open" size={18} color={GRAY_COLOR_DARK} />
        <Text style={styles.title}>Beneficios</Text>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        legacyImplementation={false}
        data={benefitCards}
        contentContainerStyle={styles.benefitsContainer}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item: { name, title, description } }) => (
          <View style={styles.benefitCard}>
            <MaterialCommunityIcons
              name={name as keyof typeof MaterialCommunityIcons.glyphMap}
              size={32}
              color="white"
            />
            <Text style={[globalStyles.labelText, styles.benefitCardTitle]}>{title}</Text>
            <Text style={[globalStyles.bodyText, styles.benefitCardDescription]}>
              {description}
            </Text>
          </View>
        )}
      />

      <View style={styles.headerRow}>
        <View style={styles.headerList}>
          <MaterialCommunityIcons name="star-plus" size={18} color={GRAY_COLOR_DARK} />
          <Text style={styles.title}>Nuevos productos</Text>
        </View>
        <Link style={styles.headerList} href="/(client)/catalog">
          <Text style={globalStyles.link}>Ver más </Text>
          <MaterialCommunityIcons name="arrow-right-bold" size={16} color={SECONDARY_COLOR_DARK} />
        </Link>
      </View>

      <FlatList
        data={searchedProducts.slice(0, 4)}
        keyExtractor={({ _id }) => _id}
        showsHorizontalScrollIndicator={false}
        legacyImplementation={false}
        contentContainerStyle={styles.benefitsContainer}
        horizontal
        renderItem={({ item }) => <ClientProductCard data={item} />}
      />

      <View style={styles.faqSection}>
        <Pressable onPress={() => router.replace('/(client)/(personalization)')}>
          <Image source={require('@/assets/ia-banner.png')} style={styles.bannerIA} />
        </Pressable>
        <View>
          <View style={styles.headerList}>
            <MaterialCommunityIcons name="cloud-question" size={18} color={GRAY_COLOR_DARK} />
            <Text style={styles.title}>Preguntas Frecuentes</Text>
          </View>
        </View>

        <View style={styles.faqContent}>
          <Image
            source={require('@/assets/faq-banner.png')}
            style={styles.faqBanner}
            resizeMode="cover"
          />

          <View style={[styles.faqItem, styles.faqItemTertiary]}>
            <Text style={[globalStyles.labelText, styles.faqTitle]}>
              🧠 ¿Como funciona la personalización de productos con IA?
            </Text>
            <Text style={globalStyles.bodyText}>
              La personalización con Inteligencia Artificial (IA) se basa en tus preferencias y
              comportamientos de compra. Cuanto más interactúas con nuestros productos, mejor se
              adapta la IA a tus gustos para sugerirte ingredientes y aromas.
            </Text>
          </View>

          <View style={[styles.faqItem, styles.faqItemSecondary]}>
            <Text style={[globalStyles.labelText, styles.faqTitle]}>
              🛍️ ¿Cómo puedo personalizar un producto?
            </Text>
            <Text style={globalStyles.bodyText}>
              Para personalizar un producto, simplemente selecciona los ingredientes y aromas que
              más te gusten. La IA te ayudará a encontrar la combinación perfecta para ti.
            </Text>
          </View>

          <View style={[styles.faqItem, styles.faqItemTertiary]}>
            <Text style={[globalStyles.labelText, styles.faqTitle]}>
              🌱 ¿Qué beneficios tiene la personalización de productos?
            </Text>
            <Text style={globalStyles.bodyText}>
              La personalización te permite disfrutar de productos únicos y adaptados a tus
              preferencias. Además, contribuyes al cuidado del medio ambiente al reducir el uso de
              plástico.
            </Text>
          </View>

          <View style={[styles.faqItem, styles.faqItemSecondary]}>
            <Text style={[globalStyles.labelText, styles.faqTitle]}>
              💳 ¿Qué métodos de pago son aceptados?
            </Text>
            <Text style={globalStyles.bodyText}>
              Por el momento, solo estamos aceptando pagos con tarjeta de crédito y débito. Pronto
              habilitaremos otras opciones de pago.
            </Text>
          </View>

          <View style={[styles.faqItem, styles.faqItemTertiary]}>
            <Text style={[globalStyles.labelText, styles.faqTitle]}>📩 Soporte al cliente</Text>
            <Text style={globalStyles.bodyText}>
              El equipo de atención al cliente está disponible de lunes a sábado a través de
              múltiples canales WhatsApp e Instagram para resolver cualquier consulta.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
});

export default function HomeScreen() {
  return (
    <PromotionsProvider>
      <ProductsProvider>
        <Home />
      </ProductsProvider>
    </PromotionsProvider>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    rowGap: 10,
    flexGrow: 1,
  },
  promotionImage: {
    width: '100%',
    aspectRatio: 16 / 11,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: GRAY_COLOR_DARK,
  },
  searchBarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  blurView: {
    paddingHorizontal: 10,
    paddingTop: 41,
    paddingBottom: 10,
  },
  headerList: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    columnGap: 5,
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    color: 'white',
  },
  benefitCardDescription: {
    fontSize: 12,
    textAlign: 'center',
    color: 'white',
  },
  faqSection: {
    backgroundColor: '#FFE3E3',
    rowGap: 10,
  },
  bannerIA: {
    width: '100%',
    height: 250,
  },
  faqContent: {
    rowGap: 15,
    paddingBottom: 20,
  },
  faqBanner: {
    width: '90%',
    height: 120,
    borderRadius: 10,
    alignSelf: 'center',
  },
  faqItem: {
    marginLeft: 15,
    marginRight: 20,
    rowGap: 4,
    borderLeftWidth: 3,
    paddingLeft: 10,
  },
  faqItemTertiary: {
    borderColor: TERTIARY_COLOR_LIGHT,
  },
  faqItemSecondary: {
    borderColor: SECONDARY_COLOR,
  },
  faqTitle: {
    color: PRIMARY_COLOR_DARK,
  },
});

const benefitCards = [
  {
    name: 'leaf',
    title: 'Ingredientes naturales',
    description: 'Utilizamos ingredientes de origen natural y de la más alta calidad.',
  },
  {
    name: 'diamond-stone',
    title: 'Producción artesanal',
    description: 'Cuidamos cada detalle en la producción de nuestros productos.',
  },
  {
    name: 'flower',
    title: 'Personalización',
    description: 'Crea tu propio producto con ingredientes y aromas a tu gusto.',
  },
  {
    name: 'earth',
    title: 'Beneficios ecológicos',
    description: 'Contribuimos al cuidado del planeta reduciendo el uso de plástico.',
  },
];
