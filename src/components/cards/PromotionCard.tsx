import { GRAY_COLOR_DARK } from '@/constants/Colors';
import { BODY_FONT, BOLD_BODY_FONT } from '@/constants/Fonts';
import type { Promotion } from '@/interfaces/Promotion';
import { toLocaleDate } from '@/utils/toLocaleDate';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { memo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

interface PromotionCardProps {
  data: Promotion;
  children?: React.ReactNode;
}

export const PromotionCard = memo(({ data, children }: PromotionCardProps) => {
  const { imagen, nombre, createdAt } = data;

  return (
    <View style={styles.promotionCard}>
      <Image source={{ uri: imagen }} resizeMode="cover" style={styles.promotionImage} />
      <View style={styles.promotionInfo}>
        <Text style={styles.promotionName}>{nombre}</Text>
        <View style={styles.dateRow}>
          <MaterialCommunityIcons
            name="calendar-clock"
            size={14}
            color={GRAY_COLOR_DARK}
          />
          <Text style={styles.dateText}>
            Promoción creada el {toLocaleDate(createdAt)}
          </Text>
        </View>

        {children}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  promotionCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  promotionImage: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 10,
  },
  promotionInfo: {
    rowGap: 3,
    paddingTop: 5,
  },
  promotionName: {
    fontFamily: BOLD_BODY_FONT,
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
    fontFamily: BODY_FONT,
    fontSize: 12,
    color: GRAY_COLOR_DARK,
  },
});
