import { AdminFilter } from '@/components/AdminFilter';
import { AdminHeader } from '@/components/AdminHeader';
import { AdminSearch } from '@/components/AdminSearch';
import { Button } from '@/components/Button';
import { Loading } from '@/components/Loading';
import { AdminIngredientCard } from '@/components/cards/AdminIngredientCard';
import { AdminProductCard } from '@/components/cards/AdminProductCard';
import { CategoryCard } from '@/components/cards/CategoryCard';
import { CategoryModal } from '@/components/modals/CategoryModal';
import { IngredientModal } from '@/components/modals/IngredientModal';
import { ProductModal } from '@/components/modals/ProductModal';
import {
  GRAY_COLOR_LIGHT,
  PRIMARY_COLOR,
  PRIMARY_COLOR_DARK,
  PRIMARY_COLOR_EXTRA_LIGHT,
  REFRESH_COLORS,
  SECONDARY_COLOR,
  SECONDARY_COLOR_DARK,
  TERTIARY_COLOR,
  TERTIARY_COLOR_DARK,
} from '@/constants/Colors';
import { CategoriesContext, CategoriesProvider } from '@/contexts/CategoryContext';
import { IngredientsContext, IngredientsProvider } from '@/contexts/IngredientsContext';
import { ProductsContext, ProductsProvider } from '@/contexts/ProductsContext';
import { globalStyles } from '@/globalStyles';
import type { Category } from '@/interfaces/Category';
import type { Ingredient, IngredientFilter } from '@/interfaces/Ingredient';
import type { Product, ProductFilter } from '@/interfaces/Product';
import { showConfirmationAlert } from '@/utils/showAlert';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { memo, use, useCallback, useEffect, useState } from 'react';
import {
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

const ProductsScreen = memo(function ProductsScreen() {
  const [action, setAction] = useState<Action>('Agregar');
  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const {
    searchedProducts,
    loading,
    refreshing,
    filter,
    setRefreshing,
    setFilter,
    setSearch,
    getProducts,
    deleteProduct,
  } = use(ProductsContext);
  const [filterButtons, setFilterButtons] = useState<FilterProductButton[]>([]);
  const { categories } = use(CategoriesContext);

  const showDeleteAlert = useCallback(
    (productId: string, nombre: string) => {
      showConfirmationAlert({
        message:
          '¿Está seguro de que desea eliminar ' + nombre + '? Esta acción no se puede deshacer.',
        onConfirm: () => deleteProduct(productId),
        confirmButtonText: 'Eliminar',
      });
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
        contentContainerStyle={globalStyles.scrollViewContent}
        stickyHeaderIndices={[1]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await getProducts();
            }}
            colors={REFRESH_COLORS}
          />
        }
      >
        <AdminHeader>
          <Button
            label="Nuevo producto"
            icon="plus"
            onPress={() => {
              setAction('Agregar');
              setModalVisible(true);
              setSelectedProduct(undefined);
            }}
            buttonStyle={styles.headerButton}
            textStyle={styles.headerButtonText}
          />
        </AdminHeader>

        <View key="search-bar-container">
          <View style={styles.stickyHeader}>
            <AdminSearch setSearch={setSearch} placeholder="Buscar producto por nombre..." />

            <AdminFilter
              filterButtons={filterButtons}
              filter={filter}
              setFilter={setFilter as any}
            />
          </View>
        </View>

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
              <AdminProductCard data={item} categories={categories}>
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
              </AdminProductCard>
            )}
            ListEmptyComponent={
              <View style={globalStyles.centeredContainer}>
                <MaterialCommunityIcons name="cart-off" size={30} />
                <Text style={globalStyles.bodyText}>
                  No se encontraron productos, intente más tarde.
                </Text>
              </View>
            }
          />
        )}
      </ScrollView>
    </IngredientsProvider>
  );
});

const RenderItem = memo(
  ({
    item,
    categories,
    showDeleteAlert,
    setAction,
    setModalVisible,
    setSelectedIngredient,
  }: {
    item: Ingredient;
    categories: Category[];
    showDeleteAlert: (ingredientId: string, nombre: string) => void;
    setAction: (action: Action) => void;
    setModalVisible: (visible: boolean) => void;
    setSelectedIngredient: (ingredient: Ingredient) => void;
  }) => {
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
      <AdminIngredientCard data={item} category={categoryName}>
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
      </AdminIngredientCard>
    );
  },
);

