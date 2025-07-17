import LoginScreen from '@/app/(auth)/login';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const wrapAllProviders = (children: React.ReactNode) => {
  return <SafeAreaProvider>{children}</SafeAreaProvider>;
};

describe('Pantalla de autenticación', () => {
  let screen: ReturnType<typeof render>;

  beforeEach(() => {
    screen = render(<LoginScreen />, {
      wrapper: wrapAllProviders,
    });
  });

  test('Debería renderizar la pantalla de inicio de sesión', () => {
    expect(screen.toJSON()).toMatchSnapshot();
  });

  test('Debería iniciar sesión con las credenciales', async () => {
    const { findByTestId } = screen;

    const emailInput = await findByTestId('input-field-email');
    const passwordInput = await findByTestId('input-field-password');

    const loginButton = await findByTestId('button-login');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password');
    fireEvent.press(loginButton);
  });
});
