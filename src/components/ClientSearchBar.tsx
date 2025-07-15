import { GRAY_COLOR_DARK } from '@/constants/Colors';
import { globalStyles } from '@/globalStyles';
import type { Product } from '@/interfaces/Product';
import { getProductsByNameRequest } from '@/services/ProductService';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { memo, useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

interface ClientSearchBarProps {
  initSearch: boolean;
  setInitSearch: Dispatch<SetStateAction<boolean>>;
}

const RenderItem = memo(({ item, setInitSearch }: any) => (
  <Pressable
    style={styles.renderItemContainer}
    onPress={() => {
      setInitSearch(false);
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

export const ClientSearchBar = memo(({ initSearch, setInitSearch }: ClientSearchBarProps) => {
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
      <TextInput
        style={styles.searchInput}
        placeholder="Jabón de canela..."
        onChangeText={text => {
          setSearch(text);
          if (text.trim()) setInitSearch(true);
          else setInitSearch(false);
        }}
      />
      <Pressable style={styles.searchIcon}>
        <MaterialCommunityIcons name="magnify" size={20} color="white" />
      </Pressable>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={globalStyles.bodyText}>Buscando productos...</Text>
        </View>
      ) : (
        <>
          {initSearch && search && (
            <FlatList
              data={searchedProducts}
              style={styles.flatList}
              keyExtractor={({ _id }) => _id.toString()}
              renderItem={({ item }) => <RenderItem item={item} setInitSearch={setInitSearch} />}
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
});

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
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
  loadingContainer: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  flatList: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    maxHeight: 200,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
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
