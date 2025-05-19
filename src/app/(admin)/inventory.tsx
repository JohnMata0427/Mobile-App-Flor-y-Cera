import { AdminHeader } from '@/components/AdminHeader';
import { Pagination } from '@/components/Pagination';
import { ProductModal } from '@/components/ProductModal';
import {
  GRAY_COLOR_LIGHT,
  PRIMARY_COLOR,
  PRIMARY_COLOR_DARK,
  SECONDARY_COLOR,
  SECONDARY_COLOR_DARK,
  TERTIARY_COLOR,
  TERTIARY_COLOR_DARK,
} from '@/constants/Colors';
import { BODY_FONT, BOLD_BODY_FONT } from '@/constants/Fonts';
import { IngredientsProvider } from '@/contexts/IngredientsContext';
import { ProductsContext, ProductsProvider } from '@/contexts/ProductsContext';
import type { IDCategoria, Product } from '@/interfaces/Product';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { use, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Action = 'Agregar' | 'Actualizar' | 'Visualizar';

function Inventory() {
  const [action, setAction] = useState<Action>('Agregar');
  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const {
    products,
    loading,
    refreshing,
    page,
    totalPages,
    setRefreshing,
    setPage,
    getProducts,
    deleteProduct,
  } = use(ProductsContext);

  return (
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
        <AdminHeader>
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
          data={selectedProduct}
          action={action}
          isVisible={modalVisible}
          setIsVisible={setModalVisible}
        />
        <FlatList
          data={products}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          keyExtractor={({ _id }) => _id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <Image
                source={{ uri: item.imagen }}
                resizeMode="cover"
                style={styles.productImage}
              />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.nombre}</Text>
                <View style={styles.priceStockRow}>
                  <Text style={styles.priceText}>${item.precio} USD</Text>
                  <Text style={styles.categoryBadge}>
                    {(item?.id_categoria as IDCategoria)?.nombre?.split(
                      ' ',
                    )[0] ?? 'Ninguna'}
                  </Text>
                </View>
                <View style={styles.stockRow}>
                  <MaterialCommunityIcons
                    name="cart-outline"
                    size={14}
                    color="green"
                  />
                  <Text style={styles.stockText}>{item.stock} en stock</Text>
                </View>
                <View style={styles.stockRow}>
                  <Pressable
                    onPress={() => {
                      setAction('Visualizar');
                      setModalVisible(true);
                      setSelectedProduct(item);
                    }}
                    style={[styles.actionButton, styles.infoButton]}
                  >
                    <MaterialCommunityIcons
                      name="information-variant"
                      size={20}
                      color="white"
                    />
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setAction('Actualizar');
                      setModalVisible(true);
                      setSelectedProduct(item);
                    }}
                    style={[styles.actionButton, styles.editButton]}
                  >
                    <MaterialCommunityIcons
                      name="pencil"
                      size={20}
                      color="white"
                    />
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      Alert.alert(
                        'Eliminar producto',
                        '¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.',
                        [
                          {
                            text: 'Cancelar',
                            style: 'cancel',
                          },
                          {
                            text: 'Eliminar',
                            style: 'destructive',
                            onPress: () => deleteProduct(item._id),
                          },
                        ],
                      );
                    }}
                    style={[styles.actionButton, styles.deleteButton]}
                  >
                    <MaterialCommunityIcons
                      name="trash-can"
                      size={20}
                      color="white"
                    />
                  </Pressable>
                </View>
              </View>
            </View>
          )}
          ListEmptyComponent={
            loading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.emptyText}>Cargando datos...</Text>
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons name="cart-off" size={24} />
                <Text style={styles.emptyText}>
                  No se encontraron productos, intente más tarde.
                </Text>
              </View>
            )
          }
          ListFooterComponent={
            <Pagination page={page} setPage={setPage} totalPages={totalPages} />
          }
        />
      </View>
    </ScrollView>
  );
}

export default function AdminInventory() {
  return (
    <IngredientsProvider>
      <ProductsProvider>
        <Inventory />
      </ProductsProvider>
    </IngredientsProvider>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    paddingHorizontal: 25,
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
  list: {
    minHeight: '100%',
  },
  columnWrapper: {
    columnGap: 10,
  },
  listContent: {
    rowGap: 10,
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    width: '48.45%',
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 5,
    justifyContent: 'space-between',
  },
  productImage: {
    aspectRatio: 1 / 1,
    borderRadius: 10,
  },
  productInfo: {
    rowGap: 3,
    paddingVertical: 5,
    borderTopColor: GRAY_COLOR_LIGHT,
    borderTopWidth: 1,
  },
  productName: {
    fontFamily: BOLD_BODY_FONT,
    fontSize: 15,
  },
  priceStockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontFamily: BODY_FONT,
    fontSize: 12,
  },
  categoryBadge: {
    fontFamily: BOLD_BODY_FONT,
    fontSize: 10,
    color: 'white',
    backgroundColor: 'black',
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  stockRow: {
    flexDirection: 'row',
    columnGap: 4,
    alignItems: 'center',
  },
  stockText: {
    fontFamily: BODY_FONT,
    color: 'green',
    fontSize: 12,
  },
  actionRow: {
    flexDirection: 'row',
    columnGap: 5,
  },
  actionButton: {
    borderRadius: 5,
    padding: 2,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },
  infoButton: {
    backgroundColor: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR_DARK,
  },
  editButton: {
    backgroundColor: SECONDARY_COLOR,
    borderColor: SECONDARY_COLOR_DARK,
  },
  deleteButton: {
    backgroundColor: TERTIARY_COLOR,
    borderColor: TERTIARY_COLOR_DARK,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 5,
  },
  emptyText: {
    fontFamily: BODY_FONT,
  },
});
