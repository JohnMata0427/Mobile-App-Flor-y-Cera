import { ClientProductCard } from '@/components/cards/ClientProductCard';
import { ClientSearchBar } from '@/components/ClientSearchBar';
import { Loading } from '@/components/Loading';
import {
  GRAY_COLOR_DARK,
  GRAY_COLOR_LIGHT,
  PRIMARY_COLOR,
  PRIMARY_COLOR_DARK,
  SECONDARY_COLOR,
  TERTIARY_COLOR,
} from '@/constants/Colors';
import { CategoriesContext, CategoriesProvider } from '@/contexts/CategoryContext';
import { ProductsContext, ProductsProvider } from '@/contexts/ProductsContext';
import { globalStyles } from '@/globalStyles';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { memo, use, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const RenderItem = memo(({ item, setFilter, filter }: any) => (
  <Pressable onPress={() => setFilter({ key: 'id_categoria', value: item._id })}>
    <Text
      style={[filter.value === item._id ? styles.selectedCategoryText : {}, styles.categoryText]}
    >
      {item.nombre}
    </Text>
  </Pressable>
));

const Catalog = memo(() => {
  const [initSearch, setInitSearch] = useState<boolean>(false);
  const { top } = useSafeAreaInsets();
  const { categories } = use(CategoriesContext);
  const { searchedProducts, filter, loading, refreshing, setRefreshing, getProducts, setFilter } =
    use(ProductsContext);

  return (
    <>
      <View style={[styles.searchContainer, { paddingTop: top + 5 }]}>
        <ClientSearchBar initSearch={initSearch} setInitSearch={setInitSearch} />
      </View>

      {loading ? (
        <Loading />
      ) : (
        <ScrollView
          style={styles.scrollView}
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
          <View style={styles.headerContainer}>
            <View style={styles.titleContainer}>
              <MaterialCommunityIcons name="star-shooting" size={18} color={GRAY_COLOR_DARK} />
              <Text style={globalStyles.labelText}>Explora nuestros productos</Text>
            </View>
            {/* <Pressable onPress={() => {}} style={styles.filterButton}>
              <MaterialCommunityIcons name="filter" size={20} color={GRAY_COLOR_DARK} />
              <MaterialCommunityIcons name="sort" size={20} color={GRAY_COLOR_DARK} />
            </Pressable> */}
          </View>

          <View>
            <View style={styles.categoryContainer}>
              <Pressable onPress={() => setFilter({ key: 'tipo', value: '' })}>
                <Text
                  style={[!filter.value ? styles.selectedCategoryText : {}, styles.categoryText]}
                >
                  Todo
                </Text>
              </Pressable>

              <FlatList
                data={categories}
                keyExtractor={({ _id }) => _id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <RenderItem item={item} setFilter={setFilter} filter={filter} />
                )}
              />
            </View>
            <Text style={globalStyles.subtitle}>
              Explora nuestra amplia gama de productos artesanales, desde jabones naturales hasta
              velas aromáticas, todos hechos con amor y cuidado.
            </Text>
          </View>

          <FlatList
            data={searchedProducts}
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
      )}
    </>
  );
});

export default function CatalogScreen() {
  return (
    <CategoriesProvider>
      <ProductsProvider>
        <Catalog />
      </ProductsProvider>
    </CategoriesProvider>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  categoryText: {
    paddingHorizontal: 10,
  },
  columnWrapper: {
    justifyContent: 'center',
    columnGap: 10,
  },
  flatListContainer: {
    paddingHorizontal: 10,
    rowGap: 10,
  },
  searchContainer: {
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    columnGap: 10,
  },
  headerContainer: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  titleContainer: { flexDirection: 'row', columnGap: 5, alignItems: 'center' },
  filterButton: {
    flexDirection: 'row',
    columnGap: 5,
    borderRadius: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    columnGap: 5,
    paddingHorizontal: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderColor: GRAY_COLOR_LIGHT,
    backgroundColor: 'white',
  },
  selectedCategoryText: {
    fontWeight: 'bold',
    color: PRIMARY_COLOR_DARK,
    borderBottomWidth: 2,
    borderColor: PRIMARY_COLOR,
  },
});