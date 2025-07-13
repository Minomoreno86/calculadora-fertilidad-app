import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '@/config/theme';
import Text from './Text';

interface CalculatedValueProps {
  label: string;
  value: number | null;
  unit?: string;
  interpretation?: string;
  type?: 'normal' | 'warning' | 'danger';
}

export const CalculatedValue = ({ 
  label, 
  value, 
  unit = '', 
  interpretation,
  type = 'normal' 
}: CalculatedValueProps) => {
  if (value === null || value === undefined) {
    return null;
  }

  const getColorByType = () => {
    switch (type) {
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
        <Text variant="label" style={styles.label}>
          {label}
        </Text>
        <View style={[styles.valueContainer, { borderColor: getColorByType() }]}>
          <Text variant="h3" style={[styles.value, { color: getColorByType() }]}>
            {formatValue(value)}
            {unit && <Text variant="body" style={styles.unit}> {unit}</Text>}
          </Text>
        </View>
      </View>
      {interpretation && (
        <Text variant="caption" style={styles.interpretation}>
          {interpretation}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFC',
    borderRadius: theme.borderRadius.s,
    padding: theme.spacing.m,
    marginVertical: theme.spacing.s,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    flex: 1,
    color: theme.colors.subtleText,
  },
  valueContainer: {
    paddingHorizontal: theme.spacing.s,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.s,
    borderWidth: 1.5,
    backgroundColor: theme.colors.white,
  },
  value: {
    fontWeight: '700',
    textAlign: 'center',
  },
  unit: {
    fontSize: 12,
    color: theme.colors.subtleText,
  },
  interpretation: {
    marginTop: theme.spacing.s,
    fontStyle: 'italic',
    color: theme.colors.subtleText,
    lineHeight: 16,
  },
});
