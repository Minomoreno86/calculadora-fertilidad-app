// ===================================================================
// 🚀 HOOK PRINCIPAL UNIFICADO - CALCULADORA DE FERTILIDAD
// ===================================================================
// 
// Este es el ÚNICO hook que se debe usar en toda la aplicación.
// Combina la funcionalidad básica con las mejoras de rendimiento,
// manteniendo una API simple y estable.
//
// REEMPLAZA:
// - useCalculatorForm
// - useCalculatorWithParallelValidation  
// - useCalculatorFormModular
// - useCalculatorFormOptimized
// - Todas las otras variantes
//
// ===================================================================

import { useMemo, useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'expo-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Imports del core
import { calculateProbability } from '@/core/domain/services/calculationEngine';
import { ClinicalValidators, ValidationResult, FieldValidationResult } from '@/core/domain/validation/clinicalValidators';
import type { ValidationMessage } from '@/core/domain/validation/validationMessages';

// Imports locales
import { formSchema } from './utils/validationSchemas';
import { mapFormStateToUserInput } from './utils/dataMapper';

// Tipos
export type FormState = z.infer<typeof formSchema>;

// ===================================================================
// 🎯 INTERFAZ UNIFICADA - SIMPLE Y COMPLETA
// ===================================================================
export interface UseCalculatorFormReturn {
  // 🔧 API básica del formulario
  control: ReturnType<typeof useForm<FormState>>['control'];
  watch: ReturnType<typeof useForm<FormState>>['watch'];
  setValue: ReturnType<typeof useForm<FormState>>['setValue'];
  getValues: ReturnType<typeof useForm<FormState>>['getValues'];
  formState: { errors: ReturnType<typeof useForm<FormState>>['formState']['errors'] };
  watchedFields: FormState;
  
  // 🧮 Cálculos automáticos
  calculatedBmi: number | null;
  calculatedHoma: number | null;
  
  // 📊 Estado y progreso
  isLoading: boolean;
  currentStep: number;
  progress: number;
  
  // ⚡ Función principal
  handleCalculate: () => Promise<void>;
  
  // 🔍 Validación básica
  errors: ReturnType<typeof useForm<FormState>>['formState']['errors'];
  canCalculate: boolean;
  
  // 🎯 Funciones de utilidad
  getRangeValidation: (fieldName: string) => RangeValidation;
  getCompletionScore: () => number;
  getClinicalAlerts: () => ValidationMessage[];
}

// ===================================================================
// 🔧 TIPOS AUXILIARES
// ===================================================================
interface RangeValidation {
  isValid: boolean;
  isNormal: boolean;
  isWarning: boolean;
  isError: boolean;
  message: string;
  severity: 'info' | 'warning' | 'error';
}

// ===================================================================
// 🚀 HOOK PRINCIPAL UNIFICADO
// ===================================================================
export const useCalculatorForm = (): UseCalculatorFormReturn => {
  // 📝 Estado del formulario
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // 🔧 React Hook Form setup
  const form = useForm<FormState>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      age: '',
      weight: '',
      height: '',
      cycleLength: '',
      infertilityDuration: '',
      hasPcos: false,
      hasEndometriosis: false,
      hasMyoma: false,
      hasAdenomyosis: false,
      hasPolyp: false,
      hadPelvicSurgery: false,
      amhValue: '',
      insulinValue: '',
      glucoseValue: '',
      spermConcentration: '',
      spermProgressiveMotility: '',
    }
  });

  const { control, watch, setValue, getValues, formState } = form;
  const watchedFields = watch();

  // 🧮 Cálculos automáticos memoizados
  const calculatedBmi = useMemo(() => {
    const weight = parseFloat(watchedFields.weight || '0');
    const height = parseFloat(watchedFields.height || '0');
    
    if (weight > 0 && height > 0) {
      const heightInMeters = height / 100;
      return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
    }
    return null;
  }, [watchedFields.weight, watchedFields.height]);

  const calculatedHoma = useMemo(() => {
    const insulin = parseFloat(watchedFields.insulinValue || '0');
    const glucose = parseFloat(watchedFields.glucoseValue || '0');
    
    if (insulin > 0 && glucose > 0) {
      return Number(((insulin * glucose) / 405).toFixed(2));
    }
    return null;
  }, [watchedFields.insulinValue, watchedFields.glucoseValue]);

  // 📊 Progreso del formulario
  const progress = useMemo(() => {
    const requiredFields = ['age', 'weight', 'height'];
    const completedRequired = requiredFields.filter(field => 
      watchedFields[field as keyof FormState] && 
      String(watchedFields[field as keyof FormState]).trim() !== ''
    ).length;
    
    const optionalFields = ['cycleLength', 'infertilityDuration', 'amhValue'];
    const completedOptional = optionalFields.filter(field => 
      watchedFields[field as keyof FormState] && 
      String(watchedFields[field as keyof FormState]).trim() !== ''
    ).length;
    
    const totalCompleted = completedRequired + completedOptional;
    const totalFields = requiredFields.length + optionalFields.length;
    
    return Math.round((totalCompleted / totalFields) * 100);
  }, [watchedFields]);

  // 🎯 Determinar step actual
  const currentStep = useMemo(() => {
    if (!watchedFields.age || !watchedFields.weight || !watchedFields.height) return 0;
    if (!watchedFields.cycleLength) return 1;
    if (!watchedFields.amhValue) return 2;
    return 3;
  }, [watchedFields.age, watchedFields.weight, watchedFields.height, watchedFields.cycleLength, watchedFields.amhValue]);

  // ✅ Verificar si se puede calcular
  const canCalculate = useMemo(() => {
    return !!(watchedFields.age && watchedFields.weight && watchedFields.height);
  }, [watchedFields.age, watchedFields.weight, watchedFields.height]);

  // 🔍 Validación de rangos simple
  const getRangeValidation = useCallback((fieldName: string): RangeValidation => {
    const value = watchedFields[fieldName as keyof FormState];
    const numValue = parseFloat(String(value || '0'));
    
    // Validaciones básicas por campo
    switch (fieldName) {
      case 'age':
        if (numValue < 18) return { isValid: false, isNormal: false, isWarning: true, isError: false, message: 'Edad muy joven', severity: 'warning' };
        if (numValue > 45) return { isValid: true, isNormal: false, isWarning: true, isError: false, message: 'Edad avanzada', severity: 'warning' };
        return { isValid: true, isNormal: true, isWarning: false, isError: false, message: '', severity: 'info' };
        
      case 'bmi':
        if (calculatedBmi && calculatedBmi < 18.5) return { isValid: true, isNormal: false, isWarning: true, isError: false, message: 'Bajo peso', severity: 'warning' };
        if (calculatedBmi && calculatedBmi > 30) return { isValid: true, isNormal: false, isWarning: true, isError: false, message: 'Obesidad', severity: 'warning' };
        return { isValid: true, isNormal: true, isWarning: false, isError: false, message: '', severity: 'info' };
        
      default:
        return { isValid: true, isNormal: true, isWarning: false, isError: false, message: '', severity: 'info' };
    }
  }, [watchedFields, calculatedBmi]);

  // 📊 Score de completitud
  const getCompletionScore = useCallback(() => {
    return progress;
  }, [progress]);

  // ⚠️ Alertas clínicas básicas
  const getClinicalAlerts = useCallback((): ValidationMessage[] => {
    const alerts: ValidationMessage[] = [];
    
    if (calculatedBmi && calculatedBmi > 35) {
      alerts.push({
        type: 'warning',
        message: 'BMI muy alto puede afectar la fertilidad',
        field: 'bmi'
      });
    }
    
    const age = parseFloat(watchedFields.age || '0');
    if (age > 40) {
      alerts.push({
        type: 'warning', 
        message: 'La edad puede afectar la reserva ovárica',
        field: 'age'
      });
    }
    
    return alerts;
  }, [calculatedBmi, watchedFields.age]);

  // ⚡ Función principal de cálculo
  const handleCalculate = useCallback(async () => {
    if (!canCalculate) {
      alert('Por favor completa los campos básicos (edad, peso, altura)');
      return;
    }

    setIsLoading(true);
    
    try {
      // Mapear datos del formulario
      const userInput = mapFormStateToUserInput(watchedFields);
      
      // Calcular probabilidad
      const result = calculateProbability(userInput);
      
      // Guardar resultado
      const reportKey = `fertility_report_${Date.now()}`;
      await AsyncStorage.setItem(reportKey, JSON.stringify(result));
      
      // Navegar a resultados
      router.push(`/results?reportKey=${reportKey}`);
      
    } catch (error) {
      console.error('Error en cálculo:', error);
      alert('Error al procesar el cálculo. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  }, [canCalculate, watchedFields, router]);

  // 🎯 Retorno del hook
  return {
    // API básica
    control,
    watch,
    setValue,
    getValues,
    formState,
    watchedFields,
    
    // Cálculos
    calculatedBmi,
    calculatedHoma,
    
    // Estado
    isLoading,
    currentStep,
    progress,
    
    // Función principal
    handleCalculate,
    
    // Validación
    errors: formState.errors,
    canCalculate,
    
    // Utilidades
    getRangeValidation,
    getCompletionScore,
    getClinicalAlerts,
  };
};

export default useCalculatorForm;
