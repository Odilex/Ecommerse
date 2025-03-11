import React from 'react';
import { Text as RNText, TextStyle, TextProps as RNTextProps } from 'react-native';
import theme from '../../theme';

interface TextProps extends RNTextProps {
  variant?: keyof typeof theme.typography;
  color?: string;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  style?: TextStyle;
}

const Text: React.FC<TextProps> = ({
  children,
  variant = 'body1',
  color = theme.colors.text.primary,
  align = 'left',
  style,
  ...props
}) => {
  return (
    <RNText
      style={[
        theme.typography[variant],
        {
          color,
          textAlign: align,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};

export default Text; 