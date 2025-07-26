// ⚙️ FUNCTIONAL ANALYSIS NESTED DOMAINS MODULE V13.1
// Análisis especializado para función reproductiva con nested intelligence

import { AnalysisResult, Factors } from '@/core/domain/models';

// 🎯 TYPES FOR FUNCTIONAL ANALYSIS
type EvidenceLevel = 'A' | 'B' | 'C';
type Priority = 'high' | 'medium' | 'low';

// 🎯 NESTED FUNCTIONAL DOMAINS CONFIGURATION
export const FUNCTIONAL_DOMAINS = {
  OVULATION: {
    domain: 'ovulatory_function',
    parameters: ['cycle_regularity', 'ovulation_confirmation', 'luteal_phase'],
    thresholds: { severe: 0.4, moderate: 0.6, mild: 0.8 },
    evidence: 'A',
    pmid: '31589276'
  },
  TUBAL: {
    domain: 'tubal_patency',
    parameters: ['hsg_patency', 'hydrosalpinx', 'tubal_obstruction'],
    thresholds: { bilateral: 0.3, unilateral: 0.6, patent: 0.9 },
    evidence: 'A',
    pmid: '29268058'
  },
  MALE_FACTOR: {
    domain: 'male_fertility',
    parameters: ['concentration', 'motility', 'morphology', 'dna_fragmentation'],
    thresholds: { severe: 0.3, moderate: 0.6, mild: 0.8 },
    evidence: 'A',
    pmid: '28948120'
  },
  PCOS: {
    domain: 'polycystic_ovary',
    parameters: ['rotterdam_criteria', 'metabolic_profile', 'androgen_excess'],
    thresholds: { classic: 0.3, ovulatory: 0.5, mild: 0.8 },
    evidence: 'A',
    pmid: '28218889'
  }
} as const;

// 🧠 OVULATORY DYSFUNCTION NESTED ANALYSIS DOMAIN
export const analyzeCycleIrregularFactors = (factors: Factors): AnalysisResult[] => {
  const results: AnalysisResult[] = [];
  
  if (factors.cycle !== undefined && factors.cycle < 0.8) {
    const irregularityLevel = factors.cycle;
    const domain = FUNCTIONAL_DOMAINS.OVULATION;
    
    // 🎯 Nested Ovulation Classification
    const cycleConfig = getCycleNestedConfig(irregularityLevel);
    
    results.push({
      type: 'hypothesis',
      data: {
        condition: cycleConfig.condition,
        probability: (1 - irregularityLevel) * 100,
        reasoning: `${cycleConfig.severity}. Correlación directa entre regularidad menstrual y fertilidad natural`,
        evidenceLevel: domain.evidence as EvidenceLevel,
        pmid: domain.pmid
      }
    });

    // 🧬 Nested Treatment Protocols
    cycleConfig.treatments.forEach((treatment, index) => {
      results.push({
        type: 'treatment',
        data: {
          treatment: treatment.protocol,
          priority: index < 2 ? cycleConfig.priority : 'medium' as Priority,
          successRate: cycleConfig.ovulationRate + (index < 3 ? 20 : 10),
          timeframe: treatment.timeframe,
          reasoning: treatment.mechanism
        }
      });
    });

    // 🔬 Nested Monitoring
    results.push({
      type: 'monitoring',
      data: {
        parameter: 'Calendario menstrual + LH urinario + Ecografía folicular',
        frequency: 'Diario LH + Eco días 10,12,14 ciclo inducido',
        target: 'Ciclos 25-35 días + ovulación confirmada eco/progesterona'
      }
    });

    // 🧠 Nested Predictions
    if (irregularityLevel > 0.5) {
      results.push({
        type: 'prediction',
        data: {
          outcome: 'Embarazo espontáneo con tratamiento',
          probability: Math.min(cycleConfig.ovulationRate + 15, 85),
          timeframe: '6-12 meses con inducción ovulación',
          reasoning: 'Letrozol + timing coital: tasa embarazo acumulada 70% en 6 ciclos'
        }
      });
    }
  }

  return results;
};

