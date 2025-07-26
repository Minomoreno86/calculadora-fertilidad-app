// 🏗️ STRUCTURAL ANALYSIS NESTED DOMAINS MODULE V13.1
// Análisis especializado para factores anatómicos estructurales con nested intelligence

import { AnalysisResult, Factors } from '@/core/domain/models';

// 🎯 TYPES FOR STRUCTURAL ANALYSIS
type EvidenceLevel = 'A' | 'B' | 'C';
type Priority = 'high' | 'medium' | 'low';

// 🧠 ENDOMETRIOSIS NESTED ANALYSIS DOMAIN
export const analyzeEndometriosisFactors = (factors: Factors): AnalysisResult[] => {
  const results: AnalysisResult[] = [];
  
  if (factors.endometriosis !== undefined && factors.endometriosis > 0) {
    const endometriosisGrade = factors.endometriosis;
    
    if (endometriosisGrade >= 3) {
      results.push({
        type: 'hypothesis',
        data: {
          condition: 'Endometriosis Severa (Estadio III-IV)',
          probability: 95,
          reasoning: 'Endometriosis profunda: distorsión anatómica + inflamación crónica + adherencias',
          evidenceLevel: 'A' as EvidenceLevel,
          pmid: '28218889'
        }
      });

      results.push({
        type: 'treatment',
        data: {
          treatment: 'Laparoscopia excisional + adhesiolisis completa',
          priority: 'high' as Priority,
          successRate: 60,
          timeframe: '2-4 horas cirugía',
          reasoning: 'Resección completa lesiones + restauración anatomía'
        }
      });
    } else if (endometriosisGrade >= 2) {
      results.push({
        type: 'hypothesis',
        data: {
          condition: 'Endometriosis Moderada (Estadio II)',
          probability: 85,
          reasoning: 'Implantes peritoneales + endometriomas <4cm',
          evidenceLevel: 'A' as EvidenceLevel,
          pmid: '28218889'
        }
      });

      results.push({
        type: 'treatment',
        data: {
          treatment: 'Laparoscopia diagnóstica + ablación/excisión lesiones',
          priority: 'medium' as Priority,
          successRate: 70,
          timeframe: '1-2 horas cirugía',
          reasoning: 'Eliminación focos endometriósicos + mejora fertilidad'
        }
      });
    } else {
      results.push({
        type: 'hypothesis',
        data: {
          condition: 'Endometriosis Mínima (Estadio I)',
          probability: 75,
          reasoning: 'Implantes superficiales sin distorsión anatómica',
          evidenceLevel: 'A' as EvidenceLevel,
          pmid: '28218889'
        }
      });

      results.push({
        type: 'treatment',
        data: {
          treatment: 'Manejo conservador + optimización fertilidad natural',
          priority: 'low' as Priority,
          successRate: 80,
          timeframe: '6-12 meses',
          reasoning: 'Fertilidad preservada con endometriosis mínima'
        }
      });
    }
  }

  return results;
};

// 🧠 ADENOMYOSIS NESTED ANALYSIS DOMAIN
export const analyzeAdenomiosisFactors = (factors: Factors): AnalysisResult[] => {
  const results: AnalysisResult[] = [];
  
  if (factors.adenomyosis !== undefined && factors.adenomyosis > 0.3) {
    const adenomyosisLevel = factors.adenomyosis;
    
    if (adenomyosisLevel > 0.7) {
      results.push({
        type: 'hypothesis',
        data: {
          condition: 'Adenomiosis Difusa Severa',
          probability: 90,
          reasoning: 'Adenomiosis difusa: alteración contractilidad uterina + implantación defectuosa',
          evidenceLevel: 'A' as EvidenceLevel,
          pmid: '28344928'
        }
      });

      results.push({
        type: 'treatment',
        data: {
          treatment: 'Análogos GnRH 3-6 meses pre-TRA + FIV',
          priority: 'high' as Priority,
          successRate: 50,
          timeframe: '3-6 meses tratamiento médico',
          reasoning: 'Supresión adenomiosis + mejora receptividad endometrial'
        }
      });
    } else {
      results.push({
        type: 'hypothesis',
        data: {
          condition: 'Adenomiosis Focal/Leve',
          probability: 75,
          reasoning: 'Adenomiosis focal: impacto fertilidad variable según localización',
          evidenceLevel: 'B' as EvidenceLevel,
          pmid: '28344928'
        }
      });

      results.push({
        type: 'treatment',
        data: {
          treatment: 'Manejo conservador + antiinflamatorios',
          priority: 'medium' as Priority,
          successRate: 70,
          timeframe: '3-6 meses',
          reasoning: 'Control síntomas + optimización función uterina'
        }
      });
    }
  }

  return results;
};

