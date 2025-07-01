export interface DashboardResume {
  numeroClientes: number;
  ventasDiarias: DailySale[];
  ventasPorCategoria: SaleByCategory[];
}

export interface DailySale {
  fecha: `${number}-${number}-${number}`;
  totalVentas: number;
}

export interface SaleByCategory {
  categoría: 'jabones' | 'velas';
  vendidos: number;
}
