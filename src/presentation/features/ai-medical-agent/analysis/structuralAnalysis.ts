// 🏗️ STRUCTURAL ANALYSIS NESTED DOMAINS MODULE V13.1
// Análisis especializado para factores anatómicos estructurales con nested intelligence

import { AnalysisResult, Factors } from '@/core/domain/models';

// 🎯 TYPES FOR STRUCTURAL ANALYSIS
type EvidenceLevel = 'A' | 'B' | 'C';
type Priority = 'high' | 'medium' | 'low';

// Helper function to extract grade from normalized factor
const extractGradeFromFactor = (factor?: number): number => {
  if (!factor || factor >= 1.0) return 0;
  // 🏥 ACTUALIZADO: Mapeo individual por grados según nuevos factores
  if (factor <= 0.6) return 4; // Endometriosis severa (Grado IV)
  if (factor <= 0.7) return 3; // Endometriosis moderada (Grado III)
  if (factor <= 0.85) return 2; // Endometriosis leve (Grado II)
  if (factor <= 0.9) return 1; // Endometriosis mínima (Grado I)
  return 1; // Default to mild if unclear
};

// 🧠 ENDOMETRIOSIS NESTED ANALYSIS DOMAIN - GRADOS INDIVIDUALES
export const analyzeEndometriosisFactors = (factors: Factors, endometriosisGrade?: number): AnalysisResult[] => {
  const results: AnalysisResult[] = [];
  
  // Use the real grade (1-4) if provided, otherwise try to extract from factors
  const realGrade = endometriosisGrade || extractGradeFromFactor(factors.endometriosis);
  
  console.log('🔍 [ENDOMETRIOSIS ANALYSIS] Debug:', {
    factorValue: factors.endometriosis,
    providedGrade: endometriosisGrade,
    extractedGrade: realGrade,
    willAnalyze: realGrade > 0
  });
  
  if (realGrade === 1) {
    // 🏥 GRADO I - ENDOMETRIOSIS MÍNIMA
    results.push({
      type: 'hypothesis',
      data: {
        condition: 'Endometriosis Mínima - Estadio I',
        probability: 90,
        reasoning: 'Implantes peritoneales superficiales aislados, sin adherencias significativas',
        evidenceLevel: 'A' as EvidenceLevel,
        pmid: '28218889'
      }
    });

    results.push({
      type: 'treatment',
      data: {
        treatment: 'Manejo expectante + ácido fólico + antioxidantes naturales',
        priority: 'low' as Priority,
        successRate: 85,
        timeframe: '3-6 meses observación',
        reasoning: 'Estadio I: Impacto mínimo en fertilidad, monitoreo conservador'
      }
    });

    results.push({
      type: 'treatment',
      data: {
        treatment: 'Optimización estilo de vida + dieta antiinflamatoria',
        priority: 'medium' as Priority,
        successRate: 80,
        timeframe: 'Implementación inmediata',
        reasoning: 'Prevención progresión + control síntomas leves'
      }
    });

  } else if (realGrade === 2) {
    // 🏥 GRADO II - ENDOMETRIOSIS LEVE
    results.push({
      type: 'hypothesis',
      data: {
        condition: 'Endometriosis Leve - Estadio II',
        probability: 90,
        reasoning: 'Implantes superficiales + adherencias leves, posible impacto en calidad ovocitaria',
        evidenceLevel: 'A' as EvidenceLevel,
        pmid: '28218889'
      }
    });

    results.push({
      type: 'treatment',
      data: {
        treatment: 'Laparoscopia diagnóstica + ablación lesiones superficiales',
        priority: 'medium' as Priority,
        successRate: 75,
        timeframe: '1-2 horas cirugía + recuperación 2 semanas',
        reasoning: 'Estadio II: Tratamiento conservador con preservación total fertilidad'
      }
    });

    results.push({
      type: 'treatment',
      data: {
        treatment: 'Suplementación CoQ10 + omega-3 + vitamina D3',
        priority: 'medium' as Priority,
        successRate: 70,
        timeframe: '3-6 meses tratamiento',
        reasoning: 'Mejora función mitocondrial ovocitaria + control inflamación'
      }
    });

  } else if (realGrade === 3) {
    // 🏥 GRADO III - ENDOMETRIOSIS MODERADA
    results.push({
      type: 'hypothesis',
      data: {
        condition: 'Endometriosis Moderada - Estadio III/IV',
        probability: 95,
        reasoning: 'Distorsión anatómica pélvica + inflamación crónica + formación adherencias + endometriomas >3cm. Impacto significativo fertilidad',
        evidenceLevel: 'A' as EvidenceLevel,
        pmid: '35373629'
      }
    });

    results.push({
      type: 'treatment',
      data: {
        treatment: 'PROTOCOLO QUIRÚRGICO CONSERVADOR: Laparoscopia excisional + resección endometriomas >3cm + adhesiolisis completa preservando corteza ovárica',
        priority: 'high' as Priority,
        successRate: 65,
        timeframe: '2-3 horas cirugía especializada + recuperación 4-6 semanas',
        reasoning: 'Cirugía conservadora mejora anatomía pélvica + acceso ovocitario. Crítico preservar reserva ovárica'
      }
    });

    results.push({
      type: 'treatment',
      data: {
        treatment: 'POST-QUIRÚRGICO INMEDIATO: FIV con transferencia embrión único + protocolo largo GnRH-agonista (ventana terapéutica óptima)',
        priority: 'high' as Priority,
        successRate: 55,
        timeframe: 'Iniciar FIV 2-3 meses post-cirugía (máximo 6 meses)',
        reasoning: 'Grado III: FIV post-cirugía mejora tasas vs cirugía sola. NO RETRASAR >6 meses si edad >35 años'
      }
    });

    results.push({
      type: 'treatment',
      data: {
        treatment: 'EVALUACIÓN RESERVA CRÍTICA: AMH + recuento folicular antral pre/post-quirúrgico + criopreservación ovocitaria si AMH <1.5',
        priority: 'high' as Priority,
        successRate: 90,
        timeframe: 'Pre-operatorio obligatorio + control 6-8 semanas post-cirugía',
        reasoning: 'Preservación fertilidad: planificar cirugía conservadora + timing FIV según reserva residual'
      }
    });

  } else if (realGrade === 4) {
    // 🏥 GRADO IV - ENDOMETRIOSIS SEVERA
    results.push({
      type: 'hypothesis',
      data: {
        condition: 'Endometriosis Severa - Estadio IV',
        probability: 98,
        reasoning: 'Distorsión anatómica severa + adherencias densas + endometriosis profunda infiltrante',
        evidenceLevel: 'A' as EvidenceLevel,
        pmid: '28218889'
      }
    });

    results.push({
      type: 'treatment',
      data: {
        treatment: 'Cirugía multidisciplinaria + resección endometriosis profunda + reconstrucción',
        priority: 'high' as Priority,
        successRate: 50,
        timeframe: '4-6 horas cirugía + seguimiento 6 meses',
        reasoning: 'Estadio IV: Cirugía compleja con equipo especializado en fertilidad'
      }
    });

    results.push({
      type: 'treatment',
      data: {
        treatment: 'Evaluación FIV inmediata + preservación fertilidad',
        priority: 'high' as Priority,
        successRate: 45,
        timeframe: 'Consideración inmediata',
        reasoning: 'Estadio IV: Alta probabilidad distorsión anatómica irreversible'
      }
    });

    results.push({
      type: 'treatment',
      data: {
        treatment: 'Manejo dolor crónico + terapia hormonal pre-quirúrgica',
        priority: 'high' as Priority,
        successRate: 70,
        timeframe: '2-3 meses pre-operatorio',
        reasoning: 'Optimización condición general + control síntomas severos'
      }
    });
  }

  return results;
};

