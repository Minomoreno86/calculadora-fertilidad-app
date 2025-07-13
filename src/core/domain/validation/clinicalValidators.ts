/**
 * Validadores clínicos profesionales
 * Integra con tu arquitectura existente sin romper funcionalidad
 * Basado en estándares ASRM, ESHRE, WHO 2021
 */

import { 
  getAMHPercentilesForAge, 
  shouldEvaluateInfertility
} from './referenceRanges';

import {
  ValidationMessage,
  AGE_MESSAGES,
  BMI_MESSAGES,
  AMH_MESSAGES,
  SEMEN_MESSAGES,
  HOMA_IR_MESSAGES,
  TIMELINE_MESSAGES
} from './validationMessages';

// ============= TIPOS DE VALIDACIÓN =============

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationMessage[];
  warnings: ValidationMessage[];
  criticalAlerts: ValidationMessage[];
  recommendations: string[];
  clinicalScore: number; // 0-100, basado en la severidad de hallazgos
}

export interface FieldValidationResult extends ValidationResult {
  fieldName: string;
  value: unknown;
  interpretedValue?: {
    percentile?: number;
    category?: string;
    normalRange?: string;
  };
}

// ============= FUNCIÓN AUXILIAR =============

/**
 * Combina múltiples mensajes en un resumen
 */
function combineValidationMessages(messages: (ValidationMessage | null)[]): {
  errors: ValidationMessage[];
  warnings: ValidationMessage[];
  criticalAlerts: ValidationMessage[];
  allMessages: ValidationMessage[];
} {
  const validMessages = messages.filter((msg): msg is ValidationMessage => msg !== null);
  
  return {
    errors: validMessages.filter(msg => msg.type === 'error'),
    warnings: validMessages.filter(msg => msg.type === 'warning'),
    criticalAlerts: validMessages.filter(msg => msg.type === 'critical'),
    allMessages: validMessages
  };
}

// ============= VALIDADOR PRINCIPAL =============

export class ClinicalValidators {
  
  /**
   * Validación completa de edad reproductiva
   */
  static validateAge(age: number): FieldValidationResult {
    const messages: (ValidationMessage | null)[] = [];
    let clinicalScore = 100;
    
    // Validación básica
    if (!age || age < 18 || age > 50) {
      return {
        fieldName: 'age',
        value: age,
        isValid: false,
        errors: [AGE_MESSAGES.INVALID_RANGE],
        warnings: [],
        criticalAlerts: [],
        recommendations: ['Verificar edad correcta'],
        clinicalScore: 0
      };
    }
    
    // Evaluación por rangos de edad
    if (age >= 42) {
      messages.push(AGE_MESSAGES.CRITICAL_AGE);
      clinicalScore = 15;
    } else if (age >= 40) {
      messages.push(AGE_MESSAGES.VERY_ADVANCED_AGE);
      clinicalScore = 35;
    } else if (age >= 35) {
      messages.push(AGE_MESSAGES.ADVANCED_MATERNAL_AGE);
      clinicalScore = 70;
    }
    
    // Ajuste de score basado en edad exacta
    if (age < 35) {
      clinicalScore = Math.max(85, 100 - (age - 25) * 2);
    }
    
    const combined = combineValidationMessages(messages);
    
    return {
      fieldName: 'age',
      value: age,
      isValid: combined.errors.length === 0,
      errors: combined.errors,
      warnings: combined.warnings,
      criticalAlerts: combined.criticalAlerts,
      recommendations: combined.criticalAlerts.map(alert => alert.recommendation || '').filter(Boolean),
      clinicalScore,
      interpretedValue: {
        category: age < 35 ? 'Óptima' : (age < 40 ? 'Avanzada' : 'Muy avanzada'),
        normalRange: '<35 años para fertilidad óptima'
      }
    };
  }

