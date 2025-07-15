import { ImageField } from '@/components/fields/ImageField';
import { InputField } from '@/components/fields/InputField';
import { PromotionsContext } from '@/contexts/PromotionsContext';
import type { Promotion } from '@/interfaces/Promotion';
import { toFormData } from '@/utils/toFormData';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { memo, use, useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';
import { BaseModal } from './BaseModal';

type Action = 'Actualizar' | 'Agregar';

interface PromotionModalProps {
  data?: Promotion;
  action: Action;
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
}

const defaultValues = { imagen: '', nombre: '' };

export const PromotionModal = memo(
  ({ data, action, isVisible, setIsVisible }: PromotionModalProps) => {
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
    } = useForm({ defaultValues });

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

    const showErrorAlert = () => {
      Alert.alert('Mensaje del sistema', 'Por favor, complete todos los campos obligatorios.');
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
      setSelectedImage(null);
      clearErrors();
      reset(defaultValues);
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
        reset(defaultValues);
      }
    }, [data]);

    return (
      <BaseModal
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
        title={`${action} promoción`}
        subtitle="Recuerde que todos los campos son obligatorios."
        maxHeight="45%"
        actionButtonLabel={action}
        onActionButtonPress={handleSubmit(onSubmit, showErrorAlert)}
        isActionButtonLoading={isLoading}
      >
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
            validate: {
              noWhitespace: (value: string) =>
                value.trim() !== '' || 'El nombre no puede estar vacío',
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
      </BaseModal>
    );
  },
);
