import { PRIMARY_COLOR_LIGHT, SECONDARY_COLOR_LIGHT } from '@/constants/Colors';
import { globalStyles } from '@/globalStyles';
import { Image } from 'expo-image';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function AboutUsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Image
        source={require('@/assets/about/header.webp')}
        style={{ width: '100%', height: '33.55%' }}
        contentFit="contain"
      />
      <View style={{ rowGap: 10, padding: 15 }}>
        <Text style={globalStyles.title}>Nuestra historia</Text>
        <Text style={[globalStyles.bodyText, { textAlign: 'center' }]}>
          En Flor & Cera, creemos en el poder de lo natural y lo artesanal. Nuestra pasión por el
          bienestar y el cuidado de la piel nos llevó a crear jabones y velas hechos a mano,
          utilizando ingredientes puros, libres de químicos agresivos y respetuosos con el medio
          ambiente.
        </Text>
      </View>
      <View
        style={{
          rowGap: 10,
          paddingVertical: 15,
          paddingHorizontal: 10,
          backgroundColor: SECONDARY_COLOR_LIGHT,
        }}
      >
        <Text style={globalStyles.title}>Nuestra filosofía</Text>
        <FlatList
          data={cards}
          keyExtractor={({ title }) => title}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          numColumns={2}
          contentContainerStyle={{ rowGap: 10, justifyContent: 'center' }}
          renderItem={({ item }) => (
            <View style={[styles.card, { backgroundColor: item.backgroundColor, width: '47%' }]}>
              <Text>{item.emoji}</Text>
              <Text style={globalStyles.subtitle}>{item.title}</Text>
              <Text style={[globalStyles.bodyText, { textAlign: 'center' }]}>{item.content}</Text>
            </View>
          )}
        />
      </View>

      <View
        style={{
          rowGap: 10,
          paddingVertical: 15,
          paddingHorizontal: 10,
          backgroundColor: PRIMARY_COLOR_LIGHT,
        }}
      >
        <Text style={globalStyles.title}>Nuestra misión</Text>
        <FlatList
          data={cards}
          keyExtractor={({ title }) => title}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          numColumns={2}
          contentContainerStyle={{ rowGap: 10, justifyContent: 'center' }}
          renderItem={({ item }) => (
            <View style={[styles.card, { backgroundColor: item.backgroundColor, width: '47%' }]}>
              <Text>{item.emoji}</Text>
              <Text style={globalStyles.subtitle}>{item.title}</Text>
              <Text style={[globalStyles.bodyText, { textAlign: 'center' }]}>{item.content}</Text>
            </View>
          )}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  card: {
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
    rowGap: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const cards = [
  {
    emoji: '🌿',
    title: 'Ingredientes Naturales',
    content: 'Utilizamos aceites esenciales, mantecas vegetales y extractos botánicos.',
    backgroundColor: '#E8F5E9',
  },
  {
    emoji: '✋',
    title: 'Hecho a Mano',
    content:
      'Cada jabón y vela es elaborado artesanalmente, asegurando calidad y originalidad en cada pieza.',
    backgroundColor: '#FFF3E0',
  },
  {
    emoji: '♻️',
    title: 'Sostenibilidad',
    content:
      'Nos comprometemos con el medio ambiente utilizando empaques ecológicos y procesos responsables.',
    backgroundColor: '#E3F2FD',
  },
  {
    emoji: '🧘',
    title: 'Bienestar y Relajación',
    content:
      'Nos comprometemos con el medio ambiente utilizando empaques ecológicos y procesos responsables.',
    backgroundColor: '#F3E5F5',
  },
];
