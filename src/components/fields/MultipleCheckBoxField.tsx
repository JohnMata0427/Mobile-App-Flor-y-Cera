import {
  GRAY_COLOR_DARK,
  GRAY_COLOR_LIGHT,
  PRIMARY_COLOR_DARK,
} from '@/constants/Colors';
import { BODY_FONT } from '@/constants/Fonts';
import { globalStyles } from '@/globalStyles';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { memo } from 'react';
import { Controller } from 'react-hook-form';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface MultipleCheckBoxFieldProps {
  control: any;
  name: string;
  rules: any;
  label: string;
  error: string;
  options: { optionLabel: string; optionValue: string }[];
  maxSelected?: number;
}

interface CheckBoxProps {
  label: string;
  value: boolean;
  disabled?: boolean;
  onPress: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MultipleCheckBoxField = memo(
  ({
    control,
    name,
    rules,
    label,
    error,
    options,
    maxSelected = 2,
  }: MultipleCheckBoxFieldProps) => {
    return (
      <View style={styles.container}>
        <Text style={globalStyles.labelText}>
          {label}
          <Text style={globalStyles.requiredMark}> *</Text>
        </Text>
        <Controller
          control={control}
          name={name}
          rules={rules}
          render={({ field: { onChange, value } }) => (
            <View style={styles.checkboxContainer}>
              {options.map(({ optionLabel, optionValue }) => (
                <CheckBox
                  key={optionValue}
                  label={optionLabel}
                  value={value.includes(optionValue)}
                  onPress={pressed => {
                    if (pressed && value.length < maxSelected) {
                      onChange([...value, optionValue]);
                    } else {
                      onChange(value.filter((v: any) => v !== optionValue));
                    }
                  }}
                />
              ))}
            </View>
          )}
        />
        {error && <Text style={globalStyles.errorText}>{error}</Text>}
      </View>
    );
  },
);

const CheckBox = memo(({ label, value, disabled = false, onPress }: CheckBoxProps) => (
  <Pressable
    style={[
      styles.checkbox,
      {
        backgroundColor: value ? GRAY_COLOR_LIGHT : 'white',
      },
    ]}
    disabled={disabled}
    onPress={() => onPress(!value)}
  >
    <MaterialCommunityIcons
      name={value ? 'check-circle' : 'circle-outline'}
      size={20}
      color={value ? PRIMARY_COLOR_DARK : GRAY_COLOR_DARK}
    />
    <Text style={styles.textInput}>{label}</Text>
  </Pressable>
));

const styles = StyleSheet.create({
  container: {
    rowGap: 3,
  },
  checkboxContainer: {
    rowGap: 3,
    width: '60%',
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
    borderRadius: 5,
    padding: 1,
  },
  textInput: {
    fontFamily: BODY_FONT,
    fontSize: 12,
  },
});
