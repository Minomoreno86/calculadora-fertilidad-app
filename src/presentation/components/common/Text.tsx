import { Text as RNText, TextProps } from 'react-native';
import { useDynamicTheme } from '@/hooks/useDynamicTheme';

type TextVariant = 'h1' | 'h2' | 'h3' | 'body' | 'bodyLarge' | 'caption' | 'label' | 'small' | 'bodyBold';

interface CustomTextProps extends TextProps {
  variant?: TextVariant;
}

const Text = ({ variant = 'body', style, ...props }: CustomTextProps) => {
  // 🎨 TEMA DINÁMICO
  const theme = useDynamicTheme();
  
  const textStyle = theme.typography[variant];
  const defaultColor = { color: theme.colors.text };
  
  return <RNText style={[defaultColor, textStyle, style]} {...props} />;
};

export default Text;
