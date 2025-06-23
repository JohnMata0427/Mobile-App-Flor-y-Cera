import { GRAY_COLOR_DARK } from '@/constants/Colors';
import { HEADING_FONT } from '@/constants/Fonts';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { BlurView } from 'expo-blur';
import { memo } from 'react';
import { ImageBackground, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const ClientHeader = memo(() => {
  const { top } = useSafeAreaInsets();

  return (
    <ImageBackground
      source={require('@/assets/banner-example.png')}
      style={{ paddingBottom: '40%' }}
    >
      <BlurView
        intensity={5}
        tint="dark"
        experimentalBlurMethod="dimezisBlurView"
        style={[styles.searchContainer, { paddingTop: top + 5 }]}
      >
        <View style={{ flex: 1 }}>
          <TextInput style={styles.searchInput} placeholder="Vela de lavanda..." />
          <Pressable style={styles.searchIcon}>
            <MaterialCommunityIcons name="magnify" size={20} color="white" />
          </Pressable>
        </View>
        <MaterialCommunityIcons name="heart-outline" size={28} color="white" />
      </BlurView>
    </ImageBackground>
  );
});

const styles = StyleSheet.create({
  bannerImage: {
    width: '100%',
  },
  iconImage: {
    width: 50,
    height: 50,
  },
  titleText: {
    fontFamily: HEADING_FONT,
    fontSize: 18,
  },
  searchContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    columnGap: 10,
  },
  searchInput: {
    borderRadius: 20,
    backgroundColor: 'white',
    paddingLeft: 20,
    paddingRight: 70,
    fontSize: 12,
  },
  searchIcon: {
    position: 'absolute',
    insetBlock: 3,
    right: 3,
    justifyContent: 'center',
    backgroundColor: GRAY_COLOR_DARK,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
});
