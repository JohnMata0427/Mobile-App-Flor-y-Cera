import { memo, type Dispatch, type SetStateAction } from 'react';
import ColorPicker from 'react-native-wheel-color-picker';
import { BaseField } from './BaseField';

interface ColorFieldProps {
  control: any;
  name: string;
  rules: any;
  label: string;
  error: string;
  setColor: Dispatch<SetStateAction<string>>;
}

export const ColorField = memo(
  ({ control, name, rules, label, error, setColor }: ColorFieldProps) => (
    <BaseField control={control} name={name} rules={rules} label={label} error={error}>
      {({ onChange, onBlur, value }) => (
        <ColorPicker
          thumbSize={30}
          color={value ?? '#ffffff'}
          onColorChangeComplete={color => {
            onChange(color);
            onBlur();
            setColor(color);
          }}
          swatches={false}
          gapSize={1}
          row
        />
      )}
    </BaseField>
  ),
);
