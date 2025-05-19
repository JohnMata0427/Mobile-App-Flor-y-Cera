import { PRIMARY_COLOR } from '@/constants/Colors';
import { BODY_FONT } from '@/constants/Fonts';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { memo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

interface CheckBoxProps {
  label: string;
  value: boolean;
  disabled?: boolean;
  onPress: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CheckBox = memo(
  ({ label, value, disabled = false, onPress }: CheckBoxProps) => (
    <Pressable
      style={styles.checkbox}
      disabled={disabled}
      onPress={() => onPress(!value)}
    >
      <MaterialCommunityIcons
        name={value ? 'checkbox-marked' : 'checkbox-blank-outline'}
        size={20}
        color={value ? PRIMARY_COLOR : 'black'}
      />
      <Text style={styles.textInput}>{label}</Text>
    </Pressable>
  ),
);

const styles = StyleSheet.create({
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
  textInput: {
    fontFamily: BODY_FONT,
    fontSize: 12,
  },
});
