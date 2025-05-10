import { EXPO_PUBLIC_BACKEND_URL } from '@/constants/BackendUrl';
import { HEADING_FONT } from '@/constants/Fonts';
import { useRouter } from 'expo-router';
import { setItemAsync } from 'expo-secure-store';
import { Button, Image, ScrollView, Text, TextInput, View } from 'react-native';

export default function AdminSettings() {
  const router = useRouter();

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
          onPress={async () => {
            await setItemAsync('token', '');
            router.push('/(auth)/login');
            console.log('Logged out successfully!');
          }}
        />
        <Button
          title="Refresh Token"
          onPress={async () => {
            const response = await fetch(
              `${EXPO_PUBLIC_BACKEND_URL}/login`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  email: 'estefi2000ms2@gmail.com',
                  password: 'NuevaPass123$',
                }),
              },
            );
            const data = await response.json();
            if (response.ok) {
              setItemAsync('token', data.token);
              console.log('Token refreshed successfully!');
            } else {
              console.error('Failed to refresh token:', data.msg);
            }
          }}
        />
      </View>
    </ScrollView>
  );
}
