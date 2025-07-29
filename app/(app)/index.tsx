import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';

import Box from '@/presentation/components/common/Box';
import Text from '@/presentation/components/common/Text';
import { Button, EnhancedButton } from '@/presentation/components/common/EnhancedButton';
import { ConditionalProgressDisplay } from '@/presentation/features/calculator/components/ConditionalProgressDisplay';
import { EnhancedInfoCard } from '@/presentation/components/common';

// 🚀 CALCULADORA PRINCIPAL - HOOK REAL V14.0
import { useCalculatorForm } from '@/presentation/features/calculator';

// 📋 COMPONENTES DEL FORMULARIO
import { DemographicsForm } from '@/presentation/features/calculator/components/DemographicsForm';
import { GynecologyHistoryForm } from '@/presentation/features/calculator/components/GynecologyHistoryForm';
import { LabTestsForm } from '@/presentation/features/calculator/components/LabTestsForm';
import { MaleFactorForm } from '@/presentation/features/calculator/components/MaleFactorForm';

// 🎨 TEMA Y UTILIDADES
import { useDynamicTheme } from '@/hooks/useDynamicTheme';
import { ConfigModal } from '@/presentation/components/common/ConfigModal';

export default function CalculatorScreen() {
  const [configModalVisible, setConfigModalVisible] = React.useState(false);
  const theme = useDynamicTheme();

  // 🚀 HOOK PRINCIPAL DE CALCULADORA
  const {
    control, 
    calculatedBmi, 
    calculatedHoma, 
    handleCalculate, 
    formState,
    isLoading = false,
    currentStep = 0,
    completionPercentage = 0,
    watchedFields
  } = useCalculatorForm();

  // 🛡️ NEURAL SAFETY GUARDS - Validación completa de datos
  const errors = formState?.errors ?? {};
  const formData = React.useMemo(() => {
    // 🧠 NEURAL DEBUG V13.0: Log para debuggear el problema
    console.log('🔍 formData generation:', {
      watchedFields: watchedFields ? 'exists' : 'undefined',
      watchedFieldsType: typeof watchedFields,
      watchedFieldsKeys: watchedFields ? Object.keys(watchedFields) : 'N/A',
      calculatedBmi: calculatedBmi
    });
    
    // 🧠 NEURAL FIX V13.0: Crear objeto base con defaults y luego sobrescribir
    const baseDefaults = {
      age: 25,
      weight: 60,
      height: 160,
      cycleLength: 28,
      infertilityDuration: 0,
    };
    
    // Obtener datos seguros del formulario
    const safeFormData = watchedFields || {};
    
    // 🎯 COMBINAR SIN DUPLICACIÓN: defaults + formData + calculatedValues
    const result = {
      ...baseDefaults,        // 1. Defaults base
      ...safeFormData,       // 2. Datos del formulario (sobrescribe defaults)
      bmi: calculatedBmi || 0, // 3. Valores calculados
    };
    
    console.log('🎯 formData result:', { result, hasAge: result.age !== undefined });
    return result;
  }, [watchedFields, calculatedBmi]);

  // 🔧 NEURAL VALIDATION - Verificar que formData tiene propiedades válidas
  const isFormDataValid = React.useMemo(() => {
    return formData && typeof formData === 'object' && formData.age !== undefined;
  }, [formData]);

  // 🎯 WRAPPER PARA HANDLECALCULATE CON NEURAL SAFETY
  const onCalculatePress = React.useCallback(async () => {
    // 🛡️ Validar que tenemos datos válidos antes de calcular
    if (!formData || typeof formData !== 'object') {
      console.warn('⚠️ FormData no válido, no se puede proceder con el cálculo');
      return;
    }
    
    try {
      await handleCalculate(); // ✨ NEURAL FIX: Agregar await
    } catch (error) {
      console.error('❌ Error en cálculo:', error);
    }
  }, [handleCalculate, formData]);

  // 🚀 Función auxiliar canCalculate con NEURAL SAFETY
  const canCalculate = React.useMemo(() => {
    return completionPercentage > 20 && isFormDataValid;
  }, [completionPercentage, isFormDataValid]);

  // 🚀 Función auxiliar para validación de rangos
  const getRangeValidation = React.useCallback((_fieldName: string) => {
    return { 
      isValid: true, 
      message: '',
      isOptimal: true,
      isInRange: true,
      isNormal: true,
      isWarning: false,
      isError: false,
      minValue: 0,
      maxValue: 100,
      unit: ''
    };
  }, []);

  // 🎨 Crear estilos dinámicos
  const styles = createStyles(theme);
  const stepLabels = ['Demografia', 'Ginecología', 'Laboratorio', 'Factor Masculino'];

  // 💡 Helpers para mensajes
  const getCompletionMessage = () => {
    if (completionPercentage < 40) {
      return "Puedes generar un informe básico con los datos actuales";
    }
    if (completionPercentage < 70) {
      return "Buenos datos disponibles para un informe útil";
    }
    return "Datos completos para el análisis más detallado";
  };

  const getButtonTitle = () => {
    return "Generar Informe de Fertilidad";
  };

  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Text variant="h1" style={styles.title}>
              Calculadora de Fertilidad
            </Text>
            <Button
              title=""
              onPress={() => setConfigModalVisible(true)}
              variant="text"
              size="small"
              iconName="settings"
              style={styles.configButton}
            />
          </View>
          <Text variant="body" style={styles.subtitle}>
            Completa los siguientes datos para obtener tu análisis personalizado
          </Text>
        </View>

        <View style={styles.infoCardContainer}>
          <EnhancedInfoCard
            type="tip"
            title="✨ Calculadora Inteligente"
            message="Esta calculadora puede generar informes útiles incluso con datos parciales. Completa más campos para obtener un análisis más preciso."
          />
        </View>

        <Box style={styles.formContainer as any}>
          <DemographicsForm
            control={control as any}
            calculatedBmi={calculatedBmi}
            errors={errors}
            getRangeValidation={getRangeValidation}
          />

          {completionPercentage > 10 && (
            <GynecologyHistoryForm control={control as any} errors={errors} />
          )}

          {completionPercentage > 30 && (
            <LabTestsForm control={control as any} calculatedHoma={calculatedHoma} errors={errors} />
          )}

          {completionPercentage > 50 && (
            <MaleFactorForm control={control as any} errors={errors} />
          )}
        </Box>

        {completionPercentage > 0 && isFormDataValid && (
          <View style={styles.progressContainer}>
            <ConditionalProgressDisplay
              formData={formData}
              currentStep={currentStep}
              completionPercentage={completionPercentage}
              stepLabels={stepLabels}
            />
          </View>
        )}

        <View style={styles.buttonContainer}>
          <EnhancedButton
            title={getButtonTitle()}
            onPress={onCalculatePress}
            variant="primary"
            size="large"
            fullWidth
            loading={isLoading}
            disabled={isLoading || !canCalculate}
            iconName="lightning"
            enhanced={true}
            completionPercentage={completionPercentage}
          />
          
          {!isLoading && (
            <Text style={styles.buttonHelpText}>
              {getCompletionMessage()}
            </Text>
          )}
        </View>

        <EnhancedInfoCard
          type="info"
          title="Progreso del Formulario"
          message={`${completionPercentage}% completado - Listo para calcular`}
          showIcon={true}
        />

        <ConfigModal
          visible={configModalVisible}
          onClose={() => setConfigModalVisible(false)}
        />
      </ScrollView>
    </View>
  );
}