const IngredientsScreen = memo(function IngredientsScreen() {
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
      showConfirmationAlert({
        message:
          '¿Está seguro de que desea eliminar ' + nombre + '? Esta acción no se puede deshacer.',
        onConfirm: () => deleteIngredient(ingredientId),
        confirmButtonText: 'Eliminar',
      });
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
      contentContainerStyle={globalStyles.scrollViewContent}
      stickyHeaderIndices={[1]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true);
            await getIngredients();
          }}
          colors={REFRESH_COLORS}
        />
      }
    >
      <AdminHeader>
        <Button
          label="Nuevo ingrediente"
          icon="plus"
          onPress={() => {
            setAction('Agregar');
            setModalVisible(true);
            setSelectedIngredient(undefined);
          }}
          buttonStyle={styles.headerButton}
          textStyle={styles.headerButtonText}
        />
      </AdminHeader>

      <View key="search-bar-container">
        <View style={styles.stickyHeader}>
          <AdminSearch setSearch={setSearch} placeholder="Buscar ingrediente por nombre..." />

          <AdminFilter filterButtons={filterButtons} filter={filter} setFilter={setFilter as any} />
        </View>
      </View>

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
          renderItem={({ item }) => (
            <RenderItem
              item={item}
              categories={categories}
              showDeleteAlert={showDeleteAlert}
              setAction={setAction}
              setModalVisible={setModalVisible}
              setSelectedIngredient={setSelectedIngredient}
            />
          )}
          ListEmptyComponent={
            <View style={globalStyles.centeredContainer}>
              <MaterialCommunityIcons name="cart-off" size={30} />
              <Text style={globalStyles.bodyText}>
                No se encontraron ingredientes, intente más tarde.
              </Text>
            </View>
          }
        />
      )}
    </ScrollView>
  );
});

const CategoriesScreen = memo(function CategoriesScreen() {
  const { categories, loading, refreshing, setRefreshing, getCategories } = use(CategoriesContext);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>({} as Category);

  return (
    <ScrollView
      contentContainerStyle={globalStyles.scrollViewContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true);
            await getCategories();
          }}
          colors={REFRESH_COLORS}
        />
      }
    >
      <AdminHeader />

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
                style={[styles.actionButton, styles.secondaryButton, styles.centeredButton]}
              >
                <MaterialCommunityIcons name="pencil" size={20} color="white" />
              </Pressable>
            </CategoryCard>
          )}
        />
      )}
    </ScrollView>
  );
});

export default function AdminInventory() {
  const [screen, setScreen] = useState<'productos' | 'ingredientes' | 'categorias'>('productos');

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
        <Text style={globalStyles.subtitle}>
          Administración de inventario, seleccione alguna opción
        </Text>
        <View style={styles.buttonsInventoryContainer}>
          <Button
            label="Productos"
            icon="candle"
            onPress={() => setScreen('productos')}
            buttonStyle={styles.paddingButtons}
            textStyle={styles.headerButtonText}
          />
          <Button
            label="Ingredientes"
            icon="leaf"
            onPress={() => setScreen('ingredientes')}
            buttonStyle={[styles.paddingButtons, styles.secondaryButton]}
            textStyle={styles.headerButtonText}
          />
          <Button
            label="Categorias"
            icon="tag"
            onPress={() => setScreen('categorias')}
            buttonStyle={[styles.paddingButtons, styles.tertiaryButton]}
            textStyle={styles.headerButtonText}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  stickyHeader: {
    rowGap: 10,
    backgroundColor: PRIMARY_COLOR_EXTRA_LIGHT,
    paddingTop: 5,
    paddingBottom: 10,
    paddingHorizontal: 15,
  },
  columnWrapper: { columnGap: 10 },
  listContent: { rowGap: 10, paddingHorizontal: 15, borderRadius: 10 },
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
  headerButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  headerButtonText: {
    fontSize: 12,
  },
  centeredButton: {
    margin: 'auto',
  },
});
