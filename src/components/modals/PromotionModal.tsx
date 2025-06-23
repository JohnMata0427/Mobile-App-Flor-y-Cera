import { ImageField } from '@/components/fields/ImageField';
import { InputField } from '@/components/fields/InputField';
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
import { useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Action = 'Actualizar' | 'Agregar';

export function PromotionModal({
  data,
  action,
  isVisible,
  setIsVisible,
}: {
  data?: Promotion;
  action: Action;
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
      style={styles.modalContainer}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={styles.modalContainer}
      >
        <Text style={styles.titleText}>{action} promoción</Text>
        <Text style={styles.subtitleText}>Todos los campos son obligatorios</Text>
        <ImageField
          control={control}
          name="imagen"
          rules={{ required: 'Debe seleccionar una imagen' }}
          label="Imagen"
          error={errors.imagen?.message as string}
          aspectRatio={16 / 9}
          selectedImage={selectedImage}
          onChange={pickImage}
        />

        <InputField
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
          icon="tag"
          label="Nombre"
          placeholder="Ej: Promoción del 10% para este verano"
          error={errors.nombre?.message as string}
          autoComplete="off"
          autoCapitalize="words"
          textContentType="name"
        />

        <View style={styles.actionRow}>
          <Pressable style={styles.submitButton} onPress={handleSubmit(onSubmit)}>
            {isLoading ? (
              <ActivityIndicator size={14} color="white" />
            ) : (
              <>
                <Text style={styles.submitButtonText}>{action}</Text>
                <MaterialCommunityIcons name="content-save" size={14} color="white" />
              </>
            )}
          </Pressable>
          <Pressable style={styles.cancelButton} onPress={() => setIsVisible(false)}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
            <MaterialCommunityIcons name="close-thick" size={14} color="white" />
          </Pressable>
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  modalContainer: {
    margin: 'auto',
    width: '90%',
    maxHeight: '46%',
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 10,
    backgroundColor: 'white',
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
