import { GRAY_COLOR, GRAY_COLOR_DARK, GRAY_COLOR_LIGHT } from '@/constants/Colors';
import { BODY_FONT } from '@/constants/Fonts';
import { globalStyles } from '@/globalStyles';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';
import React, { memo, type Dispatch, type SetStateAction } from 'react';
import { Controller } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';

interface OptionValue {
  nombre: string;
  _id: string;
}

interface OptionsPicker {
  label: string;
  value: OptionValue | string;
}

interface PickerFieldProps {
  control: any;
  name: string;
  rules: any;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  options: OptionsPicker[];
  onSelect?: Dispatch<SetStateAction<OptionValue>> | Dispatch<SetStateAction<string>>;
  prompt: string;
  error: string;
}

export const PickerField = memo(
  ({ control, name, rules, icon, label, options, onSelect, prompt, error }: PickerFieldProps) => {
    return (
      <View style={styles.pickerContainer}>
        <Text style={globalStyles.labelText}>
          {label}
          <Text style={globalStyles.requiredMark}> *</Text>
        </Text>
        <Controller
          control={control}
          name={name}
          rules={rules}
          render={({ field: { onChange, onBlur, value } }) => {
            const color = value ? GRAY_COLOR_DARK : error ? 'red' : GRAY_COLOR;
            const iconColor = error ? 'red' : GRAY_COLOR_DARK;

            return (
              <View style={styles.pickerSelect}>
                <Picker
                  style={{ color, marginLeft: 17 }}
                  selectedValue={value}
                  onValueChange={itemValue => {
                    onChange(typeof itemValue === 'string' ? itemValue : itemValue._id);
                    onSelect && onSelect(itemValue);
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
                  {options.map(({ label, value }) => (
                    <Picker.Item
                      key={typeof value === 'string' ? value : value._id}
                      value={value}
                      label={label}
                      style={styles.pickerItem}
                    />
                  ))}
                </Picker>
                <MaterialCommunityIcons
                  style={styles.icon}
                  name={icon}
                  color={iconColor}
                  size={16}
                />
              </View>
            );
          }}
        />
        {error && <Text style={globalStyles.errorText}>{error}</Text>}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  pickerContainer: {
    rowGap: 3,
    flex: 1,
  },
  pickerSelect: {
    backgroundColor: GRAY_COLOR_LIGHT,
    fontFamily: BODY_FONT,
    fontSize: 12,
    borderRadius: 10,
  },
  defaultPickerItem: {
    color: GRAY_COLOR,
    fontFamily: BODY_FONT,
    fontSize: 12,
  },
  pickerItem: {
    color: GRAY_COLOR_DARK,
    fontFamily: BODY_FONT,
    fontSize: 12,
  },
  icon: {
    position: 'absolute',
    insetBlock: 0,
    left: 10,
    textAlignVertical: 'center',
  },
});
