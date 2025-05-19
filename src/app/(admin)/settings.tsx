import { AdminHeader } from '@/components/AdminHeader';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'expo-router';
import { Button, ScrollView, View } from 'react-native';

export default function AdminSettings() {
  const router = useRouter();
  const { logout } = useAuthStore();

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{ paddingHorizontal: 25, rowGap: 10 }}>
        <AdminHeader showSearchBar={false} />
        <Button
          title="Cerrar sesión"
          color="red"
          onPress={() => {
            logout();
            router.push('/(auth)/login');
          }}
        />
      </View>
    </ScrollView>
  );
}
