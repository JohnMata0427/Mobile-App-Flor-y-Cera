import { getClientsRequest } from '@/services/ClientService';
import { getInvoicesDashboardRequest, getInvoicesRequest } from '@/services/InvoiceService';
import { getProductsRequest } from '@/services/ProductService';
import { useAuthStore } from '@/store/useAuthStore';
import { capitalizeWord } from '@/utils/textTransform';
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';

interface DashboardTotals {
  clients: number;
  sales: number;
  products: number;
}

interface DashboardContextProps {
  totals: DashboardTotals;
  weekdays: string[];
  lastWeekSales: number[];
  currentWeekSales: number[];
  productNames: string[];
  productSales: number[];
  loading: boolean;
  refreshing: boolean;
  setRefreshing: React.Dispatch<React.SetStateAction<boolean>>;
  getDashboardGraphicsData: () => Promise<void>;
}

export const DashboardContext = createContext<DashboardContextProps>({
  totals: {
    clients: 0,
    sales: 0,
    products: 0,
  },
  weekdays: [],
  lastWeekSales: [],
  currentWeekSales: [],
  productNames: [],
  productSales: [],
  loading: false,
  refreshing: false,
  setRefreshing: () => {},
  getDashboardGraphicsData: async () => {},
});

export const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuthStore();
  const [totals, setTotals] = useState<DashboardTotals>({
    clients: 0,
    sales: 0,
    products: 0,
  });
  const [weekdays, setWeekdays] = useState<string[]>([
    'Dom',
    'Lun',
    'Mar',
    'Mié',
    'Jue',
    'Vie',
    'Sáb',
  ]);
  const [lastWeekSales, setLastWeekSales] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [currentWeekSales, setCurrentWeekSales] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [productNames, setProductNames] = useState<string[]>(['jabones', 'velas']);
  const [productSales, setProductSales] = useState<number[]>([0, 0]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const getDashboardGraphicsData = useCallback(async () => {
    setLoading(true);
    try {
      const { clientes } = await getClientsRequest(1, 100, token);
      const { ventas } = await getInvoicesRequest(1, 100, token);
      const { productos } = await getProductsRequest(1, 100);

      setTotals({
        clients: clientes.length,
        sales: ventas.length,
        products: productos.length,
      });

      const { ventasDiarias, ventasPorCategoria } = await getInvoicesDashboardRequest(token);

      const weekdaysData: string[] = [];
      const lastWeekSalesData: number[] = [];
      const currentWeekSalesData: number[] = [];
      const productNamesData: string[] = [];
      const productSalesData: number[] = [];

      ventasDiarias.forEach(({ fecha, totalVentas }, index) => {
        const [day, month, year] = fecha.split('/').map(Number);
        const date = new Date(year, month - 1, day);
        const dia = date.toLocaleDateString('es-EC', {
          weekday: 'short',
        });

        if (index < 7) {
          weekdaysData.push(capitalizeWord(dia));
          lastWeekSalesData.push(totalVentas);
        } else {
          currentWeekSalesData.push(totalVentas);
        }
      });

      ventasPorCategoria.forEach(({ categoría, vendidos }) => {
        productNamesData.push(capitalizeWord(categoría));
        productSalesData.push(vendidos);
      });

      setWeekdays(weekdaysData);
      setLastWeekSales(lastWeekSalesData);
      setCurrentWeekSales(currentWeekSalesData);
      setProductNames(productNamesData);
      setProductSales(productSalesData);
    } catch {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    getDashboardGraphicsData();
  }, [getDashboardGraphicsData]);

  const contextValues = useMemo<DashboardContextProps>(
    () => ({
      totals,
      weekdays,
      lastWeekSales,
      currentWeekSales,
      productNames,
      productSales,
      loading,
      refreshing,
      setRefreshing,
      getDashboardGraphicsData,
    }),
    [
      totals,
      weekdays,
      lastWeekSales,
      currentWeekSales,
      productNames,
      productSales,
      loading,
      refreshing,
      setRefreshing,
      getDashboardGraphicsData,
    ],
  );

  return <DashboardContext.Provider value={contextValues}>{children}</DashboardContext.Provider>;
};
