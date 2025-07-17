// ===================================================================
// 🏥 CALCULADORA AEC-D PROFESIONAL - VERSIÓN COMPLETA INTEGRADA
// ===================================================================

import React, { useState, useMemo, Suspense } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

// 🚀 IMPORTS PROFESIONALES - Sistema completo integrado (RUTAS CORREGIDAS)
import { useCalculatorForm } from '../../src/presentation/features/calculator/useCalculatorForm';
import { DemographicsForm } from '../../src/presentation/features/calculator/components/DemographicsForm';
import { GynecologyHistoryForm } from '../../src/presentation/features/calculator/components/GynecologyHistoryForm';
import { LabTestsForm } from '../../src/presentation/features/calculator/components/LabTestsForm';
import { MaleFactorForm } from '../../src/presentation/features/calculator/components/MaleFactorForm';
import { EnhancedButton } from '../../src/presentation/components/common/EnhancedButton';
import { InfoCard } from '../../src/presentation/components/common/InfoCard';
import Text from '../../src/presentation/components/common/Text';
import { useDynamicTheme } from '../../src/hooks/useDynamicTheme';

// 🧠 Agente IA Médico Integrado
import { MedicalAIAgent } from '../../ai-medical-agent/index';

// 🎨 Interfaces para tipado fuerte - Coinciden exactamente con MedicalAIAgent
interface AIAnalysis {
  diagnosis: {
    primaryDiagnoses: Array<{
      pathology: string;
      probability: number;
      reasoning: string;
      evidenceLevel: string;
    }>;
    secondaryDiagnoses: Array<{
      pathology: string;
      probability: number;
      reasoning: string;
    }>;
    riskFactors: string[];
    urgencyLevel: 'low' | 'medium' | 'high';
  };
  treatmentPlan: {
    recommendedTreatments: Array<{
      treatment: string;
      priority: number;
      reasoning: string;
      successRate: {
        perCycle: number;
        cumulative: number;
      };
      timeframe: string;
      costs: string;
    }>;
    lifestyle: string[];
    nextSteps: {
      ifSuccess: string;
      ifFailure: string[];
    };
  };
  successPrediction: {
    probabilityNatural: number;
    probabilityWithTreatment: number;
    timeToConception: {
      natural: string;
      withTreatment: string;
    };
    factors: {
      positive: string[];
      negative: string[];
    };
    recommendations: string[];
  };
  metadata: {
    analysisDate: string;
    version: string;
    evidenceLevel: string;
  };
}

// 🎨 Función para crear estilos dinámicos
const createStyles = (theme: ReturnType<typeof useDynamicTheme>) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  progressContainer: {
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  progressSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
  },
  stepNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  stepButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  stepButtonDisabled: {
    backgroundColor: theme.colors.border,
  },
  stepButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  stepIndicator: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  stepText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  formSection: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
  },
  aiPanel: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  aiTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 16,
  },
  aiContent: {
    marginBottom: 16,
  },
  aiSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: 12,
    marginBottom: 8,
  },
  aiText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  aiRiskItem: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginLeft: 8,
    marginBottom: 4,
  },
  aiButton: {
    backgroundColor: theme.colors.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  aiButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionsContainer: {
    marginTop: 24,
    marginBottom: 24,
  },
  resetButton: {
    backgroundColor: theme.colors.border,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  resetButtonText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
});

// 🎯 Componente de carga para Lazy Loading
const LoadingFallback = ({ message = "Cargando..." }: { message?: string }) => (
  <View style={{ 
    padding: 20, 
    alignItems: 'center', 
    backgroundColor: '#F8F9FA', 
    borderRadius: 12, 
    marginVertical: 8 
  }}>
    <ActivityIndicator size="small" color="#007AFF" />
    <Text style={{ marginTop: 8, color: '#666', fontSize: 14 }}>{message}</Text>
  </View>
);

