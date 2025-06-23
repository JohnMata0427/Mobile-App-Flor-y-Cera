import { Button } from '@/components/Button';
import { InputField } from '@/components/fields/InputField';
import { PickerField } from '@/components/fields/PickerField';
import {
  GRAY_COLOR,
  GRAY_COLOR_DARK,
  GRAY_COLOR_LIGHT,
  SECONDARY_COLOR_DARK,
} from '@/constants/Colors';
import { BODY_FONT, BOLD_BODY_FONT } from '@/constants/Fonts';
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (form: any) => {};

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <ImageBackground
        style={{ paddingTop: top * 4, flex: 1 }}
        source={require('@/assets/bg-auth.jpg')}
      >
        <View style={styles.loginContainer}>
          <View style={[styles.headerContainer, { marginBottom: top }]}>
            <Image
              source={require('@/assets/images/icon.png')}
              style={styles.logoImage}
            />
            <Text style={styles.headerTitle}>Registro a Flor & Cera</Text>
            <Text style={styles.headerSubtitle}>
              Descubre la magia de Flor & Cera, donde la naturaleza y la creatividad se
              unen para ofrecerte una experiencia única
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
              rules={{
                required: 'El género es requerido',
              }}
              icon="gender-male-female"
              label="Género"
              options={[
                { label: 'Masculino', value: 'Masculino' },
                { label: 'Femenino', value: 'Femenino' },
              ]}
              onSelect={value => console.log(value)}
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

            <View style={styles.rowInputs}>
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
                autoComplete="new-password"
                textContentType="newPassword"
                secureTextEntry={!showPassword}
                showPasswordIcon={
                  <Pressable
                    onPress={() => setShowPassword(prev => !prev)}
                    style={styles.iconRight}
                  >
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
                }}
                icon="key"
                label="Confirmar contraseña"
                placeholder="••••••••••"
                error={errors.confirmPassword?.message as string}
                autoComplete="new-password"
                textContentType="newPassword"
                secureTextEntry={!showPassword}
                showPasswordIcon={
                  <Pressable
                    onPress={() => setShowPassword(prev => !prev)}
                    style={styles.iconRight}
                  >
                    <MaterialCommunityIcons
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={20}
                      color={GRAY_COLOR_DARK}
                    />
                  </Pressable>
                }
              />
            </View>

            <View style={styles.footerContainer}>
              {message && <Text style={styles.errorMessageText}>{message}</Text>}

              <Button
                label="Crear una cuenta"
                icon="account-plus"
                disabled={isLoading}
                onPress={handleSubmit(onSubmit)}
              />
            </View>

            <Text style={styles.anotherMethodText}>O puedes registrarte con</Text>

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

            <Link href="/(auth)/login">
              <Text style={styles.registerText}>
                ¿Ya tienes una cuenta?
                <Text style={styles.registerLinkText}> Inicia sesión</Text>
              </Text>
            </Link>
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
    padding: 35,
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
    fontSize: 20,
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
  rowInputs: {
    flexDirection: 'row',
    columnGap: 10,
  },
  rowGap: {
    rowGap: 10,
  },
  registerText: {
    fontFamily: BODY_FONT,
    color: GRAY_COLOR,
    fontSize: 12,
    textAlign: 'center',
  },
  registerLinkText: {
    color: SECONDARY_COLOR_DARK,
    fontWeight: 'bold',
  },
  footerContainer: {
    rowGap: 10,
    marginTop: 15,
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
    fontSize: 12,
    textAlign: 'right',
  },
  anotherMethodText: {
    color: GRAY_COLOR_DARK,
    fontSize: 12,
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
