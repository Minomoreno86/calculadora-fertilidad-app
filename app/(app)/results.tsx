// src/app/results.tsx
import React from 'react';
import { StyleSheet, View, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';

// 🚀 CONSOLIDACIÓN MÉDICA: Importar análisis avanzado
import PredictiveInsights from '@/presentation/components/features/PredictiveInsights';
import { validateUserInputForPrediction } from '@/presentation/utils/formDataAdapter';
import { EnhancedInfoCard } from '@/presentation/components/common';

// 🩺 ANÁLISIS MÉDICO COMPLETO: Importar validación clínica avanzada
import { IntelligentValidationIntegrator } from '@/presentation/components/features/validation/IntelligentValidationIntegrator';

// Importar el nuevo hook de carga de reportes
import { useReportLoader } from '@/presentation/features/results/hooks/useReportLoader';

// Importar el nuevo componente de display de resultados
import { ResultsDisplay } from '@/presentation/features/results/components/ResultsDisplay';

// Importar los sugeridores de tratamiento (premium)
import { suggestTreatments } from '@/core/domain/services/treatmentSuggester';

import Text from '@/presentation/components/common/Text';
import { useDynamicTheme } from '@/hooks/useDynamicTheme';

// --- Pantalla Principal de Resultados ---
export default function ResultsScreen() {
  const params = useLocalSearchParams();
  const { evaluation, loading, error, isPremiumReport } = useReportLoader(params.reportKey); // Usar el nuevo hook
  
  // 🎨 TEMA DINÁMICO
  const theme = useDynamicTheme();

  // 🚀 CONSOLIDACIÓN MÉDICA: Preparar datos para análisis avanzado (hooks al inicio)
  const formDataForIA = React.useMemo(() => {
    if (!evaluation?.input) return null;
    
    // Convertir el UserInput de la evaluación para análisis IA
    return evaluation.input;
  }, [evaluation]);

  // 🩺 Preparar datos para validación clínica (conversión de UserInput a FormData)
  const formDataForClinical = React.useMemo(() => {
    if (!evaluation?.input) return {};
    
    // Convertir UserInput a formato FormData para validación clínica
    const userInput = evaluation.input;
    return {
      age: userInput.age,
      // Calcular height y weight desde BMI (aproximación)
      height: userInput.bmi ? Math.sqrt(70 / (userInput.bmi / 10000)) : undefined,
      weight: userInput.bmi ? (userInput.bmi * 1.7 * 1.7) / 10000 : undefined,
      amhValue: userInput.amh,
      cycleLength: userInput.cycleDuration,
      infertilityDuration: userInput.infertilityDuration,
      hasPcos: userInput.hasPcos,
      endometriosisGrade: userInput.endometriosisGrade,
      spermConcentration: userInput.spermConcentration,
      spermProgressiveMotility: userInput.spermProgressiveMotility,
      // Usar homaIr directamente
      homaValue: userInput.homaIr,
      tshValue: userInput.tsh,
      prolactinValue: userInput.prolactin
    };
  }, [evaluation]);

  const iaValidation = React.useMemo(() => {
    if (!formDataForIA) return { isValid: false, missingCritical: [], dataQuality: 0 };
    return validateUserInputForPrediction(formDataForIA);
  }, [formDataForIA]);

  // Definir qué sugeridor de tratamiento usar.
  // Por ahora, asumimos que si llegamos aquí, queremos el premium.
  // En una fase posterior, esto podría basarse en la suscripción del usuario o un parámetro.
  const treatmentSuggester = suggestTreatments; // Sistema unificado de tratamientos

  // 🎨 Crear estilos dinámicos
  const styles = createStyles(theme);

  // Estado de carga o error
  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Cargando tu informe...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.loadingText}>Error al cargar el informe: {error}</Text>
        <Text style={styles.loadingText}>Por favor, inténtalo de nuevo desde la pantalla de la calculadora.</Text>
      </View>
    );
  }

  if (!evaluation) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.loadingText}>No se pudo cargar el informe. Por favor, inténtalo de nuevo.</Text>
      </View>
    );
  }

  // Si no hay errores y la evaluación está disponible, calculamos las sugerencias
  const treatmentSuggestions = treatmentSuggester(evaluation);

  return (
    <ScrollView style={styles.fullScreenContainer}>
      <Stack.Screen options={{ title: 'Tu Informe de Fertilidad' }} />
      
      {/* 🎯 TARJETA PRINCIPAL DE PRONÓSTICO - LO PRIMERO QUE VE EL USUARIO */}
      <View style={styles.mainPrognosisSection}>
        {/* DISPLAY DE RESULTADOS PRINCIPAL: PrognosisCard */}
        <ResultsDisplay
          evaluation={evaluation}
          treatmentSuggestions={treatmentSuggestions}
          isPremiumReport={isPremiumReport}
        />
      </View>
      
      {/* 📊 SECCIÓN DE INFORMACIÓN ADICIONAL */}
      <View style={styles.additionalInfoSection}>
        {/* Información adicional del reporte */}
        <View style={styles.reportSummary}>
          <Text style={styles.categoryText}>Estado: {evaluation.report.category}</Text>
          <Text style={styles.prognosisText}>{evaluation.report.prognosisPhrase}</Text>
          {evaluation.report.benchmarkPhrase && (
            <Text style={styles.benchmarkText}>{evaluation.report.benchmarkPhrase}</Text>
          )}
        </View>
        
        {/* Desglose rápido de factores principales */}
        <View style={styles.quickFactorsGrid}>
          {Object.entries(evaluation.factors).slice(0, 4).map(([factor, value]) => (
            <View key={factor} style={styles.factorCard}>
              <Text style={styles.factorValue}>
                {typeof value === 'number' ? value.toFixed(1) : String(value)}
              </Text>
              <Text style={styles.factorLabel}>{factor.replace(/([A-Z])/g, ' $1').trim()}</Text>
            </View>
          ))}
        </View>
      </View>
      
      {/* 🩺 ANÁLISIS CLÍNICO COMPLETO CONSOLIDADO */}
      {evaluation?.input && (
        <View style={styles.medicalAnalysisSection}>
          <EnhancedInfoCard
            type="info"
            title="🩺 Estado Clínico y Recomendaciones"
            message="Análisis completo de tu perfil médico y sugerencias personalizadas"
            showIcon={true}
            animated={false}
          />
          
          {/* Validación clínica avanzada con estado óptimo y tests recomendados */}
          <IntelligentValidationIntegrator
            formData={formDataForClinical}
            onValidationChange={(isValid: boolean, canProceed: boolean) => {
              console.log('🩺 Validación clínica completa:', { isValid, canProceed });
            }}
            onActionRequired={(insight: unknown) => {
              console.log('🚨 Acción médica requerida:', insight);
            }}
            showInlineAlerts={true}
            showMedicalAnalysis={true}
            basicValidationOnly={false}
            style={{ marginTop: 16 }}
          />
        </View>
      )}
      
      {/* 🚀 ANÁLISIS MÉDICO AVANZADO CON IA */}
      {formDataForIA && iaValidation.isValid && (
        <View style={styles.medicalAnalysisSection}>
          <EnhancedInfoCard
            type="info"
            title="🧠 Análisis Médico Avanzado"
            message={`Calidad de datos: ${iaValidation.dataQuality}% - Análisis completo disponible`}
            showIcon={true}
            animated={false}
          />
          
          <PredictiveInsights
            userInput={formDataForIA}
            onTreatmentSelect={(treatmentId: string) => {
              console.log('🎯 Tratamiento seleccionado desde resultados:', treatmentId);
              // Implementar navegación específica o acciones del tratamiento
            }}
            onRecommendationAction={(action: string, data: unknown) => {
              console.log('💡 Acción de recomendación desde resultados:', action, data);
              // Implementar acciones específicas de recomendaciones médicas
            }}
            style={styles.predictiveInsights}
          />
        </View>
      )}
    </ScrollView>
  );
}

