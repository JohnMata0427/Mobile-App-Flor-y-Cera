import { PRIMARY_COLOR, SECONDARY_COLOR } from '@/constants/Colors';
import { BODY_FONT } from '@/constants/Fonts';
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
              tabBarLabelStyle: {
                fontFamily: BODY_FONT,
              },
              tabBarBadge,
              tabBarBadgeStyle: {
                backgroundColor: SECONDARY_COLOR,
                fontFamily: BODY_FONT,
                fontSize: 12,
                padding: 2,
              },
              tabBarActiveTintColor: PRIMARY_COLOR,
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons
                  size={24}
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
