import { BODY_FONT, BOLD_BODY_FONT, HEADING_FONT } from '@/constants/Fonts';
import { useAuthStore } from '@/store/useAuthStore';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

export default function RootLayout() {
  const { isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  const [loaded] = useFonts({
    [HEADING_FONT]: require('@/assets/fonts/PlayfairDisplay-Black.ttf'),
    [BODY_FONT]: require('@/assets/fonts/PontanoSans-Regular.ttf'),
    [BOLD_BODY_FONT]: require('@/assets/fonts/PontanoSans-Bold.ttf'),
  });

  if (!loaded) return null;

  return (
    <>
      <StatusBar style="dark" />

      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Protected guard={!isAuthenticated}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>

        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen name="(admin)" />
        </Stack.Protected>

        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}
