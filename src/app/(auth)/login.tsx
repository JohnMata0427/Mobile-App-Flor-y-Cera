import { Button } from '@/components/Button';
import { InputField } from '@/components/fields/InputField';
import {
  GRAY_COLOR,
  GRAY_COLOR_DARK,
  GRAY_COLOR_LIGHT,
  SECONDARY_COLOR_DARK,
} from '@/constants/Colors';
import { BODY_FONT, BOLD_BODY_FONT } from '@/constants/Fonts';
import { useAuthStore } from '@/store/useAuthStore';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Link, useRouter } from 'expo-router';
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
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (form: any) => {
    setLoading(true);
    const { msg, success, isAdmin } = await login(form);
    setMessage(msg);

    setLoading(false);

    if (success) {
      router.push(isAdmin ? '/(admin)/dashboard' : '/(client)/home');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <ImageBackground
        style={{ paddingTop: top * 4, flex: 1 }}
        source={require('@/assets/bg-auth.jpg')}
      >
        <View style={styles.loginContainer}>
          <View style={[styles.headerContainer, { marginBottom: top * 1.5 }]}>
            <Image source={require('@/assets/images/icon.png')} style={styles.logoImage} />
            <Text style={styles.headerTitle}>Bienvenido a Flor & Cera</Text>
            <Text style={styles.headerSubtitle}>
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
              placeholder="••••••••••"
              error={errors.password?.message as string}
              autoComplete="password"
              autoCapitalize="none"
              textContentType="password"
              secureTextEntry={!showPassword}
              showPasswordIcon={
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
              <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
            </Link>
            <View style={styles.footerContainer}>
              {message && <Text style={styles.errorMessageText}>{message}</Text>}

              <Button
                label="Iniciar sesión"
                icon="login"
                disabled={loading}
                onPress={handleSubmit(onSubmit)}
              />

              <Text style={styles.anotherMethodText}>O puedes iniciar sesión con</Text>

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
              </View>

              <Link href="/(auth)/register">
                <Text style={styles.registerText}>
                  ¿No tienes cuenta?
                  <Text style={styles.registerLinkText}> Crea una cuenta</Text>
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
  scrollViewContent: {
    flexGrow: 1,
  },
  loginContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  headerContainer: {
    rowGap: 3,
  },
  logoImage: {
    width: 80,
    height: 80,
    alignSelf: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: GRAY_COLOR_DARK,
  },
  headerSubtitle: {
    fontFamily: BODY_FONT,
    color: GRAY_COLOR,
    textAlign: 'center',
    fontSize: 12,
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
    color: SECONDARY_COLOR_DARK,
    fontWeight: 'bold',
    // fontSize: 12,
    textAlign: 'right',
  },
  registerText: {
    color: GRAY_COLOR_DARK,
    fontFamily: BODY_FONT,
    // fontSize: 12,
    textAlign: 'center',
  },
  registerLinkText: {
    color: SECONDARY_COLOR_DARK,
    fontWeight: 'bold',
  },
  anotherMethodText: {
    color: GRAY_COLOR_DARK,
    // fontSize: 12,
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
  errorMessageText: {
    fontFamily: BOLD_BODY_FONT,
    color: 'red',
    fontSize: 12,
    textAlign: 'center',
  },
});
