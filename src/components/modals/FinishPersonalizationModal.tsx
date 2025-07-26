import { Button } from '@/components/Button';
import { PRIMARY_COLOR, SECONDARY_COLOR, SECONDARY_COLOR_DARK } from '@/constants/Colors';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { memo, type Dispatch, type SetStateAction } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';

interface FinishPersonalizationModalProps {
  message: string;
  imagePreview: string;
  modalVisible: boolean;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
}

export const FinishPersonalizationModal = memo(
  ({ message, imagePreview, modalVisible, setModalVisible }: FinishPersonalizationModalProps) => {
    if (!modalVisible) return null;

    return (
      <Modal
        visible={modalVisible}
        animationType="fade"
        backdropColor="rgba(0, 0, 0, 0.1)"
        onRequestClose={() => setModalVisible(false)}
        statusBarTranslucent
        navigationBarTranslucent
      >
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Mensaje del juego</Text>
          <Text style={styles.message}>{message}</Text>
          {imagePreview && (
            <Image
              source={{ uri: imagePreview }}
              style={styles.imagePreview}
              contentFit="contain"
            />
          )}

          <View style={styles.buttonContainer}>
            <Button
              label="Seguir creando"
              icon="pencil-plus"
              onPress={() => setModalVisible(false)}
              buttonStyle={styles.secondaryButton}
            />

            <Button
              label="Ir a mis diseños"
              icon="arrow-right"
              onPress={() => router.push('/(client)/(personalization)/history')}
            />
          </View>
        </View>
      </Modal>
    );
  },
);

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
    margin: 'auto',
    maxHeight: '45%',
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    rowGap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: PRIMARY_COLOR,
  },
  message: {
    textAlign: 'center',
  },
  imagePreview: {
    width: 250,
    height: 175,
  },
  buttonContainer: {
    flexDirection: 'row',
    columnGap: 10,
  },
  secondaryButton: {
    backgroundColor: SECONDARY_COLOR,
    borderColor: SECONDARY_COLOR_DARK,
  },
});
