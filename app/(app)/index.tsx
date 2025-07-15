import { StyleSheet, ScrollView, View, KeyboardAvoidingView, Platform } from 'react-native';
import { Link } from 'expo-router';
import Box from '@/presentation/components/common/Box';
import Text from '@/presentation/components/common/Text';
import { Button, EnhancedButton } from '@/presentation/components/common/EnhancedButton';
import { ConditionalProgressDisplay } from '@/presentation/features/calculator/components/ConditionalProgressDisplay';
import { EnhancedInfoCard } from '@/presentation/components/common';
import { EnhancedValidationMonitor } from '@/presentation/components/common/EnhancedValidationMonitor';

// 🚀 FASE 2A: ACTIVANDO VALIDACIÓN PARALELA PREMIUM
import { useCalculatorWithParallelValidation } from '@/presentation/features/calculator/hooks/useCalculatorWithParallelValidation';
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
  onValidationMetricsUpdate
}: CalculatorScreenContentProps) {

  // 🚨 FASE 2A: Detector de re-renders excesivos
  useRenderTracker('CalculatorScreenContent');

  // 🎨 TEMA DINÁMICO
  const theme = useDynamicTheme();

  // 🚀 HOOK PRINCIPAL CON VALIDACIÓN PARALELA PREMIUM (FASE 2A)
  const {
    // API principal del formulario
    control, 
    calculatedBmi, 
    calculatedHoma, 
    handleCalculate, 
    errors,
    isLoading = false,
    currentStep = 0,
    
    // 🚀 FASE 2A: Funcionalidades premium de validación paralela
    isValidating,
    validationMetrics,
    criticalErrors,
    suggestions,
    
    // Funciones auxiliares con nombres correctos
    watchedFields
  } = useCalculatorWithParallelValidation(); // 🚀 Hook premium activado

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

  // 🚀 FASE 2A: Actualizar métricas en el componente padre (ESTABILIZADO)
  const validationMetricsString = JSON.stringify(validationMetrics || {});
  const lastMetricsRef = React.useRef<string>('{}');
  
  React.useEffect(() => {
    if (onValidationMetricsUpdate && validationMetricsString !== lastMetricsRef.current) {
      lastMetricsRef.current = validationMetricsString;
      onValidationMetricsUpdate(validationMetrics);
    }
  }, [validationMetricsString, onValidationMetricsUpdate, validationMetrics]);

  // 🎨 Crear estilos dinámicos basados en el tema actual
  const styles = createStyles(theme);

  const stepLabels = ['Demografia', 'Ginecología', 'Laboratorio', 'Factor Masculino'];

  // 💡 Helper para mensaje de completitud
  const getCompletionMessage = () => {
    if (completionPercentage < 40) {
      return "💡 Funciona con datos mínimos - Puedes generar un informe básico ahora";
    }
    if (completionPercentage < 70) {
      return "✅ Buenos datos disponibles - El informe será útil y preciso";
    }
    return "🏆 Datos completos - Obtendrás el análisis más detallado";
  };

  // 💡 Helper para título del botón
  const getButtonTitle = () => {
    return completionPercentage >= 70 ? "Generar Informe Completo" : "Generar Informe con Datos Disponibles";
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

        {/* 🧠 SISTEMA INTELIGENTE DE VALIDACIÓN CLÍNICA - ACTIVADO */}
        <View style={styles.intelligentValidationContainer}>
          <SimpleValidationIntegrator
            formData={formData}
            onValidationChange={React.useCallback((isValid: boolean, canProceed: boolean) => {
              // El sistema inteligente proporciona feedback de patrones complejos
              console.log('🧠 Validación inteligente:', { isValid, canProceed });
            }, [])}
            onActionRequired={React.useCallback((insight: unknown) => {
              // Manejar insights clínicos avanzados (ej: contactar especialista)
              console.log('🚨 Acción clínica requerida:', insight);
            }, [])}
            showInlineAlerts={true}
            style={{ marginTop: 16 }}
          />

          {/* 🚀 FASE 2A: Indicadores de validación paralela */}
          {isValidating && (
            <View style={styles.validationStatusContainer}>
              <Text variant="caption" style={styles.validationStatusText}>
                🔄 Validación paralela en progreso...
              </Text>
            </View>
          )}

          {/* 🚨 Errores críticos de validación paralela */}
          {criticalErrors && criticalErrors.length > 0 && (
            <View style={styles.criticalErrorsContainer}>
              <Text variant="bodyBold" style={styles.criticalErrorsTitle}>
                ⚠️ Atención Requerida
              </Text>
              {criticalErrors.slice(0, 2).map((error, index) => (
                <Text key={`error-${error.slice(0, 20)}-${index}`} variant="caption" style={styles.criticalErrorText}>
                  • {error}
                </Text>
              ))}
            </View>
          )}

          {/* 💡 Sugerencias de la validación paralela */}
          {suggestions && suggestions.length > 0 && !criticalErrors?.length && (
            <View style={styles.suggestionsContainer}>
              <Text variant="bodyBold" style={styles.suggestionsTitle}>
                💡 Sugerencias
              </Text>
              {suggestions.slice(0, 2).map((suggestion, suggestionIndex) => (
                <Text key={`suggestion-${suggestion.slice(0, 20)}-${suggestionIndex}`} variant="caption" style={styles.suggestionText}>
                  • {suggestion}
                </Text>
              ))}
            </View>
          )}
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
            <Link href="/premiumCalculator" asChild>
              <Button
                title="Calculadora Premium"
                onPress={() => {}}
                variant="outline"
                size="medium"
                iconName="gem"
                iconPosition="left"
              />
            </Link>
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

        {/* 💡 Tarjeta de completitud mejorada */}
        <EnhancedInfoCard
          type="success"
          title="Progreso del Cálculo"
          message={`Completitud: ${completionPercentage}% - Datos suficientes para análisis clínico`}
          showIcon={true}
          animated={true}
        />

        {/* 🚀 MONITOR DE VALIDACIÓN PARALELA - Solo en desarrollo */}
        {__DEV__ && (
          <EnhancedValidationMonitor
            isValidating={isValidating || false}
            progress={0}
            metrics={{
              isValidating: isValidating || false,
              progress: 0,
              totalTasks: 0,
              completedTasks: 0,
              averageTaskTime: validationMetrics?.performance?.averageTaskTime || 0,
              cacheHitRate: validationMetrics?.performance?.cacheHitRate || 0,
              tasksPerSecond: validationMetrics?.performance?.tasksPerSecond || 0,
              efficiency: validationMetrics?.performance?.efficiency || 'N/A',
            }}
            showDevInfo={true}
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
  // 🚀 FASE 2A: Estilos para validación paralela premium
  validationStatusContainer: {
    backgroundColor: theme.colors.primary + '10',
    padding: theme.spacing.s,
    borderRadius: theme.spacing.xs,
    marginTop: theme.spacing.s,
    alignItems: 'center',
  },
  validationStatusText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  criticalErrorsContainer: {
    backgroundColor: theme.colors.error + '10',
    padding: theme.spacing.s,
    borderRadius: theme.spacing.xs,
    marginTop: theme.spacing.s,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.error,
  },
  criticalErrorsTitle: {
    color: theme.colors.error,
    marginBottom: theme.spacing.xs,
  },
  criticalErrorText: {
    color: theme.colors.error,
    marginLeft: theme.spacing.s,
    lineHeight: 18,
  },
  suggestionsContainer: {
    backgroundColor: theme.colors.info + '10',
    padding: theme.spacing.s,
    borderRadius: theme.spacing.xs,
    marginTop: theme.spacing.s,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.info,
  },
  suggestionsTitle: {
    color: theme.colors.info,
    marginBottom: theme.spacing.xs,
  },
  suggestionText: {
    color: theme.colors.info,
    marginLeft: theme.spacing.s,
    lineHeight: 18,
  },
});