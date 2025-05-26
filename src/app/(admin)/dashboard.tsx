import { AdminHeader } from '@/components/AdminHeader';
import {
  GRAY_COLOR_DARK,
  GRAY_COLOR_LIGHT,
  PRIMARY_COLOR,
  SECONDARY_COLOR,
  TERTIARY_COLOR,
} from '@/constants/Colors';
import { BODY_FONT, BOLD_BODY_FONT } from '@/constants/Fonts';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState } from 'react';
import {
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LineChart, ProgressChart } from 'react-native-chart-kit';

export default function AdminDashboard() {
  const [refreshing, setRefreshing] = useState(false);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollViewContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            // Simulate a network request
            setTimeout(() => {
              setRefreshing(false);
            }, 1000);
          }}
          colors={[PRIMARY_COLOR, SECONDARY_COLOR, TERTIARY_COLOR]}
        />
      }
    >
      <View style={styles.container}>
        <AdminHeader showSearchBar={false}>
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
        </AdminHeader>
        <View style={styles.greetingCard}>
          <View>
            <Text style={styles.greetingText}>Buenas tardes</Text>
            <Text style={styles.greetingName}>Estefanía Sanchez</Text>
          </View>
          <View style={styles.adminCard}>
            <MaterialCommunityIcons
              name="shield-account"
              size={16}
              color="white"
            />
            <Text style={styles.adminText}>Administrador</Text>
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statTitle}>Clientes</Text>
            <MaterialCommunityIcons
              name="account-multiple-plus"
              size={24}
              color={PRIMARY_COLOR}
            />
            <Text style={styles.statValue}>
              {Math.floor(Math.random() * 1000)}
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statTitle}>Ventas</Text>
            <MaterialCommunityIcons
              name="lightning-bolt"
              size={24}
              color={SECONDARY_COLOR}
            />
            <Text style={styles.statValue}>
              {Math.floor(Math.random() * 1000)}
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statTitle}>Productos</Text>
            <MaterialCommunityIcons
              name="candle"
              size={24}
              color={TERTIARY_COLOR}
            />
            <Text style={styles.statValue}>
              {Math.floor(Math.random() * 1000)}
            </Text>
          </View>
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Ventas Semanales</Text>
          <LineChart
            data={{
              labels: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'],
              datasets: [
                {
                  data: [
                    Math.random() * 1000,
                    Math.random() * 1000,
                    Math.random() * 1000,
                    Math.random() * 1000,
                    Math.random() * 1000,
                    Math.random() * 1000,
                    Math.random() * 1000,
                  ],
                  strokeDashArray: [5],
                },
                {
                  data: [
                    Math.random() * 1000,
                    Math.random() * 1000,
                    Math.random() * 1000,
                    Math.random() * 1000,
                    Math.random() * 1000,
                    Math.random() * 1000,
                    Math.random() * 1000,
                  ],
                  strokeDashArray: [5],
                },
              ],
            }}
            chartConfig={{
              backgroundGradientFrom: 'white',
              backgroundGradientTo: 'white',
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            width={Dimensions.get('window').width - 65}
            height={200}
            bezier
          />
        </View>
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Productos Vendidos</Text>
          <ProgressChart
            data={{
              labels: ['Velas', 'Jabones'],
              data: [Math.random(), Math.random()],
            }}
            width={Dimensions.get('window').width - 65}
            height={140}
            chartConfig={{
              backgroundGradientFrom: 'white',
              backgroundGradientTo: 'white',
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
          />
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
    paddingHorizontal: 20,
    paddingBottom: 10,
    rowGap: 10,
  },
  greetingCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingText: {
    fontFamily: BODY_FONT,
    fontSize: 12,
  },
  greetingName: {
    fontFamily: BOLD_BODY_FONT,
  },
  adminCard: {
    backgroundColor: GRAY_COLOR_DARK,
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5,
  },
  adminText: {
    fontFamily: BOLD_BODY_FONT,
    color: 'white',
    fontSize: 12,
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
    borderColor: GRAY_COLOR_LIGHT,
  },
  statsRow: {
    flexDirection: 'row',
    columnGap: 5,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    rowGap: 5,
  },
  statTitle: {
    fontFamily: BOLD_BODY_FONT,
    fontSize: 12,
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
    fontWeight: 'bold',
  },
  chartCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 15,
    rowGap: 5,
  },
  chartTitle: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