// 🧠 ADENOMYOSIS NESTED ANALYSIS DOMAIN
export const analyzeAdenomiosisFactors = (factors: Factors): AnalysisResult[] => {
  const results: AnalysisResult[] = [];
  
  if (factors.adenomyosis !== undefined && factors.adenomyosis < 0.9) {
    const adenomyosisLevel = factors.adenomyosis;
    
    // 🎯 LÓGICA CORREGIDA: Factor MÁS BAJO = Mayor impacto = Adenomiosis más severa
    if (adenomyosisLevel <= 0.5) {
      // Factor 0.5 = Difusa (MÁS SEVERA)
      results.push({
        type: 'hypothesis',
        data: {
          condition: 'Adenomiosis Difusa',
          probability: 90,
          reasoning: 'Adenomiosis difusa: alteración contractilidad uterina + implantación defectuosa + reducción tasas de embarazo',
          evidenceLevel: 'A' as EvidenceLevel,
          pmid: '28344928'
        }
      });

      results.push({
        type: 'treatment',
        data: {
          treatment: 'Protocolo integral adenomiosis difusa: GnRH 2-3 meses → FIV + transferencia diferida',
          priority: 'high' as Priority,
          successRate: 45,
          timeframe: '2-3 meses preparación + FIV + seguimiento hasta semana 12',
          reasoning: 'Supresión adenomiosis + mejora receptividad endometrial + anticoagulación preventiva'
        }
      });

      results.push({
        type: 'treatment',
        data: {
          treatment: 'ANTICOAGULACIÓN ESPECIALIZADA: Enoxaparina 40mg SC/día desde transferencia hasta semana 12',
          priority: 'high' as Priority,
          successRate: 65,
          timeframe: 'Desde transferencia embrionaria hasta embarazo semana 12',
          reasoning: 'Heparina bajo peso molecular previene trombosis microvascular + mejora perfusión endometrial'
        }
      });

      results.push({
        type: 'treatment',
        data: {
          treatment: 'SOPORTE FARMACOLÓGICO: Aspirina 100mg/día + Estradiol valerate 6-8mg + Progesterona dual',
          priority: 'medium' as Priority,
          successRate: 70,
          timeframe: 'Desde estimulación hasta confirmación embarazo',
          reasoning: 'Aspirina mejora flujo uteroplacentario + preparación endometrial prolongada + soporte luteal óptimo'
        }
      });
    } else if (adenomyosisLevel <= 0.8) {
      // Factor 0.8 = Focal (MENOS SEVERA)
      results.push({
        type: 'hypothesis',
        data: {
          condition: 'Adenomiosis Focal',
          probability: 75,
          reasoning: 'Adenomiosis focal: impacto fertilidad variable según localización y extensión',
          evidenceLevel: 'B' as EvidenceLevel,
          pmid: '28344928'
        }
      });

      results.push({
        type: 'treatment',
        data: {
          treatment: 'Manejo conservador + Aspirina 100mg/día + evaluación TRA en 6 meses',
          priority: 'medium' as Priority,
          successRate: 65,
          timeframe: '6 meses intento natural + evaluación TRA',
          reasoning: 'Control síntomas + optimización función uterina + preservación fertilidad + mejora perfusión'
        }
      });

      results.push({
        type: 'treatment',
        data: {
          treatment: 'Si TRA requerida: Protocolo corto + Aspirina 100mg hasta confirmación embarazo',
          priority: 'medium' as Priority,
          successRate: 75,
          timeframe: 'Protocolo FIV estándar + seguimiento hasta semana 8',
          reasoning: 'Adenomiosis focal responde bien a protocolos menos agresivos + aspirina preventiva'
        }
      });
    }

    results.push({
      type: 'monitoring',
      data: {
        parameter: 'SEGUIMIENTO ESPECIALIZADO: Plaquetas + anti-Xa + Doppler arterias uterinas + Control obstétrico',
        frequency: 'Plaquetas semanal durante HBPM + Doppler mensual + Obstétrico cada 2 semanas',
        target: 'Plaquetas >100,000 + anti-Xa 0.2-0.4 U/mL + IP arterias uterinas <2.6 + Embarazo sin complicaciones'
      }
    });
  }

  return results;
};

