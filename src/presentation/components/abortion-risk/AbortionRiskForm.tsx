// ===================================================================
// ABORTION RISK FORM - PATIENT DATA INPUT COMPONENT
// Professional Medical Data Collection Interface
// ===================================================================

import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import Text from '@/presentation/components/common/Text';
import { InfoCard } from '@/presentation/components/common/InfoCard';
import { OptimizedNumericInput } from '@/presentation/components/common/OptimizedNumericInput';
import { ControlledSwitch } from '@/presentation/components/common/ControlledSwitch';
import { ClinicalAlert } from '@/presentation/components/common/ClinicalAlert';
import { useDynamicTheme } from '@/hooks/useDynamicTheme';

import { 
  PatientInput,
  ThrombophiliaType,
  UterineAnomalyType,
  AutoimmuneCondition,
  SmokingStatus,
  AlcoholConsumption,
  ExerciseLevel
} from '@/core/models/AbortionRiskModels';

interface FormProgress {
  demographics: boolean;
  obstetricHistory: boolean;
  medicalHistory: boolean;
  lifestyle: boolean;
}

interface Props {
  patientData: Partial<PatientInput>;
  onDataChange: (data: Partial<PatientInput>) => void;
  formProgress: FormProgress;
  currentStep: number;
  onStepChange: (step: number) => void;
}

interface FormData {
  // Demographics
  age: string;
  weight: string;
  height: string;
  
  // Obstetric History
  totalPregnancies: string;
  previousAbortions: string;
  previousLivebirths: string;
  consecutiveLosses: string;
  
  // Medical Conditions
  thrombophilias: ThrombophiliaType[];
  uterineAnomalies: UterineAnomalyType[];
  antiphospholipid: boolean;
  diabetes: boolean;
  thyroidDisorder: boolean;
  autoimmune: AutoimmuneCondition[];
  chronicKidneyDisease: boolean;
  hypertension: boolean;
  
  // Lifestyle
  smoking: SmokingStatus;
  alcohol: AlcoholConsumption;
  exercise: ExerciseLevel;
  stressLevel: string;
  sleepHours: string;
  
  // Current Pregnancy
  isCurrentlyPregnant: boolean;
  currentGestationalAge: string;
}

const FORM_STEPS = [
  { title: 'Demografía', icon: 'person-outline' },
  { title: 'Historia Obstétrica', icon: 'medical-outline' },
  { title: 'Historia Médica', icon: 'heart-outline' },
  { title: 'Estilo de Vida', icon: 'fitness-outline' }
];

