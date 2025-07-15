import { Loading } from '@/components/Loading';
import { BODY_FONT, BOLD_BODY_FONT, HEADING_FONT } from '@/constants/Fonts';
import { useAuthStore } from '@/store/useAuthStore';
import { type NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { useEffect } from 'react';

const screenOptions: NativeStackNavigationOptions = { headerShown: false, statusBarStyle: 'dark' };

export default function RootLayout() {
  const { checkAuth, loading } = useAuthStore();

  const [loaded] = useFonts({
    [HEADING_FONT]: require('@/assets/fonts/PlayfairDisplay-Black.ttf'),
    [BODY_FONT]: require('@/assets/fonts/PontanoSans-Regular.ttf'),
    [BOLD_BODY_FONT]: require('@/assets/fonts/PontanoSans-Bold.ttf'),
  });

  useEffect(() => {
    checkAuth();
  }, []);

  if (!loaded || loading) return <Loading />;

  return <Stack screenOptions={screenOptions} />;
}