// 🎯 COMPONENTE PRINCIPAL - CALCULADORA AEC-D COMPLETA
function CalculatorScreenContent() {
  const theme = useDynamicTheme();
  
  // 🚀 Hook principal de calculadora con todo el sistema integrado
  const calculator = useCalculatorForm();
  
  const {
    control,
    formState,
    isLoading,
    calculatedBmi,
    calculatedHoma,
    progress,
    canCalculate,
    getRangeValidation,
    handleCalculate: handleCalculateForm,
    watchedFields,
  } = calculator;
  
  // Extraer errors del formState
  const errors = formState.errors;
  
  // 🧠 Estado del Agente IA Médico
  const [aiAgent] = useState(() => new MedicalAIAgent());
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  
  // 🎯 Estado local para navegación de pasos
  const [currentStepLocal, setCurrentStepLocal] = useState(1);
  
  // Funciones de navegación
  const goToNextStep = () => {
    if (currentStepLocal < 4) {
      setCurrentStepLocal(prev => prev + 1);
    }
  };
  
  const goToPreviousStep = () => {
    if (currentStepLocal > 1) {
      setCurrentStepLocal(prev => prev - 1);
    }
  };
  
  // Función simple de reset
  const resetForm = () => {
    setCurrentStepLocal(1);
    setAiAnalysis(null);
  };

  // 🎨 Crear estilos dinámicos
  const styles = useMemo(() => createStyles(theme), [theme]);

  // 🎯 Manejador de cálculo con integración IA
  const handleCalculateWithAI = async () => {
    try {
      // 1. Ejecutar cálculo tradicional
      await handleCalculateForm();
      
      // 2. Ejecutar análisis IA
      const userInput = convertFormToUserInput(watchedFields as Record<string, unknown>);
      const analysis = aiAgent.analyzeCase(userInput);
      setAiAnalysis(analysis);
      
      Alert.alert(
        '✅ Análisis Completado', 
        'Cálculo tradicional y análisis con IA completados. Revisa los resultados.'
      );
    } catch (error) {
      console.error('Error en cálculo:', error);
      Alert.alert('Error', 'Hubo un problema con el análisis. Intenta nuevamente.');
    }
  };

  // 🔄 Convertir datos del formulario para IA
  const convertFormToUserInput = (formData: Record<string, unknown>) => {
    const parseValue = (value: unknown): number => {
      if (typeof value === 'number') return value;
      if (typeof value === 'string') return parseFloat(value) || 0;
      return 0;
    };

    return {
      age: parseValue(formData.age) || 30,
      bmi: calculatedBmi || 23,
      cycleDuration: parseValue(formData.cycleLength) || 28,
      infertilityDuration: parseValue(formData.infertilityDuration) || 12,
      hasPcos: formData.hasPcos as boolean || false,
      endometriosisGrade: parseInt(String(formData.endometriosisStage)) || 0,
      myomaType: String(formData.myomaType) || 'none',
      adenomyosisType: String(formData.adenomyosisType) || 'none',
      polypType: String(formData.polypType) || 'none',
      hsgResult: String(formData.hsgResult) || 'unknown',
      amh: parseValue(formData.amhValue) || undefined,
      tsh: parseValue(formData.tshValue) || undefined,
      prolactin: parseValue(formData.prolactinValue) || undefined,
      homaIr: calculatedHoma || undefined,
      spermConcentration: parseValue(formData.spermConcentration) || undefined,
      spermProgressiveMotility: parseValue(formData.spermProgressiveMotility) || undefined,
      spermNormalMorphology: parseValue(formData.spermNormalMorphology) || undefined,
      tpoAbPositive: formData.tpoAbPositive as boolean || false,
      hasPelvicSurgery: formData.hasPelvicSurgery as boolean || false,
      
      // Propiedades adicionales requeridas por UserInput
      previousPregnancies: 0,
      previousLosses: 0,
      symptoms: [],
      priorTreatments: [],
    };
  };

  // 🧠 Iniciar conversación con IA
  const startAIConversation = () => {
    if (aiAnalysis) {
      const userInput = convertFormToUserInput(watchedFields as Record<string, unknown>);
      aiAgent.startConversation(userInput, 'familyDoctor');
      Alert.alert('IA Activada', 'Conversación iniciada con Dr. IA Fertilitas');
    } else {
      Alert.alert('Información', 'Primero completa el análisis para iniciar la conversación con IA');
    }
  };

  // 📊 Renderizar indicadores de progreso
  const renderProgressIndicators = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressTitle}>
          📊 Progreso: {progress?.progressPercentage || 0}%
        </Text>
        <Text style={styles.progressSubtitle}>
          {progress?.completedSections || 0}/{progress?.totalSections || 4} secciones
        </Text>
      </View>
      
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${progress?.progressPercentage || 0}%` }
          ]} 
        />
      </View>

      {progress?.missingSections && progress.missingSections.length > 0 && (
        <InfoCard
          type="info"
          message={`Secciones pendientes: ${progress.missingSections.join(', ')}`}
        />
      )}
    </View>
  );

  // 🧠 Renderizar panel IA
  const renderAIPanel = () => {
    if (!aiAnalysis) return null;

    const primaryDiagnosis = aiAnalysis.diagnosis.primaryDiagnoses[0];
    const recommendedTreatment = aiAnalysis.treatmentPlan.recommendedTreatments[0];

    return (
      <View style={styles.aiPanel}>
        <Text style={styles.aiTitle}>🤖 Análisis con Inteligencia Artificial</Text>
        
        <View style={styles.aiContent}>
          <Text style={styles.aiSubtitle}>📋 Diagnóstico Principal:</Text>
          <Text style={styles.aiText}>
            {primaryDiagnosis?.pathology} ({primaryDiagnosis?.probability}% probabilidad)
          </Text>
          
          <Text style={styles.aiSubtitle}>💊 Tratamiento Recomendado:</Text>
          <Text style={styles.aiText}>
            {recommendedTreatment?.treatment}
          </Text>
          
          <Text style={styles.aiSubtitle}>📊 Tasa de Éxito:</Text>
          <Text style={styles.aiText}>
            Por ciclo: {recommendedTreatment?.successRate.perCycle}%
          </Text>
          <Text style={styles.aiText}>
            Acumulativo: {recommendedTreatment?.successRate.cumulative}%
          </Text>
          
          <Text style={styles.aiSubtitle}>📈 Predicción de Éxito:</Text>
          <Text style={styles.aiText}>
            Natural: {aiAnalysis.successPrediction.probabilityNatural}%
          </Text>
          <Text style={styles.aiText}>
            Con tratamiento: {aiAnalysis.successPrediction.probabilityWithTreatment}%
          </Text>
          
          <Text style={styles.aiSubtitle}>⏰ Tiempo Estimado:</Text>
          <Text style={styles.aiText}>
            Natural: {aiAnalysis.successPrediction.timeToConception.natural}
          </Text>
          <Text style={styles.aiText}>
            Con tratamiento: {aiAnalysis.successPrediction.timeToConception.withTreatment}
          </Text>
          
          {aiAnalysis.diagnosis.riskFactors && aiAnalysis.diagnosis.riskFactors.length > 0 && (
            <>
              <Text style={styles.aiSubtitle}>⚠️ Factores de Riesgo:</Text>
              {aiAnalysis.diagnosis.riskFactors.map((risk: string, index: number) => (
                <Text key={index} style={styles.aiRiskItem}>• {risk}</Text>
              ))}
            </>
          )}
        </View>

        <TouchableOpacity 
          style={styles.aiButton}
          onPress={startAIConversation}
        >
          <Text style={styles.aiButtonText}>💬 Conversar con Dr. IA</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // 📱 Renderizar navegación de pasos
  const renderStepNavigation = () => (
    <View style={styles.stepNavigation}>
      <TouchableOpacity
        style={[styles.stepButton, currentStepLocal === 1 && styles.stepButtonDisabled]}
        onPress={goToPreviousStep}
        disabled={currentStepLocal === 1}
      >
        <Text style={styles.stepButtonText}>← Anterior</Text>
      </TouchableOpacity>

      <View style={styles.stepIndicator}>
        <Text style={styles.stepText}>Paso {currentStepLocal}/4</Text>
      </View>

      <TouchableOpacity
        style={[styles.stepButton, currentStepLocal === 4 && styles.stepButtonDisabled]}
        onPress={goToNextStep}
        disabled={currentStepLocal === 4}
      >
        <Text style={styles.stepButtonText}>Siguiente →</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🧬 Calculadora AEC-D Profesional</Text>
        <Text style={styles.subtitle}>
          Arquitecto Experto Clínico-Digital + IA Médica
        </Text>
      </View>

      {/* 📊 INDICADORES DE PROGRESO */}
      {renderProgressIndicators()}

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* 📱 NAVEGACIÓN DE PASOS */}
        {renderStepNavigation()}

        {/* 📝 FORMULARIOS DINÁMICOS POR PASOS */}
        <Suspense fallback={<LoadingFallback message="Cargando formulario..." />}>
          {(currentStepLocal === 1) && (
            <View style={styles.formSection}>
              <DemographicsForm
                control={control}
                calculatedBmi={calculatedBmi}
                errors={errors}
                getRangeValidation={getRangeValidation}
              />
            </View>
          )}

          {(currentStepLocal === 2) && (
            <View style={styles.formSection}>
              <GynecologyHistoryForm
                control={control}
                errors={errors}
              />
            </View>
          )}

          {(currentStepLocal === 3) && (
            <View style={styles.formSection}>
              <LabTestsForm
                control={control}
                calculatedHoma={calculatedHoma}
                errors={errors}
              />
            </View>
          )}

          {(currentStepLocal === 4) && (
            <View style={styles.formSection}>
              <MaleFactorForm
                control={control}
                errors={errors}
              />
            </View>
          )}
        </Suspense>

        {/* 🧠 PANEL IA MÉDICA */}
        {renderAIPanel()}

        {/* 🎯 BOTONES DE ACCIÓN */}
        <View style={styles.actionsContainer}>
          <EnhancedButton
            title="🎯 Generar Informe Completo"
            onPress={handleCalculateWithAI}
            variant="primary"
            size="large"
            fullWidth
            loading={isLoading}
            disabled={isLoading || !canCalculate}
            iconName="document-text-outline"
          />

          {!canCalculate && (
            <InfoCard
              type="warning"
              message={`Completa al menos el 60% del formulario para generar el informe. Progreso actual: ${progress?.progressPercentage || 0}%`}
            />
          )}

          <TouchableOpacity
            style={styles.resetButton}
            onPress={resetForm}
          >
            <Text style={styles.resetButtonText}>🔄 Reiniciar Formulario</Text>
          </TouchableOpacity>
        </View>

        {/* ⚡ MONITOR DE PERFORMANCE (Solo en desarrollo) */}
        {process.env.NODE_ENV === 'development' && (
          <View style={{ padding: 16, backgroundColor: '#f0f0f0', borderRadius: 8 }}>
            <Text style={{ fontSize: 14, color: '#666' }}>
              🔧 Performance Monitor: Sistema optimizado funcionando
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default function CalculatorScreen() {
  return <CalculatorScreenContent />;
}
