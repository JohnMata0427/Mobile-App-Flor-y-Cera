import { type NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { Stack } from 'expo-router';

const screenOptions: NativeStackNavigationOptions = {
	headerShown: false,
	statusBarStyle: 'dark',
	animation: 'none',
};

export default function WelcomeLayout() {
	return <Stack screenOptions={screenOptions} />;
}
