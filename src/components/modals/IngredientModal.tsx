import { ColorField } from '@/components/fields/ColorField';
import { ImageField } from '@/components/fields/ImageField';
import { InputField } from '@/components/fields/InputField';
import { PickerField } from '@/components/fields/PickerField';
import { CategoriesContext } from '@/contexts/CategoryContext';
import { IngredientsContext } from '@/contexts/IngredientsContext';
import type { Ingredient } from '@/interfaces/Ingredient';
import { getDominantColor } from '@/utils/getDominantColor';
import { toFormData } from '@/utils/toFormData';
import { cacheDirectory, EncodingType, writeAsStringAsync } from 'expo-file-system';
import { launchImageLibraryAsync } from 'expo-image-picker';
import {
  use,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { useForm } from 'react-hook-form';
import { Alert, StyleSheet, View } from 'react-native';
import Canvas from 'react-native-canvas';
import { BaseModal } from './BaseModal';

type Action = 'Visualizar' | 'Actualizar' | 'Agregar';

interface IngredientModalProps {
  ingredient?: Ingredient;
  action?: Action;
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
}

const typesValues = ['Molde', 'Color', 'Esencia', 'Aroma'] as const;
const defaultValues = {
  nombre: '',
  id_categoria: '',
  precio: '',
  stock: '',
  imagen: '',
  tipo: '',
};

export function IngredientModal({
  ingredient,
  action = 'Agregar',
  isVisible,
  setIsVisible,
}: IngredientModalProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<string>('');
  const [color, setColor] = useState<string>('#000000');
  const canvas = useRef<Canvas>(null);
  const { createIngredient, updateIngredient } = use(IngredientsContext);
  const { categories } = use(CategoriesContext);

  const categoryOptions = useMemo(() => {
    const options = [{ optionLabel: 'Ambas categorias', optionValue: 'ambas' }];

    return options.concat(
      categories.map(({ nombre, _id }) => ({
        optionLabel: nombre,
        optionValue: _id,
      })),
    );
  }, [categories]);

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
      aspect: [1, 1],
    });

    if (!canceled) {
      const { uri } = assets[0];
      clearErrors('imagen');
      setValue('imagen', uri);
      setSelectedImage(uri);
    }
  };

  const handleCanvas = async () => {
    const { current } = canvas;

    try {
      if (current) {
        current.width = 200;
        current.height = 200;

        const ctx = current.getContext('2d');

        ctx.clearRect(0, 0, 200, 200);

        ctx.beginPath();
        ctx.arc(200 / 2, 200 / 2, 200 / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();

        const dataUrl = await current.toDataURL();
        const base64 = dataUrl.split(',')[1];

        const fileUri = `${cacheDirectory}color_${Date.now()}.png`;

        await writeAsStringAsync(fileUri, base64, {
          encoding: EncodingType.Base64,
        });

        return fileUri;
      }
    } catch {
      Alert.alert('Mensaje del sistema', 'No se pudo generar la imagen del color seleccionado.');
    }
    return '';
  };

  const showErrorAlert = () => {
    Alert.alert('Mensaje del sistema', 'Por favor, complete todos los campos obligatorios.');
  };

  const onSubmit = async (form: any) => {
    const formData = toFormData(form, selectedImage);

    if (form.id_categoria === 'ambas') {
      formData.delete('id_categoria');

      categories.forEach(({ _id }) => {
        formData.append('id_categoria[]', _id);
      });
    }

    if (form.tipo === 'color') {
      const uri = await handleCanvas();

      formData.set('imagen', {
        uri,
        type: 'image/png',
        name: `color_${Date.now()}.png`,
      } as any);
    }

    setIsLoading(true);

    const { msg } =
      action === 'Agregar'
        ? await createIngredient(formData)
        : await updateIngredient(ingredient!._id, formData);

    Alert.alert('Mensaje del sistema', msg);

    setIsLoading(false);
    setIsVisible(false);
    reset(defaultValues);
  };

  useEffect(() => {
    clearErrors();
    if (ingredient) {
      const { imagen, nombre, id_categoria, precio, stock, tipo } = ingredient;
      const category = id_categoria.length > 1 ? 'ambas' : id_categoria[0];

      setSelectedImage(imagen);
      setSelectedType(tipo);

      reset({
        nombre,
        precio: precio.toString(),
        stock: stock.toString(),
        tipo,
        id_categoria: category,
      });

      if (tipo === 'color') {
        getDominantColor(imagen).then(color => {
          setValue('imagen', color);
        });
      } else {
        setValue('imagen', imagen);
      }
    } else {
      setSelectedImage(null);
      setSelectedType('');
      reset(defaultValues);
    }
  }, [ingredient]);

  return (
    <BaseModal
      isVisible={isVisible}
      onClose={() => setIsVisible(false)}
      title={`${action} ingrediente`}
      subtitle={
        action !== 'Visualizar' ? 'Recuerde que todos los campos son obligatorios.' : undefined
      }
      actionButtonLabel={action}
      onActionButtonPress={handleSubmit(onSubmit, showErrorAlert)}
      isActionButtonLoading={isLoading}
      hideActionButton={action === 'Visualizar'}
    >
      {selectedType === 'color' ? (
        <ColorField
          control={control}
          name="imagen"
          rules={{ required: 'Debe seleccionar un color' }}
          label="Colorante"
          error={errors.imagen?.message as string}
          setColor={setColor}
        />
      ) : (
        <ImageField
          control={control}
          name="imagen"
          rules={{ required: 'Debe seleccionar una imagen' }}
          label="Imagen"
          error={errors.imagen?.message as string}
          selectedImage={selectedImage}
          onChange={pickImage}
        />
      )}

      <View style={styles.colorCanvasContainer}>
        <Canvas ref={canvas} />
      </View>

      <InputField
        control={control}
        name="nombre"
        rules={{
          required: 'Este campo es obligatorio',
          pattern: {
            value: /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]{3,25}$/,
            message: 'El nombre debe tener entre 3 y 25 letras y solo letras',
          },
        }}
        icon="candle"
        label="Nombre"
        placeholder="Ej: Vela de canela"
        error={errors.nombre?.message as string}
        autoComplete="name"
        autoCapitalize="words"
        textContentType="name"
      />

      <View style={styles.rowInputs}>
        <InputField
          control={control}
          name="stock"
          rules={{
            required: 'Este campo es obligatorio',
            pattern: {
              value: /^\d+$/,
              message: 'El stock debe ser un número entero',
            },
            min: {
              value: 1,
              message: 'El stock debe ser al menos 1',
            },
            max: {
              value: 100,
              message: 'El stock no puede ser mayor a 100',
            },
          }}
          icon="cart"
          label="Stock"
          placeholder="Ej: 100"
          error={errors.stock?.message as string}
          autoComplete="off"
          keyboardType="numeric"
        />
        <InputField
          control={control}
          name="precio"
          rules={{
            required: 'Este campo es obligatorio',
            pattern: {
              value: /^(20(\.0{1,2})?|\d{1,2}(\.\d{1,2})?)$/,
              message: 'El precio debe ser un número válido',
            },
            min: {
              value: 0.49,
              message: 'El precio debe ser mayor a $ 0.49',
            },
            max: {
              value: 20,
              message: 'El precio no puede ser mayor a $ 20.00',
            },
          }}
          icon="currency-usd"
          label="Precio"
          placeholder="Ej: 5.49"
          error={errors.precio?.message as string}
          autoComplete="off"
          keyboardType="numeric"
        />
      </View>

      <PickerField
        control={control}
        name="id_categoria"
        rules={{ required: 'Este campo es obligatorio' }}
        icon="tag"
        label="Categoría"
        options={categoryOptions}
        prompt="Seleccionar categoría"
        error={errors.id_categoria?.message as string}
      />

      <PickerField
        control={control}
        name="tipo"
        rules={{ required: 'Este campo es obligatorio' }}
        icon="shape"
        label="Tipo"
        options={typesValues.map(type => ({
          optionLabel: type,
          optionValue: type.toLowerCase(),
        }))}
        onSelect={setSelectedType}
        prompt="Seleccionar tipo"
        error={errors.tipo?.message as string}
      />
    </BaseModal>
  );
}

const styles = StyleSheet.create({
  rowInputs: {
    flexDirection: 'row',
    columnGap: 10,
    width: '100%',
  },
  colorCanvasContainer: { width: 0, height: 0, opacity: 0 },
});
