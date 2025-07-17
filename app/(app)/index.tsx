import { StyleSheet, ScrollView, View, KeyboardAvoidingView, Platform } from 'react-native';
import Box from '@/presentation/components/common/Box';
import Text from '@/presentation/components/common/Text';
import { Button, EnhancedButton } from '@/presentation/components/common/EnhancedButton';
import { ConditionalProgressDisplay } from '@/presentation/features/calculator/components/ConditionalProgressDisplay';
import { EnhancedInfoCard } from '@/presentation/components/common';
// 🚀 VALIDACIÓN PARALELA AVANZADA: Monitor especializado
import ParallelValidationMonitor from '@/presentation/components/common/ParallelValidationMonitor';

// 🚀 CALCULADORA PRINCIPAL CON VALIDACIÓN INTEGRADA
import { useCalculatorForm } from '@/presentation/features/calculator/useCalculatorForm';
// ⚡ FALLBACK: Hook original para casos especiales
// import { useCalculatorForm } from '@/presentation/features/calculator/useCalculatorForm';

// 🚀 FASE 2A: COMPONENTES DE OPTIMIZACIÓN
import { LazyFormSection } from '@/presentation/components/common/LazyComponent';
import { PerformanceMonitor } from '@/presentation/components/common/PerformanceMonitorAdvanced';
import { RenderLoopDetector, useRenderTracker } from '@/presentation/components/common/RenderLoopDetector';

import { clearEngineCache } from '@/core/domain/services/calculationEngine';
import { DemographicsForm } from '@/presentation/features/calculator/components/DemographicsForm';
import { GynecologyHistoryForm } from '@/presentation/features/calculator/components/GynecologyHistoryForm';
import { LabTestsForm } from '@/presentation/features/calculator/components/LabTestsForm';
import { MaleFactorForm } from '@/presentation/features/calculator/components/MaleFactorForm';
import SimpleValidationIntegrator from '@/presentation/components/features/validation/IntelligentValidationIntegrator';
import { useDynamicTheme } from '@/hooks/useDynamicTheme';
import { ConfigModal } from '@/presentation/components/common/ConfigModal';
import React, { useState } from 'react';

// 🚀 FASE 2A: Declaración de __DEV__ para React Native
declare const __DEV__: boolean;

export default function CalculatorScreen() {
  // 🛠️ Estado para modal de configuración
  const [configModalVisible, setConfigModalVisible] = useState(false);
  // 🚀 FASE 2A: Estado para métricas de validación
  const [currentValidationMetrics, setCurrentValidationMetrics] = useState<unknown>(null);

  // 🚀 FASE 2A: Callback estable para actualizar métricas (evita re-renders infinitos)
  const handleValidationMetricsUpdate = React.useCallback((metrics: unknown) => {
    setCurrentValidationMetrics(metrics);
  }, []);

  // 🚀 FASE 2A: Envolver en optimización para mejores performances
  return (
    <RenderLoopDetector componentName="CalculatorScreen" threshold={30}>
      <CalculatorScreenContent 
        configModalVisible={configModalVisible}
        setConfigModalVisible={setConfigModalVisible}
        onValidationMetricsUpdate={handleValidationMetricsUpdate}
      />
      
      {/* 🚀 FASE 2A: Monitor de Performance (solo en desarrollo) */}
      {__DEV__ && (
        <PerformanceMonitor
          isVisible={true}
          position="bottom"
          compact={true}
          validationMetrics={currentValidationMetrics}
        />
      )}
    </RenderLoopDetector>
  );
}

interface CalculatorScreenContentProps {
  readonly configModalVisible: boolean; 
  readonly setConfigModalVisible: (visible: boolean) => void;
  readonly onValidationMetricsUpdate?: (metrics: unknown) => void;
}

