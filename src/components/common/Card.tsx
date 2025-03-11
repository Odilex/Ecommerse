import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import theme from '../../theme';

interface CardProps extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'outlined' | 'flat';
  containerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
  onPress?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'elevated',
  containerStyle,
  contentStyle,
  onPress,
  ...props
}) => {
  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'outlined':
        return {
          borderWidth: 1,
          borderColor: theme.colors.border.light,
        };
      case 'flat':
        return {
          backgroundColor: theme.colors.background.grey,
        };
      default:
        return {
          backgroundColor: theme.colors.background.light,
          ...theme.shadows.md,
        };
    }
  };

  const CardContainer = onPress ? TouchableOpacity : View;

  return (
    <CardContainer
      style={[styles.container, getVariantStyle(), containerStyle]}
      onPress={onPress}
      {...props}
    >
      <View style={[styles.content, contentStyle]}>{children}</View>
    </CardContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  content: {
    padding: theme.spacing.md,
  },
});

export default Card; 