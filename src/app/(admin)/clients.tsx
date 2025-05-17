import {
  GRAY_COLOR,
  GRAY_COLOR_DARK,
  GRAY_COLOR_LIGHT,
  GREEN_COLOR,
  GREEN_COLOR_DARK,
  GREEN_COLOR_LIGHT,
  PRIMARY_COLOR,
  PRIMARY_COLOR_DARK,
  RED_COLOR,
  RED_COLOR_DARK,
  RED_COLOR_LIGHT,
} from '@/constants/Colors';
import { BODY_FONT, BOLD_BODY_FONT, HEADING_FONT } from '@/constants/Fonts';
import { ClientsContext, ClientsProvider } from '@/contexts/ClientsContext';
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

function Clients() {
  const {
    clients,
    loading,
    refreshing,
    page,
    totalPages,
    setRefreshing,
    setPage,
    getClients,
    activateClientAccount,
    deleteClientAccount,
  } = use(ClientsContext);

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true);
            await getClients();
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
          placeholder="Buscar cliente por nombre..."
        />
        <FlatList
          data={clients}
          scrollEnabled={false}
          contentContainerStyle={{ rowGap: 10 }}
          keyExtractor={({ _id }) => _id}
          renderItem={({
            item: {
              _id,
              nombre,
              apellido,
              email,
              genero,
              imagen,
              direccion,
              estado,
              createdAt,
            },
          }) => {
            const isActive = estado === 'activo';
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
                <View
                  style={{
                    flexDirection: 'row',
                    columnGap: 10,
                    alignItems: 'center',
                  }}
                >
                  <View style={{ rowGap: 4, justifyContent: 'center' }}>
                    <Image
                      resizeMode="cover"
                      source={{
                        uri:
                          imagen ??
                          'https://thumbs.dreamstime.com/b/default-avatar-profile-icon-social-media-user-image-gray-blank-silhouette-vector-illustration-305503988.jpg',
                      }}
                      style={{
                        width: 45,
                        height: 45,
                        borderRadius: 50,
                        borderWidth: 2,
                        borderColor: GRAY_COLOR,
                      }}
                    />
                    <Text
                      style={{
                        fontFamily: BODY_FONT,
                        fontSize: 10,
                        textAlign: 'center',
                        backgroundColor: isActive ? GREEN_COLOR_LIGHT : RED_COLOR_LIGHT,
                        color: isActive ? GREEN_COLOR_DARK : RED_COLOR_DARK,
                        borderColor: isActive ? GREEN_COLOR_DARK : RED_COLOR_DARK,
                        borderWidth: 0.5,
                        paddingHorizontal: 2,
                        borderRadius: 20,
                      }}
                    >
                      {estado}
                    </Text>
                  </View>
                  <View style={{ rowGap: 2 }}>
                    <View style={{ flexDirection: 'row', columnGap: 3, alignItems: 'center' }}>
                      <Text style={{ fontFamily: BOLD_BODY_FONT }}>
                        {nombre} {apellido}
                      </Text>
                      <MaterialCommunityIcons
                        name={
                          genero === 'Masculino'
                            ? 'gender-male'
                            : 'gender-female'
                        }
                        size={14}
                        color={genero === 'Masculino' ? '#007AFF' : '#FF1493'}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        columnGap: 2,
                        alignItems: 'center',
                      }}
                    >
                      <MaterialCommunityIcons
                        name="email-check-outline"
                        size={14}
                        color={GRAY_COLOR_DARK}
                      />
                      <Text style={{ fontFamily: BODY_FONT, fontSize: 12 }}>
                        {email}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        columnGap: 2,
                        alignItems: 'center',
                      }}
                    >
                      <MaterialCommunityIcons
                        name="home-outline"
                        size={14}
                        color={GRAY_COLOR_DARK}
                      />
                      <Text style={{ fontFamily: BODY_FONT, fontSize: 12 }}>
                        {direccion ?? 'Dirección no registrada'}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        columnGap: 2,
                        alignItems: 'center',
                      }}
                    >
                      <MaterialCommunityIcons
                        name="calendar"
                        size={14}
                        color={GRAY_COLOR_DARK}
                      />
                      <Text style={{ fontFamily: BODY_FONT, fontSize: 12 }}>
                        Registrado el{' '}
                        {new Date(createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                        })}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={{ rowGap: 5 }}>
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
                      backgroundColor: isActive ? RED_COLOR : GREEN_COLOR,
                      borderRadius: 5,
                      padding: 2,
                      borderBottomWidth: 2,
                      borderRightWidth: 2,
                      borderColor: isActive ? RED_COLOR_DARK : GREEN_COLOR_DARK,
                    }}
                    onPress={() => {
                      isActive
                        ? deleteClientAccount(_id)
                        : activateClientAccount(_id);
                    }}
                  >
                    <MaterialCommunityIcons
                      name={isActive ? 'account-lock' : 'account-lock-open'}
                      size={20}
                      color="white"
                    />
                  </Pressable>
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
                <MaterialCommunityIcons name="account-off" size={30} />
                <Text style={{ fontFamily: BODY_FONT }}>
                  No se encontraron clientes, intente más tarde.
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

export default function AdminClients() {
  return (
    <ClientsProvider>
      <Clients />
    </ClientsProvider>
  );
}
