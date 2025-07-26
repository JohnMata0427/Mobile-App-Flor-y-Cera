import { GRAY_COLOR, GRAY_COLOR_DARK, GRAY_COLOR_LIGHT, PRIMARY_COLOR } from '@/constants/Colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { memo, type ReactNode } from 'react';
import type { UseControllerProps } from 'react-hook-form';
import type { TextInputProps } from 'react-native';
import { StyleSheet, TextInput, View, type KeyboardTypeOptions } from 'react-native';
import { BaseField } from './BaseField';

interface InputFieldProps {
  control: any;
  name: string;
  rules?: UseControllerProps['rules'];
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  placeholder: string;
  error: string;
  autoComplete?: TextInputProps['autoComplete'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  textContentType?: TextInputProps['textContentType'];
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
  numberOfLines?: number;
  secureTextEntry?: boolean;
  passwordIcon?: ReactNode;
  editable?: boolean;
  fontSize?: number;
  testID?: string;
}

export const InputField = memo(
  ({
    control,
    name,
    rules,
    icon,
    label,
    placeholder,
    error,
    autoComplete,
    autoCapitalize,
    textContentType,
    keyboardType,
    multiline,
    numberOfLines,
    secureTextEntry,
    passwordIcon,
    editable,
    fontSize = 12,
    testID,
  }: InputFieldProps) => {
    const color = error ? 'red' : GRAY_COLOR_DARK;

    return (
      <BaseField control={control} name={name} rules={rules} label={label} error={error}>
        {({ onChange, onBlur, value }) => (
          <View>
            <TextInput
              style={[styles.textInput, { color, fontSize }]}
              placeholder={placeholder}
              placeholderTextColor={error ? 'red' : GRAY_COLOR}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              autoComplete={autoComplete}
              autoCapitalize={autoCapitalize}
              textContentType={textContentType}
              keyboardType={keyboardType}
              multiline={multiline}
              numberOfLines={numberOfLines}
              textAlignVertical="top"
              secureTextEntry={secureTextEntry}
              selectionColor={PRIMARY_COLOR}
              editable={editable}
              testID={testID ?? `input-field-${name}`}
            />
            <MaterialCommunityIcons style={styles.icon} name={icon} color={color} size={16} />
            {passwordIcon}
          </View>
        )}
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
    fontSize: 12,
  },
  icon: {
    position: 'absolute',
    insetBlock: 0,
    left: 8,
    textAlignVertical: 'center',
  },
});
