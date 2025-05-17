import { HEADING_FONT } from '@/constants/Fonts';
import { getInvoicesRequest } from '@/services/InvoiceService';
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect } from 'react';
import { Image, ScrollView, Text, TextInput, View } from 'react-native';

export default function AdminInvoices() {
  const { token } = useAuthStore();
  useEffect(() => {
    (async () => {
      const { ventas } = await getInvoicesRequest(1, 10, token);
      console.log('Ventas:', ventas[0]);
    })();
  }, []);

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
      </View>
    </ScrollView>
  );
}
