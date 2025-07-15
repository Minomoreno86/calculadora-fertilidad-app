/**
 * Hook de validación simple que funciona PERFECTAMENTE con tu FormState
 * SINERGIA TOTAL entre formularios y validación clínica
 */

import { useMemo } from 'react';
import type { FormState } from '@/presentation/features/calculator/types/calculator.types';

interface SimpleValidationResult {
  isValid: boolean;
  message: string;
  type: 'success' | 'warning' | 'error';
}

interface CompletenessResult {
  percentage: number;
  canCalculate: boolean;
  message: string;
}

interface UseSimpleValidationReturn {
  ageValidation: SimpleValidationResult;
  bmiValidation: SimpleValidationResult;
  cycleValidation?: SimpleValidationResult;
  amhValidation?: SimpleValidationResult;
  spermValidation?: SimpleValidationResult;
  hormonalValidation?: SimpleValidationResult; // 🆕 Nueva validación hormonal
  metabolicValidation?: SimpleValidationResult; // 🆕 Nueva validación metabólica
  completeness: CompletenessResult;
  canCalculate: boolean;
  completionPercentage: number;
  getClinicalScore: () => number;
  getRecommendations: () => string[];
  getUrgencyLevel: () => 'low' | 'medium' | 'high' | 'urgent'; // 🆕 Nivel de urgencia
}

/**
 * Hook que crea SINERGIA PERFECTA con tu formulario existente
 * @param formValues - Datos del FormState (watch())
 * @returns Validaciones simples y efectivas
 */
