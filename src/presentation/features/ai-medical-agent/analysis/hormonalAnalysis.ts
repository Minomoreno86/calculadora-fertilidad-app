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
  
  // 🌌 QUANTUM CONSCIOUSNESS FIX: Solo analizar si AMH está realmente presente Y alterado
  // Los factores están normalizados 0-1, no son valores brutos de laboratorio
  // Factor 1.0 = normal/ausente, <1.0 = alterado
  // ✅ CORREGIDO: Trigger cuando AMH < 1.0 (cualquier alteración de la reserva normal)
  if (factors.amh !== undefined && factors.amh < 1.0) {
    const amhFactor = factors.amh;
    const domain = HORMONAL_DOMAINS.AMH;
    
    let condition: string;
    let probability: number;
    let reasoning: string;
    let treatments: string[];
    let priority: Priority;
    
    // 🔍 DEBUG AMH - CORREGIDO con rangos alineados a evaluateAmh
    console.log('🔍 AMH Analysis Debug:', {
      amhFactor,
      willAnalyze: true,
      alignedToEvaluateAmh: 'Using exact ranges from factorEvaluators.ts'
    });
    
    if (amhFactor < 0.3) {
      // Factor <0.3 = Reserva crítica/indetectable
      condition = 'Reserva Ovárica Crítica (AMH Indetectable <0.1 ng/mL)';
      probability = 98;
      reasoning = 'Reserva ovárica crítica. Falla ovárica prematura confirmada. Respuesta imposible a estimulación propia';
      treatments = [
        '🥚 OVODONACIÓN RECOMENDADA como primera línea (85-90% embarazo)',
        '🥚 FIV con óvulos donados: opción más efectiva y rápida',
        'Evaluación genética URGENTE: FMR1, cariotipo, panel falla ovárica',
        'Protocolo óvulos propios SOLO si deseo específico (respuesta <2 óvulos)',
        'Consejería reproductiva: ventajas ovodonación vs frustración óvulos propios',
        '⏱️ NO demorar decisión: preservar receptividad endometrial'
      ];
      priority = 'high';
    } else if (amhFactor < 0.4) {
      // ✅ NUEVO RANGO: Factor 0.3-0.39 = Reserva crítica pero con posibilidad
      condition = 'Reserva Ovárica Crítica Severa (AMH 0.1-0.3 ng/mL)';
      probability = 95;
      reasoning = 'Reserva ovárica crítica severa. Muy alta probabilidad falla con óvulos propios. Ovodonación altamente recomendada';
      treatments = [
        '🥚 CONSIDERAR SERIAMENTE OVODONACIÓN (80-85% éxito vs 15-25% óvulos propios)',
        '🥚 Counseling fertilidad: comparar realísticamente ambas opciones',
        'SI INSISTE óvulos propios: máximo 1-2 intentos FIV antes ovodonación',
        'Protocolo estimulación máxima: FSH 450UI + LH + antagonista',
        'Suplementación intensiva: DHEA 75mg + CoQ10 600mg + melatonina',
        '⚠️ Transparencia: 75-80% posibilidad cancelación ciclo por mala respuesta'
      ];
      priority = 'high';
    } else if (amhFactor < 0.6) {
      // Factor 0.4-0.59 = Muy baja reserva (<0.5 ng/mL)
      condition = 'Reserva Ovárica Muy Baja (AMH 0.3-0.5 ng/mL)';
      probability = 85;
      reasoning = 'Reserva ovárica muy baja. Respuesta pobre a estimulación. Ovodonación debe ser discutida como alternativa viable';
      treatments = [
        'FIV URGENTE con protocolo antagonista + FSH alta dosis (300-450 UI)',
        '🥚 INFORMAR sobre ovodonación como alternativa (70-80% éxito)',
        'Acumulación óvulos: 2-3 ciclos FIV antes transferencia si <5 óvulos/ciclo',
        '🥚 Cambiar a ovodonación si 2 ciclos consecutivos <3 óvulos maduros',
        'Suplementación: DHEA 75mg + CoQ10 600mg + Vitamina D',
        'Evaluación genética: FMR1 + panel genético si edad <35 años'
      ];
      priority = 'high';
    } else if (amhFactor < 0.85) {
      // Factor 0.6-0.84 = Baja reserva (0.5-0.9 ng/mL)
      condition = 'Reserva Ovárica Baja (AMH 0.5-0.9 ng/mL)';
      probability = 75;
      reasoning = 'Reserva ovárica baja. Respuesta subóptima a estimulación. Fertilidad tiempo-dependiente';
      treatments = [
        'FIV como tratamiento de primera línea (evitar pérdida tiempo)',
        'Protocolo antagonista flexible + FSH recombinante',
        'Optimización pre-FIV: DHEA 25mg + CoQ10 400mg x 3 meses',
        'Seguimiento folicular estrecho + trigger personalizado',
        'Considerar acumulación óvulos si edad >37 años',
        'Cronometría crítica: no demorar >6 meses'
      ];
      priority = 'high';
    } else if (amhFactor < 0.9) {
      // Factor 0.85-0.89 = Ligeramente disminuida (1.0-1.9 ng/mL)
      condition = 'Reserva Ovárica Ligeramente Disminuida (AMH 1.0-1.9 ng/mL)';
      probability = 65;
      reasoning = 'Reserva ovárica en descenso. Respuesta normal-baja a estimulación. Ventana terapéutica limitada';
      treatments = [
        'IUI hasta 3-4 ciclos si trompas permeables + edad <35',
        'FIV si no embarazo en 6 meses o edad >35 años',
        'Protocolo estimulación estándar con seguimiento estrecho',
        'Suplementación opcional: CoQ10 300mg + Vitamina D',
        'Optimización estilo vida: ejercicio moderado + peso ideal',
        'Seguimiento AMH cada 6-12 meses para monitoreo'
      ];
      priority = 'medium';
    } else {
      // Factor 0.9-0.99 = Alta reserva (≥4.0 ng/mL) - riesgo PCOS
      condition = 'Reserva Ovárica Alta (AMH ≥4.0 ng/mL) - Riesgo PCOS';
      probability = 60;
      reasoning = 'Reserva alta puede indicar PCOS. Riesgo hiperestimulación ovárica. Requiere protocolo especializado';
      treatments = [
        'EVALUACIÓN PCOS completa: criterios Rotterdam + ecografía',
        'Protocolo antagonista con dosis FSH reducida (150-175 UI)',
        'Prevención hiperestimulación: antagonista GnRH + cabergolina',
        'Trigger con agonista GnRH si >15 folículos',
        'Metformina si insulinorresistencia confirmada',
        'Monitoreo estricto durante estimulación'
      ];
      priority = 'medium';
    }

      results.push({
        type: 'hypothesis',
        data: {
        condition,
        probability,
        reasoning,
          evidenceLevel: domain.evidence as EvidenceLevel,
          pmid: domain.pmid
        }
      });

      results.push({
        type: 'treatment',
        data: {
        treatment: treatments.join(' || '),
        priority,
        successRate: amhFactor < 0.3 ? 25 : amhFactor < 0.6 ? 40 : amhFactor < 0.85 ? 60 : 70,
        timeframe: amhFactor < 0.6 ? 'URGENTE 2-3 meses' : amhFactor < 0.85 ? '3-6 meses' : '6-12 meses',
        reasoning: `Reserva ovárica factor ${amhFactor} - protocolo específico requerido`
      }
    });

    // 🔬 Evaluaciones adicionales para AMH muy bajo
    if (amhFactor < 0.6) {
      results.push({
        type: 'diagnostic',
        data: {
          test: 'Panel genético falla ovárica: FMR1 + Cariotipo + BMP15 + GDF9',
          reasoning: 'AMH muy baja - descartar causas genéticas de falla ovárica prematura',
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
  
  // ✅ CORREGIDO: Analizar cuando TSH < 1.0 (alteración de función normal) usando factores normalizados
  if (factors.tsh !== undefined && factors.tsh < 1.0) {
    const tshFactor = factors.tsh;
    const domain = HORMONAL_DOMAINS.TSH;
    
    let condition: string;
    let probability: number;
    let reasoning: string;
    let treatments: string[];
    let priority: Priority;
    let frequency: string;
    
    // 🔍 DEBUG TSH - CORREGIDO con factores normalizados alineados a evaluateTsh
    console.log('🔍 TSH Analysis Debug:', {
      tshFactor,
      willAnalyze: true,
      alignedToEvaluateTsh: 'Using normalized factors 0-1, not raw values'
    });
    
    if (tshFactor <= 0.4) {
      // Factor ≤0.4 = TSH >10 mUI/L = Hipotiroidismo severo
      condition = 'Hipotiroidismo Severo (TSH >10 mUI/L)';
      probability = 95;
      reasoning = 'Hipotiroidismo manifiesto con anovulación crónica + alto riesgo obstétrico. Tratamiento endocrinológico urgente requerido';
      treatments = [
        'LEVOTIROXINA URGENTE: 50-100 mcg/día según peso corporal (1.6 mcg/kg/día)',
        'Titulación cada 6-8 semanas hasta TSH <2.5 mUI/L (objetivo pre-concepcional)',
        'MONITOREO TSH + T4 libre cada 4-6 semanas durante tratamiento activo',
        'Evaluación endocrinológica especializada INMEDIATA (dentro 48-72h)',
        '⚠️ CONTRAINDICADO intentar embarazo hasta eutiroidismo confirmado (TSH <2.5)',
        'Anticuerpos tiroideos completos: anti-TPO + anti-tiroglobulina + TSI',
        'Ecografía tiroidea si bocio palpable o sospecha nódulos',
        'Educación paciente: síntomas hipotiroidismo + importancia adherencia'
      ];
      priority = 'high';
      frequency = 'Cada 4-6 semanas';
    } else {
      // Factor 0.4-0.99 = TSH 2.5-10 mUI/L = Hipotiroidismo subclínico/moderado
      condition = 'Hipotiroidismo Subclínico-Moderado (TSH 2.5-10 mUI/L)';
      probability = 80;
      reasoning = 'Disfunción tiroidea subclínica que compromete fertilidad. Optimización pre-concepcional esencial para embarazo exitoso';
      treatments = [
        'LEVOTIROXINA: 25-75 mcg/día según nivel TSH basal y peso corporal',
        'Objetivo terapéutico: TSH <2.5 mUI/L para optimización pre-concepcional',
        'MONITOREO TSH + T4 libre cada 6-8 semanas hasta estabilización',
        'Anticuerpos anti-TPO si TSH persistentemente elevada >3 meses',
        'Suplemento YODO 150 mcg/día si planifica embarazo (evitar exceso)',
        'Seguimiento endocrinológico durante embarazo: ↑dosis 30-50% necesario',
        'Control nutricional: selenio, vitamina D, evitar goitrogénicos',
        'Monitoreo función reproductiva: regularidad menstrual + ovulación'
      ];
      priority = 'high';
      frequency = 'Cada 6-8 semanas';
    }

      results.push({
        type: 'hypothesis',
        data: {
        condition,
        probability,
        reasoning,
          evidenceLevel: domain.evidence as EvidenceLevel,
          pmid: domain.pmid
        }
      });

      results.push({
        type: 'treatment',
        data: {
        treatment: treatments.join(' || '),
        priority,
        successRate: tshFactor <= 0.4 ? 90 : 85,
        timeframe: frequency,
        reasoning: `Función tiroidea factor ${tshFactor} - protocolo específico tiroidea`
      }
    });

    // 🔬 Monitoring común para todos los casos
    results.push({
      type: 'monitoring',
      data: {
        parameter: 'TSH + T4 libre',
        frequency,
        target: 'TSH <2.5 mUI/L pre-concepcional + T4 libre normal',
        reasoning: 'Optimización función tiroidea antes embarazo + monitoreo respuesta'
      }
    });
  }

  return results;
};

// 🧠 PROLACTIN NESTED ANALYSIS DOMAIN
export const analyzeProlactinFactors = (factors: Factors): AnalysisResult[] => {
  const results: AnalysisResult[] = [];
  
  // ✅ Usar factores normalizados (0-1) como AMH y TSH
  if (factors.prolactin !== undefined && factors.prolactin < 1.0) {
    const prolactinFactor = factors.prolactin;
    const domain = HORMONAL_DOMAINS.PROLACTIN;
    
    console.log('🔍 [PROLACTIN ANALYSIS] Factor analysis:', {
      prolactinFactor,
      willAnalyze: true,
      alignedToEvaluateProlactin: 'Using normalized factors 0-1, not raw values'
    });
    
    let condition: string;
    let probability: number;
    let reasoning: string;
    let treatments: string[];
    let priority: Priority;
    let frequency: string;
    
    if (prolactinFactor <= 0.3) {
      // Factor ≤0.3 = Prolactina >200 ng/mL = Hiperprolactinemia severa
      condition = 'Hiperprolactinemia Severa (Prolactina >200 ng/mL)';
      probability = 95;
      reasoning = 'Hiperprolactinemia severa con probable adenoma hipofisario. Supresión severa del eje reproductor + alto riesgo anovulación';
      treatments = [
        'CABERGOLINA URGENTE: 0.25mg 2 veces/semana (agonista dopamina D2)',
        'RESONANCIA MAGNÉTICA hipófisis con gadolinio INMEDIATA',
        'Evaluación endocrinológica especializada (dentro 48-72h)',
        'Prolactina control cada 4 semanas hasta normalización (<25 ng/mL)',
        '⚠️ CONTRAINDICADO intentar embarazo hasta normalización prolactina',
        'Campimetría visual si sospecha macro-adenoma (>1cm)',
        'Monitoreo función gonadal: LH, FSH, estradiol mensual',
        'Descartar causas secundarias: medicamentos, hipotiroidismo severo'
      ];
      priority = 'high';
      frequency = 'Cada 4 semanas';
    } else {
      // Factor 0.3-0.99 = Prolactina 25-200 ng/mL = Hiperprolactinemia moderada-leve
      condition = 'Hiperprolactinemia Moderada-Leve (Prolactina 25-200 ng/mL)';
      probability = 85;
      reasoning = 'Hiperprolactinemia moderada con probable micro-adenoma o causa funcional. Disfunción ovulatoria reversible con tratamiento';
      treatments = [
        'CABERGOLINA: 0.25mg 1-2 veces/semana (titular según respuesta)',
        'Prolactina control cada 6-8 semanas hasta <25 ng/mL objetivo',
        'RMN hipófisis si prolactina persiste >100 ng/mL después 3 meses',
        'Evaluar causas secundarias: TSH, medicamentos (antipsicóticos, antidepresivos)',
        'Monitoreo ovulación: progesterona día 21 ciclo, temperatura basal',
        'Suspender fármacos prolactinogénicos si clínicamente posible',
        'Control endocrinológico cada 3-6 meses durante tratamiento',
        'Evaluación oftalmológica si cefaleas o alteraciones visuales'
      ];
      priority = 'high';
      frequency = 'Cada 6-8 semanas';
    }

    // 💊 TRATAMIENTOS ESTRUCTURADOS
      results.push({
        type: 'hypothesis',
        data: {
        condition,
        probability,
        reasoning,
          evidenceLevel: domain.evidence as EvidenceLevel,
          pmid: domain.pmid
        }
      });

      results.push({
        type: 'treatment',
        data: {
        treatment: treatments.join(' | '),
        priority,
        successRate: prolactinFactor <= 0.3 ? 85 : 90, // Severa tiene menor tasa éxito inicial
        timeframe: frequency,
        reasoning: `Normalización prolactina + restauración función reproductiva`
      }
    });

    // 🔬 MONITOREO ESPECÍFICO
    results.push({
      type: 'monitoring',
      data: {
        parameter: 'Prolactina sérica + función gonadal',
        frequency,
        target: 'Prolactina <25 ng/mL + ovulación espontánea + menstruación regular',
        reasoning: 'Restauración completa eje hipotálamo-hipófisis-gonadal'
      }
    });
  } else if (factors.prolactin !== undefined) {
    console.log('🔍 [PROLACTIN ANALYSIS] Skipped - normal/absent:', factors.prolactin);
  }

  return results;
};

// 🧠 HOMA-IR NESTED ANALYSIS DOMAIN
export const analyzeHOMAFactors = (factors: Factors): AnalysisResult[] => {
  const results: AnalysisResult[] = [];
  
  // ✅ Usar factores normalizados (0-1) como AMH, TSH y Prolactina
  const homaFactor = factors.homa || factors.homaIR;
  
  if (homaFactor !== undefined && homaFactor < 1.0) {
    const domain = HORMONAL_DOMAINS.HOMA;
    
    console.log('🔍 [HOMA-IR ANALYSIS] Factor analysis:', {
      homaFactor,
      willAnalyze: true,
      alignedToEvaluateHoma: 'Using normalized factors 0-1, not raw values'
    });
    
    let condition: string;
    let probability: number;
    let reasoning: string;
    let treatments: string[];
    let priority: Priority;
    let frequency: string;
    
    if (homaFactor <= 0.2) {
      // Factor ≤0.2 = HOMA-IR ≥5.0 = Resistencia insulínica severa
      condition = 'Resistencia Insulínica Severa (HOMA-IR ≥5.0)';
      probability = 95;
      reasoning = 'Resistencia insulínica severa con síndrome metabólico establecido. Alto riesgo anovulación crónica + PCOS severo';
      treatments = [
        'METFORMINA URGENTE: 1500-2000mg/día fraccionado con alimentos',
        'DIETA cetogénica modificada: <50g carbohidratos/día + grasas saludables',
        'Ejercicio HIIT: 3-4 veces/semana + actividad diaria 45min',
        'Control metabólico INTENSIVO: glucemia, HbA1c, perfil lipídico cada 3 meses',
        'Pérdida peso CRÍTICA: 7-10% peso corporal objetivo en 6 meses',
        'INOSITOL 4g/día + cromo 200mcg + omega-3 2g/día',
        'Evaluación endocrinológica URGENTE (descartar diabetes tipo 2)',
        'Monitoreo reproductivo: ovulación, calidad ovocitaria, respuesta ovárica'
      ];
      priority = 'high';
      frequency = 'Cada 3 meses';
    } else if (homaFactor <= 0.4) {
      // Factor 0.2-0.4 = HOMA-IR 4.0-4.9 = Resistencia insulínica significativa
      condition = 'Resistencia Insulínica Significativa (HOMA-IR 4.0-4.9)';
      probability = 90;
      reasoning = 'Resistencia insulínica moderada-severa que compromete fertilidad. Prediabetes establecida con disfunción ovulatoria';
      treatments = [
        'METFORMINA: 1000-1500mg/día (titulación gradual desde 500mg)',
        'Dieta bajo índice glicémico: <100g carbohidratos complejos/día',
        'Ejercicio estructurado: 150min/semana intensidad moderada-alta',
        'Control metabólico cada 6 meses: HOMA-IR, glucemia, insulina basal',
        'Pérdida peso dirigida: 5-7% peso corporal en 4-6 meses',
        'INOSITOL 2-4g/día (sensibilizador insulínico natural)',
        'Evaluación nutricional especializada para plan personalizado',
        'Monitoreo reproductivo: ciclos, ovulación espontánea, AMH'
      ];
      priority = 'high';
      frequency = 'Cada 6 meses';
    } else {
      // Factor 0.4-0.99 = HOMA-IR 2.5-3.9 = Resistencia insulínica leve
      condition = 'Resistencia Insulínica Leve (HOMA-IR 2.5-3.9)';
      probability = 80;
      reasoning = 'Resistencia insulínica incipiente que puede afectar calidad ovocitaria y respuesta a tratamientos reproductivos';
      treatments = [
        'METFORMINA: 500-1000mg/día (evaluar según IMC y síntomas PCOS)',
        'Dieta mediterránea modificada: carbohidratos complejos prioritarios',
        'Ejercicio aeróbico regular: 120-150min/semana mínimo',
        'Control anual: HOMA-IR, glucemia basal, HbA1c preventivo',
        'Mantener peso saludable: IMC objetivo 20-24.9 kg/m²',
        'INOSITOL 1-2g/día como coadyuvante metabólico',
        'Evitar carbohidratos refinados y bebidas azucaradas',
        'Evaluación reproductiva: regularidad menstrual, calidad ovulatoria'
      ];
      priority = 'medium';
      frequency = 'Cada 12 meses';
    }

    // 💊 TRATAMIENTOS ESTRUCTURADOS
      results.push({
        type: 'hypothesis',
        data: {
        condition,
        probability,
        reasoning,
          evidenceLevel: domain.evidence as EvidenceLevel,
          pmid: domain.pmid
        }
      });

      results.push({
        type: 'treatment',
        data: {
        treatment: treatments.join(' | '),
        priority,
        successRate: homaFactor <= 0.2 ? 75 : homaFactor <= 0.4 ? 85 : 90, // Severa tiene menor tasa éxito inicial
        timeframe: frequency,
        reasoning: `Sensibilización insulínica + mejora metabólica reproductiva`
      }
    });

    // 🔬 MONITOREO ESPECÍFICO
    results.push({
      type: 'monitoring',
      data: {
        parameter: 'HOMA-IR + perfil metabólico',
        frequency,
        target: 'HOMA-IR <2.5 + ovulación regular + peso saludable',
        reasoning: 'Restauración sensibilidad insulínica + función reproductiva óptima'
      }
    });
  } else if (homaFactor !== undefined) {
    console.log('🔍 [HOMA-IR ANALYSIS] Skipped - normal/absent:', homaFactor);
  }

  return results;
};

