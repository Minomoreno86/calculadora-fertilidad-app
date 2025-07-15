import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Control, FieldErrors } from 'react-hook-form';
import { FormState } from '../types/calculator.types';
import { theme } from '../../../../config/theme';
import { EnhancedTextInput } from './EnhancedTextInput';
import { Text } from '../../../components/common/Text';

interface Props {
  control: Control<FormState>;
  errors: FieldErrors<FormState>;
}

export const DemographicsFormFixed: React.FC<Props> = ({ control, errors }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Datos Demográficos</Text>
      
      <EnhancedTextInput
        name="age"
        control={control}
        label="Edad (años)"
        placeholder="Ej: 32"
        keyboardType="numeric"
        error={errors.age?.message}
        style={styles.input}
      />
      
      <EnhancedTextInput
        name="height"
        control={control}
        label="Altura (cm)"
        placeholder="Ej: 165"
        keyboardType="numeric"
        error={errors.height?.message}
        style={styles.input}
      />
      
      <EnhancedTextInput
        name="weight"
        control={control}
        label="Peso (kg)"
        placeholder="Ej: 60"
        keyboardType="numeric"
        error={errors.weight?.message}
        style={styles.input}
      />
      
      <EnhancedTextInput
        name="infertilityDuration"
        control={control}
        label="Duración de infertilidad (meses)"
        placeholder="Ej: 12"
        keyboardType="numeric"
        error={errors.infertilityDuration?.message}
        style={styles.input}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.m,
  },
  sectionTitle: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.m,
    color: theme.colors.primary,
  },
  input: {
    marginBottom: theme.spacing.s,
  },
});
