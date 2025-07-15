import { globalStyles } from '@/globalStyles';
import { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export const Loading = memo(function Loading() {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const scaleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );

    const opacityAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.6,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );

    scaleAnimation.start();
    opacityAnimation.start();

    return () => {
      scaleAnimation.stop();
      opacityAnimation.stop();
    };
  }, [scaleAnim, opacityAnim]);

  return (
    <View style={globalStyles.centeredContainer}>
      <Animated.Image
        source={require('@/assets/logo.png')}
        style={[
          styles.image,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
        resizeMode="contain"
      />
    </View>
  );
});

const styles = StyleSheet.create({
  image: {
    width: 75,
    height: 75,
  },
});