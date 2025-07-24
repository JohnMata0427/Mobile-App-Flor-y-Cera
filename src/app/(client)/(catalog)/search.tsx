import { GRAY_COLOR_DARK, GRAY_COLOR_LIGHT } from '@/constants/Colors';
import { globalStyles } from '@/globalStyles';
import type { Product } from '@/interfaces/Product';
import { getProductsByNameRequest } from '@/services/ProductService';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { memo, useEffect, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const RenderItem = memo(({ item }: any) => (
  <Pressable
    style={styles.renderItemContainer}
    onPress={() => {
      router.push({
        pathname: '/(client)/(catalog)/[product_id]',
        params: { product_id: item._id },
      });
    }}
  >
    <Image source={{ uri: item.imagen }} style={styles.renderItemImage} />
    <View style={styles.renderItemDetails}>
      <Text style={globalStyles.subtitle}>{item.id_categoria.nombre}</Text>
      <Text style={globalStyles.bodyText}>{item.nombre}</Text>
    </View>
  </Pressable>
));

export default function ClientSearchBar() {
  const { top } = useSafeAreaInsets();
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [searchedProducts, setSearchedProducts] = useState<Product[]>([]);

  useEffect(() => {
    (async () => {
      if (search.trim()) {
        setLoading(true);
        const { productos } = await getProductsByNameRequest(search);
        setSearchedProducts(productos);
        setLoading(false);
      }
    })();
  }, [search]);

  return (
    <View style={styles.flexOne}>
      <View style={{ flexDirection: 'row', marginTop: top + 5, alignItems: 'center' }}>
        <Pressable onPress={() => router.replace('/(client)/(catalog)')} style={{ padding: 5 }}>
          <MaterialCommunityIcons name="arrow-left" size={20} color="black" />
        </Pressable>
        <View
          style={{
            borderWidth: 1,
            borderRadius: 20,
            borderColor: GRAY_COLOR_LIGHT,
            flex: 1,
          }}
        >
          <TextInput
            style={styles.searchInput}
            placeholder="Jabón de canela..."
            onChangeText={text => setSearch(text)}
            autoFocus
          />
          <Pressable style={styles.searchIcon}>
            <MaterialCommunityIcons name="magnify" size={20} color="white" />
          </Pressable>
        </View>
      </View>

      {loading ? (
        <View style={styles.emptyComponentContainer}>
          <Text style={globalStyles.bodyText}>Buscando productos...</Text>
        </View>
      ) : (
        <>
          {search && (
            <FlatList
              data={searchedProducts}
              keyExtractor={({ _id }) => _id.toString()}
              renderItem={({ item }) => <RenderItem item={item} />}
              ListEmptyComponent={
                <View style={styles.emptyComponentContainer}>
                  <Text style={globalStyles.bodyText}>No se encontraron productos</Text>
                </View>
              }
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
    paddingHorizontal: 10,
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
  emptyComponentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  renderItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 1.5,
    borderColor: GRAY_COLOR_LIGHT,
  },
  renderItemImage: {
    width: 25,
    height: 25,
    borderRadius: 5,
  },
  renderItemDetails: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});
