import { HEADING_FONT } from '@/constants/Fonts';
import { memo } from 'react';
import { Image, StyleSheet, Text, TextInput, View } from 'react-native';

export const AdminHeader = memo(
  ({ children }: { children?: React.ReactNode }) => {
    return (
      <>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Image
              style={styles.iconImage}
              source={require('@/assets/images/icon.png')}
            />
            <Text style={styles.titleText}>Flor & Cera</Text>
          </View>
          {children}
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre..."
        />
      </>
    );
  },
);

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    columnGap: 10,
    alignItems: 'center',
  },
  iconImage: {
    width: 50,
    height: 50,
  },
  titleText: {
    fontFamily: HEADING_FONT,
    fontSize: 18,
  },
  searchInput: {
    borderRadius: 25,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    fontSize: 12,
  },
});
