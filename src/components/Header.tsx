import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Text from './Text';
import theme from '../theme';

interface HeaderProps {
  title: string;
  subtitle?: string;
  leftIcon?: keyof typeof MaterialIcons.glyphMap;
  rightIcon?: keyof typeof MaterialIcons.glyphMap;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  transparent?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  transparent = false,
}) => {
  const insets = useSafeAreaInsets();

  const renderIcon = (
    icon: keyof typeof MaterialIcons.glyphMap,
    onPress?: () => void
  ) => (
    <TouchableOpacity
      style={styles.iconButton}
      onPress={onPress}
      disabled={!onPress}
    >
      <MaterialIcons
        name={icon}
        size={24}
        color={transparent ? theme.colors.surface : theme.colors.text}
      />
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          backgroundColor: transparent
            ? 'transparent'
            : theme.colors.surface,
        },
      ]}
    >
      <StatusBar
        barStyle={transparent ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <View style={styles.content}>
        <View style={styles.left}>
          {leftIcon && renderIcon(leftIcon, onLeftPress)}
        </View>
        <View style={styles.center}>
          <Text
            style={[
              styles.title,
              transparent && styles.lightText,
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={[
                styles.subtitle,
                transparent && styles.lightText,
              ]}
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          )}
        </View>
        <View style={styles.right}>
          {rightIcon && renderIcon(rightIcon, onRightPress)}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.text,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  content: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  left: {
    width: 48,
    alignItems: 'flex-start',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  right: {
    width: 48,
    alignItems: 'flex-end',
  },
  title: {
    ...theme.typography.h4,
    color: theme.colors.text,
  },
  subtitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  lightText: {
    color: theme.colors.surface,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Header; 