// 🧠 MYOMAS NESTED ANALYSIS DOMAIN
export const analyzeMiomasFactors = (factors: Factors): AnalysisResult[] => {
  const results: AnalysisResult[] = [];
  
  if (factors.myoma !== undefined && factors.myoma < 1.0) {
    const myomaFactor = factors.myoma;
    
    console.log('🔍 [MIOMAS ANALYSIS] Debug:', {
      myomaFactor: myomaFactor,
      isSubmucosal: myomaFactor === 0.3,
      isIntramuralLarge: myomaFactor === 0.6,
      willAnalyze: myomaFactor < 1.0 && myomaFactor > 0
    });
    
    if (myomaFactor === 0.3) {
      // Factor 0.3: Mioma Submucoso (más severo)
      results.push({
        type: 'hypothesis',
        data: {
          condition: 'Mioma Submucoso - Alta Prioridad Quirúrgica',
          probability: 95,
          reasoning: 'Mioma submucoso: distorsión cavidad uterina + bloqueo implantación + sangrado anormal',
          evidenceLevel: 'A' as EvidenceLevel,
          pmid: '29268058'
        }
      });

      results.push({
        type: 'treatment',
        data: {
          treatment: 'Histeroscopia resectiva URGENTE - Miomectomía submucosa',
          priority: 'high' as Priority,
          successRate: 85,
          timeframe: '1-2 horas cirugía + 4-6 semanas recuperación',
          reasoning: 'Mioma submucoso requiere resección inmediata: impide implantación embrionaria'
        }
      });

      results.push({
        type: 'treatment',
        data: {
          treatment: 'Evaluación fertilidad post-quirúrgica inmediata',
          priority: 'high' as Priority,
          successRate: 75,
          timeframe: '2-3 meses post-cirugía',
          reasoning: 'Ventana óptima fertilidad tras resección submucosa: 3-6 meses'
        }
      });
    } else if (myomaFactor === 0.6) {
      // Factor 0.6: Mioma Intramural Grande (moderado)
      results.push({
        type: 'hypothesis',
        data: {
          condition: 'Mioma Intramural Grande (>4cm) - Moderado Impacto',
          probability: 85,
          reasoning: 'Mioma intramural grande: posible alteración contractilidad uterina + flujo sanguíneo',
          evidenceLevel: 'B' as EvidenceLevel,
          pmid: '29268058'
        }
      });

      results.push({
        type: 'treatment',
        data: {
          treatment: 'Miomectomía laparoscópica selectiva',
          priority: 'medium' as Priority,
          successRate: 75,
          timeframe: '2-3 horas cirugía + 6-8 semanas recuperación',
          reasoning: 'Resección intramural preservando arquitectura uterina + fertilidad'
        }
      });

      results.push({
        type: 'treatment',
        data: {
          treatment: 'Evaluación pre-quirúrgica: RM pélvica + mapa vascular',
          priority: 'medium' as Priority,
          successRate: 90,
          timeframe: '2-4 semanas pre-cirugía',
          reasoning: 'Planificación quirúrgica precisa: localización + preservación miometrio'
        }
      });
    } else {
      // Factor desconocido - análisis genérico
      results.push({
        type: 'hypothesis',
        data: {
          condition: 'Miomatosis Uterina - Evaluación Requerida',
          probability: 80,
          reasoning: 'Presencia miomatosis confirmada: requiere caracterización específica',
          evidenceLevel: 'C' as EvidenceLevel,
          pmid: '29268058'
        }
      });

      results.push({
        type: 'treatment',
        data: {
          treatment: 'Ultrasonido transvaginal + evaluación ginecológica especializada',
          priority: 'medium' as Priority,
          successRate: 95,
          timeframe: '1-2 semanas',
          reasoning: 'Caracterización completa: tamaño + localización + impacto fertilidad'
        }
      });
    }
  }

  return results;
};

