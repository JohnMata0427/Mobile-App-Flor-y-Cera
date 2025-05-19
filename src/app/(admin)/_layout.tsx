import {
  GRAY_COLOR_DARK,
  PRIMARY_COLOR_DARK,
  PRIMARY_COLOR_LIGHT,
} from '@/constants/Colors';
import { BOLD_BODY_FONT } from '@/constants/Fonts';
import { ADMIN_TABS } from '@/constants/Tabs';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AdminLayout() {
  const { top } = useSafeAreaInsets();

  return (
    <View style={[styles.viewContent, { paddingTop: top + 5 }]}>
      <Tabs screenOptions={{ headerShown: false, animation: 'shift' }}>
        {ADMIN_TABS.map(({ name, title, icon, tabBarBadge }) => (
          <Tabs.Screen
            key={name}
            name={name}
            options={{
              title,
              tabBarBadge,
              tabBarBadgeStyle: styles.tabBarBadgeStyle,
              tabBarStyle: styles.tabBarStyle,
              tabBarItemStyle: styles.tabBarItemStyle,
              tabBarLabelStyle: styles.tabBarLabelStyle,
              tabBarInactiveTintColor: GRAY_COLOR_DARK,
              tabBarActiveTintColor: PRIMARY_COLOR_DARK,
              tabBarIcon: ({ color, focused }) => (
                <MaterialCommunityIcons
                  size={26}
                  name={icon as keyof typeof MaterialCommunityIcons.glyphMap}
                  color={color}
                  style={[
                    styles.tabBarIcon,
                    { backgroundColor: focused ? PRIMARY_COLOR_LIGHT : '' },
                  ]}
                />
              ),
            }}
          />
        ))}
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  viewContent: {
    flexGrow: 1,
  },
  tabBarStyle: {
    height: 70,
    paddingHorizontal: 5,
  },
  tabBarItemStyle: {
    marginTop: 7,
  },
  tabBarLabelStyle: {
    fontFamily: BOLD_BODY_FONT,
    marginTop: 3,
  },
  tabBarBadgeStyle: {
    backgroundColor: PRIMARY_COLOR_DARK,
    fontFamily: BOLD_BODY_FONT,
    fontSize: 11,
    paddingTop: 1,
  },
  tabBarIcon: {
    width: 55,
    height: 30,
    borderRadius: 10,
    textAlign: 'center',
    lineHeight: 30,
  },
});
