import { PlayfairDisplay, PontanoSans } from '@/constants/Fonts';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

const isAdmin = true;

export default function RootLayout() {
  const [loaded] = useFonts({
    [PlayfairDisplay.regular]: require('@/assets/fonts/PlayfairDisplay-Regular.ttf'),
    [PlayfairDisplay.bold]: require('@/assets/fonts/PlayfairDisplay-Bold.ttf'),
    [PlayfairDisplay.black]: require('@/assets/fonts/PlayfairDisplay-Black.ttf'),
    [PontanoSans.regular]: require('@/assets/fonts/PontanoSans-Regular.ttf'),
    [PontanoSans.semibold]: require('@/assets/fonts/PontanoSans-SemiBold.ttf'),
    [PontanoSans.bold]: require('@/assets/fonts/PontanoSans-Bold.ttf'),
  });

  if (!loaded) return null;

  return (
    <>
      <StatusBar style="auto" />

      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="(auth)" />

        <Stack.Protected guard={isAdmin}>
          <Stack.Screen name="(admin)" />
        </Stack.Protected>

        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" options={{ title: 'Not Found' }} />
      </Stack>
    </>
  );
}
