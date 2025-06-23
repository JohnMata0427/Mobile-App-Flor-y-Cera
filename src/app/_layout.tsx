import { Loading } from '@/components/Loading';
import { BODY_FONT, BOLD_BODY_FONT, HEADING_FONT } from '@/constants/Fonts';
import { useAuthStore } from '@/store/useAuthStore';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { useEffect } from 'react';

export default function RootLayout() {
  const { isAuthenticated, isAdmin, loading, checkAuth } = useAuthStore();

  const [loaded] = useFonts({
    [HEADING_FONT]: require('@/assets/fonts/PlayfairDisplay-Black.ttf'),
    [BODY_FONT]: require('@/assets/fonts/PontanoSans-Regular.ttf'),
    [BOLD_BODY_FONT]: require('@/assets/fonts/PontanoSans-Bold.ttf'),
  });

  useEffect(() => {
    checkAuth();
  }, []);

  if (!loaded || loading) {
    return <Loading />;
  }

  return (
    <Stack screenOptions={{ headerShown: false, statusBarStyle: 'dark' }}>
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(client)" />
      </Stack.Protected>

      <Stack.Protected guard={isAdmin}>
        <Stack.Screen name="(admin)" />
      </Stack.Protected>

      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
}
