import { Button } from '@/components/Button';
import { ImageField } from '@/components/fields/ImageField';
import { InputField } from '@/components/fields/InputField';
import { MultipleCheckBoxField } from '@/components/fields/MultipleCheckBoxField';
import { PickerField } from '@/components/fields/PickerField';
import { SECONDARY_COLOR, SECONDARY_COLOR_DARK } from '@/constants/Colors';
import { BODY_FONT, BOLD_BODY_FONT } from '@/constants/Fonts';
import { IngredientsContext } from '@/contexts/IngredientsContext';
import { ProductsContext } from '@/contexts/ProductsContext';
import type { IDCategoria, Product } from '@/interfaces/Product';
import { toFormData } from '@/utils/toFormData';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { use, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, ScrollView, StyleSheet, Text, View } from 'react-native';

type Action = 'Visualizar' | 'Actualizar' | 'Agregar';

export function ProductModal({
  data,
  action = 'Agregar',
  isVisible,
  setIsVisible,
}: {
  data?: Product;
  action?: Action;
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const isEditable = action !== 'Visualizar';
  const [typeValues, setTypeValues] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { ingredients } = use(IngredientsContext);
  const { createProduct, updateProduct } = use(ProductsContext);
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
      beneficios: [] as string[],
      id_categoria: '',
      precio: '',
      stock: '',
      imagen: '',
      descuento: '', // Se debe eliminar este campo en el backend
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
        : await updateProduct(data!._id, formData);

    alert(msg);
    setIsLoading(false);
    setIsVisible(false);
  };

  useEffect(() => {
    if (selectedCategory === '680fd248f613dc80267ba5d7') {
      setTypeValues(['Seca', 'Grasa', 'Mixta']);
    } else if (selectedCategory === '6823a6c096655bcbe4971062') {
      setTypeValues(['Decorativa', 'Relajante', 'Aromatica']);
    } else {
      setTypeValues([]);
    }
  }, [selectedCategory]);

  useEffect(() => {
    clearErrors();
    if (data) {
      const {
        imagen,
        nombre,
        descripcion,
        beneficios,
        id_categoria,
        precio,
        stock,
        descuento,
        ingredientes,
        aroma,
        tipo,
      } = data;
      const categoria = (id_categoria as IDCategoria)?._id ?? id_categoria;

      setSelectedImage(imagen);
      setSelectedCategory(categoria);

      setValue('imagen', imagen);
      setValue('nombre', nombre);
      setValue('descripcion', descripcion);
      setValue('beneficios', beneficios);
      setValue('precio', precio.toString());
      setValue('stock', stock.toString());
      setValue('descuento', descuento.toString());
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
          <Text style={styles.titleText}>{action} producto</Text>
          <Text style={styles.subtitleText}>
            Todos los campos son obligatorios
          </Text>

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
              minLength: {
                value: 3,
                message: 'El nombre debe tener al menos 3 caracteres',
              },
              pattern: {
                value: /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/,
                message: 'El nombre solo debe contener caracteres',
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
                minLength: {
                  value: 3,
                  message: 'El aroma debe tener al menos 3 caracteres',
                },
                pattern: {
                  value: /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/,
                  message: 'El aroma solo debe contener caracteres',
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
                  value: /^\d+(\.\d{1,2})?$/,
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
            <InputField
              control={control}
              name="descuento"
              rules={{
                required: 'Este campo es obligatorio',
                pattern: {
                  value: /^\d+(\.\d{1,2})?$/,
                  message: 'El descuento debe ser un número válido',
                },
                min: {
                  value: 0,
                  message: 'El descuento debe ser mayor a $ 0.00',
                },
                max: {
                  value: 100,
                  message: 'El descuento no puede ser mayor a $ 100.00',
                },
              }}
              icon="sale"
              label="Descuento"
              placeholder="Ej: 5"
              error={errors.descuento?.message as string}
              autoComplete="off"
              keyboardType="numeric"
            />
          </View>
          <InputField
            control={control}
            name="descripcion"
            rules={{
              required: 'Este campo es obligatorio',
              minLength: {
                value: 10,
                message: 'La descripción debe tener al menos 10 caracteres',
              },
              pattern: {
                message: 'La descripcion debe tener al menos 8 letras',
                value: /^(?=.*[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]).{8,}$/,
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
              minLength: {
                value: 10,
                message: 'La descripción debe tener al menos 10 caracteres',
              },
              pattern: {
                message: 'La descripcion debe tener al menos 8 letras',
                value: /^(?=.*[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]).{8,}$/,
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
            options={[
              {
                label: 'Jabones artesanales',
                value: '680fd248f613dc80267ba5d7',
              },
              { label: 'Velas artesanales', value: '6823a6c096655bcbe4971062' },
            ]}
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
              value: type.toLocaleLowerCase(),
            }))}
            prompt="Seleccionar tipo"
            error={errors.tipo?.message as string}
          />

          <MultipleCheckBoxField
            control={control}
            name="ingredientes"
            rules={{
              validate: {
                minLength: (value: any[]) =>
                  value.length > 1 || 'Este campo es obligatorio',
              },
            }}
            label="Ingredientes (se requiere 2)"
            error={errors.ingredientes?.message as string}
            options={ingredients.map(({ _id, nombre }) => ({
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
              onPress={() => setIsVisible(false)}
              disabled={isLoading}
              backgroundColor={SECONDARY_COLOR}
              borderColor={SECONDARY_COLOR_DARK}
              icon="close-thick"
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
    fontWeight: 'bold',
  },
  subtitleText: {
    fontFamily: BODY_FONT,
    fontSize: 12,
    textAlign: 'center',
    color: '#AFAFAF',
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
