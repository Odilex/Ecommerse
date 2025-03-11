import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  StyleProp,
} from 'react-native';
import theme from '../theme';

interface CardProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'outlined' | 'filled';
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'elevated',
  onPress,
  style,
  contentStyle,
}) => {
  const cardStyle = [
    styles.card,
    variant === 'elevated' && styles.elevated,
    variant === 'outlined' && styles.outlined,
    variant === 'filled' && styles.filled,
    style,
  ];

  const content = (
    <View style={[styles.content, contentStyle]}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={0.8}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyle}>
      {content}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface,
    overflow: 'hidden',
  },
  content: {
    padding: theme.spacing.md,
  },
  elevated: {
    ...theme.shadows.md,
  },
  outlined: {
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filled: {
    backgroundColor: theme.colors.surfaceVariant,
  },
});

export default Card; 