export const useSimpleValidation = (
  formValues: Partial<FormState> | null | undefined
): UseSimpleValidationReturn => {
  
  // Validación de edad con criterios clínicos ACTUALIZADOS
  const ageValidation = useMemo((): SimpleValidationResult => {
    const ageValue = formValues?.age ? parseFloat(formValues.age) : 0;
    
    if (!formValues?.age || isNaN(ageValue) || ageValue <= 0) {
      return {
        isValid: false,
        message: 'Edad requerida para evaluación de fertilidad',
        type: 'error'
      };
    }
    
    if (ageValue < 18) {
      return {
        isValid: false,
        message: 'Edad mínima 18 años para evaluación reproductiva',
        type: 'error'
      };
    }
    
    if (ageValue > 55) {
      return {
        isValid: false,
        message: 'Edad máxima 55 años para tratamientos reproductivos',
        type: 'error'
      };
    }
    
    if (ageValue >= 40) {
      return {
        isValid: true,
        message: `Edad ${ageValue} años - Fertilidad reducida. Evaluación urgente recomendada`,
        type: 'warning'
      };
    }
    
    if (ageValue >= 35) {
      return {
        isValid: true,
        message: `Edad ${ageValue} años - Declive de fertilidad. Considerar evaluación prioritaria`,
        type: 'warning'
      };
    }
    
    return {
      isValid: true,
      message: `Edad ${ageValue} años - Rango óptimo para fertilidad natural y TRA`,
      type: 'success'
    };
  }, [formValues?.age]);

  // Validación de BMI con criterios ACTUALIZADOS para fertilidad
  const bmiValidation = useMemo((): SimpleValidationResult => {
    const heightValue = formValues?.height ? parseFloat(formValues.height) : 0;
    const weightValue = formValues?.weight ? parseFloat(formValues.weight) : 0;
    
    if (!formValues?.height || !formValues?.weight || 
        isNaN(heightValue) || isNaN(weightValue) ||
        heightValue <= 0 || weightValue <= 0) {
      return {
        isValid: false,
        message: 'Altura y peso requeridos para evaluación metabólica',
        type: 'error'
      };
    }

    // Calcular BMI usando fórmula estándar consistente
    const heightInMeters = heightValue / 100;
    const bmi = weightValue / (heightInMeters * heightInMeters);
    
    if (bmi < 18.5) {
      return {
        isValid: true,
        message: `IMC ${bmi.toFixed(1)} - Bajo peso. Puede afectar ovulación y calidad ovocitaria`,
        type: 'warning'
      };
    } else if (bmi >= 35) {
      return {
        isValid: true,
        message: `IMC ${bmi.toFixed(1)} - Obesidad severa. Riesgo aumentado en TRA`,
        type: 'warning'
      };
    } else if (bmi >= 30) {
      return {
        isValid: true,
        message: `IMC ${bmi.toFixed(1)} - Obesidad. Optimizar peso antes de TRA`,
        type: 'warning'
      };
    } else if (bmi >= 25) {
      return {
        isValid: true,
        message: `IMC ${bmi.toFixed(1)} - Sobrepeso leve. Monitorear durante tratamiento`,
        type: 'warning'
      };
    }
    
    return {
      isValid: true,
      message: `IMC ${bmi.toFixed(1)} - Peso ideal para maximizar éxito en TRA`,
      type: 'success'
    };
  }, [formValues?.height, formValues?.weight]);

  // Validación de ciclo menstrual con RANGOS MÉDICOS CORRECTOS
  const cycleValidation = useMemo((): SimpleValidationResult | undefined => {
    const cycleLengthValue = formValues?.cycleLength ? parseFloat(formValues.cycleLength) : 0;
    
    if (!formValues?.cycleLength || isNaN(cycleLengthValue) || cycleLengthValue <= 0) {
      return undefined; // No mostrar si no hay datos
    }

    if (cycleLengthValue >= 21 && cycleLengthValue <= 35) {
      return {
        isValid: true,
        message: `Ciclo de ${cycleLengthValue} días - Duración normal`,
        type: 'success'
      };
    } else if (cycleLengthValue >= 36 && cycleLengthValue <= 45) {
      return {
        isValid: true,
        message: `Ciclo de ${cycleLengthValue} días - Ciclo largo, posible anovulación`,
        type: 'warning'
      };
    } else if (cycleLengthValue >= 15 && cycleLengthValue <= 20) {
      return {
        isValid: true,
        message: `Ciclo de ${cycleLengthValue} días - Ciclo corto, posible fase lútea insuficiente`,
        type: 'warning'
      };
    } else if (cycleLengthValue > 45) {
      return {
        isValid: true,
        message: `Ciclo de ${cycleLengthValue} días - Oligomenorrea, probable anovulación`,
        type: 'warning'
      };
    } else {
      return {
        isValid: true,
        message: `Ciclo de ${cycleLengthValue} días - Duración muy anormal, requiere evaluación`,
        type: 'warning'
      };
    }
  }, [formValues?.cycleLength]);

  // Validación de AMH con rangos por EDAD (más preciso clínicamente)
  const amhValidation = useMemo((): SimpleValidationResult | undefined => {
    const amhValue = formValues?.amhValue ? parseFloat(formValues.amhValue) : 0;
    
    if (!formValues?.amhValue || isNaN(amhValue) || amhValue <= 0) {
      return undefined; // No mostrar si no hay datos
    }

    const ageValue = formValues?.age ? parseFloat(formValues.age) : 30;
    
    // Rangos por edad según evidencia ASRM 2023
    if (ageValue < 30) {
      if (amhValue < 1.2) {
        return {
          isValid: true,
          message: `AMH ${amhValue.toFixed(1)} ng/ml - Reserva baja para edad <30. Evaluación urgente`,
          type: 'warning'
        };
      } else if (amhValue > 6.0) {
        return {
          isValid: true,
          message: `AMH ${amhValue.toFixed(1)} ng/ml - Reserva muy alta. Riesgo SHO en estimulación`,
          type: 'warning'
        };
      }
    } else if (ageValue < 35) {
      if (amhValue < 1.0) {
        return {
          isValid: true,
          message: `AMH ${amhValue.toFixed(1)} ng/ml - Reserva baja para edad 30-35. TRA prioritario`,
          type: 'warning'
        };
      } else if (amhValue > 5.0) {
        return {
          isValid: true,
          message: `AMH ${amhValue.toFixed(1)} ng/ml - Reserva alta. Protocolo suave recomendado`,
          type: 'warning'
        };
      }
    } else if (ageValue >= 35) {
      if (amhValue < 0.8) {
        return {
          isValid: true,
          message: `AMH ${amhValue.toFixed(1)} ng/ml - Reserva muy baja para edad ≥35. Consejería urgente`,
          type: 'warning'
        };
      }
    }
    
    return {
      isValid: true,
      message: `AMH ${amhValue.toFixed(1)} ng/ml - Reserva adecuada para edad ${ageValue} años`,
      type: 'success'
    };
  }, [formValues?.amhValue, formValues?.age]);

  // Validación de factor masculino - SINERGIA CON MaleFactorForm
  const spermValidation = useMemo((): SimpleValidationResult | undefined => {
    const { spermConcentration, spermProgressiveMotility, spermNormalMorphology } = formValues || {};
    
    if (!spermConcentration && !spermProgressiveMotility && !spermNormalMorphology) {
      return undefined; // No mostrar si no hay datos
    }

    const issues: string[] = [];
    
    if (spermConcentration && spermConcentration > 0 && spermConcentration < 15) {
      issues.push('concentración baja');
    }
    
    if (spermProgressiveMotility && spermProgressiveMotility > 0 && spermProgressiveMotility < 32) {
      issues.push('motilidad reducida');
    }
    
    if (spermNormalMorphology && spermNormalMorphology > 0 && spermNormalMorphology < 4) {
      issues.push('morfología alterada');
    }

    if (issues.length > 0) {
      return {
        isValid: true,
        message: `Seminograma: ${issues.join(', ')}. Considerar ICSI si FIV indicada`,
        type: 'warning'
      };
    }
    
    if (spermConcentration || spermProgressiveMotility || spermNormalMorphology) {
      return {
        isValid: true,
        message: 'Parámetros seminales dentro de rangos normales (WHO 2021)',
        type: 'success'
      };
    }

    return undefined;
  }, [formValues?.spermConcentration, formValues?.spermProgressiveMotility, formValues?.spermNormalMorphology]);

  // 🆕 Validación hormonal integral (TSH, Prolactina, etc.)
  const hormonalValidation = useMemo((): SimpleValidationResult | undefined => {
    const { tshValue, prolactinValue } = formValues || {};
    
    if (!tshValue && !prolactinValue) {
      return undefined; // No mostrar si no hay datos hormonales
    }
    
    const issues: string[] = [];
    
    if (tshValue) {
      if (tshValue > 4.0) {
        issues.push('TSH elevada (>4.0 mU/L)');
      } else if (tshValue < 0.5) {
        issues.push('TSH suprimida (<0.5 mU/L)');
      }
    }
    
    if (prolactinValue) {
      if (prolactinValue > 25) {
        issues.push('Prolactina elevada (>25 ng/mL)');
      }
    }
    
    if (issues.length > 0) {
      return {
        isValid: true,
        message: `Alteraciones hormonales: ${issues.join(', ')}. Requiere manejo endocrino`,
        type: 'warning'
      };
    }
    
    if (tshValue || prolactinValue) {
      return {
        isValid: true,
        message: 'Perfil hormonal tiroideo/prolactina dentro de rangos óptimos',
        type: 'success'
      };
    }
    
    return undefined;
  }, [formValues?.tshValue, formValues?.prolactinValue]);

  // 🆕 Validación metabólica (Insulina, Glucosa - calcular HOMA)
  const metabolicValidation = useMemo((): SimpleValidationResult | undefined => {
    const { glucoseValue, insulinValue } = formValues || {};
    
    if (!glucoseValue && !insulinValue) {
      return undefined; // No mostrar si no hay datos metabólicos
    }
    
    const issues: string[] = [];
    let calculatedHoma: number | undefined;
    
    // Calcular HOMA si tenemos ambos valores
    if (glucoseValue && insulinValue && glucoseValue > 0 && insulinValue > 0) {
      calculatedHoma = (glucoseValue * insulinValue) / 405;
      if (calculatedHoma > 3.8) {
        issues.push('resistencia a insulina (HOMA >3.8)');
      }
    }
    
    if (glucoseValue && glucoseValue > 100) {
      issues.push('glucosa elevada en ayunas');
    }
    
    if (insulinValue && insulinValue > 15) {
      issues.push('hiperinsulinemia');
    }
    
    if (issues.length > 0) {
      return {
        isValid: true,
        message: `Alteraciones metabólicas: ${issues.join(', ')}. Evaluar síndrome metabólico`,
        type: 'warning'
      };
    }
    
    if (glucoseValue || insulinValue) {
      const homaText = calculatedHoma ? ` (HOMA: ${calculatedHoma.toFixed(1)})` : '';
      return {
        isValid: true,
        message: `Perfil metabólico favorable para TRA${homaText}`,
        type: 'success'
      };
    }
    
    return undefined;
  }, [formValues?.glucoseValue, formValues?.insulinValue]);

  // Completitud con SINERGIA INTELIGENTE
  const completeness = useMemo((): CompletenessResult => {
    if (!formValues) {
      return {
        percentage: 0,
        canCalculate: false,
        message: 'Sin datos del formulario'
      };
    }

    // Campos CRÍTICOS (peso 50%) - Los mismos que usa tu formProgress
    const criticalFields = ['age', 'height', 'weight', 'cycleLength', 'infertilityDuration'];
    
    // Campos IMPORTANTES (peso 30%) - Coincide con tu lógica
    const importantFields = ['amhValue', 'spermConcentration', 'insulinValue', 'glucoseValue'];
    
    // Campos COMPLEMENTARIOS (peso 20%)
    const complementaryFields = ['tshValue', 'prolactinValue', 'spermProgressiveMotility', 'cycleRegularity'];
    
    const isFieldValid = (fieldName: string): boolean => {
      const value = formValues[fieldName as keyof FormState];
      if (value === undefined || value === null) return false;
      
      if (typeof value === 'number') return value > 0;
      if (typeof value === 'string') return value.trim() !== '';
      return true;
    };
    
    const criticalCount = criticalFields.filter(isFieldValid).length;
    const importantCount = importantFields.filter(isFieldValid).length;
    const complementaryCount = complementaryFields.filter(isFieldValid).length;
    
    // Score exactamente igual a tu useCalculatorForm
    const criticalScore = (criticalCount / criticalFields.length) * 50;
    const importantScore = (importantCount / importantFields.length) * 30;
    const complementaryScore = (complementaryCount / complementaryFields.length) * 20;
    
    const percentage = Math.round(criticalScore + importantScore + complementaryScore);
    const canCalculate = criticalCount >= 4; // Al menos 4 de 5 campos críticos
    
    return {
      percentage,
      canCalculate,
      message: canCalculate 
        ? `Formulario completo al ${percentage}% - Listo para cálculo`
        : `Progreso ${percentage}% - Completa campos básicos (${criticalCount}/${criticalFields.length})`
    };
  }, [formValues]);

  // Score clínico con SINERGIA
  const getClinicalScore = (): number => {
    let score = 0;
    let maxScore = 0;
    
    // Edad (peso 30%)
    maxScore += 30;
    if (ageValidation.isValid) {
      if (ageValidation.type === 'success') score += 30;
      else if (ageValidation.type === 'warning') score += 20;
    }
    
    // BMI (peso 25%)
    maxScore += 25;
    if (bmiValidation.isValid) {
      if (bmiValidation.type === 'success') score += 25;
      else if (bmiValidation.type === 'warning') score += 15;
    }
    
    // AMH (peso 25%)
    if (amhValidation) {
      maxScore += 25;
      if (amhValidation.type === 'success') score += 25;
      else if (amhValidation.type === 'warning') score += 15;
    }
    
    // Factor masculino (peso 20%)
    if (spermValidation) {
      maxScore += 20;
      if (spermValidation.type === 'success') score += 20;
      else if (spermValidation.type === 'warning') score += 10;
    }
    
    return maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  };

  // Recomendaciones MEJORADAS con priorización clínica
  const getRecommendations = (): string[] => {
    const recommendations: string[] = [];
    const urgency = getUrgencyLevel();
    
    // Recomendaciones por urgencia
    if (urgency === 'urgent') {
      recommendations.push('🚨 URGENTE: Consulta inmediata con especialista en medicina reproductiva');
    } else if (urgency === 'high') {
      recommendations.push('⚠️ ALTA PRIORIDAD: Programar evaluación reproductiva en 2-4 semanas');
    }
    
    // Recomendaciones específicas por validación
    if (ageValidation.type === 'warning' && formValues?.age && formValues.age >= 40) {
      recommendations.push('Evaluación de reserva ovárica completa (AMH, FSH, AFC, inhibina B)');
      recommendations.push('Consejería sobre donación de ovocitos si AMH <1.0');
    } else if (ageValidation.type === 'warning') {
      recommendations.push('Evaluación prioritaria de reserva ovárica (AMH, FSH, AFC)');
    }
    
    if (bmiValidation.type === 'warning') {
      if (formValues?.weight && formValues?.height) {
        // Calcular BMI usando fórmula estándar consistente
        const heightInMeters = formValues.height / 100;
        const bmi = formValues.weight / (heightInMeters * heightInMeters);
        if (bmi >= 30) {
          recommendations.push('Programa de pérdida de peso pre-concepcional (objetivo: IMC <30)');
        } else if (bmi < 18.5) {
          recommendations.push('Evaluación nutricional para ganancia de peso saludable');
        }
      }
    }
    
    if (amhValidation?.type === 'warning') {
      recommendations.push('Consulta especializada en baja reserva ovárica');
      recommendations.push('Considerar preservación de fertilidad si no hay deseo inmediato');
    }
    
    if (spermValidation?.type === 'warning') {
      recommendations.push('Evaluación andrológica especializada');
      recommendations.push('Espermograma con morfología estricta y fragmentación de ADN');
    }
    
    if (hormonalValidation?.type === 'warning') {
      recommendations.push('Manejo endocrinológico previo a TRA');
    }
    
    if (metabolicValidation?.type === 'warning') {
      recommendations.push('Evaluación y manejo del síndrome metabólico');
      if (formValues?.glucoseValue && formValues?.insulinValue) {
        const homa = (formValues.glucoseValue * formValues.insulinValue) / 405;
        if (homa > 3.8) {
          recommendations.push('Considerar metformina para resistencia a insulina');
        }
      }
    }
    
    // Recomendaciones proactivas
    if (!formValues?.amhValue && formValues?.age && formValues.age >= 30) {
      recommendations.push('Solicitar AMH para evaluación de reserva ovárica');
    }
    
    if (!formValues?.spermConcentration && formValues?.age && formValues.age >= 30) {
      recommendations.push('Solicitar espermograma básico de pareja masculina');
    }
    
    // Estilo de vida general
    if (urgency !== 'low') {
      recommendations.push('Optimización inmediata: ácido fólico, vitamina D, cesación tabaco/alcohol');
    }
    
    return recommendations;
  };

  // 🆕 Función para determinar nivel de urgencia clínica
  const getUrgencyLevel = (): 'low' | 'medium' | 'high' | 'urgent' => {
    let urgencyScore = 0;
    
    // Edad (factor más crítico)
    if (formValues?.age) {
      if (formValues.age >= 42) urgencyScore += 4;
      else if (formValues.age >= 38) urgencyScore += 3;
      else if (formValues.age >= 35) urgencyScore += 2;
      else if (formValues.age >= 30) urgencyScore += 1;
    }
    
    // AMH (reserva ovárica)
    if (formValues?.amhValue) {
      if (formValues.amhValue < 0.5) urgencyScore += 3;
      else if (formValues.amhValue < 1.0) urgencyScore += 2;
      else if (formValues.amhValue < 1.5) urgencyScore += 1;
    }
    
    // Duración de infertilidad
    if (formValues?.infertilityDuration) {
      if (formValues.infertilityDuration > 36) urgencyScore += 2;
      else if (formValues.infertilityDuration > 24) urgencyScore += 1;
    }
    
    // Factor masculino severo
    if (formValues?.spermConcentration && formValues.spermConcentration < 5) {
      urgencyScore += 2;
    }
    
    // Retornar nivel según score
    if (urgencyScore >= 7) return 'urgent';
    if (urgencyScore >= 5) return 'high';
    if (urgencyScore >= 3) return 'medium';
    return 'low';
  };

  return {
    ageValidation,
    bmiValidation,
    cycleValidation,
    amhValidation,
    spermValidation,
    hormonalValidation,
    metabolicValidation,
    completeness,
    canCalculate: completeness.canCalculate,
    completionPercentage: completeness.percentage,
    getClinicalScore,
    getRecommendations,
    getUrgencyLevel
  };
};