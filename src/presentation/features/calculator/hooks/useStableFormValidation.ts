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

import React from 'react';
import { ClinicalValidators, ValidationResult } from '@/core/domain/validation/clinicalValidators';
import { FormState } from '../types/calculator.types';

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

  /**
   * Datos del formulario para validaciones de rango
   */
  formData?: Partial<FormState>;
}

// Tipos auxiliares
type ValueType = string | number | undefined;
type RangeFieldType = 'age' | 'weight' | 'height';

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
  parseNumber: (value: ValueType) => number;
  
  /** Función para extraer datos de validación */
  extractValidationData: (formData: Partial<FormState>) => ValidationData;

  /** Validaciones de rangos médicos */
  rangeValidations: {
    age: RangeValidationResult;
    weight: RangeValidationResult;
    height: RangeValidationResult;
  };

  /** Estadísticas de validación de rangos */
  rangeStats: {
    total: number;
    normal: number;
    warnings: number;
    errors: number;
    hasAnyWarning: boolean;
    hasAnyError: boolean;
    allNormal: boolean;
  };

  /** Función para obtener validación de rango específica */
  getRangeValidation: (field: RangeFieldType, value: number) => RangeValidationResult;
}

// Tipos para validación de rangos
interface RangeValidationResult {
  isNormal: boolean;
  isWarning: boolean;
  isError: boolean;
  message: string;
  range: {
    min: number;
    max: number;
    warningMin?: number;
    warningMax?: number;
  };
}

// Tipos para datos de validación extraídos
interface ValidationData {
  age: number;
  height: number;
  weight: number;
  amh: number;
  timeToConception: number;
  glucose: number;
  insulin: number;
  spermConcentration: number;
  spermProgressiveMotility: number;
  spermNormalMorphology: number;
  cycleLength: number;
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
  const [clinicalValidation, setClinicalValidation] = React.useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = React.useState(false);
  
  // 🚀 Referencias para evitar re-renders
  const validationTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastValidatedDataRef = React.useRef<string>('');
  const isMountedRef = React.useRef(true);

  // 🚀 CONSOLIDACIÓN: Validaciones de rangos integradas
  const rangeValidations = React.useMemo(() => ({
    age: validateAge(options.formData?.age),
    weight: validateWeight(options.formData?.weight),
    height: validateHeight(options.formData?.height)
  }), [options.formData]);

  const rangeStats = React.useMemo(() => {
    const validationValues = Object.values(rangeValidations) as RangeValidationResult[];
    const totalFields = validationValues.length;
    const warningFields = validationValues.filter(v => v.isWarning).length;
    const errorFields = validationValues.filter(v => v.isError).length;
    const normalFields = validationValues.filter(v => v.isNormal).length;

    return {
      total: totalFields,
      normal: normalFields,
      warnings: warningFields,
      errors: errorFields,
      hasAnyWarning: warningFields > 0,
      hasAnyError: errorFields > 0,
      allNormal: normalFields === totalFields
    };
  }, [rangeValidations]);

  const getRangeValidation = React.useCallback((field: RangeFieldType, value: number): RangeValidationResult => {
    switch (field) {
      case 'age':
        return validateAge(value);
      case 'weight':
        return validateWeight(value);
      case 'height':
        return validateHeight(value);
      default:
        return {
          isNormal: true,
          isWarning: false,
          isError: false,
          message: 'Campo no reconocido',
          range: { min: 0, max: 0 }
        };
    }
  }, []);
  
