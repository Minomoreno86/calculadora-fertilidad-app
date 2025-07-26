// 🧪 HORMONAL ANALYSIS NESTED DOMAINS MODULE V13.1
// Análisis especializado para perfiles hormonales con nested intelligence

import { AnalysisResult, Factors } from '@/core/domain/models';

// 🎯 TYPES FOR HORMONAL ANALYSIS
type EvidenceLevel = 'A' | 'B' | 'C';
type Priority = 'high' | 'medium' | 'low';

// 🎯 NESTED HORMONAL DOMAINS CONFIGURATION
export const HORMONAL_DOMAINS = {
  AMH: {
    domain: 'ovarian_reserve',
    thresholds: { severe: 0.3, moderate: 0.6, mild: 1.0 },
    evidence: 'A',
    pmid: '29453926'
  },
  TSH: {
    domain: 'thyroid_function',
    thresholds: { mild: 2.5, moderate: 5.0, severe: 10.0 },
    evidence: 'A', 
    pmid: '28218867'
  },
  PROLACTIN: {
    domain: 'prolactin_axis',
    thresholds: { mild: 25, moderate: 50, severe: 100 },
    evidence: 'A',
    pmid: '25006718'
  },
  HOMA: {
    domain: 'insulin_resistance',
    thresholds: { mild: 2.5, moderate: 3.5, severe: 5.0 },
    evidence: 'A',
    pmid: '28344928'
  }
} as const;

// 🧠 AMH NESTED ANALYSIS DOMAIN
export const analyzeAMHFactors = (factors: Factors): AnalysisResult[] => {
  const results: AnalysisResult[] = [];
  
  // Solo analizar si AMH está presente y es menor a valores normales (< 1.0 ng/mL)
  if (factors.amh !== undefined && factors.amh < 1.0) {
    const amhLevel = factors.amh;
    const domain = HORMONAL_DOMAINS.AMH;
    
    if (amhLevel < 0.3) {
      results.push({
        type: 'hypothesis',
        data: {
          condition: 'Reserva Ovárica Severamente Disminuida (AMH <0.3 ng/mL)',
          probability: 95,
          reasoning: 'Falla ovárica inminente - Fertilidad natural muy baja + respuesta pobre TRA',
          evidenceLevel: domain.evidence as EvidenceLevel,
          pmid: domain.pmid
        }
      });

      results.push({
        type: 'treatment',
        data: {
          treatment: 'FIV inmediata + protocolo antagonista suave',
          priority: 'high' as Priority,
          successRate: 25,
          timeframe: 'Máximo 2-3 intentos',
          reasoning: 'Ventana terapéutica limitada - Urgencia reproductiva'
        }
      });
    } else if (amhLevel < 0.6) {
      results.push({
        type: 'hypothesis',
        data: {
          condition: 'Reserva Ovárica Disminuida (AMH 0.3-0.6 ng/mL)',
          probability: 85,
          reasoning: 'Reserva ovárica baja - Fertilidad tiempo-dependiente + respuesta subóptima',
          evidenceLevel: domain.evidence as EvidenceLevel,
          pmid: domain.pmid
        }
      });

      results.push({
        type: 'treatment',
        data: {
          treatment: 'FIV con protocolo agonista/antagonista + DHEA',
          priority: 'high' as Priority,
          successRate: 45,
          timeframe: '3-6 meses preparación',
          reasoning: 'Optimización reserva + máxima respuesta ovárica'
        }
      });
    } else {
      results.push({
        type: 'hypothesis',
        data: {
          condition: 'Reserva Ovárica Moderadamente Reducida (AMH 0.6-1.0 ng/mL)',
          probability: 75,
          reasoning: 'Reserva ovárica en descenso - Fertilidad tiempo-dependiente',
          evidenceLevel: domain.evidence as EvidenceLevel,
          pmid: domain.pmid
        }
      });

      results.push({
        type: 'treatment',
        data: {
          treatment: 'IUI hasta 6 ciclos si factor tubario normal, luego FIV',
          priority: 'medium' as Priority,
          successRate: 55,
          timeframe: 'Cada ciclo',
          reasoning: 'Optimización fertilidad natural antes TRA'
        }
      });
    }

    // 🔬 Evaluaciones adicionales para AMH bajo
    if (amhLevel < 0.3) {
      results.push({
        type: 'diagnostic',
        data: {
          test: 'Cariotipo + FMR1 + Panel genético falla ovárica',
          reasoning: 'AMH <0.3 ng/mL sugiere falla ovárica primaria - investigar causa genética',
          priority: 'high' as Priority
        }
      });
    }
  }

  return results;
};

