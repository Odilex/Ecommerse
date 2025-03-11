import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';

// Import screens (to be created later)
import HomeNavigator from './HomeNavigator';
import SearchNavigator from './SearchNavigator';
import OrdersNavigator from './OrdersNavigator';
import ProfileNavigator from './ProfileNavigator';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Search':
              iconName = focused ? 'search' : 'search-outline';
              break;
            case 'Orders':
              iconName = focused ? 'list' : 'list-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'home-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary.default,
        tabBarInactiveTintColor: theme.colors.text.tertiary,
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#E5E5E5',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeNavigator}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name="Search"
        component={SearchNavigator}
        options={{ title: 'Search' }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersNavigator}
        options={{ title: 'Orders' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
} 