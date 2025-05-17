import { PRIMARY_COLOR, SECONDARY_COLOR } from '@/constants/Colors';
import { BODY_FONT, BOLD_BODY_FONT, HEADING_FONT } from '@/constants/Fonts';
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
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Login() {
  const router = useRouter();
  const { top } = useSafeAreaInsets();

  const { login } = useAuthStore();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const onSubmit = async (form: any) => {
    setIsLoading(true);

    const { msg, success } = await login(form);

    setMessage(msg);
    setIsLoading(false);

    if (success) router.push('/(admin)/dashboard');
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <ImageBackground
        style={{ paddingTop: top * 3.5 }}
        source={require('@/assets/bg-auth.png')}
      >
        <View
          style={{
            padding: 35,
            backgroundColor: 'white',
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            height: '100%',
          }}
        >
          <View
            style={{
              rowGap: 5,
              marginBottom: top * 1.5,
            }}
          >
            <Image
              source={require('@/assets/images/icon.png')}
              style={{ width: 100, height: 100, alignSelf: 'center' }}
            />
            <Text
              style={{
                fontFamily: HEADING_FONT,
                fontSize: 24,
                textAlign: 'center',
              }}
            >
              Ingresa tu cuenta
            </Text>
            <Text
              style={{
                fontFamily: BODY_FONT,
                textAlign: 'center',
                fontSize: 12,
              }}
            >
              Ingresa tu correo y contraseña para acceder a tu cuenta.
            </Text>
          </View>
          <View style={{ rowGap: 5 }}>
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
                  <View style={{ rowGap: 5 }}>
                    <Text
                      style={{
                        fontFamily: BOLD_BODY_FONT,
                        color,
                      }}
                    >
                      Correo electrónico:
                    </Text>
                    <View style={{ position: 'relative' }}>
                      <TextInput
                        style={{
                          paddingHorizontal: 40,
                          paddingVertical: 10,
                          borderRadius: 10,
                          borderWidth: 1,
                          color,
                          borderColor: color,
                          fontFamily: BODY_FONT,
                        }}
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
                      <Text
                        style={{
                          fontFamily: BODY_FONT,
                          marginTop: 3,
                          fontSize: 12,
                          color,
                        }}
                      >
                        {message as string}
                      </Text>
                      <MaterialCommunityIcons
                        style={{
                          position: 'absolute',
                          top: 8,
                          left: 8,
                          zIndex: 1,
                        }}
                        name="email-outline"
                        color={color}
                        size={24}
                      />
                    </View>
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
                  <View style={{ rowGap: 5 }}>
                    <Text
                      style={{
                        fontFamily: BOLD_BODY_FONT,
                        color,
                      }}
                    >
                      Contraseña:
                    </Text>
                    <View style={{ position: 'relative' }}>
                      <TextInput
                        style={{
                          paddingHorizontal: 40,
                          paddingVertical: 10,
                          borderRadius: 10,
                          borderWidth: 1,
                          color,
                          borderColor: color,
                          fontFamily: BODY_FONT,
                        }}
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
                      <Text
                        style={{
                          fontFamily: BODY_FONT,
                          marginTop: 3,
                          fontSize: 12,
                          color,
                        }}
                      >
                        {message as string}
                      </Text>
                      <MaterialCommunityIcons
                        style={{
                          position: 'absolute',
                          top: 8,
                          left: 8,
                          zIndex: 1,
                        }}
                        name="lock-outline"
                        color={color}
                        size={24}
                      />
                      <Pressable
                        onPress={() => setShowPassword(!showPassword)}
                        style={{
                          position: 'absolute',
                          right: 0,
                          zIndex: 1,
                          padding: 7,
                        }}
                      >
                        <MaterialCommunityIcons
                          name={
                            showPassword ? 'eye-outline' : 'eye-off-outline'
                          }
                          color={color}
                          size={24}
                        />
                      </Pressable>
                    </View>
                  </View>
                );
              }}
            />

            <Link href="/login">
              <Text
                style={{
                  fontFamily: BOLD_BODY_FONT,
                  textAlign: 'right',
                  textDecorationLine: 'underline',
                  color: SECONDARY_COLOR,
                }}
              >
                ¿Olvidaste tu contraseña?
              </Text>
            </Link>
            <Pressable
              onPress={handleSubmit(onSubmit)}
              style={{
                backgroundColor: PRIMARY_COLOR,
                height: 40,
                borderRadius: 10,
                marginTop: 10,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                columnGap: 5,
              }}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Text
                    style={{
                      fontFamily: BOLD_BODY_FONT,
                      color: 'white',
                      fontSize: 16,
                    }}
                  >
                    Iniciar sesión
                  </Text>
                  <MaterialCommunityIcons
                    name="login"
                    size={20}
                    color="white"
                  />
                </>
              )}
            </Pressable>
            <Text
              style={{
                fontFamily: BODY_FONT,
                color: 'red',
                textAlign: 'center',
                fontSize: 12,
              }}
            >
              {message}
            </Text>
          </View>
        </View>
      </ImageBackground>
    </ScrollView>
  );
}
