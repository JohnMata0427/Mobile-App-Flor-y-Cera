import {
  GRAY_COLOR_DARK,
  PRIMARY_COLOR_DARK,
  PRIMARY_COLOR_EXTRA_LIGHT,
  PRIMARY_COLOR_LIGHT,
} from '@/constants/Colors';
import type { Tab } from '@/constants/Tabs';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';

interface TabLayoutProps {
  tabs: Tab[];
  totalProducts?: number;
}

export const TabLayout = ({ tabs, totalProducts }: TabLayoutProps) => (
  <Tabs screenOptions={screenOptions}>
    {tabs.map(({ name, title, icon }) => {
      if (name === 'dashboard' || name === '(personalization)') {
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
                  end={{ x: 1.2, y: 1.2 }}
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
                      name={icon}
                      color={focused ? 'white' : GRAY_COLOR_DARK}
                      style={styles.tabBarIcon}
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
            tabBarBadge:
              name === '(cart)' && totalProducts && totalProducts > 0 ? totalProducts : undefined,
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons
                size={26}
                name={icon}
                color={color}
                style={[styles.tabBarIcon, focused && styles.tabBarIconActive]}
              />
            ),
          }}
        />
      );
    })}
  </Tabs>
);

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
  tabBarIconActive: {
    backgroundColor: PRIMARY_COLOR_LIGHT,
  },
  viewContent: {
    flex: 1,
  },
  tabBarStyle: {
    paddingHorizontal: 4,
    paddingTop: 5,
    height: 105,
  },
  tabBarLabelStyle: {
    fontWeight: 'bold',
    marginTop: 4,
  },
  tabBarBadgeStyle: {
    backgroundColor: PRIMARY_COLOR_DARK,
    fontWeight: 'bold',
    fontSize: 10,
    paddingTop: 2,
  },
  tabBarIcon: {
    width: 55,
    height: 30,
    borderRadius: 10,
    textAlignVertical: 'center',
    textAlign: 'center',
  },
});

const screenOptions: BottomTabNavigationOptions = {
  headerShown: false,
  tabBarStyle: styles.tabBarStyle,
  tabBarLabelStyle: styles.tabBarLabelStyle,
  tabBarBadgeStyle: styles.tabBarBadgeStyle,
  tabBarInactiveTintColor: GRAY_COLOR_DARK,
  tabBarActiveTintColor: PRIMARY_COLOR_DARK,
  sceneStyle: {
    backgroundColor: PRIMARY_COLOR_EXTRA_LIGHT,
  },
};
