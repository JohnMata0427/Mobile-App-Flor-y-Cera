import { globalStyles } from '@/globalStyles';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { memo } from 'react';
import type { StyleProp } from 'react-native';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

interface ButtonProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  onPress: () => void;
  label?: string;
  disabled?: boolean;
  iconSize?: number;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
}

export const Button = memo(
  ({
    label,
    onPress,
    disabled = false,
    buttonStyle = {},
    icon,
    iconSize = 16,
    textStyle = {},
    testID
  }: ButtonProps) => (
    <Pressable
      style={[globalStyles.button, globalStyles.buttonPrimary, styles.button, buttonStyle]}
      onPress={onPress}
      disabled={disabled}
      testID={testID}
    >
      {disabled ? (
        <ActivityIndicator size={17} color="white" />
      ) : (
        <>
          {label && <Text style={[globalStyles.buttonText, textStyle]}>{label}</Text>}
          <MaterialCommunityIcons name={icon} size={iconSize} color="white" />
        </>
      )}
    </Pressable>
  ),
);

const styles = StyleSheet.create({
  button: {
    columnGap: 5,
  },
});