const colors = {
  // Primary brand colors
  primary: '#7C3AED', // Modern purple
  primaryLight: '#9F67FF',
  primaryDark: '#5B21B6',
  
  // Secondary colors
  secondary: '#10B981', // Modern teal
  secondaryLight: '#34D399',
  secondaryDark: '#059669',
  
  // Accent colors
  accent: '#F59E0B', // Modern amber
  accentLight: '#FBBF24',
  accentDark: '#D97706',
  
  // Semantic colors
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  
  // Background colors
  background: '#F9FAFB',
  surface: '#FFFFFF',
  surfaceVariant: '#F3F4F6',
  
  // Text colors
  text: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  
  // Border colors
  border: '#E5E7EB',
  borderFocus: '#7C3AED',
  
  // Status colors
  online: '#10B981',
  offline: '#6B7280',
  busy: '#EF4444',
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

const typography = {
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
  },
  h2: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
  },
  h3: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
  },
  h4: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
  },
  body1: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  body2: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
  },
  button: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
};

const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
};

const theme = {
  colors,
  spacing,
  borderRadius,
  typography,
  shadows,
};

export default theme; 