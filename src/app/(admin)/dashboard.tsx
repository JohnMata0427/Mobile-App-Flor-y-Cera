import { AdminHeader } from '@/components/AdminHeader';
import { Button } from '@/components/Button';
import { Loading } from '@/components/Loading';
import {
  GRAY_COLOR,
  GRAY_COLOR_DARK,
  PRIMARY_COLOR,
  SECONDARY_COLOR,
  TERTIARY_COLOR,
} from '@/constants/Colors';
import { BODY_FONT, BOLD_BODY_FONT } from '@/constants/Fonts';
import { DashboardContext, DashboardProvider } from '@/contexts/DashboardContext';
import { useAuthStore } from '@/store/useAuthStore';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { memo, use, useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width - 55;

const Dashboard = memo(() => {
  const { logout } = useAuthStore();
  const {
    currentWeekSales,
    lastWeekSales,
    productNames,
    productSales,
    totals,
    weekdays,
    loading,
    refreshing,
    setRefreshing,
    getDashboardGraphicsData,
  } = use(DashboardContext);
  const [hour, setHour] = useState<string>('');

  const requestLogout = useCallback(() => {
    Alert.alert('Cerrar sesión', '¿Está seguro de que desea cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar sesión',
        onPress: () => {
          logout();
        },
      },
    ]);
  }, [logout]);

  const updateTime = useCallback(() => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    setHour(`${hours}:${minutes < 10 ? '0' + minutes : minutes}`);
  }, []);

  useEffect(() => {
    updateTime();
    const interval = setInterval(() => {
      updateTime();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollViewContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true);
            await getDashboardGraphicsData();
          }}
          colors={[PRIMARY_COLOR, SECONDARY_COLOR, TERTIARY_COLOR]}
        />
      }
    >
      <View style={styles.container}>
        <AdminHeader showSearchBar={false}>
          <View style={styles.userInfoRow}>
            <MaterialCommunityIcons name="bell" size={24} color={GRAY_COLOR_DARK} />
            <Button
              label="Salir"
              icon="logout"
              onPress={requestLogout}
              buttonStyle={{
                paddingVertical: 5,
              }}
              textStyle={{ fontSize: 12 }}
            />
          </View>
        </AdminHeader>
        <View style={styles.greetingCard}>
          <View>
            <Text style={styles.greetingText}>Buenas tardes</Text>
            <Text style={styles.greetingName}>Actualmente son las {hour}</Text>
          </View>
          <View style={styles.adminCard}>
            <MaterialCommunityIcons name="shield-account" size={16} color="white" />
            <Text style={styles.adminText}>Administrador/a</Text>
          </View>
        </View>
        {loading ? (
          <Loading />
        ) : (
          <>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statTitle}>Clientes</Text>
                <MaterialCommunityIcons
                  name="account-multiple-plus"
                  size={24}
                  color={PRIMARY_COLOR}
                />
                <Text style={styles.statValue}>{totals.clients}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statTitle}>Ventas</Text>
                <MaterialCommunityIcons name="lightning-bolt" size={24} color={SECONDARY_COLOR} />
                <Text style={styles.statValue}>{totals.sales}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statTitle}>Productos</Text>
                <MaterialCommunityIcons name="candle" size={24} color={TERTIARY_COLOR} />
                <Text style={styles.statValue}>{totals.products}</Text>
              </View>
            </View>

            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Ingresos Semanales</Text>
              <LineChart
                data={{
                  labels: weekdays,
                  datasets: [
                    {
                      data: lastWeekSales,
                      strokeDashArray: [5],
                    },
                    {
                      data: currentWeekSales,
                      strokeDashArray: [5],
                      color: () => PRIMARY_COLOR,
                    },
                  ],
                }}
                chartConfig={{
                  backgroundGradientFrom: 'white',
                  backgroundGradientTo: 'white',
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                width={screenWidth}
                height={200}
                bezier
                yAxisLabel="$"
              />
              <View style={styles.chartLegend}>
                <Text>
                  <MaterialCommunityIcons name="circle" size={14} color={GRAY_COLOR_DARK} /> Última
                  semana
                </Text>
                <Text>
                  <MaterialCommunityIcons name="circle" size={14} color={PRIMARY_COLOR} /> Semana
                  actual
                </Text>
              </View>
            </View>
            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Comparativa de Productos Vendidos</Text>
              <PieChart
                data={[
                  {
                    name: productNames[0],
                    sales: productSales[0],
                    color: GRAY_COLOR_DARK,
                  },
                  {
                    name: productNames[1],
                    sales: productSales[1],
                    color: GRAY_COLOR,
                  },
                ]}
                paddingLeft="15"
                width={screenWidth}
                height={135}
                accessor="sales"
                backgroundColor="transparent"
                chartConfig={{
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
              />
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
});

export default function AdminDashboard() {
  return (
    <DashboardProvider>
      <Dashboard />
    </DashboardProvider>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
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
    borderColor: GRAY_COLOR_DARK,
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

  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});
