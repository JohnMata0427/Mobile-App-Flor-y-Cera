import { Modal, StyleSheet, Text, View } from 'react-native';

interface CartMessageModalProps {
  message: string;
}

export const CartMessageModal = ({ message }: CartMessageModalProps) => (
  <Modal visible={!!message} animationType="fade" transparent style={{ flexGrow: 1 }}>
    <View style={styles.container}>
      <Text style={styles.title}>{message}</Text>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 'auto',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 10,
    borderRadius: 10,
  },
  title: {
    fontWeight: 'bold',
    color: 'white',
  },
});
