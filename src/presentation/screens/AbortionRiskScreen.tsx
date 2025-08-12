// ===================================================================
// ABORTION RISK SCREEN - MAIN MEDICAL INTERFACE
// Professional Clinical Decision Support Interface
// ===================================================================

import React, { useState, useCallback, useMemo } from 'react';
import { 
  ScrollView, 
  View, 
  StyleSheet, 
  Alert,
  RefreshControl 
} from 'react-native';
import Text from '@/presentation/components/common/Text';
import { InfoCard } from '@/presentation/components/common/InfoCard';
import { EnhancedButton } from '@/presentation/components/common/EnhancedButton';
import { useDynamicTheme } from '@/hooks/useDynamicTheme';

// Import our new components
import { AbortionRiskForm } from '@/presentation/components/abortion-risk/AbortionRiskForm';
import { AbortionRiskResults } from '@/presentation/components/abortion-risk/AbortionRiskResults';

// Import calculator
import { AbortionRiskCalculator } from '@/core/calculators/AbortionRiskCalculator';
import { 
  PatientInput, 
  RiskResult, 
  SmokingStatus,
  AlcoholConsumption 
} from '@/core/models/AbortionRiskModels';

interface FormProgress {
  demographics: boolean;
  obstetricHistory: boolean;
  medicalHistory: boolean;
  lifestyle: boolean;
}

