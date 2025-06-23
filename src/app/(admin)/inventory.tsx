import { AdminHeader } from '@/components/AdminHeader';
import { Loading } from '@/components/Loading';
import { Pagination } from '@/components/Pagination';
import { ProductCard } from '@/components/cards/ProductCard';
import { ProductModal } from '@/components/modals/ProductModal';
import {
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
import type { Product } from '@/interfaces/Product';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { use, useCallback, useState } from 'react';
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

  const showDeleteAlert = useCallback(
    (productId: string, nombre: string) => {
      Alert.alert(
        'Eliminar producto',
        '¿Está seguro de que desea eliminar ' +
          nombre +
          '? Esta acción no se puede deshacer.',
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
          isVisible={modalVisible}
          product={selectedProduct}
          action={action}
          setIsVisible={setModalVisible}
        />

        {loading ? (
          <Loading />
        ) : (
          <FlatList
            data={products}
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
                    <MaterialCommunityIcons name="pencil" size={20} color="white" />
                  </Pressable>
                  <Pressable
                    onPress={() => showDeleteAlert(item._id, item.nombre)}
                    style={[styles.actionButton, styles.deleteButton]}
                  >
                    <MaterialCommunityIcons name="trash-can" size={20} color="white" />
                  </Pressable>
                </View>
              </ProductCard>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons name="cart-off" size={24} />
                <Text style={styles.emptyText}>
                  No se encontraron productos, intente más tarde.
                </Text>
              </View>
            }
            ListHeaderComponent={
              <Pagination page={page} setPage={setPage} totalPages={totalPages} />
            }
          />
        )}
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
});
