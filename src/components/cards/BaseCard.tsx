import { memo, type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

interface BaseCardProps {
  children: ReactNode;
  styles?: StyleProp<ViewStyle>;
}

export const BaseCard = memo(({ children, styles }: BaseCardProps) => {
  return <View style={[baseStyles.card, styles]}>{children}</View>;
});

const baseStyles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    rowGap: 5,
  },
});
