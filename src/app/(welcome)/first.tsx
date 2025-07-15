import { Button } from '@/components/Button';
import { globalStyles, welcomeStyles } from '@/globalStyles';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { setItemAsync } from 'expo-secure-store';
import { useEffect } from 'react';
import { Animated, Text, View } from 'react-native';

export default function WelcomeFirstScreen() {
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
      <Text style={globalStyles.title}>En Flor & Cera, cuidamos cada detalle desde el origen.</Text>
      <Text style={welcomeStyles.subtitle}>
        Desde nuestro taller, cada ingrediente se combina con dedicación para crear algo tan único
        como tú.
      </Text>
      <Image
        source={require('@/assets/splashs/first.png')}
        style={welcomeStyles.splashImage}
        contentFit="contain"
      />

      <View style={welcomeStyles.buttonContainer}>
        <Button
          label="Saltar"
          icon="skip-forward"
          onPress={async () => {
            await setItemAsync('welcomeCompleted', 'true');
            router.replace('/(auth)/login');
          }}
          buttonStyle={welcomeStyles.secondaryButton}
        />
        <Button
          label="Continuar"
          icon="forward"
          onPress={() => router.push('/(welcome)/second')}
          buttonStyle={welcomeStyles.primaryButton}
        />
      </View>
    </Animated.View>
  );
}