export const AbortionRiskForm: React.FC<Props> = ({
  patientData,
  onDataChange,
  formProgress,
  currentStep,
  onStepChange
}) => {
  const theme = useDynamicTheme();
  const styles = createStyles(theme);
  
  const { control, watch, setValue, trigger } = useForm<FormData>({
    defaultValues: {
      age: patientData.age?.toString() || '',
      weight: patientData.weight?.toString() || '',
      height: patientData.height?.toString() || '',
      totalPregnancies: patientData.obstetricHistory?.totalPregnancies?.toString() || '',
      previousAbortions: patientData.obstetricHistory?.previousAbortions?.toString() || '',
      previousLivebirths: patientData.obstetricHistory?.previousLivebirths?.toString() || '',
      consecutiveLosses: patientData.obstetricHistory?.consecutiveLosses?.toString() || '',
      thrombophilias: patientData.medicalConditions?.thrombophilias || [],
      uterineAnomalies: patientData.medicalConditions?.uterineAnomalies || [],
      antiphospholipid: patientData.medicalConditions?.antiphospholipid || false,
      diabetes: patientData.medicalConditions?.diabetes || false,
      thyroidDisorder: patientData.medicalConditions?.thyroidDisorder || false,
      autoimmune: patientData.medicalConditions?.autoimmune || [],
      chronicKidneyDisease: patientData.medicalConditions?.chronicKidneyDisease || false,
      hypertension: patientData.medicalConditions?.hypertension || false,
      smoking: patientData.lifestyle?.smoking || SmokingStatus.NEVER,
      alcohol: patientData.lifestyle?.alcohol || AlcoholConsumption.NONE,
      exercise: patientData.lifestyle?.exercise || ExerciseLevel.MODERATE,
      stressLevel: patientData.lifestyle?.stress_level?.toString() || '',
      sleepHours: patientData.lifestyle?.sleep_hours?.toString() || '',
      isCurrentlyPregnant: patientData.isCurrentlyPregnant || false,
      currentGestationalAge: patientData.currentGestationalAge?.toString() || ''
    },
    mode: 'onChange'
  });
  
  const watchedValues = watch();
  const [clinicalAlerts, setClinicalAlerts] = useState<string[]>([]);
  
  // Calculate BMI
  const calculatedBMI = useMemo(() => {
    const weight = parseFloat(watchedValues.weight);
    const height = parseFloat(watchedValues.height);
    if (weight > 0 && height > 0) {
      const heightInMeters = height / 100;
      return weight / (heightInMeters * heightInMeters);
    }
    return null;
  }, [watchedValues.weight, watchedValues.height]);
  
  // Update parent component when form data changes
  React.useEffect(() => {
    const formattedData: Partial<PatientInput> = {
      age: parseInt(watchedValues.age) || undefined,
      weight: parseFloat(watchedValues.weight) || undefined,
      height: parseFloat(watchedValues.height) || undefined,
      obstetricHistory: {
        totalPregnancies: parseInt(watchedValues.totalPregnancies) || 0,
        previousAbortions: parseInt(watchedValues.previousAbortions) || 0,
        previousLivebirths: parseInt(watchedValues.previousLivebirths) || 0,
        consecutiveLosses: parseInt(watchedValues.consecutiveLosses) || undefined
      },
      medicalConditions: {
        thrombophilias: watchedValues.thrombophilias.length > 0 ? watchedValues.thrombophilias : undefined,
        uterineAnomalies: watchedValues.uterineAnomalies.length > 0 ? watchedValues.uterineAnomalies : undefined,
        antiphospholipid: watchedValues.antiphospholipid || undefined,
        diabetes: watchedValues.diabetes || undefined,
        thyroidDisorder: watchedValues.thyroidDisorder || undefined,
        autoimmune: watchedValues.autoimmune.length > 0 ? watchedValues.autoimmune : undefined,
        chronicKidneyDisease: watchedValues.chronicKidneyDisease || undefined,
        hypertension: watchedValues.hypertension || undefined
      },
      lifestyle: {
        smoking: watchedValues.smoking,
        BMI: calculatedBMI || undefined,
        alcohol: watchedValues.alcohol,
        exercise: watchedValues.exercise,
        stress_level: parseInt(watchedValues.stressLevel) || undefined,
        sleep_hours: parseFloat(watchedValues.sleepHours) || undefined
      },
      isCurrentlyPregnant: watchedValues.isCurrentlyPregnant || undefined,
      currentGestationalAge: parseInt(watchedValues.currentGestationalAge) || undefined
    };
    
    onDataChange(formattedData);
  }, [watchedValues, calculatedBMI, onDataChange]);
  
  // Clinical alerts monitoring
  React.useEffect(() => {
    const alerts: string[] = [];
    const age = parseInt(watchedValues.age);
    const previousAbortions = parseInt(watchedValues.previousAbortions);
    
    if (age >= 35) {
      alerts.push('Edad materna avanzada detectada - considerar monitoreo especializado');
    }
    
    if (previousAbortions >= 2) {
      alerts.push('Historia de pérdida recurrente - evaluación especializada recomendada');
    }
    
    if (watchedValues.antiphospholipid) {
      alerts.push('Síndrome antifosfolípido - anticoagulación profiláctica puede ser indicada');
    }
    
    if (calculatedBMI && calculatedBMI >= 35) {
      alerts.push('Obesidad severa (BMI ≥35) - factor de riesgo significativo');
    }
    
    if (watchedValues.smoking !== SmokingStatus.NEVER && watchedValues.smoking !== SmokingStatus.FORMER) {
      alerts.push('Tabaquismo activo - cesación inmediata recomendada');
    }
    
    setClinicalAlerts(alerts);
  }, [watchedValues, calculatedBMI]);

  // ===================================================================
  // RENDER STEP CONTENT
  // ===================================================================
  
  const renderDemographicsStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Información Demográfica</Text>
      
      <Controller
        control={control}
        name="age"
        rules={{ 
          required: 'Edad requerida',
          min: { value: 18, message: 'Edad mínima 18 años' },
          max: { value: 50, message: 'Edad máxima 50 años' }
        }}
        render={({ field, fieldState }) => (
          <OptimizedNumericInput
            label="Edad (años) *"
            value={field.value}
            onChangeText={field.onChange}
            placeholder="Ej: 32"
            error={fieldState.error?.message}
            style={styles.input}
            keyboardType="numeric"
            maxLength={2}
          />
        )}
      />
      
      <Controller
        control={control}
        name="weight"
        render={({ field, fieldState }) => (
          <OptimizedNumericInput
            label="Peso (kg)"
            value={field.value}
            onChangeText={field.onChange}
            placeholder="Ej: 65.5"
            error={fieldState.error?.message}
            style={styles.input}
            keyboardType="decimal-pad"
            maxLength={5}
          />
        )}
      />
      
      <Controller
        control={control}
        name="height"
        render={({ field, fieldState }) => (
          <OptimizedNumericInput
            label="Altura (cm)"
            value={field.value}
            onChangeText={field.onChange}
            placeholder="Ej: 165"
            error={fieldState.error?.message}
            style={styles.input}
            keyboardType="numeric"
            maxLength={3}
          />
        )}
      />
      
      {calculatedBMI && (
        <View style={styles.bmiContainer}>
          <Text style={styles.bmiLabel}>BMI Calculado:</Text>
          <Text style={styles.bmiValue}>{calculatedBMI.toFixed(1)} kg/m²</Text>
          <Text style={styles.bmiCategory}>
            {getBMICategory(calculatedBMI)}
          </Text>
        </View>
      )}
    </View>
  );
  
  const renderObstetricHistoryStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Historia Obstétrica</Text>
      
      <InfoCard
        title="Información Importante"
        message="Incluya todas las gestaciones, incluyendo abortos espontáneos, inducidos y embarazos ectópicos."
        iconName="information-circle-outline"
        type="info"
      />
      
      <Controller
        control={control}
        name="totalPregnancies"
        rules={{ 
          required: 'Total de embarazos requerido',
          min: { value: 0, message: 'Valor no puede ser negativo' }
        }}
        render={({ field, fieldState }) => (
          <OptimizedNumericInput
            label="Total de Embarazos *"
            value={field.value}
            onChangeText={field.onChange}
            placeholder="Ej: 3"
            error={fieldState.error?.message}
            style={styles.input}
            keyboardType="numeric"
            maxLength={2}
          />
        )}
      />
      
      <Controller
        control={control}
        name="previousAbortions"
        rules={{ 
          required: 'Abortos previos requerido',
          min: { value: 0, message: 'Valor no puede ser negativo' }
        }}
        render={({ field, fieldState }) => (
          <OptimizedNumericInput
            label="Abortos Previos *"
            value={field.value}
            onChangeText={field.onChange}
            placeholder="Ej: 1"
            error={fieldState.error?.message}
            style={styles.input}
            keyboardType="numeric"
            maxLength={2}
          />
        )}
      />
      
      <Controller
        control={control}
        name="previousLivebirths"
        rules={{ 
          required: 'Nacidos vivos previos requerido',
          min: { value: 0, message: 'Valor no puede ser negativo' }
        }}
        render={({ field, fieldState }) => (
          <OptimizedNumericInput
            label="Nacidos Vivos Previos *"
            value={field.value}
            onChangeText={field.onChange}
            placeholder="Ej: 2"
            error={fieldState.error?.message}
            style={styles.input}
            keyboardType="numeric"
            maxLength={2}
          />
        )}
      />
      
      <Controller
        control={control}
        name="consecutiveLosses"
        render={({ field, fieldState }) => (
          <OptimizedNumericInput
            label="Pérdidas Consecutivas"
            value={field.value}
            onChangeText={field.onChange}
            placeholder="Ej: 2"
            error={fieldState.error?.message}
            style={styles.input}
            keyboardType="numeric"
            maxLength={2}
          />
        )}
      />
    </View>
  );
  
  const renderMedicalHistoryStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Historia Médica</Text>
      
      {/* Simplified Thrombophilias selection */}
      <Text style={styles.sectionTitle}>Trombofilias</Text>
      <Controller
        control={control}
        name="antiphospholipid"
        render={({ field }) => (
          <ControlledSwitch
            label="Factor V Leiden"
            value={field.value}
            onValueChange={field.onChange}
            style={styles.switch}
          />
        )}
      />
      
      {/* Medical Conditions Switches */}
      <Text style={styles.sectionTitle}>Condiciones Médicas</Text>
      
      <Controller
        control={control}
        name="antiphospholipid"
        render={({ field }) => (
          <ControlledSwitch
            label="Síndrome Antifosfolípido"
            value={field.value}
            onValueChange={field.onChange}
            style={styles.switch}
          />
        )}
      />
      
      <Controller
        control={control}
        name="diabetes"
        render={({ field }) => (
          <ControlledSwitch
            label="Diabetes Mellitus"
            value={field.value}
            onValueChange={field.onChange}
            style={styles.switch}
          />
        )}
      />
      
      <Controller
        control={control}
        name="thyroidDisorder"
        render={({ field }) => (
          <ControlledSwitch
            label="Trastorno Tiroideo"
            value={field.value}
            onValueChange={field.onChange}
            style={styles.switch}
          />
        )}
      />
      
      <Controller
        control={control}
        name="chronicKidneyDisease"
        render={({ field }) => (
          <ControlledSwitch
            label="Enfermedad Renal Crónica"
            value={field.value}
            onValueChange={field.onChange}
            style={styles.switch}
          />
        )}
      />
      
      <Controller
        control={control}
        name="hypertension"
        render={({ field }) => (
          <ControlledSwitch
            label="Hipertensión Arterial"
            value={field.value}
            onValueChange={field.onChange}
            style={styles.switch}
          />
        )}
      />
    </View>
  );
  
  const renderLifestyleStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Estilo de Vida</Text>
      
      {/* Simplified Lifestyle selection using switches */}
      
      <Text style={styles.sectionTitle}>Estilo de Vida</Text>
      
      <Controller
        control={control}
        name="smoking"
        render={({ field }) => (
          <View>
            <Text style={styles.fieldLabel}>Estado de Tabaquismo *</Text>
            {/* Use switches for simplified selection */}
            <ControlledSwitch
              label="Actualmente fumo"
              value={field.value === SmokingStatus.CURRENT_MODERATE}
              onValueChange={(value) => 
                field.onChange(value ? SmokingStatus.CURRENT_MODERATE : SmokingStatus.NEVER)
              }
              style={styles.switch}
            />
          </View>
        )}
      />
      
      <Controller
        control={control}
        name="alcohol"
        render={({ field }) => (
          <ControlledSwitch
            label="Consumo Regular de Alcohol"
            value={field.value === AlcoholConsumption.MODERATE}
            onValueChange={(value) => 
              field.onChange(value ? AlcoholConsumption.MODERATE : AlcoholConsumption.NONE)
            }
            style={styles.switch}
          />
        )}
      />
      
      <Controller
        control={control}
        name="stressLevel"
        render={({ field, fieldState }) => (
          <OptimizedNumericInput
            label="Nivel de Estrés (1-10)"
            value={field.value}
            onChangeText={field.onChange}
            placeholder="Ej: 5"
            error={fieldState.error?.message}
            style={styles.input}
            keyboardType="numeric"
            maxLength={2}
          />
        )}
      />
      
      <Controller
        control={control}
        name="sleepHours"
        render={({ field, fieldState }) => (
          <OptimizedNumericInput
            label="Horas de Sueño Promedio"
            value={field.value}
            onChangeText={field.onChange}
            placeholder="Ej: 7.5"
            error={fieldState.error?.message}
            style={styles.input}
            keyboardType="decimal-pad"
            maxLength={4}
          />
        )}
      />
      
      {/* Current Pregnancy Section */}
      <Text style={styles.sectionTitle}>Embarazo Actual</Text>
      
      <Controller
        control={control}
        name="isCurrentlyPregnant"
        render={({ field }) => (
          <ControlledSwitch
            label="¿Actualmente embarazada?"
            value={field.value}
            onValueChange={field.onChange}
            style={styles.switch}
          />
        )}
      />
      
      {watchedValues.isCurrentlyPregnant && (
        <Controller
          control={control}
          name="currentGestationalAge"
          render={({ field, fieldState }) => (
            <OptimizedNumericInput
              label="Edad Gestacional Actual (semanas)"
              value={field.value}
              onChangeText={field.onChange}
              placeholder="Ej: 12"
              error={fieldState.error?.message}
              style={styles.input}
              keyboardType="numeric"
              maxLength={2}
            />
          )}
        />
      )}
    </View>
  );

  // ===================================================================
  // MAIN RENDER
  // ===================================================================
  
  return (
    <View style={styles.container}>
      {/* Simple Progress Indicator */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressTitle}>
          Paso {currentStep + 1} de {FORM_STEPS.length}: {FORM_STEPS[currentStep].title}
        </Text>
      </View>
      
      {/* Clinical Alerts */}
      {clinicalAlerts.length > 0 && (
        <View style={styles.alertsContainer}>
          {clinicalAlerts.map((alert, index) => (
            <ClinicalAlert
              key={index}
              message={alert}
              type="warning"
              style={styles.alert}
            />
          ))}
        </View>
      )}
      
      {/* Step Content */}
      <View style={styles.stepContent}>
        {currentStep === 0 && renderDemographicsStep()}
        {currentStep === 1 && renderObstetricHistoryStep()}
        {currentStep === 2 && renderMedicalHistoryStep()}
        {currentStep === 3 && renderLifestyleStep()}
      </View>
      
      {/* Navigation Buttons */}
      <View style={styles.navigationContainer}>
        {currentStep > 0 && (
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => onStepChange(currentStep - 1)}
          >
            <Text style={styles.navButtonText}>Anterior</Text>
          </TouchableOpacity>
        )}
        
        {currentStep < FORM_STEPS.length - 1 && (
          <TouchableOpacity
            style={[styles.navButton, styles.nextButton]}
            onPress={() => onStepChange(currentStep + 1)}
          >
            <Text style={[styles.navButtonText, styles.nextButtonText]}>Siguiente</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// ===================================================================
// HELPER FUNCTIONS
// ===================================================================

const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return 'Bajo peso';
  if (bmi < 25) return 'Peso normal';
  if (bmi < 30) return 'Sobrepeso';
  if (bmi < 35) return 'Obesidad grado I';
  if (bmi < 40) return 'Obesidad grado II';
  return 'Obesidad grado III (mórbida)';
};

// ===================================================================
// STYLES
// ===================================================================

const createStyles = (theme: ReturnType<typeof useDynamicTheme>) => StyleSheet.create({
  container: {
    flex: 1,
  },
  progressContainer: {
    padding: theme.spacing.m,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.m,
    marginBottom: theme.spacing.m,
    alignItems: 'center',
  },
  progressTitle: {
    ...theme.typography.h3,
    color: theme.colors.primary,
  },
  alertsContainer: {
    marginBottom: theme.spacing.m,
  },
  alert: {
    marginBottom: theme.spacing.s,
  },
  stepContent: {
    flex: 1,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.m,
    gap: theme.spacing.m,
  },
  navButton: {
    flex: 1,
    paddingVertical: theme.spacing.m,
    backgroundColor: theme.colors.border,
    borderRadius: theme.borderRadius.m,
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: theme.colors.primary,
  },
  navButtonText: {
    ...theme.typography.button,
    color: theme.colors.textPrimary,
  },
  nextButtonText: {
    color: theme.colors.textPrimary,
  },
  stepContainer: {
    padding: theme.spacing.m,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.m,
    marginBottom: theme.spacing.m,
  },
  stepTitle: {
    ...theme.typography.h2,
    color: theme.colors.primary,
    marginBottom: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingBottom: theme.spacing.s,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.l,
    marginBottom: theme.spacing.m,
  },
  infoCard: {
    marginBottom: theme.spacing.m,
  },
  input: {
    marginBottom: theme.spacing.m,
  },
  selector: {
    marginBottom: theme.spacing.m,
  },
  switch: {
    marginBottom: theme.spacing.m,
  },
  bmiContainer: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.s,
    marginTop: theme.spacing.m,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  bmiLabel: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  bmiValue: {
    ...theme.typography.h3,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  fieldLabel: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.s,
    fontWeight: '500',
  },
});