// 🧠 POLYPS NESTED ANALYSIS DOMAIN
export const analyzePoliposFactors = (factors: Factors): AnalysisResult[] => {
  const results: AnalysisResult[] = [];
  
  if (factors.polyp !== undefined && factors.polyp < 0.9) {
    const polypLevel = factors.polyp;
    
    // 🎯 LÓGICA CORREGIDA: Factor MÁS BAJO = Mayor impacto = Pólipos más severos
    if (polypLevel <= 0.5) {
      // Factor 0.5 = Ostium (MÁS SEVERO)
      results.push({
        type: 'hypothesis',
        data: {
          condition: 'Pólipo sobre Ostium Tubárico',
          probability: 95,
          reasoning: 'Pólipo obstruyendo entrada tubárica: impacto directo en fertilidad',
          evidenceLevel: 'A' as EvidenceLevel,
          pmid: '28948120'
        }
      });

      results.push({
        type: 'treatment',
        data: {
          treatment: 'Histeroscopia operatoria URGENTE + polipectomía completa + verificación permeabilidad',
          priority: 'high' as Priority,
          successRate: 90,
          timeframe: '1-2 horas ambulatorio',
          reasoning: 'Resección completa + liberación ostium + restauración permeabilidad tubárica'
        }
      });
    } else if (polypLevel <= 0.7) {
      // Factor 0.7 = Large (MODERADAMENTE SEVERO)
      results.push({
        type: 'hypothesis',
        data: {
          condition: 'Pólipos Endometriales Grandes (≥1cm) o Múltiples',
          probability: 85,
          reasoning: 'Pólipos grandes/múltiples: obstrucción cavidad + alteración implantación',
          evidenceLevel: 'A' as EvidenceLevel,
          pmid: '28948120'
        }
      });

      results.push({
        type: 'treatment',
        data: {
          treatment: 'Histeroscopia operatoria + polipectomía completa',
          priority: 'high' as Priority,
          successRate: 85,
          timeframe: '1-2 horas ambulatorio',
          reasoning: 'Resección completa + biopsia + restauración cavidad'
        }
      });
    } else if (polypLevel <= 0.85) {
      // Factor 0.85 = Small (MENOS SEVERO)
      results.push({
        type: 'hypothesis',
        data: {
          condition: 'Pólipo Endometrial Pequeño (<1cm)',
          probability: 70,
          reasoning: 'Pólipo pequeño: impacto fertilidad variable según localización',
          evidenceLevel: 'B' as EvidenceLevel,
          pmid: '28948120'
        }
      });

      results.push({
        type: 'treatment',
        data: {
          treatment: 'Histeroscopia diagnóstica + polipectomía selectiva',
          priority: 'medium' as Priority,
          successRate: 80,
          timeframe: '30-60 minutos',
          reasoning: 'Eliminación dirigida + preservación endometrio sano'
        }
      });
    }

    results.push({
      type: 'monitoring',
      data: {
        parameter: 'Ecografía transvaginal + HSG',
        frequency: 'Post-operatorio a 3 meses + control anual',
        target: 'Cavidad endometrial libre + grosor endometrial normal'
      }
    });
  }

  return results;
};