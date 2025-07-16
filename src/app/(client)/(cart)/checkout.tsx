import { Button } from '@/components/Button';
import { InputField } from '@/components/fields/InputField';
import { Loading } from '@/components/Loading';
import { InvoiceDetailsModal } from '@/components/modals/InvoiceDetailsModal';
import {
  GRAY_COLOR,
  GRAY_COLOR_DARK,
  GRAY_COLOR_LIGHT,
  PRIMARY_COLOR,
  PRIMARY_COLOR_EXTRA_LIGHT,
  SECONDARY_COLOR,
  TERTIARY_COLOR,
} from '@/constants/Colors';
import { ProfileContext, ProfileProvider } from '@/contexts/ProfileContext';
import { useCartStore } from '@/store/useCartStore';
import { toFormData } from '@/utils/toFormData';
import { CardField, CardForm, createPaymentMethod, StripeProvider } from '@stripe/stripe-react-native';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { memo, use, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

const defaultValues = {
  telefono: '',
  cedula: '',
  direccion: '',
};

const { STRIPE_API_KEY = '' } = Constants.expoConfig?.extra ?? {};

const PUBLIC_STRIPE_KEY = process.env.EXPO_PUBLIC_STRIPE_API_KEY ?? STRIPE_API_KEY;

const UpdateProfile = memo(function UpdateProfile() {
  const { updateProfile, client, loading, refreshing, setRefreshing, getProfile } =
    use(ProfileContext);
  const { checkout } = useCartStore();
  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
    clearErrors,
  } = useForm({ defaultValues });
  const [editable, setEditable] = useState<boolean>(false);

  const onSubmit = async (form: any) => {
    const formData = toFormData(form);

    const { ok, msg } = await updateProfile(formData);

    Alert.alert('Mensaje del sistema', msg);

    if (ok) setEditable(true)
  };

  const [cardDetails, setCardDetails] = useState<any>(null);
  const [invoice, setInvoice] = useState<any>(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false)

  const handlePayment = async () => {
    if (cardDetails) {
      setLoadingPayment(true);
      const { paymentMethod } = await createPaymentMethod({
        paymentMethodType: 'Card',
        paymentMethodData: cardDetails,
      });

      const { venta, cliente, ok } = await checkout(paymentMethod?.id ?? '');

      if (ok) {
        setInvoice({
          ...venta,
          cliente,
        });
        setDetailsVisible(true);
      }
      setLoadingPayment(false);
    }
  };

  useEffect(() => {
    reset(client);
    clearErrors();
  }, [client]);

  return (
    <StripeProvider publishableKey={PUBLIC_STRIPE_KEY}>
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
            <View style={styles.cardContainer}>
              <Text
                style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5, textAlign: 'center' }}
              >
                Datos de envío
              </Text>

              <InputField
                control={control}
                name="cedula"
                rules={{
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'La cédula debe tener 10 dígitos',
                  },
                  required: 'La cédula es requerida',
                }}
                icon="badge-account-horizontal"
                label="Cédula"
                placeholder="Ej: 1234567890"
                error={errors.cedula?.message as string}
                autoComplete="cc-number"
                keyboardType="numeric"
                textContentType="telephoneNumber"
                editable={editable}
              />

              <InputField
                control={control}
                name="telefono"
                rules={{
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'El teléfono debe tener 10 dígitos',
                  },
                  required: 'El teléfono es requerido',
                }}
                icon="phone"
                label="Teléfono"
                placeholder="Ej: 1234567890"
                error={errors.telefono?.message as string}
                autoComplete="tel"
                autoCapitalize="none"
                textContentType="telephoneNumber"
                keyboardType="phone-pad"
                editable={editable}
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
                  required: 'La dirección es requerida',
                }}
                icon="map-marker"
                label="Dirección"
                placeholder="Ej: Sector A, Calle Falsetin 123"
                error={errors.direccion?.message as string}
                autoComplete="street-address"
                autoCapitalize="words"
                textContentType="fullStreetAddress"
                editable={editable}
              />

              <Button
                label={editable ? 'Actualizar datos de envío' : 'Modificar datos de envio'}
                icon="truck-delivery"
                onPress={() => {
                  if (editable) {
                    handleSubmit(onSubmit)();
                  } else {
                    setEditable(true);
                  }
                }}
                buttonStyle={styles.submitButton}
              />
            </View>
            <View style={[styles.cardContainer, styles.billingContainer]}>
              <Text>Datos de facturación</Text>

              <CardField 
                postalCodeEnabled={false}
                style={{ width: '100%', height: 50, marginVertical: 20 }}
                cardStyle={{
                  textColor: GRAY_COLOR_DARK,
                  placeholderColor: GRAY_COLOR,
                }}
                onCardChange={cardDetails => setCardDetails(cardDetails)}
              />

              <Button
                label="Completar compra"
                icon="cash-check"
                onPress={handlePayment}
                buttonStyle={
                  editable
                    ? {
                        backgroundColor: GRAY_COLOR_DARK,
                        borderColor: 'black',
                      }
                    : styles.submitButton
                }
                disabled={loadingPayment}
              />
            </View>
          </>
        )}
        <InvoiceDetailsModal
          invoice={invoice}
          isVisible={detailsVisible}
          onClose={() => {
            setDetailsVisible(false);
            router.replace('/(client)/(profile)/orders');
          }}
        />
      </ScrollView>
    </StripeProvider>
  );
});

const styles = StyleSheet.create({
  scrollContent: {
    backgroundColor: PRIMARY_COLOR_EXTRA_LIGHT,
    flexGrow: 1,
    paddingBottom: 15,
  },
  cardContainer: {
    marginHorizontal: 10,
    marginTop: 50,
    rowGap: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: GRAY_COLOR_LIGHT,
  },
  billingContainer: {
    marginTop: 20,
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
