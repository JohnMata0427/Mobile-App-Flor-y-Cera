import { BODY_FONT, BOLD_BODY_FONT, HEADING_FONT } from '@/constants/Fonts';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { getItemAsync } from 'expo-secure-store';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

export default function RootLayout() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    (async () => {
      setLoggedIn(!!(await getItemAsync('token')));
    })();
  }, []);

  const [loaded] = useFonts({
    [HEADING_FONT]: require('@/assets/fonts/PlayfairDisplay-Black.ttf'),
    [BODY_FONT]: require('@/assets/fonts/PontanoSans-Regular.ttf'),
    [BOLD_BODY_FONT]: require('@/assets/fonts/PontanoSans-Bold.ttf'),
  });

  if (!loaded) return null;

  return (
    <>
      <StatusBar hidden style="auto" />

      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="(admin)" />
        <Stack.Screen name="(auth)" />

        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" options={{ title: 'Not Found' }} />
      </Stack>
    </>
  );
}
