import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import theme from '../../theme';

interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  fullWidth?: boolean;
  textStyle?: TextStyle;
  containerStyle?: ViewStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  fullWidth = false,
  disabled = false,
  textStyle,
  containerStyle,
  leftIcon,
  rightIcon,
  ...props
}) => {
  const getVariantStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: theme.colors[variant]?.default || theme.colors.primary.default,
      borderWidth: 0,
    };

    if (variant === 'outline') {
      return {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.primary.default,
      };
    }

    if (variant === 'ghost') {
      return {
        backgroundColor: 'transparent',
        borderWidth: 0,
      };
    }

    return baseStyle;
  };

  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: theme.spacing.xs,
          paddingHorizontal: theme.spacing.md,
          minHeight: 32,
        };
      case 'large':
        return {
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.xl,
          minHeight: 56,
        };
      default:
        return {
          paddingVertical: theme.spacing.sm,
          paddingHorizontal: theme.spacing.lg,
          minHeight: 44,
        };
    }
  };

  const getTextColor = (): string => {
    if (disabled) return theme.colors.text.disabled;
    if (variant === 'outline' || variant === 'ghost') {
      return theme.colors.primary.default;
    }
    return theme.colors.text.light;
  };

  const getFontSize = (): number => {
    switch (size) {
      case 'small':
        return 14;
      case 'large':
        return 18;
      default:
        return 16;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getVariantStyles(),
        getSizeStyles(),
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        theme.shadows.sm,
        containerStyle,
      ]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <React.Fragment>
          {leftIcon && <React.Fragment>{leftIcon}</React.Fragment>}
          <Text
            style={[
              styles.text,
              theme.typography.button,
              {
                color: getTextColor(),
                fontSize: getFontSize(),
                marginLeft: leftIcon ? theme.spacing.sm : 0,
                marginRight: rightIcon ? theme.spacing.sm : 0,
              },
              textStyle,
            ]}
          >
            {children}
          </Text>
          {rightIcon && <React.Fragment>{rightIcon}</React.Fragment>}
        </React.Fragment>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.md,
  },
  text: {
    textAlign: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.6,
  },
});

export default Button; 