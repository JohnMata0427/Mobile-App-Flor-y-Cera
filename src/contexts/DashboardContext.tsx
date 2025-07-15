import { getClientsRequest } from '@/services/ClientService';
import { getInvoicesDashboardRequest, getInvoicesRequest } from '@/services/InvoiceService';
import { getProductsRequest } from '@/services/ProductService';
import { capitalizeWord } from '@/utils/textTransform';
import React, {
  createContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';

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
  setRefreshing: Dispatch<SetStateAction<boolean>>;
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

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
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

  const getDashboardGraphicsData = async () => {
    setLoading(true);
    try {
      const { clientes } = await getClientsRequest(1, 100);
      const { ventas } = await getInvoicesRequest(1, 100);
      const { productos } = await getProductsRequest(1, 100);

      setTotals({
        clients: clientes?.length ?? 0,
        sales: ventas?.length ?? 0,
        products: productos?.length ?? 0,
      });

      const { ventasDiarias, ventasPorCategoria } = await getInvoicesDashboardRequest();

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
  };

  useEffect(() => {
    getDashboardGraphicsData();
  }, []);

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
    ],
  );

  return <DashboardContext.Provider value={contextValues}>{children}</DashboardContext.Provider>;
};