// 🧠 TSH NESTED ANALYSIS DOMAIN
export const analyzeTSHFactors = (factors: Factors): AnalysisResult[] => {
  const results: AnalysisResult[] = [];
  
  // Solo analizar si TSH está presente y es anormal (> 2.5 mUI/L para fertilidad)
  if (factors.tsh !== undefined && factors.tsh > 2.5) {
    const tshLevel = factors.tsh;
    const domain = HORMONAL_DOMAINS.TSH;
    
    if (tshLevel > 10) {
      results.push({
        type: 'hypothesis',
        data: {
          condition: 'Hipotiroidismo Severo (TSH >10 mUI/L)',
          probability: 95,
          reasoning: 'Hipotiroidismo manifiesto - Anovulación + riesgo obstétrico alto',
          evidenceLevel: domain.evidence as EvidenceLevel,
          pmid: domain.pmid
        }
      });

      results.push({
        type: 'treatment',
        data: {
          treatment: 'Levotiroxina: inicio 50-100 mcg/día + titulación',
          priority: 'high' as Priority,
          successRate: 90,
          timeframe: '6-8 semanas entre ajustes',
          reasoning: 'Sustitución hormonal tiroidea completa'
        }
      });
    } else if (tshLevel > 5) {
      results.push({
        type: 'hypothesis',
        data: {
          condition: 'Hipotiroidismo Moderado (TSH 5-10 mUI/L)',
          probability: 85,
          reasoning: 'Disfunción tiroidea moderada - Impacto fertilidad significativo',
          evidenceLevel: domain.evidence as EvidenceLevel,
          pmid: domain.pmid
        }
      });

      results.push({
        type: 'treatment',
        data: {
          treatment: 'Levotiroxina 25-75 mcg/día',
          priority: 'high' as Priority,
          successRate: 85,
          timeframe: '6-8 semanas reevaluación',
          reasoning: 'Corrección disfunción tiroidea moderada'
        }
      });
    } else {
      results.push({
        type: 'hypothesis',
        data: {
          condition: 'Hipotiroidismo Subclínico (TSH 2.5-5 mUI/L)',
          probability: 75,
          reasoning: 'Disfunción tiroidea leve - Optimización pre-concepcional recomendada',
          evidenceLevel: domain.evidence as EvidenceLevel,
          pmid: domain.pmid
        }
      });

      results.push({
        type: 'treatment',
        data: {
          treatment: 'Levotiroxina 25-50 mcg/día',
          priority: 'medium' as Priority,
          successRate: 85,
          timeframe: '6-8 semanas reevaluación',
          reasoning: 'Optimización función tiroidea pre-concepcional'
        }
      });
    }

    // 🔬 Monitoring común para todos los casos
    results.push({
      type: 'monitoring',
      data: {
        parameter: 'TSH + T4 libre',
        frequency: tshLevel > 10 ? 'Cada 4-6 semanas' : 'Cada 6-8 semanas',
        target: 'TSH <2.5 mUI/L pre-concepcional',
        reasoning: 'Optimización función tiroidea antes embarazo'
      }
    });
  }

  return results;
};

