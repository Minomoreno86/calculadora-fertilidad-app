/**
 * 🎨 THEMED SCREEN WRAPPER
 * 
 * Componente wrapper que aplica automáticamente el tema dinámico
 * a cualquier pantalla sin necesidad de modificar cada una individualmente
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useDynamicTheme } from '@/hooks/useDynamicTheme';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemedScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
  backgroundColor?: 'background' | 'surface';
  gradient?: boolean;
}

export const ThemedScreen: React.FC<ThemedScreenProps> = ({
  children,
  style,
  backgroundColor = 'background',
  gradient = false,
}) => {
  const { isDark } = useTheme();
  const theme = useDynamicTheme();

  const containerStyle = [
    styles.container,
    {
      backgroundColor: theme.colors[backgroundColor],
    },
    style,
  ];

  return (
    <View style={containerStyle}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ThemedScreen;