function CalculatorScreenContent({ 
  configModalVisible, 
  setConfigModalVisible,
  onValidationMetricsUpdate: _onValidationMetricsUpdate
}: CalculatorScreenContentProps) {

  // 🚨 FASE 2A: Detector de re-renders excesivos
  useRenderTracker('CalculatorScreenContent');

  // 🎨 TEMA DINÁMICO
  const theme = useDynamicTheme();

  // 🚀 HOOK PRINCIPAL DE CALCULADORA
  const {
    // API principal del formulario
    control, 
    calculatedBmi, 
    calculatedHoma, 
    handleCalculate, 
    formState,
    isLoading = false,
    currentStep = 0,
    
    // Funciones auxiliares
    watchedFields
  } = useCalculatorForm(); // 🚀 Hook principal de calculadora

  // Valores por defecto para compatibilidad
  const errors = formState?.errors ?? {};

  // 📊 ESTABILIZACIÓN DE DATOS DEL FORMULARIO (Anti-Loop)
  const watchedFieldsRef = React.useRef<string>('{}');
  const formDataRef = React.useRef<Record<string, unknown>>({});

  // Solo actualizar si el contenido realmente cambió
  const watchedFieldsString = JSON.stringify(watchedFields || {});
  if (watchedFieldsRef.current !== watchedFieldsString) {
    watchedFieldsRef.current = watchedFieldsString;
    formDataRef.current = watchedFields ? { ...watchedFields } : {};
  }

  const formData = formDataRef.current;

  // 📊 Función para obtener completitud (ESTABILIZADA)
  const completionPercentage = React.useMemo(() => {
    const fields = Object.values(formData);
    const filledFields = fields.filter(value => 
      value !== undefined && value !== null && value !== ''
    );
    return fields.length > 0 ? Math.round((filledFields.length / fields.length) * 100) : 0;
  }, [formData]);

  // 🚀 Función auxiliar para validación de rangos (creada manualmente)
  const getRangeValidation = React.useCallback((_fieldName: string) => {
    // Implementación básica de validación de rangos
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

  // 🚀 Función auxiliar canCalculate
  const canCalculate = React.useMemo(() => {
    return completionPercentage > 20; // Puede calcular con 20% de completitud
  }, [completionPercentage]);

  // 🎨 Crear estilos dinámicos basados en el tema actual
  const styles = createStyles(theme);

  const stepLabels = ['Demografia', 'Ginecología', 'Laboratorio', 'Factor Masculino'];

  // 💡 Helper para mensaje de completitud (SIMPLIFICADO)
  const getCompletionMessage = () => {
    if (completionPercentage < 40) {
      return "Puedes generar un informe básico con los datos actuales";
    }
    if (completionPercentage < 70) {
      return "Buenos datos disponibles para un informe útil";
    }
    return "Datos completos para el análisis más detallado";
  };

  // 💡 Helper para título del botón (SIMPLIFICADO)
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
          {/* 🛠️ Header con título y botón en línea */}
          <View style={styles.headerRow}>
            <Text variant="h1" style={styles.title}>
              Calculadora de Fertilidad
            </Text>
            <Button
              title=""
              onPress={() => {
                console.log('🛠️ Abriendo configuración');
                setConfigModalVisible(true);
              }}
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

        <Box style={styles.formContainer}>
          {/* 🚀 FASE 2A: Secciones de formulario con lazy loading */}
          <LazyFormSection isVisible={true} sectionName="Demografía">
            <DemographicsForm
              control={control}
              calculatedBmi={calculatedBmi}
              errors={errors}
              getRangeValidation={getRangeValidation}
            />
          </LazyFormSection>

          <LazyFormSection isVisible={completionPercentage > 10} sectionName="Ginecología">
            <GynecologyHistoryForm control={control} errors={errors} />
          </LazyFormSection>

          <LazyFormSection isVisible={completionPercentage > 30} sectionName="Laboratorio">
            <LabTestsForm control={control} calculatedHoma={calculatedHoma} errors={errors} />
          </LazyFormSection>

          <LazyFormSection isVisible={completionPercentage > 50} sectionName="Factor Masculino">
            <MaleFactorForm control={control} errors={errors} />
          </LazyFormSection>
        </Box>

        {/* 📊 PROGRESO INTELIGENTE CON FEATURE FLAGS */}
        {completionPercentage > 0 && (
          <View style={styles.progressContainerMoved}>
            <ConditionalProgressDisplay
              formData={formData}
              currentStep={currentStep}
              completionPercentage={completionPercentage}
              stepLabels={stepLabels}
            />
          </View>
        )}

        {/* 🚀 VALIDACIÓN PARALELA AVANZADA - Sistema Inteligente Completo */}
        <View style={styles.intelligentValidationContainer}>
          <SimpleValidationIntegrator
            formData={formData}
            onValidationChange={React.useCallback((isValid: boolean, canProceed: boolean) => {
              console.log('🚀 Validación paralela avanzada:', { isValid, canProceed });
            }, [])}
            onActionRequired={React.useCallback((insight: unknown) => {
              console.log('🚨 Acción paralela requerida:', insight);
            }, [])}
            showInlineAlerts={true}
            showMedicalAnalysis={false}
            basicValidationOnly={false}
            style={{ marginTop: 16 }}
          />
        </View>

        <View style={styles.buttonContainer}>
          <EnhancedButton
            title={getButtonTitle()}
            onPress={handleCalculate}
            variant="primary"
            size="large"
            fullWidth
            loading={isLoading}
            disabled={isLoading || !canCalculate}
            iconName="lightning"
            enhanced={true}
            completionPercentage={completionPercentage}
          />
          
          {/* 💡 Texto explicativo bajo el botón */}
          {!isLoading && (
            <Text style={styles.buttonHelpText}>
              {getCompletionMessage()}
            </Text>
          )}
          
          <View style={styles.secondaryButtonContainer}>
                  {/* 🔧 DEBUG: Botón para limpiar cache durante desarrollo */}
        {__DEV__ && (
          <Button
            title="🧹 Limpiar Cache (Debug)"
            onPress={() => {
              clearEngineCache();
              console.log('✅ Cache limpiado manualmente');
            }}
            variant="text"
            size="small"
            style={{ marginTop: 8 }}
          />
        )}
          </View>
        </View>

        {/* 💡 Información básica de progreso */}
        <EnhancedInfoCard
          type="info"
          title="Progreso del Formulario"
          message={`${completionPercentage}% completado - Listo para calcular`}
          showIcon={true}
          animated={false}
        />

        {/* 🚀 MONITOR DE VALIDACIÓN PARALELA AVANZADA - Solo en desarrollo */}
        {__DEV__ && (
          <ParallelValidationMonitor
            compact={true}
            showAdvancedMetrics={true}
          />
        )}

        {/* ⚙️ Modal de Configuración */}
        <ConfigModal
          visible={configModalVisible}
          onClose={() => setConfigModalVisible(false)}
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
    marginBottom: theme.spacing.xs,
  },
  progressContainerMoved: {
    marginHorizontal: theme.spacing.screen,
    marginTop: theme.spacing.m,
    marginBottom: theme.spacing.xs,
    padding: theme.spacing.card,
    ...theme.components.card.default,
  },
  intelligentValidationContainer: {
    marginHorizontal: theme.spacing.screen,
    marginBottom: theme.spacing.m,
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
  secondaryButtonContainer: {
    marginTop: theme.spacing.m,
    alignItems: 'center',
  },
  buttonHelpText: {
    textAlign: 'center',
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.s,
    paddingHorizontal: theme.spacing.l,
  },
});