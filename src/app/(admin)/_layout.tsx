import { PRIMARY_COLOR } from '@/constants/Colors';
import { BOLD_BODY_FONT } from '@/constants/Fonts';
import { ADMIN_TABS } from '@/constants/Tabs';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AdminLayout() {
  const { top } = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, paddingTop: top + 10 }}>
      <Tabs screenOptions={{ headerShown: false, animation: 'shift' }}>
        {ADMIN_TABS.map(({ name, title, icon, tabBarBadge }) => (
          <Tabs.Screen
            key={name}
            name={name}
            options={{
              title,
              tabBarBadge,
              tabBarBadgeStyle: {
                backgroundColor: PRIMARY_COLOR,
                fontFamily: BOLD_BODY_FONT,
                fontSize: 12,
                padding: 2,
              },
              tabBarStyle: {
                height: 60,
              },
              tabBarLabelStyle: {
                fontFamily: BOLD_BODY_FONT,
              },
              tabBarInactiveTintColor: 'gray',
              tabBarActiveTintColor: 'black',
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons
                  size={26}
                  name={icon as keyof typeof MaterialCommunityIcons.glyphMap}
                  color={color}
                />
              ),
            }}
          />
        ))}
      </Tabs>
    </View>
  );
}
