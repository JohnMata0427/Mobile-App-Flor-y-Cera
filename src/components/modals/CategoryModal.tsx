import { ImageField } from '@/components/fields/ImageField';
import { InputField } from '@/components/fields/InputField';
import { CategoriesContext } from '@/contexts/CategoryContext';
import type { Category } from '@/interfaces/Category';
import { toFormData } from '@/utils/toFormData';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { use, useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';
import { BaseModal } from './BaseModal';

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
    reset,
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
      clearErrors('imagen');
      setValue('imagen', uri);
      setSelectedImage(uri);
    }
  };

  const showErrorAlert = () => {
    Alert.alert('Mensaje del sistema', 'Por favor, complete todos los campos obligatorios.');
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
    reset(category);
    setSelectedImage(category.imagen);
  }, [category]);

  return (
    <BaseModal
      isVisible={isVisible}
      onClose={() => setIsVisible(false)}
      title={`Actualizar ${category.nombre?.toLowerCase()}`}
      subtitle="Recuerde que todos los campos son obligatorios."
      maxHeight="65%"
      actionButtonLabel="Actualizar"
      onActionButtonPress={handleSubmit(onSubmit, showErrorAlert)}
      isActionButtonLoading={isLoading}
    >
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
    </BaseModal>
  );
}
