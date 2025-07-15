import { Button } from '@/components/Button';
import { globalStyles, welcomeStyles } from '@/globalStyles';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { setItemAsync } from 'expo-secure-store';
import { useEffect } from 'react';
import { Animated, Text, View } from 'react-native';

export default function WelcomeSecondScreen() {
  const fadeAnim = new Animated.Value(0);
    const slideAnim = new Animated.Value(20);
  
    useEffect(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
      ]).start();
    }, []);

  return (
        <Animated.View
          style={[
            welcomeStyles.container,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
      <Text style={globalStyles.title}>Desde Flor & Cera, hasta la puerta de tu casa.</Text>
      <Text style={welcomeStyles.subtitle}>
        Cerramos el ciclo de la creación artesanal asegurando que tu pedido llegue perfecto y listo
        para sorprenderte.
      </Text>
      <Image
        source={require('@/assets/splashs/third.jpg')}
        style={welcomeStyles.splashImage}
        contentFit="cover"
      />

      <View style={welcomeStyles.buttonContainer}>
        <Button
          label="Anterior"
          icon="arrow-left-bold"
          onPress={() => router.push('/(welcome)/second')}
          buttonStyle={welcomeStyles.secondaryButton}
        />
        <Button
          label="Comenzar"
          icon="check"
          onPress={async () => {
            await setItemAsync('welcomeCompleted', 'true');
            router.replace('/(auth)/login');
          }}
          buttonStyle={welcomeStyles.primaryButton}
        />
      </View>
    </Animated.View>
  );
}
