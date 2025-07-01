import { GRAY_COLOR, GRAY_COLOR_DARK, GRAY_COLOR_LIGHT } from '@/constants/Colors';
import { BODY_FONT, BOLD_BODY_FONT } from '@/constants/Fonts';
import { globalStyles } from '@/globalStyles';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { memo } from 'react';
import { Controller } from 'react-hook-form';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

interface ImageFieldProps {
  control: any;
  name: string;
  rules: any;
  label: string;
  aspectRatio?: number;
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
    onChange,
    selectedImage,
  }: ImageFieldProps) => {
    const color = error ? 'red' : GRAY_COLOR_DARK;

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
          render={() => (
            <Pressable style={[styles.imagePickerContainer, { aspectRatio }]} onPress={onChange}>
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
        />
        {error && <Text style={[globalStyles.errorText, { textAlign: 'center' }]}>{error}</Text>}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  inputContainer: {
    rowGap: 3,
    flex: 1,
  },
  imagePickerContainer: {
    borderRadius: 10,
    backgroundColor: GRAY_COLOR_LIGHT,
    borderColor: GRAY_COLOR_LIGHT,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    alignSelf: 'center',
    overflow: 'hidden',
  },
  imageFull: {
    width: '100%',
    height: '100%',
  },
  imageTextBold: {
    fontFamily: BOLD_BODY_FONT,
    fontSize: 12,
  },
  placeholerText: {
    fontFamily: BODY_FONT,
    fontSize: 12,
    textAlign: 'center',
    color: GRAY_COLOR,
  },
});
