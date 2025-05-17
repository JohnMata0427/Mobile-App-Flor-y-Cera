import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        statusBarStyle: 'light',
      }}
    >
      <Stack.Screen name="login" />
    </Stack>
  );
}
