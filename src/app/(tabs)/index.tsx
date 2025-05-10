import { Header } from '@/components/Header';
import { SECONDARY_COLOR } from '@/constants/Colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
  Image,
  ScrollView,
  Text,
  View,
  type ImageSourcePropType,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { top } = useSafeAreaInsets();

  return (
    <ScrollView>
      <Header top={top} />
      <View style={{ position: 'relative' }}>
        <Image
          style={{ width: '100%', height: 250 }}
          source={require('@/assets/banner-example.png')}
        />
        <MaterialCommunityIcons
          style={{
            position: 'absolute',
            top: 110,
            left: 5,
          }}
          name="arrow-left-bold-circle"
          size={40}
          color={SECONDARY_COLOR}
        />
        <MaterialCommunityIcons
          style={{
            position: 'absolute',
            top: 110,
            right: 5,
          }}
          name="arrow-right-bold-circle"
          size={40}
          color={SECONDARY_COLOR}
        />
      </View>
      <View style={{ padding: 10 }}>
        <Text
          style={{
            fontFamily: 'PlayfairDisplay',
            fontSize: 16,
            alignSelf: 'center',
          }}
        >
          Beneficios o Características Clave
        </Text>
        <View style={{ flexDirection: 'row', rowGap: 10 }}>
          <Card
            source={require('@/assets/1.png')}
            title="Ingredientes naturales"
            description="PayPal es un servicio global que te permite enviar pagos a la cuenta del vendedor con tu tarjeta de crédito"
          />
          <Card
            source={require('@/assets/2.png')}
            title="Producción artesanal"
            description="PayPal es un servicio global que te permite enviar pagos a la cuenta del vendedor con tu tarjeta de crédito"
          />
        </View>
        <View style={{ flexDirection: 'row', rowGap: 10 }}>
          <Card
            source={require('@/assets/3.png')}
            title="Personalización"
            description="PayPal es un servicio global que te permite enviar pagos a la cuenta del vendedor con tu tarjeta de crédito"
          />
          <Card
            source={require('@/assets/4.png')}
            title="Beneficios ecológicos"
            description="PayPal es un servicio global que te permite enviar pagos a la cuenta del vendedor con tu tarjeta de crédito"
          />
        </View>
      </View>
    </ScrollView>
  );
}

function Card({
  source,
  title,
  description,
}: {
  source: ImageSourcePropType;
  title: string;
  description: string;
}) {
  return (
    <View style={{ width: '50%', padding: 10, alignItems: 'center' }}>
      <Image source={source} />
      <Text style={{ fontFamily: 'PlayfairDisplay' }}>{title}</Text>
      <Text style={{ fontFamily: 'PontanoSans', textAlign: 'center' }}>
        {description}
      </Text>
    </View>
  );
}
