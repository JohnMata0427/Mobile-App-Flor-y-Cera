import LoginScreen from '@/app/(auth)/login';
import { render } from '@testing-library/react-native';
import type { ReactNode } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const AllTheProviders = ({ children }: { children: ReactNode }) => {
  return <SafeAreaProvider>{children}</SafeAreaProvider>;
};

describe('Debería cargar la página de login', () => {
  test('Debería mostrar el texto de bienvenida', () => {
    const component = render(<LoginScreen />, { wrapper: AllTheProviders });

    component.getByText('Crea una cuenta');
  });
});
