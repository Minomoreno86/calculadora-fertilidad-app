import { AdenomyosisType, HsgResult, MyomaType, OtbMethod, PolypType } from '@/core/domain/models';
import { calculateProbability } from '@/core/domain/services/calculationEngine';
import { zodResolver } from '@hookform/resolvers/zod';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { mapFormStateToUserInput } from './utils/dataMapper';
import type { FormData } from './utils/validationSchemas';
import { formSchema } from './utils/validationSchemas';

// 🚀 HOOKS OPTIMIZADOS PARA PERFORMANCE (CONSOLIDADOS)
import { useBenchmark } from '@/core/utils/performanceBenchmark';
import { useCalculations } from './hooks/useCalculations';
import { useFormProgress } from './hooks/useFormProgress';
import { useStableFormValidation } from './hooks/useStableFormValidation';
import { useStableWatchedFields } from './hooks/useStableWatchedFields';

// 🧠⚡ AI MEDICAL AGENT V12.0 INTEGRATION WITH UNIFIED PARALLEL ENGINE
import { calculateFertilityWithAI } from '@/core/calculatorIntegration';

export type FormState = FormData;

const REPORT_KEY_PREFIX = 'fertility_report_';

// Tipo de retorno del hook para mejor tipificación
export interface UseCalculatorFormOptimizedReturn {
  // API básica del formulario
  control: ReturnType<typeof useForm<FormState>>['control'];
  watch: ReturnType<typeof useForm<FormState>>['watch'];
  setValue: ReturnType<typeof useForm<FormState>>['setValue'];
  getValues: ReturnType<typeof useForm<FormState>>['getValues'];
  formState: { errors: ReturnType<typeof useForm<FormState>>['formState']['errors'] };
  watchedFields: FormState;
  
  // Cálculos optimizados
  calculatedBmi: number | null;
  calculatedHoma: number | null;
  bmiFormatted: string;
  homaFormatted: string;
  bmiCategory: { category: string; color: string } | null;
  homaCategory: { category: string; color: string } | null;
  
  // Progreso optimizado
  progress: {
    completedSections: number;
    totalSections: number;
    progressPercentage: number;
    missingSections: string[];
    isReadyToSubmit: boolean;
  };
  completionPercentage: number;
  currentStep: number;
  
  // Validación optimizada
  clinicalValidation: unknown;
  getRangeValidation: (fieldName: string) => unknown;
  
  // Funciones principales
  handleCalculate: () => Promise<string | undefined>;
  isLoading: boolean;
  
  // Métricas de rendimiento
  getPerformanceReport: () => unknown;
  clearPerformanceMetrics: () => void;
}

/**
 * Hook optimizado para el formulario de calculadora de fertilidad
 * 
 * OPTIMIZACIONES IMPLEMENTADAS:
 * - Debounce en validación clínica (500ms)
 * - WatchedFields estables con throttling (100ms)
 * - Cálculos memoizados
 * - Referencias estables para evitar re-renders
 * 
 * @returns Objeto con todas las funciones y estados del formulario optimizados
 */
