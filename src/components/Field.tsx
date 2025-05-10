import { PRIMARY_COLOR } from '@/constants/Colors';
import { BODY_FONT, BOLD_BODY_FONT } from '@/constants/Fonts';
import { Text, TextInput, View, type KeyboardTypeOptions } from 'react-native';

export function Field({
  label,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  textContentType = 'none',
  errorField,
  onChangeText,
  children,
}: {
  label: string;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  textContentType?: 'none' | 'emailAddress' | 'password' | 'username';
  errorField: string;
  onChangeText: (text: string) => void;
  children?: React.ReactNode;
}) {
  const color = errorField ? 'red' : 'black';

  return (
    <View style={{ rowGap: 5 }}>
      <Text
        style={{
          fontFamily: BOLD_BODY_FONT,
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
            fontFamily: BODY_FONT,
          }}
          placeholder={placeholder}
          placeholderTextColor={errorField ? 'red' : '#AFAFAF'}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          onChangeText={onChangeText}
          textContentType={textContentType}
          autoCapitalize="none"
          autoCorrect={false}
          selectionColor={PRIMARY_COLOR}
        />
        {children}

        {errorField && (
          <Text
            style={{
              color: 'red',
              fontFamily: BODY_FONT,
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
