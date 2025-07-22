// 🎨 TEMA Y UTILIDADES
import { useDynamicTheme } from '@/hooks/useDynamicTheme';
import { ConfigModal } from '@/presentation/components/common/ConfigModal';
import { ConfigModalAdvanced } from '@/presentation/components/common/ConfigModalAdvanced';
import { QuickConfig } from '@/presentation/components/common/QuickConfig';
import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import Box from '@/presentation/components/common/Box';
import Text from '@/presentation/components/common/Text';
import { Button, EnhancedButton } from '@/presentation/components/common/EnhancedButton';
import { ConditionalProgressDisplay } from '@/presentation/features/calculator/components/ConditionalProgressDisplay';
import { EnhancedInfoCard } from '@/presentation/components/common';

// 🚀 CALCULADORA PRINCIPAL
import { useCalculatorFormOptimized as useCalculatorForm, FormState } from '@/presentation/features/calculator/useCalculatorFormOptimized';

// 📋 COMPONENTES DEL FORMULARIO
import { DemographicsForm } from '@/presentation/features/calculator/components/DemographicsForm';
import { GynecologyHistoryForm } from '@/presentation/features/calculator/components/GynecologyHistoryForm';
import { LabTestsForm } from '@/presentation/features/calculator/components/LabTestsForm';
import { MaleFactorForm } from '@/presentation/features/calculator/components/MaleFactorForm';

export default function CalculatorScreen() {
  const [configModalVisible, setConfigModalVisible] = useState(false);
  const [advancedConfigVisible, setAdvancedConfigVisible] = useState(false);
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

  // Valores por defecto para compatibilidad
  const errors = formState?.errors ?? {};
  const formData = React.useMemo(() => watchedFields || {}, [watchedFields]);

  // 🎯 WRAPPER PARA HANDLECALCULATE
  const onCalculatePress = React.useCallback(() => {
    const currentFormData = formData as FormState;
    handleCalculate(currentFormData);
  }, [formData, handleCalculate]);

  // 🚀 Función auxiliar canCalculate
  const canCalculate = React.useMemo(() => {
    return completionPercentage > 20;
  }, [completionPercentage]);

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
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
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
          
          {/* 🎯 BOTÓN DE CONFIGURACIÓN AVANZADA */}
          <TouchableOpacity 
            style={styles.advancedConfigButton} 
            onPress={() => setAdvancedConfigVisible(true)}
          >
            <Text style={styles.advancedConfigText}>⚙️ Configuración Avanzada</Text>
          </TouchableOpacity>
        </View>

        <Box style={styles.formContainer}>
          <DemographicsForm
            control={control}
            calculatedBmi={calculatedBmi}
            errors={errors}
            getRangeValidation={getRangeValidation}
          />

          {completionPercentage > 10 && (
            <GynecologyHistoryForm control={control} errors={errors} />
          )}

          {completionPercentage > 30 && (
            <LabTestsForm control={control} calculatedHoma={calculatedHoma} errors={errors} />
          )}

          {completionPercentage > 50 && (
            <MaleFactorForm control={control} errors={errors} />
          )}
        </Box>

        {completionPercentage > 0 && (
          <View style={styles.progressContainer}>
            <ConditionalProgressDisplay
              formData={formData}
              currentStep={currentStep}
              completionPercentage={completionPercentage}
              stepLabels={stepLabels}
            />
          </View>
        )}

        {/* 🎯 CONFIGURACIÓN RÁPIDA */}
        <QuickConfig onOpenAdvanced={() => setAdvancedConfigVisible(true)} />

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
          animated={false}
        />

        <ConfigModal
          visible={configModalVisible}
          onClose={() => setConfigModalVisible(false)}
        />

        <ConfigModalAdvanced
          visible={advancedConfigVisible}
          onClose={() => setAdvancedConfigVisible(false)}
          onConfigChange={(config) => {
            console.log('🎯 Configuración actualizada:', config);
          }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
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
    textAlign: 'center',
    ...theme.typography.h1,
    color: theme.colors.primary,
  },
  subtitle: {
    textAlign: 'center',
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
    textAlign: 'center',
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.s,
    paddingHorizontal: theme.spacing.l,
  },
  // 🎯 ESTILOS PARA CONFIGURACIÓN AVANZADA
  advancedConfigButton: {
    marginTop: theme.spacing.s,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  advancedConfigText: {
    ...theme.typography.bodySmall,
    color: theme.colors.primary,
    fontWeight: '600',
  },
});
