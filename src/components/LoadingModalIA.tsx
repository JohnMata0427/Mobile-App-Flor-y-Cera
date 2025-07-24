import { globalStyles } from '@/globalStyles';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { memo, useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';

interface LoadingModalIAProps {
  modalVisible: boolean;
}

const loadingTexts: string[] = [
  'Consultando sus compras recientes...',
  'Analizando sus preferencias...',
  'Escogiendo ingredientes en base a sus gustos...',
  'Revisando su historial de navegación...',
  'Procesando datos, espere un momento, por favor...',
  'Recomendación de Inteligencia Artificial en camino...',
  '¡Estamos casi listos! Gracias por su paciencia...',
];

export const LoadingModalIA = memo(({ modalVisible }: LoadingModalIAProps) => {
  const [currentText, setCurrentText] = useState<string>(loadingTexts[0]);
  const [_, setTextIndex] = useState<number>(0);

  useEffect(() => {
    if (!modalVisible) return;

    const interval = setInterval(() => {
      setTextIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % loadingTexts.length;
        setCurrentText(loadingTexts[nextIndex]);
        return nextIndex;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [modalVisible]);

  if (!modalVisible) return null;

  return (
    <Modal
      animationType="fade"
      visible={modalVisible}
      transparent
      statusBarTranslucent
      navigationBarTranslucent
    >
      <BlurView
        intensity={10}
        style={StyleSheet.absoluteFill}
        tint="dark"
        experimentalBlurMethod="dimezisBlurView"
      />
      <View style={styles.loadingContainer}>
        <Text style={[globalStyles.title, styles.loadingTitleText]}>
          Recomendación en camino...
        </Text>
        <Image
          source={require('@/assets/game/loading-recommendation.gif')}
          style={styles.loadingGif}
          contentFit="contain"
          autoplay
        />
        <Text style={[globalStyles.bodyText, styles.loadingText]}>{currentText}</Text>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#190C40',
    margin: 'auto',
    maxHeight: '30%',
    padding: 20,
    width: '90%',
    borderRadius: 10,
  },
  loadingTitleText: {
    color: 'skyblue',
    fontSize: 18,
  },
  loadingGif: { width: 100, height: 100 },
  loadingText: {
    color: 'white',
  },
});
