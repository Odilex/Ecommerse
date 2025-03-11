import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Text from './Text';
import theme from '../theme';

type BadgeVariant = 'default' | 'success' | 'error' | 'warning' | 'info';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: ViewStyle;
  dot?: boolean;
}

const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  size = 'md',
  style,
  dot = false,
}) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'success':
        return `${theme.colors.success}15`;
      case 'error':
        return `${theme.colors.error}15`;
      case 'warning':
        return `${theme.colors.warning}15`;
      case 'info':
        return `${theme.colors.info}15`;
      default:
        return `${theme.colors.textSecondary}15`;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'success':
        return theme.colors.success;
      case 'error':
        return theme.colors.error;
      case 'warning':
        return theme.colors.warning;
      case 'info':
        return theme.colors.info;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getDotColor = () => {
    switch (variant) {
      case 'success':
        return theme.colors.success;
      case 'error':
        return theme.colors.error;
      case 'warning':
        return theme.colors.warning;
      case 'info':
        return theme.colors.info;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'sm':
        return 10;
      case 'lg':
        return 14;
      default:
        return 12;
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'sm':
        return theme.spacing.xs;
      case 'lg':
        return theme.spacing.md;
      default:
        return theme.spacing.sm;
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          paddingVertical: getPadding() / 2,
          paddingHorizontal: getPadding(),
        },
        style,
      ]}
    >
      {dot && (
        <View
          style={[
            styles.dot,
            {
              backgroundColor: getDotColor(),
              width: size === 'sm' ? 4 : size === 'lg' ? 8 : 6,
              height: size === 'sm' ? 4 : size === 'lg' ? 8 : 6,
            },
          ]}
        />
      )}
      <Text
        style={[
          styles.text,
          {
            color: getTextColor(),
            fontSize: getFontSize(),
            marginLeft: dot ? theme.spacing.xs : 0,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: theme.borderRadius.full,
  },
  text: {
    fontWeight: '600',
  },
  dot: {
    borderRadius: theme.borderRadius.full,
  },
});

export default Badge; 