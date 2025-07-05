// src/presentation/components/common/Text.tsx
import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { theme } from '@/config/theme';

type TextVariant = keyof typeof theme.typography;

interface CustomTextProps extends TextProps {
  variant?: TextVariant;
}

const Text = ({ variant = 'body', style, ...props }: CustomTextProps) => {
  const textStyle = theme.typography[variant];
  return <RNText style={[styles.default, textStyle, style]} {...props} />;
};

const styles = StyleSheet.create({
  default: {
    color: theme.colors.text,
  },
});

export default Text;