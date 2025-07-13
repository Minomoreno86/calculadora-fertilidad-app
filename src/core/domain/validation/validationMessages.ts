/**
 * Mensajes de validación clínica estandarizados
 * Incluye interpretaciones médicas y recomendaciones
 */

import { getAMHPercentilesForAge } from './referenceRanges';

export interface ValidationMessage {
  type: 'error' | 'warning' | 'info' | 'critical';
  message: string;
  clinicalInterpretation?: string;
  recommendation?: string;
  urgency?: 'low' | 'medium' | 'high' | 'critical';
}

// ============= MENSAJES DE EDAD =============
export const AGE_MESSAGES = {
  INVALID_RANGE: {
    type: 'error' as const,
    message: 'Edad debe estar entre 18 y 50 años',
    clinicalInterpretation: 'Rango fuera de parámetros reproductivos',
    recommendation: 'Verificar edad correcta'
  },
  
  ADVANCED_MATERNAL_AGE: {
    type: 'warning' as const,
    message: 'Edad materna avanzada (≥35 años)',
    clinicalInterpretation: 'Declive acelerado de fertilidad y aumento de riesgos',
    recommendation: 'Evaluación prioritaria y tratamiento oportuno',
    urgency: 'medium' as const
  },
  
  VERY_ADVANCED_AGE: {
    type: 'critical' as const,
    message: 'Edad ≥40 años - Fertilidad severamente comprometida',
    clinicalInterpretation: 'Probabilidad muy baja con óvulos propios',
    recommendation: 'Consulta inmediata con especialista en reproducción',
    urgency: 'critical' as const
  },
  
  CRITICAL_AGE: {
    type: 'critical' as const,
    message: 'Edad ≥42 años - Considerar donación de óvulos',
    clinicalInterpretation: 'Tasas de éxito extremadamente bajas con óvulos propios',
    recommendation: 'Discutir opciones de donación de gametos',
    urgency: 'critical' as const
  }
};

// ============= MENSAJES DE BMI =============
export const BMI_MESSAGES = {
  INVALID_HEIGHT: {
    type: 'error' as const,
    message: 'Altura debe estar entre 140-220 cm',
    recommendation: 'Verificar medición correcta'
  },
  
  INVALID_WEIGHT: {
    type: 'error' as const,
    message: 'Peso debe estar entre 35-200 kg',
    recommendation: 'Verificar medición correcta'
  },
  
  UNDERWEIGHT: {
    type: 'warning' as const,
    message: 'Bajo peso (BMI <18.5) - Riesgo de anovulación',
    clinicalInterpretation: 'El bajo peso puede suprimir el eje reproductivo',
    recommendation: 'Evaluación nutricional y ganancia de peso controlada',
    urgency: 'medium' as const
  },
  
  OVERWEIGHT: {
    type: 'warning' as const,
    message: 'Sobrepeso (BMI 25-29.9) - Impacto moderado en fertilidad',
    clinicalInterpretation: 'Reducción en tasas de embarazo y aumento de complicaciones',
    recommendation: 'Pérdida de peso del 5-10% antes del tratamiento',
    urgency: 'medium' as const
  },
  
  OBESE: {
    type: 'critical' as const,
    message: 'Obesidad (BMI ≥30) - Impacto significativo en fertilidad',
    clinicalInterpretation: 'Reducción marcada en tasas de éxito y aumento de riesgos',
    recommendation: 'Pérdida de peso mandatoria antes de tratamientos',
    urgency: 'high' as const
  },
  
  SEVERE_OBESITY: {
    type: 'critical' as const,
    message: 'Obesidad severa (BMI ≥35) - Contraindicación relativa',
    clinicalInterpretation: 'Riesgo muy alto de complicaciones materno-fetales',
    recommendation: 'Cirugía bariátrica o pérdida significativa antes de embarazo',
    urgency: 'critical' as const
  }
};

