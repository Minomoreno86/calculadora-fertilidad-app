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
  analyzeMaleFactorFactors 
} from './functionalAnalysis';

// 🧠 BASIC ANALYSIS FUNCTIONS (Age, BMI, Duration)
export const analyzeAgeFactors = (age: number): AnalysisResult[] => {
  const results: AnalysisResult[] = [];
  
  if (age >= 35) {
    const urgency = age >= 40 ? 'immediate' : age >= 38 ? 'urgent' : 'routine';
    const probability = age >= 40 ? 85 : age >= 38 ? 70 : 55;
    
    results.push({
      type: 'hypothesis',
      data: {
        condition: age >= 40 ? 'Edad Reproductiva Avanzada (≥40 años)' : 'Reserva Ovárica Disminuida por Edad',
        probability,
        reasoning: `Declive folicular acelerado post-35 años. Fertilidad natural reducida ${age >= 40 ? '85%' : '50%'}`,
        evidenceLevel: 'A',
        pmid: '28236446'
      }
    });

    results.push({
      type: 'treatment',
      data: {
        treatment: age >= 40 ? 'FIV-ICSI inmediata + PGT-A' : 'IUI hasta 3 ciclos → FIV',
        priority: urgency === 'immediate' ? 'high' : 'medium',
        successRate: age >= 40 ? 35 : 50,
        timeframe: age >= 40 ? 'Inmediato' : '3-6 meses',
        reasoning: 'Ventana reproductiva limitada requiere intervención urgente'
      }
    });
  }

  return results;
};

export const analyzeBMIFactors = (factors: Factors): AnalysisResult[] => {
  const results: AnalysisResult[] = [];
  
  if (factors.bmi !== undefined && factors.bmi < 0.9) {
    const bmiData = getBMIAnalysisData(factors.bmi);
    
    results.push({
      type: 'hypothesis',
      data: {
        condition: bmiData.condition,
        probability: (1 - factors.bmi) * 100,
        reasoning: bmiData.reasoning,
        evidenceLevel: 'A',
        pmid: '28950721'
      }
    });

    bmiData.treatments.forEach((treatment, index) => {
      results.push({
        type: 'treatment',
        data: {
          treatment,
          priority: getTreatmentPriority(index, bmiData.priority as 'high' | 'medium' | 'low'),
          successRate: bmiData.successRate - (index * 5),
          timeframe: '3-6 meses',
          reasoning: getTreatmentReasoning(treatment)
        }
      });
    });
  }

  return results;
};

export const analyzeDurationFactors = (factors: Factors): AnalysisResult[] => {
  const results: AnalysisResult[] = [];
  
  if (factors.infertilityDuration !== undefined && factors.infertilityDuration > 12) {
    const duration = factors.infertilityDuration;
    const severity = duration > 36 ? 'prolongada' : duration > 24 ? 'moderada' : 'estándar';
    
    results.push({
      type: 'hypothesis',
      data: {
        condition: `Infertilidad ${severity} (${duration} meses)`,
        probability: Math.min(duration * 2, 95),
        reasoning: `Duración >12 meses reduce probabilidad concepción natural 50%. Factor tiempo crítico`,
        evidenceLevel: 'A',
        pmid: '29287096'
      }
    });

    results.push({
      type: 'treatment',
      data: {
        treatment: duration > 24 ? 'FIV-ICSI directa' : 'IUI acelerada + FIV backup',
        priority: duration > 36 ? 'high' : 'medium',
        successRate: Math.max(80 - (duration), 40),
        timeframe: duration > 24 ? '3 meses' : '6 meses',
        reasoning: 'Duración prolongada requiere intervención inmediata para maximizar probabilidades'
      }
    });
  }

  return results;
};

// 🧠 COMPREHENSIVE OTHER FACTORS ANALYZER - SOLO ANALIZA FACTORES PRESENTES
export const analyzeOtherFactors = (factors: Factors): AnalysisResult[] => {
  const allResults: AnalysisResult[] = [];
  
  // 🧬 HORMONAL DOMAIN ANALYSIS - Solo si factores hormonales están presentes
  if (factors.amh !== undefined) {
    allResults.push(...analyzeAMHFactors(factors));
  }
  if (factors.tsh !== undefined) {
    allResults.push(...analyzeTSHFactors(factors));
  }
  if (factors.prolactin !== undefined) {
    allResults.push(...analyzeProlactinFactors(factors));
  }
  if (factors.homaIR !== undefined) {
    allResults.push(...analyzeHOMAFactors(factors));
  }
  
  // 🏗️ STRUCTURAL DOMAIN ANALYSIS - Solo si factores estructurales están presentes
  if (factors.endometriosis !== undefined && factors.endometriosis > 0) {
    allResults.push(...analyzeEndometriosisFactors(factors));
  }
  if (factors.adenomyosis !== undefined && factors.adenomyosis > 0) {
    allResults.push(...analyzeAdenomiosisFactors(factors));
  }
  if (factors.miomas !== undefined && factors.miomas > 0) {
    allResults.push(...analyzeMiomasFactors(factors));
  }
  if (factors.polipos !== undefined && factors.polipos > 0) {
    allResults.push(...analyzePoliposFactors(factors));
  }
  
  // ⚙️ FUNCTIONAL DOMAIN ANALYSIS - Solo si factores funcionales están presentes
  if (factors.cycleIrregular !== undefined && factors.cycleIrregular > 0) {
    allResults.push(...analyzeCycleIrregularFactors(factors));
  }
  if (factors.pcos !== undefined && factors.pcos > 0) {
    allResults.push(...analyzePCOSFactors(factors));
  }
  if (factors.hsg !== undefined && factors.hsg > 0) {
    allResults.push(...analyzeHSGFactors(factors));
  }
  if (factors.maleFactor !== undefined && factors.maleFactor > 0) {
    allResults.push(...analyzeMaleFactorFactors(factors));
  }
  
  return allResults;
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
