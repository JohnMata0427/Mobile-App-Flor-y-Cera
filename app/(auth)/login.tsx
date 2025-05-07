import { Field } from '@/components/Field';
import { Colors } from '@/constants/Colors';
import { PlayfairDisplay, PontanoSans } from '@/constants/Fonts';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Pressable,
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
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({
    email: '',
    password: '',
  });

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
      router.navigate('/(tabs)');
    } else {
      const { details = [] } = data;

      const errors: { [key: string]: string } = {};
      details.forEach(({ path, msg }: { path: string; msg: string }) => {
        errors[path] = msg;
      });
      setFieldErrors(errors);

      setErrorMessage(data.msg ?? 'Ha ocurrido un error inesperado');
      console.log(data);
    }
    setIsLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.primary, paddingTop: top * 3 }}
    >
      <View
        style={{
          flex: 1,
          padding: 30,
          backgroundColor: '#fff',
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
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
              fontFamily: PlayfairDisplay.bold,
              fontSize: 24,
              textAlign: 'center',
            }}
          >
            Ingresa tu cuenta
          </Text>
          <Text
            style={{
              fontFamily: PontanoSans.regular,
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
                fontFamily: PontanoSans.semibold,
                textAlign: 'right',
                textDecorationLine: 'underline',
                color: Colors.secondary,
              }}
            >
              ¿Olvidaste tu contraseña?
            </Text>
          </Link>
          <Pressable
            onPress={handleSubmit}
            style={{
              backgroundColor: Colors.primary,
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
                    fontFamily: PontanoSans.bold,
                    color: 'white',
                    fontSize: 16,
                  }}
                >
                  Iniciar sesión
                </Text>
                <MaterialCommunityIcons
                  name="arrow-right-bold-hexagon-outline"
                  size={20}
                  color="white"
                />
              </>
            )}
          </Pressable>
          <Text
            style={{
              fontFamily: PontanoSans.regular,
              color: 'red',
              textAlign: 'center',
              fontSize: 12,
            }}
          >
            {errorMessage}
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
