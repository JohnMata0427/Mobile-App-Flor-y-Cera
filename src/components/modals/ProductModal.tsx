import { Button } from '@/components/Button';
import { ImageField } from '@/components/fields/ImageField';
import { InputField } from '@/components/fields/InputField';
import { MultipleCheckBoxField } from '@/components/fields/MultipleCheckBoxField';
import { PickerField } from '@/components/fields/PickerField';
import { PRIMARY_COLOR, SECONDARY_COLOR, SECONDARY_COLOR_DARK } from '@/constants/Colors';
import { BODY_FONT } from '@/constants/Fonts';
import { CategoriesContext } from '@/contexts/CategoryContext';
import { IngredientsContext } from '@/contexts/IngredientsContext';
import { ProductsContext } from '@/contexts/ProductsContext';
import type { Ingredient } from '@/interfaces/Ingredient';
import type { Product } from '@/interfaces/Product';
import { toFormData } from '@/utils/toFormData';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { use, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, Modal, ScrollView, StyleSheet, Text, View } from 'react-native';

interface OptionValue {
  nombre: string;
  _id: string;
}

type Action = 'Visualizar' | 'Actualizar' | 'Agregar';

export function ProductModal({
  product,
  action = 'Agregar',
  isVisible,
  setIsVisible,
}: {
  product?: Product;
  action?: Action;
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const isEditable = action !== 'Visualizar';
  const [typeValues, setTypeValues] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<OptionValue>({ nombre: '', _id: '' });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [essences, setEssences] = useState<Ingredient[]>([]);
  const { ingredients } = use(IngredientsContext);
  const { createProduct, updateProduct } = use(ProductsContext);
  const { categories } = use(CategoriesContext);
  const {
    control,
    handleSubmit,
    formState: { errors },
    clearErrors,
    reset,
    setValue,
  } = useForm({
    defaultValues: {
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

    const { msg } =
      action === 'Agregar'
        ? await createProduct(formData)
        : await updateProduct(product!._id, formData);

    Alert.alert('Mensaje del sistema', msg);
    setIsLoading(false);
    setIsVisible(false);
    reset();
  };

  useEffect(() => {
    const nombre = selectedCategory.nombre.toLocaleLowerCase();

    if (nombre === 'jabones artesanales') {
      setTypeValues(['Piel Seca', 'Piel Grasa', 'Piel Mixta']);
    } else if (nombre === 'velas artesanales') {
      setTypeValues(['Decorativa', 'Aromatizante', 'Humidificación']);
    } else {
      setTypeValues([]);
    }
  }, [selectedCategory, categories]);

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
      const categoria = id_categoria?._id ?? id_categoria;

      setSelectedImage(imagen);
      setSelectedCategory({
        nombre: id_categoria?.nombre ?? '',
        _id: categoria,
      });

      setValue('imagen', imagen);
      setValue('nombre', nombre);
      setValue('descripcion', descripcion);
      setValue('beneficios', beneficios.join(','));
      setValue('precio', precio.toString());
      setValue('stock', stock.toString());
      setValue('aroma', aroma);
      setValue('tipo', tipo);
      setValue('id_categoria', categoria);
      setValue(
        'ingredientes',
        ingredientes.map((i: any) => i?._id ?? i),
      );
    } else {
      setSelectedImage(null);
      reset();
    }
  }, [product]);

  useEffect(() => {
    setEssences(ingredients.filter(({ tipo }) => tipo === 'esencia'));
  }, [ingredients]);

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
          <Text style={styles.titleText}>{action} producto</Text>
          {action !== 'Visualizar' && (
            <View style={styles.subtitleContainer}>
              <MaterialCommunityIcons name="information" size={14} color={PRIMARY_COLOR} />
              <Text style={styles.subtitleText}>
                Recuerde que todos los campos son obligatorios.
              </Text>
            </View>
          )}

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
              name="aroma"
              rules={{
                required: 'Este campo es obligatorio',
                pattern: {
                  value: /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]{3,25}$/,
                  message: 'El aroma debe tener entre 3 y 25 letras y solo letras',
                },
              }}
              icon="flower"
              label="Aroma"
              placeholder="Ej: Canela"
              error={errors.aroma?.message as string}
              autoComplete="family-name"
              autoCapitalize="words"
              textContentType="familyName"
            />
            <InputField
              control={control}
              name="precio"
              rules={{
                required: 'Este campo es obligatorio',
                pattern: {
                  value: /^(100(\.0{1,2})?|\d{1,2}(\.\d{1,2})?)$/,
                  message: 'El precio debe ser un número válido',
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
          </View>
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

          <InputField
            control={control}
            name="beneficios"
            rules={{
              required: 'Este campo es obligatorio',
              pattern: {
                message:
                  'Los beneficios deben ser 3, separados por comas y tener entre 10 y 100 caracteres cada uno',
                value: /^[^,]{10,100},\s*[^,]{10,100},\s*[^,]{10,100}$/,
              },
            }}
            icon="script-text"
            label="Beneficios (separados por comas)"
            placeholder="Ej: Aroma relajante, ayuda a dormir mejor"
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
              label: nombre,
              value: { nombre, _id },
            }))}
            onSelect={setSelectedCategory}
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
              label: type,
              value: type.toLowerCase(),
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
            }}
            label="Ingredientes (se requiere 2)"
            error={errors.ingredientes?.message as string}
            options={essences.map(({ _id, nombre }) => ({
              optionLabel: nombre,
              optionValue: _id,
            }))}
          />

          <View style={styles.actionRow}>
            {action !== 'Visualizar' && (
              <Button
                label={action}
                onPress={handleSubmit(onSubmit)}
                disabled={isLoading}
                icon="content-save"
              />
            )}

            <Button
              label="Cancelar"
              icon="close-thick"
              onPress={() => setIsVisible(false)}
              buttonStyle={{
                backgroundColor: SECONDARY_COLOR,
                borderColor: SECONDARY_COLOR_DARK,
              }}
            />
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    margin: 'auto',
    width: '90%',
    maxHeight: '90%',
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
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
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
  rowInputs: {
    flexDirection: 'row',
    columnGap: 10,
    width: '100%',
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 10,
    columnGap: 5,
    justifyContent: 'center',
  },
});
