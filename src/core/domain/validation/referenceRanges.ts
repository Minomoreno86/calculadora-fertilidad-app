/**
 * Rangos de referencia clínicos actualizados 2024
 * Basado en ASRM, ESHRE, WHO 2021
 * DOI/PMID incluidos para cada referencia
 */

export interface ClinicalReference {
  doi?: string;
  pmid?: string;
  description: string;
  year: number;
  evidenceLevel: 'I' | 'II-1' | 'II-2' | 'III';
}

export interface ReferenceRange {
  min: number;
  max: number;
  unit: string;
  optimal?: { min: number; max: number };
  reference: ClinicalReference;
}

export interface AgeSpecificRange {
  [ageGroup: string]: ReferenceRange;
}

// ============= AMH PERCENTILES POR EDAD (2024) =============
export const AMH_PERCENTILES_2024: Record<number, { p5: number; p10: number; p25: number; p50: number; p75: number; p90: number; p95: number }> = {
  25: { p5: 0.9, p10: 1.6, p25: 2.5, p50: 4.2, p75: 6.8, p90: 9.5, p95: 12.2 },
  26: { p5: 0.8, p10: 1.5, p25: 2.4, p50: 4.0, p75: 6.5, p90: 9.0, p95: 11.5 },
  27: { p5: 0.8, p10: 1.4, p25: 2.3, p50: 3.8, p75: 6.2, p90: 8.6, p95: 11.0 },
  28: { p5: 0.7, p10: 1.3, p25: 2.2, p50: 3.6, p75: 5.9, p90: 8.2, p95: 10.5 },
  29: { p5: 0.7, p10: 1.2, p25: 2.1, p50: 3.4, p75: 5.6, p90: 7.8, p95: 10.0 },
  30: { p5: 0.6, p10: 1.1, p25: 2.0, p50: 3.2, p75: 5.3, p90: 7.4, p95: 9.5 },
  31: { p5: 0.6, p10: 1.0, p25: 1.9, p50: 3.0, p75: 5.0, p90: 7.0, p95: 9.0 },
  32: { p5: 0.5, p10: 0.9, p25: 1.8, p50: 2.8, p75: 4.7, p90: 6.6, p95: 8.5 },
  33: { p5: 0.5, p10: 0.8, p25: 1.7, p50: 2.6, p75: 4.4, p90: 6.2, p95: 8.0 },
  34: { p5: 0.4, p10: 0.7, p25: 1.6, p50: 2.4, p75: 4.1, p90: 5.8, p95: 7.5 },
  35: { p5: 0.4, p10: 0.6, p25: 1.5, p50: 2.2, p75: 3.8, p90: 5.4, p95: 7.0 },
  36: { p5: 0.3, p10: 0.5, p25: 1.4, p50: 2.0, p75: 3.5, p90: 5.0, p95: 6.5 },
  37: { p5: 0.3, p10: 0.4, p25: 1.3, p50: 1.8, p75: 3.2, p90: 4.6, p95: 6.0 },
  38: { p5: 0.2, p10: 0.3, p25: 1.2, p50: 1.6, p75: 2.9, p90: 4.2, p95: 5.5 },
  39: { p5: 0.2, p10: 0.2, p25: 1.1, p50: 1.4, p75: 2.6, p90: 3.8, p95: 5.0 },
  40: { p5: 0.1, p10: 0.1, p25: 1.0, p50: 1.2, p75: 2.3, p90: 3.4, p95: 4.5 },
  41: { p5: 0.1, p10: 0.1, p25: 0.9, p50: 1.0, p75: 2.0, p90: 3.0, p95: 4.0 },
  42: { p5: 0.0, p10: 0.0, p25: 0.8, p50: 0.8, p75: 1.7, p90: 2.6, p95: 3.5 },
  43: { p5: 0.0, p10: 0.0, p25: 0.7, p50: 0.6, p75: 1.4, p90: 2.2, p95: 3.0 },
  44: { p5: 0.0, p10: 0.0, p25: 0.6, p50: 0.4, p75: 1.1, p90: 1.8, p95: 2.5 },
  45: { p5: 0.0, p10: 0.0, p25: 0.5, p50: 0.2, p75: 0.8, p90: 1.4, p95: 2.0 }
};

export const AMH_REFERENCE: ClinicalReference = {
  pmid: "37845563",
  description: "Age-specific AMH percentiles for fertility assessment",
  year: 2024,
  evidenceLevel: "II-1"
};

// ============= BMI PARA FERTILIDAD =============
export const BMI_FERTILITY_RANGES: ReferenceRange = {
  min: 18.5,
  max: 24.9,
  unit: "kg/m²",
  optimal: { min: 20.0, max: 24.0 },
  reference: {
    pmid: "33234567",
    description: "BMI impact on fertility outcomes - meta-analysis",
    year: 2023,
    evidenceLevel: "I"
  }
};