// ============= MENSAJES DE AMH =============
export const AMH_MESSAGES = {
  INVALID_VALUE: {
    type: 'error' as const,
    message: 'AMH debe estar entre 0 y 20 ng/mL',
    recommendation: 'Verificar unidades y resultado de laboratorio'
  },
  
  UNDETECTABLE: {
    type: 'critical' as const,
    message: 'AMH indetectable - Falla ovárica prematura',
    clinicalInterpretation: 'Reserva ovárica agotada o severamente comprometida',
    recommendation: 'Evaluación inmediata de falla ovárica prematura',
    urgency: 'critical' as const
  },
  
  VERY_LOW: {
    type: 'critical' as const,
    message: 'AMH críticamente bajo para la edad',
    clinicalInterpretation: 'Reserva ovárica severamente disminuida',
    recommendation: 'Tratamiento inmediato o criopreservación urgente',
    urgency: 'critical' as const
  },
  
  LOW_FOR_AGE: {
    type: 'warning' as const,
    message: 'AMH bajo para la edad (percentil <10)',
    clinicalInterpretation: 'Reserva ovárica disminuida',
    recommendation: 'Evaluar causas y planificar tratamiento oportuno',
    urgency: 'high' as const
  },
  
  VERY_HIGH: {
    type: 'warning' as const,
    message: 'AMH muy elevado - Evaluar PCOS',
    clinicalInterpretation: 'Posible síndrome de ovario poliquístico',
    recommendation: 'Confirmar diagnóstico de PCOS y evaluar riesgo de hiperestimulación',
    urgency: 'medium' as const
  }
};

// ============= MENSAJES DE SEMINOGRAMA =============
export const SEMEN_MESSAGES = {
  SEVERE_OLIGOSPERMIA: {
    type: 'critical' as const,
    message: 'Oligospermia severa (<1 millón/mL)',
    clinicalInterpretation: 'Factor masculino severo',
    recommendation: 'ICSI mandatorio, evaluar causas genéticas',
    urgency: 'high' as const
  },
  
  OLIGOSPERMIA: {
    type: 'warning' as const,
    message: 'Oligospermia (<16 millones/mL)',
    clinicalInterpretation: 'Factor masculino significativo',
    recommendation: 'Evaluar varicocele, estilo de vida, considerar ICSI',
    urgency: 'medium' as const
  },
  
  ASTHENOSPERMIA: {
    type: 'warning' as const,
    message: 'Astenospermia (<32% motilidad progresiva)',
    clinicalInterpretation: 'Motilidad espermática comprometida',
    recommendation: 'Antioxidantes, evaluar infecciones, considerar técnicas avanzadas',
    urgency: 'medium' as const
  },
  
  TERATOSPERMIA: {
    type: 'warning' as const,
    message: 'Teratospermia (<4% formas normales)',
    clinicalInterpretation: 'Morfología espermática alterada',
    recommendation: 'ICSI recomendado, evaluar fragmentación de ADN',
    urgency: 'medium' as const
  },
  
  AZOOSPERMIA: {
    type: 'critical' as const,
    message: 'Azoospermia - Ausencia de espermatozoides',
    clinicalInterpretation: 'Factor masculino severo obstructivo o no obstructivo',
    recommendation: 'Biopsia testicular, evaluación genética, andrología',
    urgency: 'critical' as const
  }
};

// ============= MENSAJES DE HOMA-IR =============
export const HOMA_IR_MESSAGES = {
  INSULIN_RESISTANCE: {
    type: 'warning' as const,
    message: 'Resistencia a insulina (HOMA-IR >2.5)',
    clinicalInterpretation: 'Posible impacto en calidad ovocitaria y respuesta ovárica',
    recommendation: 'Metformina, dieta, ejercicio. Evaluar PCOS',
    urgency: 'medium' as const
  },
  
  SEVERE_RESISTANCE: {
    type: 'critical' as const,
    message: 'Resistencia severa a insulina (HOMA-IR >3.8)',
    clinicalInterpretation: 'Alto riesgo de síndrome metabólico y PCOS',
    recommendation: 'Manejo endocrinológico antes de tratamiento de fertilidad',
    urgency: 'high' as const
  }
};

