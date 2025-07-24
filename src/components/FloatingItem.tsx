import { memo, useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  StyleSheet,
  type ImageSourcePropType,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const createOscillation = (animatedValue: Animated.Value, range: number, duration: number) => {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: range,
        duration,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: -range,
        duration,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      }),
    ]),
    {
      resetBeforeIteration: false,
    },
  );
};

export const FloatingItem = memo(({ image }: { image: ImageSourcePropType }) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const randomX = useRef(10 + Math.random() * 10).current;
  const randomY = useRef(10 + Math.random() * 10).current;
  const durationX = useRef(3000 + Math.random() * 2000).current;
  const durationY = useRef(4000 + Math.random() * 2000).current;
  const position = useRef({
    left: Math.random() * (width - 60),
    top: Math.random() * (height - 60),
  }).current;

  useEffect(() => {
    const floatX = createOscillation(translateX, randomX, durationX);
    const floatY = createOscillation(translateY, randomY, durationY);

    floatX.start();
    floatY.start();

    return () => {
      floatX.stop();
      floatY.stop();
    };
  }, [translateX, translateY, randomX, randomY, durationX, durationY]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          left: position.left,
          top: position.top,
          transform: [{ translateX }, { translateY }],
        },
      ]}
    >
      <Image source={image} style={styles.image} />
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 40,
    height: 40,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    opacity: 0.8,
  },
});
