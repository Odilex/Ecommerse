import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Auth: undefined;
  Main: NavigatorScreenParams<MainTabParamList>;
  ProductDetails: { productId: string };
  StoreDetails: { storeId: string };
  Cart: undefined;
  Checkout: undefined;
  OrderConfirmation: { orderId: string };
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Orders: undefined;
  Profile: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type HomeStackParamList = {
  Feed: undefined;
  Categories: undefined;
  CategoryProducts: { categoryId: string };
  NearbyStores: undefined;
};

export type SearchStackParamList = {
  SearchMain: undefined;
  SearchResults: { query: string };
  FilteredResults: { filters: Record<string, any> };
};

export type OrdersStackParamList = {
  OrdersList: undefined;
  OrderDetails: { orderId: string };
  TrackOrder: { orderId: string };
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  EditProfile: undefined;
  Addresses: undefined;
  PaymentMethods: undefined;
  Settings: undefined;
  Language: undefined;
  HelpSupport: undefined;
}; 