// 🎯 NESTED CYCLE CONFIGURATION
const getCycleNestedConfig = (irregularityLevel: number) => {
  if (irregularityLevel < FUNCTIONAL_DOMAINS.OVULATION.thresholds.severe) {
    return {
      condition: 'Amenorrea/Oligomenorrea Severa (>60 días)',
      severity: 'Anovulación crónica - Hipoestrogenismo/hiperandrogenismo',
      treatments: [
        {
          protocol: 'Inducción ovulación: Letrozol 2.5-7.5mg días 3-7',
          timeframe: '5 días por ciclo',
          mechanism: 'Inhibidor aromatasa: induce ovulación monofólicular 80-85% casos'
        },
        {
          protocol: 'Gonadotropinas FSH/LH si resistencia antiestrógenos',
          timeframe: 'Días 2-8 ciclo',
          mechanism: 'Estimulación directa ovárica: ovulación >90% casos'
        },
        {
          protocol: 'Investigar: prolactina, TSH, andrógenos, AMH',
          timeframe: 'Evaluación inmediata',
          mechanism: 'Identificación causa subyacente anovulación'
        }
      ],
      priority: 'high' as Priority,
      ovulationRate: 25
    };
  } else if (irregularityLevel < FUNCTIONAL_DOMAINS.OVULATION.thresholds.moderate) {
    return {
      condition: 'Oligomenorrea Moderada (35-60 días)',
      severity: 'Ovulación esporádica - Función ovárica alterada',
      treatments: [
        {
          protocol: 'Letrozol 2.5mg días 3-7 + monitorización folicular',
          timeframe: '5 días por ciclo',
          mechanism: 'Inducción ovulación con monitoreo ecográfico'
        },
        {
          protocol: 'Inductores naturales: Myo-inositol 2g + vitamina D',
          timeframe: 'Tratamiento continuo',
          mechanism: 'Mejora sensibilidad insulínica + función ovárica'
        }
      ],
      priority: 'medium' as Priority,
      ovulationRate: 45
    };
  } else {
    return {
      condition: 'Irregularidad Menstrual Leve (25-35 días variables)',
      severity: 'Ovulación subfértil - Fase lútea potencialmente inadecuada',
      treatments: [
        {
          protocol: 'Monitorización ovulación: eco seriada + LH urinario',
          timeframe: 'Días 10-14 ciclo',
          mechanism: 'Identificación ventana fértil óptima'
        },
        {
          protocol: 'Timing coital optimizado según ovulación',
          timeframe: 'Continuo',
          mechanism: 'Maximización probabilidades concepción natural'
        }
      ],
      priority: 'low' as Priority,
      ovulationRate: 70
    };
  }
};

// 🧠 PCOS NESTED ANALYSIS DOMAIN
export const analyzePCOSFactors = (factors: Factors): AnalysisResult[] => {
  const results: AnalysisResult[] = [];
  
  if (factors.pcos !== undefined && factors.pcos < 0.8) {
    const pcosLevel = factors.pcos;
    const domain = FUNCTIONAL_DOMAINS.PCOS;
    
    // 🎯 Nested PCOS Classification
    const pcosConfig = getPCOSNestedConfig(pcosLevel);
    
    results.push({
      type: 'hypothesis',
      data: {
        condition: pcosConfig.condition,
        probability: (1 - pcosLevel) * 100,
        reasoning: `${pcosConfig.pcosType}. Criterios Rotterdam: anovulación + hiperandrogenismo + morfología ovárica poliquística`,
        evidenceLevel: domain.evidence as EvidenceLevel,
        pmid: domain.pmid
      }
    });

    // 🧬 Nested PCOS Treatments
    pcosConfig.treatments.forEach((treatment, index) => {
      results.push({
        type: 'treatment',
        data: {
          treatment: treatment.protocol,
          priority: index < 2 ? pcosConfig.priority : 'medium' as Priority,
          successRate: pcosConfig.successRate - (index * 5),
          timeframe: treatment.timeframe,
          reasoning: treatment.mechanism
        }
      });
    });

    // 🔬 Nested PCOS Monitoring
    results.push({
      type: 'monitoring',
      data: {
        parameter: 'Ovulación + andrógenos + glucosa',
        frequency: 'Cada ciclo durante inducción',
        target: 'Ovulación regular + testosterona <60 ng/dL + HOMA-IR <2.5'
      }
    });
  }

  return results;
};

