import { PontanoSans } from '@/constants/Fonts';
import { Text, TextInput, View, type KeyboardTypeOptions } from 'react-native';

export function Field({
  label,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  errorField,
  onChangeText,
  children,
}: {
  label: string;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  errorField: string;
  onChangeText: (text: string) => void;
  children?: React.ReactNode;
}) {
  const color = errorField ? 'red' : 'black';

  return (
    <View style={{ rowGap: 5 }}>
      <Text
        style={{
          fontFamily: PontanoSans.semibold,
          color,
        }}
      >
        {label}
      </Text>
      <View style={{ position: 'relative' }}>
        <TextInput
          style={{
            backgroundColor: 'white',
            borderRadius: 10,
            padding: 10,
            borderWidth: 1,
            borderColor: color,
            color,
            paddingHorizontal: 40,
            fontFamily: PontanoSans.regular,
          }}
          placeholder={placeholder}
          placeholderTextColor={color}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          onChangeText={onChangeText}
        />
        {children}

        {errorField && (
          <Text
            style={{
              color: 'red',
              fontFamily: PontanoSans.regular,
              fontSize: 12,
              marginTop: 3,
            }}
          >
            {errorField}
          </Text>
        )}
      </View>
    </View>
  );
}
