import {
  PRIMARY_COLOR,
  PRIMARY_COLOR_DARK,
  SECONDARY_COLOR,
  SECONDARY_COLOR_DARK,
} from '@/constants/Colors';
import { BODY_FONT, BOLD_BODY_FONT } from '@/constants/Fonts';
import { IngredientsContext } from '@/contexts/IngredientsContext';
import { ProductsContext } from '@/contexts/ProductsContext';
import type { Product } from '@/interfaces/Product';
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
  const [selectedCategory, setSelectedCategory] = useState<string>(
    data?.id_categoria?._id ?? '',
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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

  const toFormData = (data: any) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(item => formData.append(key + '[]', item));
      } else if (key === 'imagen' && selectedImage) {
        const fileType = selectedImage.split('.').pop();
        formData.append('imagen', {
          uri: selectedImage,
          name: `photo.${fileType}`,
          type: `image/${fileType}`,
        } as any);
      } else {
        formData.append(key, value as any);
      }
    });

    return formData;
  };

  const onSubmit = async (form: any) => {
    const formData = toFormData(form);

    setIsLoading(true);

    const { msg } =
      action === 'Agregar'
        ? await createProduct(formData)
        : await updateProduct(data?._id ?? '', formData);

    alert(msg);
    setIsLoading(false);
    setIsVisible(false);
  };

  useEffect(() => {
    if (selectedCategory === '680fd248f613dc80267ba5d7') {
      setTypeValues(['Seca', 'Húmeda', 'Mixta']);
    } else if (selectedCategory === '6823a6c096655bcbe4971062') {
      setTypeValues(['Aroma', 'Decorativa']);
    }
  }, [selectedCategory]);

  useEffect(() => {
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
      setValue('imagen', imagen);
      setValue('nombre', nombre);
      setValue('descripcion', descripcion);
      setValue('beneficios', beneficios);
      setValue('id_categoria', id_categoria._id);
      setValue('precio', precio.toString());
      setValue('stock', stock.toString());
      setValue('descuento', descuento.toString());
      setValue(
        'ingredientes',
        ingredientes.map(({ _id }: any) => _id),
      );
      setValue('aroma', aroma);
      setValue('tipo', tipo);
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
        contentContainerStyle={{ flexGrow: 1 }}
        style={{
          margin: 'auto',
          width: '85%',
          maxHeight: '90%',
          borderRadius: 10,
          backgroundColor: 'white',
        }}
      >
        <View
          style={{
            paddingVertical: 20,
            paddingHorizontal: 30,
            rowGap: 5,
          }}
        >
          <Text
            style={{
              fontFamily: BOLD_BODY_FONT,
              fontSize: 18,
              textAlign: 'center',
            }}
          >
            {action} producto
          </Text>
          <Text
            style={{
              fontFamily: BODY_FONT,
              fontSize: 12,
              textAlign: 'center',
              color: '#AFAFAF',
            }}
          >
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
                <View style={{ rowGap: 3 }}>
                  <Text
                    style={{
                      fontFamily: BOLD_BODY_FONT,
                      fontSize: 12,
                    }}
                  >
                    Imagen <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                  <Pressable
                    style={{
                      borderWidth: 1,
                      borderRadius: 10,
                      borderColor: color,
                      borderStyle: 'dashed',
                      columnGap: 5,
                      alignItems: 'center',
                      justifyContent: 'center',
                      aspectRatio: 1,
                      width: '85%',
                      alignSelf: 'center',
                      overflow: 'hidden',
                    }}
                    onPress={pickImage}
                  >
                    {selectedImage ? (
                      <Image
                        source={{ uri: selectedImage }}
                        style={{ height: '100%', width: '100%' }}
                        resizeMode="cover"
                      />
                    ) : (
                      <>
                        <MaterialCommunityIcons name="camera-iris" size={20} />
                        <Text
                          style={{
                            fontFamily: BOLD_BODY_FONT,
                            textAlign: 'center',
                            fontSize: 12,
                          }}
                        >
                          Agrega una imagen
                        </Text>
                        <Text
                          style={{
                            fontFamily: BODY_FONT,
                            fontSize: 12,
                            textAlign: 'center',
                            color: '#AFAFAF',
                          }}
                        >
                          Toca para seleccionar una imagen
                        </Text>
                      </>
                    )}
                  </Pressable>
                  {message && (
                    <Text
                      style={{
                        fontFamily: BODY_FONT,
                        fontSize: 12,
                        color: 'red',
                        textAlign: 'center',
                      }}
                    >
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
                <View style={{ rowGap: 3 }}>
                  <Text style={{ fontFamily: BOLD_BODY_FONT, fontSize: 12 }}>
                    Nombre <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                  <TextInput
                    style={{
                      borderRadius: 10,
                      paddingHorizontal: 10,
                      fontSize: 12,
                      borderWidth: 1,
                      fontFamily: BODY_FONT,
                      borderColor: color,
                      color,
                    }}
                    placeholder="Ej: Vela de canela"
                    placeholderTextColor={message ? 'red' : '#AFAFAF'}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    textContentType="name"
                    selectionColor={PRIMARY_COLOR}
                  />
                  {message && (
                    <Text
                      style={{
                        fontFamily: BODY_FONT,
                        fontSize: 12,
                        color: 'red',
                      }}
                    >
                      {message as string}
                    </Text>
                  )}
                </View>
              );
            }}
          />

          <View style={{ flexDirection: 'row', columnGap: 10, width: '100%' }}>
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
                  <View style={{ flex: 1, rowGap: 3 }}>
                    <Text style={{ fontFamily: BOLD_BODY_FONT, fontSize: 12 }}>
                      Aroma <Text style={{ color: 'red' }}>*</Text>
                    </Text>
                    <TextInput
                      style={{
                        borderRadius: 10,
                        paddingHorizontal: 10,
                        fontSize: 12,
                        borderWidth: 1,
                        fontFamily: BODY_FONT,
                        borderColor: color,
                        color,
                      }}
                      placeholder="Ej: Canela"
                      placeholderTextColor={message ? 'red' : '#AFAFAF'}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      textContentType="name"
                      selectionColor={PRIMARY_COLOR}
                    />
                    {message && (
                      <Text
                        style={{
                          fontFamily: BODY_FONT,
                          fontSize: 12,
                          color: 'red',
                          textAlign: 'center',
                        }}
                      >
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
                  <View style={{ flex: 1, rowGap: 3 }}>
                    <Text style={{ fontFamily: BOLD_BODY_FONT, fontSize: 12 }}>
                      Precio <Text style={{ color: 'red' }}>*</Text>
                    </Text>
                    <TextInput
                      style={{
                        borderRadius: 10,
                        paddingHorizontal: 10,
                        fontSize: 12,
                        borderWidth: 1,
                        fontFamily: BODY_FONT,
                        borderColor: color,
                        color,
                      }}
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
                      <Text
                        style={{
                          fontFamily: BODY_FONT,
                          fontSize: 12,
                          color: 'red',
                          textAlign: 'center',
                        }}
                      >
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
                  <View style={{ flex: 1, rowGap: 3 }}>
                    <Text style={{ fontFamily: BOLD_BODY_FONT, fontSize: 12 }}>
                      Stock <Text style={{ color: 'red' }}>*</Text>
                    </Text>
                    <TextInput
                      style={{
                        borderRadius: 10,
                        paddingHorizontal: 10,
                        fontSize: 12,
                        borderWidth: 1,
                        fontFamily: BODY_FONT,
                        borderColor: color,
                        color,
                      }}
                      placeholder="Ej: 100"
                      placeholderTextColor={message ? 'red' : '#AFAFAF'}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      keyboardType="numeric"
                      selectionColor={PRIMARY_COLOR}
                    />
                    {message && (
                      <Text
                        style={{
                          fontFamily: BODY_FONT,
                          fontSize: 12,
                          color: 'red',
                          textAlign: 'center',
                        }}
                      >
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
                <View style={{ rowGap: 3 }}>
                  <Text style={{ fontFamily: BOLD_BODY_FONT, fontSize: 12 }}>
                    Descripción <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                  <TextInput
                    style={{
                      borderRadius: 10,
                      paddingHorizontal: 10,
                      fontSize: 12,
                      borderWidth: 1,
                      fontFamily: BODY_FONT,
                      borderColor: color,
                      color,
                    }}
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
                    <Text
                      style={{
                        fontFamily: BODY_FONT,
                        fontSize: 12,
                        color: 'red',
                      }}
                    >
                      {message as string}
                    </Text>
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
                <View style={{ rowGap: 3 }}>
                  <Text style={{ fontFamily: BOLD_BODY_FONT, fontSize: 12 }}>
                    Beneficios (separados por coma)
                    <Text style={{ color: 'red' }}> *</Text>
                  </Text>
                  <TextInput
                    style={{
                      borderRadius: 10,
                      paddingHorizontal: 10,
                      fontSize: 12,
                      borderWidth: 1,
                      fontFamily: BODY_FONT,
                      borderColor: color,
                      color,
                    }}
                    placeholder="Ej: Aroma relajante, ayuda a dormir mejor"
                    placeholderTextColor={message ? 'red' : '#AFAFAF'}
                    onChangeText={text => onChange(text.split(','))}
                    onBlur={onBlur}
                    value={value.join(',')}
                    selectionColor={PRIMARY_COLOR}
                  />
                  {message && (
                    <Text
                      style={{
                        fontFamily: BODY_FONT,
                        fontSize: 12,
                        color: 'red',
                      }}
                    >
                      {message as string}
                    </Text>
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
                <View style={{ rowGap: 3 }}>
                  <Text style={{ fontFamily: BOLD_BODY_FONT, fontSize: 12 }}>
                    Categoría <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                  <View
                    style={{
                      borderWidth: 1,
                      borderRadius: 10,
                      borderColor: color,
                    }}
                  >
                    <Picker
                      selectedValue={value}
                      onValueChange={value => {
                        onChange(value);
                        setSelectedCategory(value);
                      }}
                      onBlur={onBlur}
                      style={{
                        color: color,
                        fontSize: 12,
                        fontFamily: BODY_FONT,
                      }}
                    >
                      <Picker.Item
                        label="Seleccionar categoría"
                        value=""
                        enabled={false}
                        style={{
                          color: '#AFAFAF',
                          fontSize: 12,
                          fontFamily: BODY_FONT,
                        }}
                      />
                      <Picker.Item
                        style={{
                          fontFamily: BODY_FONT,
                          fontSize: 12,
                        }}
                        label="Jabones artesanales"
                        value="680fd248f613dc80267ba5d7"
                      />
                      <Picker.Item
                        style={{
                          fontFamily: BODY_FONT,
                          fontSize: 12,
                        }}
                        label="Velas artesanales"
                        value="6823a6c096655bcbe4971062"
                      />
                    </Picker>
                  </View>
                  {message && (
                    <Text
                      style={{
                        fontFamily: BODY_FONT,
                        fontSize: 12,
                        color: 'red',
                      }}
                    >
                      {message as string}
                    </Text>
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
                <View style={{ rowGap: 3 }}>
                  <Text style={{ fontFamily: BOLD_BODY_FONT, fontSize: 12 }}>
                    Tipo <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                  <View
                    style={{
                      borderWidth: 1,
                      borderRadius: 10,
                      borderColor: color,
                    }}
                  >
                    <Picker
                      selectedValue={value}
                      onValueChange={onChange}
                      onBlur={onBlur}
                      style={{
                        color: color,
                        fontSize: 12,
                        fontFamily: BODY_FONT,
                      }}
                    >
                      <Picker.Item
                        label="Seleccionar tipo"
                        value=""
                        enabled={false}
                        style={{
                          color: '#AFAFAF',
                          fontSize: 12,
                          fontFamily: BODY_FONT,
                        }}
                      />
                      {typeValues.map(type => (
                        <Picker.Item
                          key={type}
                          style={{
                            fontFamily: BODY_FONT,
                            fontSize: 12,
                          }}
                          label={type}
                          value={type.toLocaleLowerCase()}
                        />
                      ))}
                    </Picker>
                  </View>
                  {message && (
                    <Text
                      style={{
                        fontFamily: BODY_FONT,
                        fontSize: 12,
                        color: 'red',
                      }}
                    >
                      {message as string}
                    </Text>
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
                <View style={{ rowGap: 3 }}>
                  <Text style={{ fontFamily: BOLD_BODY_FONT, fontSize: 12 }}>
                    Selecciona dos ingredientes
                    <Text style={{ color: 'red' }}> *</Text>
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
                    <Text
                      style={{
                        fontFamily: BODY_FONT,
                        fontSize: 12,
                        color: 'red',
                      }}
                    >
                      {message as string}
                    </Text>
                  )}
                </View>
              );
            }}
          />

          <View
            style={{
              flexDirection: 'row',
              marginTop: 10,
              columnGap: 5,
              justifyContent: 'center',
            }}
          >
            {action !== 'Visualizar' && (
              <Pressable
                style={{
                  backgroundColor: PRIMARY_COLOR,
                  padding: 10,
                  borderRadius: 10,
                  flexDirection: 'row',
                  columnGap: 5,
                  width: '40%',
                  justifyContent: 'center',
                  borderColor: PRIMARY_COLOR_DARK,
                  borderBottomWidth: 2,
                  borderRightWidth: 2,
                }}
                onPress={handleSubmit(onSubmit)}
              >
                {isLoading ? (
                  <ActivityIndicator size={14} color="white" />
                ) : (
                  <>
                    <Text
                      style={{
                        fontFamily: BOLD_BODY_FONT,
                        color: 'white',
                        fontSize: 12,
                      }}
                    >
                      {action}
                    </Text>
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
              style={{
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
              }}
              onPress={() => setIsVisible(false)}
            >
              <Text
                style={{
                  fontFamily: BOLD_BODY_FONT,
                  color: 'white',
                  textAlign: 'center',
                  fontSize: 12,
                }}
              >
                Cancelar
              </Text>
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
    <Pressable
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 10,
      }}
      onPress={() => onPress(!value)}
    >
      <MaterialCommunityIcons
        name={value ? 'checkbox-marked' : 'checkbox-blank-outline'}
        size={20}
        color={value ? PRIMARY_COLOR : 'black'}
      />
      <Text style={{ fontFamily: BODY_FONT, fontSize: 12 }}>{label}</Text>
    </Pressable>
  );
}