// 🎯 NESTED PCOS CONFIGURATION
const getPCOSNestedConfig = (pcosLevel: number) => {
  if (pcosLevel < FUNCTIONAL_DOMAINS.PCOS.thresholds.classic) {
    return {
      condition: 'SOP Clásico (Fenotipo A - Rotterdam)',
      pcosType: 'Anovulación + hiperandrogenismo + PCOM + resistencia insulínica',
      treatments: [
        {
          protocol: 'Metformina 1500mg + Letrozol 2.5-7.5mg',
          timeframe: 'Continuo metformina + 5 días letrozol/ciclo',
          mechanism: 'Sensibilización insulínica + inducción ovulación monofólicular'
        },
        {
          protocol: 'Pérdida peso 5-10% + dieta bajo IG + ejercicio',
          timeframe: '3-6 meses',
          mechanism: 'Reduce resistencia insulínica + restaura ovulación espontánea 70%'
        },
        {
          protocol: 'Mioinositol 2g BID + D-chiro-inositol 50mg',
          timeframe: 'Continuo',
          mechanism: 'Segundo mensajero insulina: restaura ovulación 70% casos'
        }
      ],
      priority: 'high' as Priority,
      successRate: 85
    };
  } else if (pcosLevel < FUNCTIONAL_DOMAINS.PCOS.thresholds.ovulatory) {
    return {
      condition: 'SOP Ovulatorio (Fenotipo D - Rotterdam)',
      pcosType: 'Ovulación regular + hiperandrogenismo + PCOM',
      treatments: [
        {
          protocol: 'Manejo hiperandrogenismo: anticonceptivos + espironolactona',
          timeframe: '6-12 meses pre-concepción',
          mechanism: 'Control manifestaciones androgénicas + regularización'
        },
        {
          protocol: 'Optimización pre-concepcional: ácido fólico 5mg',
          timeframe: '3 meses pre-concepción',
          mechanism: 'Reducción riesgo defectos tubo neural'
        }
      ],
      priority: 'medium' as Priority,
      successRate: 75
    };
  } else {
    return {
      condition: 'SOP Leve (PCOM aislado)',
      pcosType: 'Morfología ovárica poliquística sin otros criterios',
      treatments: [
        {
          protocol: 'Modificación estilo de vida + pérdida peso 5-10%',
          timeframe: '3-6 meses',
          mechanism: 'Optimización función reproductiva natural'
        },
        {
          protocol: 'Monitoreo ovulación con ecografías',
          timeframe: 'Cada ciclo',
          mechanism: 'Confirmación función ovulatoria normal'
        }
      ],
      priority: 'low' as Priority,
      successRate: 90
    };
  }
};