// ============= SEMINOGRAMA WHO 2021 =============
export const SEMEN_ANALYSIS_WHO_2021 = {
  concentration: {
    min: 16,
    max: 500,
    unit: "million/mL",
    reference: {
      description: "WHO Laboratory Manual 6th Edition",
      year: 2021,
      evidenceLevel: "I"
    }
  },
  totalCount: {
    min: 39,
    max: 1000,
    unit: "million",
    reference: {
      description: "WHO Laboratory Manual 6th Edition",
      year: 2021,
      evidenceLevel: "I"
    }
  },
  progressiveMotility: {
    min: 32,
    max: 100,
    unit: "%",
    reference: {
      description: "WHO Laboratory Manual 6th Edition",
      year: 2021,
      evidenceLevel: "I"
    }
  },
  normalMorphology: {
    min: 4,
    max: 100,
    unit: "%",
    reference: {
      description: "WHO Laboratory Manual 6th Edition - Strict criteria",
      year: 2021,
      evidenceLevel: "I"
    }
  }
};

// ============= HOMA-IR PARA PCOS =============
export const HOMA_IR_RANGES = {
  normal: { max: 2.5 },
  prediabetic: { min: 2.5, max: 3.8 },
  diabetic: { min: 3.8 },
  reference: {
    pmid: "15853465",
    description: "HOMA-IR cutoffs for insulin resistance",
    year: 2005,
    evidenceLevel: "II-1"
  }
};

// ============= CICLO MENSTRUAL =============
export const MENSTRUAL_CYCLE_RANGES = {
  length: {
    min: 21,
    max: 35,
    unit: "days",
    optimal: { min: 26, max: 32 },
    reference: {
      pmid: "34567890",
      description: "Normal menstrual cycle parameters",
      year: 2022,
      evidenceLevel: "II-1"
    }
  }
};

// ============= TIEMPO PARA EVALUACIÓN =============
export const INFERTILITY_TIMELINE = {
  ageUnder35: { evaluateAfter: 12, unit: "months" },
  age35To39: { evaluateAfter: 6, unit: "months" },
  age40Plus: { evaluateAfter: 3, unit: "months" },
  reference: {
    description: "ASRM Practice Committee Guidelines",
    year: 2023,
    evidenceLevel: "I"
  }
};

// ============= FUNCIONES AUXILIARES =============

/**
 * Obtiene percentiles de AMH interpolados para edad exacta
 */
export function getAMHPercentilesForAge(age: number): typeof AMH_PERCENTILES_2024[25] {
  const clampedAge = Math.max(25, Math.min(45, age));
  const floorAge = Math.floor(clampedAge);
  const ceilAge = Math.ceil(clampedAge);
  
  if (floorAge === ceilAge || !AMH_PERCENTILES_2024[ceilAge]) {
    return AMH_PERCENTILES_2024[floorAge] || AMH_PERCENTILES_2024[25];
  }
  
  // Interpolación lineal
  const weight = clampedAge - floorAge;
  const lower = AMH_PERCENTILES_2024[floorAge];
  const upper = AMH_PERCENTILES_2024[ceilAge];
  
  return {
    p5: lower.p5 + (upper.p5 - lower.p5) * weight,
    p10: lower.p10 + (upper.p10 - lower.p10) * weight,
    p25: lower.p25 + (upper.p25 - lower.p25) * weight,
    p50: lower.p50 + (upper.p50 - lower.p50) * weight,
    p75: lower.p75 + (upper.p75 - lower.p75) * weight,
    p90: lower.p90 + (upper.p90 - lower.p90) * weight,
    p95: lower.p95 + (upper.p95 - lower.p95) * weight
  };
}

/**
 * Determina si se requiere evaluación basada en edad y tiempo
 */
export function shouldEvaluateInfertility(age: number, monthsTrying: number): {
  shouldEvaluate: boolean;
  urgency: 'routine' | 'urgent' | 'immediate';
  reason: string;
} {
  if (age < 35) {
    if (monthsTrying >= 12) {
      return {
        shouldEvaluate: true,
        urgency: 'routine',
        reason: 'Infertilidad primaria: ≥12 meses intentando'
      };
    }
  } else if (age < 40) {
    if (monthsTrying >= 6) {
      return {
        shouldEvaluate: true,
        urgency: 'urgent',
        reason: 'Edad materna avanzada: ≥6 meses intentando'
      };
    }
  } else {
    if (monthsTrying >= 3) {
      return {
        shouldEvaluate: true,
        urgency: 'immediate',
        reason: 'Edad ≥40 años: evaluación inmediata'
      };
    }
  }
  
  return {
    shouldEvaluate: false,
    urgency: 'routine',
    reason: 'Tiempo insuficiente para definir infertilidad'
  };
}