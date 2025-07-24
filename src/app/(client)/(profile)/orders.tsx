import { InvoiceAccordion } from '@/components/cards/InvoiceAccordion';
import { Loading } from '@/components/Loading';
import { PRIMARY_COLOR_DARK } from '@/constants/Colors';
import { globalStyles } from '@/globalStyles';
import type { Invoice } from '@/interfaces/Invoice';
import { getClientInvoicesRequest } from '@/services/InvoiceService';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ClientOrdersPage() {
  const { top } = useSafeAreaInsets();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const { ok, ventas } = await getClientInvoicesRequest();

        if (ok) setInvoices(ventas.filter((v: Invoice) => v.estado === 'pendiente'));
      } catch {
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          backgroundColor: PRIMARY_COLOR_DARK,
          paddingTop: top + 10,
          paddingBottom: 10,
          paddingHorizontal: 10,
        }}
      >
        <Pressable
          onPress={() => {
            router.replace('/(client)/(profile)');
          }}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
        </Pressable>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Tus Pedidos Pendientes</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {loading ? (
          <Loading />
        ) : (
          <FlatList
            data={invoices}
            keyExtractor={({ _id }) => _id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={globalStyles.centeredContainer}>
                <Text style={globalStyles.bodyText}>No tienes pedidos pendientes.</Text>
              </View>
            }
            contentContainerStyle={styles.flatListContent}
            renderItem={({ item }) => <InvoiceAccordion invoice={item} />}
          />
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  flatListContent: {
    rowGap: 10,
  },
});
