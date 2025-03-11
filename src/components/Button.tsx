import React from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Text from './Text';
import theme from '../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: keyof typeof MaterialIcons.glyphMap;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const getBackgroundColor = () => {
    if (disabled) return theme.colors.textTertiary;
    switch (variant) {
      case 'primary':
        return theme.colors.primary;
      case 'secondary':
        return theme.colors.secondary;
      case 'outline':
      case 'ghost':
        return 'transparent';
      default:
        return theme.colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return theme.colors.surface;
    switch (variant) {
      case 'primary':
      case 'secondary':
        return theme.colors.surface;
      case 'outline':
      case 'ghost':
        return theme.colors.primary;
      default:
        return theme.colors.surface;
    }
  };

  const getBorderColor = () => {
    if (disabled) return theme.colors.textTertiary;
    switch (variant) {
      case 'outline':
        return theme.colors.primary;
      default:
        return 'transparent';
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'sm':
        return theme.spacing.sm;
      case 'lg':
        return theme.spacing.lg;
      default:
        return theme.spacing.md;
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 16;
      case 'lg':
        return 24;
      default:
        return 20;
    }
  };

  const buttonStyles = [
    styles.button,
    {
      backgroundColor: getBackgroundColor(),
      borderColor: getBorderColor(),
      padding: getPadding(),
      opacity: disabled ? 0.6 : 1,
    },
    fullWidth && styles.fullWidth,
    variant === 'ghost' && styles.ghost,
    style,
  ];

  const textStyles = [
    styles.text,
    {
      color: getTextColor(),
      fontSize: size === 'sm' ? 14 : size === 'lg' ? 18 : 16,
    },
    textStyle,
  ];

  const iconColor = getTextColor();
  const iconSize = getIconSize();

  const renderIcon = () => {
    if (!icon) return null;
    return (
      <MaterialIcons
        name={icon}
        size={iconSize}
        color={iconColor}
        style={[
          styles.icon,
          iconPosition === 'right' ? styles.iconRight : styles.iconLeft,
        ]}
      />
    );
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={buttonStyles}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <View style={styles.content}>
          {iconPosition === 'left' && renderIcon()}
          <Text style={textStyles}>{title}</Text>
          {iconPosition === 'right' && renderIcon()}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  fullWidth: {
    width: '100%',
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    shadowOpacity: 0,
    elevation: 0,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
  },
  icon: {
    marginHorizontal: theme.spacing.xs,
  },
  iconLeft: {
    marginRight: theme.spacing.xs,
  },
  iconRight: {
    marginLeft: theme.spacing.xs,
  },
});

export default Button; 