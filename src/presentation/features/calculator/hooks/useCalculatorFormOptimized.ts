// ===================================================================
// 🚀 FASE 2C: HOOK PRINCIPAL OPTIMIZADO CON SEPARACIÓN DE RESPONSABILIDADES
// ===================================================================

import { useMemo, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'expo-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { calculateProbability } from '@/core/domain/services/calculationEngine';
import { formSchema } from '../utils/validationSchemas';
import { mapFormStateToUserInput } from '../utils/dataMapper';
import { ClinicalValidators, ValidationResult, FieldValidationResult } from '@/core/domain/validation/clinicalValidators';
import type { ValidationMessage } from '@/core/domain/validation/validationMessages';
// 🚀 FASE 2C: Hooks especializados
import { useFormValidation } from './useFormValidation';
import { useCalculations } from './useCalculations';
import { useFormProgress } from './useFormProgress';
import { useBenchmark } from '@/core/utils/performanceBenchmark';

export type FormState = z.infer<typeof formSchema>;

interface UseCalculatorFormOptimizedReturn {
  // API del formulario
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
  getSectionProgress: (sectionName: string) => number;
  isSectionComplete: (sectionName: string) => boolean;
  
  // Validación optimizada
  clinicalValidation: {
    overallValidation: ValidationResult;
    fieldValidations: FieldValidationResult[];
    completionScore: number;
    canProceedWithCalculation: boolean;
  } | null;
  validateField: (fieldName: keyof FormState, value: unknown) => ValidationResult;
  isFieldValid: (fieldName: keyof FormState, value: unknown) => boolean;
  
  // Estado y acciones
  isLoading: boolean;
  handleCalculate: () => Promise<void>;
  
  // Métricas de rendimiento
  getPerformanceReport: () => any;
  clearPerformanceMetrics: () => void;
}

export const useCalculatorFormOptimized = (): UseCalculatorFormOptimizedReturn => {
  // 🚀 FASE 2C: Hooks especializados
  const { measureTime, measureTimeAsync, getReport, clearMetrics, trackRender } = useBenchmark();
  const { validateField, validateForm, isFieldValid } = useFormValidation();
  const { calculateBMI, calculateHOMA, formatBMI, formatHOMA, getBMICategory, getHOMACategory } = useCalculations();
  
  // Estado local
  const [isLoading, setIsLoading] = useState(false);
  const [clinicalValidation, setClinicalValidation] = useState<{
    overallValidation: ValidationResult;
    fieldValidations: FieldValidationResult[];
    completionScore: number;
    canProceedWithCalculation: boolean;
  } | null>(null);
  
  const router = useRouter();

  // 🚀 FASE 2C: Configuración del formulario con benchmarking
  const formConfig = useMemo(() => measureTime('form_config_creation', () => ({
    resolver: zodResolver(formSchema),
    mode: 'onChange' as const,
    defaultValues: {
      age: undefined,
      height: undefined,
      weight: undefined,
      cycleDuration: undefined,
      infertilityDuration: undefined,
      hasPcos: false,
      endometriosisGrade: undefined,
      myomaType: undefined,
      adenomyosisType: undefined,
      polypType: undefined,
      hsgResult: undefined,
      hasOtb: false,
      otbMethod: undefined,
      remainingTubalLength: undefined,
      hasOtherInfertilityFactors: false,
      desireForMultiplePregnancies: false,
      hasPelvicSurgery: false,
      pelvicSurgeriesNumber: undefined,
      amh: undefined,
      prolactin: undefined,
      tsh: undefined,
      fastingGlucose: undefined,
      fastingInsulin: undefined,
      spermConcentration: undefined,
      spermProgressiveMotility: undefined,
      spermNormalMorphology: undefined,
    } as FormState
  })), []);

  const form = useForm<FormState>(formConfig);
  const { control, watch, setValue, getValues, formState } = form;

  // 🚀 FASE 2C: Observar campos con benchmarking
  const watchedFields = measureTime('watch_fields', () => watch(), 'render');

  // 🚀 FASE 2C: Hook de progreso con datos actualizados
  const { progress, getSectionProgress, isSectionComplete } = useFormProgress({ 
    formData: watchedFields 
  });

  // 🚀 FASE 2C: Cálculos memoizados y optimizados
  const calculatedBmi = useMemo(() => 
    measureTime('calculate_bmi', () => {
      const { height, weight } = watchedFields;
      return calculateBMI(height || 0, weight || 0);
    }),
    [watchedFields.height, watchedFields.weight, calculateBMI]
  );

  const calculatedHoma = useMemo(() => 
    measureTime('calculate_homa', () => {
      const { fastingGlucose, fastingInsulin } = watchedFields;
      return calculateHOMA(fastingGlucose || 0, fastingInsulin || 0);
    }),
    [watchedFields.fastingGlucose, watchedFields.fastingInsulin, calculateHOMA]
  );

  // 🚀 FASE 2C: Formateo y categorización memoizados
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

  // 🚀 FASE 2C: Validación clínica optimizada con debounce implícito
  const updateClinicalValidation = useCallback(() => {
    measureTime('clinical_validation', () => {
      const formData = getValues();
      const overallValidation = validateForm(formData);
      
      // Simular fieldValidations básicas (se puede expandir)
      const fieldValidations: FieldValidationResult[] = [];
      
      if (formData.age) {
        fieldValidations.push(validateField('age', formData.age));
      }
      
      if (formData.amh !== undefined) {
        fieldValidations.push(validateField('amh', formData.amh));
      }

      const completionScore = Math.round(
        (Object.values(formData).filter(v => v !== undefined && v !== null && v !== '').length / 
         Object.keys(formData).length) * 100
      );

      const canProceedWithCalculation = overallValidation.isValid && completionScore >= 30;

      setClinicalValidation({
        overallValidation,
        fieldValidations,
        completionScore,
        canProceedWithCalculation
      });
    }, 'validation');
  }, [getValues, validateForm, validateField]);

  // 🚀 FASE 2C: Función de cálculo optimizada
  const handleCalculate = useCallback(async () => {
    await measureTimeAsync('complete_calculation', async () => {
      setIsLoading(true);
      trackRender('CalculatorForm');
      
      try {
        const formData = getValues();
        
        // Validación previa
        const validation = validateForm(formData);
        if (!validation.isValid) {
          throw new Error(`Errores de validación: ${validation.errors.map(e => e.message).join(', ')}`);
        }

        // Mapear datos y calcular
        const userInput = mapFormStateToUserInput(formData);
        const result = calculateProbability(userInput);

        // Guardar en AsyncStorage
        await AsyncStorage.setItem('calculationResult', JSON.stringify(result));
        await AsyncStorage.setItem('lastFormData', JSON.stringify(formData));

        // Navegar a resultados
        router.push('/results');
      } catch (error) {
        console.error('Error en cálculo:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    }, 'calculation');
  }, [getValues, validateForm, router, measureTimeAsync, trackRender]);

  // 🚀 FASE 2C: Actualizar validación cuando cambien los campos relevantes
  useMemo(() => {
    updateClinicalValidation();
  }, [watchedFields.age, watchedFields.amh, watchedFields.spermConcentration, updateClinicalValidation]);

  // 🚀 FASE 2C: Funciones de métricas
  const getPerformanceReport = useCallback(() => getReport(), [getReport]);
  const clearPerformanceMetrics = useCallback(() => clearMetrics(), [clearMetrics]);

  return {
    // API del formulario
    control,
    watch,
    setValue,
    getValues,
    formState,
    watchedFields,
    
    // Cálculos optimizados
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
    
    // Validación optimizada
    clinicalValidation,
    validateField,
    isFieldValid,
    
    // Estado y acciones
    isLoading,
    handleCalculate,
    
    // Métricas
    getPerformanceReport,
    clearPerformanceMetrics
  };
};
