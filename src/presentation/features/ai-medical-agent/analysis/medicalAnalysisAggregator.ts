// 🧠 MEDICAL ANALYSIS AGGREGATOR NESTED DOMAINS V13.1
// Módulo agregador que orquesta todos los análisis especializados

import { AnalysisResult, Factors } from '@/core/domain/models';

// 🎯 Import Nested Domain Analyzers
import { 
  analyzeAMHFactors, 
  analyzeTSHFactors, 
  analyzeProlactinFactors, 
  analyzeHOMAFactors 
} from './hormonalAnalysis';

import { 
  analyzeEndometriosisFactors, 
  analyzeAdenomiosisFactors, 
  analyzeMiomasFactors, 
  analyzePoliposFactors 
} from './structuralAnalysis';

import { 
  analyzeCycleIrregularFactors, 
  analyzePCOSFactors, 
  analyzeHSGFactors, 
  analyzeMaleFactorFactors,
  analyzeAgeFactors,
  analyzeBMIFactors,
  analyzeDurationFactors,
  analyzePelvicSurgeryFactors,
  analyzeOTBFactors
} from './functionalAnalysis';

// 🧠 COMPREHENSIVE OTHER FACTORS ANALYZER - SOLO ANALIZA FACTORES PRESENTES
export const analyzeOtherFactors = (factors: Factors, inputData?: unknown): AnalysisResult[] => {
  const allResults: AnalysisResult[] = [];
  
  // 🧬 HORMONAL DOMAIN ANALYSIS - Solo si factores hormonales están presentes Y alterados
  // ✅ AMH: Analizar SOLO si < 1.0 Y > 0 (reserva alterada pero presente) - evitar análisis de factores ausentes
  if (factors.amh !== undefined && factors.amh < 1.0 && factors.amh > 0) {
    console.log('🔍 [AGGREGATOR] AMH Analysis triggered:', factors.amh);
    allResults.push(...analyzeAMHFactors(factors));
  } else if (factors.amh !== undefined) {
    console.log('🔍 [AGGREGATOR] AMH Skipped - normal/absent:', factors.amh);
  }
  // ✅ TSH: Analizar SOLO si < 1.0 Y > 0 (función alterada pero presente) - evitar análisis de factores ausentes
  if (factors.tsh !== undefined && factors.tsh < 1.0 && factors.tsh > 0) {
    console.log('🔍 [AGGREGATOR] TSH Analysis triggered:', factors.tsh);
    allResults.push(...analyzeTSHFactors(factors));
  } else if (factors.tsh !== undefined) {
    console.log('🔍 [AGGREGATOR] TSH Skipped - normal/absent:', factors.tsh);
  }
  // ✅ PROLACTINA: analizar cuando factor < 1.0 Y > 0 (alterado Y presente, no ausente)
  if (factors.prolactin !== undefined && factors.prolactin < 1.0 && factors.prolactin > 0) {
    console.log('🔍 [AGGREGATOR] Prolactin Analysis triggered:', factors.prolactin);
    allResults.push(...analyzeProlactinFactors(factors));
  } else if (factors.prolactin !== undefined) {
    console.log('🔍 [AGGREGATOR] Prolactin Skipped - normal/absent:', factors.prolactin);
  }
  // ✅ HOMA-IR: analizar cuando factor < 1.0 Y > 0 (alterado Y presente, no ausente)
  const homaFactor = factors.homa || factors.homaIR;
  if (homaFactor !== undefined && homaFactor < 1.0 && homaFactor > 0) {
    console.log('🔍 [AGGREGATOR] HOMA-IR Analysis triggered:', homaFactor);
    allResults.push(...analyzeHOMAFactors(factors));
  } else if (homaFactor !== undefined) {
    console.log('🔍 [AGGREGATOR] HOMA-IR Skipped - normal/absent:', homaFactor);
  }
  
  // 🏗️ STRUCTURAL DOMAIN ANALYSIS - Solo si factores estructurales están presentes Y alterados
  if (factors.endometriosis !== undefined && factors.endometriosis !== 1.0 && factors.endometriosis <= 0.9) {
    // Get original endometriosis grade from input data
    const endometriosisGrade = inputData?.endometriosis || extractGradeFromFactor(factors.endometriosis);
    console.log('🔍 [AGGREGATOR] Endometriosis Analysis triggered:', {
      factor: factors.endometriosis,
      inputGrade: inputData?.endometriosis,
      extractedGrade: endometriosisGrade,
      usingGrade: endometriosisGrade,
      inputData: inputData
    });
    
    // 🎯 SPECIFIC GRADE 3 DEBUG
    if (endometriosisGrade === 3 || factors.endometriosis === 0.7) {
      console.log('🚨 [GRADE 3 DEBUG] Análisis específico Grado 3:', {
        endometriosisGrade,
        factor: factors.endometriosis,
        inputDataComplete: JSON.stringify(inputData),
        willCallAnalyzeEndometriosisFactors: true
      });
    }
    
    const endometriosisResults = analyzeEndometriosisFactors(factors, endometriosisGrade);
    console.log('🔍 [AGGREGATOR] Endometriosis Analysis Results:', {
      grade: endometriosisGrade,
      resultsCount: endometriosisResults.length,
      resultTypes: endometriosisResults.map(r => r.type),
      firstResult: endometriosisResults[0]
    });
    allResults.push(...endometriosisResults);
  }
  if (factors.adenomyosis !== undefined && factors.adenomyosis !== 1.0 && factors.adenomyosis < 0.9 && factors.adenomyosis > 0) {
    console.log('🔍 [AGGREGATOR] Adenomyosis Analysis triggered:', factors.adenomyosis);
    console.log('🚨 [ADENOMYOSIS DEBUG] Análisis específico Adenomiosis:', {
      factor: factors.adenomyosis,
      inputData: inputData,
      willCallAnalyzeAdenomiosisFactors: true,
      expectedType: factors.adenomyosis === 0.8 ? 'FOCAL' : factors.adenomyosis === 0.5 ? 'DIFUSA' : 'UNKNOWN'
    });
    const adenomyosisResults = analyzeAdenomiosisFactors(factors);
    console.log('🔍 [AGGREGATOR] Adenomyosis Analysis Results:', {
      resultsCount: adenomyosisResults.length,
      resultTypes: adenomyosisResults.map(r => r.type),
      firstResult: adenomyosisResults[0]
    });
    allResults.push(...adenomyosisResults);
  } else if (factors.adenomyosis !== undefined) {
    console.log('🔍 [AGGREGATOR] Adenomyosis Analysis SKIPPED - normal or zero factor:', factors.adenomyosis);
  }
  if (factors.myoma !== undefined && factors.myoma !== 1.0 && factors.myoma < 0.9 && factors.myoma > 0) {
    console.log('🔍 [AGGREGATOR] Myoma Analysis triggered:', factors.myoma);
    allResults.push(...analyzeMiomasFactors(factors));
  } else if (factors.myoma !== undefined) {
    console.log('🔍 [AGGREGATOR] Myoma Analysis SKIPPED - normal or zero factor:', factors.myoma);
  }
  if (factors.polyp !== undefined && factors.polyp !== 1.0 && factors.polyp < 0.9 && factors.polyp > 0) {
    console.log('🔍 [AGGREGATOR] Polyp Analysis triggered:', factors.polyp);
    console.log('🚨 [POLYP DEBUG] Análisis específico Pólipos:', {
      factor: factors.polyp,
      inputData: inputData,
      willCallAnalyzePoliposFactors: true
    });
    const polypResults = analyzePoliposFactors(factors);
    console.log('🔍 [AGGREGATOR] Polyp Analysis Results:', {
      resultsCount: polypResults.length,
      resultTypes: polypResults.map(r => r.type),
      firstResult: polypResults[0]
    });
    allResults.push(...polypResults);
  } else if (factors.polyp !== undefined) {
    console.log('🔍 [AGGREGATOR] Polyp Analysis SKIPPED - normal or zero factor:', factors.polyp);
  }
  
  // ⚙️ FUNCTIONAL DOMAIN ANALYSIS - Solo si factores funcionales están presentes Y alterados
  console.log('🔍 [AGGREGATOR] Cycle Irregular Analysis Debug:', {
    cycleIrregular: factors.cycleIrregular,
    isDefined: factors.cycleIrregular !== undefined,
    isNotOne: factors.cycleIrregular !== 1.0,
    isLessThan08: factors.cycleIrregular !== undefined && factors.cycleIrregular < 0.8,
    willAnalyze: factors.cycleIrregular !== undefined && factors.cycleIrregular !== 1.0 && factors.cycleIrregular < 0.8
  });
  
  if (factors.cycleIrregular !== undefined && factors.cycleIrregular !== 1.0 && factors.cycleIrregular < 0.8) {
    const cycleResults = analyzeCycleIrregularFactors(factors.cycleIrregular);
    console.log('🔍 [AGGREGATOR] Cycle Irregular Analysis Results:', cycleResults.length, 'results');
    allResults.push(...cycleResults);
  }
  if (factors.pcos !== undefined && factors.pcos !== 1.0 && factors.pcos < 0.8) {
    allResults.push(...analyzePCOSFactors(factors));
  }
  if (factors.hsg !== undefined && factors.hsg !== 1.0 && factors.hsg < 0.8) {
    console.log('🔍 [AGGREGATOR] HSG Analysis triggered:', { factor: factors.hsg, hasInputData: !!inputData });
    allResults.push(...analyzeHSGFactors(factors, inputData));
  }
  // ✅ FACTOR MASCULINO: analizar cuando factor < 1.0 Y > 0 (alterado Y presente, no ausente)
  // El factor se llama 'male' en el sistema, no 'maleFactor'
  if (factors.male !== undefined && factors.male < 1.0 && factors.male > 0) {
    console.log('🔍 [AGGREGATOR] Male Factor Analysis triggered:', factors.male);
    allResults.push(...analyzeMaleFactorFactors(factors));
  } else if (factors.male !== undefined) {
    console.log('🔍 [AGGREGATOR] Male Factor Skipped - normal/absent:', factors.male);
  }
  
  // 🏥 PELVIC SURGERY ANALYSIS - Solo si cirugías pélvicas están presentes Y alteradas
  if (factors.pelvicSurgery !== undefined && factors.pelvicSurgery !== 1.0 && factors.pelvicSurgery < 0.98) {
    console.log('🔍 [AGGREGATOR] Pelvic Surgery Analysis triggered:', { 
      factor: factors.pelvicSurgery, 
      hasInputData: !!inputData 
    });
    allResults.push(...analyzePelvicSurgeryFactors(factors));
  } else if (factors.pelvicSurgery !== undefined) {
    console.log('🔍 [AGGREGATOR] Pelvic Surgery Skipped - normal or no surgeries:', factors.pelvicSurgery);
  }
  
  // 🚫 OTB ANALYSIS - Solo si OTB está presente Y alterado
  if (factors.otb !== undefined && factors.otb !== 1.0 && factors.otb < 0.98) {
    console.log('🔍 [AGGREGATOR] OTB Analysis triggered:', { 
      factor: factors.otb, 
      hasInputData: !!inputData 
    });
    allResults.push(...analyzeOTBFactors(factors));
  } else if (factors.otb !== undefined) {
    console.log('🔍 [AGGREGATOR] OTB Skipped - normal or no OTB:', factors.otb);
  }
  
  // 🕐 TEMPORAL DOMAIN ANALYSIS - Solo si duración de infertilidad está presente Y alterada
  if (factors.infertilityDuration !== undefined && factors.infertilityDuration !== 1.0 && factors.infertilityDuration < 0.8) {
    console.log('🔍 [AGGREGATOR] Infertility Duration Analysis triggered:', factors.infertilityDuration);
    console.log('🔍 [AGGREGATOR] Infertility Duration Skipped - aggregator no maneja duración directamente');
    // NO HACER ANÁLISIS AQUÍ - el análisis de duración se hace en AIConsultation.tsx directamente
  } else if (factors.infertilityDuration !== undefined) {
    console.log('🔍 [AGGREGATOR] Infertility Duration Skipped - normal duration:', factors.infertilityDuration);
  }
  
  return allResults;
};

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

