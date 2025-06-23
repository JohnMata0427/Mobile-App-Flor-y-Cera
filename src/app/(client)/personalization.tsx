import { Button } from '@/components/Button';
import {
  GRAY_COLOR_DARK,
  PRIMARY_COLOR,
  PRIMARY_COLOR_DARK,
  PRIMARY_COLOR_LIGHT,
  SECONDARY_COLOR_LIGHT,
  TERTIARY_COLOR,
  TERTIARY_COLOR_DARK,
  TERTIARY_COLOR_LIGHT,
} from '@/constants/Colors';
import { IngredientsContext, IngredientsProvider } from '@/contexts/IngredientsContext';
import type { Ingredient } from '@/interfaces/Ingredient';
import { getDominantColor } from '@/utils/getDominantColor';
import { capitalizeFirstLetter } from '@/utils/textTransform';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { memo, use, useEffect, useState } from 'react';
import { FlatList, Image, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { DraxProvider, DraxView } from 'react-native-drax';
import {
  GestureHandlerRootView,
  Pressable,
  ScrollView,
  TextInput,
} from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ingredientType = 'molde' | 'aroma' | 'esencia' | 'color';

const Personalization = memo(() => {
  const { top } = useSafeAreaInsets();
  const { ingredients } = use(IngredientsContext);
  const [filteredIngredients, setFilteredIngredients] = useState<Ingredient[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<ingredientType>('aroma');
  const [filters, setFilters] = useState<ingredientType[]>(['aroma', 'molde', 'esencia', 'color']);

  const [selectedMold, setSelectedMold] = useState<Ingredient | null>(null);
  const [selectedColor, setSelectedColor] = useState<Ingredient | null>(null);
  const [selectedAroma, setSelectedAroma] = useState<Ingredient | null>(null);
  const [selectedEssences, setSelectedEssences] = useState<Ingredient[]>([]);
  const [tintedColor, setTintedColor] = useState<string | undefined>(undefined);

  const [form, setForm] = useState({
    id_categoria: '680fd248f613dc80267ba5d7',
    tipo_producto: 'piel grasa',
    ingredientes: [] as Ingredient[],
  });

  useEffect(() => {
    let filtered = ingredients.filter(({ tipo }) => tipo === selectedFilter);

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

    setFilteredIngredients(filtered);
  }, [ingredients, selectedFilter, selectedMold, selectedColor, selectedAroma, selectedEssences]);

  useEffect(() => {
    (async () => {
      if (selectedColor?._id) {
        const dominantColor = await getDominantColor(selectedColor.imagen);
        setTintedColor(dominantColor);
      }
    })();
  }, [selectedColor]);

  return (
    <>
      <View style={[styles.searchContainer, { paddingTop: top + 5 }]}>
        <View style={{ flex: 1 }}>
          <TextInput style={styles.searchInput} placeholder="Jabón de canela..." />
          <Pressable style={styles.searchIcon}>
            <MaterialCommunityIcons name="magnify" size={20} color="white" />
          </Pressable>
        </View>
        <MaterialCommunityIcons name="heart-outline" size={28} color="white" />
      </View>

      <ScrollView
        contentContainerStyle={{ flex: 1, justifyContent: 'center', margin: 10, rowGap: 10 }}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {}}
            colors={[PRIMARY_COLOR_DARK, SECONDARY_COLOR_LIGHT, TERTIARY_COLOR_LIGHT]}
          />
        }
      >
        <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>
          Bienvenido al Taller de Flor & Cera
        </Text>

        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
          <DraxView
            style={{
              backgroundColor: PRIMARY_COLOR_LIGHT,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderStyle: 'dashed',
              padding: 10,
              aspectRatio: 1,
              width: '50%',
            }}
            onReceiveDragDrop={({ dragged: { payload } }) => {
              if (payload.tipo === 'molde') {
                setSelectedMold(payload);
              } else if (payload.tipo === 'color' && selectedMold?._id) {
                setSelectedColor(payload);
              }
            }}
          >
            {selectedMold?._id ? (
              <Image
                source={{ uri: selectedMold.imagen }}
                style={{ width: '75%', height: '75%', tintColor: tintedColor }}
                resizeMode="contain"
              />
            ) : (
              <Text style={{ textAlign: 'center' }}>Arrastra un molde y un color aquí</Text>
            )}
          </DraxView>
          <View style={{ width: '30%' }}>
            <DraxView
              style={{
                backgroundColor: SECONDARY_COLOR_LIGHT,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderStyle: 'dashed',
                padding: 10,
              }}
              onReceiveDragDrop={({ dragged: { payload } }) => {
                if (payload.tipo === 'aroma') {
                  setSelectedAroma(payload);
                }
              }}
            >
              {selectedAroma?._id ? (
                <Image
                  source={{ uri: selectedAroma.imagen }}
                  style={{ width: 40, height: 40 }}
                  resizeMode="contain"
                />
              ) : (
                <Text style={{ textAlign: 'center' }}>Arrastra un aroma aquí</Text>
              )}
            </DraxView>
            <DraxView
              style={{
                backgroundColor: TERTIARY_COLOR_LIGHT,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderStyle: 'dashed',
                padding: 10,
                flex: 1,
              }}
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
                  scrollEnabled={false}
                  keyExtractor={({ _id }) => _id}
                  contentContainerStyle={{ rowGap: 5, margin: 'auto' }}
                  renderItem={({ item }) => (
                    <Image
                      source={{ uri: item.imagen }}
                      style={{ width: 40, height: 40 }}
                      resizeMode="contain"
                    />
                  )}
                />
              ) : (
                <Text style={{ textAlign: 'center' }}>Arrastra dos esencias aquí</Text>
              )}
            </DraxView>
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'center', columnGap: 10 }}>
          <Button label="Crear producto" icon="shimmer" onPress={() => {}} />
          <Button
            label="Recomendación con IA"
            icon="shimmer"
            onPress={() => {}}
            backgroundColor={TERTIARY_COLOR}
            borderColor={TERTIARY_COLOR_DARK}
          />
        </View>

        <View
          style={{ flexDirection: 'row', alignItems: 'center', columnGap: 10, flexWrap: 'wrap' }}
        >
          {filters.map(type => (
            <Text
              key={type}
              style={{
                borderRadius: 5,
                paddingVertical: 5,
                paddingHorizontal: 10,
                backgroundColor: selectedFilter === type ? PRIMARY_COLOR : 'white',
                borderBottomWidth: 1,
                borderRightWidth: 1,
                borderColor: selectedFilter === type ? PRIMARY_COLOR_DARK : 'white',
                color: selectedFilter === type ? 'white' : 'black',
              }}
              onPress={() => setSelectedFilter(type)}
            >
              {capitalizeFirstLetter(type)}
            </Text>
          ))}
        </View>

        <DraxView
          style={{
            backgroundColor: 'white',
            borderRadius: 10,
            paddingVertical: 10,
            paddingHorizontal: 15,
          }}
          onReceiveDragDrop={({ dragged: { payload } }) => {}}
        >
          <FlatList
            data={filteredIngredients}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={({ _id }) => _id}
            contentContainerStyle={{ columnGap: 10 }}
            renderItem={({ item, index }) => (
              <View style={{ alignItems: 'center', marginRight: 10 }}>
                <DraxView key={index} draggable payload={item}>
                  <Image
                    source={{ uri: item.imagen }}
                    style={{ width: 40, height: 40 }}
                    resizeMode="contain"
                  />
                </DraxView>
                <Text>{capitalizeFirstLetter(item.nombre)}</Text>
              </View>
            )}
          />
        </DraxView>
      </ScrollView>
    </>
  );
});

export default function PersonalizationScreen() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <IngredientsProvider>
        <DraxProvider>
          <Personalization />
        </DraxProvider>
      </IngredientsProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  searchContainer: {
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    columnGap: 10,
  },
  searchInput: {
    borderRadius: 20,
    backgroundColor: 'white',
    paddingLeft: 20,
    paddingRight: 70,
    fontSize: 12,
  },
  searchIcon: {
    position: 'absolute',
    insetBlock: 3,
    right: 3,
    justifyContent: 'center',
    backgroundColor: GRAY_COLOR_DARK,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 20,
  },

  headerContainer: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
});