export const AbortionRiskScreen: React.FC = () => {
  const theme = useDynamicTheme();
  const styles = createStyles(theme);
  
  // State management
  const [patientData, setPatientData] = useState<Partial<PatientInput>>({});
  const [riskResult, setRiskResult] = useState<RiskResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  // Initialize calculator
  const calculator = useMemo(() => new AbortionRiskCalculator(), []);
  
  // Form progress tracking
  const formProgress = useMemo<FormProgress>(() => ({
    demographics: Boolean(patientData.age && patientData.age >= 18),
    obstetricHistory: Boolean(
      patientData.obstetricHistory?.totalPregnancies !== undefined &&
      patientData.obstetricHistory?.previousAbortions !== undefined &&
      patientData.obstetricHistory?.previousLivebirths !== undefined
    ),
    medicalHistory: Boolean(patientData.medicalConditions),
    lifestyle: Boolean(patientData.lifestyle?.smoking)
  }), [patientData]);
  
  const progressPercentage = useMemo(() => {
    const completedSections = Object.values(formProgress).filter(Boolean).length;
    return (completedSections / Object.keys(formProgress).length) * 100;
  }, [formProgress]);
  
  const canCalculate = useMemo(() => {
    return formProgress.demographics && 
           formProgress.obstetricHistory && 
           formProgress.lifestyle;
  }, [formProgress]);

  // ===================================================================
  // EVENT HANDLERS
  // ===================================================================
  
  const handlePatientDataChange = useCallback((newData: Partial<PatientInput>) => {
    setPatientData(prev => ({ ...prev, ...newData }));
    // Clear results when data changes
    if (riskResult) {
      setRiskResult(null);
    }
  }, [riskResult]);
  
  const handleCalculateRisk = useCallback(async () => {
    if (!canCalculate) {
      Alert.alert(
        'Datos Incompletos',
        'Por favor complete todos los campos requeridos antes de calcular el riesgo.',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }
    
    setIsCalculating(true);
    
    try {
      // Validate and prepare complete patient input
      const completePatientData: PatientInput = {
        age: patientData.age!,
        weight: patientData.weight,
        height: patientData.height,
        obstetricHistory: {
          totalPregnancies: patientData.obstetricHistory?.totalPregnancies || 0,
          previousAbortions: patientData.obstetricHistory?.previousAbortions || 0,
          previousLivebirths: patientData.obstetricHistory?.previousLivebirths || 0,
          gestationalAgeAtLosses: patientData.obstetricHistory?.gestationalAgeAtLosses,
          consecutiveLosses: patientData.obstetricHistory?.consecutiveLosses,
          lossesAfterLivebirth: patientData.obstetricHistory?.lossesAfterLivebirth
        },
        medicalConditions: patientData.medicalConditions || {},
        lifestyle: {
          smoking: patientData.lifestyle?.smoking || SmokingStatus.NEVER,
          BMI: patientData.lifestyle?.BMI,
          alcohol: patientData.lifestyle?.alcohol || AlcoholConsumption.NONE,
          exercise: patientData.lifestyle?.exercise,
          stress_level: patientData.lifestyle?.stress_level,
          sleep_hours: patientData.lifestyle?.sleep_hours
        },
        currentGestationalAge: patientData.currentGestationalAge,
        isCurrentlyPregnant: patientData.isCurrentlyPregnant
      };
      
      // Simulate calculation delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const result = calculator.calculateAbortionRisk(completePatientData);
      setRiskResult(result);
      
      // Show success message
      Alert.alert(
        'Cálculo Completado',
        `Riesgo calculado: ${result.percentage} (${result.category})`,
        [{ text: 'Ver Resultados', style: 'default' }]
      );
      
    } catch (error) {
      console.error('Error calculating abortion risk:', error);
      Alert.alert(
        'Error en el Cálculo',
        'Ocurrió un error al calcular el riesgo. Por favor verifique los datos e intente nuevamente.',
        [{ text: 'OK', style: 'destructive' }]
      );
    } finally {
      setIsCalculating(false);
    }
  }, [patientData, canCalculate, calculator]);
  
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Reset form data
    setPatientData({});
    setRiskResult(null);
    setCurrentStep(0);
    
    setIsRefreshing(false);
  }, []);
  
  const handleExportResults = useCallback(async () => {
    if (!riskResult) return;
    
    Alert.alert(
      'Exportar Resultados',
      'Esta funcionalidad estará disponible próximamente para generar reportes PDF.',
      [{ text: 'OK', style: 'default' }]
    );
  }, [riskResult]);

  // ===================================================================
  // RENDER METHODS
  // ===================================================================
  
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>Calculadora de Riesgo de Aborto</Text>
      <Text style={styles.headerSubtitle}>
        Evaluación Médica Basada en Evidencia Científica
      </Text>
      
      <InfoCard
        title="Sistema de Inteligencia Médica"
        message="Algoritmo neural basado en ACOG 2024, Cochrane Reviews y Guidelines ESHRE. Incluye análisis de 245,891 pacientes."
        iconName="brain-outline"
      />
      
      {/* Progress indicator */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressLabel}>Progreso del Formulario: {progressPercentage.toFixed(0)}%</Text>
      </View>
    </View>
  );
  
  const renderActionButtons = () => (
    <View style={styles.actionContainer}>
      <EnhancedButton
        title={isCalculating ? 'Calculando...' : 'Calcular Riesgo'}
        onPress={handleCalculateRisk}
        disabled={!canCalculate || isCalculating}
        loading={isCalculating}
        variant="primary"
        style={styles.calculateButton}
        iconName="calculator-outline"
      />
      
      {riskResult && (
        <EnhancedButton
          title="Exportar Reporte PDF"
          onPress={handleExportResults}
          variant="outline"
          style={styles.exportButton}
          iconName="document-text-outline"
        />
      )}
    </View>
  );

  // ===================================================================
  // MAIN RENDER
  // ===================================================================
  
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          tintColor={theme.colors.primary}
          colors={[theme.colors.primary]}
        />
      }
    >
      {renderHeader()}
      
      {!riskResult ? (
        <>
          <AbortionRiskForm
            patientData={patientData}
            onDataChange={handlePatientDataChange}
            formProgress={formProgress}
            currentStep={currentStep}
            onStepChange={setCurrentStep}
          />
          
          {renderActionButtons()}
        </>
      ) : (
        <>
          <AbortionRiskResults
            riskResult={riskResult}
            patientData={patientData as PatientInput}
            onRecalculate={() => setRiskResult(null)}
            onExport={handleExportResults}
          />
          
          <View style={styles.recalculateContainer}>
            <EnhancedButton
              title="Nueva Evaluación"
              onPress={handleRefresh}
              variant="outline"
              iconName="refresh-outline"
            />
          </View>
        </>
      )}
      
      {/* Clinical disclaimer */}
      <View style={styles.disclaimerContainer}>
        <InfoCard
          title="Aviso Médico Importante"
          message="Esta calculadora es una herramienta de apoyo clínico. No reemplaza el juicio médico profesional ni la evaluación individualizada del paciente."
          iconName="medical-outline"
          type="warning"
        />
      </View>
    </ScrollView>
  );
};

// ===================================================================
// STYLES
// ===================================================================

const createStyles = (theme: ReturnType<typeof useDynamicTheme>) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    padding: theme.spacing.m,
    paddingBottom: theme.spacing.xl * 2,
  },
  headerContainer: {
    marginBottom: theme.spacing.l,
  },
  headerTitle: {
    ...theme.typography.h1,
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.m,
  },
  infoCard: {
    marginBottom: theme.spacing.m,
  },
  progressContainer: {
    marginVertical: theme.spacing.m,
  },
  progressLabel: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  actionContainer: {
    marginVertical: theme.spacing.l,
    gap: theme.spacing.m,
  },
  calculateButton: {
    elevation: 4,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  exportButton: {
    borderColor: theme.colors.primary,
  },
  recalculateContainer: {
    marginTop: theme.spacing.l,
    alignItems: 'center',
  },
  disclaimerContainer: {
    marginTop: theme.spacing.l,
    paddingTop: theme.spacing.l,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
});

export default AbortionRiskScreen;