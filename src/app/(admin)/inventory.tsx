import { AdminFilter } from '@/components/AdminFilter';
import { AdminHeader } from '@/components/AdminHeader';
import { Button } from '@/components/Button';
import { Loading } from '@/components/Loading';
import { CategoryCard } from '@/components/cards/CategoryCard';
import { IngredientCard } from '@/components/cards/IngredientCard';
import { ProductCard } from '@/components/cards/ProductCard';
import { CategoryModal } from '@/components/modals/CategoryModal';
import { IngredientModal } from '@/components/modals/IngredientModal';
import { ProductModal } from '@/components/modals/ProductModal';
import {
  GRAY_COLOR,
  GRAY_COLOR_LIGHT,
  PRIMARY_COLOR,
  PRIMARY_COLOR_DARK,
  SECONDARY_COLOR,
  SECONDARY_COLOR_DARK,
  TERTIARY_COLOR,
  TERTIARY_COLOR_DARK,
} from '@/constants/Colors';
import { BODY_FONT, BOLD_BODY_FONT } from '@/constants/Fonts';
import { CategoriesContext, CategoriesProvider } from '@/contexts/CategoryContext';
import { IngredientsContext, IngredientsProvider } from '@/contexts/IngredientsContext';
import { ProductsContext, ProductsProvider } from '@/contexts/ProductsContext';
import type { Category } from '@/interfaces/Category';
import type { Ingredient, IngredientFilter } from '@/interfaces/Ingredient';
import type { Product, ProductFilter } from '@/interfaces/Product';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { memo, use, useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Action = 'Agregar' | 'Actualizar' | 'Visualizar';

interface FilterProductButton {
  label: string;
  filter: ProductFilter;
}

interface FilterIngredientButton {
  label: string;
  filter: IngredientFilter;
}

const ProductsScreen = memo(() => {
  const [action, setAction] = useState<Action>('Agregar');
  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const {
    searchedProducts,
    loading,
    refreshing,
    page,
    totalPages,
    filter,
    setRefreshing,
    setPage,
    setFilter,
    setSearch,
    getProducts,
    deleteProduct,
  } = use(ProductsContext);
  const [filterButtons, setFilterButtons] = useState<FilterProductButton[]>([]);
  const { categories } = use(CategoriesContext);

  const showDeleteAlert = useCallback(
    (productId: string, nombre: string) => {
      Alert.alert(
        'Eliminar producto',
        '¿Está seguro de que desea eliminar ' + nombre + '? Esta acción no se puede deshacer.',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Eliminar',
            style: 'destructive',
            onPress: () => deleteProduct(productId),
          },
        ],
      );
    },
    [deleteProduct],
  );

  useEffect(() => {
    if (categories.length > 0) {
      const buttons = [
        {
          label: 'Todos',
          filter: { key: 'tipo', value: '' },
        },
        {
          label: 'Piel Seca',
          filter: { key: 'tipo', value: 'piel seca' },
        },
        {
          label: 'Piel Grasa',
          filter: { key: 'tipo', value: 'piel grasa' },
        },
        {
          label: 'Piel Mixta',
          filter: { key: 'tipo', value: 'piel mixta' },
        },
        {
          label: 'Decorativa',
          filter: { key: 'tipo', value: 'decorativa' },
        },
        {
          label: 'Aromática',
          filter: { key: 'tipo', value: 'aromática' },
        },
        {
          label: 'Humidificación',
          filter: { key: 'tipo', value: 'humidificación' },
        },
      ].concat(
        categories.map(({ _id, nombre }) => ({
          label: nombre,
          filter: { key: 'id_categoria', value: _id },
        })),
      );

      setFilterButtons(buttons as FilterProductButton[]);
    }
  }, [categories]);

  return (
    <IngredientsProvider>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await getProducts();
            }}
            colors={[PRIMARY_COLOR, SECONDARY_COLOR, TERTIARY_COLOR]}
          />
        }
      >
        <View style={styles.container}>
          <AdminHeader setSearch={setSearch} placeholder="Buscar por nombre del producto...">
            <Pressable
              style={styles.addButton}
              onPress={() => {
                setAction('Agregar');
                setModalVisible(true);
                setSelectedProduct(undefined);
              }}
            >
              <MaterialCommunityIcons name="plus" size={14} color="white" />
              <Text style={styles.addButtonText}>Nuevo producto</Text>
            </Pressable>
          </AdminHeader>
          <ProductModal
            isVisible={modalVisible}
            product={selectedProduct}
            action={action}
            setIsVisible={setModalVisible}
          />

          {loading ? (
            <Loading />
          ) : (
            <FlatList
              data={searchedProducts}
              showsVerticalScrollIndicator={false}
              numColumns={2}
              columnWrapperStyle={styles.columnWrapper}
              contentContainerStyle={styles.listContent}
              keyExtractor={({ _id }) => _id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <ProductCard data={item}>
                  <View style={styles.actionRow}>
                    <Pressable
                      onPress={() => {
                        setAction('Visualizar');
                        setModalVisible(true);
                        setSelectedProduct(item);
                      }}
                      style={[styles.actionButton, styles.primaryButton]}
                    >
                      <MaterialCommunityIcons name="information-variant" size={20} color="white" />
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        setAction('Actualizar');
                        setModalVisible(true);
                        setSelectedProduct(item);
                      }}
                      style={[styles.actionButton, styles.secondaryButton]}
                    >
                      <MaterialCommunityIcons name="pencil" size={20} color="white" />
                    </Pressable>
                    <Pressable
                      onPress={() => showDeleteAlert(item._id, item.nombre)}
                      style={[styles.actionButton, styles.tertiaryButton]}
                    >
                      <MaterialCommunityIcons name="trash-can" size={20} color="white" />
                    </Pressable>
                  </View>
                </ProductCard>
              )}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <MaterialCommunityIcons name="cart-off" size={30} />
                  <Text style={styles.emptyText}>
                    No se encontraron productos, intente más tarde.
                  </Text>
                </View>
              }
              ListHeaderComponent={
                <AdminFilter
                  filterButtons={filterButtons}
                  filter={filter}
                  setFilter={setFilter as any}
                />
              }
            />
          )}
        </View>
      </ScrollView>
    </IngredientsProvider>
  );
});

