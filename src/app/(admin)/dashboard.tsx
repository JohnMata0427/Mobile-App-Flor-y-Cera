import {
  GRAY_COLOR,
  GRAY_COLOR_DARK,
  GRAY_COLOR_LIGHT,
  PRIMARY_COLOR,
  SECONDARY_COLOR,
  TERTIARY_COLOR,
} from '@/constants/Colors';
import { BODY_FONT, BOLD_BODY_FONT, HEADING_FONT } from '@/constants/Fonts';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image, ScrollView, Text, TextInput, View } from 'react-native';

export default function AdminDashboard() {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{ paddingHorizontal: 25, rowGap: 10 }}>
        <View
          style={{ flexDirection: 'row', columnGap: 20, alignItems: 'center' }}
        >
          <Image
            style={{ width: 50, height: 50 }}
            source={require('@/assets/images/icon.png')}
          />
          <Text style={{ fontFamily: HEADING_FONT, fontSize: 18 }}>
            Flor & Cera
          </Text>
        </View>
        <TextInput
          style={{
            borderRadius: 25,
            backgroundColor: 'white',
            paddingHorizontal: 20,
            fontSize: 12,
          }}
          placeholder="Buscar..."
        />
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 15,
            paddingVertical: 20,
            paddingHorizontal: 30,
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderColor: GRAY_COLOR_LIGHT,
            borderBottomWidth: 2,
            borderRightWidth: 2,
          }}
        >
          <View style={{ rowGap: 3 }}>
            <Text style={{ fontFamily: BODY_FONT }}>Buenas tardes</Text>
            <Text style={{ fontFamily: BOLD_BODY_FONT, fontSize: 18 }}>
              Estefanía Sanchez
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              columnGap: 10,
              alignItems: 'center',
            }}
          >
            <MaterialCommunityIcons
              name="bell"
              size={24}
              color={GRAY_COLOR_DARK}
            />
            <Image
              source={require('@/assets/profile.jpg')}
              style={{
                width: 40,
                height: 40,
                borderRadius: 50,
                borderWidth: 2,
                borderColor: GRAY_COLOR,
              }}
            />
          </View>
        </View>
        <View style={{ columnGap: 5, flexDirection: 'row' }}>
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 15,
              flex: 1,
              padding: 10,
              alignItems: 'center',
              justifyContent: 'space-between',
              rowGap: 10,
              borderColor: GRAY_COLOR_LIGHT,
              borderBottomWidth: 2,
              borderRightWidth: 2,
            }}
          >
            <Text
              style={{
                fontFamily: BOLD_BODY_FONT,
                fontSize: 10,
                textAlign: 'center',
              }}
            >
              Usuarios registrados
            </Text>
            <MaterialCommunityIcons
              name="account-multiple-plus"
              size={24}
              color={PRIMARY_COLOR}
              style={{
                padding: 5,
                borderColor: PRIMARY_COLOR,
                borderWidth: 2,
                borderRadius: 50,
              }}
            />
            <Text style={{ fontFamily: BODY_FONT }}>4 usuarios</Text>
          </View>
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 15,
              flex: 1,
              padding: 10,
              alignItems: 'center',
              justifyContent: 'space-between',
              rowGap: 10,
              borderColor: GRAY_COLOR_LIGHT,
              borderBottomWidth: 2,
              borderRightWidth: 2,
            }}
          >
            <Text
              style={{
                fontFamily: BOLD_BODY_FONT,
                fontSize: 10,
                textAlign: 'center',
              }}
            >
              Productos vendidos
            </Text>
            <MaterialCommunityIcons
              name="briefcase-check"
              size={24}
              color={SECONDARY_COLOR}
              style={{
                padding: 5,
                borderColor: SECONDARY_COLOR,
                borderWidth: 2,
                borderRadius: 50,
              }}
            />
            <Text style={{ fontFamily: BODY_FONT }}>1 ventas</Text>
          </View>
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 15,
              flex: 1,
              padding: 10,
              alignItems: 'center',
              justifyContent: 'center',
              rowGap: 10,
              borderColor: GRAY_COLOR_LIGHT,
              borderBottomWidth: 2,
              borderRightWidth: 2,
            }}
          >
            <Text
              style={{
                fontFamily: BOLD_BODY_FONT,
                fontSize: 10,
                textAlign: 'center',
              }}
            >
              Productos activos
            </Text>
            <MaterialCommunityIcons
              name="candle"
              size={24}
              color={TERTIARY_COLOR}
              style={{
                padding: 5,
                borderColor: TERTIARY_COLOR,
                borderWidth: 2,
                borderRadius: 50,
              }}
            />
            <Text style={{ fontFamily: BODY_FONT }}>3 productos</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