  /**
   * Validación de BMI para fertilidad
   */
  static validateBMI(height: number, weight: number): FieldValidationResult {
    const messages: (ValidationMessage | null)[] = [];
    let clinicalScore = 100;
    
    // Validación de inputs
    if (!height || height < 140 || height > 220) {
      return {
        fieldName: 'bmi',
        value: null,
        isValid: false,
        errors: [BMI_MESSAGES.INVALID_HEIGHT],
        warnings: [],
        criticalAlerts: [],
        recommendations: ['Verificar altura correcta'],
        clinicalScore: 0
      };
    }
    
    if (!weight || weight < 35 || weight > 200) {
      return {
        fieldName: 'bmi',
        value: null,
        isValid: false,
        errors: [BMI_MESSAGES.INVALID_WEIGHT],
        warnings: [],
        criticalAlerts: [],
        recommendations: ['Verificar peso correcto'],
        clinicalScore: 0
      };
    }
    
    // Calcular BMI usando la misma fórmula que en useCalculations
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    
    // Evaluación clínica del BMI
    if (bmi < 18.5) {
      messages.push(BMI_MESSAGES.UNDERWEIGHT);
      clinicalScore = 60;
    } else if (bmi >= 35) {
      messages.push(BMI_MESSAGES.SEVERE_OBESITY);
      clinicalScore = 20;
    } else if (bmi >= 30) {
      messages.push(BMI_MESSAGES.OBESE);
      clinicalScore = 40;
    } else if (bmi >= 25) {
      messages.push(BMI_MESSAGES.OVERWEIGHT);
      clinicalScore = 75;
    }
    
    const combined = combineValidationMessages(messages);
    
    let category = 'Peso normal';
    if (bmi < 18.5) category = 'Bajo peso';
    else if (bmi >= 35) category = 'Obesidad severa';
    else if (bmi >= 30) category = 'Obesidad';
    else if (bmi >= 25) category = 'Sobrepeso';
    
    return {
      fieldName: 'bmi',
      value: bmi,
      isValid: combined.errors.length === 0,
      errors: combined.errors,
      warnings: combined.warnings,
      criticalAlerts: combined.criticalAlerts,
      recommendations: combined.allMessages.map(msg => msg.recommendation || '').filter(Boolean),
      clinicalScore,
      interpretedValue: {
        category,
        normalRange: '18.5-24.9 kg/m² (óptimo: 20.0-24.0)'
      }
    };
  }

  /**
   * Validación de AMH ajustada por edad
   */
  static validateAMH(amh: number, age: number): FieldValidationResult {
    const messages: (ValidationMessage | null)[] = [];
    let clinicalScore = 100;
    
    // Validación básica
    if (amh < 0 || amh > 20) {
      return {
        fieldName: 'amh',
        value: amh,
        isValid: false,
        errors: [AMH_MESSAGES.INVALID_VALUE],
        warnings: [],
        criticalAlerts: [],
        recommendations: ['Verificar unidades (ng/mL) y resultado'],
        clinicalScore: 0
      };
    }
    
    const percentiles = getAMHPercentilesForAge(age);
    let percentile: number;
    let category: string;
    
    // Determinar percentil y categoría
    if (amh <= percentiles.p5) {
      percentile = 5;
      category = 'Muy bajo';
      messages.push(AMH_MESSAGES.VERY_LOW);
      clinicalScore = 15;
    } else if (amh <= percentiles.p10) {
      percentile = 10;
      category = 'Bajo';
      messages.push(AMH_MESSAGES.LOW_FOR_AGE);
      clinicalScore = 40;
    } else if (amh <= percentiles.p25) {
      percentile = 25;
      category = 'Límite inferior';
      clinicalScore = 70;
    } else if (amh <= percentiles.p75) {
      percentile = 50;
      category = 'Normal';
      clinicalScore = 90;
    } else if (amh <= percentiles.p90) {
      percentile = 75;
      category = 'Alto';
      clinicalScore = 85;
    } else {
      percentile = 90;
      category = 'Muy alto';
      if (age < 35 && amh > 8) {
        messages.push(AMH_MESSAGES.VERY_HIGH);
      }
      clinicalScore = 80;
    }
    
    if (amh === 0) {
      messages.push(AMH_MESSAGES.UNDETECTABLE);
      category = 'Indetectable';
      clinicalScore = 5;
    }
    
    const combined = combineValidationMessages(messages);
    
    return {
      fieldName: 'amh',
      value: amh,
      isValid: combined.errors.length === 0,
      errors: combined.errors,
      warnings: combined.warnings,
      criticalAlerts: combined.criticalAlerts,
      recommendations: combined.allMessages.map(msg => msg.recommendation || '').filter(Boolean),
      clinicalScore,
      interpretedValue: {
        percentile,
        category,
        normalRange: `P25-P75: ${percentiles.p25.toFixed(1)}-${percentiles.p75.toFixed(1)} ng/mL para ${age} años`
      }
    };
  }

