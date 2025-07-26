import { GRAY_COLOR_DARK } from '@/constants/Colors';
import type { Promotion } from '@/interfaces/Promotion';
import { toLocaleDate } from '@/utils/toLocaleDate';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import { memo, type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BaseCard } from './BaseCard';

interface PromotionCardProps {
  data: Promotion;
  children?: ReactNode;
}

export const PromotionCard = memo(({ data, children }: PromotionCardProps) => {
  const { imagen, nombre, updatedAt } = data;

  return (
    <BaseCard>
      <Image source={{ uri: imagen }} style={styles.promotionImage} />
      <View style={styles.promotionInfo}>
        <Text style={styles.promotionName}>{nombre}</Text>
        <View style={styles.dateRow}>
          <MaterialCommunityIcons name="calendar-clock" size={14} color={GRAY_COLOR_DARK} />
          <Text style={styles.dateText}>Promoción actualizada el {toLocaleDate(updatedAt)}</Text>
        </View>

        {children}
      </View>
    </BaseCard>
  );
});

const styles = StyleSheet.create({
  promotionImage: {
    width: '100%',
    aspectRatio: 16 / 11,
    borderRadius: 10,
  },
  promotionInfo: {
    rowGap: 3,
    paddingTop: 5,
  },
  promotionName: {
    fontWeight: 'bold',
    fontSize: 15,
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 12,
    color: GRAY_COLOR_DARK,
  },
});
