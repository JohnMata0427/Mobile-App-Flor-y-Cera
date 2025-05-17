import { ProductModal } from '@/components/ProductModal';
import {
  DARK_GRAY_COLOR,
  PRIMARY_COLOR,
  PRIMARY_COLOR_DARK,
  SECONDARY_COLOR,
  SECONDARY_COLOR_DARK,
  TERTIARY_COLOR,
  TERTIARY_COLOR_DARK,
} from '@/constants/Colors';
import { BODY_FONT, BOLD_BODY_FONT, HEADING_FONT } from '@/constants/Fonts';
import { IngredientsProvider } from '@/contexts/IngredientsContext';
import { ProductsContext, ProductsProvider } from '@/contexts/ProductsContext';
import type { Product } from '@/interfaces/Product';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { use, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

function Inventory() {
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
  const [action, setAction] = useState<'Agregar' | 'Actualizar' | 'Visualizar'>(
    'Agregar',
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(
    undefined,
  );
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true);
            await getProducts();
          }}
          colors={[PRIMARY_COLOR]}
        />
      }
    >
      <View style={{ paddingHorizontal: 25, rowGap: 10 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              columnGap: 20,
              alignItems: 'center',
            }}
          >
            <Image
              style={{ width: 50, height: 50 }}
              source={require('@/assets/images/icon.png')}
            />
            <Text style={{ fontFamily: HEADING_FONT, fontSize: 18 }}>
              Flor & Cera
            </Text>
          </View>
          <ProductModal
            data={selectedProduct}
            action={action}
            isVisible={modalVisible}
            setIsVisible={setModalVisible}
          />
          <Pressable
            style={{
              backgroundColor: PRIMARY_COLOR,
              borderRadius: 10,
              borderBottomWidth: 2,
              borderRightWidth: 2,
              borderColor: PRIMARY_COLOR_DARK,
              padding: 7,
              flexDirection: 'row',
              columnGap: 5,
            }}
            onPress={() => {
              setAction('Agregar');
              setModalVisible(true);
              setSelectedProduct(undefined);
            }}
          >
            <MaterialCommunityIcons name="plus" size={14} color="white" />
            <Text
              style={{
                fontFamily: BOLD_BODY_FONT,
                color: 'white',
                textAlign: 'center',
                fontSize: 12,
              }}
            >
              Agregar producto
            </Text>
          </Pressable>
        </View>
        <TextInput
          style={{
            borderRadius: 25,
            backgroundColor: 'white',
            paddingHorizontal: 20,
            fontSize: 12,
          }}
          placeholder="Buscar por nombre..."
        />
        <FlatList
          data={products}
          style={{ minHeight: '100%' }}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          columnWrapperStyle={{ columnGap: 10 }}
          contentContainerStyle={{ rowGap: 10 }}
          keyExtractor={({ _id }) => _id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 10,
                overflow: 'hidden',
                width: '48.45%',
                paddingHorizontal: 12,
                justifyContent: 'space-between',
              }}
            >
              <Image
                source={{ uri: item.imagen }}
                style={{
                  width: '100%',
                  height: 150,
                  padding: 10,
                }}
              />
              <View
                style={{
                  rowGap: 3,
                  paddingVertical: 10,
                }}
              >
                <Text style={{ fontFamily: BOLD_BODY_FONT, fontSize: 15 }}>
                  {item.nombre}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontFamily: BODY_FONT, fontSize: 12 }}>
                    ${item.precio} USD
                  </Text>
                  <Text
                    style={{
                      fontFamily: BOLD_BODY_FONT,
                      fontSize: 10,
                      color: 'white',
                      backgroundColor: 'black',
                      paddingVertical: 2,
                      paddingHorizontal: 5,
                      borderRadius: 5,
                    }}
                  >
                    {item?.id_categoria?.nombre?.split(' ')[0] ?? 'Ninguna'}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    columnGap: 4,
                    alignItems: 'center',
                  }}
                >
                  <MaterialCommunityIcons
                    name="cart-outline"
                    size={14}
                    color="green"
                  />
                  <Text
                    style={{
                      fontFamily: BODY_FONT,
                      color: 'green',
                      fontSize: 12,
                    }}
                  >
                    {item.stock} en stock
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', columnGap: 5 }}>
                  <Pressable
                    onPress={() => {
                      setAction('Visualizar');
                      setModalVisible(true);
                      setSelectedProduct(item);
                    }}
                    style={{
                      backgroundColor: PRIMARY_COLOR,
                      borderRadius: 5,
                      padding: 2,
                      borderBottomWidth: 2,
                      borderRightWidth: 2,
                      borderColor: PRIMARY_COLOR_DARK,
                    }}
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
                    style={{
                      backgroundColor: SECONDARY_COLOR,
                      borderRadius: 5,
                      padding: 2,
                      borderBottomWidth: 2,
                      borderRightWidth: 2,
                      borderColor: SECONDARY_COLOR_DARK,
                    }}
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
                    style={{
                      backgroundColor: TERTIARY_COLOR,
                      borderRadius: 5,
                      padding: 2,
                      borderBottomWidth: 2,
                      borderRightWidth: 2,
                      borderColor: TERTIARY_COLOR_DARK,
                    }}
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
              <View
                style={{
                  minHeight: 257,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontFamily: BODY_FONT }}>Cargando datos...</Text>
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  rowGap: 5,
                }}
              >
                <MaterialCommunityIcons name="cart-off" size={24} />
                <Text
                  style={{
                    fontFamily: BODY_FONT,
                  }}
                >
                  No se encontraron productos, intente más tarde.
                </Text>
              </View>
            )
          }
          ListHeaderComponent={
            <Text
              style={{
                fontFamily: HEADING_FONT,
                fontSize: 20,
              }}
            >
              Productos
            </Text>
          }
          ListFooterComponent={
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}
            >
              {page !== 1 && (
                <Pressable
                  onPress={() => setPage(prev => prev - 1)}
                  style={{
                    backgroundColor: DARK_GRAY_COLOR,
                    borderRadius: 5,
                    padding: 2,
                    borderBottomWidth: 2,
                    borderRightWidth: 2,
                    borderColor: 'black',
                  }}
                >
                  <MaterialCommunityIcons
                    name="chevron-left"
                    size={20}
                    color="white"
                  />
                </Pressable>
              )}
              {page < totalPages && (
                <Pressable
                  onPress={() => setPage(prev => prev - 1)}
                  style={{
                    backgroundColor: DARK_GRAY_COLOR,
                    borderRadius: 5,
                    padding: 2,
                    borderBottomWidth: 2,
                    borderRightWidth: 2,
                    borderColor: 'black',
                  }}
                >
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={20}
                    color="white"
                  />
                </Pressable>
              )}
            </View>
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