  /**
   * Validación de análisis seminal WHO 2021
   */
  static validateSemenAnalysis(params: {
    concentration?: number;
    progressiveMotility?: number;
    normalMorphology?: number;
  }): FieldValidationResult {
    const messages: (ValidationMessage | null)[] = [];
    let clinicalScore = 100;
    const issues: string[] = [];
    
    const { concentration, progressiveMotility, normalMorphology } = params;
    
    // Validar concentración
    if (concentration !== undefined) {
      if (concentration === 0) {
        messages.push(SEMEN_MESSAGES.AZOOSPERMIA);
        clinicalScore = 5;
        issues.push('azoospermia');
      } else if (concentration < 1) {
        messages.push(SEMEN_MESSAGES.SEVERE_OLIGOSPERMIA);
        clinicalScore = Math.min(clinicalScore, 20);
        issues.push('oligospermia severa');
      } else if (concentration < 16) {
        messages.push(SEMEN_MESSAGES.OLIGOSPERMIA);
        clinicalScore = Math.min(clinicalScore, 60);
        issues.push('oligospermia');
      }
    }
    
    // Validar motilidad
    if (progressiveMotility !== undefined) {
      if (progressiveMotility < 32) {
        messages.push(SEMEN_MESSAGES.ASTHENOSPERMIA);
        clinicalScore = Math.min(clinicalScore, 65);
        issues.push('astenospermia');
      }
    }
    
    // Validar morfología
    if (normalMorphology !== undefined) {
      if (normalMorphology < 4) {
        messages.push(SEMEN_MESSAGES.TERATOSPERMIA);
        clinicalScore = Math.min(clinicalScore, 70);
        issues.push('teratospermia');
      }
    }
    
    const combined = combineValidationMessages(messages);
    
    let category: string;
    if (issues.length === 0) {
      category = 'Normal';
    } else if (issues.length === 1) {
      category = 'Factor único';
    } else if (issues.length === 2) {
      category = 'Factor mixto';
    } else {
      category = 'Oligoastenoteratospermia';
    }
    
    return {
      fieldName: 'semenAnalysis',
      value: params,
      isValid: combined.errors.length === 0,
      errors: combined.errors,
      warnings: combined.warnings,
      criticalAlerts: combined.criticalAlerts,
      recommendations: combined.allMessages.map(msg => msg.recommendation || '').filter(Boolean),
      clinicalScore,
      interpretedValue: {
        category,
        normalRange: 'Concentración ≥16M/mL, Motilidad ≥32%, Morfología ≥4%'
      }
    };
  }

