import {
  PRIMARY_COLOR,
  PRIMARY_COLOR_DARK,
  SECONDARY_COLOR,
  SECONDARY_COLOR_DARK,
} from '@/constants/Colors';
import { BODY_FONT, BOLD_BODY_FONT } from '@/constants/Fonts';
import { IngredientsContext } from '@/contexts/IngredientsContext';
import { ProductsContext } from '@/contexts/ProductsContext';
import type { IDCategoria, Product } from '@/interfaces/Product';
import { toFormData } from '@/utils/toFormData';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';
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
      descuento: '5', // Se debe eliminar este campo en el backend
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
      setSelectedImage(imagen);
      setSelectedCategory((id_categoria as IDCategoria)?._id ?? id_categoria);

      setValue('imagen', imagen);
      setValue('nombre', nombre);
      setValue('descripcion', descripcion);
      setValue('beneficios', beneficios);
      setValue('precio', precio.toString());
      setValue('stock', stock.toString());
      setValue('descuento', descuento.toString());
      setValue('aroma', aroma);
      setValue('tipo', tipo);
      setValue(
        'ingredientes',
        ingredientes.map((item: any) => item?._id ?? item),
      );
      setValue(
        'id_categoria',
        (id_categoria as IDCategoria)?._id ?? id_categoria,
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
                value: /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/,
                message: 'El nombre solo debe contener caracteres',
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
                    placeholder="Ej: Vela de canela"
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

          <View style={styles.rowInputs}>
            <Controller
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
              render={({ field: { onChange, onBlur, value } }) => {
                const { message = '' } = errors.aroma || {};
                const color = message ? 'red' : 'black';

                return (
                  <View style={[styles.fieldContainer, styles.rowField]}>
                    <Text style={styles.labelText}>
                      Aroma <Text style={styles.requiredMark}>*</Text>
                    </Text>
                    <TextInput
                      style={[
                        styles.inputContainer,
                        { borderColor: color, color },
                      ]}
                      placeholder="Ej: Canela"
                      placeholderTextColor={message ? 'red' : '#AFAFAF'}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      textContentType="name"
                      selectionColor={PRIMARY_COLOR}
                    />
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
              name="precio"
              rules={{
                required: 'Este campo es obligatorio',
                pattern: {
                  value: /^\d+(\.\d{1,2})?$/,
                  message: 'El precio debe ser un número válido',
                },
                min: {
                  value: 0.99,
                  message: 'El precio debe ser mayor a $ 0.99',
                },
                max: {
                  value: 99.99,
                  message: 'El precio no puede ser mayor a $ 99.99',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => {
                const { message = '' } = errors.precio || {};
                const color = message ? 'red' : 'black';

                return (
                  <View style={[styles.fieldContainer, styles.rowField]}>
                    <Text style={styles.labelText}>
                      Precio <Text style={styles.requiredMark}>*</Text>
                    </Text>
                    <TextInput
                      style={[
                        styles.inputContainer,
                        { borderColor: color, color },
                      ]}
                      placeholder="Ej: 9.99"
                      placeholderTextColor={message ? 'red' : '#AFAFAF'}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      textContentType="flightNumber"
                      keyboardType="numeric"
                      selectionColor={PRIMARY_COLOR}
                    />
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
              render={({ field: { onChange, onBlur, value } }) => {
                const { message = '' } = errors.stock || {};
                const color = message ? 'red' : 'black';

                return (
                  <View style={[styles.fieldContainer, styles.rowField]}>
                    <Text style={styles.labelText}>
                      Stock <Text style={styles.requiredMark}>*</Text>
                    </Text>
                    <TextInput
                      style={[
                        styles.inputContainer,
                        { borderColor: color, color },
                      ]}
                      placeholder="Ej: 100"
                      placeholderTextColor={message ? 'red' : '#AFAFAF'}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      keyboardType="numeric"
                      selectionColor={PRIMARY_COLOR}
                    />
                    {message && (
                      <Text style={[styles.errorText, styles.textCenter]}>
                        {message as string}
                      </Text>
                    )}
                  </View>
                );
              }}
            />
          </View>
          <Controller
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
            render={({ field: { onChange, onBlur, value } }) => {
              const { message = '' } = errors.descripcion || {};
              const color = message ? 'red' : 'black';

              return (
                <View style={styles.fieldContainer}>
                  <Text style={styles.labelText}>
                    Descripción <Text style={styles.requiredMark}>*</Text>
                  </Text>
                  <TextInput
                    style={[
                      styles.descriptionInput,
                      { borderColor: color, color },
                    ]}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    placeholder="Ej: Vela natural con aroma a canela, ideal para relajarse, meditar y dormir mejor."
                    placeholderTextColor={message ? 'red' : '#AFAFAF'}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    selectionColor={PRIMARY_COLOR}
                  />
                  {message && (
                    <Text style={styles.errorText}>{message as string}</Text>
                  )}
                </View>
              );
            }}
          />
          <Controller
            control={control}
            name="beneficios"
            rules={{
              validate: {
                minLength: value =>
                  value.length > 1 || 'Este campo es obligatorio',
                maxLength: value =>
                  value.length < 4 || 'No puede agregar más de 3 beneficios',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => {
              const { message = '' } = errors.beneficios || {};
              const color = message ? 'red' : 'black';

              return (
                <View style={styles.fieldContainer}>
                  <Text style={styles.labelText}>
                    Beneficios (separados por coma)
                    <Text style={styles.requiredMark}> *</Text>
                  </Text>
                  <TextInput
                    style={[
                      styles.inputContainer,
                      { borderColor: color, color },
                    ]}
                    placeholder="Ej: Aroma relajante, ayuda a dormir mejor"
                    placeholderTextColor={message ? 'red' : '#AFAFAF'}
                    onChangeText={text => onChange(text.split(','))}
                    onBlur={onBlur}
                    value={value.join(',')}
                    selectionColor={PRIMARY_COLOR}
                  />
                  {message && (
                    <Text style={styles.errorText}>{message as string}</Text>
                  )}
                </View>
              );
            }}
          />
          <Controller
            control={control}
            name="id_categoria"
            rules={{ required: 'Este campo es obligatorio' }}
            render={({ field: { onChange, onBlur, value } }) => {
              const { message = '' } = errors.id_categoria || {};
              const color = message ? 'red' : 'black';

              return (
                <View style={styles.fieldContainer}>
                  <Text style={styles.labelText}>
                    Categoría <Text style={styles.requiredMark}>*</Text>
                  </Text>
                  <View
                    style={[styles.pickerContainer, { borderColor: color }]}
                  >
                    <Picker
                      selectedValue={value}
                      onValueChange={value => {
                        onChange(value);
                        setSelectedCategory(value);
                      }}
                      onBlur={onBlur}
                      style={[styles.picker, { color }]}
                      dropdownIconColor={color}
                      dropdownIconRippleColor={color}
                    >
                      <Picker.Item
                        style={styles.textInput}
                        label="Seleccionar categoría"
                        enabled={false}
                      />
                      <Picker.Item
                        style={styles.textInput}
                        label="Jabones artesanales"
                        value="680fd248f613dc80267ba5d7"
                      />
                      <Picker.Item
                        style={styles.textInput}
                        label="Velas artesanales"
                        value="6823a6c096655bcbe4971062"
                      />
                    </Picker>
                  </View>
                  {message && (
                    <Text style={styles.errorText}>{message as string}</Text>
                  )}
                </View>
              );
            }}
          />
          <Controller
            control={control}
            name="tipo"
            rules={{ required: 'Este campo es obligatorio' }}
            render={({ field: { onChange, onBlur, value } }) => {
              const { message = '' } = errors.tipo || {};
              const color = message ? 'red' : 'black';

              return (
                <View style={styles.fieldContainer}>
                  <Text style={styles.labelText}>
                    Tipo <Text style={styles.requiredMark}>*</Text>
                  </Text>
                  <View
                    style={[styles.pickerContainer, { borderColor: color }]}
                  >
                    <Picker
                      selectedValue={value}
                      onValueChange={onChange}
                      onBlur={onBlur}
                      style={[styles.picker, { color }]}
                      dropdownIconColor={color}
                      dropdownIconRippleColor={color}
                    >
                      <Picker.Item
                        label="Seleccionar tipo"
                        value=""
                        enabled={false}
                        style={styles.textInput}
                      />
                      {typeValues.map(type => (
                        <Picker.Item
                          key={type}
                          style={styles.textInput}
                          label={type}
                          value={type.toLocaleLowerCase()}
                        />
                      ))}
                    </Picker>
                  </View>
                  {message && (
                    <Text style={styles.errorText}>{message as string}</Text>
                  )}
                </View>
              );
            }}
          />

          <Controller
            control={control}
            name="ingredientes"
            rules={{
              validate: {
                minLength: value =>
                  value.length > 1 || 'Este campo es obligatorio',
              },
            }}
            render={({ field: { onChange, value } }) => {
              const { message = '' } = errors.ingredientes || {};

              return (
                <View style={styles.fieldContainer}>
                  <Text style={styles.labelText}>
                    Selecciona dos ingredientes
                    <Text style={styles.requiredMark}> *</Text>
                  </Text>
                  <View>
                    {ingredients.map(({ _id, nombre }) => (
                      <CheckBox
                        key={_id}
                        label={nombre}
                        value={value.includes(_id)}
                        onPress={pressed => {
                          if (pressed && value.length < 2) {
                            onChange([...value, _id]);
                          } else {
                            onChange(value.filter(i => i !== _id));
                          }
                        }}
                      />
                    ))}
                  </View>
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

function CheckBox({
  label,
  value,
  onPress,
}: {
  label: string;
  value: boolean;
  onPress: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <Pressable style={styles.checkbox} onPress={() => onPress(!value)}>
      <MaterialCommunityIcons
        name={value ? 'checkbox-marked' : 'checkbox-blank-outline'}
        size={20}
        color={value ? PRIMARY_COLOR : 'black'}
      />
      <Text style={styles.textInput}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    marginHorizontal: 'auto',
    width: '85%',
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
    aspectRatio: 1,
    width: '85%',
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
  textInput: {
    fontFamily: BODY_FONT,
    fontSize: 12,
  },
  rowInputs: {
    flexDirection: 'row',
    columnGap: 10,
    width: '100%',
  },
  rowField: {
    flex: 1,
  },
  descriptionInput: {
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 12,
    borderWidth: 1,
    fontFamily: BODY_FONT,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 10,
  },
  picker: {
    fontFamily: BODY_FONT,
    fontSize: 12,
  },
  checkboxContainer: {
    rowGap: 3,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
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
