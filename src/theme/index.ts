import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const colors = {
  primary: {
    default: '#FF4B2B',
    dark: '#E63E1C',
    light: '#FF6B4A',
    background: 'rgba(255, 75, 43, 0.1)',
  },
  secondary: {
    default: '#2B7FFF',
    dark: '#1C63E6',
    light: '#4A8FFF',
    background: 'rgba(43, 127, 255, 0.1)',
  },
  success: {
    default: '#28A745',
    dark: '#1E7E34',
    light: '#48C767',
    background: 'rgba(40, 167, 69, 0.1)',
  },
  warning: {
    default: '#FFC107',
    dark: '#D39E00',
    light: '#FFCD39',
    background: 'rgba(255, 193, 7, 0.1)',
  },
  error: {
    default: '#DC3545',
    dark: '#BD2130',
    light: '#E4606D',
    background: 'rgba(220, 53, 69, 0.1)',
  },
  info: {
    default: '#17A2B8',
    dark: '#138496',
    light: '#3EB8C9',
    background: 'rgba(23, 162, 184, 0.1)',
  },
  grey: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  text: {
    primary: '#1A1A1A',
    secondary: '#4A4A4A',
    tertiary: '#717171',
    light: '#FFFFFF',
    disabled: '#9E9E9E',
  },
  background: {
    light: '#FFFFFF',
    dark: '#121212',
    grey: '#F8F9FA',
  },
  border: {
    light: '#E0E0E0',
    dark: '#424242',
  },
};

export const typography = StyleSheet.create({
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 40,
    letterSpacing: 0.25,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 32,
    letterSpacing: 0,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    letterSpacing: 0.15,
  },
  subtitle1: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  subtitle2: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  body1: {
    fontSize: 16,
    fontWeight: 'normal',
    lineHeight: 24,
    letterSpacing: 0.5,
  },
  body2: {
    fontSize: 14,
    fontWeight: 'normal',
    lineHeight: 20,
    letterSpacing: 0.25,
  },
  button: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    letterSpacing: 1.25,
    textTransform: 'uppercase',
  },
  caption: {
    fontSize: 12,
    fontWeight: 'normal',
    lineHeight: 16,
    letterSpacing: 0.4,
  },
  overline: {
    fontSize: 10,
    fontWeight: 'normal',
    lineHeight: 16,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const layout = {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
};

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const shadows = StyleSheet.create({
  sm: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 6,
  },
});

export default {
  colors,
  typography,
  spacing,
  layout,
  borderRadius,
  shadows,
}; 