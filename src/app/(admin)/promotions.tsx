import {
  GRAY_COLOR_DARK,
  GRAY_COLOR_LIGHT,
  PRIMARY_COLOR,
  PRIMARY_COLOR_DARK,
  SECONDARY_COLOR,
  SECONDARY_COLOR_DARK,
  TERTIARY_COLOR,
  TERTIARY_COLOR_DARK,
} from '@/constants/Colors';
import { BODY_FONT, BOLD_BODY_FONT, HEADING_FONT } from '@/constants/Fonts';
import {
  PromotionsContext,
  PromotionsProvider,
} from '@/contexts/PromotionsContext';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { use } from 'react';
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

function Promotions() {
  const {
    promotions,
    loading,
    page,
    totalPages,
    refreshing,
    setRefreshing,
    setPage,
    getPromotions,
    deletePromotion,
  } = use(PromotionsContext);

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true);
            await getPromotions();
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
          {/* <ProductModal
            data={selectedProduct}
            action={action}
            isVisible={modalVisible}
            setIsVisible={setModalVisible}
          /> */}
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
            // onPress={() => {
            //   setAction('Agregar');
            //   setModalVisible(true);
            //   setSelectedProduct(undefined);
            // }}
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
              Nueva promoción
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
          data={promotions}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ rowGap: 10 }}
          keyExtractor={({ _id }) => _id}
          scrollEnabled={false}
          renderItem={({ item }) => {
            const { _id, imagen, nombre, createdAt } = item;

            return (
              <View
                style={{
                  backgroundColor: 'white',
                  borderRadius: 10,
                  overflow: 'hidden',
                  paddingHorizontal: 12,
                  justifyContent: 'space-between',
                  borderColor: GRAY_COLOR_LIGHT,
                  borderBottomWidth: 2,
                  borderRightWidth: 2,
                }}
              >
                <Image
                  source={{ uri: imagen }}
                  resizeMode="cover"
                  style={{
                    width: '100%',
                    aspectRatio: 16 / 9,
                  }}
                />
                <View
                  style={{
                    rowGap: 3,
                    paddingTop: 5,
                    paddingBottom: 10,
                    borderTopColor: GRAY_COLOR_LIGHT,
                    borderTopWidth: 1,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: BOLD_BODY_FONT,
                      fontSize: 15,
                      textTransform: 'capitalize',
                      textAlign: 'center',
                    }}
                  >
                    {nombre}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      columnGap: 5,
                      justifyContent: 'center',
                    }}
                  >
                    <MaterialCommunityIcons
                      name="calendar-clock"
                      size={14}
                      color={GRAY_COLOR_DARK}
                    />
                    <Text
                      style={{
                        fontFamily: BODY_FONT,
                        fontSize: 12,
                        color: GRAY_COLOR_DARK,
                      }}
                    >
                      Promoción creada el{' '}
                      {new Intl.DateTimeFormat('es-ES', {
                        dateStyle: 'long',
                        timeStyle: 'short',
                      }).format(new Date(createdAt))}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      columnGap: 5,
                      justifyContent: 'center',
                    }}
                  >
                    <Pressable
                      // onPress={() => {
                      //   setAction('Actualizar');
                      //   setModalVisible(true);
                      //   setSelectedProduct(item);
                      // }}
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
                          'Eliminar promoción',
                          '¿Estás seguro de que deseas eliminar esta promoción? Esta acción no se puede deshacer.',
                          [
                            {
                              text: 'Cancelar',
                              style: 'cancel',
                            },
                            {
                              text: 'Eliminar',
                              style: 'destructive',
                              onPress: () => deletePromotion(_id),
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
            );
          }}
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
                <MaterialCommunityIcons name="ticket" size={24} />
                <Text
                  style={{
                    fontFamily: BODY_FONT,
                  }}
                >
                  No se encontraron promociones, agregue una nueva
                </Text>
              </View>
            )
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
                    backgroundColor: GRAY_COLOR_DARK,
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
                    backgroundColor: GRAY_COLOR_DARK,
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

export default function AdminPromotions() {
  return (
    <PromotionsProvider>
      <Promotions />
    </PromotionsProvider>
  );
}
