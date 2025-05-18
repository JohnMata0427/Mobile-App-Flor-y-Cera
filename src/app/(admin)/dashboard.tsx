import { AdminHeader } from '@/components/AdminHeader';
import {
  GRAY_COLOR,
  GRAY_COLOR_DARK,
  GRAY_COLOR_LIGHT,
  PRIMARY_COLOR,
  SECONDARY_COLOR,
  TERTIARY_COLOR,
} from '@/constants/Colors';
import { BODY_FONT, BOLD_BODY_FONT } from '@/constants/Fonts';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function AdminDashboard() {
  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <AdminHeader />
        <View style={styles.greetingCard}>
          <View style={styles.greetingTextContainer}>
            <Text style={styles.greetingText}>Buenas tardes</Text>
            <Text style={styles.greetingName}>Estefanía Sanchez</Text>
          </View>
          <View style={styles.userInfoRow}>
            <MaterialCommunityIcons
              name="bell"
              size={24}
              color={GRAY_COLOR_DARK}
            />
            <Image
              source={require('@/assets/profile.jpg')}
              style={styles.profileImage}
            />
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statTitle}>Usuarios registrados</Text>
            <MaterialCommunityIcons
              name="account-multiple-plus"
              size={24}
              color={PRIMARY_COLOR}
              style={[styles.statIcon, styles.usersIcon]}
            />
            <Text style={styles.statValue}>4 usuarios</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statTitle}>Productos vendidos</Text>
            <MaterialCommunityIcons
              name="briefcase-check"
              size={24}
              color={SECONDARY_COLOR}
              style={[styles.statIcon, styles.productsSoldIcon]}
            />
            <Text style={styles.statValue}>1 ventas</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statTitle}>Productos activos</Text>
            <MaterialCommunityIcons
              name="candle"
              size={24}
              color={TERTIARY_COLOR}
              style={[styles.statIcon, styles.activeProductsIcon]}
            />
            <Text style={styles.statValue}>3 productos</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    paddingHorizontal: 25,
    rowGap: 10,
  },
  greetingCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: GRAY_COLOR_LIGHT,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },
  greetingTextContainer: {
    rowGap: 3,
  },
  greetingText: {
    fontFamily: BODY_FONT,
  },
  greetingName: {
    fontFamily: BOLD_BODY_FONT,
    fontSize: 18,
  },
  userInfoRow: {
    flexDirection: 'row',
    columnGap: 10,
    alignItems: 'center',
  },
  notificationIcon: {
    marginRight: 5,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: GRAY_COLOR,
  },
  statsRow: {
    flexDirection: 'row',
    columnGap: 5,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    rowGap: 10,
    borderColor: GRAY_COLOR_LIGHT,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },
  statTitle: {
    fontFamily: BOLD_BODY_FONT,
    fontSize: 10,
    textAlign: 'center',
  },
  statIcon: {
    padding: 5,
    borderWidth: 2,
    borderRadius: 50,
  },
  usersIcon: {
    borderColor: PRIMARY_COLOR,
    padding: 5,
    borderWidth: 2,
    borderRadius: 50,
  },
  productsSoldIcon: {
    borderColor: SECONDARY_COLOR,
    padding: 5,
    borderWidth: 2,
    borderRadius: 50,
  },
  activeProductsIcon: {
    borderColor: TERTIARY_COLOR,
    padding: 5,
    borderWidth: 2,
    borderRadius: 50,
  },
  statValue: {
    fontFamily: BODY_FONT,
  },
});
