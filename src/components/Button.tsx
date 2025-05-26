import { PRIMARY_COLOR, PRIMARY_COLOR_DARK } from '@/constants/Colors';
import { BODY_FONT } from '@/constants/Fonts';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { memo } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

interface ButtonProps {
  label?: string;
  onPress: () => void;
  disabled?: boolean;
  backgroundColor?: string;
  borderColor?: string;
  paddingVertical?: number;
  paddingHorizontal?: number;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}

export const Button = memo(
  ({
    label,
    onPress,
    disabled = false,
    backgroundColor = PRIMARY_COLOR,
    borderColor = PRIMARY_COLOR_DARK,
    paddingVertical = 10,
    paddingHorizontal = 10,
    icon,
  }: ButtonProps) => (
    <Pressable
      style={[styles.button, { backgroundColor, borderColor, paddingVertical, paddingHorizontal }]}
      onPress={onPress}
      disabled={disabled}
    >
      {disabled ? (
        <ActivityIndicator size={17} color="white" />
      ) : (
        <>
          {label && <Text style={styles.buttonText}>{label}</Text>}
          <MaterialCommunityIcons name={icon} size={16} color="white" />
        </>
      )}
    </Pressable>
  ),
);

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    borderRadius: 5,
    columnGap: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderRightWidth: 2,
    flex: 1,
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 12,
  },
});
