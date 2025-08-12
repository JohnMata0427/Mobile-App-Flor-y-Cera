import { Button } from '@/components/Button';
import { FloatingItem } from '@/components/FloatingItem';
import { SECONDARY_COLOR, SECONDARY_COLOR_DARK } from '@/constants/Colors';
import { CategoriesContext, CategoriesProvider } from '@/contexts/CategoryContext';
import { Image, ImageBackground } from 'expo-image';
import { router } from 'expo-router';
import { memo, use, useEffect, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

export const Personalization = memo(() => {
  const { categories } = use(CategoriesContext);
  const [jabonesId, setJabonesId] = useState<string>('');
  const [velasId, setVelasId] = useState<string>('');

  useEffect(() => {
    categories?.forEach(category => {
      if (category.nombre.toLowerCase().includes('jabones')) {
        setJabonesId(category._id);
      } else if (category.nombre.toLowerCase().includes('velas')) {
        setVelasId(category._id);
      }
    });
  }, [categories]);

  return (
    <ImageBackground style={styles.background} source={require('@/assets/bg-game.png')}>
      <FloatingItem image={require('@/assets/game/bubble.png')} />
      <FloatingItem image={require('@/assets/game/flower-1.png')} />
      <FloatingItem image={require('@/assets/game/flower-2.png')} />
      <FloatingItem image={require('@/assets/game/flower-3.png')} />
      <FloatingItem image={require('@/assets/game/bubble.png')} />
      <FloatingItem image={require('@/assets/game/flower-1.png')} />
      <FloatingItem image={require('@/assets/game/flower-2.png')} />
      <FloatingItem image={require('@/assets/game/flower-3.png')} />
      <FloatingItem image={require('@/assets/game/bubble.png')} />
      <FloatingItem image={require('@/assets/game/flower-1.png')} />
      <FloatingItem image={require('@/assets/game/flower-2.png')} />
      <FloatingItem image={require('@/assets/game/flower-3.png')} />
      <FloatingItem image={require('@/assets/game/bubble.png')} />
      <FloatingItem image={require('@/assets/game/flower-1.png')} />
      <FloatingItem image={require('@/assets/game/flower-2.png')} />
      <FloatingItem image={require('@/assets/game/flower-3.png')} />
      <FloatingItem image={require('@/assets/game/bubble.png')} />
      <FloatingItem image={require('@/assets/game/flower-1.png')} />
      <FloatingItem image={require('@/assets/game/flower-2.png')} />
      <FloatingItem image={require('@/assets/game/flower-3.png')} />
      <FloatingItem image={require('@/assets/game/bubble.png')} />
      <FloatingItem image={require('@/assets/game/flower-1.png')} />
      <FloatingItem image={require('@/assets/game/flower-2.png')} />
      <FloatingItem image={require('@/assets/game/flower-3.png')} />
      <FloatingItem image={require('@/assets/game/bubble.png')} />
      <FloatingItem image={require('@/assets/game/flower-1.png')} />
      <FloatingItem image={require('@/assets/game/flower-2.png')} />
      <FloatingItem image={require('@/assets/game/flower-3.png')} />
      <FloatingItem image={require('@/assets/game/bubble.png')} />
      <FloatingItem image={require('@/assets/game/flower-1.png')} />
      <FloatingItem image={require('@/assets/game/flower-2.png')} />
      <FloatingItem image={require('@/assets/game/flower-3.png')} />
      <FloatingItem image={require('@/assets/game/bubble.png')} />
      <FloatingItem image={require('@/assets/game/flower-1.png')} />
      <FloatingItem image={require('@/assets/game/flower-2.png')} />
      <FloatingItem image={require('@/assets/game/flower-3.png')} />
      <FloatingItem image={require('@/assets/game/bubble.png')} />
      <FloatingItem image={require('@/assets/game/flower-1.png')} />
      <FloatingItem image={require('@/assets/game/flower-2.png')} />
      <FloatingItem image={require('@/assets/game/flower-3.png')} />

      <Pressable
        style={styles.soapSection}
        onPress={() => {
          router.push({
            pathname: '/(client)/(personalization)/[category]',
            params: { category: jabonesId },
          });
        }}
      >
        <Button
          label="Personalizar Jabones"
          icon="chart-bubble"
          buttonStyle={styles.soapButton}
          onPress={() => {
            router.push({
              pathname: '/(client)/(personalization)/[category]',
              params: { category: jabonesId },
            });
          }}
        />
        <Image
          source={require('@/assets/personalized-soap.png')}
          contentFit="contain"
          style={styles.soapImage}
        />
      </Pressable>
      <Image source={require('@/assets/banner-game.png')} style={styles.banner} />
      <Pressable
        style={styles.candleSection}
        onPress={() => {
          router.push({
            pathname: '/(client)/(personalization)/[category]',
            params: { category: velasId },
          });
        }}
      >
        <Image
          source={require('@/assets/personalized-candle.png')}
          contentFit="contain"
          style={styles.candleImage}
        />
        <Button
          label="Personalizar Velas"
          icon="candle"
          onPress={() => {
            router.push({
              pathname: '/(client)/(personalization)/[category]',
              params: { category: velasId },
            });
          }}
        />
      </Pressable>
    </ImageBackground>
  );
});

export default function PersonalizationScreen() {
  return (
    <CategoriesProvider>
      <Personalization />
    </CategoriesProvider>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  soapSection: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 25,
  },
  soapButton: {
    backgroundColor: SECONDARY_COLOR,
    borderColor: SECONDARY_COLOR_DARK,
  },
  soapImage: {
    width: '50%',
    alignSelf: 'flex-end',
    zIndex: 1,
    aspectRatio: 1
  },
  banner: {
    width: '75%',
    height: '25%',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
    zIndex: 1,
  },
  candleSection: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 25,
  },
  candleImage: {
    width: '50%',
    alignSelf: 'flex-end',
    zIndex: 1,
    aspectRatio: 1
  },
});
