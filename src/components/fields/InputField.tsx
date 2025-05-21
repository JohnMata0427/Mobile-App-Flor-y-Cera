import {
  GRAY_COLOR,
  GRAY_COLOR_DARK,
  GRAY_COLOR_LIGHT,
  PRIMARY_COLOR,
} from '@/constants/Colors';
import { BODY_FONT } from '@/constants/Fonts';
import { globalStyles } from '@/globalStyles';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { memo } from 'react';
import { Controller } from 'react-hook-form';
import { StyleSheet, Text, TextInput, View } from 'react-native';

interface InputFieldProps {
  control: any;
  name: string;
  rules: any;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  placeholder: string;
  error: string;
  autoComplete?: any;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  textContentType?: any;
  keyboardType?: any;
  multiline?: boolean;
  numberOfLines?: number;
  secureTextEntry?: boolean;
  showPasswordIcon?: React.ReactNode;
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
    showPasswordIcon,
  }: InputFieldProps) => {
    const color = error ? 'red' : GRAY_COLOR_DARK;
    const beneficiosField = name === 'beneficios';

    return (
      <View style={styles.inputContainer}>
        <Text style={globalStyles.labelText}>
          {label}
          <Text style={globalStyles.requiredMark}> *</Text>
        </Text>
        <Controller
          control={control}
          name={name}
          rules={rules}
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <TextInput
                style={[styles.textInput, { color }]}
                placeholder={placeholder}
                placeholderTextColor={error ? 'red' : GRAY_COLOR}
                onChangeText={
                  beneficiosField ? text => onChange(text.split(',')) : onChange
                }
                onBlur={onBlur}
                value={beneficiosField ? value.join(',') : value}
                autoComplete={autoComplete}
                autoCapitalize={autoCapitalize}
                textContentType={textContentType}
                keyboardType={keyboardType}
                multiline={multiline}
                numberOfLines={numberOfLines}
                textAlignVertical="top"
                secureTextEntry={secureTextEntry}
                selectionColor={PRIMARY_COLOR}
              />
              <MaterialCommunityIcons
                style={styles.icon}
                name={icon}
                color={color}
                size={16}
              />
              {showPasswordIcon}
            </View>
          )}
        />
        {error && <Text style={globalStyles.errorText}>{error}</Text>}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  inputContainer: {
    rowGap: 3,
    flex: 1,
  },
  textInput: {
    backgroundColor: GRAY_COLOR_LIGHT,
    fontFamily: BODY_FONT,
    fontSize: 12,
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
