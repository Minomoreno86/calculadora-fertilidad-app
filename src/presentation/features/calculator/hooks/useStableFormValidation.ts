/**
 * useStableFormValidation - Hook optimizado para validación estable
 * 
 * Soluciona problemas de:
 * - Re-renders infinitos en validación clínica
 * - Bloqueos del teclado numérico
 * - Referencias inestables en watchedFields
 * 
 * @author AEC-D (Arquitecto Experto Clínico-Digital)
 * @version 1.0 - Solución de performance crítica
 */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ClinicalValidators, ValidationResult } from '@/core/domain/validation/clinicalValidators';
import { FormState } from '../useCalculatorFormOptimized';

interface UseStableFormValidationOptions {
  /**
   * Tiempo de debounce para validaciones clínicas (ms)
   * @default 500
   */
  debounceTime?: number;
  
  /**
   * Habilitar validación en tiempo real
   * @default true
   */
  enableRealTimeValidation?: boolean;
  
  /**
   * Campos mínimos requeridos para validación
   * @default ['age', 'height', 'weight']
   */
  requiredFields?: (keyof FormState)[];
}

interface UseStableFormValidationReturn {
  /** Estado de validación clínica actual */
  clinicalValidation: ValidationResult | null;
  
  /** Función para disparar validación manual */
  triggerValidation: (formData: Partial<FormState>) => void;
  
  /** Función para limpiar estado de validación */
  clearValidation: () => void;
  
  /** Indica si está validando actualmente */
  isValidating: boolean;
  
  /** Función de utilidad para parsear números */
  parseNumber: (value: string | number | undefined) => number;
  
  /** Función para extraer datos de validación */
  extractValidationData: (formData: Partial<FormState>) => any;
}

/**
 * Hook para validación estable con debounce y optimización de performance
 */
export const useStableFormValidation = (
  options: UseStableFormValidationOptions = {}
): UseStableFormValidationReturn => {
  
  const {
    debounceTime = 500,
    enableRealTimeValidation = true,
    requiredFields = ['age', 'height', 'weight']
  } = options;

  // 🚀 Estados optimizados
  const [clinicalValidation, setClinicalValidation] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  
  // 🚀 Referencias para evitar re-renders
  const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastValidatedDataRef = useRef<string>('');
  const isMountedRef = useRef(true);
  
  // 🚀 Función auxiliar estable para parsear números
  const parseNumber = useCallback((value: string | number | undefined): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  }, []);

  // 🚀 Función para extraer datos de validación (memoizada)
  const extractValidationData = useCallback((formData: Partial<FormState>) => {
    return {
      age: parseNumber(formData.age),
      height: parseNumber(formData.height),
      weight: parseNumber(formData.weight),
      
      // Campos opcionales convertidos apropiadamente
      amh: parseNumber(formData.amhValue),
      timeToConception: parseNumber(formData.infertilityDuration),
      glucose: parseNumber(formData.glucoseValue),
      insulin: parseNumber(formData.insulinValue),
      spermConcentration: parseNumber(formData.spermConcentration),
      spermProgressiveMotility: parseNumber(formData.spermProgressiveMotility),
      spermNormalMorphology: parseNumber(formData.spermNormalMorphology),
      cycleLength: parseNumber(formData.cycleLength),
      cycleRegularity: formData.cycleRegularity,
    };
  }, [parseNumber]);

  // 🚀 Función de validación con debounce
  const performValidation = useCallback(async (formData: Partial<FormState>) => {
    try {
      setIsValidating(true);
      
      // Verificar campos mínimos requeridos
      const hasRequiredFields = requiredFields.every(field => {
        const value = formData[field];
        if (typeof value === 'string') {
          return value.trim() !== '' && parseNumber(value) > 0;
        }
        return value !== undefined && value !== null && value !== 0;
      });

      if (!hasRequiredFields) {
        setClinicalValidation(null);
        return;
      }
      
      // Crear datos para validación
      const validationData = extractValidationData(formData);
      
      // Ejecutar validación clínica
      const validation = ClinicalValidators.validateCompleteForm(validationData);
      
      // Solo actualizar si el componente está montado
      if (isMountedRef.current) {
        setClinicalValidation(validation);
      }
    } catch (error) {
      console.error('🚨 Error en validación clínica estable:', error);
      
      // Estado conservador en caso de error
      if (isMountedRef.current) {
        setClinicalValidation({
          overallValidation: {
            isValid: false,
            errors: [],
            warnings: ['Error en validación, verificar datos'],
            criticalAlerts: [],
            recommendations: ['Verificar datos del formulario'],
            clinicalScore: 0
          },
          fieldValidations: [],
          completionScore: 0,
          canProceedWithCalculation: false
        });
      }
    } finally {
      if (isMountedRef.current) {
        setIsValidating(false);
      }
    }
  }, [requiredFields, extractValidationData]);

  // 🚀 Función para disparar validación con debounce
  const triggerValidation = useCallback((formData: Partial<FormState>) => {
    if (!enableRealTimeValidation) return;
    
    // Crear clave única para los datos actuales
    const dataKey = JSON.stringify(formData);
    
    // Evitar validaciones duplicadas
    if (dataKey === lastValidatedDataRef.current) {
      return;
    }
    
    // Limpiar timeout anterior
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }
    
    // Programar nueva validación con debounce
    validationTimeoutRef.current = setTimeout(() => {
      lastValidatedDataRef.current = dataKey;
      performValidation(formData);
    }, debounceTime);
  }, [enableRealTimeValidation, debounceTime, performValidation]);

  // 🚀 Función para limpiar validación
  const clearValidation = useCallback(() => {
    setClinicalValidation(null);
    setIsValidating(false);
    lastValidatedDataRef.current = '';
    
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
      validationTimeoutRef.current = null;
    }
  }, []);

  // 🚀 Cleanup al desmontar
  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current);
      }
    };
  }, []);

  return {
    clinicalValidation,
    triggerValidation,
    clearValidation,
    isValidating,
    parseNumber,
    extractValidationData,
  };
};
