import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useDynamicTheme } from '@/hooks/useDynamicTheme';
import Text from './Text';

interface CalculatedValueProps {
  label: string;
  value: number | null;
  unit?: string;
  interpretation?: {
    text: string;
    type: 'normal' | 'warning' | 'danger';
    clinicalNote?: string;
  };
}

// 🎨 Función para crear estilos dinámicos
const createStyles = (theme: ReturnType<typeof useDynamicTheme>) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: theme.spacing.m,
    marginVertical: theme.spacing.s,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.isDark ? theme.colors.black : '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: theme.isDark ? 0.3 : 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    flex: 1,
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: '500' as const,
  },
  valueContainer: {
    paddingHorizontal: theme.spacing.s,
    paddingVertical: theme.spacing.xs,
    borderRadius: 8,
    borderWidth: 1.5,
    backgroundColor: theme.colors.background,
  },
  value: {
    fontWeight: '700' as const,
    textAlign: 'center' as const,
    color: theme.colors.text,
    fontSize: 20,
  },
  unit: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  interpretation: {
    marginTop: theme.spacing.s,
    fontStyle: 'italic' as const,
    color: theme.colors.textSecondary,
    lineHeight: 16,
  },
});

export const CalculatedValue = ({ 
  label, 
  value, 
  unit = '', 
  interpretation,
}: CalculatedValueProps) => {
  // 🎨 TEMA DINÁMICO
  const theme = useDynamicTheme();
  
  // 🎨 Crear estilos dinámicos basados en el tema actual
  const styles = createStyles(theme);

  if (value === null || value === undefined) {
    return null;
  }

  const getColorByType = () => {
    if (!interpretation) return theme.colors.success;
    
    switch (interpretation.type) {
      case 'warning':
        return theme.colors.warning;
      case 'danger':
        return theme.colors.error;
      default:
        return theme.colors.success;
    }
  };

  const formatValue = (val: number) => {
    return val.toFixed(1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>
          {label}
        </Text>
        <View style={[styles.valueContainer, { borderColor: getColorByType() }]}>
          <Text style={[styles.value, { color: getColorByType() }]}>
            {formatValue(value)}
            {Boolean(unit) && <Text style={styles.unit}> {unit}</Text>}
          </Text>
        </View>
      </View>
      {interpretation && (
        <Text style={styles.interpretation}>
          {interpretation.text}
        </Text>
      )}
    </View>
  );
};
