import { ImageField } from '@/components/fields/ImageField';
import { InputField } from '@/components/fields/InputField';
import { MultipleCheckBoxField } from '@/components/fields/MultipleCheckBoxField';
import { PickerField } from '@/components/fields/PickerField';
import { CategoriesContext } from '@/contexts/CategoryContext';
import { IngredientsContext } from '@/contexts/IngredientsContext';
import { ProductsContext } from '@/contexts/ProductsContext';
import type { Ingredient } from '@/interfaces/Ingredient';
import type { Product } from '@/interfaces/Product';
import { capitalizeWord } from '@/utils/textTransform';
import { toFormData } from '@/utils/toFormData';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { memo, use, useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, StyleSheet, View } from 'react-native';
import { BaseModal } from './BaseModal';

type Action = 'Visualizar' | 'Actualizar' | 'Agregar';

interface ProductModalProps {
  product?: Product;
  action?: Action;
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
}

const defaultValues = {
  nombre: '',
  descripcion: '',
  beneficios: '',
  id_categoria: '',
  precio: '',
  stock: '',
  imagen: '',
  ingredientes: [] as string[],
  aroma: '',
  tipo: '',
};

export const ProductModal = memo(
  ({ product, action = 'Agregar', isVisible, setIsVisible }: ProductModalProps) => {
    const [typeValues, setTypeValues] = useState<string[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [newCategory, setNewCategory] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [essences, setEssences] = useState<Ingredient[]>([]);
    const [aromas, setAromas] = useState<Ingredient[]>([]);
    const { ingredients } = use(IngredientsContext);
    const { categories } = use(CategoriesContext);
    const { createProduct, updateProduct } = use(ProductsContext);
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
          ? await createProduct(formData)
          : await updateProduct(product!._id, formData);

      Alert.alert('Mensaje del sistema', msg);
      setIsLoading(false);
      setIsVisible(false);

      reset(defaultValues);
    };

    useEffect(() => {
      if (newCategory) setValue('tipo', '');
    }, [newCategory]);

    useEffect(() => {
      const nombre =
        categories.find(({ _id }) => _id === selectedCategoryId)?.nombre.toLowerCase() ?? '';

      if (nombre === 'jabones artesanales') {
        setTypeValues(['Piel Seca', 'Piel Grasa', 'Piel Mixta']);
      } else if (nombre === 'velas artesanales') {
        setTypeValues(['Decorativa', 'Aromatizante', 'Humidificación']);
      }

      const categoriaAnterior = product?.id_categoria?._id ?? product?.id_categoria;

      if (categoriaAnterior !== selectedCategoryId) setValue('tipo', '');
    }, [selectedCategoryId, categories]);

    useEffect(() => {
      clearErrors();
      if (product) {
        const {
          imagen,
          nombre,
          descripcion,
          beneficios,
          id_categoria,
          precio,
          stock,
          ingredientes,
          aroma,
          tipo,
        } = product;
        const categoryId = id_categoria?._id ?? id_categoria ?? '';

        setSelectedImage(imagen);
        setSelectedCategoryId(categoryId);

        reset({
          imagen,
          nombre,
          descripcion,
          beneficios: beneficios.join(';'),
          precio: precio.toString(),
          stock: stock.toString(),
          aroma,
          tipo,
          id_categoria: categoryId,
          ingredientes: ingredientes.map((i: any) => i?._id ?? i),
        });
      } else {
        setSelectedImage(null);
        reset(defaultValues);
      }
    }, [product]);

    useEffect(() => {
      const essencesFounded: Ingredient[] = [];
      const aromasFounded: Ingredient[] = [];

      ingredients.forEach((ingredient: Ingredient) => {
        const { tipo } = ingredient;
        if (tipo === 'esencia') essencesFounded.push(ingredient);
        else if (tipo === 'aroma') aromasFounded.push(ingredient);
      });

      setEssences(essencesFounded);
      setAromas(aromasFounded);
    }, [ingredients]);

    return (
      <BaseModal
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
        title={`${action} producto`}
        subtitle={
          action !== 'Visualizar' ? 'Recuerde que todos los campos son obligatorios.' : undefined
        }
        actionButtonLabel={action}
        onActionButtonPress={handleSubmit(onSubmit, showErrorAlert)}
        isActionButtonLoading={isLoading}
        hideActionButton={action === 'Visualizar'}
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
          name="nombre"
          rules={{
            required: 'Este campo es obligatorio',
            pattern: {
              value: /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]{3,25}$/,
              message: 'El nombre debe tener entre 3 y 25 letras y solo letras',
            },
            validate: {
              noWhitespaceOnly: (value: string) =>
                value.trim() !== '' || 'El nombre no puede estar vacío',
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
                value: /^(100(\.0{1,2})?|\d{1,2}(\.\d{1,2})?)$/,
                message: 'El precio debe ser un número válido y con punto decimal',
              },
              min: {
                value: 0.49,
                message: 'El precio debe ser mayor a $ 0.49',
              },
              max: {
                value: 100,
                message: 'El precio no puede ser mayor a $ 100.00',
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
          name="aroma"
          rules={{ required: 'Este campo es obligatorio' }}
          icon="flower"
          label="Aroma"
          options={aromas.map(({ nombre }) => ({
            optionLabel: capitalizeWord(nombre),
            optionValue: nombre,
          }))}
          prompt="Seleccionar aroma"
          error={errors.aroma?.message as string}
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
            validate: {
              noWhitespaceOnly: (value: string) =>
                value.trim() !== '' || 'La descripción no puede estar vacía',
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

        <InputField
          control={control}
          name="beneficios"
          rules={{
            required: 'Este campo es obligatorio',
            pattern: {
              message:
                'Los beneficios deben ser 3, separados por punto y coma y tener entre 10 y 100 caracteres cada uno',
              value: /^[^;]{10,100};\s*[^;]{10,100};\s*[^;]{10,100}$/,
            },
            validate: {
              noWhitespaceOnly: (value: string) =>
                value.trim() !== '' || 'Los beneficios no pueden estar vacíos',
            },
          }}
          icon="script-text"
          label="Beneficios (separados por punto y coma)"
          placeholder="Ej: Aroma relajante; ayuda a dormir mejor; reduce el estrés"
          error={errors.beneficios?.message as string}
          autoComplete="off"
          autoCapitalize="sentences"
          multiline
          numberOfLines={4}
        />

        <PickerField
          control={control}
          name="id_categoria"
          rules={{ required: 'Este campo es obligatorio' }}
          icon="tag"
          label="Categoría"
          options={categories.map(({ _id, nombre }) => ({
            optionLabel: nombre,
            optionValue: _id,
          }))}
          onSelect={setSelectedCategoryId}
          changeSelect={setNewCategory}
          prompt="Seleccionar categoría"
          error={errors.id_categoria?.message as string}
        />

        <PickerField
          control={control}
          name="tipo"
          rules={{ required: 'Este campo es obligatorio' }}
          icon="leaf"
          label="Tipo"
          options={typeValues.map(type => ({
            optionLabel: type,
            optionValue: type.toLowerCase(),
          }))}
          prompt="Seleccionar tipo"
          error={errors.tipo?.message as string}
        />

        <MultipleCheckBoxField
          control={control}
          name="ingredientes"
          rules={{
            validate: {
              minLength: (value: any[]) => value.length > 1 || 'Este campo es obligatorio',
            },
            required: 'Este campo es obligatorio',
          }}
          label="Ingredientes (se requiere 2)"
          error={errors.ingredientes?.message as string}
          options={essences.map(({ _id, nombre }) => ({
            optionLabel: capitalizeWord(nombre),
            optionValue: _id,
          }))}
        />
      </BaseModal>
    );
  },
);

const styles = StyleSheet.create({
  rowInputs: {
    flexDirection: 'row',
    columnGap: 10,
    width: '100%',
  },
});
