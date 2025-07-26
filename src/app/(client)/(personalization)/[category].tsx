import { Button } from '@/components/Button';
import { LoadingModalIA } from '@/components/LoadingModalIA';
import { FinishPersonalizationModal } from '@/components/modals/FinishPersonalizationModal';
import {
  GRAY_COLOR,
  GRAY_COLOR_DARK,
  PRIMARY_COLOR,
  PRIMARY_COLOR_DARK,
  PRIMARY_COLOR_LIGHT,
  REFRESH_COLORS,
  SECONDARY_COLOR,
  SECONDARY_COLOR_DARK,
  SECONDARY_COLOR_LIGHT,
  TERTIARY_COLOR,
  TERTIARY_COLOR_DARK,
  TERTIARY_COLOR_LIGHT,
} from '@/constants/Colors';
import { CategoriesContext, CategoriesProvider } from '@/contexts/CategoryContext';
import { IngredientsContext, IngredientsProvider } from '@/contexts/IngredientsContext';
import {
  PersonalizedProductsContext,
  PersonalizedProductsProvider,
} from '@/contexts/PersonalizedProductsContext';
import { globalStyles } from '@/globalStyles';
import type { Ingredient, IngredientType } from '@/interfaces/Ingredient';
import { getPersonalizedProductByIdRequest } from '@/services/PersonalizedProductService';
import { getIntelligenceArtificialRecomendation } from '@/services/ProductService';
import { getDominantColor } from '@/utils/getDominantColor';
import { capitalizeWord } from '@/utils/textTransform';
import * as FileSystem from 'expo-file-system';
import { Image, ImageBackground } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { memo, use, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { DraxProvider, DraxView } from 'react-native-drax';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { captureRef } from 'react-native-view-shot';

type Params = {
  category: string;
  personalizedProductId: string;
};

interface GameForm {
  id_categoria: string;
  ingredientes: Ingredient[];
  tipo_producto: 'personalizado' | 'ia';
}

const filters: IngredientType[] = ['aroma', 'molde', 'esencia', 'color'];

const ProductPersonalization = memo(() => {
  const dropperRef = useRef(null);
  const { top } = useSafeAreaInsets();
  const { ingredients } = use(IngredientsContext);
  const { categories } = use(CategoriesContext);

  const { category, personalizedProductId } = useLocalSearchParams<Params>();
  const { createPersonalizedProduct, uploadPersonalizedProductImage, updatePersonalizedProduct } =
    use(PersonalizedProductsContext);

  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingRecommendation, setLoadingRecommendation] = useState<boolean>(false);

  const [selectedMold, setSelectedMold] = useState<Ingredient | null>(null);
  const [selectedColor, setSelectedColor] = useState<Ingredient | null>(null);
  const [selectedAroma, setSelectedAroma] = useState<Ingredient | null>(null);
  const [selectedEssences, setSelectedEssences] = useState<Ingredient[]>([]);
  const [tintedColor, setTintedColor] = useState<string | undefined>(undefined);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [categoryName, setCategoryName] = useState<string>('');

  const [selectedFilter, setSelectedFilter] = useState<IngredientType>('aroma');
  const [form, setForm] = useState<GameForm>({
    id_categoria: '',
    ingredientes: [],
    tipo_producto: 'personalizado',
  });

  const [message, setMessage] = useState<string>('');
  const [finishPersonalization, setFinishPersonalization] = useState<boolean>(false);

  const filteredIngredientsByCategory = useMemo(() => {
    if (category) {
      const categoryData = categories.find(cat => cat._id === category);
      setCategoryName(categoryData?.nombre ?? '');

      setForm({ ...form, id_categoria: category });
      return ingredients.filter(({ id_categoria }) => id_categoria.includes(category));
    }
    return [];
  }, [categories, category, ingredients]);

  const filteredIngredients = useMemo(() => {
    let filtered = filteredIngredientsByCategory.filter(({ tipo }) => tipo === selectedFilter);

    if (selectedFilter === 'molde' && selectedMold?._id) {
      filtered = filtered.filter(({ _id }) => _id !== selectedMold._id);
    } else if (selectedFilter === 'color' && selectedColor?._id) {
      filtered = filtered.filter(({ _id }) => _id !== selectedColor._id);
    } else if (selectedFilter === 'aroma' && selectedAroma?._id) {
      filtered = filtered.filter(({ _id }) => _id !== selectedAroma._id);
    } else if (selectedFilter === 'esencia' && selectedEssences.length > 0) {
      filtered = filtered.filter(({ _id }) => {
        return !selectedEssences.some(essence => essence._id === _id);
      });
    }

    return filtered;
  }, [
    filteredIngredientsByCategory,
    selectedFilter,
    selectedMold,
    selectedColor,
    selectedAroma,
    selectedEssences,
  ]);

  useEffect(() => {
    Alert.alert(
      'Mensaje del sistema',
      'Arrastra un molde, un color, un aroma y dos esencias para crear tu producto personalizado.',
      [
        {
          text: 'Aceptar',
        },
      ],
    );
  }, [showHelpModal]);

  useEffect(() => {
    (async () => {
      if (selectedColor?._id) {
        const dominantColor = await getDominantColor(selectedColor.imagen);
        setTintedColor(dominantColor);
      }
    })();
  }, [selectedColor]);

  useEffect(() => {
    setSelectedMold(null);
    setSelectedColor(null);
    setSelectedAroma(null);
    setSelectedEssences([]);
    setTintedColor(undefined);
    setRefreshing(false);
  }, [refreshing]);

  const handleSubmit = async () => {
    if (
      !selectedMold?._id ||
      !selectedColor?._id ||
      !selectedAroma?._id ||
      selectedEssences.length < 2 ||
      !tintedColor
    ) {
      Alert.alert(
        'Mensaje del sistema',
        'Recuerde colocar un molde, un color, un aroma y dos esencias.',
      );
      return;
    }

    setLoading(true);

    const updatedForm = {
      ...form,
      ingredientes: [selectedMold, selectedColor, selectedAroma, ...selectedEssences],
    };

    setForm(updatedForm);

    const { _id, msg } = personalizedProductId
      ? await updatePersonalizedProduct(personalizedProductId, updatedForm)
      : await createPersonalizedProduct(updatedForm);

    const uri = await captureRef(dropperRef, {
      format: 'png',
      quality: 1,
    });

    const destPath = FileSystem.cacheDirectory + `fc-pp-${_id}-${Math.random()}.png`;

    await FileSystem.copyAsync({
      from: uri,
      to: destPath,
    });

    const formData = new FormData();
    formData.append('imagen', {
      uri: destPath,
      name: 'dropper.png',
      type: 'image/png',
    } as any);

    const { ok } = await uploadPersonalizedProductImage(_id ?? personalizedProductId, formData);

    if (ok) {
      setImagePreview(destPath);
      setMessage('¡Producto personalizado creado exitosamente!');
      setFinishPersonalization(true);
    } else {
      Alert.alert('Mensaje del sistema', msg);
    }
    setLoading(false);
  };

  const handleSubmitRecommendation = async () => {
    setLoadingRecommendation(true);

    const timeout = setTimeout(async () => {
      const { producto_personalizado } = await getIntelligenceArtificialRecomendation(
        form.id_categoria,
      );

      setForm(prev => ({
        ...prev,
        tipo_producto: 'ia',
      }));
      setSelectedAroma(producto_personalizado.aroma);
      setSelectedColor(producto_personalizado.color);
      setSelectedMold(producto_personalizado.molde);
      setSelectedEssences(producto_personalizado.esencias);
      setLoadingRecommendation(false);
    }, 10000);

    return () => clearTimeout(timeout);
  };

  useEffect(() => {
    (async () => {
      const { producto } = await getPersonalizedProductByIdRequest(personalizedProductId);

      if (producto?._id) {
        setSelectedEssences([]);
        producto.ingredientes.forEach((ingredient: Ingredient) => {
          const { tipo } = ingredient;
          if (tipo === 'molde') {
            setSelectedMold(ingredient);
          } else if (tipo === 'color') {
            setSelectedColor(ingredient);
          } else if (tipo === 'aroma') {
            setSelectedAroma(ingredient);
          } else if (tipo === 'esencia') {
            setSelectedEssences(prev => [...prev, ingredient]);
          }
        });
      }
    })();
  }, [personalizedProductId]);

  return (
    <ImageBackground style={styles.backgroundImage} source={require('@/assets/bg-game.png')}>
      <View style={[styles.header, { paddingTop: top * 1.5 }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerTextContainer}>
            <Text style={[globalStyles.title, styles.headerTitle]}>
              Bienvenido al Taller de {capitalizeWord(categoryName.split(' ')[0])}
            </Text>
            <Text style={[globalStyles.subtitle, styles.headerSubtitle]}>
              Aquí podrás crear tu propio producto personalizado
            </Text>
          </View>
          <Image source={require('@/assets/logo.png')} style={styles.headerIcon} />
        </View>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => setRefreshing(!refreshing)}
            colors={REFRESH_COLORS}
          />
        }
      >
        <Button
          icon="cloud-question"
          label="Ayuda rápida"
          buttonStyle={styles.helpButton}
          textStyle={styles.helpButtonText}
          onPress={() => setShowHelpModal(!showHelpModal)}
        />

        <LoadingModalIA modalVisible={loadingRecommendation} />

        <FinishPersonalizationModal
          modalVisible={finishPersonalization}
          setModalVisible={setFinishPersonalization}
          imagePreview={imagePreview}
          message={message}
        />

        <View style={styles.creationContainer}>
          <View style={styles.dropperContainer} ref={dropperRef} collapsable={false}>
            <DraxView
              style={styles.dropperView}
              onReceiveDragDrop={({ dragged: { payload } }) => {
                if (payload.tipo === 'molde') {
                  setSelectedMold(payload);
                } else if (payload.tipo === 'color' && selectedMold?._id) {
                  setSelectedColor(payload);
                }
              }}
            >
              {selectedMold?._id ? (
                <>
                  <Image
                    source={{ uri: selectedMold.imagen }}
                    style={[styles.dropperImage]}
                    contentFit="contain"
                  />
                  <Image
                    source={{ uri: selectedMold.imagen }}
                    style={[styles.dropperImage, { tintColor: tintedColor, opacity: 0.8 }]}
                    contentFit="contain"
                  />
                  <Text style={[globalStyles.bodyText, { position: 'absolute', bottom: '7%' }]}>
                    {capitalizeWord(selectedMold.nombre)}
                  </Text>
                </>
              ) : (
                <Text style={[globalStyles.bodyText, { textAlign: 'center', fontWeight: 'bold' }]}>
                  Arrastra un molde y un color aquí
                </Text>
              )}
            </DraxView>
            <View style={styles.sideDroppers}>
              <DraxView
                style={styles.aromaDropper}
                onReceiveDragDrop={({ dragged: { payload } }) => {
                  if (payload.tipo === 'aroma') setSelectedAroma(payload);
                }}
              >
                {selectedAroma?._id ? (
                  <>
                    <Image
                      source={{ uri: selectedAroma.imagen }}
                      style={styles.ingredientImage}
                      contentFit="contain"
                    />
                    <Text style={globalStyles.bodyText}>
                      {capitalizeWord(selectedAroma.nombre)}
                    </Text>
                  </>
                ) : (
                  <Text
                    style={[globalStyles.bodyText, { textAlign: 'center', fontWeight: 'bold' }]}
                  >
                    Arrastra un aroma aquí
                  </Text>
                )}
              </DraxView>
              <DraxView
                style={styles.essenceDropper}
                onReceiveDragDrop={({ dragged: { payload } }) => {
                  if (payload.tipo === 'esencia') {
                    if (selectedEssences.length < 2) {
                      setSelectedEssences(prev => [...prev, payload]);
                    } else {
                      const lastEssence = selectedEssences[1];
                      setSelectedEssences([lastEssence, payload]);
                    }
                  }
                }}
              >
                {selectedEssences.length > 0 ? (
                  <FlatList
                    data={selectedEssences}
                    contentContainerStyle={styles.essenceList}
                    scrollEnabled={false}
                    keyExtractor={({ _id }) => _id}
                    renderItem={({ item }) => (
                      <>
                        <Image
                          source={{ uri: item.imagen }}
                          style={styles.ingredientImage}
                          contentFit="contain"
                        />
                        <Text style={globalStyles.bodyText}>{capitalizeWord(item.nombre)}</Text>
                      </>
                    )}
                  />
                ) : (
                  <Text
                    style={[globalStyles.bodyText, { textAlign: 'center', fontWeight: 'bold' }]}
                  >
                    Arrastra dos esencias aquí
                  </Text>
                )}
              </DraxView>
            </View>
          </View>
          <View style={styles.actionButtons}>
            <Button
              label="Recomendación con IA"
              icon="shimmer"
              onPress={handleSubmitRecommendation}
              buttonStyle={styles.iaButton}
              textStyle={styles.buttonText}
            />
            <Button
              label={personalizedProductId ? 'Actualizar creación' : 'Finalizar creación'}
              icon="thought-bubble"
              onPress={handleSubmit}
              buttonStyle={styles.finishButton}
              textStyle={styles.buttonText}
              disabled={loading}
            />
          </View>
        </View>
        <View style={styles.ingredientsContainer}>
          <View style={styles.filterContainer}>
            {filters.map(type => (
              <Text
                key={type}
                style={[styles.filterText, selectedFilter === type && styles.selectedFilter]}
                onPress={() => setSelectedFilter(type)}
              >
                {capitalizeWord(type)}
              </Text>
            ))}
          </View>

          <DraxView style={styles.ingredientsList}>
            {filteredIngredients.length > 0 &&
              filteredIngredients.map(ingredient => (
                <View style={styles.ingredientItem} key={ingredient._id}>
                  <DraxView key={ingredient._id} draggable payload={ingredient}>
                    <Image
                      source={{ uri: ingredient.imagen }}
                      style={styles.ingredientImage}
                      contentFit="contain"
                    />
                  </DraxView>
                  <Text style={globalStyles.bodyText}>{capitalizeWord(ingredient.nombre)}</Text>
                </View>
              ))}
          </DraxView>
        </View>
      </ScrollView>
    </ImageBackground>
  );
});

