import { PRIMARY_COLOR_EXTRA_LIGHT } from '@/constants/Colors';
import { type NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { Stack } from 'expo-router';

const screenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  contentStyle: {
    backgroundColor: PRIMARY_COLOR_EXTRA_LIGHT,
  },
};

export default function CartLayout() {
  return <Stack screenOptions={screenOptions} />;
}
