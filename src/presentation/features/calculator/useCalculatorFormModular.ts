// ===================================================================
// 🚀 HOOK PRINCIPAL DEL CALCULADOR DE FERTILIDAD - VERSIÓN MODULAR OPTIMIZADA
// ===================================================================

import { useMemo, useCallback, useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { SubmitHandler } from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 🎯 Imports de la arquitectura modular
import { useFormState } from './hooks/useFormState';
import { useFormValidation } from './hooks/useFormValidation';
import { useCalculations } from './hooks/useCalculations';
import { useFormProgress } from './hooks/useFormProgress';
import { useRangeValidation } from './hooks/useRangeValidation';
import { useBenchmark } from '@/core/utils/performanceBenchmark';
import { useFormCache } from './hooks/useFormCache';

import { CalculationService } from './services/calculationService';
import { ClinicalValidators } from '../../../core/domain/validation/clinicalValidators';
import { 
  getCurrentStep, 
  extractValidationData,
  canProceedWithCalculation 
} from './utils/formHelpers';

import { FormState, ClinicalValidationState } from './types/calculator.types';

/**
 * 🎯 INTERFAZ DEL HOOK PRINCIPAL - SIMPLIFICADA Y MODULAR
 */
export interface UseCalculatorFormReturn {
  // 🔧 API básica del formulario
  control: ReturnType<typeof useFormState>['control'];
  watch: ReturnType<typeof useFormState>['watch'];
  setValue: ReturnType<typeof useFormState>['setValue'];
  getValues: ReturnType<typeof useFormState>['getValues'];
  formState: { errors: ReturnType<typeof useFormState>['formState']['errors'] };
  watchedFields: FormState;
  
  // 🚀 Cálculos automáticos optimizados
  calculatedBmi: number | null;
  calculatedHoma: number | null;
  bmiFormatted: string;
  homaFormatted: string;
  bmiCategory: { category: string; color: string } | null;
  homaCategory: { category: string; color: string } | null;
  
  // 🚀 Progreso optimizado
  progress: {
    completedSections: number;
    totalSections: number;
    progressPercentage: number;
    missingSections: string[];
    isReadyToSubmit: boolean;
  };
  getSectionProgress: (sectionName: string) => number;
  isSectionComplete: (sectionName: string) => boolean;
  
  // Estado y navegación
  isLoading: boolean;
  formProgress: number;
  currentStep: number;
  
  // Función principal
  handleCalculate: () => Promise<void>;
  
  // Validación clínica optimizada
  clinicalValidation: ClinicalValidationState | null;
  getFieldValidation: (fieldName: string) => unknown;
  getClinicalAlerts: () => unknown[];
  getClinicalWarnings: () => unknown[];
  getCompletionScore: () => number;
  canCalculate: boolean;
  
  // 🚀 Funciones de validación optimizada
  validateField: (fieldName: keyof FormState, value: unknown) => unknown;
  isFieldValid: (fieldName: keyof FormState, value: unknown) => boolean;
  
  // 🚀 Métricas de rendimiento
  getPerformanceReport: () => unknown;
  clearPerformanceMetrics: () => void;
  
  // 💾 Cache performance
  getCacheStats: () => unknown;
  
  // Validación de rangos
  getRangeValidation: (fieldName: string) => unknown;
  rangeStats: {
    total: number;
    normal: number;
    warnings: number;
    errors: number;
    hasAnyWarning: boolean;
    hasAnyError: boolean;
    allNormal: boolean;
  };
  
  // 🆕 Gestión de datos
  saveCurrentState: () => boolean;
  clearFormData: () => void;
  exportFormData: () => string;
  importFormData: (jsonData: string) => boolean;
  lastSavedAt: Date | null;
}

const REPORT_KEY_PREFIX = 'fertility_report_';

/**
 * 🚀 HOOK PRINCIPAL MODULAR OPTIMIZADO
 * 
 * Características mejoradas:
 * - Arquitectura modular con responsabilidades separadas
 * - Hooks especializados para cada funcionalidad
 * - Servicios dedicados para cálculo y almacenamiento
 * - Optimización de rendimiento con memoización
 * - Sistema de métricas y benchmarking
 * - Persistencia automática de datos
 * 
 * @returns Interfaz completa y optimizada del formulario
 */
export const useCalculatorForm = (): UseCalculatorFormReturn => {
  const router = useRouter();
  
  // 🎯 HOOKS ESPECIALIZADOS MODULARES
  const formState = useFormState();
  const { validateField, isFieldValid } = useFormValidation();
  const { measureTime, measureTimeAsync, getReport, clearMetrics } = useBenchmark();
  const cache = useFormCache();
  const { 
    calculateBMI, 
    calculateHOMA, 
    formatBMI, 
    formatHOMA, 
    getBMICategory, 
    getHOMACategory 
  } = useCalculations();
  const { getRangeValidation, stats: rangeStats } = useRangeValidation(formState.watchedFields);
  
  // 🔄 ESTADO LOCAL SIMPLIFICADO
  const [clinicalValidation, setClinicalValidation] = useState<ClinicalValidationState | null>(null);
  
  // 🔧 HELPERS DE CONVERSIÓN DE TIPOS
  const safeParseNumber = (value: string | number | undefined): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };
  
  // ⚡ CÁLCULOS OPTIMIZADOS CON HOOKS ESPECIALIZADOS, BENCHMARKING Y CACHE
  const calculatedBmi = useMemo(() => 
    measureTime('calculate_bmi', () => {
      const height = safeParseNumber(formState.watchedFields.height);
      const weight = safeParseNumber(formState.watchedFields.weight);
      
      if (!height || !weight || height <= 0 || weight <= 0) return null;
      
      // Intentar obtener del cache
      const cached = cache.getBmi(height, weight);
      if (cached !== null) return cached;
      
      // Calcular y guardar en cache
      const bmi = calculateBMI(height, weight);
      if (bmi !== null) {
        cache.setBmi(height, weight, bmi);
      }
      return bmi;
    }), 
    [formState.watchedFields.weight, formState.watchedFields.height, calculateBMI, cache]
  );

  const calculatedHoma = useMemo(() => 
    measureTime('calculate_homa', () => {
      const insulin = safeParseNumber(formState.watchedFields.insulinValue);
      const glucose = safeParseNumber(formState.watchedFields.glucoseValue);
      
      if (!insulin || !glucose || insulin <= 0 || glucose <= 0) return null;
      
      // Intentar obtener del cache
      const cached = cache.getHoma(insulin, glucose);
      if (cached !== null) return cached;
      
      // Calcular y guardar en cache
      const homa = calculateHOMA(glucose, insulin);
      if (homa !== null) {
        cache.setHoma(insulin, glucose, homa);
      }
      return homa;
    }), 
    [formState.watchedFields.insulinValue, formState.watchedFields.glucoseValue, calculateHOMA, cache]
  );

  // 🚀 PROGRESO OPTIMIZADO CON HOOK ESPECIALIZADO
  const { progress, getSectionProgress, isSectionComplete } = useFormProgress({ 
    formData: formState.watchedFields as unknown as Record<string, unknown>
  });

  // 🎨 FORMATOS Y CATEGORÍAS MEMOIZADAS
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

  // 📊 PROGRESO LEGACY (para compatibilidad)
  const formProgress = useMemo(() => {
    return progress.progressPercentage;
  }, [progress.progressPercentage]);

  const currentStep = useMemo(() => 
    getCurrentStep(formState.watchedFields), 
    [formState.watchedFields]
  );

  // 🏥 VALIDACIÓN CLÍNICA EN TIEMPO REAL
  useEffect(() => {
    const validateClinicalData = async () => {
      try {
        const currentValues = formState.getValues();
        
        // Solo validar si tenemos datos básicos
        if (!currentValues.age || !currentValues.height || !currentValues.weight) {
          setClinicalValidation(null);
          return;
        }
            // 🔍 Ejecutar validación clínica optimizada con benchmarking
      const validation = measureTime('clinical_validation', () => {
        const validationData = extractValidationData(currentValues);
        return ClinicalValidators.validateCompleteForm(validationData);
      });
        
        // Mapear a nuestro tipo local
        const mappedValidation: ClinicalValidationState = {
          overallValidation: validation.overallValidation,
          fieldValidations: validation.fieldValidations.map(field => ({
            ...field,
            interpretedValue: field.interpretedValue ? {
              category: field.interpretedValue.category || 'Desconocido',
              normalRange: field.interpretedValue.normalRange
            } : undefined
          })),
          completionScore: validation.completionScore,
          canProceedWithCalculation: validation.canProceedWithCalculation
        };
        
        setClinicalValidation(mappedValidation);
      } catch (error) {
        console.error('Error en validación clínica:', error);
        setClinicalValidation(null);
      }
    };

    validateClinicalData();
  }, [
    formState.watchedFields.age,
    formState.watchedFields.height,
    formState.watchedFields.weight,
    formState.watchedFields.infertilityDuration,
    formState.watchedFields.glucoseValue,
    formState.watchedFields.insulinValue,
    formState.watchedFields.cycleLength,
    formState.watchedFields.amhValue
  ]);

  // 🚀 FUNCIÓN DE CÁLCULO OPTIMIZADA CON SERVICIO Y BENCHMARKING
  const handleCalculate: SubmitHandler<FormState> = async (data) => {
    await measureTimeAsync('complete_calculation', async () => {
      try {
        formState.setLoadingState(true);
        
        console.log('🚀 Iniciando cálculo optimizado con datos:', data);
        
        // 🔍 Usar servicio de cálculo
        const result = await CalculationService.executeCalculation(
          data, 
          calculatedBmi, 
          calculatedHoma
        );
        
        if (!result.success) {
          throw new Error(result.error || 'Error en el cálculo');
        }
        
        console.log('✅ Cálculo completado exitosamente');
        console.log(`⏱️ Tiempo de ejecución: ${result.performance?.executionTime.toFixed(1)}ms`);
        
        // Guardar reporte y navegar
        const reportId = `${REPORT_KEY_PREFIX}${Date.now()}`;
        await AsyncStorage.setItem(reportId, JSON.stringify(result.data));
        
        router.push({
          pathname: '/results' as never,
        params: { reportId } as never
      });
      
    } catch (error) {
      console.error('❌ Error en el cálculo:', error);
      // Aquí podrías mostrar un toast o modal de error
    } finally {
      formState.setLoadingState(false);
    }
    }, 'calculation');
  };

  // 📊 FUNCIONES DE INFORMACIÓN OPTIMIZADAS
  const getFieldValidation = useCallback((fieldName: string) => 
    clinicalValidation?.fieldValidations.find(fv => fv.fieldName === fieldName),
    [clinicalValidation]
  );

  const getClinicalAlerts = useCallback(() => 
    clinicalValidation?.overallValidation.criticalAlerts || [],
    [clinicalValidation]
  );

  const getClinicalWarnings = useCallback(() => 
    clinicalValidation?.overallValidation.warnings || [],
    [clinicalValidation]
  );

  const getCompletionScore = useCallback(() => 
    clinicalValidation?.completionScore || 0,
    [clinicalValidation]
  );

  // ✅ LÓGICA DE HABILITACIÓN DEL CÁLCULO
  const canCalculate = useMemo(() => 
    canProceedWithCalculation(formState.watchedFields) && calculatedBmi !== null,
    [formState.watchedFields, calculatedBmi]
  );

  // 🎯 RETORNO DEL HOOK OPTIMIZADO Y MODULAR
  return {
    // API básica del formulario
    control: formState.control,
    watch: formState.watch,
    setValue: formState.setValue,
    getValues: formState.getValues,
    formState: { errors: formState.formState.errors },
    watchedFields: formState.watchedFields,
    
    // Cálculos automáticos optimizados
    calculatedBmi,
    calculatedHoma,
    bmiFormatted,
    homaFormatted,
    bmiCategory,
    homaCategory,
    
    // Progreso optimizado
    progress,
    getSectionProgress,
    isSectionComplete,
    
    // Estado y navegación
    isLoading: formState.isLoading,
    formProgress,
    currentStep,
    
    // Función principal
    handleCalculate: formState.handleSubmit(handleCalculate),
    
    // Validación clínica
    clinicalValidation,
    getFieldValidation,
    getClinicalAlerts,
    getClinicalWarnings,
    getCompletionScore,
    canCalculate,
    
    // Funciones de validación optimizada
    validateField,
    isFieldValid,
    
    // Métricas de rendimiento
    getPerformanceReport: getReport,
    clearPerformanceMetrics: clearMetrics,
    
    // Cache performance
    getCacheStats: () => cache.getStats(),
    
    // Validación de rangos
    getRangeValidation,
    rangeStats,
    
    // Gestión de datos
    saveCurrentState: formState.saveCurrentState,
    clearFormData: formState.clearFormData,
    exportFormData: formState.exportFormData,
    importFormData: formState.importFormData,
    lastSavedAt: formState.lastSavedAt
  };
};
