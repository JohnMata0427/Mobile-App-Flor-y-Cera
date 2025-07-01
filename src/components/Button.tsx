import { PRIMARY_COLOR, PRIMARY_COLOR_DARK } from '@/constants/Colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { memo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

interface ButtonProps {
  label?: string;
  onPress: () => void;
  disabled?: boolean;
  backgroundColor?: string;
  borderColor?: string;
  paddingVertical?: number;
  paddingHorizontal?: number;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  fontSize?: number;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button = memo(
  ({ label, onPress, disabled = false, buttonStyle = {}, icon, textStyle = {} }: ButtonProps) => {
    const { fontSize } = textStyle;
    const {
      backgroundColor = PRIMARY_COLOR,
      borderColor = PRIMARY_COLOR_DARK,
      paddingVertical = 10,
      paddingHorizontal = 10,
    } = buttonStyle;

    return (
      <Pressable
        style={[
          styles.button,
          {
            backgroundColor,
            borderColor,
            paddingVertical,
            paddingHorizontal,
          },
          buttonStyle,
        ]}
        onPress={onPress}
        disabled={disabled}
      >
        {disabled ? (
          <ActivityIndicator size={17} color="white" />
        ) : (
          <>
            {label && <Text style={[styles.buttonText, { fontSize }, textStyle]}>{label}</Text>}
            <MaterialCommunityIcons name={icon} size={16} color="white" />
          </>
        )}
      </Pressable>
    );
  },
);

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    borderRadius: 8,
    columnGap: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'white',
  },
});
