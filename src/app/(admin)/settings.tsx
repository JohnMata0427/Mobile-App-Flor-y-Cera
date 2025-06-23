import { TERTIARY_COLOR, TERTIARY_COLOR_DARK } from '@/constants/Colors';
import { useAuthStore } from '@/store/useAuthStore';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

export default function AdminSettings() {
  const router = useRouter();
  const { logout } = useAuthStore();

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{ paddingHorizontal: 25, rowGap: 10 }}>
        <Pressable
          onPress={() => {
            logout();
            router.push('/(auth)/login');
          }}
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            columnGap: 5,
            backgroundColor: TERTIARY_COLOR,
            borderBottomWidth: 2,
            borderRightWidth: 2,
            borderColor: TERTIARY_COLOR_DARK,
            paddingVertical: 10,
            borderRadius: 10,
            marginTop: 10,
          }}
        >
          <Text
            style={{
              color: 'white',
              fontWeight: 'bold',
            }}
          >
            Cerrar sesión
          </Text>
          <MaterialCommunityIcons name="logout" size={20} color="white" />
        </Pressable>
      </View>
    </ScrollView>
  );
}
