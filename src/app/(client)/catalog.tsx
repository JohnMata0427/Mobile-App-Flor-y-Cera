import { ClientProductCard } from '@/components/cards/ClientProductCard';
import {
  GRAY_COLOR,
  GRAY_COLOR_DARK,
  GRAY_COLOR_LIGHT,
  PRIMARY_COLOR,
  PRIMARY_COLOR_DARK,
  SECONDARY_COLOR_DARK,
  TERTIARY_COLOR_DARK,
} from '@/constants/Colors';
import { BOLD_BODY_FONT } from '@/constants/Fonts';
import { ProductsContext, ProductsProvider } from '@/contexts/ProductsContext';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { use } from 'react';
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

function Catalog() {
  const { top } = useSafeAreaInsets();
  const { products } = use(ProductsContext);

  return (
    <ScrollView
      style={{ flexGrow: 1 }}
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={() => {}}
          colors={[PRIMARY_COLOR_DARK, SECONDARY_COLOR_DARK, GRAY_COLOR_DARK]}
        />
      }
    >
      <View style={[styles.searchContainer, { paddingTop: top + 5 }]}>
        <View style={{ flex: 1 }}>
          <TextInput
            style={styles.searchInput}
            placeholder="Jabón de canela..."
          />
          <Pressable style={styles.searchIcon}>
            <MaterialCommunityIcons name="magnify" size={20} color="white" />
          </Pressable>
        </View>
        <MaterialCommunityIcons name="heart-outline" size={28} color="white" />
      </View>

      <View
        style={{
          padding: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'white',
        }}
      >
        <View
          style={{ flexDirection: 'row', columnGap: 5, alignItems: 'center' }}
        >
          <MaterialCommunityIcons
            name="star-shooting"
            size={18}
            color={GRAY_COLOR_DARK}
          />
          <Text style={{ fontWeight: 'bold', color: GRAY_COLOR_DARK }}>
            Explora nuestros productos
          </Text>
        </View>
        <Pressable
          onPress={() => {}}
          style={{
            flexDirection: 'row',
            columnGap: 5,
            borderRadius: 10,
          }}
        >
          <MaterialCommunityIcons
            name="filter"
            size={20}
            color={GRAY_COLOR_DARK}
          />
          <MaterialCommunityIcons
            name="sort"
            size={20}
            color={GRAY_COLOR_DARK}
          />
        </Pressable>
      </View>
      <View>
        <View
          style={{
            flexDirection: 'row',
            columnGap: 20,
            paddingHorizontal: 10,
            paddingBottom: 5,
            borderBottomWidth: 1,
            borderColor: GRAY_COLOR_LIGHT,
            backgroundColor: 'white',
          }}
        >
          <Text
            style={{
              fontWeight: 'bold',
              color: GRAY_COLOR_DARK,
              borderBottomWidth: 1,
            }}
          >
            Todo
          </Text>
          <Text>Jabones</Text>
          <Text>Velas</Text>
        </View>
        <Text
          style={{
            padding: 10,
            color: GRAY_COLOR,
            fontSize: 10,
            fontStyle: 'italic',
            textAlign: 'center',
          }}
        >
          Explora nuestra amplia gama de productos artesanales, desde jabones
          naturales hasta velas aromáticas, todos hechos con amor y cuidado.
        </Text>
      </View>

      <FlatList
        data={products}
        keyExtractor={({ _id }) => _id.toString()}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        columnWrapperStyle={{ justifyContent: 'center', columnGap: 10 }}
        contentContainerStyle={{ paddingHorizontal: 10, rowGap: 10 }}
        legacyImplementation={false}
        numColumns={2}
        renderItem={({ item }) => <ClientProductCard data={item} />}
      />
    </ScrollView>
  );
}

export default function CatalogScreen() {
  return (
    <ProductsProvider>
      <Catalog />
    </ProductsProvider>
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
});