  /**
   * Validación de HOMA-IR
   */
  static validateHOMAIR(glucose: number, insulin: number): FieldValidationResult {
    const messages: (ValidationMessage | null)[] = [];
    let clinicalScore = 100;
    
    if (glucose <= 0 || insulin <= 0) {
      return {
        fieldName: 'homaIr',
        value: null,
        isValid: false,
        errors: [{
          type: 'error',
          message: 'Valores de glucosa e insulina requeridos',
          recommendation: 'Obtener valores en ayunas'
        }],
        warnings: [],
        criticalAlerts: [],
        recommendations: ['Obtener glucosa e insulina en ayunas'],
        clinicalScore: 0
      };
    }
    
    const homaIr = Number(((glucose * insulin) / 405).toFixed(2));
    let category = 'Normal';
    
    if (homaIr >= 3.8) {
      messages.push(HOMA_IR_MESSAGES.SEVERE_RESISTANCE);
      category = 'Resistencia severa';
      clinicalScore = 30;
    } else if (homaIr > 2.5) {
      messages.push(HOMA_IR_MESSAGES.INSULIN_RESISTANCE);
      category = 'Resistencia a insulina';
      clinicalScore = 60;
    }
    
    const combined = combineValidationMessages(messages);
    
    return {
      fieldName: 'homaIr',
      value: homaIr,
      isValid: combined.errors.length === 0,
      errors: combined.errors,
      warnings: combined.warnings,
      criticalAlerts: combined.criticalAlerts,
      recommendations: combined.allMessages.map(msg => msg.recommendation || '').filter(Boolean),
      clinicalScore,
      interpretedValue: {
        category,
        normalRange: '<2.5 (normal), 2.5-3.8 (resistencia), >3.8 (severa)'
      }
    };
  }

  /**
   * Validación de tiempo para concebir
   */
  static validateTimeToConception(months: number, age: number): FieldValidationResult {
    const messages: (ValidationMessage | null)[] = [];
    let clinicalScore = 100;
    
    if (months < 0 || months > 120) {
      return {
        fieldName: 'timeToConception',
        value: months,
        isValid: false,
        errors: [{
          type: 'error',
          message: 'Tiempo debe estar entre 0-120 meses',
          recommendation: 'Verificar duración correcta'
        }],
        warnings: [],
        criticalAlerts: [],
        recommendations: ['Verificar tiempo correcto'],
        clinicalScore: 0
      };
    }
    
    const evaluation = shouldEvaluateInfertility(age, months);
    
    if (evaluation.shouldEvaluate) {
      if (evaluation.urgency === 'immediate') {
        messages.push({
          ...TIMELINE_MESSAGES.URGENT_EVALUATION,
          message: evaluation.reason
        });
        clinicalScore = 20;
      } else {
        messages.push({
          ...TIMELINE_MESSAGES.MEETS_INFERTILITY_CRITERIA,
          message: evaluation.reason
        });
        clinicalScore = 40;
      }
    } else {
      messages.push(TIMELINE_MESSAGES.CONTINUE_TRYING);
      clinicalScore = 80;
    }
    
    const combined = combineValidationMessages(messages);
    
    return {
      fieldName: 'timeToConception',
      value: months,
      isValid: combined.errors.length === 0,
      errors: combined.errors,
      warnings: combined.warnings,
      criticalAlerts: combined.criticalAlerts,
      recommendations: combined.allMessages.map(msg => msg.recommendation || '').filter(Boolean),
      clinicalScore,
      interpretedValue: {
        category: evaluation.shouldEvaluate ? 'Requiere evaluación' : 'Continuar intentos',
        normalRange: age < 35 ? '<12 meses' : (age < 40 ? '<6 meses' : '<3 meses')
      }
    };
  }