// 🧠 TUBAL FACTOR NESTED ANALYSIS DOMAIN
export const analyzeHSGFactors = (factors: Factors): AnalysisResult[] => {
  const results: AnalysisResult[] = [];
  
  if (factors.hsg !== undefined && factors.hsg < 0.8) {
    const hsgLevel = factors.hsg;
    const domain = FUNCTIONAL_DOMAINS.TUBAL;
    
    // 🎯 Nested Tubal Classification
    const tubalConfig = getTubalNestedConfig(hsgLevel);
    
    results.push({
      type: 'hypothesis',
      data: {
        condition: tubalConfig.condition,
        probability: (1 - hsgLevel) * 95,
        reasoning: `${tubalConfig.severity}. Factor tubárico causa 25-30% infertilidad femenina`,
        evidenceLevel: domain.evidence as EvidenceLevel,
        pmid: domain.pmid
      }
    });

    // 🧬 Nested Tubal Treatments
    tubalConfig.treatments.forEach((treatment, index) => {
      results.push({
        type: 'treatment',
        data: {
          treatment: treatment.protocol,
          priority: index < 2 ? tubalConfig.priority : 'medium' as Priority,
          successRate: tubalConfig.successRate + (index < 2 ? 10 : 5),
          timeframe: treatment.timeframe,
          reasoning: treatment.mechanism
        }
      });
    });

    // 🧠 Nested Predictions
    results.push({
      type: 'prediction',
      data: {
        outcome: 'Embarazo con tratamiento',
        probability: tubalConfig.successRate,
        timeframe: tubalConfig.timeframe,
        reasoning: tubalConfig.prognostic
      }
    });
  }

  return results;
};

// 🎯 NESTED TUBAL CONFIGURATION
const getTubalNestedConfig = (hsgLevel: number) => {
  if (hsgLevel < FUNCTIONAL_DOMAINS.TUBAL.thresholds.bilateral) {
    return {
      condition: 'Obstrucción Tubárica Bilateral',
      severity: 'Ambas trompas ocluidas + hidrosálpinx bilateral',
      treatments: [
        {
          protocol: 'FIV-ICSI + salpingectomía bilateral previa',
          timeframe: 'Cirugía + 6-8 semanas + FIV',
          mechanism: 'Bypass anatómico + eliminación factor tóxico hidrosálpinx'
        },
        {
          protocol: 'Laparoscopia + neosalpingostomía (si viable)',
          timeframe: '2-4 horas cirugía',
          mechanism: 'Restauración permeabilidad si mucosa conservada'
        }
      ],
      priority: 'high' as Priority,
      successRate: 45,
      timeframe: '6-12 meses',
      prognostic: 'FIV única opción viable. Salpingectomía mejora implantación 50%'
    };
  } else if (hsgLevel < FUNCTIONAL_DOMAINS.TUBAL.thresholds.unilateral) {
    return {
      condition: 'Obstrucción Tubárica Unilateral',
      severity: 'Una trompa permeable + contralateral ocluida',
      treatments: [
        {
          protocol: 'IUI con inducción ovulación (lado permeable)',
          timeframe: '3-6 ciclos',
          mechanism: 'Optimización ovulación en ovario con trompa permeable'
        },
        {
          protocol: 'FIV si falla IUI después 6 ciclos',
          timeframe: 'Protocolo 3-4 semanas',
          mechanism: 'Bypass disfunción anatómica'
        }
      ],
      priority: 'medium' as Priority,
      successRate: 65,
      timeframe: '6-12 meses',
      prognostic: 'Fertilidad reducida 50%. IUI mejora probabilidades'
    };
  } else {
    return {
      condition: 'Permeabilidad Tubárica Reducida',
      severity: 'Trompas permeables con alteraciones funcionales',
      treatments: [
        {
          protocol: 'Timing coital optimizado + seguimiento',
          timeframe: '6-12 meses',
          mechanism: 'Maximización concepción natural'
        }
      ],
      priority: 'low' as Priority,
      successRate: 80,
      timeframe: '6-12 meses',
      prognostic: 'Fertilidad preservada con optimización timing'
    };
  }
};