  // 🚀 Función auxiliar estable para parsear números
  const parseNumber = React.useCallback((value: ValueType): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  }, []);

  // 🚀 Función para extraer datos de validación (memoizada)
  const extractValidationData = React.useCallback((formData: Partial<FormState>) => {
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
    };
  }, [parseNumber]);

  // 🚀 Función de validación con debounce
  const performValidation = React.useCallback(async (formData: Partial<FormState>) => {
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
        setClinicalValidation(validation.overallValidation);
      }
    } catch (error) {
      console.error('🚨 Error en validación clínica estable:', error);
      
      // Estado conservador en caso de error
      if (isMountedRef.current) {
        setClinicalValidation({
          isValid: false,
          errors: [],
          warnings: [{ 
            message: 'Error en validación, verificar datos',
            type: 'warning'
          }],
          criticalAlerts: [],
          recommendations: ['Verificar datos del formulario'],
          clinicalScore: 0,
        });
      }
    } finally {
      if (isMountedRef.current) {
        setIsValidating(false);
      }
    }
  }, [requiredFields, extractValidationData]);

  // 🚀 Función para disparar validación con debounce
  const triggerValidation = React.useCallback((formData: Partial<FormState>) => {
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
  const clearValidation = React.useCallback(() => {
    setClinicalValidation(null);
    setIsValidating(false);
    lastValidatedDataRef.current = '';
    
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
      validationTimeoutRef.current = null;
    }
  }, []);

  // 🚀 Cleanup al desmontar
  React.useEffect(() => {
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
    rangeValidations,
    rangeStats,
    getRangeValidation,
  };
};

// ===================================================================
// 🚀 FUNCIONES DE VALIDACIÓN DE RANGOS CONSOLIDADAS
// ===================================================================

// Función para validar edad
function validateAge(value: ValueType): RangeValidationResult {
  const age = typeof value === 'string' ? parseFloat(value) : (value || 0);
  
  if (age <= 0) {
    return {
      isNormal: false,
      isWarning: false,
      isError: true,
      message: 'La edad es requerida',
      range: { min: 18, max: 50 }
    };
  }
  
  if (age < 18) {
    return {
      isNormal: false,
      isWarning: true,
      isError: false,
      message: 'Edad muy joven para tratamiento de fertilidad',
      range: { min: 18, max: 50, warningMin: 18 }
    };
  }
  
  if (age > 45) {
    return {
      isNormal: false,
      isWarning: age <= 50,
      isError: age > 50,
      message: age > 50 ? 'Edad fuera del rango típico' : 'Considera evaluación médica especializada',
      range: { min: 18, max: 50, warningMax: 45 }
    };
  }
  
  return {
    isNormal: true,
    isWarning: false,
    isError: false,
    message: 'Edad dentro del rango normal',
    range: { min: 18, max: 50 }
  };
}

// Función para validar peso
function validateWeight(value: ValueType): RangeValidationResult {
  const weight = typeof value === 'string' ? parseFloat(value) : (value || 0);
  
  if (weight <= 0) {
    return {
      isNormal: false,
      isWarning: false,
      isError: true,
      message: 'El peso es requerido',
      range: { min: 35, max: 150 }
    };
  }
  
  if (weight < 40) {
    return {
      isNormal: false,
      isWarning: weight >= 35,
      isError: weight < 35,
      message: weight < 35 ? 'Peso muy bajo' : 'Peso bajo - considera evaluación nutricional',
      range: { min: 35, max: 150, warningMin: 40 }
    };
  }
  
  if (weight > 120) {
    return {
      isNormal: false,
      isWarning: weight <= 150,
      isError: weight > 150,
      message: weight > 150 ? 'Peso fuera del rango' : 'Peso elevado - considera evaluación médica',
      range: { min: 35, max: 150, warningMax: 120 }
    };
  }
  
  return {
    isNormal: true,
    isWarning: false,
    isError: false,
    message: 'Peso dentro del rango normal',
    range: { min: 35, max: 150 }
  };
}

// Función para validar altura
function validateHeight(value: ValueType): RangeValidationResult {
  const height = typeof value === 'string' ? parseFloat(value) : (value || 0);
  
  if (height <= 0) {
    return {
      isNormal: false,
      isWarning: false,
      isError: true,
      message: 'La altura es requerida',
      range: { min: 140, max: 200 }
    };
  }
  
  if (height < 150) {
    return {
      isNormal: false,
      isWarning: height >= 140,
      isError: height < 140,
      message: height < 140 ? 'Altura fuera del rango' : 'Altura baja - normal en algunos casos',
      range: { min: 140, max: 200, warningMin: 150 }
    };
  }
  
  if (height > 185) {
    return {
      isNormal: false,
      isWarning: height <= 200,
      isError: height > 200,
      message: height > 200 ? 'Altura fuera del rango' : 'Altura elevada - normal en algunos casos',
      range: { min: 140, max: 200, warningMax: 185 }
    };
  }
  
  return {
    isNormal: true,
    isWarning: false,
    isError: false,
    message: 'Altura dentro del rango normal',
    range: { min: 140, max: 200 }
  };
}
