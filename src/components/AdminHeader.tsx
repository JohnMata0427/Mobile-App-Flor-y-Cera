import { PRIMARY_COLOR_EXTRA_LIGHT } from '@/constants/Colors';
import { globalStyles } from '@/globalStyles';
import { memo, type ReactNode } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

interface AdminHeaderProps {
  children?: ReactNode;
}

export const AdminHeader = memo(({ children }: AdminHeaderProps) => (
  <View style={styles.headerRow}>
    <View style={styles.headerLeft}>
      <Image style={styles.iconImage} source={require('@/assets/logo.png')} />
      <Text style={globalStyles.title}>Flor & Cera</Text>
    </View>
    {children}
  </View>
));

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingBottom: 5,
    backgroundColor: PRIMARY_COLOR_EXTRA_LIGHT,
  },
  headerLeft: {
    flexDirection: 'row',
    columnGap: 10,
    alignItems: 'center',
  },
  iconImage: {
    width: 40,
    height: 40,
  },
});
