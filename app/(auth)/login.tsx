import { Field } from '@/components/Field';
import { PRIMARY_COLOR, SECONDARY_COLOR } from '@/constants/Colors';
import { BODY_FONT, BOLD_BODY_FONT, HEADING_FONT } from '@/constants/Fonts';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Link, useRouter } from 'expo-router';
import { setItemAsync } from 'expo-secure-store';
import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Login() {
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>(
    form,
  );

  const handleChange = (name: string, value: string) => {
    setForm(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const response = await fetch(
      'https://tesis-ecommerce.onrender.com/api/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      },
    );

    const data = await response.json();

    if (response.ok) {
      setItemAsync('token', data.token);
      router.navigate('/(admin)/dashboard');
      setForm({
        email: '',
        password: '',
      });
    } else {
      const { details = [] } = data;

      const errors: { [key: string]: string } = {};
      details.forEach(({ path, msg }: { path: string; msg: string }) => {
        errors[path] = msg;
      });
      setFieldErrors(errors);

      setErrorMessage(data.msg ?? 'Ha ocurrido un error inesperado');
    }
    setIsLoading(false);
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
          <View style={{ rowGap: 10 }}>
            <Field
              label="Correo electrónico:"
              placeholder="correo@ejemplo.com"
              onChangeText={text => handleChange('email', text)}
              errorField={fieldErrors.email}
              keyboardType="email-address"
              textContentType="emailAddress"
            >
              <MaterialCommunityIcons
                style={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  zIndex: 1,
                }}
                name="account-outline"
                color={fieldErrors.email ? 'red' : 'black'}
                size={24}
              />
            </Field>

            <Field
              label="Contraseña:"
              placeholder="••••••••••"
              onChangeText={text => handleChange('password', text)}
              errorField={fieldErrors.password}
              secureTextEntry={true}
              keyboardType="visible-password"
              textContentType="password"
            >
              <MaterialCommunityIcons
                style={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  zIndex: 1,
                }}
                name="lock-outline"
                color={fieldErrors.password ? 'red' : 'black'}
                size={24}
              />
              <MaterialCommunityIcons
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  zIndex: 1,
                }}
                name="eye-outline"
                color={fieldErrors.password ? 'red' : 'black'}
                size={24}
              />
            </Field>
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
              onPress={handleSubmit}
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
              {errorMessage}
            </Text>
          </View>
        </View>
      </ImageBackground>
    </ScrollView>
  );
}
