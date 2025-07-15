import { Button } from '@/components/Button';
import { globalStyles, welcomeStyles } from '@/globalStyles';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Text, View, Animated } from 'react-native';
import { useEffect } from 'react';

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
      <Text style={globalStyles.title}>En Flor & Cera, tu imaginación es el único límite.</Text>
      <Text style={welcomeStyles.subtitle}>
        Imagina tu combinación perfecta, nosotros te damos las herramientas para hacerla realidad.
      </Text>
      <Image
        source={require('@/assets/splashs/second.png')}
        style={welcomeStyles.splashImage}
        contentFit="contain"
      />

      <View style={welcomeStyles.buttonContainer}>
        <Button
          label="Anterior"
          icon="arrow-left-bold"
          onPress={() => router.push('/(welcome)/first')}
          buttonStyle={welcomeStyles.secondaryButton}
        />
        <Button
          label="Continuar"
          icon="arrow-right-bold"
          onPress={() => router.push('/(welcome)/third')}
          buttonStyle={welcomeStyles.primaryButton}
        />
      </View>
    </Animated.View>
  );
}
