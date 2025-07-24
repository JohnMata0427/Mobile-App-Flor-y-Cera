import { GRAY_COLOR_DARK, PRIMARY_COLOR_DARK, PRIMARY_COLOR_LIGHT } from '@/constants/Colors';
import { globalStyles } from '@/globalStyles';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { memo, type Dispatch, type SetStateAction } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

interface AnyFilter {
  key: string;
  value: string;
}

interface FilterButton {
  label: string;
  filter: AnyFilter;
}

interface AdminFilterProps {
  filterButtons: FilterButton[];
  filter: AnyFilter;
  setFilter: Dispatch<SetStateAction<AnyFilter>>;
}

const RenderItem = memo(({ item, filter, setFilter }: any) => (
  <Pressable onPress={() => setFilter(item.filter)}>
    <Text
      style={[
        filter.value === item.filter.value
          ? styles.selectedCategoryText
          : styles.noSelectedCategoryText,
        styles.categoryText,
      ]}
    >
      {item.label}
    </Text>
  </Pressable>
));

export const AdminFilter = memo(({ filterButtons, filter, setFilter }: AdminFilterProps) => (
  <View style={styles.container}>
    <View style={styles.filterContainer}>
      <MaterialCommunityIcons name="cards" size={16} color="white" />
      <Text style={globalStyles.buttonText}>Filtros:</Text>
    </View>

    <FlatList
      data={filterButtons}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filterListContent}
      keyExtractor={({ filter: { value } }) => value}
      renderItem={({ item }) => <RenderItem item={item} filter={filter} setFilter={setFilter} />}
    />
  </View>
));

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    columnGap: 5,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5,
    backgroundColor: GRAY_COLOR_DARK,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: 'black',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 5,
  },
  filterListContent: { columnGap: 5, alignItems: 'center' },
  selectedCategoryText: {
    fontWeight: '900',
    color: PRIMARY_COLOR_DARK,
    backgroundColor: PRIMARY_COLOR_LIGHT,
  },
  noSelectedCategoryText: {
    color: GRAY_COLOR_DARK,
  },
  categoryText: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    fontSize: 13,
    borderWidth: 1,
    borderColor: PRIMARY_COLOR_LIGHT,
    borderRadius: 5,
  },
});
