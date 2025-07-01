import { ClientProductCard } from '@/components/cards/ClientProductCard';
import { Loading } from '@/components/Loading';
import {
  GRAY_COLOR,
  GRAY_COLOR_DARK,
  GRAY_COLOR_LIGHT,
  PRIMARY_COLOR,
  PRIMARY_COLOR_DARK,
  SECONDARY_COLOR,
  TERTIARY_COLOR,
} from '@/constants/Colors';
import { CategoriesContext, CategoriesProvider } from '@/contexts/CategoryContext';
import { ProductsContext, ProductsProvider } from '@/contexts/ProductsContext';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { memo, use, useEffect } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Catalog = memo(() => {
  const { top } = useSafeAreaInsets();
  const { categories } = use(CategoriesContext);
  const {
    searchedProducts,
    filter,
    loading,
    refreshing,
    setRefreshing,
    getProducts,
    setFilter,
  } = use(ProductsContext);

  return (
    <>
      <View style={[styles.searchContainer, { paddingTop: top + 5 }]}>
        <View style={{ flex: 1 }}>
          <TextInput style={styles.searchInput} placeholder="Jabón de canela..." />
          <Pressable style={styles.searchIcon}>
            <MaterialCommunityIcons name="magnify" size={20} color="white" />
          </Pressable>
        </View>
        <MaterialCommunityIcons name="heart-outline" size={28} color="white" />
      </View>

      {loading ? (
        <Loading />
      ) : (
        <ScrollView
          style={{ flexGrow: 1 }}
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
              <Text style={styles.titleText}>Explora nuestros productos</Text>
            </View>
            <Pressable onPress={() => {}} style={styles.filterButton}>
              <MaterialCommunityIcons name="filter" size={20} color={GRAY_COLOR_DARK} />
              <MaterialCommunityIcons name="sort" size={20} color={GRAY_COLOR_DARK} />
            </Pressable>
          </View>

          <View>
            <View style={styles.categoryContainer}>
              <Pressable onPress={() => setFilter({ key: 'tipo', value: '' })}>
                <Text
                  style={[
                    !filter.value ? styles.selectedCategoryText : {},
                    { paddingHorizontal: 10 },
                  ]}
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
                  <Pressable onPress={() => setFilter({ key: 'id_categoria', value: item._id })}>
                    <Text
                      style={[
                        filter.value === item._id ? styles.selectedCategoryText : {},
                        { paddingHorizontal: 10 },
                      ]}
                    >
                      {item.nombre}
                    </Text>
                  </Pressable>
                )}
              />
            </View>
            <Text style={styles.informationText}>
              Explora nuestra amplia gama de productos artesanales, desde jabones naturales hasta
              velas aromáticas, todos hechos con amor y cuidado.
            </Text>
          </View>

          <FlatList
            data={searchedProducts}
            keyExtractor={({ _id }) => _id.toString()}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            columnWrapperStyle={{ justifyContent: 'center', columnGap: 10 }}
            contentContainerStyle={{ paddingHorizontal: 10, rowGap: 10 }}
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
  searchContainer: {
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    columnGap: 10,
  },
  searchInput: {
    borderRadius: 20,
    backgroundColor: 'white',
    paddingLeft: 20,
    paddingRight: 70,
    fontSize: 12,
  },
  searchIcon: {
    position: 'absolute',
    insetBlock: 3,
    right: 3,
    justifyContent: 'center',
    backgroundColor: GRAY_COLOR_DARK,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 20,
  },

  headerContainer: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },

  titleContainer: { flexDirection: 'row', columnGap: 5, alignItems: 'center' },
  titleText: { fontWeight: 'bold', color: GRAY_COLOR_DARK },

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

  informationText: {
    padding: 10,
    color: GRAY_COLOR,
    fontSize: 10,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
