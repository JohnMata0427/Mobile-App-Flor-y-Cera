import { AdminHeader } from '@/components/AdminHeader';
import { Button } from '@/components/Button';
import { Loading } from '@/components/Loading';
import {
  GRAY_COLOR,
  GRAY_COLOR_DARK,
  PRIMARY_COLOR,
  REFRESH_COLORS,
  SECONDARY_COLOR,
  TERTIARY_COLOR,
} from '@/constants/Colors';
import { DashboardContext, DashboardProvider } from '@/contexts/DashboardContext';
import { globalStyles } from '@/globalStyles';
import { useAuthStore } from '@/store/useAuthStore';
import { showConfirmationAlert } from '@/utils/showAlert';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { memo, use, useCallback, useEffect, useState } from 'react';
import { Dimensions, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
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
    showConfirmationAlert({
      message: '¿Está seguro/a de que desea cerrar sesión?',
      onConfirm: () => logout(),
      confirmButtonText: 'Cerrar sesión',
    });
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
  }, [updateTime]);

  return (
    <ScrollView
      contentContainerStyle={globalStyles.scrollViewContent}
      stickyHeaderIndices={[0]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true);
            await getDashboardGraphicsData();
          }}
          colors={REFRESH_COLORS}
        />
      }
    >
      <AdminHeader>
        <View style={[globalStyles.rowContainer, styles.headerContainer]}>
          <MaterialCommunityIcons name="bell" size={24} color={GRAY_COLOR_DARK} />
          <Button
            label="Salir"
            icon="logout"
            onPress={requestLogout}
            buttonStyle={styles.logoutButton}
            textStyle={styles.logoutButtonText}
          />
        </View>
      </AdminHeader>

      <View style={styles.container}>
        <View style={styles.greetingCard}>
          <View>
            <Text style={globalStyles.bodyText}>Buenas tardes</Text>
            <Text style={globalStyles.labelText}>Actualmente son las {hour}</Text>
          </View>
          <View style={styles.adminCard}>
            <MaterialCommunityIcons name="shield-account" size={16} color="white" />
            <Text style={[globalStyles.buttonText, styles.adminText]}>Administrador</Text>
          </View>
        </View>
        {loading ? (
          <Loading />
        ) : (
          <>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={globalStyles.labelText}>Clientes</Text>
                <MaterialCommunityIcons
                  name="account-multiple-plus"
                  size={24}
                  color={PRIMARY_COLOR}
                />
                <Text style={styles.statValue}>{totals.clients}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={globalStyles.labelText}>Ventas</Text>
                <MaterialCommunityIcons name="lightning-bolt" size={24} color={SECONDARY_COLOR} />
                <Text style={styles.statValue}>{totals.sales}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={globalStyles.labelText}>Productos</Text>
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
                absolute
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
  headerContainer: { columnGap: 10 },
  container: {
    flex: 1,
    rowGap: 10,
    paddingHorizontal: 15,
    paddingTop: 5,
  },
  greetingCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    fontSize: 12,
  },
  statsRow: {
    flexDirection: 'row',
    columnGap: 10,
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
    fontWeight: 'bold',
    textAlign: 'center',
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  logoutButton: {
    paddingVertical: 5,
  },
  logoutButtonText: {
    fontSize: 12,
  },
});
