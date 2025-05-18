import {
  PRIMARY_COLOR,
  PRIMARY_COLOR_DARK,
  SECONDARY_COLOR,
  SECONDARY_COLOR_DARK,
} from '@/constants/Colors';
import { BODY_FONT, BOLD_BODY_FONT } from '@/constants/Fonts';
import { PromotionsContext } from '@/contexts/PromotionsContext';
import type { Promotion } from '@/interfaces/Promotion';
import { toFormData } from '@/utils/toFormData';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { use, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Action = 'Visualizar' | 'Actualizar' | 'Agregar';

export function PromotionModal({
  data,
  action = 'Agregar',
  isVisible,
  setIsVisible,
}: {
  data?: Promotion;
  action?: Action;
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { createPromotion, updatePromotion } = use(PromotionsContext);
  const {
    control,
    handleSubmit,
    formState: { errors },
    clearErrors,
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      imagen: '',
      nombre: '',
    },
  });

  const pickImage = async () => {
    const { canceled, assets } = await launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [16, 9],
    });

    if (!canceled) {
      const { uri } = assets[0];
      setSelectedImage(uri);
      setValue('imagen', uri);
      clearErrors('imagen');
    }
  };

  const onSubmit = async (form: any) => {
    const formData = toFormData(form, selectedImage);

    setIsLoading(true);

    const { msg } =
      action === 'Agregar'
        ? await createPromotion(formData)
        : await updatePromotion(data!._id, formData);

    alert(msg);
    setIsLoading(false);
    setIsVisible(false);
  };

  useEffect(() => {
    clearErrors();
    if (data) {
      const { imagen, nombre } = data;
      setSelectedImage(imagen);
      setValue('imagen', imagen);
      setValue('nombre', nombre);
    } else {
      setSelectedImage(null);
      reset();
    }
  }, [data]);

  return (
    <Modal
      animationType="slide"
      visible={isVisible}
      backdropColor={'rgba(0, 0, 0, 0.1)'}
      onRequestClose={() => setIsVisible(!isVisible)}
    >
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollContent}
        style={styles.modalContainer}
      >
        <View style={styles.formContainer}>
          <Text style={styles.titleText}>{action} promoción</Text>
          <Text style={styles.subtitleText}>
            Todos los campos son obligatorios
          </Text>
          <Controller
            control={control}
            name="imagen"
            rules={{ required: 'Debe seleccionar una imagen' }}
            render={() => {
              const { message = '' } = errors.imagen || {};
              const color = message ? 'red' : 'black';

              return (
                <View style={styles.fieldContainer}>
                  <Text style={styles.labelText}>
                    Imagen <Text style={styles.requiredMark}>*</Text>
                  </Text>
                  <Pressable
                    style={[
                      styles.imagePickerContainer,
                      { borderColor: color },
                    ]}
                    onPress={pickImage}
                  >
                    {selectedImage ? (
                      <Image
                        source={{ uri: selectedImage }}
                        style={styles.imageFull}
                        resizeMode="cover"
                      />
                    ) : (
                      <>
                        <MaterialCommunityIcons
                          name="camera-iris"
                          size={20}
                          color={color}
                        />
                        <Text style={[styles.imageTextBold, { color }]}>
                          Agrega una imagen
                        </Text>
                        <Text style={styles.subtitleText}>
                          Toca para seleccionar una imagen
                        </Text>
                      </>
                    )}
                  </Pressable>
                  {message && (
                    <Text style={[styles.errorText, styles.textCenter]}>
                      {message as string}
                    </Text>
                  )}
                </View>
              );
            }}
          />

          <Controller
            control={control}
            name="nombre"
            rules={{
              required: 'Este campo es obligatorio',
              minLength: {
                value: 3,
                message: 'El nombre debe tener al menos 3 caracteres',
              },
              pattern: {
                value: /^(?=.*[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]).{8,}$/,
                message: 'El nombre debe contener al menos 8 letras',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => {
              const { message = '' } = errors.nombre || {};
              const color = message ? 'red' : 'black';

              return (
                <View style={styles.fieldContainer}>
                  <Text style={styles.labelText}>
                    Nombre <Text style={styles.requiredMark}>*</Text>
                  </Text>
                  <TextInput
                    style={[
                      styles.inputContainer,
                      { borderColor: color, color },
                    ]}
                    autoCapitalize="words"
                    placeholder="Ej: Promoción del 10% para este verano"
                    placeholderTextColor={message ? 'red' : '#AFAFAF'}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    textContentType="name"
                    selectionColor={PRIMARY_COLOR}
                  />
                  {message && (
                    <Text style={styles.errorText}>{message as string}</Text>
                  )}
                </View>
              );
            }}
          />
          <View style={styles.actionRow}>
            {action !== 'Visualizar' && (
              <Pressable
                style={styles.submitButton}
                onPress={handleSubmit(onSubmit)}
              >
                {isLoading ? (
                  <ActivityIndicator size={14} color="white" />
                ) : (
                  <>
                    <Text style={styles.submitButtonText}>{action}</Text>
                    <MaterialCommunityIcons
                      name="content-save"
                      size={14}
                      color="white"
                    />
                  </>
                )}
              </Pressable>
            )}
            <Pressable
              style={styles.cancelButton}
              onPress={() => setIsVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
              <MaterialCommunityIcons
                name="close-thick"
                size={14}
                color="white"
              />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    margin: 'auto',
    width: '85%',
    maxHeight: '54%',
    borderRadius: 10,
    backgroundColor: 'white',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  formContainer: {
    paddingVertical: 20,
    paddingHorizontal: 30,
    rowGap: 5,
  },
  titleText: {
    fontFamily: BOLD_BODY_FONT,
    fontSize: 18,
    textAlign: 'center',
  },
  subtitleText: {
    fontFamily: BODY_FONT,
    fontSize: 12,
    textAlign: 'center',
    color: '#AFAFAF',
  },
  fieldContainer: {
    rowGap: 3,
  },
  labelText: {
    fontFamily: BOLD_BODY_FONT,
    fontSize: 12,
  },
  requiredMark: {
    color: 'red',
  },
  imagePickerContainer: {
    borderWidth: 1,
    borderRadius: 10,
    borderStyle: 'dashed',
    columnGap: 5,
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 16 / 9,
    width: '100%',
    alignSelf: 'center',
    overflow: 'hidden',
  },
  imageFull: {
    width: '100%',
    height: '100%',
  },
  imageTextBold: {
    fontFamily: BOLD_BODY_FONT,
    textAlign: 'center',
    fontSize: 12,
  },
  imageTextNormal: {
    fontFamily: BODY_FONT,
    fontSize: 12,
    textAlign: 'center',
    color: '#AFAFAF',
  },
  errorText: {
    fontFamily: BODY_FONT,
    fontSize: 12,
    color: 'red',
  },
  textCenter: {
    textAlign: 'center',
  },
  inputContainer: {
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 12,
    borderWidth: 1,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 10,
    columnGap: 5,
    justifyContent: 'center',
  },
  submitButton: {
    backgroundColor: PRIMARY_COLOR,
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    columnGap: 5,
    width: '40%',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: PRIMARY_COLOR_DARK,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },
  submitButtonText: {
    fontFamily: BOLD_BODY_FONT,
    color: 'white',
    fontSize: 12,
  },
  cancelButton: {
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    columnGap: 5,
    width: '40%',
    backgroundColor: SECONDARY_COLOR,
    borderColor: SECONDARY_COLOR_DARK,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontFamily: BOLD_BODY_FONT,
    color: 'white',
    textAlign: 'center',
    fontSize: 12,
  },
});