// 🎨 Función para crear estilos dinámicos
const createStyles = (theme: ReturnType<typeof useDynamicTheme>) => StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: 16,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.text,
    textAlign: 'center',
  },
  // 🎯 TARJETA PRINCIPAL DE PRONÓSTICO: Estilos para la sección más importante
  mainPrognosisSection: {
    marginHorizontal: theme.spacing.screen,
    marginTop: theme.spacing.m,
    marginBottom: theme.spacing.l,
  },
  // 📊 INFORMACIÓN ADICIONAL: Estilos para datos complementarios
  additionalInfoSection: {
    marginHorizontal: theme.spacing.screen,
    marginBottom: theme.spacing.l,
  },
  reportSummary: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.m,
    padding: theme.spacing.m,
    marginTop: theme.spacing.m,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  prognosisText: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 4,
    lineHeight: 20,
  },
  benchmarkText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  quickFactorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: theme.spacing.m,
    gap: theme.spacing.s,
  },
  factorCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.s,
    padding: theme.spacing.m,
    alignItems: 'center',
    minWidth: '22%',
    maxWidth: '48%',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  factorValue: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  factorLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  // 🚀 CONSOLIDACIÓN MÉDICA: Estilos para análisis avanzado
  medicalAnalysisSection: {
    marginHorizontal: theme.spacing.screen,
    marginTop: theme.spacing.m,
    marginBottom: theme.spacing.l,
  },
  predictiveInsights: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.spacing.m,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginTop: theme.spacing.m,
  },
});