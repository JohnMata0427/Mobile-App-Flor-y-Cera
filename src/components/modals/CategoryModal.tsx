import { ImageField } from '@/components/fields/ImageField';
import { InputField } from '@/components/fields/InputField';
import {
  PRIMARY_COLOR,
  PRIMARY_COLOR_DARK,
  SECONDARY_COLOR,
  SECONDARY_COLOR_DARK,
} from '@/constants/Colors';
import { BODY_FONT, BOLD_BODY_FONT } from '@/constants/Fonts';
import { CategoriesContext } from '@/contexts/CategoryContext';
import type { Category } from '@/interfaces/Category';
import { toFormData } from '@/utils/toFormData';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { use, useEffect, useState, type Dispatch, type SetStateAction } from 'react';
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

interface CategoryModalProps {
  category: Category;
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
}

export function CategoryModal({ category, isVisible, setIsVisible }: CategoryModalProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { updateCategory } = use(CategoriesContext);
  const {
    control,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setValue,
  } = useForm({
    defaultValues: {
      imagen: '',
      descripcion: '',
    },
  });

  const pickImage = async () => {
    const { canceled, assets } = await launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
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

    const { msg } = await updateCategory(category._id, formData);

    alert(msg);
    setIsLoading(false);
    setIsVisible(false);
  };

  useEffect(() => {
    clearErrors();
    const { imagen, descripcion } = category;
    setSelectedImage(imagen);
    setValue('imagen', imagen);
    setValue('descripcion', descripcion);
  }, [category]);

  return (
    <Modal
      animationType="slide"
      visible={isVisible}
      backdropColor={'rgba(0, 0, 0, 0.1)'}
      onRequestClose={() => setIsVisible(!isVisible)}
      style={styles.modalContainer}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} style={styles.modalContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.titleText}>Actualizar {category.nombre?.toLowerCase()}</Text>
          <View style={styles.subtitleContainer}>
            <MaterialCommunityIcons name="information" size={14} color={PRIMARY_COLOR} />
            <Text style={styles.subtitleText}>Recuerde que todos los campos son obligatorios.</Text>
          </View>

          <ImageField
            control={control}
            name="imagen"
            rules={{ required: 'Debe seleccionar una imagen' }}
            label="Imagen"
            error={errors.imagen?.message as string}
            selectedImage={selectedImage}
            onChange={pickImage}
          />

          <InputField
            control={control}
            name="descripcion"
            rules={{
              required: 'Este campo es obligatorio',
              pattern: {
                message:
                  'La descripcion debe tener al menos 10 letras y como máximo 500 caracteres de cualquier tipo',
                value: /^(?=(.*[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ]){10})[\s\S]{10,500}$/,
              },
            }}
            icon="script-text"
            label="Descripción"
            placeholder="Ej: Vela natural con aroma a canela, ideal para relajarse, meditar y dormir mejor."
            error={errors.descripcion?.message as string}
            autoComplete="off"
            autoCapitalize="sentences"
            multiline
            numberOfLines={4}
          />

          <View style={styles.actionRow}>
            <Pressable style={styles.submitButton} onPress={handleSubmit(onSubmit)}>
              {isLoading ? (
                <ActivityIndicator size={14} color="white" />
              ) : (
                <>
                  <Text style={styles.submitButtonText}>Actualizar</Text>
                  <MaterialCommunityIcons name="content-save" size={14} color="white" />
                </>
              )}
            </Pressable>
            <Pressable style={styles.cancelButton} onPress={() => setIsVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
              <MaterialCommunityIcons name="close-thick" size={14} color="white" />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  modalContainer: {
    margin: 'auto',
    width: '90%',
    maxHeight: '62%',
    borderRadius: 10,
    backgroundColor: 'white',
  },
  formContainer: {
    rowGap: 5,
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  titleText: {
    fontFamily: BOLD_BODY_FONT,
    fontSize: 18,
    textAlign: 'center',
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5,
    justifyContent: 'center',
  },
  subtitleText: {
    fontFamily: BODY_FONT,
    fontSize: 12,
    textAlign: 'center',
    color: PRIMARY_COLOR,
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
