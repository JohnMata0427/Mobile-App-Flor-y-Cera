import { Button } from '@/components/Button';
import { InputField } from '@/components/fields/InputField';
import { GRAY_COLOR_DARK, GRAY_COLOR_LIGHT } from '@/constants/Colors';
import { globalStyles } from '@/globalStyles';
import { useAuthStore } from '@/store/useAuthStore';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Link } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Login() {
  const { top } = useSafeAreaInsets();
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (form: any) => {
    setLoading(true);
    const { msg } = await login(form);
    setMessage(msg);
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={globalStyles.scrollViewContent}>
      <ImageBackground
        style={[styles.imageBackground, { paddingTop: top * 4 }]}
        source={require('@/assets/bg-auth.jpg')}
      >
        <View style={globalStyles.container}>
          <View style={[styles.headerContainer, { marginBottom: top * 1.5 }]}>
            <Image source={require('@/assets/logo.png')} style={globalStyles.logo} />
            <Text style={globalStyles.title}>Bienvenido a Flor & Cera</Text>
            <Text style={globalStyles.subtitle}>
              Descubre la magia de Flor & Cera, donde la naturaleza y la creatividad se unen para
              ofrecerte una experiencia única
            </Text>
          </View>
          <View style={styles.bodyContainer}>
            <InputField
              control={control}
              name="email"
              rules={{
                required: 'El correo electrónico es requerido',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: 'El correo electrónico no es válido',
                },
              }}
              icon="email"
              label="Correo electrónico"
              placeholder="correo@ejemplo.com"
              error={errors.email?.message as string}
              autoComplete="email"
              autoCapitalize="none"
              textContentType="emailAddress"
              keyboardType="email-address"
            />

            <InputField
              control={control}
              name="password"
              rules={{
                required: 'La contraseña es requerida',
              }}
              icon="key"
              label="Contraseña"
              placeholder="••••••••••••••••••••"
              error={errors.password?.message as string}
              autoComplete="password"
              autoCapitalize="none"
              textContentType="password"
              secureTextEntry={!showPassword}
              passwordIcon={
                <Pressable onPress={() => setShowPassword(prev => !prev)} style={styles.iconRight}>
                  <MaterialCommunityIcons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color={GRAY_COLOR_DARK}
                  />
                </Pressable>
              }
            />

            <Link href="/forgot-password">
              <Text style={[globalStyles.link, styles.forgotPasswordText]}>
                ¿Olvidaste tu contraseña?
              </Text>
            </Link>
            <View style={styles.footerContainer}>
              {message && <Text style={globalStyles.errorText}>{message}</Text>}

              <Button
                label="Iniciar sesión"
                icon="login"
                disabled={loading}
                onPress={handleSubmit(onSubmit)}
                testID="button-login"
              />

              {/* <Text style={styles.anotherMethodText}>O puedes iniciar sesión con</Text>

              <View style={styles.methodsContainer}>
                <Pressable style={styles.methodButton}>
                  <Image
                    source={require('@/assets/google-logo.png')}
                    style={styles.methodIcon}
                    resizeMode="contain"
                  />
                </Pressable>
                <Pressable style={styles.methodButton}>
                  <Image
                    source={require('@/assets/fb-logo.png')}
                    style={styles.methodIcon}
                    resizeMode="contain"
                  />
                </Pressable>
                <Pressable style={styles.methodButton}>
                  <Image
                    source={require('@/assets/apple-logo.png')}
                    style={styles.methodIcon}
                    resizeMode="contain"
                  />
                </Pressable>
              </View> */}

              <Link href="/(auth)/register">
                <Text style={[globalStyles.bodyText, styles.registerText]}>
                  ¿No tienes cuenta?
                  <Text style={globalStyles.link}> Crea una cuenta</Text>
                </Text>
              </Link>
            </View>
          </View>
        </View>
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
  },
  headerContainer: {
    rowGap: 3,
  },
  bodyContainer: {
    rowGap: 10,
  },
  footerContainer: {
    rowGap: 10,
  },
  iconRight: {
    position: 'absolute',
    insetBlock: 0,
    right: 8,
    justifyContent: 'center',
  },
  forgotPasswordText: {
    textAlign: 'right',
  },
  registerText: {
    textAlign: 'center',
  },
  anotherMethodText: {
    color: GRAY_COLOR_DARK,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  methodIcon: {
    width: 25,
    height: 25,
  },
  methodsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    columnGap: 20,
    borderTopColor: GRAY_COLOR_LIGHT,
    borderTopWidth: 1,
    paddingTop: 10,
  },
  methodButton: {
    borderRadius: 50,
    borderColor: GRAY_COLOR_LIGHT,
    borderWidth: 1,
    padding: 5,
  },
});