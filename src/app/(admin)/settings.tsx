import { HEADING_FONT } from '@/constants/Fonts';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, Image, ScrollView, Text, TextInput, View } from 'react-native';

export default function AdminSettings() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { logout, login } = useAuthStore();

  const refreshTokenRequest = async () => {
    setIsLoading(true);
    const { msg } = await login({
      email: 'estefi2000ms2@gmail.com',
      password: 'NuevaPass123$',
    });
    console.log(msg);
    setIsLoading(false);
  };

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
          placeholder="Buscar..."
        />
        <Button
          title="Cerrar sesión"
          color="red"
          onPress={() => {
            logout();
            router.push('/(auth)/login');
          }}
        />
        <Button
          title={isLoading ? 'Cargando...' : 'Refrescar token'}
          onPress={refreshTokenRequest}
        />
      </View>
    </ScrollView>
  );
}