// 🧠 MYOMAS NESTED ANALYSIS DOMAIN
export const analyzeMiomasFactors = (factors: Factors): AnalysisResult[] => {
  const results: AnalysisResult[] = [];
  
  if (factors.myoma !== undefined && factors.myoma > 0.2) {
    const myomaLevel = factors.myoma;
    
    if (myomaLevel > 0.8) {
      results.push({
        type: 'hypothesis',
        data: {
          condition: 'Miomatosis Múltiple (>5 miomas o >6cm)',
          probability: 95,
          reasoning: 'Miomatosis extensa: distorsión cavidad + vascularización alterada',
          evidenceLevel: 'A' as EvidenceLevel,
          pmid: '29268058'
        }
      });

      results.push({
        type: 'treatment',
        data: {
          treatment: 'Miomectomía laparoscópica/laparotómica según tamaño',
          priority: 'high' as Priority,
          successRate: 65,
          timeframe: '2-4 horas cirugía + 3-6 meses recuperación',
          reasoning: 'Resección múltiple preservando útero + fertilidad'
        }
      });
    } else if (myomaLevel > 0.5) {
      results.push({
        type: 'hypothesis',
        data: {
          condition: 'Miomas Intramurales 3-6cm',
          probability: 85,
          reasoning: 'Miomas intramurales medianos: posible alteración implantación',
          evidenceLevel: 'B' as EvidenceLevel,
          pmid: '29268058'
        }
      });

      results.push({
        type: 'treatment',
        data: {
          treatment: 'Miomectomía selectiva según localización',
          priority: 'medium' as Priority,
          successRate: 75,
          timeframe: '1-2 horas cirugía',
          reasoning: 'Resección dirigida miomas que afectan cavidad'
        }
      });
    } else {
      results.push({
        type: 'hypothesis',
        data: {
          condition: 'Miomas Pequeños Subserosos (<3cm)',
          probability: 70,
          reasoning: 'Miomas subserosos pequeños: impacto fertilidad mínimo',
          evidenceLevel: 'C' as EvidenceLevel,
          pmid: '29268058'
        }
      });

      results.push({
        type: 'treatment',
        data: {
          treatment: 'Seguimiento ecográfico + manejo expectante',
          priority: 'low' as Priority,
          successRate: 90,
          timeframe: 'Control semestral',
          reasoning: 'Monitoreo crecimiento sin intervención'
        }
      });
    }
  }

  return results;
};

// 🧠 POLYPS NESTED ANALYSIS DOMAIN
export const analyzePoliposFactors = (factors: Factors): AnalysisResult[] => {
  const results: AnalysisResult[] = [];
  
  if (factors.polyp !== undefined && factors.polyp > 0.3) {
    const polypLevel = factors.polyp;
    
    if (polypLevel > 0.7) {
      results.push({
        type: 'hypothesis',
        data: {
          condition: 'Pólipos Endometriales Múltiples (>2cm)',
          probability: 90,
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
    } else if (polypLevel > 0.5) {
      results.push({
        type: 'hypothesis',
        data: {
          condition: 'Pólipos Endometriales Moderados (1-2cm)',
          probability: 80,
          reasoning: 'Pólipos medianos: alteración flujo menstrual + posible infertilidad',
          evidenceLevel: 'A' as EvidenceLevel,
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
    } else {
      results.push({
        type: 'hypothesis',
        data: {
          condition: 'Pólipos Endometriales Pequeños (<1cm)',
          probability: 70,
          reasoning: 'Pólipos pequeños: impacto fertilidad variable',
          evidenceLevel: 'B' as EvidenceLevel,
          pmid: '28948120'
        }
      });

      results.push({
        type: 'treatment',
        data: {
          treatment: 'Vigilancia + reevaluación en 6 meses',
          priority: 'low' as Priority,
          successRate: 75,
          timeframe: 'Control semestral',
          reasoning: 'Algunos pólipos pequeños pueden resolverse espontáneamente'
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