// 🎯 HELPER FUNCTIONS
const getBMIAnalysisData = (bmiLevel: number) => {
  if (bmiLevel < 0.2) {
    return {
      condition: 'Obesidad Severa (BMI >35 kg/m²)',
      reasoning: 'Obesidad severa: anovulación + resistencia insulínica + reducción fertilidad 70%',
      treatments: [
        'Semaglutida 1mg/semana + dieta hipocalórica',
        'Cirugía bariátrica si BMI >40 + comorbilidades',
        'Metformina 1500mg + actividad física supervisada'
      ],
      priority: 'high',
      successRate: 60
    };
  } else if (bmiLevel < 0.4) {
    return {
      condition: 'Obesidad Moderada (BMI 30-35 kg/m²)',
      reasoning: 'Obesidad: disfunción ovulatoria + alteración calidad embrionaria',
      treatments: [
        'Liraglutida 1.8mg/día + dieta mediterránea',
        'Programa ejercicio estructurado 150min/semana',
        'Orlistat 120mg TID + soporte nutricional'
      ],
      priority: 'medium',
      successRate: 75
    };
  } else if (bmiLevel < 0.6) {
    return {
      condition: 'Sobrepeso (BMI 25-30 kg/m²)',
      reasoning: 'Sobrepeso: resistencia insulínica leve + irregularidades ovulatorias',
      treatments: [
        'Dieta hipocalórica balanceada -500 kcal/día',
        'Ejercicio aeróbico + resistencia 3x/semana',
        'Metformina 500mg si resistencia insulínica'
      ],
      priority: 'medium',
      successRate: 85
    };
  } else if (bmiLevel < 0.8) {
    return {
      condition: 'Peso Normal Límite (BMI 22-25 kg/m²)',
      reasoning: 'Rango normal alto: optimización composición corporal',
      treatments: [
        'Dieta antiinflamatoria + antioxidantes',
        'Ejercicio moderado + técnicas relajación'
      ],
      priority: 'low',
      successRate: 95
    };
  } else {
    return {
      condition: 'Bajo Peso (BMI <18.5 kg/m²)',
      reasoning: 'Bajo peso: amenorrea hipotalámica + deficiencias nutricionales',
      treatments: [
        'Incremento calórico gradual +300-500 kcal/día',
        'Suplementación: hierro + B12 + ácido fólico',
        'Evaluación trastornos alimentarios'
      ],
      priority: 'high',
      successRate: 80
    };
  }
};

const getTreatmentPriority = (index: number, basePriority: 'high' | 'medium' | 'low'): 'high' | 'medium' | 'low' => {
  if (index === 0) return basePriority;
  return basePriority === 'high' ? 'medium' : 'low';
};

const getTreatmentReasoning = (treatment: string): string => {
  if (treatment.includes('Semaglutida')) return 'GLP-1: pérdida peso 15-20% + mejora fertilidad 60%';
  if (treatment.includes('Liraglutida')) return 'GLP-1: pérdida peso 8-12% + restauración ovulación';
  if (treatment.includes('Cirugía')) return 'Pérdida peso sostenida >30% + resolución comorbilidades';
  if (treatment.includes('Orlistat')) return 'Inhibidor lipasa: pérdida peso 5-10% + mejora metabólica';
  return 'Enfoque integral para optimización metabólica';
};

// 🎯 RE-EXPORT FUNCTIONS FROM FUNCTIONAL ANALYSIS FOR COMPATIBILITY
export {
  analyzeAgeFactors,
  analyzeBMIFactors,
  analyzeDurationFactors,
  analyzePelvicSurgeryFactors,
  analyzeOTBFactors
} from './functionalAnalysis';
