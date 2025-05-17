import {
  GRAY_COLOR_DARK,
  GRAY_COLOR_LIGHT,
  GREEN_COLOR,
  GREEN_COLOR_DARK,
  GREEN_COLOR_LIGHT,
  PRIMARY_COLOR,
  PRIMARY_COLOR_DARK,
  RED_COLOR,
  RED_COLOR_DARK,
} from '@/constants/Colors';
import { BODY_FONT, BOLD_BODY_FONT, HEADING_FONT } from '@/constants/Fonts';
import { InvoicesContext, InvoicesProvider } from '@/contexts/InvoicesContext';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { use } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

function Invoices() {
  const {
    invoices,
    loading,
    page,
    totalPages,
    refreshing,
    setPage,
    setRefreshing,
    getInvoices,
  } = use(InvoicesContext);

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true);
            await getInvoices();
          }}
          colors={[PRIMARY_COLOR]}
        />
      }
    >
      <View style={{ paddingHorizontal: 25, rowGap: 10 }}>
        <View
          style={{ flexDirection: 'row', columnGap: 20, alignItems: 'center' }}
        >
          <Image
            style={{ width: 50, height: 50 }}
            source={require('@/assets/images/icon.png')}
          />
          <Text style={{ fontFamily: HEADING_FONT, fontSize: 18 }}>
            Flor & Cera
          </Text>
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
          data={invoices}
          scrollEnabled={false}
          contentContainerStyle={{ rowGap: 10 }}
          keyExtractor={({ _id }) => _id}
          renderItem={({
            item: {
              _id,
              cliente_id: { nombre, apellido, email },
              fecha_venta,
              productos: { length },
              total,
              estado,
            },
          }) => {
            const isPending = estado === 'pendiente';

            return (
              <View
                style={{
                  backgroundColor: 'white',
                  borderRadius: 10,
                  padding: 12,
                  rowGap: 5,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderColor: GRAY_COLOR_LIGHT,
                  borderBottomWidth: 2,
                  borderRightWidth: 2,
                }}
              >
                <View style={{ rowGap: 2 }}>
                  <Text style={{ fontFamily: BOLD_BODY_FONT }}>
                    {nombre} {apellido}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      columnGap: 3,
                      alignItems: 'center',
                    }}
                  >
                    <MaterialCommunityIcons
                      name="email-check-outline"
                      size={14}
                      color={GRAY_COLOR_DARK}
                    />
                    <Text
                      style={{
                        fontFamily: BODY_FONT,
                        fontSize: 12,
                      }}
                    >
                      {email}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      columnGap: 3,
                      alignItems: 'center',
                    }}
                  >
                    <MaterialCommunityIcons
                      name="calendar"
                      size={14}
                      color={GRAY_COLOR_DARK}
                    />
                    <Text
                      style={{
                        fontFamily: BODY_FONT,
                        fontSize: 12,
                      }}
                    >
                      {new Intl.DateTimeFormat('es-ES', {
                        dateStyle: 'long',
                      }).format(new Date(fecha_venta))}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      columnGap: 3,
                      alignItems: 'center',
                    }}
                  >
                    <MaterialCommunityIcons
                      name="format-list-bulleted"
                      size={14}
                      color={GRAY_COLOR_DARK}
                    />
                    <Text
                      style={{
                        fontFamily: BODY_FONT,
                        fontSize: 12,
                      }}
                    >
                      {length} producto
                      {length > 1 ? 's' : ''}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      columnGap: 3,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: GRAY_COLOR_LIGHT,
                      padding: 2,
                      borderRadius: 5,
                    }}
                  >
                    <MaterialCommunityIcons
                      name="file-document-outline"
                      size={14}
                      color={isPending ? GRAY_COLOR_DARK : GREEN_COLOR_LIGHT}
                    />
                    <Text
                      style={{
                        fontFamily: BODY_FONT,
                        fontSize: 12,
                        color: isPending ? GRAY_COLOR_DARK : GREEN_COLOR_LIGHT,
                      }}
                    >
                      {estado[0].toUpperCase() + estado.slice(1)}
                    </Text>
                  </View>
                </View>
                <View style={{ rowGap: 5 }}>
                  <View style={{ alignItems: 'center' }}>
                    <MaterialCommunityIcons
                      name="cash-multiple"
                      size={26}
                      color={GRAY_COLOR_DARK}
                    />
                    <Text style={{ fontFamily: BOLD_BODY_FONT }}>
                      ${total} USD
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', columnGap: 5 }}>
                    <Pressable
                      style={{
                        backgroundColor: PRIMARY_COLOR,
                        borderRadius: 5,
                        padding: 2,
                        borderBottomWidth: 2,
                        borderRightWidth: 2,
                        borderColor: PRIMARY_COLOR_DARK,
                      }}
                      onPress={() => {}}
                    >
                      <MaterialCommunityIcons
                        name="information-variant"
                        size={20}
                        color="white"
                      />
                    </Pressable>
                    <Pressable
                      style={{
                        backgroundColor: isPending ? GREEN_COLOR : RED_COLOR,
                        borderRadius: 5,
                        padding: 2,
                        borderBottomWidth: 2,
                        borderRightWidth: 2,
                        borderColor: isPending
                          ? GREEN_COLOR_DARK
                          : RED_COLOR_DARK,
                      }}
                      onPress={() => {}}
                    >
                      <MaterialCommunityIcons
                        name={isPending ? 'truck-check' : 'account-lock-open'}
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
                <MaterialCommunityIcons
                  name="file-document-outline"
                  size={30}
                />
                <Text style={{ fontFamily: BODY_FONT }}>
                  No hay facturas registradas
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

export default function AdminInvoices() {
  return (
    <InvoicesProvider>
      <Invoices />
    </InvoicesProvider>
  );
}
