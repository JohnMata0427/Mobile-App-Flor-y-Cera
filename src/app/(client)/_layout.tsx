import {
  GRAY_COLOR_DARK,
  PRIMARY_COLOR_DARK,
  PRIMARY_COLOR_LIGHT,
} from '@/constants/Colors';
import { CLIENT_TABS } from '@/constants/Tabs';
import { tabsGlobalStyles } from '@/globalStyles';
import { useCartStore } from '@/store/useCartStore';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { Tabs } from 'expo-router';

const screenOptions: BottomTabNavigationOptions = {
  headerShown: false,
  animation: 'shift',
  tabBarStyle: tabsGlobalStyles.tabBarStyle,
  tabBarLabelStyle: tabsGlobalStyles.tabBarLabelStyle,
  tabBarBadgeStyle: tabsGlobalStyles.tabBarBadgeStyle,
  tabBarInactiveTintColor: GRAY_COLOR_DARK,
  tabBarActiveTintColor: PRIMARY_COLOR_DARK,
};

export default function ClientLayout() {
  const { totalProducts } = useCartStore();

  return (
    <Tabs screenOptions={screenOptions}>
      {CLIENT_TABS.map(({ name, title, icon }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarBadge: name === 'cart' && totalProducts ? totalProducts : undefined,
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons
                size={26}
                name={icon as keyof typeof MaterialCommunityIcons.glyphMap}
                color={color}
                style={[
                  tabsGlobalStyles.tabBarIcon,
                  { backgroundColor: focused ? PRIMARY_COLOR_LIGHT : '' },
                ]}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
