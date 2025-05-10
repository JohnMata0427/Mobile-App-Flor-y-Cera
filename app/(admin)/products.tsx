import { ProductModal } from '@/components/ProductModal';
import {
  PRIMARY_COLOR,
  SECONDARY_COLOR,
  TERTIARY_COLOR,
} from '@/constants/Colors';
import { BODY_FONT, BOLD_BODY_FONT, HEADING_FONT } from '@/constants/Fonts';
import type { Product } from '@/interfaces/Product';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { getItemAsync } from 'expo-secure-store';
import { useEffect, useState } from 'react';
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

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(0);

  useEffect(() => {
    (async () => {
      const response = await fetch(
        'https://tesis-ecommerce.onrender.com/api/productos?page=1&limit=10',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${await getItemAsync('token')}`,
          },
        },
      );
      const data = await response.json();
      setProducts(data.productos);
      setIsLoading(false);
    })();
  }, [refreshing]);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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
            isVisible={modalVisible}
            setIsVisible={setModalVisible}
          />
          <Pressable
            style={{
              backgroundColor: PRIMARY_COLOR,
              padding: 10,
              borderRadius: 20,
              flexDirection: 'row',
              columnGap: 5,
            }}
            onPress={() => setModalVisible(true)}
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
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={() => {
                setIsLoading(true);
                setRefreshing(prev => prev++);
              }}
              colors={[PRIMARY_COLOR]}
            />
          }
          numColumns={2}
          columnWrapperStyle={{ columnGap: 10 }}
          contentContainerStyle={{ rowGap: 10 }}
          keyExtractor={({ _id }) => _id}
          scrollEnabled={false}
          renderItem={({ item: { imagen, nombre, precio, stock } }) => (
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 10,
                overflow: 'hidden',
                flex: 1,
              }}
            >
              <Image
                source={{ uri: imagen }}
                style={{
                  width: '100%',
                  height: 150,
                }}
              />
              <View
                style={{
                  rowGap: 5,
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                }}
              >
                <Text style={{ fontFamily: BOLD_BODY_FONT }}>{nombre}</Text>
                <Text style={{ fontFamily: BODY_FONT, fontSize: 12 }}>
                  ${precio} USD
                </Text>
                <Text
                  style={{
                    fontFamily: BODY_FONT,
                    color: 'green',
                  }}
                >
                  • {stock} en stock
                </Text>
                <View style={{ flexDirection: 'row', columnGap: 5 }}>
                  <MaterialCommunityIcons
                    name="information"
                    size={24}
                    color={PRIMARY_COLOR}
                  />
                  <MaterialCommunityIcons
                    name="pencil"
                    size={24}
                    color={SECONDARY_COLOR}
                  />
                  <MaterialCommunityIcons
                    name="trash-can"
                    size={24}
                    color={TERTIARY_COLOR}
                  />
                </View>
              </View>
            </View>
          )}
        />
      </View>
    </ScrollView>
  );
}
