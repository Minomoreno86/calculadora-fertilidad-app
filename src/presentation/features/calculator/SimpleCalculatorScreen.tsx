/**
 * Versión simple y segura de calculadora con validación clínica
 * Esta versión evita errores de render y es más estable
 */

import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Button } from '@/presentation/components/common/EnhancedButton';
import { InfoCard } from '@/presentation/components/common/InfoCard';
import { theme } from '@/config/theme';

// Importar hook original sin modificar
import { useCalculatorFormOptimized as useCalculatorForm } from './useCalculatorFormOptimized';

// Componentes originales
import { DemographicsForm } from './components/DemographicsForm';
import { GynecologyHistoryForm } from './components/GynecologyHistoryForm';
import { LabTestsForm } from './components/LabTestsForm';
import { MaleFactorForm } from './components/MaleFactorForm';

export const SimpleEnhancedCalculatorScreen = () => {
  // Usar tu hook existente con todas las funcionalidades
  const {
    control,
    calculatedBmi,
    calculatedHoma,
    handleCalculate,
    formState: { errors },
    isLoading,
    formProgress,
    canCalculate
  } = useCalculatorForm();

  const handleCalculateWithFeedback = () => {
    try {
      // Direct call to handleCalculate since it likely returns a Promise
      handleCalculate()
        .then((data) => {
          // Handle successful submission
          console.log('Calculation successful', data);
        })
        .catch((error) => {
          // Handle validation errors
          console.error('Validation errors:', error);
        });
    } catch (error) {
      console.error('Error during calculation:', error);
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        {/* Tu contenido de header aquí */}
      </View>

      {/* Tu contenido de progreso aquí */}

      <InfoCard
        type="tip"
        title="Consejo"
        message="Completa todos los campos disponibles para obtener un análisis más preciso de tu perfil de fertilidad."
      />

      <View style={styles.formContainer}>
        <DemographicsForm
          control={control}
          calculatedBmi={calculatedBmi}
          errors={errors}
        />
        
        <GynecologyHistoryForm control={control} errors={errors} />
        
        <LabTestsForm 
          control={control} 
          calculatedHoma={calculatedHoma} 
          errors={errors} 
        />
        
        <MaleFactorForm control={control} errors={errors} />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Generar Informe de Fertilidad"
          onPress={handleCalculateWithFeedback}
          variant="primary"
          size="large"
          fullWidth
          loading={isLoading}
          disabled={isLoading || !canCalculate}
          iconName="document-text-outline"
        />
      </View>

      {!canCalculate && (
        <InfoCard
          type="warning"
          message={`Completa al menos el 60% del formulario para generar el informe. Progreso actual: ${formProgress}%`}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 20,
    backgroundColor: theme.colors.card,
    marginBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  formContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: theme.colors.card,
    borderRadius: 16,
  },
  buttonContainer: {
    marginHorizontal: 20,
    marginBottom: 32,
  },
});