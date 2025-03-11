import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootStackParamList } from '../types/navigation';

// Import screens (to be created later)
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import StoreDetailsScreen from '../screens/StoreDetailsScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import OrderConfirmationScreen from '../screens/OrderConfirmationScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  // We'll implement this selector when we set up Redux
  const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainNavigator} />
            <Stack.Screen
              name="ProductDetails"
              component={ProductDetailsScreen}
              options={{ headerShown: true }}
            />
            <Stack.Screen
              name="StoreDetails"
              component={StoreDetailsScreen}
              options={{ headerShown: true }}
            />
            <Stack.Screen
              name="Cart"
              component={CartScreen}
              options={{ headerShown: true }}
            />
            <Stack.Screen
              name="Checkout"
              component={CheckoutScreen}
              options={{ headerShown: true }}
            />
            <Stack.Screen
              name="OrderConfirmation"
              component={OrderConfirmationScreen}
              options={{ headerShown: true }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
} 