  /**
   * Validación integral de todos los campos
   */
  static validateCompleteForm(data: {
    age?: number;
    height?: number;
    weight?: number;
    amh?: number;
    timeToConception?: number;
    glucose?: number;
    insulin?: number;
    spermConcentration?: number;
    spermProgressiveMotility?: number;
    spermNormalMorphology?: number;
    cycleLength?: number;
    cycleRegularity?: 'regular' | 'irregular';
  }): {
    overallValidation: ValidationResult;
    fieldValidations: FieldValidationResult[];
    completionScore: number;
    canProceedWithCalculation: boolean;
  } {
    const fieldValidations: FieldValidationResult[] = [];
    let overallScore = 0;
    let validFieldsCount = 0;
    let totalFieldsCount = 0;
    
    // Validar campos requeridos
    if (data.age) {
      const ageValidation = this.validateAge(data.age);
      fieldValidations.push(ageValidation);
      overallScore += ageValidation.clinicalScore * 0.25; // 25% peso
      validFieldsCount += ageValidation.isValid ? 1 : 0;
      totalFieldsCount++;
    }
    
    if (data.height && data.weight) {
      const bmiValidation = this.validateBMI(data.height, data.weight);
      fieldValidations.push(bmiValidation);
      overallScore += bmiValidation.clinicalScore * 0.15; // 15% peso
      validFieldsCount += bmiValidation.isValid ? 1 : 0;
      totalFieldsCount++;
    }
    
    if (data.timeToConception !== undefined && data.age) {
      const timeValidation = this.validateTimeToConception(data.timeToConception, data.age);
      fieldValidations.push(timeValidation);
      overallScore += timeValidation.clinicalScore * 0.20; // 20% peso
      validFieldsCount += timeValidation.isValid ? 1 : 0;
      totalFieldsCount++;
    }
    
    // Validar campos opcionales pero importantes
    if (data.amh && data.age) {
      const amhValidation = this.validateAMH(data.amh, data.age);
      fieldValidations.push(amhValidation);
      overallScore += amhValidation.clinicalScore * 0.25; // 25% peso
      validFieldsCount += amhValidation.isValid ? 1 : 0;
      totalFieldsCount++;
    }
    
    if (data.glucose && data.insulin) {
      const homaValidation = this.validateHOMAIR(data.glucose, data.insulin);
      fieldValidations.push(homaValidation);
      overallScore += homaValidation.clinicalScore * 0.10; // 10% peso
      validFieldsCount += homaValidation.isValid ? 1 : 0;
      totalFieldsCount++;
    }
    
    if (data.spermConcentration || data.spermProgressiveMotility || data.spermNormalMorphology) {
      const semenValidation = this.validateSemenAnalysis({
        concentration: data.spermConcentration,
        progressiveMotility: data.spermProgressiveMotility,
        normalMorphology: data.spermNormalMorphology
      });
      fieldValidations.push(semenValidation);
      overallScore += semenValidation.clinicalScore * 0.05; // 5% peso
      validFieldsCount += semenValidation.isValid ? 1 : 0;
      totalFieldsCount++;
    }
    
    // Consolidar resultados
    const allMessages: ValidationMessage[] = [];
    const allErrors: ValidationMessage[] = [];
    const allWarnings: ValidationMessage[] = [];
    const allCriticalAlerts: ValidationMessage[] = [];
    
    fieldValidations.forEach(fv => {
      allMessages.push(...fv.errors, ...fv.warnings, ...fv.criticalAlerts);
      allErrors.push(...fv.errors);
      allWarnings.push(...fv.warnings);
      allCriticalAlerts.push(...fv.criticalAlerts);
    });
    
    const completionScore = totalFieldsCount > 0 ? Math.round((validFieldsCount / totalFieldsCount) * 100) : 0;
    const canProceedWithCalculation = 
      validFieldsCount >= 3 && // Mínimo 3 campos válidos
      allErrors.length === 0 && // Sin errores críticos
      completionScore >= 60; // Al menos 60% completitud
    
    return {
      overallValidation: {
        isValid: allErrors.length === 0,
        errors: allErrors,
        warnings: allWarnings,
        criticalAlerts: allCriticalAlerts,
        recommendations: [...new Set(allMessages.map(msg => msg.recommendation || '').filter(Boolean))],
        clinicalScore: Math.round(overallScore)
      },
      fieldValidations,
      completionScore,
      canProceedWithCalculation
    };
  }
}