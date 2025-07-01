import { Button } from '@/components/Button';
import {
  GRAY_COLOR,
  GRAY_COLOR_DARK,
  GRAY_COLOR_LIGHT,
  PRIMARY_COLOR,
  TERTIARY_COLOR,
  TERTIARY_COLOR_DARK,
} from '@/constants/Colors';
import { BOLD_BODY_FONT } from '@/constants/Fonts';
import { ProfileContext, ProfileProvider } from '@/contexts/ProfileContext';
import { useAuthStore } from '@/store/useAuthStore';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { memo, use } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ClientProfile = memo(() => {
  const router = useRouter();
  const { logout } = useAuthStore();
  const { top } = useSafeAreaInsets();
  const { client } = use(ProfileContext);
  const { nombre, apellido, email, imagen, genero } = client ?? {};

  const defaultImage =
    genero === 'Masculino'
      ? require('@/assets/male-user-default.jpg')
      : require('@/assets/female-user-default.jpg');

  return (
    <>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: top + 10,
          paddingHorizontal: 20,
          rowGap: 10,
        }}
      >
        <View style={{ alignItems: 'center', padding: 10 }}>
          <Image
            source={imagen ? { uri: imagen } : defaultImage}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              borderWidth: 2,
              borderColor: GRAY_COLOR_LIGHT,
            }}
          />
          <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
            {nombre} {apellido}
          </Text>
          <Text style={{ fontSize: 12, color: GRAY_COLOR }}>{email}</Text>
        </View>

        <View style={{ rowGap: 5 }}>
          <Text style={{ fontWeight: 'bold', color: GRAY_COLOR, marginBottom: 5 }}>
            Configuración de la cuenta
          </Text>
          <Pressable
            onPress={() => {}}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'white',
              padding: 10,
              borderRadius: 10,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                columnGap: 5,
              }}
            >
              <MaterialCommunityIcons name="bell" size={20} color={GRAY_COLOR_DARK} />
              <Text
                style={{
                  color: GRAY_COLOR_DARK,
                  fontFamily: BOLD_BODY_FONT,
                }}
              >
                Notificaciones
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                columnGap: 5,
              }}
            >
              <Text
                style={{
                  color: 'white',
                  backgroundColor: PRIMARY_COLOR,
                  width: 20,
                  height: 20,
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  borderRadius: 5,
                }}
              >
                4
              </Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color={GRAY_COLOR_DARK} />
            </View>
          </Pressable>

          <Pressable
            onPress={() => {}}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'white',
              padding: 10,
              borderRadius: 10,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                columnGap: 5,
              }}
            >
              <MaterialCommunityIcons name="account-circle" size={20} color={GRAY_COLOR_DARK} />
              <Text
                style={{
                  color: GRAY_COLOR_DARK,
                  fontFamily: BOLD_BODY_FONT,
                }}
              >
                Editar perfil
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={GRAY_COLOR_DARK} />
          </Pressable>

          <Pressable
            onPress={() => {}}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'white',
              padding: 10,
              borderRadius: 10,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                columnGap: 5,
              }}
            >
              <MaterialCommunityIcons name="lock" size={20} color={GRAY_COLOR_DARK} />
              <Text
                style={{
                  color: GRAY_COLOR_DARK,
                  fontFamily: BOLD_BODY_FONT,
                }}
              >
                Actualizar contraseña
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={GRAY_COLOR_DARK} />
          </Pressable>

          <Text style={{ fontWeight: 'bold', color: GRAY_COLOR, marginBottom: 5 }}>
            Facturación
          </Text>

          <Pressable
            onPress={() => {}}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'white',
              padding: 10,
              borderRadius: 10,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                columnGap: 5,
              }}
            >
              <MaterialCommunityIcons name="truck-delivery" size={20} color={GRAY_COLOR_DARK} />
              <Text
                style={{
                  color: GRAY_COLOR_DARK,
                  fontFamily: BOLD_BODY_FONT,
                }}
              >
                Mis pedidos
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={GRAY_COLOR_DARK} />
          </Pressable>

          <Pressable
            onPress={() => {}}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'white',
              padding: 10,
              borderRadius: 10,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                columnGap: 5,
              }}
            >
              <MaterialCommunityIcons name="script-text" size={20} color={GRAY_COLOR_DARK} />
              <Text
                style={{
                  color: GRAY_COLOR_DARK,
                  fontFamily: BOLD_BODY_FONT,
                }}
              >
                Mis facturas
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={GRAY_COLOR_DARK} />
          </Pressable>

          <Pressable
            onPress={() => {}}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'white',
              padding: 10,
              borderRadius: 10,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                columnGap: 5,
              }}
            >
              <MaterialCommunityIcons name="map-marker" size={20} color={GRAY_COLOR_DARK} />
              <Text
                style={{
                  color: GRAY_COLOR_DARK,
                  fontFamily: BOLD_BODY_FONT,
                }}
              >
                Actualizar dirección de envío
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={GRAY_COLOR_DARK} />
          </Pressable>
        </View>
      </ScrollView>
      <View style={{ paddingHorizontal: 25 }}>
        <Button
          label="Cerrar sesión"
          icon="logout"
          onPress={() => {
            logout();
            router.push('/(auth)/login');
          }}
          buttonStyle={{
            backgroundColor: TERTIARY_COLOR,
            borderColor: TERTIARY_COLOR_DARK,
          }}
        />
      </View>
    </>
  );
});

export default function ClientProfileScreen() {
  return (
    <ProfileProvider>
      <ClientProfile />
    </ProfileProvider>
  );
}
