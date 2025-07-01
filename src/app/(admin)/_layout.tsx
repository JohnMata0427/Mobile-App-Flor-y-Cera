import { GRAY_COLOR_DARK, PRIMARY_COLOR, PRIMARY_COLOR_DARK, PRIMARY_COLOR_LIGHT, SECONDARY_COLOR, SECONDARY_COLOR_DARK, TERTIARY_COLOR } from '@/constants/Colors';
import { ADMIN_TABS } from '@/constants/Tabs';
import { tabsGlobalStyles } from '@/globalStyles';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const screenOptions: BottomTabNavigationOptions = {
  headerShown: false,
  animation: 'shift',
  tabBarStyle: tabsGlobalStyles.tabBarStyle,
  tabBarLabelStyle: tabsGlobalStyles.tabBarLabelStyle,
  tabBarBadgeStyle: tabsGlobalStyles.tabBarBadgeStyle,
  tabBarInactiveTintColor: GRAY_COLOR_DARK,
  tabBarActiveTintColor: PRIMARY_COLOR_DARK,
};

export default function AdminLayout() {
  const { top } = useSafeAreaInsets();

  return (
    <View style={[tabsGlobalStyles.viewContent, { paddingTop: top + 5, paddingBottom: 5 }]}>
      <Tabs screenOptions={screenOptions}>
        {ADMIN_TABS.map(({ name, title, icon }) => {
          if (name === 'dashboard') {
            return (
              <Tabs.Screen
                key={name}
                name={name}
                options={{
                  title,
                  tabBarIcon: ({ focused }) => (
                    <LinearGradient
                      colors={[PRIMARY_COLOR_DARK, PRIMARY_COLOR]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.gradientContainer}
                    >
                      <View
                        style={[
                          styles.iconContainer,
                          { backgroundColor: focused ? 'transparent' : 'white' },
                        ]}
                      >
                        <MaterialCommunityIcons
                          size={26}
                          name={icon as keyof typeof MaterialCommunityIcons.glyphMap}
                          color={focused ? 'white' : GRAY_COLOR_DARK}
                          style={tabsGlobalStyles.tabBarIcon}
                        />
                      </View>
                    </LinearGradient>
                  ),
                }}
              />
            );
          }

          return (
            <Tabs.Screen
              key={name}
              name={name}
              options={{
                title,
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
          );
        })}
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    height: 50,
    width: 60,
    bottom: 7,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: 'white',
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    margin: 4,
  },
});
