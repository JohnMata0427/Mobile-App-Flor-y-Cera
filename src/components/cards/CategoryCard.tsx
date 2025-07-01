import { GRAY_COLOR_DARK } from '@/constants/Colors';
import { BODY_FONT, BOLD_BODY_FONT } from '@/constants/Fonts';
import type { Category } from '@/interfaces/Category';
import { toLocaleDate } from '@/utils/toLocaleDate';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { memo, type ReactNode } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

interface CategoryCardProps {
  data: Category;
  children?: ReactNode;
}

export const CategoryCard = memo(({ data, children }: CategoryCardProps) => {
  const { imagen, nombre, descripcion, updatedAt } = data;

  return (
    <View style={styles.categoryCard}>
      <Image source={{ uri: imagen }} resizeMode="contain" style={styles.categoryImage} />
      <View style={styles.categoryInfo}>
        <Text style={styles.categoryName}>{nombre}</Text>
        <View style={styles.dateRow}>
          <MaterialCommunityIcons name="calendar-clock" size={14} color={GRAY_COLOR_DARK} />
          <Text style={styles.dateText}>Categoría actualizada el {toLocaleDate(updatedAt)}</Text>
        </View>
        <Text style={styles.categoryDescription}>
          <MaterialCommunityIcons name="information" size={14} color={GRAY_COLOR_DARK} />
          {`  ${descripcion}`}
        </Text>
        {children}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  categoryCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  categoryImage: {
    width: '100%',
    aspectRatio: 2,
    borderRadius: 10,
  },
  categoryInfo: {
    rowGap: 3,
    paddingTop: 5,
  },
  categoryName: {
    fontFamily: BOLD_BODY_FONT,
    fontSize: 15,
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  categoryDescription: {
    fontFamily: BODY_FONT,
    fontSize: 12,
    color: GRAY_COLOR_DARK,
    textAlign: 'center',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5,
    justifyContent: 'center',
  },
  dateText: {
    fontFamily: BODY_FONT,
    fontSize: 12,
    color: GRAY_COLOR_DARK,
  },
});
