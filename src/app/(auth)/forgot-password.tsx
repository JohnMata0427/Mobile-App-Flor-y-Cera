import { Button } from '@/components/Button';
import { InputField } from '@/components/fields/InputField';
import { globalStyles } from '@/globalStyles';
import { forgotPasswordRequest } from '@/services/AuthService';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, Image, ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ForgotPasswordScreen() {
  const { top } = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async ({ email }: any) => {
    setIsLoading(true);
    const { msg, ok } = await forgotPasswordRequest(email);

    Alert.alert('Mensaje del sistema', msg, [
      {
        text: 'Aceptar',
        onPress: () => {
          if (ok) {
            router.push({
              pathname: '/(auth)/recovery-password',
              params: { email },
            });
          }
        },
      },
    ]);
    setIsLoading(false);
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
            <Text style={globalStyles.title}>Recupera tu contraseña</Text>
            <Text style={globalStyles.subtitle}>
              Ingresa tu correo electrónico para recibir el código de verificación.
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
            <View style={styles.footerContainer}>
              <Button
                label="Enviar código de verificación"
                icon="arrow-right"
                disabled={isLoading}
                onPress={handleSubmit(onSubmit)}
              />

              <Link href="/(auth)/register">
                <Text style={[globalStyles.bodyText, styles.registerText]}>
                  ¿No tienes cuenta?
                  <Text style={globalStyles.link}> Crea una cuenta</Text>
                </Text>
              </Link>

              <Link href="/(auth)/login">
                <Text style={[globalStyles.bodyText, styles.registerText]}>
                  ¿Ya tienes cuenta?
                  <Text style={globalStyles.link}> Inicia sesión</Text>
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
  registerText: {
    textAlign: 'center',
  },
});
