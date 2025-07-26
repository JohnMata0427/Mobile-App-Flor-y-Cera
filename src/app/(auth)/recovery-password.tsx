import { Button } from '@/components/Button';
import { InputField } from '@/components/fields/InputField';
import { GRAY_COLOR_DARK } from '@/constants/Colors';
import { globalStyles } from '@/globalStyles';
import { resetPasswordRequest } from '@/services/AuthService';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image, ImageBackground } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ForgotPasswordScreen() {
  const { top } = useSafeAreaInsets();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      nuevaPassword: '',
      confirmarPassword: '',
      codigoRecuperacion: '',
    },
  });

  const onSubmit = async ({ nuevaPassword, codigoRecuperacion }: any) => {
    setIsLoading(true);

    const { msg, ok } = await resetPasswordRequest(codigoRecuperacion, {
      email,
      nuevaPassword,
    });

    Alert.alert('Mensaje del sistema', msg, [{ text: 'Aceptar' }]);
    
    if (ok) router.replace('/(auth)/login');

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
            <Text style={globalStyles.title}>Restablece tu contraseña</Text>
            <Text style={globalStyles.subtitle}>
              Revise su correo electrónico para obtener el código de recuperación.
            </Text>
          </View>
          <View style={styles.bodyContainer}>
            <InputField
              control={control}
              name="nuevaPassword"
              rules={{
                required: 'La nueva contraseña es requerida',
                minLength: {
                  value: 8,
                  message: 'La nueva contraseña debe tener al menos 8 caracteres',
                },
                maxLength: {
                  value: 20,
                  message: 'La nueva contraseña no puede tener más de 20 caracteres',
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
                  message:
                    'La nueva contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial',
                },
              }}
              icon="lock"
              label="Nueva contraseña"
              placeholder="Ingresa tu nueva contraseña"
              error={errors.nuevaPassword?.message as string}
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
            <InputField
              control={control}
              name="confirmarPassword"
              rules={{
                required: 'La confirmación de la contraseña es requerida',
                deps: 'nuevaPassword',
                validate: (value: string) =>
                  value === getValues('nuevaPassword') || 'Las contraseñas no coinciden',
              }}
              icon="lock"
              label="Confirmar contraseña"
              placeholder="Confirma tu nueva contraseña"
              error={errors.confirmarPassword?.message as string}
              secureTextEntry={!showConfirmPassword}
              passwordIcon={
                <Pressable
                  onPress={() => setShowConfirmPassword(prev => !prev)}
                  style={styles.iconRight}
                >
                  <MaterialCommunityIcons
                    name={showConfirmPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color={GRAY_COLOR_DARK}
                  />
                </Pressable>
              }
            />
            <InputField
              control={control}
              name="codigoRecuperacion"
              rules={{
                required: 'El código de recuperación es requerido',
                pattern: {
                  value: /^\d{6}$/,
                  message: 'El código de recuperación debe ser un número de 6 dígitos',
                },
              }}
              icon="key"
              label="Código de recuperación"
              placeholder="Ingresa el código de recuperación"
              error={errors.codigoRecuperacion?.message as string}
              keyboardType="numeric"
              textContentType="oneTimeCode"
            />
            <Button
              label="Restablecer contraseña"
              icon="check-all"
              disabled={isLoading}
              onPress={handleSubmit(onSubmit)}
            />
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
  iconRight: {
    position: 'absolute',
    insetBlock: 0,
    right: 8,
    justifyContent: 'center',
  },
});
