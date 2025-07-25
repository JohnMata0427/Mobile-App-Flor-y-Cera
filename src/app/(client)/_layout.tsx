import { TabLayout } from '@/components/TabLayout';
import { CLIENT_TABS } from '@/constants/Tabs';
import { useCartStore } from '@/store/useCartStore';
import { useNotificationsStore } from '@/store/useNotificationsStore';
import { addNotificationReceivedListener } from 'expo-notifications';
import { useEffect } from 'react';

export default function ClientLayout() {
  const { totalProducts, getClientCart } = useCartStore();
  const { setReadNotifications, getNotificationsClient } = useNotificationsStore();

  useEffect(() => {
    (async () => {
      await getClientCart();
      await getNotificationsClient();
    })();

    const receivedListener = addNotificationReceivedListener(() => {
      setReadNotifications(true);
    });

    return () => {
      receivedListener.remove();
    };
  }, []);

  return <TabLayout tabs={CLIENT_TABS} totalProducts={totalProducts} />;
}