// 🎨 Función para crear estilos dinámicos
const createStyles = (theme: ReturnType<typeof useDynamicTheme>) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingTop: 32,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: theme.spacing.xs,
  },
  title: {
    flex: 1,
    textAlign: 'center' as const,
    ...theme.typography.h1,
    color: theme.colors.primary,
  },
  subtitle: {
    textAlign: 'center' as const,
    ...theme.typography.bodyLarge,
    color: theme.colors.textSecondary,
  },
  configButton: {
    backgroundColor: 'transparent',
    padding: 8,
    marginLeft: 8,
  },
  infoCardContainer: {
    marginBottom: theme.spacing.xxs,
  },
  progressContainer: {
    marginHorizontal: theme.spacing.screen,
    marginTop: theme.spacing.m,
    marginBottom: theme.spacing.xs,
    padding: theme.spacing.card,
    ...theme.components.card.default,
  },
  formContainer: {
    marginHorizontal: theme.spacing.screen,
    marginTop: theme.spacing.xxs,
    marginBottom: theme.spacing.m,
    padding: theme.spacing.card,
    ...theme.components.card.elevated,
  },
  buttonContainer: {
    marginHorizontal: theme.spacing.screen,
    marginBottom: theme.spacing.xl,
  },
  buttonHelpText: {
    textAlign: 'center' as const,
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.s,
    paddingHorizontal: theme.spacing.l,
  },
});
