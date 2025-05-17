import {
  GRAY_COLOR_DARK,
  PRIMARY_COLOR,
  PRIMARY_COLOR_DARK,
  PRIMARY_COLOR_LIGHT,
} from '@/constants/Colors';
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
                paddingTop: 1,
              },
              tabBarStyle: {
                height: 70,
              },
              tabBarItemStyle: {
                marginTop: 7,
              },
              tabBarLabelStyle: {
                fontFamily: BOLD_BODY_FONT,
                marginTop: 3,
              },
              tabBarInactiveTintColor: GRAY_COLOR_DARK,
              tabBarActiveTintColor: PRIMARY_COLOR_DARK,
              tabBarIcon: ({ color, focused }) => (
                <MaterialCommunityIcons
                  size={26}
                  name={icon as keyof typeof MaterialCommunityIcons.glyphMap}
                  color={color}
                  style={{
                    backgroundColor: focused ? PRIMARY_COLOR_LIGHT : '',
                    width: 55,
                    height: 30,
                    borderRadius: 10,
                    textAlign: 'center',
                    lineHeight: 30,
                  }}
                />
              ),
            }}
          />
        ))}
      </Tabs>
    </View>
  );
}