// ============= MENSAJES DE TIEMPO =============
export const TIMELINE_MESSAGES = {
  MEETS_INFERTILITY_CRITERIA: {
    type: 'critical' as const,
    message: 'Cumple criterios de infertilidad',
    clinicalInterpretation: 'Tiempo suficiente para establecer diagnóstico de infertilidad',
    recommendation: 'Evaluación completa de pareja infértil',
    urgency: 'high' as const
  },
  
  URGENT_EVALUATION: {
    type: 'critical' as const,
    message: 'Evaluación urgente requerida',
    clinicalInterpretation: 'Edad materna avanzada requiere evaluación acelerada',
    recommendation: 'Consulta inmediata con especialista en fertilidad',
    urgency: 'critical' as const
  },
  
  CONTINUE_TRYING: {
    type: 'info' as const,
    message: 'Continuar intentos dirigidos',
    clinicalInterpretation: 'Tiempo insuficiente para definir infertilidad',
    recommendation: 'Optimizar timing de relaciones, estilo de vida saludable',
    urgency: 'low' as const
  }
};

// ============= MENSAJES DE CICLO MENSTRUAL =============
export const CYCLE_MESSAGES = {
  IRREGULAR_CYCLES: {
    type: 'warning' as const,
    message: 'Ciclos menstruales irregulares',
    clinicalInterpretation: 'Posible trastorno ovulatorio',
    recommendation: 'Evaluación hormonal, considerar inducción de ovulación',
    urgency: 'medium' as const
  },
  
  SHORT_CYCLES: {
    type: 'warning' as const,
    message: 'Ciclos cortos (<21 días)',
    clinicalInterpretation: 'Posible fase lútea inadecuada o foliculogénesis acelerada',
    recommendation: 'Monitoreo ovulatorio, evaluación hormonal',
    urgency: 'medium' as const
  },
  
  LONG_CYCLES: {
    type: 'warning' as const,
    message: 'Ciclos largos (>35 días)',
    clinicalInterpretation: 'Posible anovulación u oligoovulación',
    recommendation: 'Evaluación de PCOS, inducción de ovulación',
    urgency: 'medium' as const
  }
};

// ============= FUNCIONES AUXILIARES =============

/**
 * Obtiene mensaje apropiado para AMH basado en edad
 */
export function getAMHValidationMessage(amh: number, age: number): ValidationMessage | null {
  if (amh < 0 || amh > 20) {
    return AMH_MESSAGES.INVALID_VALUE;
  }
  
  if (amh === 0) {
    return AMH_MESSAGES.UNDETECTABLE;
  }
  
  // Usar percentiles para determinar mensaje - CORREGIDO
  const percentiles = getAMHPercentilesForAge(age);
  
  if (amh < percentiles.p5) {
    return AMH_MESSAGES.VERY_LOW;
  } else if (amh < percentiles.p10) {
    return AMH_MESSAGES.LOW_FOR_AGE;
  } else if (amh > 8 && age < 35) {
    return AMH_MESSAGES.VERY_HIGH;
  }
  
  return null;
}

/**
 * Obtiene mensaje apropiado para BMI
 */
export function getBMIValidationMessage(bmi: number): ValidationMessage | null {
  if (bmi < 18.5) {
    return BMI_MESSAGES.UNDERWEIGHT;
  } else if (bmi >= 35) {
    return BMI_MESSAGES.SEVERE_OBESITY;
  } else if (bmi >= 30) {
    return BMI_MESSAGES.OBESE;
  } else if (bmi >= 25) {
    return BMI_MESSAGES.OVERWEIGHT;
  }
  
  return null;
}

/**
 * Combina múltiples mensajes en un resumen
 */
export function combineValidationMessages(messages: (ValidationMessage | null)[]): {
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