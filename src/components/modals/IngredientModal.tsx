import { Button } from '@/components/Button';
import { ImageField } from '@/components/fields/ImageField';
import { InputField } from '@/components/fields/InputField';
import { PickerField } from '@/components/fields/PickerField';
import { PRIMARY_COLOR, SECONDARY_COLOR, SECONDARY_COLOR_DARK } from '@/constants/Colors';
import { BODY_FONT } from '@/constants/Fonts';
import { CategoriesContext } from '@/contexts/CategoryContext';
import { IngredientsContext } from '@/contexts/IngredientsContext';
import type { Ingredient } from '@/interfaces/Ingredient';
import { getDominantColor } from '@/utils/getDominantColor';
import { toFormData } from '@/utils/toFormData';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { use, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ColorField } from '../fields/ColorField';
import ViewShot from 'react-native-view-shot';

const typesValues = ['Molde', 'Color', 'Esencia', 'Aroma'] as const;
type Action = 'Visualizar' | 'Actualizar' | 'Agregar';

interface IngredientModalProps {
  ingredient?: Ingredient;
  action?: Action;
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export function IngredientModal({
  ingredient,
  action = 'Agregar',
  isVisible,
  setIsVisible,
}: IngredientModalProps) {
  const isEditable = action !== 'Visualizar';
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<string>('');
  const { createIngredient, updateIngredient } = use(IngredientsContext);
  const { categories } = use(CategoriesContext);

  const categoryOptions = useMemo(() => {
    const options = [{ label: 'Ambas categorias', value: 'ambas' }];

    return options.concat(
      categories.map(({ nombre, _id }) => ({
        label: nombre,
        value: _id,
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
  } = useForm({
    defaultValues: {
      nombre: '',
      id_categoria: '',
      precio: '',
      stock: '',
      imagen: '',
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

    if (form.id_categoria === 'ambas') {
      formData.delete('id_categoria');

      categories.forEach(({ _id }) => {
        formData.append('id_categoria[]', _id);
      });
    }

    setIsLoading(true);

    const { msg } =
      action === 'Agregar'
        ? await createIngredient(formData)
        : await updateIngredient(ingredient!._id, formData);

    Alert.alert('Mensaje del sistema', msg);
    setIsLoading(false);
    setIsVisible(false);
    reset();
  };

  useEffect(() => {
    clearErrors();
    if (ingredient) {
      const { imagen, nombre, id_categoria, precio, stock, tipo } = ingredient;

      const category = id_categoria.length > 1 ? 'ambas' : id_categoria[0];

      setSelectedImage(imagen);
      setSelectedType(tipo);

      if (tipo === 'color') {
        getDominantColor(imagen).then(color => {
          setValue('imagen', color);
        });
      } else {
        setValue('imagen', imagen);
      }

      setValue('nombre', nombre);
      setValue('precio', precio.toString());
      setValue('stock', stock.toString());
      setValue('tipo', tipo);
      setValue('id_categoria', category);
    } else {
      setSelectedImage(null);
      reset();
    }
  }, [ingredient]);

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
          <Text style={styles.titleText}>{action} ingrediente</Text>
          {action !== 'Visualizar' && (
            <View style={styles.subtitleContainer}>
              <MaterialCommunityIcons name="information" size={14} color={PRIMARY_COLOR} />
              <Text style={styles.subtitleText}>
                Recuerde que todos los campos son obligatorios.
              </Text>
            </View>
          )}

          {selectedType === 'color' ? (
            <ColorField
              control={control}
              name="imagen"
              rules={{ required: 'Debe seleccionar un color' }}
              label="Colorante"
              error={errors.imagen?.message as string}
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
              label: type,
              value: type.toLowerCase(),
            }))}
            onSelect={setSelectedType}
            prompt="Seleccionar tipo"
            error={errors.tipo?.message as string}
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
    maxHeight: '85%',
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

  hiddenCanvas: {
    position: 'absolute',
    width: 1,
    height: 1,
    top: -100,
    left: -100,
  },
});