export default function ProductPersonalizationScreen() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <CategoriesProvider>
        <IngredientsProvider>
          <PersonalizedProductsProvider>
            <DraxProvider>
              <ProductPersonalization />
            </DraxProvider>
          </PersonalizedProductsProvider>
        </IngredientsProvider>
      </CategoriesProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: GRAY_COLOR_DARK,
    paddingBottom: 15,
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  headerTextContainer: {
    rowGap: 5,
  },
  finishButton: {
    width: '45%',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
  },
  headerSubtitle: {
    color: 'white',
  },
  headerIcon: {
    width: 50,
    height: 50,
  },
  scrollViewContent: {
    justifyContent: 'space-between',
    margin: 10,
    rowGap: 20,
    paddingBottom: 20,
  },
  helpButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: SECONDARY_COLOR,
    borderColor: SECONDARY_COLOR_DARK,
    paddingVertical: 5,
  },
  helpButtonText: {
    fontSize: 12,
  },
  creationContainer: {
    marginHorizontal: 'auto',
    marginTop: 80,
    rowGap: 10,
  },
  dropperContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  dropperView: {
    backgroundColor: PRIMARY_COLOR_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    padding: 10,
    aspectRatio: 1,
    width: '62%',
  },
  dropperImage: {
    width: '75%',
    height: '75%',
    position: 'absolute',
    alignSelf: 'center',
  },
  sideDroppers: {
    width: '30%',
  },
  aromaDropper: {
    backgroundColor: SECONDARY_COLOR_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    padding: 10,
  },
  essenceDropper: {
    backgroundColor: TERTIARY_COLOR_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    padding: 10,
    flex: 1,
  },
  essenceList: {
    rowGap: 5,
    margin: 'auto',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    columnGap: 10,
  },
  iaButton: {
    backgroundColor: TERTIARY_COLOR,
    borderColor: TERTIARY_COLOR_DARK,
  },
  buttonText: {
    fontSize: 12,
  },
  ingredientsContainer: {
    rowGap: 10,
    padding: 10,
    backgroundColor: GRAY_COLOR_DARK,
    borderRadius: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
    flexWrap: 'wrap',
  },
  filterText: {
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: GRAY_COLOR,
    color: 'black',
  },
  selectedFilter: {
    backgroundColor: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR_DARK,
    color: 'white',
  },
  ingredientsList: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    rowGap: 10,
  },
  ingredientItem: {
    alignItems: 'center',
    marginRight: 10,
    width: 60,
  },
  ingredientImage: {
    width: 40,
    height: 40,
  },
});
