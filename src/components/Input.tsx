import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Text from './Text';
import theme from '../theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: keyof typeof MaterialIcons.glyphMap;
  rightIcon?: keyof typeof MaterialIcons.glyphMap;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  touched?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helper,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  inputStyle,
  labelStyle,
  touched,
  secureTextEntry,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const hasError = touched && error;
  const showHelper = !hasError && helper;

  const getBorderColor = () => {
    if (hasError) return theme.colors.error;
    if (isFocused) return theme.colors.primary;
    return theme.colors.border;
  };

  const renderIcon = (
    icon: keyof typeof MaterialIcons.glyphMap,
    position: 'left' | 'right',
    onPress?: () => void
  ) => {
    const iconColor = hasError
      ? theme.colors.error
      : isFocused
      ? theme.colors.primary
      : theme.colors.textSecondary;

    const content = (
      <MaterialIcons
        name={icon}
        size={20}
        color={iconColor}
        style={position === 'left' ? styles.leftIcon : styles.rightIcon}
      />
    );

    if (onPress) {
      return (
        <TouchableOpacity onPress={onPress}>
          {content}
        </TouchableOpacity>
      );
    }

    return content;
  };

  const passwordIcon = secureTextEntry
    ? isPasswordVisible
      ? 'visibility'
      : 'visibility-off'
    : undefined;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text
          style={[
            styles.label,
            hasError && styles.errorLabel,
            isFocused && styles.focusedLabel,
            labelStyle,
          ]}
        >
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: getBorderColor(),
          },
          isFocused && styles.focusedInput,
          hasError && styles.errorInput,
        ]}
      >
        {leftIcon && renderIcon(leftIcon, 'left')}
        <TextInput
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            (rightIcon || secureTextEntry) && styles.inputWithRightIcon,
            inputStyle,
          ]}
          placeholderTextColor={theme.colors.textTertiary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          {...props}
        />
        {secureTextEntry && passwordIcon && (
          renderIcon(
            passwordIcon,
            'right',
            () => setIsPasswordVisible(!isPasswordVisible)
          )
        )}
        {rightIcon && !secureTextEntry && (
          renderIcon(rightIcon, 'right', onRightIconPress)
        )}
      </View>
      {(hasError || showHelper) && (
        <Text
          style={[
            styles.helperText,
            hasError && styles.errorText,
          ]}
        >
          {hasError ? error : helper}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  focusedLabel: {
    color: theme.colors.primary,
  },
  errorLabel: {
    color: theme.colors.error,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    minHeight: 48,
  },
  input: {
    flex: 1,
    color: theme.colors.text,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    ...theme.typography.body1,
  },
  inputWithLeftIcon: {
    paddingLeft: theme.spacing.xs,
  },
  inputWithRightIcon: {
    paddingRight: theme.spacing.xs,
  },
  focusedInput: {
    borderWidth: 2,
  },
  errorInput: {
    borderColor: theme.colors.error,
    backgroundColor: `${theme.colors.error}08`,
  },
  leftIcon: {
    marginLeft: theme.spacing.md,
  },
  rightIcon: {
    marginRight: theme.spacing.md,
  },
  helperText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
  },
  errorText: {
    color: theme.colors.error,
  },
});

export default Input; 