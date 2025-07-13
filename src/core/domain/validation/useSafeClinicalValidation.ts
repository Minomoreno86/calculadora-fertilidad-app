/**
 * Wrapper seguro para validadores clínicos
 * Maneja errores y previene crashes
 * 
 * @param formValues - Datos del formulario a validar
 * @returns Objeto con estado de validación y funciones auxiliares
 */

import { useState, useEffect } from 'react';

// Tipos específicos para evitar 'any'
interface FormValues {
  age?: number;
  height?: number;
  weight?: number;
  amh?: number;
  glucose?: number;
  insulin?: number;
  infertilityDuration?: number;
  spermConcentration?: number;
  spermProgressiveMotility?: number;
  spermNormalMorphology?: number;
  cycleLength?: number;
  cycleRegularity?: 'regular' | 'irregular';
  [key: string]: unknown;
}

interface ValidationState {
  isValid: boolean;
  canCalculate: boolean;
  completionScore: number;
  errors: string[];
  warnings: string[];
  fieldValidations: string[];
}

interface ClinicalFeedback {
  type: 'success' | 'warning' | 'error';
  title: string;
  messages: string[];
}

interface FieldValidationResult {
  isValid: boolean;
  message?: string;
  type?: 'success' | 'warning' | 'error';
}

interface SafeClinicalValidationReturn {
  validation: ValidationState;
  getFieldValidation: (fieldName: string) => FieldValidationResult;
  getClinicalFeedback: () => ClinicalFeedback;
  canCalculate: boolean;
  getCompletionScore: () => number;
  isValid: boolean;
  completionScore: number;
  errors: string[];
  warnings: string[];
}

// Función auxiliar para validar campo específico
const validateSpecificField = (fieldName: string, formValues: FormValues | null | undefined): {
  isValid: boolean;
  message?: string;
  type?: 'success' | 'warning' | 'error';
} => {
  if (!formValues) {
    return { isValid: false, message: 'Sin datos' };
  }

  switch (fieldName) {
    case 'age':
      if (!formValues.age || typeof formValues.age !== 'number') {
        return { isValid: false, message: 'Edad requerida', type: 'error' };
      }
      if (formValues.age < 18 || formValues.age > 50) {
        return { isValid: false, message: 'Edad debe estar entre 18-50 años', type: 'error' };
      }
      if (formValues.age >= 35) {
        return { isValid: true, message: 'Edad materna avanzada', type: 'warning' };
      }
      return { isValid: true, message: 'Edad normal', type: 'success' };

    case 'bmi': {
      if (!formValues.height || !formValues.weight || 
          typeof formValues.height !== 'number' || typeof formValues.weight !== 'number' ||
          formValues.height <= 0 || formValues.weight <= 0) {
        return { isValid: false, message: 'Altura y peso requeridos', type: 'error' };
      }
      // Calcular BMI usando fórmula estándar consistente
      const heightInMeters = formValues.height / 100;
      const bmi = formValues.weight / (heightInMeters * heightInMeters);
      if (bmi < 18.5 || bmi > 30) {
        return { isValid: true, message: 'BMI fuera del rango óptimo', type: 'warning' };
      }
      return { isValid: true, message: 'BMI normal', type: 'success' };
    }

    case 'amh':
      if (!formValues.amh || typeof formValues.amh !== 'number') {
        return { isValid: false, message: 'AMH no disponible' };
      }
      return { isValid: true, message: 'AMH disponible', type: 'success' };

    default: {
      const value = formValues[fieldName];
      if (typeof value === 'number' && value > 0) {
        return { isValid: true, message: 'Dato disponible', type: 'success' };
      }
      return { isValid: false, message: 'Dato no disponible' };
    }
  }
};

/**
 * Hook seguro para validación clínica
 * @param formValues Datos del formulario
 * @returns Objeto con validaciones y funciones auxiliares
 */
