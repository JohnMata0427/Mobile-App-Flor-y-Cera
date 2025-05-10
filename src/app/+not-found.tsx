import { Link, Stack } from 'expo-router';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <Link href="/">Regresar a la pantalla principal</Link>
    </>
  );
}
