import {
  GRAY_COLOR_DARK,
  PRIMARY_COLOR_DARK,
  PRIMARY_COLOR_LIGHT,
} from '@/constants/Colors';
import { CLIENT_TABS } from '@/constants/Tabs';
import { tabsGlobalStyles } from '@/globalStyles';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router';

export default function ClientLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: 'shift',
        tabBarStyle: tabsGlobalStyles.tabBarStyle,
        tabBarLabelStyle: tabsGlobalStyles.tabBarLabelStyle,
        tabBarBadgeStyle: tabsGlobalStyles.tabBarBadgeStyle,
        tabBarInactiveTintColor: GRAY_COLOR_DARK,
        tabBarActiveTintColor: PRIMARY_COLOR_DARK,
      }}
    >
      {CLIENT_TABS.map(({ name, title, icon, tabBarBadge }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarBadge,
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
