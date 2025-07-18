import { GRAY_COLOR, GRAY_COLOR_DARK, GRAY_COLOR_LIGHT } from '@/constants/Colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { memo } from 'react';
import type { FieldValues, RegisterOptions } from 'react-hook-form';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  type DimensionValue,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { BaseField } from './BaseField';

interface ImageFieldProps {
  control: any;
  name: string;
  rules?: Omit<
    RegisterOptions<FieldValues, string>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs'
  >;
  label?: string;
  aspectRatio?: number;
  width?: DimensionValue;
  style?: StyleProp<ViewStyle>;
  onChange: () => void;
  selectedImage: string | null;
  error: string;
}

export const ImageField = memo(
  ({
    control,
    name,
    rules,
    label,
    error,
    aspectRatio = 1,
    width = '80%',
    style,
    onChange,
    selectedImage,
  }: ImageFieldProps) => {
    const color = error ? 'red' : GRAY_COLOR_DARK;

    return (
      <BaseField control={control} name={name} rules={rules} label={label} error={error}>
        {() => (
          <Pressable
            style={[styles.imagePickerContainer, { aspectRatio, width }, style]}
            onPress={onChange}
          >
            {selectedImage ? (
              <Image
                source={{ uri: selectedImage }}
                style={styles.imageFull}
                resizeMode="contain"
              />
            ) : (
              <>
                <MaterialCommunityIcons name="camera-iris" size={20} color={color} />
                <Text style={[styles.imageTextBold, { color }]}>Agrega una imagen</Text>
                <Text style={styles.placeholerText}>Toca para seleccionar una imagen</Text>
              </>
            )}
          </Pressable>
        )}
      </BaseField>
    );
  },
);

const styles = StyleSheet.create({
  imagePickerContainer: {
    borderRadius: 10,
    backgroundColor: GRAY_COLOR_LIGHT,
    borderColor: GRAY_COLOR_LIGHT,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    overflow: 'hidden',
  },
  imageFull: {
    width: '100%',
    height: '100%',
  },
  imageTextBold: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  placeholerText: {
    fontSize: 12,
    textAlign: 'center',
    color: GRAY_COLOR,
  },
});
