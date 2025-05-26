import { BODY_FONT, BOLD_BODY_FONT, HEADING_FONT } from '@/constants/Fonts';
import { useAuthStore } from '@/store/useAuthStore';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { useEffect } from 'react';

export default function RootLayout() {
  const { isAuthenticated, isAdmin, checkAuth, logout } = useAuthStore();

  useEffect(() => {
    //logout();
    checkAuth();
  }, []);

  // useEffect(() => {
  //   LogRocket.init('wdvgsr/flor-and-cera-app', {
  //     updateId: isEmbeddedLaunch ? null : updateId,
  //     expoChannel: channel,
  //   });
  // }, []);

  const [loaded] = useFonts({
    [HEADING_FONT]: require('@/assets/fonts/PlayfairDisplay-Black.ttf'),
    [BODY_FONT]: require('@/assets/fonts/PontanoSans-Regular.ttf'),
    [BOLD_BODY_FONT]: require('@/assets/fonts/PontanoSans-Bold.ttf'),
  });

  if (!loaded) return null;

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
