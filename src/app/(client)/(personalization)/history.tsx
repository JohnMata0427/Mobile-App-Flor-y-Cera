import { Button } from '@/components/Button';
import { PersonalizedProductDetails } from '@/components/modals/PersonalizedProductDetails';
import {
  GRAY_COLOR_DARK,
  PRIMARY_COLOR,
  PRIMARY_COLOR_DARK,
  SECONDARY_COLOR,
  SECONDARY_COLOR_DARK,
  TERTIARY_COLOR,
  TERTIARY_COLOR_DARK,
} from '@/constants/Colors';
import { CategoriesContext, CategoriesProvider } from '@/contexts/CategoryContext';
import {
  PersonalizedProductsContext,
  PersonalizedProductsProvider,
} from '@/contexts/PersonalizedProductsContext';
import { globalStyles } from '@/globalStyles';
import { PersonalizedProduct } from '@/interfaces/PersonalizedProduct';
import { useCartStore } from '@/store/useCartStore';
import { capitalizeWord } from '@/utils/textTransform';
import { toLocaleDate } from '@/utils/toLocaleDate';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { memo, use, useState } from 'react';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const RenderItem = memo(
  ({
    item,
    categories,
    setSelectedPersonalizedProduct,
    setModalVisible,
    addProductToCart,
    deletePersonalizedProduct,
  }: {
    item: PersonalizedProduct;
    categories: any[];
    setSelectedPersonalizedProduct: (product: PersonalizedProduct) => void;
    setModalVisible: (visible: boolean) => void;
    addProductToCart: (product: PersonalizedProduct, quantity: number, type: string) => void;
    deletePersonalizedProduct: (id: string) => void;
  }) => {
    const { imagen, tipo_producto, aroma, updatedAt, precio, id_categoria } = item;

    const nombre_categoria = categories.find(category => category._id === id_categoria)?.nombre;

    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemHeader}>
          <Image source={{ uri: imagen }} style={styles.itemImage} />
          <View style={styles.itemInfo}>
            <Text style={globalStyles.labelText}>
              <MaterialCommunityIcons name="shimmer" size={16} color={PRIMARY_COLOR_DARK} />
              {tipo_producto === 'personalizado'
                ? ' Producto personalizado'
                : ' Recomendación de IA'}
            </Text>
            <View style={styles.badgesRow}>
              <Text style={styles.categoryBadge}>{capitalizeWord(nombre_categoria ?? '')}</Text>
              <Text style={styles.aromaBadge}>{capitalizeWord(aroma)}</Text>
            </View>
            <Text style={globalStyles.labelText}>Precio: ${precio.toFixed(2)}</Text>
            <Text style={globalStyles.bodyText}>
              Última actualización: {toLocaleDate(updatedAt)}
            </Text>
          </View>
        </View>
        <View style={styles.actionsRow}>
          <Button
            label="Ver detalles"
            icon="information-outline"
            onPress={() => {
              setSelectedPersonalizedProduct(item);
              setModalVisible(true);
            }}
            buttonStyle={styles.detailsButton}
            textStyle={styles.buttonText}
          />

          <Button
            label="Añadir al carrito"
            icon="cart-plus"
            onPress={() => {
              addProductToCart(item, 1, tipo_producto);
            }}
            buttonStyle={styles.addButton}
            textStyle={styles.buttonText}
          />

          <Button
            label="Eliminar"
            icon="trash-can-outline"
            onPress={() => {
              deletePersonalizedProduct(item._id);
            }}
            buttonStyle={styles.deleteButton}
            textStyle={styles.buttonText}
          />
        </View>
      </View>
    );
  },
);

const PersonalizationScreen = memo(() => {
  const { top } = useSafeAreaInsets();
  const {
    searchedPersonalizedProducts,
    getPersonalizedProducts,
    setRefreshing,
    refreshing,
    deletePersonalizedProduct,
  } = use(PersonalizedProductsContext);
  const { categories } = use(CategoriesContext);
  const { addProductToCart } = useCartStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPersonalizedProduct, setSelectedPersonalizedProduct] =
    useState<PersonalizedProduct>({} as PersonalizedProduct);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true);
            await getPersonalizedProducts();
          }}
          colors={[PRIMARY_COLOR_DARK, SECONDARY_COLOR_DARK, TERTIARY_COLOR_DARK]}
        />
      }
    >
      <View style={[{ paddingTop: top + 10 }, styles.header]}>
        <Pressable
          onPress={() => {
            router.replace('/(client)/(personalization)');
          }}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
        </Pressable>
        <View>
          <Text style={[globalStyles.title, styles.title]}>Historial de Personalización</Text>
          <Text style={[globalStyles.subtitle, styles.subtitle]}>
            Aquí puedes ver todos los productos personalizados que has creado y sus detalles, así
            como añadirlos al carrito o eliminarlos.
          </Text>
        </View>
      </View>

      <PersonalizedProductDetails
        product={selectedPersonalizedProduct}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />

      <FlatList
        data={searchedPersonalizedProducts}
        keyExtractor={item => item._id}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContainer}
        renderItem={({ item }) => (
          <RenderItem
            item={item}
            categories={categories}
            setSelectedPersonalizedProduct={setSelectedPersonalizedProduct}
            setModalVisible={setModalVisible}
            addProductToCart={addProductToCart as any}
            deletePersonalizedProduct={deletePersonalizedProduct}
          />
        )}
        ListEmptyComponent={() => (
          <Text style={[globalStyles.bodyText, styles.emptyText]}>
            No hay productos personalizados
          </Text>
        )}
      />
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 15,
    paddingBottom: 15,
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
  },
  title: {
    color: 'white',
  },
  subtitle: {
    color: 'white',
  },
  itemContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    rowGap: 10,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    objectFit: 'cover',
    borderWidth: 1,
    borderColor: GRAY_COLOR_DARK,
  },
  itemInfo: {
    rowGap: 2,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5,
  },
  categoryBadge: {
    color: 'white',
    fontSize: 12,
    backgroundColor: 'black',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  aromaBadge: {
    color: 'white',
    fontSize: 12,
    backgroundColor: TERTIARY_COLOR_DARK,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailsButton: {
    paddingVertical: 5,
    backgroundColor: SECONDARY_COLOR,
    borderColor: SECONDARY_COLOR_DARK,
  },
  addButton: {
    paddingVertical: 5,
  },
  deleteButton: {
    paddingVertical: 5,
    backgroundColor: TERTIARY_COLOR,
    borderColor: TERTIARY_COLOR_DARK,
  },
  buttonText: {
    fontSize: 12,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  flatListContainer: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    rowGap: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
  },
});

export default function PersonalizationHistoryScreen() {
  return (
    <CategoriesProvider>
      <PersonalizedProductsProvider>
        <PersonalizationScreen />
      </PersonalizedProductsProvider>
    </CategoriesProvider>
  );
}
