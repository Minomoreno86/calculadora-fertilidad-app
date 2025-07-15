// ===================================================================
// 🚀 HOOK INTEGRADO: CALCULADORA CON VALIDACIÓN PARALELA
// ===================================================================

// Declaración global para React Native
declare const __DEV__: boolean;

import { useMemo, useCallback, useEffect } from 'react';
import { useCalculatorForm, type FormState } from '../useCalculatorForm';
import { useCalculatorParallelValidation } from './useCalculatorParallelValidation';

/**
 * Hook que integra el formulario de calculadora existente
 * con el sistema de validación paralela mejorado
 */
export const useCalculatorWithParallelValidation = () => {
  // 🎯 Hook original de la calculadora
  const calculatorForm = useCalculatorForm();

  // 🚀 Sistema de validación paralela
  const parallelValidation = useCalculatorParallelValidation();

  // 🔄 Ejecutar validación paralela cuando cambian los datos del formulario (ESTABILIZADO)
  const watchedFieldsStringified = useMemo(() => {
    return JSON.stringify(calculatorForm.watchedFields);
  }, [JSON.stringify(calculatorForm.watchedFields)]);
  
  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      const formValues = calculatorForm.getValues();
      if (Object.keys(formValues).length > 0) {
        try {
          await parallelValidation.validateFormParallel(formValues);
        } catch (error) {
          console.warn('🔧 Error en validación paralela:', error);
        }
      }
    }, 500); // Debounce de 500ms

    return () => clearTimeout(debounceTimer);
  }, [watchedFieldsStringified, calculatorForm.getValues, parallelValidation.validateFormParallel]); // Usar string para evitar re-renders infinitos

  // 🎯 Función de cálculo mejorada con validación paralela FLEXIBLE
  const calculateWithValidation = useCallback(async () => {
    try {
      // 1. Obtener datos del formulario
      const formValues = calculatorForm.getValues();
      
      // 2. Ejecutar validación paralela (no bloqueante)
      const validationResult = await parallelValidation.validateFormParallel(formValues);
      
      // 🎯 CARACTERÍSTICA ESPECIAL: Permitir cálculo incluso con datos incompletos
      // Solo bloquear si hay errores CRÍTICOS reales (basado en contenido del mensaje)
      const hasCriticalErrors = validationResult.overallValidation.criticalErrors?.some(
        error => error.includes('crítico') || error.includes('bloquea')
      ) || false;
      
      if (hasCriticalErrors) {
        console.warn('🔧 Errores críticos detectados, bloqueando cálculo:', validationResult.overallValidation.criticalErrors);
        return null;
      }
      
      // 3. ✅ EJECUTAR CÁLCULO ORIGINAL - Permitir con datos parciales
      console.log('🚀 Ejecutando cálculo con datos disponibles (flexible)');
      const calculationResult = await calculatorForm.handleCalculate();
      
      return {
        calculation: calculationResult,
        validation: validationResult,
        timestamp: new Date(),
        wasPartialCalculation: !validationResult.isValid // Indicar si fue cálculo parcial
      };
      
    } catch (error) {
      console.error('🔧 Error en cálculo con validación:', error);
      // 🎯 FALLBACK: Si falla la validación paralela, usar cálculo original
      try {
        console.log('🔄 Fallback: Ejecutando cálculo original directo');
        return await calculatorForm.handleCalculate();
      } catch (fallbackError) {
        console.error('🔧 Error en fallback también:', fallbackError);
        throw fallbackError;
      }
    }
  }, [calculatorForm.handleCalculate, parallelValidation.validateFormParallel, calculatorForm.getValues]);

  // 🎯 Estado consolidado del formulario con validación (ESTABILIZADO)
  const enhancedFormState = useMemo(() => ({
    // Estado original del formulario (estabilizado con string)
    ...JSON.parse(watchedFieldsStringified),
    
    // Estado de validación paralela
    isValidating: parallelValidation.isValidating,
    isFormValid: parallelValidation.isFormValid,
    
    // Métricas de rendimiento
    validationMetrics: parallelValidation.metrics,
    
    // Errores y advertencias específicos
    criticalErrors: parallelValidation.criticalErrors,
    warnings: parallelValidation.warnings,
    suggestions: parallelValidation.suggestions,
  }), [
    watchedFieldsStringified,
    parallelValidation.isValidating,
    parallelValidation.isFormValid,
    parallelValidation.metrics,
    parallelValidation.criticalErrors,
    parallelValidation.warnings,
    parallelValidation.suggestions
  ]);

  // 🎯 Función para obtener validación de campo específico
  const getFieldValidation = useCallback((fieldName: keyof FormState) => {
    const parallelResult = parallelValidation.getFieldValidation(fieldName);
    
    return {
      // Validación paralela
      parallel: parallelResult || null,
      
      // Compatibilidad con validación original
      isValid: parallelResult ? parallelResult.isValid : true,
      messages: parallelResult ? parallelResult.messages : [],
      severity: parallelResult ? parallelResult.severity : 'info' as const
    };
  }, [parallelValidation.getFieldValidation]);

  // 🎯 Función para resetear tanto formulario como validación
  const resetFormAndValidation = useCallback(() => {
    // Resetear al formulario usando setValue para campos individuales
    const currentFields = JSON.parse(watchedFieldsStringified);
    Object.keys(currentFields).forEach(key => {
      calculatorForm.setValue(key as keyof FormState, '' as never);
    });
    parallelValidation.clearCache();
  }, [calculatorForm.setValue, watchedFieldsStringified, parallelValidation.clearCache]);

  // 📊 Métricas combinadas de rendimiento
  const combinedMetrics = useMemo(() => {
    // Determinar estado general
    let overallStatus = 'Requiere atención';
    if (parallelValidation.isValidating) {
      overallStatus = 'Validando...';
    } else if (parallelValidation.isFormValid) {
      overallStatus = 'Listo';
    }

    return {
      // Métricas del formulario original
      form: {
        progress: calculatorForm.progress?.progressPercentage || 0,
        isReadyToSubmit: calculatorForm.progress?.isReadyToSubmit || false,
        benchmark: calculatorForm.getPerformanceReport?.() || null
      },
      
      // Métricas de validación paralela
      validation: parallelValidation.metrics,
      
      // Métricas combinadas
      overall: {
        efficiency: parallelValidation.metrics.performance.efficiency,
        readiness: parallelValidation.isFormValid && (calculatorForm.progress?.isReadyToSubmit || false),
        status: overallStatus
      }
    };
  }, [
    calculatorForm.progress,
    calculatorForm.getPerformanceReport,
    parallelValidation.metrics,
    parallelValidation.isFormValid,
    parallelValidation.isValidating
  ]);

  return {
    // 🎯 API principal del formulario (mantiene compatibilidad)
    control: calculatorForm.control,
    formState: enhancedFormState,
    errors: calculatorForm.formState.errors,
    
    // 🎯 Funciones de cálculo mejoradas
    handleCalculate: calculateWithValidation,
    isLoading: calculatorForm.isLoading || false,
    
    // 🎯 Datos calculados
    calculatedBmi: calculatorForm.calculatedBmi,
    calculatedHoma: calculatorForm.calculatedHoma,
    
    // 🎯 Progreso y navegación
    currentStep: calculatorForm.currentStep || 0,
    progress: calculatorForm.progress?.progressPercentage || 0,
    
    // 🎨 UX: Acceso a campos observados para mejoras UX
    watchedFields: calculatorForm.watchedFields,
    
    // 🚀 Funcionalidades de validación paralela
    isValidating: parallelValidation.isValidating,
    isFormValid: parallelValidation.isFormValid,
    getFieldValidation,
    
    // 🚀 Métricas y monitoreo
    validationMetrics: parallelValidation.metrics,
    combinedMetrics,
    
    // 🚀 Errores y advertencias estructurados
    criticalErrors: parallelValidation.criticalErrors,
    warnings: parallelValidation.warnings,
    suggestions: parallelValidation.suggestions,
    
    // 🚀 Controles avanzados
    resetFormAndValidation,
    clearValidationCache: parallelValidation.clearCache,
    
    // 🔧 Datos de desarrollo
    devData: __DEV__ ? {
      parallelValidation: parallelValidation.devData,
      originalForm: {
        benchmark: calculatorForm.getPerformanceReport?.(),
        isReadyToSubmit: calculatorForm.progress?.isReadyToSubmit
      }
    } : undefined
  };
};

export type CalculatorWithParallelValidation = ReturnType<typeof useCalculatorWithParallelValidation>;
