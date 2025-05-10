import { PRIMARY_COLOR, SECONDARY_COLOR } from '@/constants/Colors';
import { BODY_FONT, BOLD_BODY_FONT } from '@/constants/Fonts';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

export function ProductModal({
  isVisible,
  setIsVisible,
}: {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    beneficios: [''],
    id_categoria: '',
    precio: '',
    stock: '',
    descuento: '10',
    ingredientes: ['Ingrediente 1', 'Ingrediente 2'],
    aroma: '',
    tipo: '',
  });

  const pickImage = async () => {
    const { canceled, assets } = await launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

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

    const response = await fetch('https://api.example.com/products', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();

    Alert.alert('Mensaje del servidor', data.msg);
    setIsVisible(false);
  };

  return (
    <Modal
      animationType="slide"
      visible={isVisible}
      backdropColor={'rgba(0, 0, 0, 0.1)'}
      onRequestClose={() => setIsVisible(!isVisible)}
    >
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
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
            Agregar producto
          </Text>
          <Text
            style={{
              fontFamily: BODY_FONT,
              fontSize: 12,
              textAlign: 'center',
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
            Imagen:
          </Text>
          <Pressable
            style={{
              borderWidth: 1,
              borderRadius: 10,
              borderStyle: 'dashed',
              columnGap: 5,
              alignItems: 'center',
              justifyContent: 'center',
              height: 150,
              overflow: 'hidden',
            }}
            onPress={pickImage}
          >
            {selectedImage ? (
              <Image
                source={{ uri: selectedImage }}
                style={{ height: '100%' }}
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
            Nombre:
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
            onChangeText={nombre => setForm({ ...form, nombre })}
          />
          <Text style={{ fontFamily: BOLD_BODY_FONT, fontSize: 12 }}>
            Descripción:
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
            onChangeText={descripcion => setForm({ ...form, descripcion })}
          />
          <Text style={{ fontFamily: BOLD_BODY_FONT, fontSize: 12 }}>
            Beneficios:
          </Text>
          <TextInput
            style={{
              borderRadius: 10,
              paddingHorizontal: 10,
              fontSize: 12,
              borderWidth: 1,
              fontFamily: BODY_FONT,
            }}
            textAlignVertical="top"
            placeholder="Ej: Aroma relajante, ayuda a dormir mejor, etc."
            onChangeText={beneficios =>
              setForm({
                ...form,
                beneficios: beneficios.split(',').map(item => item.trim()),
              })
            }
          />
          <Text style={{ fontFamily: BOLD_BODY_FONT, fontSize: 12 }}>
            Categoría:
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
            Tipo de piel:
          </Text>
          <View style={{ borderWidth: 1, borderRadius: 10 }}>
            <Picker
              selectedValue={form.tipo}
              onValueChange={tipo => setForm({ ...form, tipo })}
              mode="dropdown"
              prompt="Seleccionar tipo de piel"
            >
              <Picker.Item
                label="Seleccionar tipo de piel"
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
                label="Seca"
                value="seca"
              />
              <Picker.Item
                style={{
                  fontSize: 12,
                  fontFamily: BODY_FONT,
                }}
                label="Grasa"
                value="grasa"
              />
              <Picker.Item
                style={{
                  fontSize: 12,
                  fontFamily: BODY_FONT,
                }}
                label="Mixta"
                value="mixta"
              />
            </Picker>
          </View>
          <View style={{ flexDirection: 'row', columnGap: 10, width: '100%' }}>
            <View style={{ flex: 1, rowGap: 5 }}>
              <Text style={{ fontFamily: BOLD_BODY_FONT, fontSize: 12 }}>
                Precio:
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
                onChangeText={precio => setForm({ ...form, precio })}
              />
            </View>
            <View style={{ flex: 1, rowGap: 5 }}>
              <Text style={{ fontFamily: BOLD_BODY_FONT, fontSize: 12 }}>
                Stock:
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
                onChangeText={stock => setForm({ ...form, stock })}
              />
            </View>
          </View>
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
              <Text
                style={{
                  fontFamily: BOLD_BODY_FONT,
                  color: 'white',
                  fontSize: 12,
                }}
              >
                Guardar
              </Text>
              <MaterialCommunityIcons
                name="content-save"
                size={14}
                color="white"
              />
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