const IngredientsScreen = memo(() => {
  const [action, setAction] = useState<Action>('Agregar');
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const {
    searchedIngredients,
    loading,
    refreshing,
    filter,
    setRefreshing,
    setFilter,
    setSearch,
    getIngredients,
    deleteIngredient,
  } = use(IngredientsContext);
  const [filterButtons, setFilterButtons] = useState<FilterIngredientButton[]>([]);
  const { categories } = use(CategoriesContext);

  const showDeleteAlert = useCallback(
    (ingredientId: string, nombre: string) => {
      Alert.alert(
        'Eliminar ingrediente',
        '¿Está seguro de que desea eliminar ' + nombre + '? Esta acción no se puede deshacer.',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Eliminar',
            style: 'destructive',
            onPress: () => deleteIngredient(ingredientId),
          },
        ],
      );
    },
    [deleteIngredient],
  );

  useEffect(() => {
    if (categories.length > 0) {
      const buttons = [
        {
          label: 'Todos',
          filter: { key: 'tipo', value: '' },
        },
        {
          label: 'Moldes',
          filter: { key: 'tipo', value: 'molde' },
        },
        {
          label: 'Colorantes',
          filter: { key: 'tipo', value: 'color' },
        },
        {
          label: 'Aromas',
          filter: { key: 'tipo', value: 'aroma' },
        },
        {
          label: 'Esencias',
          filter: { key: 'tipo', value: 'esencia' },
        },
      ].concat(
        categories.map(({ _id, nombre }) => ({
          label: nombre,
          filter: { key: 'id_categoria', value: _id },
        })),
      );

      setFilterButtons(buttons as FilterIngredientButton[]);
    }
  }, [categories]);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollViewContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true);
            await getIngredients();
          }}
          colors={[PRIMARY_COLOR, SECONDARY_COLOR, TERTIARY_COLOR]}
        />
      }
    >
      <View style={styles.container}>
        <AdminHeader setSearch={setSearch} placeholder="Buscar por nombre del ingrediente...">
          <Pressable
            style={styles.addButton}
            onPress={() => {
              setAction('Agregar');
              setModalVisible(true);
              setSelectedIngredient(undefined);
            }}
          >
            <MaterialCommunityIcons name="plus" size={14} color="white" />
            <Text style={styles.addButtonText}>Nuevo ingrediente</Text>
          </Pressable>
        </AdminHeader>

        <IngredientModal
          ingredient={selectedIngredient}
          action={action}
          isVisible={modalVisible}
          setIsVisible={setModalVisible}
        />

        {loading ? (
          <Loading />
        ) : (
          <FlatList
            data={searchedIngredients}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.listContent}
            keyExtractor={({ _id }) => _id}
            scrollEnabled={false}
            renderItem={({ item }) => {
              const category = item.id_categoria;
              let categoryName = '';

              if (typeof category[0] === 'string') {
                switch (category.length) {
                  case 1:
                    const cat = categories.find(cat => cat._id === category[0]);
                    categoryName = cat?.nombre ?? 'Ninguna';
                    break;
                  case 2:
                    categoryName = 'Ambas categorías';
                    break;
                  default:
                    categoryName = 'Ninguna';
                }
              }

              return (
                <IngredientCard data={item} category={categoryName}>
                  <View style={styles.actionRow}>
                    <Pressable
                      onPress={() => {
                        setAction('Visualizar');
                        setModalVisible(true);
                        setSelectedIngredient(item);
                      }}
                      style={[styles.actionButton, styles.primaryButton]}
                    >
                      <MaterialCommunityIcons name="information-variant" size={20} color="white" />
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        setAction('Actualizar');
                        setModalVisible(true);
                        setSelectedIngredient(item);
                      }}
                      style={[styles.actionButton, styles.secondaryButton]}
                    >
                      <MaterialCommunityIcons name="pencil" size={20} color="white" />
                    </Pressable>
                    <Pressable
                      onPress={() => showDeleteAlert(item._id, item.nombre)}
                      style={[styles.actionButton, styles.tertiaryButton]}
                    >
                      <MaterialCommunityIcons name="trash-can" size={20} color="white" />
                    </Pressable>
                  </View>
                </IngredientCard>
              );
            }}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons name="cart-off" size={30} />
                <Text style={styles.emptyText}>
                  No se encontraron ingredientes, intente más tarde.
                </Text>
              </View>
            }
            ListHeaderComponent={
              <AdminFilter
                filterButtons={filterButtons}
                filter={filter}
                setFilter={setFilter as any}
              />
            }
          />
        )}
      </View>
    </ScrollView>
  );
});

