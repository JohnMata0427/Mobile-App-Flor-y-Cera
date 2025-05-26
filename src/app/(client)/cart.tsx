import { GRAY_COLOR_DARK } from '@/constants/Colors';
import { BODY_FONT, BOLD_BODY_FONT } from '@/constants/Fonts';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CartScreen() {
  const { top } = useSafeAreaInsets();

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View
        style={{
          paddingTop: top + 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'white',
          padding: 10,
        }}
      >
        <Pressable
          style={{
            flexDirection: 'row',
            columnGap: 5,
            alignItems: 'center',
          }}
          onPress={() => {}}
        >
          <MaterialCommunityIcons
            name="circle-outline"
            size={20}
            color={GRAY_COLOR_DARK}
          />
          <Text
            style={{
              fontFamily: BODY_FONT,
              color: GRAY_COLOR_DARK,
            }}
          >
            Todo
          </Text>
        </Pressable>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', columnGap: 5 }}
        >
          <MaterialCommunityIcons name="cart-variant" size={18} />
          <Text style={{ fontFamily: BOLD_BODY_FONT, fontSize: 16 }}>
            Mi carrito (7)
          </Text>
        </View>
        <Pressable
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: 2,
          }}
          onPress={() => {}}
        >
          <Text style={{ fontWeight: 'bold' }}>Comprar</Text>
          <MaterialCommunityIcons name="chevron-right" size={18} />
        </Pressable>
      </View>
    </ScrollView>
  );
}
