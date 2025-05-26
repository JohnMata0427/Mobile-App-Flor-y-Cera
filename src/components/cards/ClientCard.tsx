import {
  GRAY_COLOR_DARK,
  GRAY_COLOR_LIGHT,
  GREEN_COLOR_DARK,
  GREEN_COLOR_LIGHT,
  RED_COLOR_DARK,
  RED_COLOR_LIGHT,
} from '@/constants/Colors';
import { BODY_FONT, BOLD_BODY_FONT } from '@/constants/Fonts';
import type { Client } from '@/interfaces/Client';
import { toLocaleDate } from '@/utils/toLocaleDate';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { memo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

interface ClientCardProps {
  data: Client;
  isActive: boolean;
  children?: React.ReactNode;
}

export const ClientCard = memo(
  ({ data, isActive, children }: ClientCardProps) => {
    const {
      nombre,
      apellido,
      email,
      direccion,
      imagen,
      genero,
      estado,
      createdAt,
    } = data;

    const isMale = genero === 'Masculino';
    const defaultImageUrl =
      genero === 'Masculino'
        ? require('@/assets/male-user-default.jpg')
        : require('@/assets/female-user-default.jpg');
    return (
      <View style={styles.clientCard}>
        <View style={styles.clientInfoRow}>
          <View style={styles.clientInnerInfo}>
            <Image
              style={styles.clientImage}
              source={imagen ? { uri: imagen } : defaultImageUrl}
              resizeMode="cover"
            />
            <Text
              style={[
                styles.stateBadge,
                isActive ? styles.badgeActive : styles.badgeInactive,
              ]}
            >
              {estado}
            </Text>
          </View>
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={[styles.detailText, { fontFamily: BOLD_BODY_FONT }]}>
                {nombre} {apellido}
              </Text>
              <MaterialCommunityIcons
                name={isMale ? 'gender-male' : 'gender-female'}
                size={14}
                color={isMale ? '#007AFF' : '#FF1493'}
              />
            </View>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons
                name="email-check-outline"
                size={14}
                color={GRAY_COLOR_DARK}
              />
              <Text style={styles.detailText}>{email}</Text>
            </View>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons
                name="home-outline"
                size={14}
                color={GRAY_COLOR_DARK}
              />
              <Text style={styles.detailText}>
                {direccion ?? 'Dirección no registrada'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons
                name="calendar"
                size={14}
                color={GRAY_COLOR_DARK}
              />
              <Text style={styles.detailText}>
                Registrado el {toLocaleDate(createdAt)}
              </Text>
            </View>
          </View>
        </View>
        {children}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  clientCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    rowGap: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clientInfoRow: {
    flexDirection: 'row',
    columnGap: 10,
    alignItems: 'center',
  },
  clientInnerInfo: {
    rowGap: 4,
    justifyContent: 'center',
  },
  clientImage: {
    width: 45,
    height: 45,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: GRAY_COLOR_LIGHT,
  },
  stateBadge: {
    fontFamily: BODY_FONT,
    fontSize: 10,
    textAlign: 'center',
    paddingVertical: 1,
    borderRadius: 20,
  },
  badgeActive: {
    backgroundColor: GREEN_COLOR_LIGHT,
    color: GREEN_COLOR_DARK,
  },
  badgeInactive: {
    backgroundColor: RED_COLOR_LIGHT,
    color: RED_COLOR_DARK,
  },
  detailsContainer: {
    rowGap: 2,
  },
  detailRow: {
    flexDirection: 'row',
    columnGap: 2,
    alignItems: 'center',
  },
  detailText: {
    fontFamily: BODY_FONT,
    fontSize: 12,
  },
});
