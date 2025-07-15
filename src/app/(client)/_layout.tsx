import { TabLayout } from '@/components/TabLayout';
import { CLIENT_TABS } from '@/constants/Tabs';
import { useCartStore } from '@/store/useCartStore';

export default function ClientLayout() {
  const { totalProducts } = useCartStore();

  return <TabLayout tabs={CLIENT_TABS} totalProducts={totalProducts} />;
}
