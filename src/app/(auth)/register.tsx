import { Button } from '@/components/Button';
import { InputField } from '@/components/fields/InputField';
import { PickerField } from '@/components/fields/PickerField';
import { GRAY_COLOR_DARK, GRAY_COLOR_LIGHT } from '@/constants/Colors';
import { globalStyles } from '@/globalStyles';
import { registerClientRequest } from '@/services/AuthService';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Alert,
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      nombre: '',
      apellido: '',
      genero: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (form: any) => {
    try {
      setIsLoading(true);
      const { msg, ok } = await registerClientRequest(form);

      Alert.alert('Mensaje del sistema', msg, [
        {
          text: 'Aceptar',
          onPress: () => {
            if (ok) {
              router.push('/(auth)/login');
            }
          },
        },
      ]);
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={globalStyles.scrollViewContent}>
      <ImageBackground
        style={[styles.imageBackground, { paddingTop: top * 4 }]}
        source={require('@/assets/bg-auth.jpg')}
      >
        <View style={globalStyles.container}>
          <View style={[styles.headerContainer, { marginBottom: top }]}>
            <Image source={require('@/assets/logo.png')} style={globalStyles.logo} />
            <Text style={globalStyles.title}>Registro a Flor & Cera</Text>
            <Text style={globalStyles.subtitle}>
              Descubre la magia de Flor & Cera, donde la naturaleza y la creatividad se unen para
              ofrecerte una experiencia única
            </Text>
          </View>
          <View style={styles.bodyContainer}>
            <View style={styles.rowInputs}>
              <InputField
                control={control}
                name="nombre"
                rules={{
                  required: 'El nombre es requerido',
                  minLength: {
                    value: 3,
                    message: 'El nombre debe tener al menos 3 caracteres',
                  },
                  maxLength: {
                    value: 20,
                    message: 'El nombre no puede exceder los 20 caracteres',
                  },
                  pattern: {
                    value: /^[a-zA-ZÀ-ÿ\s]+$/,
                    message: 'El nombre solo puede contener letras y espacios',
                  },
                }}
                icon="account"
                label="Nombre"
                placeholder="Juan"
                error={errors.nombre?.message as string}
                autoComplete="name"
                autoCapitalize="words"
                textContentType="name"
                keyboardType="default"
              />
              <InputField
                control={control}
                name="apellido"
                rules={{
                  required: 'El apellido es requerido',
                  minLength: {
                    value: 3,
                    message: 'El apellido debe tener al menos 3 caracteres',
                  },
                  maxLength: {
                    value: 20,
                    message: 'El apellido no puede exceder los 20 caracteres',
                  },
                  pattern: {
                    value: /^[a-zA-ZÀ-ÿ\s]+$/,
                    message: 'El apellido solo puede contener letras y espacios',
                  },
                }}
                icon="account"
                label="Apellido"
                placeholder="Pérez"
                error={errors.apellido?.message as string}
                autoComplete="family-name"
                autoCapitalize="words"
                textContentType="familyName"
              />
            </View>

            <PickerField
              control={control}
              name="genero"
              rules={{ required: 'El género es requerido' }}
              icon="gender-male-female"
              label="Género"
              options={[
                { optionLabel: 'Masculino', optionValue: 'Masculino' },
                { optionLabel: 'Femenino', optionValue: 'Femenino' },
              ]}
              prompt="Selecciona un género"
              error={errors.genero?.message as string}
            />

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
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
                  message:
                    'La contraseña debe tener entre 8 y 20 caracteres, con al menos una mayúscula, una minúscula, un número y un carácter especial',
                },
              }}
              icon="key"
              label="Contraseña"
              placeholder="••••••••••"
              error={errors.password?.message as string}
              autoComplete="new-password"
              textContentType="newPassword"
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
              name="confirmPassword"
              rules={{
                required: 'La contraseña es requerida',
                deps: 'password',
                validate: (value: string) =>
                  value === getValues('password') || 'Las contraseñas no coinciden',
              }}
              icon="key"
              label="Confirmar contraseña"
              placeholder="••••••••••"
              error={errors.confirmPassword?.message as string}
              autoComplete="new-password"
              textContentType="newPassword"
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

            <Button
              label="Crear una cuenta"
              icon="account-plus"
              disabled={isLoading}
              onPress={handleSubmit(onSubmit)}
            />

            {/* <Text style={styles.anotherMethodText}>O puedes registrarte con</Text>

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

            <Link href="/(auth)/login">
              <Text style={[globalStyles.bodyText, styles.registerText]}>
                ¿Ya tienes una cuenta?
                <Text style={globalStyles.link}> Inicia sesión</Text>
              </Text>
            </Link>
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
  rowInputs: {
    flexDirection: 'row',
    columnGap: 10,
  },
  iconRight: {
    position: 'absolute',
    insetBlock: 0,
    right: 8,
    justifyContent: 'center',
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
  registerText: {
    textAlign: 'center',
  },
});
