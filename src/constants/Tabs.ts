import type MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export interface Tab {
  name: string;
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}

export const ADMIN_TABS: Tab[] = [
  {
    name: 'clients',
    title: 'Clientes',
    icon: 'account-supervisor-circle',
  },
  {
    name: 'inventory',
    title: 'Inventario',
    icon: 'package-variant',
  },
  {
    name: 'dashboard',
    title: 'Dashboard',
    icon: 'monitor-dashboard',
  },
  {
    name: 'invoices',
    title: 'Facturas',
    icon: 'script-text-outline',
  },
  {
    name: 'promotions',
    title: 'Promociones',
    icon: 'bullhorn-variant-outline',
  },
];

export const CLIENT_TABS: Tab[] = [
  {
    name: 'home',
    title: 'Inicio',
    icon: 'home-heart',
  },
  {
    name: '(catalog)',
    title: 'Catálogo',
    icon: 'candle',
  },
  {
    name: '(personalization)',
    title: 'Personalizar',
    icon: 'shimmer',
  },
  {
    name: '(cart)',
    title: 'Carrito',
    icon: 'cart-variant',
  },
  {
    name: '(profile)',
    title: 'Perfil',
    icon: 'badge-account',
  },
];
