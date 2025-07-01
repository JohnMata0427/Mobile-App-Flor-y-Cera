import { globalStyles } from '@/globalStyles';
import { memo, type Dispatch, type SetStateAction } from 'react';
import { Controller } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';

interface ColorFieldProps {
  control: any;
  name: string;
  rules: any;
  label: string;
  error: string;
  setColor: Dispatch<SetStateAction<string>>;
}

export const ColorField = memo(({ control, name, rules, label, error, setColor }: ColorFieldProps) => (
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
        <ColorPicker
          thumbSize={30}
          color={value ?? '#ffffff'}
          onColorChangeComplete={(color) => {
            onChange(color);
            onBlur();
            setColor(color);
          }}
          swatches={false}
          gapSize={1}
          row
        />
      )}
    />
    {error && <Text style={[globalStyles.errorText, { textAlign: 'center' }]}>{error}</Text>}
  </View>
));

const styles = StyleSheet.create({
  inputContainer: {
    rowGap: 3,
    flex: 1,
  },
});