export const useCalculatorFormOptimized = (): UseCalculatorFormOptimizedReturn => {
  
  // 🚀 Hooks especializados consolidados  
  const { getReport, clearMetrics } = useBenchmark();
  const { calculateBMI, calculateHOMA, formatBMI, formatHOMA, getBMICategory, getHOMACategory } = useCalculations();
  
  // 🚀 Estado de carga
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  // 🚀 Valores iniciales optimizados
  const initialFormValues: FormState = {
    // Demografia básica - STRINGS para inputs numéricos
    age: "30",
    weight: "65", 
    height: "165",
    
    // Ginecología básica - STRINGS para inputs numéricos
    cycleLength: "28",
    infertilityDuration: "1",
    hasPcos: false,
    endometriosisStage: 0,
    myomaType: MyomaType.None,
    adenomyosisType: AdenomyosisType.None,
    polypType: PolypType.None,
    hsgResult: HsgResult.Unknown,
    hasPelvicSurgery: false,
    numberOfPelvicSurgeries: 0,
    hasOtb: false,
    otbMethod: OtbMethod.Unknown,
    hasOtherInfertilityFactors: false,
    desireForMultiplePregnancies: false,
    
    // Laboratorio básico - STRINGS para inputs numéricos
    tpoAbPositive: false,
    insulinValue: "0",
    glucoseValue: "0",
    amhValue: "",
    tshValue: "",
    prolactinValue: "",
    
    // Factor masculino completo - STRINGS vacíos para campos opcionales
    spermConcentration: "",
    spermProgressiveMotility: "",
    spermNormalMorphology: "",
    semenVolume: "",
    
    // Ginecología avanzada
    cycleRegularity: 'regular' as const,
  };

  // 🚀 Formulario con React Hook Form
  const { control, watch, setValue, getValues, formState: { errors } } = useForm<FormState>({
    resolver: zodResolver(formSchema) as never,
    defaultValues: initialFormValues,
  });

  // 🚀 OPTIMIZACIÓN CRÍTICA: WatchedFields estables
  const {
    stableWatchedFields,
    isFieldValid: isStableFieldValid,
    completionPercentage
  } = useStableWatchedFields(watch, {
    throttleTime: 100, // 100ms throttle para evitar actualizaciones excesivas
  });

  // 🚀 OPTIMIZACIÓN CRÍTICA: Validación consolidada con rangos
  const {
    clinicalValidation,
    triggerValidation,
    getRangeValidation
  } = useStableFormValidation({
    debounceTime: 500, // 500ms debounce para evitar validaciones excesivas
    enableRealTimeValidation: true,
    requiredFields: ['age', 'height', 'weight'],
    formData: stableWatchedFields  // ✨ CONSOLIDADO: Para validaciones de rangos
  });

  // 🚀 Función auxiliar para validar campos (OPTIMIZADA)
  const isFieldValidValue = (fieldName: string): boolean => {
    return isStableFieldValid(fieldName as keyof FormState);
  };

  // 🚀 Paso actual basado en secciones completadas (OPTIMIZADO)
  const currentStep = useMemo(() => {
    const demographicsFields = ['age', 'weight', 'height'];
    const gynecologyFields = ['cycleLength', 'infertilityDuration', 'hasPcos', 'cycleRegularity'];
    const labFields = ['insulinValue', 'glucoseValue', 'amhValue', 'tshValue'];
    const maleFactorFields = ['spermConcentration', 'spermProgressiveMotility'];

    const isDemographicsComplete = demographicsFields.every(isFieldValidValue);
    const isGynecologyComplete = gynecologyFields.some(isFieldValidValue);
    const isLabComplete = labFields.some(isFieldValidValue);
    const isMaleFactorComplete = maleFactorFields.some(isFieldValidValue);

    if (!isDemographicsComplete) return 0;
    if (!isGynecologyComplete) return 1;
    if (!isLabComplete) return 2;
    if (!isMaleFactorComplete) return 3;
    return 3;
  }, [stableWatchedFields]);

  // 🚀 Cálculos optimizados con memoización
  const calculatedBmi = useMemo(() => 
    calculateBMI(stableWatchedFields.height as string | number, stableWatchedFields.weight as string | number), 
    [stableWatchedFields.weight, stableWatchedFields.height, calculateBMI]
  );

  const calculatedHoma = useMemo(() => 
    calculateHOMA(stableWatchedFields.insulinValue as string | number, stableWatchedFields.glucoseValue as string | number), 
    [stableWatchedFields.insulinValue, stableWatchedFields.glucoseValue, calculateHOMA]
  );

  // 🚀 Hook de progreso optimizado
  const progressData = useFormProgress({ 
    formData: stableWatchedFields 
  });

  // 🚀 Adaptar al formato esperado por la interfaz
  const progress = useMemo(() => ({
    completedSections: progressData.progress.completedSections,
    totalSections: progressData.progress.totalSections,
    progressPercentage: progressData.progress.progressPercentage,
    missingSections: progressData.progress.missingSections,
    isReadyToSubmit: progressData.progress.isReadyToSubmit
  }), [progressData]);

  // 🚀 Formatos y categorías memoizadas
  const bmiFormatted = useMemo(() => formatBMI(calculatedBmi), [calculatedBmi, formatBMI]);
  const homaFormatted = useMemo(() => formatHOMA(calculatedHoma), [calculatedHoma, formatHOMA]);
  
  const bmiCategory = useMemo(() => 
    calculatedBmi ? getBMICategory(calculatedBmi) : null,
    [calculatedBmi, getBMICategory]
  );
  
  const homaCategory = useMemo(() => 
    calculatedHoma ? getHOMACategory(calculatedHoma) : null,
    [calculatedHoma, getHOMACategory]
  );

  // 🚀 Disparar validación clínica cuando cambien los datos
  useMemo(() => {
    triggerValidation(stableWatchedFields);
  }, [stableWatchedFields, triggerValidation]);

  // 🚀 Función de cálculo principal (ACTUALIZADA V12.0 - UNIFIED PARALLEL ENGINE)
  const handleCalculate = async (): Promise<string | undefined> => {
    try {
      setIsLoading(true);
      console.log('🚀 INICIANDO CÁLCULO CON UNIFIED PARALLEL ENGINE V12.0...');
      
      const data = getValues();
      
      // Verificar datos mínimos requeridos
      if (!data.age || !data.height || !data.weight) {
        console.warn('⚠️ Datos básicos incompletos, pero permitiendo cálculo');
      }
      
      // Mapear datos del formulario
      const userInput = mapFormStateToUserInput(data, calculatedBmi, calculatedHoma);
      console.log('📊 USER INPUT MAPEADO V12.0:', userInput);
      
      // 🚀 NUEVO: Usar UnifiedParallelEngine V12.0 con 8 workers especializados
      console.log('🧠 PROCESANDO CON 8 WORKERS ESPECIALIZADOS...');
      const aiCalculationResult = await calculateFertilityWithAI(userInput);
      console.log('✅ RESULTADO AI COMPLETO V12.0:', aiCalculationResult);
      
      // Preparar reporte mejorado con datos AI
      const enhancedReport = {
        // Mantener compatibilidad con formato anterior
        userInput,
        calculationResult: {
          successProbability: aiCalculationResult.successProbability,
          confidence: aiCalculationResult.confidence,
          factors: {
            age: aiCalculationResult.ageFactorImpact,
            medicalConditions: aiCalculationResult.medicalConditionsImpact,
            lifestyle: aiCalculationResult.lifestyleFactorsImpact,
            maleFactor: aiCalculationResult.maleFactorImpact
          }
        },
        // Nuevos datos AI V12.0
        aiAnalysis: {
          treatmentRecommendations: aiCalculationResult.treatmentRecommendations,
          pathologiesDetected: aiCalculationResult.pathologiesDetected,
          biomarkerStatus: aiCalculationResult.biomarkerStatus,
          riskFactors: aiCalculationResult.riskFactors,
          urgencyLevel: aiCalculationResult.urgencyLevel,
          processingTime: aiCalculationResult.processingTime,
          workersUsed: aiCalculationResult.workersUsed
        },
        recommendations: {
          lifestyle: aiCalculationResult.lifestyleRecommendations,
          medical: aiCalculationResult.medicalRecommendations,
          tests: aiCalculationResult.recommendedTests,
          followUp: aiCalculationResult.followUpSchedule
        },
        metadata: {
          version: 'v12.0',
          timestamp: Date.now(),
          engineUsed: 'UnifiedParallelEngine',
          aiAnalysisUsed: aiCalculationResult.aiAnalysisUsed,
          estimatedTimeToConception: aiCalculationResult.estimatedTimeToConception
        }
      };
      
      // Guardar reporte AI mejorado
      const reportKey = `${REPORT_KEY_PREFIX}${Date.now()}`;
      console.log('🔑 GENERANDO REPORT KEY V12.0:', { 
        reportKey, 
        aiWorkers: aiCalculationResult.workersUsed,
        processingTime: aiCalculationResult.processingTime 
      });
      
      await AsyncStorage.setItem(reportKey, JSON.stringify(enhancedReport));
      console.log('💾 REPORTE AI V12.0 GUARDADO CON KEY:', reportKey);
      
      // Navegación mejorada
      console.log('🧭 NAVEGANDO A RESULTS CON AI REPORT V12.0:', reportKey);
      
      router.push({
        pathname: '/results',
        params: { reportKey }
      });
      
      return reportKey;
    } catch (error) {
      console.error('❌ ERROR DURANTE CÁLCULO AI V12.0:', error);
      
      // Fallback: intentar cálculo básico original
      console.log('🔄 FALLBACK: Intentando cálculo básico...');
      try {
        const data = getValues();
        const userInput = mapFormStateToUserInput(data, calculatedBmi, calculatedHoma);
        const basicReport = calculateProbability(userInput);
        
        const fallbackReport = {
          userInput,
          calculationResult: basicReport,
          metadata: { 
            version: 'v12.0-fallback', 
            timestamp: Date.now(),
            engineUsed: 'BasicCalculation'
          }
        };
        
        const reportKey = `${REPORT_KEY_PREFIX}fallback_${Date.now()}`;
        await AsyncStorage.setItem(reportKey, JSON.stringify(fallbackReport));
        
        router.push({
          pathname: '/results',
          params: { reportKey }
        });
        
        return reportKey;
      } catch (fallbackError) {
        console.error('❌ FALLBACK TAMBIÉN FALLÓ:', fallbackError);
        throw fallbackError;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // API básica del formulario
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
    watchedFields: stableWatchedFields,
    
    // Cálculos automáticos
    calculatedBmi,
    calculatedHoma,
    bmiFormatted,
    homaFormatted,
    bmiCategory,
    homaCategory,
    
    // Progreso optimizado
    progress,
    completionPercentage,
    currentStep,
    
    // Validación consolidada
    clinicalValidation,
    getRangeValidation: (fieldName: string) => {
      // Adaptador para mantener compatibilidad con API anterior
      const fieldValue = (stableWatchedFields as Record<string, unknown>)[fieldName];
      const numericValue = parseFloat(String(fieldValue || '0'));
      if (fieldName === 'age' || fieldName === 'weight' || fieldName === 'height') {
        return getRangeValidation(fieldName, numericValue);
      }
      return { isNormal: true, isWarning: false, isError: false, message: 'Campo no validable', range: { min: 0, max: 0 } };
    },
    
    // Función principal
    handleCalculate,
    isLoading,
    
    // Métricas de rendimiento
    getPerformanceReport: getReport,
    clearPerformanceMetrics: clearMetrics,
  };
};
