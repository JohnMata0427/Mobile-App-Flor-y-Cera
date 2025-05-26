import { memo, useEffect } from 'react';
import { Animated, StyleSheet, useAnimatedValue, View } from 'react-native';

export const Loading = memo(() => {
  const scaleAnim = useAnimatedValue(1);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [scaleAnim]);

  return (
    <View style={styles.loadingContainer}>
      <Animated.Image
        source={require('@/assets/images/icon.png')}
        style={[styles.image, { transform: [{ scale: scaleAnim }] }]}
        resizeMode="contain"
      />
    </View>
  );
});

const styles = StyleSheet.create({
  image: {
    width: 75,
    height: 75,
    margin: 'auto',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
