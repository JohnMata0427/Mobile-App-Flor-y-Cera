import { GRAY_COLOR_DARK, GRAY_COLOR_LIGHT } from '@/constants/Colors';
import { toLocaleDate } from '@/utils/toLocaleDate';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { memo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BaseField } from './BaseField';

interface DateTimeInputProps {
  control: any;
  name: string;
  rules?: any;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  error: string;
}

export const DateTimeInput = memo(
  ({ control, name, rules, icon, label, error }: DateTimeInputProps) => {
    const color = error ? 'red' : GRAY_COLOR_DARK;
    const [showModal, setShowModal] = useState(false);

    return (
      <BaseField control={control} name={name} rules={rules} label={label} error={error}>
        {({ onChange, onBlur, value }) => {
          return (
            <View>
              <Text style={[styles.textInput, { color }]} onPress={() => setShowModal(true)}>
                {value ? toLocaleDate(value) : 'Seleccionar fecha'}
              </Text>
              <MaterialCommunityIcons style={styles.icon} name={icon} color={color} size={16} />
              {showModal && (
                <RNDateTimePicker
                  value={new Date(value || Date.now())}
                  mode="date"
                  display="default"
                  onChange={(_, date) => {
                    setShowModal(false);
                    if (date) {
                      onChange(date.toISOString().split('T')[0]);
                      onBlur();
                    }
                  }}
                />
              )}
            </View>
          );
        }}
      </BaseField>
    );
  },
);

const styles = StyleSheet.create({
  textInput: {
    backgroundColor: GRAY_COLOR_LIGHT,
    borderRadius: 10,
    paddingVertical: 10,
    paddingRight: 10,
    paddingLeft: 30,
  },
  icon: {
    position: 'absolute',
    insetBlock: 0,
    left: 8,
    textAlignVertical: 'center',
  },
});
