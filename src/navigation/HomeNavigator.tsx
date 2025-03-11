import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../types/navigation';
import HomeScreen from '../screens/home/HomeScreen';
import theme from '../theme';

// Import screens (to be created later)
import FeedScreen from '../screens/home/FeedScreen';
import CategoriesScreen from '../screens/home/CategoriesScreen';
import CategoryProductsScreen from '../screens/home/CategoryProductsScreen';
import NearbyStoresScreen from '../screens/home/NearbyStoresScreen';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background.light,
        },
        headerShadowVisible: false,
        headerTitleStyle: theme.typography.h3,
        headerTintColor: theme.colors.text.primary,
      }}
    >
      <Stack.Screen
        name="Feed"
        component={HomeScreen}
        options={{
          title: 'HahaOnline',
          headerLargeTitle: true,
        }}
      />
      <Stack.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{ title: 'Categories' }}
      />
      <Stack.Screen
        name="CategoryProducts"
        component={CategoryProductsScreen}
        options={({ route }) => ({
          title: route.params?.categoryId || 'Products',
        })}
      />
      <Stack.Screen
        name="NearbyStores"
        component={NearbyStoresScreen}
        options={{ title: 'Nearby Stores' }}
      />
    </Stack.Navigator>
  );
} 