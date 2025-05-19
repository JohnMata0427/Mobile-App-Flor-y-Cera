import {
  GRAY_COLOR,
  GRAY_COLOR_DARK,
  PRIMARY_COLOR,
  PRIMARY_COLOR_DARK,
  SECONDARY_COLOR,
  SECONDARY_COLOR_DARK,
} from '@/constants/Colors';
import { BODY_FONT, BOLD_BODY_FONT } from '@/constants/Fonts';
import { useAuthStore } from '@/store/useAuthStore';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Login() {
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (form: any) => {
    setIsLoading(true);

    const { msg, success } = await login(form);

    setMessage(msg);
    setIsLoading(false);

    if (success) router.push('/(admin)/dashboard');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <ImageBackground
        style={{ paddingTop: top * 3.5, flex: 1 }}
        source={require('@/assets/bg-auth.jpg')}
      >
        <View style={styles.loginContainer}>
          <View style={[styles.rowGapThree, { marginBottom: top * 1.5 }]}>
            <Image
              source={require('@/assets/images/icon.png')}
              style={styles.logoImage}
            />
            <Text style={styles.headerTitle}>Bienvenido a Flor & Cera</Text>
            <Text style={styles.headerSubtitle}>
              Descubre la magia de Flor & Cera, donde la naturaleza y la
              creatividad se unen para ofrecerte una experiencia única
            </Text>
          </View>
          <View style={styles.rowGapTen}>
            <Controller
              control={control}
              name="email"
              rules={{
                required: 'El correo electrónico es requerido',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: 'El formato del correo electrónico no es válido',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => {
                const { message = '' } = errors.email || {};
                const color = message ? 'red' : 'black';

                return (
                  <View style={styles.rowGapThree}>
                    <Text style={styles.labelText}>
                      Correo electrónico{' '}
                      <Text style={styles.requiredMark}>*</Text>
                    </Text>
                    <View>
                      <TextInput
                        style={[
                          styles.textInput,
                          { color, borderColor: color },
                        ]}
                        placeholder="correo@ejemplo.com"
                        placeholderTextColor={message ? 'red' : '#AFAFAF'}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        textContentType="emailAddress"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        selectionColor={PRIMARY_COLOR}
                      />
                      <MaterialCommunityIcons
                        style={styles.iconLeft}
                        name="email"
                        color={color}
                        size={24}
                      />
                    </View>
                    {message && (
                      <Text style={styles.messageText}>
                        {message as string}
                      </Text>
                    )}
                  </View>
                );
              }}
            />

            <Controller
              control={control}
              name="password"
              rules={{
                required: 'La contraseña es requerida',
              }}
              render={({ field: { onChange, onBlur, value } }) => {
                const { message = '' } = errors.password || {};
                const color = message ? 'red' : 'black';

                return (
                  <View style={styles.rowGapThree}>
                    <Text style={styles.labelText}>
                      Contraseña <Text style={styles.requiredMark}>*</Text>
                    </Text>
                    <View>
                      <TextInput
                        style={[
                          styles.textInput,
                          { color, borderColor: color },
                        ]}
                        placeholder="••••••••••"
                        placeholderTextColor={message ? 'red' : '#AFAFAF'}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        textContentType="password"
                        autoCapitalize="none"
                        autoCorrect={false}
                        selectionColor={PRIMARY_COLOR}
                        secureTextEntry={!showPassword}
                      />
                      <MaterialCommunityIcons
                        style={styles.iconLeft}
                        name="lock"
                        color={color}
                        size={24}
                      />
                      <Pressable
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.iconRight}
                      >
                        <MaterialCommunityIcons
                          name={showPassword ? 'eye' : 'eye-off'}
                          color={color}
                          size={24}
                        />
                      </Pressable>
                    </View>
                    {message && (
                      <Text style={styles.messageText}>
                        {message as string}
                      </Text>
                    )}
                  </View>
                );
              }}
            />

            <Link href="/login">
              <Text style={styles.forgotPasswordText}>
                ¿Olvidaste tu contraseña?
              </Text>
            </Link>
            <View style={styles.rowGapThree}>
              {message && <Text style={styles.messageText}>{message}</Text>}
              <Pressable
                onPress={handleSubmit(onSubmit)}
                style={styles.submitButton}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" size={21} />
                ) : (
                  <>
                    <Text style={styles.submitButtonText}>Iniciar sesión</Text>
                    <MaterialCommunityIcons
                      name="login"
                      size={20}
                      color="white"
                    />
                  </>
                )}
              </Pressable>
              <Pressable
                onPress={() => router.push('/(tabs)')}
                style={styles.registerButton}
              >
                <Text style={styles.submitButtonText}>Registrarse</Text>
                <MaterialCommunityIcons
                  name="account-plus"
                  size={20}
                  color="white"
                />
              </Pressable>
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
    padding: 35,
  },
  rowGapTen: {
    rowGap: 10,
  },
  rowGapThree: {
    rowGap: 3,
  },
  logoImage: {
    width: 100,
    height: 100,
    alignSelf: 'center',
  },
  headerTitle: {
    fontFamily: BOLD_BODY_FONT,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: GRAY_COLOR_DARK,
  },
  headerSubtitle: {
    fontFamily: BODY_FONT,
    color: GRAY_COLOR,
    textAlign: 'center',
  },
  labelText: {
    fontFamily: BOLD_BODY_FONT,
    fontSize: 14,
  },
  requiredMark: {
    color: 'red',
  },
  textInput: {
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    fontFamily: BODY_FONT,
  },
  iconLeft: {
    position: 'absolute',
    insetBlock: 0,
    left: 8,
    textAlignVertical: 'center',
  },
  iconRight: {
    position: 'absolute',
    insetBlock: 0,
    right: 8,
    justifyContent: 'center',
  },
  forgotPasswordText: {
    fontFamily: BOLD_BODY_FONT,
    fontWeight: 'bold',
    textAlign: 'right',
    color: SECONDARY_COLOR_DARK,
  },
  submitButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: 5,
    backgroundColor: PRIMARY_COLOR,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: PRIMARY_COLOR_DARK,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  registerButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: 5,
    backgroundColor: SECONDARY_COLOR,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: SECONDARY_COLOR_DARK,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
  },

  submitButtonText: {
    fontFamily: BOLD_BODY_FONT,
    color: 'white',
    fontSize: 16,
  },
  messageText: {
    fontFamily: BODY_FONT,
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});
