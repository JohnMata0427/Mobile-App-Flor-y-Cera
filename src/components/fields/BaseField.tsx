import { globalStyles } from '@/globalStyles';
import { memo, type ReactNode } from 'react';
import {
  Controller,
  type ControllerRenderProps,
  type FieldValues,
  type UseControllerProps,
} from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';

interface BaseFieldProps {
  control: UseControllerProps['control'];
  name: string;
  rules?: UseControllerProps['rules'];
  label?: string;
  error?: string;
  children: (field: ControllerRenderProps<FieldValues, string>) => ReactNode;
}

export const BaseField = memo(
  ({ control, name, rules, label, error, children }: BaseFieldProps) => {
    return (
      <View style={styles.inputContainer}>
        {label && (
          <Text style={globalStyles.labelText}>
            {label}
            {rules?.required && <Text style={globalStyles.requiredMark}> *</Text>}
          </Text>
        )}
        <Controller
          control={control}
          name={name}
          rules={rules}
          render={({ field }) => <>{children(field)}</>}
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
});
