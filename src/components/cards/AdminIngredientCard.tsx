import { GRAY_COLOR_DARK, GRAY_COLOR_LIGHT, PRIMARY_COLOR, PRIMARY_COLOR_EXTRA_LIGHT, PRIMARY_COLOR_LIGHT } from '@/constants/Colors';
import { globalStyles } from '@/globalStyles';
import type { Ingredient } from '@/interfaces/Ingredient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { memo, type ReactNode } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { BaseCard } from './BaseCard';
import { capitalizeWord } from '@/utils/textTransform';

interface AdminIngredientCardProps {
  data: Ingredient;
  category?: string;
  children?: ReactNode;
}

export const AdminIngredientCard = memo(
  ({ data: { imagen, nombre, precio, stock }, category, children }: AdminIngredientCardProps) => (
    <BaseCard styles={styles.card}>
      <Image
        source={{ uri: imagen }}
        resizeMode="contain"
        style={styles.ingredientImage}
      />
      <View style={styles.ingredientInfo}>
        <Text style={globalStyles.labelText}>{capitalizeWord(nombre)}</Text>
        <View style={styles.priceStockRow}>
          <Text style={globalStyles.bodyText}>${precio} USD</Text>
          <Text style={styles.categoryBadge}>{category}</Text>
        </View>
        <View style={styles.stockRow}>
          <MaterialCommunityIcons name="cart-outline" size={14} color="green" />
          <Text style={globalStyles.bodyText}>
            {stock} en stock
          </Text>
        </View>
        {children}
      </View>
    </BaseCard>
  ),
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    maxWidth: '48.6%',
  },
  ingredientImage: {
    aspectRatio: 1 / 1,
    borderRadius: 10,
    backgroundColor: PRIMARY_COLOR_EXTRA_LIGHT,
    padding: 10,
  },
  ingredientInfo: {
    rowGap: 2,
  },
  priceStockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    fontSize: 10,
    color: 'white',
    backgroundColor: GRAY_COLOR_DARK,
    paddingVertical: 1,
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  stockRow: {
    flexDirection: 'row',
    columnGap: 4,
    alignItems: 'center',
  },
});