// 🧠 MALE FACTOR NESTED ANALYSIS DOMAIN
export const analyzeMaleFactorFactors = (factors: Factors): AnalysisResult[] => {
  const results: AnalysisResult[] = [];
  
  if (factors.male !== undefined && factors.male < 0.8) {
    const maleLevel = factors.male;
    const domain = FUNCTIONAL_DOMAINS.MALE_FACTOR;
    
    // 🎯 Nested Male Factor Classification
    const maleConfig = getMaleNestedConfig(maleLevel);
    
    results.push({
      type: 'hypothesis',
      data: {
        condition: maleConfig.condition,
        probability: (1 - maleLevel) * 100,
        reasoning: `${maleConfig.severity}. Factor masculino presente en 40-50% parejas infértiles`,
        evidenceLevel: domain.evidence as EvidenceLevel,
        pmid: domain.pmid
      }
    });

    // 🧬 Nested Male Factor Treatments
    maleConfig.treatments.forEach((treatment, index) => {
      results.push({
        type: 'treatment',
        data: {
          treatment: treatment.protocol,
          priority: index < 2 ? maleConfig.priority : 'medium' as Priority,
          successRate: maleConfig.successRate + (index < 2 ? 15 : 10),
          timeframe: treatment.timeframe,
          reasoning: treatment.mechanism
        }
      });
    });

    // 🧠 Nested Predictions
    results.push({
      type: 'prediction',
      data: {
        outcome: 'Embarazo con TRA',
        probability: maleConfig.successRate,
        timeframe: maleConfig.timeframe,
        reasoning: maleConfig.prognostic
      }
    });
  }

  return results;
};

// 🎯 NESTED MALE FACTOR CONFIGURATION
const getMaleNestedConfig = (maleLevel: number) => {
  if (maleLevel < FUNCTIONAL_DOMAINS.MALE_FACTOR.thresholds.severe) {
    return {
      condition: 'Factor Masculino Severo (Oligoastenoteratozoospermia)',
      severity: 'Concentración <5M/mL + motilidad <10% + morfología <2%',
      treatments: [
        {
          protocol: 'FIV-ICSI + TESE/microTESE si azoospermia',
          timeframe: 'Protocolo 3-4 semanas',
          mechanism: 'Microinyección directa espermática + extracción testicular'
        },
        {
          protocol: 'Antioxidantes: CoQ10 200mg + vitamina E + zinc',
          timeframe: '3-6 meses pre-TRA',
          mechanism: 'Reducción estrés oxidativo + mejora parámetros seminales'
        }
      ],
      priority: 'high' as Priority,
      successRate: 55,
      timeframe: '3-6 meses',
      prognostic: 'ICSI bypasa limitaciones seminales. Tasa fertilización >80%'
    };
  } else if (maleLevel < FUNCTIONAL_DOMAINS.MALE_FACTOR.thresholds.moderate) {
    return {
      condition: 'Factor Masculino Moderado (Oligoastenozoospermia)',
      severity: 'Concentración 5-15M/mL + motilidad 10-32%',
      treatments: [
        {
          protocol: 'IUI con preparación seminal hasta 6 ciclos',
          timeframe: 'Cada ciclo',
          mechanism: 'Concentración espermatozoides móviles + bypass cervical'
        },
        {
          protocol: 'FIV-ICSI si falla IUI',
          timeframe: 'Protocolo 3-4 semanas',
          mechanism: 'Tecnología asistida avanzada'
        }
      ],
      priority: 'medium' as Priority,
      successRate: 70,
      timeframe: '6-9 meses',
      prognostic: 'IUI efectiva si >5M espermatozoides móviles post-lavado'
    };
  } else {
    return {
      condition: 'Factor Masculino Leve (Parámetros límite)',
      severity: 'Concentración 15-20M/mL + motilidad 32-40%',
      treatments: [
        {
          protocol: 'Optimización estilo vida + suplementación',
          timeframe: '3-6 meses',
          mechanism: 'Mejora calidad seminal con medidas conservadoras'
        }
      ],
      priority: 'low' as Priority,
      successRate: 85,
      timeframe: '6-12 meses',
      prognostic: 'Fertilidad natural posible con optimización'
    };
  }
};