const CategoriesScreen = memo(() => {
  const { categories, loading, refreshing, setRefreshing, getCategories } = use(CategoriesContext);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>({} as Category);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollViewContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true);
            await getCategories();
          }}
          colors={[PRIMARY_COLOR, SECONDARY_COLOR, TERTIARY_COLOR]}
        />
      }
    >
      <View style={styles.container}>
        <AdminHeader showSearchBar={false} />
        <CategoryModal
          category={selectedCategory}
          isVisible={modalVisible}
          setIsVisible={setModalVisible}
        />

        {loading ? (
          <Loading />
        ) : (
          <FlatList
            data={categories}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            keyExtractor={({ _id }) => _id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <CategoryCard data={item}>
                <Pressable
                  onPress={() => {
                    setSelectedCategory(item);
                    setModalVisible(true);
                  }}
                  style={[styles.actionButton, styles.secondaryButton, { margin: 'auto' }]}
                >
                  <MaterialCommunityIcons name="pencil" size={20} color="white" />
                </Pressable>
              </CategoryCard>
            )}
          />
        )}
      </View>
    </ScrollView>
  );
});

export default function AdminInventory() {
  const [screen, setScreen] = useState<'productos' | 'ingredientes' | 'categorias'>('ingredientes');

  return (
    <>
      <CategoriesProvider>
        {screen === 'productos' ? (
          <ProductsProvider>
            <ProductsScreen />
          </ProductsProvider>
        ) : (
          screen === 'ingredientes' && (
            <IngredientsProvider>
              <IngredientsScreen />
            </IngredientsProvider>
          )
        )}
      </CategoriesProvider>

      {screen === 'categorias' && (
        <CategoriesProvider>
          <CategoriesScreen />
        </CategoriesProvider>
      )}

      <View style={styles.buttonsContainer}>
        <Text style={styles.inventoryText}>
          Administración de inventario, seleccione alguna opción
        </Text>
        <View style={styles.buttonsInventoryContainer}>
          <Button
            label="Productos"
            icon="candle"
            onPress={() => setScreen('productos')}
            buttonStyle={styles.paddingButtons}
            textStyle={{ fontSize: 12 }}
          />
          <Button
            label="Ingredientes"
            icon="leaf"
            onPress={() => setScreen('ingredientes')}
            buttonStyle={{
              ...styles.paddingButtons,
              ...styles.secondaryButton,
            }}
            textStyle={{ fontSize: 12 }}
          />
          <Button
            label="Categorias"
            icon="tag"
            onPress={() => setScreen('categorias')}
            buttonStyle={{
              ...styles.paddingButtons,
              ...styles.tertiaryButton,
            }}
            textStyle={{ fontSize: 12 }}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: { flexGrow: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 10,
    rowGap: 10,
  },
  addButton: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 10,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: PRIMARY_COLOR_DARK,
    padding: 7,
    flexDirection: 'row',
    columnGap: 5,
  },
  addButtonText: {
    fontFamily: BOLD_BODY_FONT,
    color: 'white',
    textAlign: 'center',
    fontSize: 12,
  },
  columnWrapper: { columnGap: 10 },
  listContent: { rowGap: 10 },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 5,
  },
  emptyText: { fontFamily: BODY_FONT },
  actionRow: { flexDirection: 'row', columnGap: 5 },
  actionButton: {
    borderRadius: 5,
    padding: 2,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },
  primaryButton: {
    backgroundColor: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR_DARK,
  },
  secondaryButton: {
    backgroundColor: SECONDARY_COLOR,
    borderColor: SECONDARY_COLOR_DARK,
  },
  tertiaryButton: {
    backgroundColor: TERTIARY_COLOR,
    borderColor: TERTIARY_COLOR_DARK,
  },

  buttonsContainer: {
    backgroundColor: 'white',
    paddingTop: 5,
    rowGap: 5,
    borderTopWidth: 2,
    borderTopColor: GRAY_COLOR_LIGHT,
  },
  inventoryText: {
    fontSize: 12,
    textAlign: 'center',
    color: GRAY_COLOR,
  },
  buttonsInventoryContainer: {
    flexDirection: 'row',
    paddingBottom: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  paddingButtons: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
});
