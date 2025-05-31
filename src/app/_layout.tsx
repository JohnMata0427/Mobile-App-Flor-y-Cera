import { BODY_FONT, BOLD_BODY_FONT, HEADING_FONT } from '@/constants/Fonts';
import { useAuthStore } from '@/store/useAuthStore';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

export default function RootLayout() {
  const { isAuthenticated, isAdmin, checkAuth } = useAuthStore();
  const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;

  useFonts({
    [HEADING_FONT]: require('@/assets/fonts/PlayfairDisplay-Black.ttf'),
    [BODY_FONT]: require('@/assets/fonts/PontanoSans-Regular.ttf'),
    [BOLD_BODY_FONT]: require('@/assets/fonts/PontanoSans-Bold.ttf'),
  });

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false, navigationBarColor: '#fff' }}>
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Protected guard={isAdmin}>
          <Stack.Screen name="(admin)" />
        </Stack.Protected>

        <Stack.Screen name="(client)" />
      </Stack.Protected>

      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
}
