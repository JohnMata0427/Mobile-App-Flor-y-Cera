import { Button } from '@/components/Button';
import {
  GRAY_COLOR_DARK,
  PRIMARY_COLOR,
  PRIMARY_COLOR_DARK,
  PRIMARY_COLOR_LIGHT,
  SECONDARY_COLOR,
  SECONDARY_COLOR_DARK,
  TERTIARY_COLOR_LIGHT,
} from '@/constants/Colors';
import type { Ingredient } from '@/interfaces/Ingredient';
import type { PersonalizedProduct } from '@/interfaces/PersonalizedProduct';
import { capitalizeWord } from '@/utils/textTransform';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { memo, useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';

interface PersonalizedProductDetailsProps {
  product: PersonalizedProduct;
  modalVisible: boolean;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
}

const getPriceWithoutIVA = (price: number) => (price - price * 0.15)?.toFixed(2);

export const PersonalizedProductDetails = memo(
  ({ product, modalVisible, setModalVisible }: PersonalizedProductDetailsProps) => {
    if (!modalVisible) return null;

    const [mold, setMold] = useState<Ingredient>({} as Ingredient);
    const [color, setColor] = useState<Ingredient>({} as Ingredient);
    const [aroma, setAroma] = useState<Ingredient>({} as Ingredient);
    const [essences, setEssences] = useState<Ingredient[]>([]);

    useEffect(() => {
      setEssences([]);

      product.ingredientes?.forEach((ingredient: any) => {
        if (ingredient.tipo === 'molde') {
          setMold(ingredient);
        } else if (ingredient.tipo === 'color') {
          setColor(ingredient);
        } else if (ingredient.tipo === 'aroma') {
          setAroma(ingredient);
        } else if (ingredient.tipo === 'esencia') {
          setEssences(prev => [...prev, ingredient]);
        }
      });
    }, [product]);

    return (
      <Modal
        visible={modalVisible}
        animationType="slide"
        backdropColor="rgba(0, 0, 0, 0.1)"
        onRequestClose={() => setModalVisible(false)}
        statusBarTranslucent
        navigationBarTranslucent
      >
        <View style={styles.modalContainer}>
          <Text style={styles.title}>
            {product.tipo_producto === 'personalizado'
              ? 'Producto personalizado'
              : 'Recomendación de IA'}
          </Text>

          <Image
            source={{ uri: product.imagen }}
            style={styles.productImage}
            contentFit="contain"
          />

          <View style={[styles.ingredientRow, { backgroundColor: PRIMARY_COLOR }]}>
            <Text style={styles.ingredientPrice}>Aroma: {capitalizeWord(aroma.nombre)}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 10 }}>
              <MaterialCommunityIcons name="forward" size={16} color="white" />
              <Text style={styles.ingredientPrice}>$ {getPriceWithoutIVA(aroma.precio)}</Text>
            </View>
          </View>

          <View style={[styles.ingredientRow, { backgroundColor: SECONDARY_COLOR }]}>
            <Text style={styles.ingredientPrice}>Colorante: {capitalizeWord(color.nombre)}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 10 }}>
              <MaterialCommunityIcons name="forward" size={16} color="white" />
              <Text style={styles.ingredientPrice}>$ {getPriceWithoutIVA(color.precio)}</Text>
            </View>
          </View>

          <View style={[styles.ingredientRow, { backgroundColor: 'skyblue' }]}>
            <Text style={styles.ingredientPrice}>Molde: {capitalizeWord(mold.nombre)}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 10 }}>
              <MaterialCommunityIcons name="forward" size={16} color="white" />
              <Text style={styles.ingredientPrice}>$ {getPriceWithoutIVA(mold.precio)}</Text>
            </View>
          </View>

          <View style={styles.essencesContainer}>
            <Text style={styles.ingredientPrice}>Esencias:</Text>
            {essences?.map(essence => (
              <View key={essence._id} style={styles.essenceRow}>
                <Text style={styles.ingredientPrice}>{capitalizeWord(essence.nombre)}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 10 }}>
                  <MaterialCommunityIcons name="forward" size={16} color="white" />
                  <Text style={styles.ingredientPrice}>$ {getPriceWithoutIVA(essence.precio)}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.priceSummaryContainer}>
            <View style={styles.priceRow}>
              <Text>Subtotal:</Text>
              <Text style={styles.priceValue}>$ {getPriceWithoutIVA(product.precio)}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text>IVA (15%):</Text>
              <Text style={styles.priceValue}>$ {(product.precio * 0.15)?.toFixed(2)}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.totalText}>Total:</Text>
              <Text style={styles.totalValue}>$ {product.precio?.toFixed(2)}</Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <Button
              label="Editar"
              icon="pencil"
              onPress={() =>
                router.push({
                  pathname: '/(client)/(personalization)/[category]',
                  params: {
                    category:
                      typeof product.id_categoria === 'string'
                        ? product.id_categoria
                        : product.id_categoria?._id,
                    personalizedProductId: product._id,
                  },
                })
              }
            />
            <Button
              label="Cancelar"
              icon="close-thick"
              onPress={() => setModalVisible(false)}
              buttonStyle={styles.cancelButton}
            />
          </View>
        </View>
      </Modal>
    );
  },
);

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    margin: 'auto',
    maxHeight: '80%',
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingVertical: 20,
    rowGap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productImage: {
    width: 250,
    height: 120,
    borderColor: GRAY_COLOR_DARK,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    padding: 10,
    borderRadius: 10,
  },
  ingredientPrice: {
    color: 'white',
    fontWeight: 'bold',
  },
  essencesContainer: {
    width: '80%',
    backgroundColor: TERTIARY_COLOR_LIGHT,
    padding: 10,
    borderRadius: 10,
  },
  essenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceSummaryContainer: {
    borderTopWidth: 1,
    borderTopColor: PRIMARY_COLOR_LIGHT,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    rowGap: 5,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
    alignItems: 'center',
  },
  priceValue: {
    color: PRIMARY_COLOR_DARK,
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: PRIMARY_COLOR_DARK,
  },
  buttonContainer: {
    flexDirection: 'row',
    columnGap: 10,
  },
  cancelButton: {
    backgroundColor: SECONDARY_COLOR,
    borderColor: SECONDARY_COLOR_DARK,
  },
});
