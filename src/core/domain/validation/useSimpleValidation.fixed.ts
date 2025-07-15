import { useMemo } from 'react';
import type { FormState } from '@/presentation/features/calculator/types/calculator.types';

// Tipos simplificados para la validación básica
export interface SimpleValidationResult {
  isValid: boolean;
  message: string;
  type: 'success' | 'warning' | 'error';
}

export interface UseSimpleValidationReturn {
  ageValidation: SimpleValidationResult | undefined;
  bmiValidation: SimpleValidationResult | undefined;
  cycleValidation: SimpleValidationResult | undefined;
  amhValidation: SimpleValidationResult | undefined;
  allValidations: SimpleValidationResult[];
  hasErrors: boolean;
  hasWarnings: boolean;
  overallScore: number;
}

/**
 * Hook de validación simple y eficiente para el formulario de fertilidad
 * Corregido para manejar tipos string del FormState
 */
export const useSimpleValidation = (
  formValues: Partial<FormState> | null | undefined
): UseSimpleValidationReturn => {
  
  // Helper para parsear valores numéricos de strings
  const parseNumber = (value: string | undefined): number => {
    if (!value) return 0;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Validación de edad
  const ageValidation = useMemo((): SimpleValidationResult | undefined => {
    const ageValue = parseNumber(formValues?.age);
    
    if (!formValues?.age || ageValue <= 0) {
      return {
        isValid: false,
        message: 'Edad requerida para evaluación de fertilidad',
        type: 'error'
      };
    }
    
    if (ageValue < 18 || ageValue > 55) {
      return {
        isValid: false,
        message: 'Edad debe estar entre 18 y 55 años',
        type: 'error'
      };
    }
    
    if (ageValue >= 40) {
      return {
        isValid: true,
        message: `Edad ${ageValue} años - Fertilidad reducida. Evaluación urgente`,
        type: 'warning'
      };
    }
    
    if (ageValue >= 35) {
      return {
        isValid: true,
        message: `Edad ${ageValue} años - Declive de fertilidad`,
        type: 'warning'
      };
    }
    
    return {
      isValid: true,
      message: `Edad ${ageValue} años - Rango óptimo`,
      type: 'success'
    };
  }, [formValues?.age]);

  // Validación de BMI
  const bmiValidation = useMemo((): SimpleValidationResult | undefined => {
    const heightValue = parseNumber(formValues?.height);
    const weightValue = parseNumber(formValues?.weight);
    
    if (!formValues?.height || !formValues?.weight || heightValue <= 0 || weightValue <= 0) {
      return {
        isValid: false,
        message: 'Altura y peso requeridos',
        type: 'error'
      };
    }

    const heightInMeters = heightValue / 100;
    const bmi = weightValue / (heightInMeters * heightInMeters);
    
    if (bmi < 18.5) {
      return {
        isValid: true,
        message: `IMC ${bmi.toFixed(1)} - Bajo peso. Optimizar antes de TRA`,
        type: 'warning'
      };
    }
    
    if (bmi > 30) {
      return {
        isValid: true,
        message: `IMC ${bmi.toFixed(1)} - Obesidad. Reducción de peso recomendada`,
        type: 'warning'
      };
    }
    
    if (bmi > 25) {
      return {
        isValid: true,
        message: `IMC ${bmi.toFixed(1)} - Sobrepeso. Optimización beneficiosa`,
        type: 'warning'
      };
    }
    
    return {
      isValid: true,
      message: `IMC ${bmi.toFixed(1)} - Peso ideal`,
      type: 'success'
    };
  }, [formValues?.height, formValues?.weight]);

  // Validación de ciclo menstrual
  const cycleValidation = useMemo((): SimpleValidationResult | undefined => {
    const cycleLengthValue = parseNumber(formValues?.cycleLength);
    
    if (!formValues?.cycleLength || cycleLengthValue <= 0) {
      return undefined;
    }

    if (cycleLengthValue >= 21 && cycleLengthValue <= 35) {
      return {
        isValid: true,
        message: `Ciclo de ${cycleLengthValue} días - Normal`,
        type: 'success'
      };
    }
    
    if (cycleLengthValue > 35) {
      return {
        isValid: true,
        message: `Ciclo de ${cycleLengthValue} días - Ciclo largo`,
        type: 'warning'
      };
    }
    
    return {
      isValid: true,
      message: `Ciclo de ${cycleLengthValue} días - Ciclo corto`,
      type: 'warning'
    };
  }, [formValues?.cycleLength]);

  // Validación de AMH
  const amhValidation = useMemo((): SimpleValidationResult | undefined => {
    const amhValue = parseNumber(formValues?.amhValue);
    const ageValue = parseNumber(formValues?.age);
    
    if (!formValues?.amhValue || amhValue <= 0) {
      return undefined;
    }

    if (ageValue < 35) {
      if (amhValue < 1.0) {
        return {
          isValid: true,
          message: `AMH ${amhValue.toFixed(1)} ng/ml - Reserva baja`,
          type: 'warning'
        };
      }
      if (amhValue > 5.0) {
        return {
          isValid: true,
          message: `AMH ${amhValue.toFixed(1)} ng/ml - Reserva alta`,
          type: 'warning'
        };
      }
    } else {
      if (amhValue < 0.8) {
        return {
          isValid: true,
          message: `AMH ${amhValue.toFixed(1)} ng/ml - Reserva muy baja`,
          type: 'warning'
        };
      }
    }
    
    return {
      isValid: true,
      message: `AMH ${amhValue.toFixed(1)} ng/ml - Reserva adecuada`,
      type: 'success'
    };
  }, [formValues?.amhValue, formValues?.age]);

  // Compilar todas las validaciones
  const allValidations = useMemo((): SimpleValidationResult[] => {
    return [
      ageValidation,
      bmiValidation,
      cycleValidation,
      amhValidation
    ].filter((validation): validation is SimpleValidationResult => validation !== undefined);
  }, [ageValidation, bmiValidation, cycleValidation, amhValidation]);

  // Estadísticas generales
  const hasErrors = useMemo(() => 
    allValidations.some(v => v.type === 'error'), 
    [allValidations]
  );

  const hasWarnings = useMemo(() => 
    allValidations.some(v => v.type === 'warning'), 
    [allValidations]
  );

  const overallScore = useMemo(() => {
    if (allValidations.length === 0) return 0;
    const successCount = allValidations.filter(v => v.type === 'success').length;
    return Math.round((successCount / allValidations.length) * 100);
  }, [allValidations]);

  return {
    ageValidation,
    bmiValidation,
    cycleValidation,
    amhValidation,
    allValidations,
    hasErrors,
    hasWarnings,
    overallScore
  };
};
