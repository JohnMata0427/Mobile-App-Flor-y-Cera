import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Modal, Text, View } from 'react-native';

interface CartMessageModalProps {
  message: string;
  visible: boolean;
}

export const CartMessageModal = ({ message, visible }: CartMessageModalProps) => (
  <Modal
    animationType="fade"
    visible={visible}
    transparent
    statusBarTranslucent
    navigationBarTranslucent
  >
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        margin: 'auto',
        maxHeight: '10%',
        borderRadius: 10,
        rowGap: 5,
        opacity: 0.9,
        width: '60%',
        zIndex: 999,
      }}
    >
      <MaterialCommunityIcons name="cart-check" size={25} color="white" />
      <Text style={{ color: 'white', fontWeight: 'bold' }}>{message}</Text>
    </View>
  </Modal>
);
