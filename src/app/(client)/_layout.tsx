import { GRAY_COLOR_DARK, PRIMARY_COLOR_DARK, PRIMARY_COLOR_LIGHT } from '@/constants/Colors';
import { CLIENT_TABS } from '@/constants/Tabs';
import { tabsGlobalStyles } from '@/globalStyles';
import { useCartStore } from '@/store/useCartStore';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';

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
      {CLIENT_TABS.map(({ name, title, icon }) => {
        if (name === 'personalization') {
          return (
            <Tabs.Screen
              key={name}
              name={name}
              options={{
                title,
                tabBarIcon: ({ focused }) => (
                  <LinearGradient
                    colors={[PRIMARY_COLOR_LIGHT, PRIMARY_COLOR_DARK]}
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
        );
      })}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    height: 60,
    width: 60,
    bottom: 10,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'white',
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 99,
    margin: 4,
  },
});
