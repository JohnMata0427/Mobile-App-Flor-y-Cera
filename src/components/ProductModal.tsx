import { PRIMARY_COLOR, SECONDARY_COLOR } from '@/constants/Colors';
import { BODY_FONT, BOLD_BODY_FONT } from '@/constants/Fonts';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { getItemAsync } from 'expo-secure-store';
import { useEffect, useState } from 'react';
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

export function ProductModal({
  data,
  isVisible,
  setIsVisible,
}: {
  data?: any;
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const action = data ? 'Actualizar' : 'Agregar';
  const [typeValues, setTypeValues] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    nombre: 'Vela artesanal de canela',
    descripcion:
      'Vela natural con aroma a canela, ideal para relajarse, meditar y dormir mejor.',
    beneficios: ['Aroma relajante', 'Ayuda a dormir mejor'],
    id_categoria: '680fd248f613dc80267ba5d7',
    precio: '9.99',
    stock: '100',
    imagen: '',
    descuento: '10',
    ingredientes: ['Cera de soya', 'Aceite esencial de canela'],
    aroma: 'Canela',
    tipo: 'decorativa',
  });

  const pickImage = async () => {
    const { canceled, assets } = await launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
    });

    console.log(assets?.[0].uri);

    !canceled && setSelectedImage(assets[0].uri);
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    if (selectedImage) {
      const fileType = selectedImage.split('.').pop();

      formData.append('imagen', {
        uri: selectedImage,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      } as any);
    }

    Object.entries(form).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(item => formData.append(key + '[]', item));
      } else {
        formData.append(key, value);
      }
    });

    setIsLoading(true);

    const url = `https://flor-y-cera-backend.onrender.com/api/productos/${data?._id ?? ''}`;

    const response = await fetch(url, {
      method: action === 'Actualizar' ? 'PUT' : 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${await getItemAsync('token')}`,
      },
    });
    const recived = await response.json();
    alert(recived.msg);
    setIsLoading(false);
    setSelectedImage(null);

    setIsVisible(false);
  };

  useEffect(() => {
    if (form.id_categoria === '680fd248f613dc80267ba5d7') {
      setTypeValues(['Seca', 'Grasa', 'Mixta']);
      setIngredients([
        'Fragancia de lavanda',
        'Fragancia de rosa',
        'Fragancia de eucalipto',
        'Fragancia de canela',
      ]);
    } else if (form.id_categoria === '68128844e4d236cfe51a6fd6') {
      setTypeValues(['Decorativa', 'Ambiental', 'Relajante']);
      setIngredients([
        'Mecha de algodón',
        'Cera de soya',
        'Aceite esencial de canela',
        'Colorante natural',
        'Vainilla',
        'Lavanda',
      ]);
    }
  }, [form.id_categoria]);

  useEffect(() => {
    if (data) {
      const { imagen, id_categoria } = data;
      data.id_categoria = id_categoria?._id;
      setForm(data);
      setSelectedImage(imagen);
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
          borderColor: PRIMARY_COLOR,
          borderWidth: 2,
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
              </>
            )}
          </Pressable>
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
            }}
            placeholder="Ej: Vela de soya"
            value={form.nombre}
            onChangeText={nombre => setForm({ ...form, nombre })}
          />
          <View style={{ flexDirection: 'row', columnGap: 10, width: '100%' }}>
            <View style={{ flex: 1, rowGap: 5 }}>
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
                }}
                placeholder="Ej: Soya"
                value={form.aroma}
                onChangeText={aroma => setForm({ ...form, aroma })}
              />
            </View>
            <View style={{ flex: 1, rowGap: 5 }}>
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
                }}
                placeholder="Ej: 10.00"
                keyboardType="numeric"
                value={form.precio.toString()}
                onChangeText={precio => setForm({ ...form, precio })}
              />
            </View>
            <View style={{ flex: 1, rowGap: 5 }}>
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
                }}
                placeholder="Ej: 25"
                keyboardType="numeric"
                value={form.stock.toString()}
                onChangeText={stock => setForm({ ...form, stock })}
              />
            </View>
          </View>
          <Text style={{ fontFamily: BOLD_BODY_FONT, fontSize: 12 }}>
            Descripción <Text style={{ color: 'red' }}>*</Text>
          </Text>
          <TextInput
            style={{
              borderRadius: 10,
              paddingHorizontal: 10,
              fontSize: 12,
              borderWidth: 1,
              height: 75,
              fontFamily: BODY_FONT,
            }}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            placeholder="Ej: Vela natural con aroma a lavanda"
            value={form.descripcion}
            onChangeText={descripcion => setForm({ ...form, descripcion })}
          />
          <Text style={{ fontFamily: BOLD_BODY_FONT, fontSize: 12 }}>
            Beneficios <Text style={{ color: 'red' }}>*</Text>
          </Text>
          <TextInput
            style={{
              borderRadius: 10,
              paddingHorizontal: 10,
              fontSize: 12,
              borderWidth: 1,
              fontFamily: BODY_FONT,
            }}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            placeholder="Ej: Aroma relajante, ayuda a dormir mejor, etc."
            value={form.beneficios.join(', ')}
            onChangeText={beneficios =>
              setForm({
                ...form,
                beneficios: beneficios.split(',').map(item => item.trim()),
              })
            }
          />
          <Text style={{ fontFamily: BOLD_BODY_FONT, fontSize: 12 }}>
            Categoría <Text style={{ color: 'red' }}>*</Text>
          </Text>
          <View style={{ borderWidth: 1, borderRadius: 10 }}>
            <Picker
              selectedValue={form.id_categoria}
              onValueChange={id_categoria => setForm({ ...form, id_categoria })}
              mode="dropdown"
              prompt="Seleccionar categoría"
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
                  fontSize: 12,
                  fontFamily: BODY_FONT,
                }}
                label="Velas artesanales"
                value="68128844e4d236cfe51a6fd6"
              />
              <Picker.Item
                style={{
                  fontSize: 12,
                  fontFamily: BODY_FONT,
                }}
                label="Jabones artesanales"
                value="680fd248f613dc80267ba5d7"
              />
            </Picker>
          </View>
          <Text style={{ fontFamily: BOLD_BODY_FONT, fontSize: 12 }}>
            Tipo <Text style={{ color: 'red' }}>*</Text>
          </Text>
          <View style={{ borderWidth: 1, borderRadius: 10 }}>
            <Picker
              selectedValue={form.tipo}
              onValueChange={tipo => setForm({ ...form, tipo })}
              mode="dropdown"
            >
              <Picker.Item
                label={
                  form.id_categoria === '680fd248f613dc80267ba5d7'
                    ? 'Seleccionar tipo de piel'
                    : 'Seleccionar tipo de vela'
                }
                value=""
                enabled={false}
                style={{
                  color: '#AFAFAF',
                  fontSize: 12,
                  fontFamily: BODY_FONT,
                }}
              />
              {typeValues.map((item, index) => (
                <Picker.Item
                  key={index}
                  style={{
                    fontSize: 12,
                    fontFamily: BODY_FONT,
                  }}
                  label={item}
                  value={item.toLowerCase()}
                />
              ))}
            </Picker>
          </View>

          <Text style={{ fontFamily: BOLD_BODY_FONT, fontSize: 12 }}>
            Ingredientes <Text style={{ color: 'red' }}>*</Text>
          </Text>
          {ingredients.map((item, index) => (
            <CheckBox
              key={index}
              label={item}
              value={form.ingredientes.includes(item)}
              onPress={value => {
                if (value) {
                  setForm(prev => ({
                    ...prev,
                    ingredientes: prev.ingredientes.concat(item),
                  }));
                } else {
                  setForm(prev => ({
                    ...prev,
                    ingredientes: prev.ingredientes.filter(
                      (i: any) => i !== item,
                    ),
                  }));
                }
              }}
            />
          ))}

          <View
            style={{
              flexDirection: 'row',
              marginTop: 10,
              columnGap: 5,
              justifyContent: 'center',
            }}
          >
            <Pressable
              style={{
                backgroundColor: PRIMARY_COLOR,
                padding: 10,
                borderRadius: 10,
                flexDirection: 'row',
                columnGap: 5,
                width: '40%',
                justifyContent: 'center',
              }}
              onPress={handleSubmit}
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
            <Pressable
              style={{
                padding: 10,
                borderRadius: 10,
                flexDirection: 'row',
                columnGap: 5,
                width: '40%',
                backgroundColor: SECONDARY_COLOR,
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