export const useSafeClinicalValidation = (
  formValues: FormValues | null | undefined
): SafeClinicalValidationReturn => {
  const [validationState, setValidationState] = useState<ValidationState>({
    isValid: false,
    canCalculate: false,
    completionScore: 0,
    errors: [],
    warnings: [],
    fieldValidations: []
  });

  useEffect(() => {
    // Validación básica segura
    try {
      if (!formValues || typeof formValues !== 'object') {
        setValidationState({
          isValid: false,
          canCalculate: false,
          completionScore: 0,
          errors: ['Datos de formulario inválidos'],
          warnings: [],
          fieldValidations: []
        });
        return;
      }

      // Validación mejorada de campos requeridos
      const requiredFields: (keyof FormValues)[] = ['age', 'height', 'weight'];
      const optionalFields: (keyof FormValues)[] = ['amh', 'glucose', 'insulin', 'infertilityDuration'];
      
      // Contar campos requeridos completados
      const completedRequired = requiredFields.filter(field => {
        const value = formValues[field];
        return typeof value === 'number' && value > 0;
      });

      // Contar campos opcionales completados
      const completedOptional = optionalFields.filter(field => {
        const value = formValues[field];
        return typeof value === 'number' && value > 0;
      });

      // Calcular score de completitud ponderado
      const requiredScore = (completedRequired.length / requiredFields.length) * 70; // 70% peso
      const optionalScore = (completedOptional.length / optionalFields.length) * 30; // 30% peso
      const completionScore = Math.round(requiredScore + optionalScore);

      // Determinar si puede calcular (al menos 2 de 3 campos requeridos)
      const canCalculate = completedRequired.length >= 2;

      // Generar advertencias clínicas
      const warnings: string[] = [];
      const errors: string[] = [];

      // Validación de edad
      if (formValues.age) {
        if (formValues.age < 18 || formValues.age > 50) {
          errors.push('Edad debe estar entre 18-50 años');
        } else if (formValues.age >= 35) {
          warnings.push(`Edad ${formValues.age} años - Edad materna avanzada`);
        }
      }

      // Validación de BMI
      if (formValues.height && formValues.weight && formValues.height > 0 && formValues.weight > 0) {
        // Calcular BMI usando fórmula estándar consistente
        const heightInMeters = formValues.height / 100;
        const bmi = formValues.weight / (heightInMeters * heightInMeters);
        if (bmi < 18.5) {
          warnings.push(`BMI ${bmi.toFixed(1)} - Bajo peso puede afectar ovulación`);
        } else if (bmi > 30) {
          warnings.push(`BMI ${bmi.toFixed(1)} - Obesidad puede reducir fertilidad`);
        }
      }

      // Campos faltantes
      if (completedRequired.length < requiredFields.length) {
        const missing = requiredFields.filter(field => {
          const value = formValues[field];
          return !(typeof value === 'number' && value > 0);
        });
        warnings.push(`Campos básicos faltantes: ${missing.join(', ')}`);
      }

      setValidationState({
        isValid: errors.length === 0,
        canCalculate,
        completionScore,
        errors,
        warnings,
        fieldValidations: []
      });

    } catch (error) {
      console.error('Error en validación segura:', error);
      setValidationState({
        isValid: false,
        canCalculate: false,
        completionScore: 0,
        errors: ['Error interno de validación'],
        warnings: [],
        fieldValidations: []
      });
    }
  }, [formValues]);

  return {
    validation: validationState,
    getFieldValidation: (fieldName: string) => validateSpecificField(fieldName, formValues),
    getClinicalFeedback: (): ClinicalFeedback => ({
      type: validationState.errors.length > 0 
        ? 'error' 
        : validationState.canCalculate 
        ? 'success' 
        : 'warning',
      title: validationState.errors.length > 0
        ? 'Datos Inválidos'
        : validationState.canCalculate 
        ? 'Datos Válidos' 
        : 'Datos Incompletos',
      messages: validationState.errors.length > 0 
        ? validationState.errors 
        : validationState.warnings.length > 0 
        ? validationState.warnings 
        : ['Formulario en progreso']
    }),
    canCalculate: validationState.canCalculate,
    getCompletionScore: () => validationState.completionScore,
    
    // Propiedades adicionales para facilitar uso
    isValid: validationState.isValid,
    completionScore: validationState.completionScore,
    errors: validationState.errors,
    warnings: validationState.warnings
  };
};