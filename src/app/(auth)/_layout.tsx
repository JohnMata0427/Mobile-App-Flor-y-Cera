import { type NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { Stack } from 'expo-router';

const screenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  statusBarStyle: 'dark',
};

export default function AuthLayout() {
  return <Stack screenOptions={screenOptions} />;
}