// 🧠 PROLACTIN NESTED ANALYSIS DOMAIN
export const analyzeProlactinFactors = (factors: Factors): AnalysisResult[] => {
  const results: AnalysisResult[] = [];
  
  // Solo analizar si prolactina está presente y es anormal (> 25 ng/mL en mujeres no embarazadas)
  if (factors.prolactin !== undefined && factors.prolactin > 25) {
    const prolactinLevel = factors.prolactin;
    const domain = HORMONAL_DOMAINS.PROLACTIN;
    
    if (prolactinLevel > 100) {
      results.push({
        type: 'hypothesis',
        data: {
          condition: 'Hiperprolactinemia Severa (>100 ng/mL)',
          probability: 95,
          reasoning: 'Hiperprolactinemia severa - Probable adenoma hipofisario + anovulación',
          evidenceLevel: domain.evidence as EvidenceLevel,
          pmid: domain.pmid
        }
      });

      results.push({
        type: 'treatment',
        data: {
          treatment: 'Cabergolina 0.25mg 2x/semana + RMN hipófisis',
          priority: 'high' as Priority,
          successRate: 85,
          timeframe: '4-6 semanas reevaluación',
          reasoning: 'Agonista dopamina + evaluación estructural hipófisis'
        }
      });
    } else if (prolactinLevel > 50) {
      results.push({
        type: 'hypothesis',
        data: {
          condition: 'Hiperprolactinemia Moderada (50-100 ng/mL)',
          probability: 85,
          reasoning: 'Hiperprolactinemia moderada - Posible microadenoma + disfunción ovulatoria',
          evidenceLevel: domain.evidence as EvidenceLevel,
          pmid: domain.pmid
        }
      });

      results.push({
        type: 'treatment',
        data: {
          treatment: 'Cabergolina 0.25mg 1-2x/semana',
          priority: 'high' as Priority,
          successRate: 90,
          timeframe: '4-6 semanas reevaluación',
          reasoning: 'Normalización prolactina + restauración ovulación'
        }
      });
    } else {
      results.push({
        type: 'hypothesis',
        data: {
          condition: 'Hiperprolactinemia Leve (25-50 ng/mL)',
          probability: 75,
          reasoning: 'Hiperprolactinemia leve - Estrés, medicamentos o disfunción hipotalámica',
          evidenceLevel: domain.evidence as EvidenceLevel,
          pmid: domain.pmid
        }
      });

      results.push({
        type: 'treatment',
        data: {
          treatment: 'Repetir prolactina en ayunas + revisar medicamentos',
          priority: 'medium' as Priority,
          successRate: 85,
          timeframe: '2-4 semanas reevaluación',
          reasoning: 'Confirmación hiperprolactinemia + identificación causa'
        }
      });
    }

    // 🔬 Monitoreo común
    results.push({
      type: 'monitoring',
      data: {
        parameter: 'Prolactina sérica',
        frequency: 'Cada 4-6 semanas durante tratamiento',
        target: 'Prolactina <25 ng/mL + ovulación regular',
        reasoning: 'Normalización eje reproductivo'
      }
    });
  }

  return results;
};

// 🧠 HOMA-IR NESTED ANALYSIS DOMAIN
export const analyzeHOMAFactors = (factors: Factors): AnalysisResult[] => {
  const results: AnalysisResult[] = [];
  
  // Solo analizar si HOMA-IR está presente y es anormal (> 2.5 indica resistencia insulínica)
  if (factors.homaIR !== undefined && factors.homaIR > 2.5) {
    const homaLevel = factors.homaIR;
    const domain = HORMONAL_DOMAINS.HOMA;
    
    if (homaLevel > 5.0) {
      results.push({
        type: 'hypothesis',
        data: {
          condition: 'Resistencia Insulínica Severa (HOMA-IR >5.0)',
          probability: 95,
          reasoning: 'Resistencia insulínica severa - Hiperinsulinemia + síndrome metabólico',
          evidenceLevel: domain.evidence as EvidenceLevel,
          pmid: domain.pmid
        }
      });

      results.push({
        type: 'treatment',
        data: {
          treatment: 'Metformina 1500-2000mg/día + dieta baja IG',
          priority: 'high' as Priority,
          successRate: 75,
          timeframe: '3-6 meses',
          reasoning: 'Sensibilización insulínica + mejora metabólica'
        }
      });
    } else if (homaLevel > 3.5) {
      results.push({
        type: 'hypothesis',
        data: {
          condition: 'Resistencia Insulínica Moderada (HOMA-IR 3.5-5.0)',
          probability: 85,
          reasoning: 'Resistencia insulínica moderada - Riesgo metabólico + reproductivo',
          evidenceLevel: domain.evidence as EvidenceLevel,
          pmid: domain.pmid
        }
      });

      results.push({
        type: 'treatment',
        data: {
          treatment: 'Metformina 1000-1500mg/día + ejercicio',
          priority: 'medium' as Priority,
          successRate: 80,
          timeframe: '3-4 meses',
          reasoning: 'Mejora sensibilidad insulínica + composición corporal'
        }
      });
    } else {
      results.push({
        type: 'hypothesis',
        data: {
          condition: 'Resistencia Insulínica Leve (HOMA-IR 2.5-3.5)',
          probability: 75,
          reasoning: 'Resistencia insulínica leve - Optimización metabólica preventiva',
          evidenceLevel: domain.evidence as EvidenceLevel,
          pmid: domain.pmid
        }
      });

      results.push({
        type: 'treatment',
        data: {
          treatment: 'Modificación estilo vida + metformina si PCOS',
          priority: 'medium' as Priority,
          successRate: 85,
          timeframe: '2-3 meses',
          reasoning: 'Prevención progresión diabetes + mejora fertilidad'
        }
      });
    }

    // 🔬 Monitoreo metabólico
    results.push({
      type: 'monitoring',
      data: {
        parameter: 'Glucosa + insulina + HbA1c',
        frequency: 'Cada 3-6 meses',
        target: 'HOMA-IR <2.5 + HbA1c <5.7%',
        reasoning: 'Prevención diabetes + optimización fertilidad'
      }
    });
  }

  return results;
};
