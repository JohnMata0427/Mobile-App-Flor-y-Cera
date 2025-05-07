import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image, TextInput, View } from 'react-native';

export function Header({ top }: { top: number }) {
  return (
    <View
      style={{
        paddingTop: top + 15,
        backgroundColor: '#E4E0FF',
        paddingHorizontal: 15,
        paddingBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
      }}
    >
      <Image
        source={require('../assets/images/icon.png')}
        style={{
          width: 40,
          height: 40,
        }}
      />
      <TextInput
        style={{
          borderWidth: 1,
          borderRadius: 10,
          backgroundColor: 'white',
          width: '55%',
          paddingHorizontal: 20,
          fontSize: 12,
        }}
        placeholder="Buscar productos..."
        placeholderTextColor="black"
      />
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <MaterialCommunityIcons name="account-outline" size={25} />
        <View style={{ borderEndWidth: 0.5 }} />
        <MaterialCommunityIcons name="shopping-outline" size={25} />
      </View>
    </View>
  );
}
