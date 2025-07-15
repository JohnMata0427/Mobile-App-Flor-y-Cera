import { Button } from '@/components/Button';
import { DateTimeInput } from '@/components/fields/DateTimeInput';
import { ImageField } from '@/components/fields/ImageField';
import { InputField } from '@/components/fields/InputField';
import { PickerField } from '@/components/fields/PickerField';
import { Loading } from '@/components/Loading';
import {
  GRAY_COLOR_LIGHT,
  PRIMARY_COLOR,
  PRIMARY_COLOR_EXTRA_LIGHT,
  SECONDARY_COLOR,
  TERTIARY_COLOR,
} from '@/constants/Colors';
import { ProfileContext, ProfileProvider } from '@/contexts/ProfileContext';
import { toFormData } from '@/utils/toFormData';
import { ImageBackground } from 'expo-image';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { memo, use, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

const defaultValues = {
  imagen: '',
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  cedula: '',
  fecha_nacimiento: '',
  direccion: '',
  genero: '',
};

const UpdateProfile = memo(function UpdateProfile() {
  const { updateProfile, client, loading, refreshing, setRefreshing, getProfile } =
    use(ProfileContext);
  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
    setValue,
    clearErrors,
  } = useForm({ defaultValues });

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loadingForm, setLoadingForm] = useState<boolean>(false);

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
    setLoadingForm(true);
    console.log('Form Data:', form, selectedImage);
    const formData = toFormData(form, selectedImage);

    const { msg } = await updateProfile(formData);

    setLoadingForm(false);
    Alert.alert('Mensaje del sistema', msg);
  };

  useEffect(() => {
    reset(client);
    setSelectedImage(client.imagen || null);
  }, [client, reset]);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true);
            await getProfile();
          }}
          colors={[PRIMARY_COLOR, SECONDARY_COLOR, TERTIARY_COLOR]}
        />
      }
    >
      {loading ? (
        <Loading />
      ) : (
        <>
          <ImageBackground style={{ height: '20%' }} source={require('@/assets/bg-profile.png')}>
            <ImageField
              control={control}
              name="imagen"
              error={errors.imagen?.message as string}
              selectedImage={selectedImage}
              onChange={pickImage}
              width="35%"
              style={styles.profileImage}
            />
          </ImageBackground>

          <View style={styles.formContainer}>
            <View style={styles.rowInput}>
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
                    noWhitespace: (value: string) =>
                      value.trim() !== '' || 'El nombre no puede estar vacío',
                  },
                }}
                icon="account"
                label="Nombre"
                placeholder="Ej: Isabel"
                error={errors.nombre?.message as string}
                autoComplete="name"
                autoCapitalize="words"
                textContentType="name"
              />

              <InputField
                control={control}
                name="apellido"
                rules={{
                  required: 'Este campo es obligatorio',
                  pattern: {
                    value: /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]{3,25}$/,
                    message: 'El apellido debe tener entre 3 y 25 letras y solo letras',
                  },
                  validate: {
                    noWhitespace: (value: string) =>
                      value.trim() !== '' || 'El apellido no puede estar vacío',
                  },
                }}
                icon="account"
                label="Apellido"
                placeholder="Ej: Patzo"
                error={errors.apellido?.message as string}
                autoComplete="name"
                autoCapitalize="words"
                textContentType="name"
              />
            </View>

            <PickerField
              control={control}
              name="genero"
              rules={{
                required: 'Debe seleccionar un género',
              }}
              icon="gender-male-female"
              label="Género"
              prompt="Seleccione su género"
              error={errors.genero?.message as string}
              options={[
                {
                  optionLabel: 'Masculino',
                  optionValue: 'masculino',
                },
                {
                  optionLabel: 'Femenino',
                  optionValue: 'femenino',
                },
              ]}
            />

            <View style={styles.rowInput}>
              <InputField
                control={control}
                name="telefono"
                rules={{
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'El teléfono debe tener 10 dígitos',
                  },
                  validate: {
                    noWhitespace: (value: string) =>
                      value.trim() !== '' || 'El teléfono no puede estar vacío',
                  },
                }}
                icon="phone"
                label="Teléfono"
                placeholder="Ej: 1234567890"
                error={errors.telefono?.message as string}
                autoComplete="tel"
                autoCapitalize="none"
                textContentType="telephoneNumber"
              />

              <InputField
                control={control}
                name="cedula"
                rules={{
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'La cédula debe tener 10 dígitos',
                  },
                }}
                icon="badge-account-horizontal"
                label="Cédula"
                placeholder="Ej: 1234567890"
                error={errors.cedula?.message as string}
                autoComplete="name"
                autoCapitalize="words"
                textContentType="name"
              />
            </View>

            <DateTimeInput
              control={control}
              name="fecha_nacimiento"
              rules={{
                required: 'Este campo es obligatorio',
                validate: {
                  isFutureDate: (value: string) =>
                    new Date(value) <= new Date() || 'La fecha no puede ser futura',
                  isLegalAge: (value: string) => {
                    const today = new Date();
                    const selectedDate = new Date(value);
                    const age = today.getFullYear() - selectedDate.getFullYear();
                    const monthDiff = today.getMonth() - selectedDate.getMonth();
                    return age > 18 || (age === 18 && monthDiff >= 0) || 'Debe ser mayor de edad';
                  },
                },
              }}
              icon="calendar"
              label="Fecha de Nacimiento"
              error={errors.fecha_nacimiento?.message as string}
            />

            <InputField
              control={control}
              name="direccion"
              rules={{
                pattern: {
                  value: /^[a-zA-Z0-9\s,.'-]{3,100}$/,
                  message:
                    'La dirección debe tener entre 3 y 100 caracteres y solo letras, números y algunos caracteres especiales',
                },
              }}
              icon="map-marker"
              label="Dirección"
              placeholder="Ej: Sector A, Calle Falsetin 123"
              error={errors.direccion?.message as string}
              autoComplete="street-address"
              autoCapitalize="words"
              textContentType="fullStreetAddress"
            />

            <Button
              label="Actualizar perfil"
              icon="account-edit"
              onPress={handleSubmit(onSubmit)}
              buttonStyle={styles.submitButton}
              disabled={loadingForm}
            />
          </View>
        </>
      )}
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  scrollContent: {
    backgroundColor: PRIMARY_COLOR_EXTRA_LIGHT,
    flexGrow: 1,
    paddingBottom: 15,
  },
  rowInput: {
    flexDirection: 'row',
    columnGap: 10,
  },
  profileImage: { position: 'absolute', zIndex: 1, borderRadius: 99, top: '50%' },
  formContainer: {
    marginHorizontal: 10,
    marginTop: 70,
    rowGap: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: GRAY_COLOR_LIGHT,
  },
  submitButton: {
    marginTop: 10,
  },
});

export default function UpdateProfileScreen() {
  return (
    <ProfileProvider>
      <UpdateProfile />
    </ProfileProvider>
  );
}
