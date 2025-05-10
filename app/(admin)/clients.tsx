import { TERTIARY_COLOR } from '@/constants/Colors';
import { BODY_FONT, BOLD_BODY_FONT, HEADING_FONT } from '@/constants/Fonts';
import type { Client } from '@/interfaces/Client';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { getItemAsync } from 'expo-secure-store';
import { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function AdminUsers() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(0);

  useEffect(() => {
    (async () => {
      const response = await fetch(
        'https://tesis-ecommerce.onrender.com/api/admin/clientes?page=1&limit=10',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${await getItemAsync('token')}`,
          },
        },
      );
      const data = await response.json();
      setClients(data.clientes);
      setIsLoading(false);
    })();
  }, [refreshing]);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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
          style={{ minHeight: '100%' }}
          showsVerticalScrollIndicator={false}
          data={clients}
          scrollEnabled={false}
          contentContainerStyle={{ rowGap: 10 }}
          keyExtractor={({ _id }) => _id}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={() => {
                setIsLoading(true);
                setRefreshing(prev => prev++);
              }}
              colors={[TERTIARY_COLOR]}
            />
          }
          renderItem={({
            item: { nombre, apellido, email, genero, imagen },
          }) => (
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 15,
                padding: 20,
                rowGap: 5,
              }}
            >
              <View style={{ flexDirection: 'row', columnGap: 10 }}>
                <Image
                  source={{
                    uri:
                      imagen ??
                      'https://thumbs.dreamstime.com/b/default-avatar-profile-icon-social-media-user-image-gray-blank-silhouette-vector-illustration-305503988.jpg',
                  }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 50,
                    borderWidth: 2,
                    borderColor: TERTIARY_COLOR,
                  }}
                />
                <View>
                  <Text style={{ fontFamily: BODY_FONT }}>
                    {nombre} {apellido}
                    <MaterialCommunityIcons
                      name={
                        genero === 'Masculino' ? 'gender-male' : 'gender-female'
                      }
                      size={20}
                      color={TERTIARY_COLOR}
                    />
                  </Text>
                  <Text style={{ fontFamily: BOLD_BODY_FONT }}>{email}</Text>
                </View>
              </View>
              <MaterialCommunityIcons
                name="information"
                size={30}
                color={TERTIARY_COLOR}
                style={{ position: 'absolute', right: 15, top: 25 }}
              />
            </View>
          )}
        />
      </View>
    </ScrollView>
  );
}
