import { GRAY_COLOR, GRAY_COLOR_DARK, GRAY_COLOR_LIGHT } from '@/constants/Colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';
import React, { memo, type Dispatch, type SetStateAction } from 'react';
import { StyleSheet, View } from 'react-native';
import { BaseField } from './BaseField';

interface OptionValue {
  nombre: string;
  _id: string;
}

interface OptionsPicker {
  optionLabel: string;
  optionValue: OptionValue | string;
}

interface PickerFieldProps {
  control: any;
  name: string;
  rules: any;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  options: OptionsPicker[];
  onSelect?: Dispatch<SetStateAction<string>>;
  changeSelect?: Dispatch<SetStateAction<string>>;
  prompt: string;
  error: string;
}

export const PickerField = memo(
  ({
    control,
    name,
    rules,
    icon,
    label,
    options,
    onSelect,
    prompt,
    error,
    changeSelect,
  }: PickerFieldProps) => {
    return (
      <BaseField control={control} name={name} rules={rules} label={label} error={error}>
        {({ onChange, onBlur, value }) => {
          const color = value ? GRAY_COLOR_DARK : error ? 'red' : GRAY_COLOR;
          const iconColor = error ? 'red' : GRAY_COLOR_DARK;

          return (
            <View style={styles.pickerSelectContainer}>
              <Picker
                style={[{ color }, styles.pickerSelect]}
                selectedValue={value}
                onValueChange={itemValue => {
                  onChange(itemValue);
                  onSelect && onSelect(itemValue);
                  changeSelect && changeSelect(itemValue);
                }}
                mode="dropdown"
                prompt={prompt}
                dropdownIconColor={iconColor}
                dropdownIconRippleColor={iconColor}
                onBlur={onBlur}
              >
                <Picker.Item
                  value=""
                  label={prompt}
                  style={styles.defaultPickerItem}
                  enabled={false}
                />
                {options.map(({ optionLabel, optionValue }) => (
                  <Picker.Item
                    key={optionLabel}
                    value={typeof optionValue === 'string' ? optionValue : optionValue._id}
                    label={optionLabel}
                    style={styles.pickerItem}
                  />
                ))}
              </Picker>
              <MaterialCommunityIcons style={styles.icon} name={icon} color={iconColor} size={16} />
            </View>
          );
        }}
      </BaseField>
    );
  },
);

const styles = StyleSheet.create({
  pickerSelectContainer: {
    backgroundColor: GRAY_COLOR_LIGHT,
    fontSize: 12,
    borderRadius: 10,
  },
  pickerSelect: {
    marginLeft: 17,
  },
  defaultPickerItem: {
    color: GRAY_COLOR,
    fontSize: 12,
  },
  pickerItem: {
    color: GRAY_COLOR_DARK,
    fontSize: 12,
  },
  icon: {
    position: 'absolute',
    insetBlock: 0,
    left: 10,
    textAlignVertical: 'center',
  },
});
