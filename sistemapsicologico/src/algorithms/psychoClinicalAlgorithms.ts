/**
 * Algoritmos Psico-Clínicos para Fertilidad
 * Basado en evidencia científica ESHRE, ASRM, APA 2024
 */

import type {
  PsychologicalProfile,
  PsychologicalRisk,
  InterventionRecommendation,
  PsychoClinicDecision,
  CrisisAssessment
} from '../types/psychological';

export class PsychoClinicalAlgorithms {
  
  /**
   * Evaluación integrada de riesgo psicológico
   * Combina todas las escalas para determinar nivel de riesgo global
   */
  static calculatePsychologicalRisk(profile: PsychologicalProfile): PsychologicalRisk {
    const factors: string[] = [];
    let totalRiskScore = 0;
    let maxPossibleScore = 0;

    // PSS-10: Estrés Percibido (peso: 25%)
    if (profile.assessments.stress) {
      const stressScore = profile.assessments.stress.totalScore;
      if (stressScore >= 27) {
        factors.push('Estrés severo (PSS-10 ≥27)');
        totalRiskScore += 25;
      } else if (stressScore >= 20) {
        factors.push('Estrés moderado-alto (PSS-10 20-26)');
        totalRiskScore += 15;
      } else if (stressScore >= 14) {
        factors.push('Estrés moderado (PSS-10 14-19)');
        totalRiskScore += 8;
      }
      maxPossibleScore += 25;
    }

    // PHQ-9F: Depresión (peso: 30%)
    if (profile.assessments.depression) {
      const depressionScore = profile.assessments.depression.totalScore;
      if (depressionScore >= 20) {
        factors.push('Depresión severa (PHQ-9F ≥20)');
        totalRiskScore += 30;
      } else if (depressionScore >= 15) {
        factors.push('Depresión moderada-severa (PHQ-9F 15-19)');
        totalRiskScore += 22;
      } else if (depressionScore >= 10) {
        factors.push('Depresión moderada (PHQ-9F 10-14)');
        totalRiskScore += 12;
      } else if (depressionScore >= 5) {
        factors.push('Depresión leve (PHQ-9F 5-9)');
        totalRiskScore += 6;
      }
      maxPossibleScore += 30;
    }

    // DAS-7: Calidad relación pareja (peso: 20%)
    if (profile.assessments.relationship) {
      const relationshipScore = profile.assessments.relationship.totalScore;
      if (relationshipScore < 14) {
        factors.push('Relación severamente comprometida (DAS-7 <14)');
        totalRiskScore += 20;
      } else if (relationshipScore < 21) {
        factors.push('Relación comprometida (DAS-7 14-20)');
        totalRiskScore += 12;
      }
      maxPossibleScore += 20;
    }

    // FertiQoL: Calidad de vida fertilidad (peso: 15%)
    if (profile.assessments.qualityOfLife) {
      const qolScore = profile.assessments.qualityOfLife.totalScore;
      if (qolScore < 40) {
        factors.push('Calidad vida severamente afectada (FertiQoL <40)');
        totalRiskScore += 15;
      } else if (qolScore < 60) {
        factors.push('Calidad vida comprometida (FertiQoL 40-59)');
        totalRiskScore += 10;
      }
      maxPossibleScore += 15;
    }

    // MSPSS-F: Soporte social (peso: 10%)
    if (profile.assessments.socialSupport) {
      const supportScore = profile.assessments.socialSupport.totalScore;
      if (supportScore < 42) {
        factors.push('Soporte social muy bajo (MSPSS-F <42)');
        totalRiskScore += 10;
      } else if (supportScore < 56) {
        factors.push('Soporte social bajo (MSPSS-F 42-55)');
        totalRiskScore += 6;
      }
      maxPossibleScore += 10;
    }

    // Cálculo nivel de riesgo
    const riskPercentage = maxPossibleScore > 0 ? (totalRiskScore / maxPossibleScore) * 100 : 0;
    
    let level: 'bajo' | 'moderado' | 'alto' | 'critico';
    let requiresUrgentIntervention = false;
    let contraindication = false;

    if (riskPercentage >= 75) {
      level = 'critico';
      requiresUrgentIntervention = true;
      contraindication = true;
    } else if (riskPercentage >= 50) {
      level = 'alto';
      requiresUrgentIntervention = true;
    } else if (riskPercentage >= 25) {
      level = 'moderado';
    } else {
      level = 'bajo';
    }

    return {
      level,
      factors,
      score: totalRiskScore,
      requiresUrgentIntervention,
      contraindication
    };
  }

  /**
   * Genera recomendaciones de intervención personalizadas
   */
  static generateInterventions(profile: PsychologicalProfile): InterventionRecommendation[] {
    const interventions: InterventionRecommendation[] = [];
    const risk = this.calculatePsychologicalRisk(profile);

    // Intervenciones por nivel de riesgo
    if (risk.level === 'critico' || risk.level === 'alto') {
      interventions.push({
        type: 'terapia_individual',
        priority: 'alta',
        description: 'Psicoterapia individual intensiva especializada en fertilidad',
        estimatedDuration: '3-6 meses',
        resources: [
          {
            type: 'contacto_profesional',
            title: 'Psicólogo especialista en fertilidad',
            description: 'Derivación a profesional especializado en salud mental reproductiva'
          }
        ]
      });
    }

    // Intervenciones específicas por escala
    if (profile.assessments.stress?.riskLevel === 'alto') {
      interventions.push({
        type: 'mindfulness',
        priority: 'alta',
        description: 'Programa mindfulness específico para fertilidad',
        estimatedDuration: '8 semanas',
        resources: [
          {
            type: 'app',
            title: 'Mindfulness Fertilidad',
            description: 'Meditaciones guiadas específicas para estrés reproductivo'
          },
          {
            type: 'ejercicio',
            title: 'Respiración 4-7-8',
            description: 'Técnica respiración para manejo estrés agudo'
          }
        ]
      });
    }

    if (profile.assessments.depression?.requiresIntervention) {
      interventions.push({
        type: 'psicofarmacologia',
        priority: 'alta',
        description: 'Evaluación psiquiátrica para medicación compatible con fertilidad',
        estimatedDuration: '1-2 consultas iniciales',
        resources: [
          {
            type: 'contacto_profesional',
            title: 'Psiquiatra reproductivo',
            description: 'Especialista en medicación psiquiátrica y fertilidad'
          }
        ]
      });
    }

    if (profile.assessments.relationship?.relationshipQuality === 'comprometida' || 
        profile.assessments.relationship?.relationshipQuality === 'severamente_afectada') {
      interventions.push({
        type: 'terapia_pareja',
        priority: 'alta',
        description: 'Terapia de pareja especializada en fertilidad',
        estimatedDuration: '2-4 meses',
        resources: [
          {
            type: 'contacto_profesional',
            title: 'Terapeuta de pareja fertilidad',
            description: 'Especialista en dinámicas relacionales y fertilidad'
          }
        ]
      });
    }

    if (profile.assessments.socialSupport?.supportLevel === 'bajo' || 
        profile.assessments.socialSupport?.supportLevel === 'muy_bajo') {
      interventions.push({
        type: 'grupos_apoyo',
        priority: 'media',
        description: 'Grupos de apoyo para parejas con infertilidad',
        estimatedDuration: 'Ongoing',
        resources: [
          {
            type: 'contacto_profesional',
            title: 'Grupos apoyo fertilidad',
            description: 'Conexión con grupos de apoyo locales y online'
          }
        ]
      });
    }

    // Psicoeducación siempre recomendada
    interventions.push({
      type: 'psicoeducacion',
      priority: 'media',
      description: 'Recursos educacionales sobre bienestar emocional y fertilidad',
      estimatedDuration: 'Autodirigido',
      resources: [
        {
          type: 'articulo',
          title: 'Guía bienestar emocional fertilidad',
          description: 'Información basada en evidencia sobre salud mental y fertilidad'
        },
        {
          type: 'video',
          title: 'Técnicas manejo estrés fertilidad',
          description: 'Videos educativos sobre estrategias de afrontamiento'
        }
      ]
    });

    return interventions;
  }

  /**
   * Algoritmo de decisión para proceder con tratamientos de fertilidad
   */
  static generateTreatmentDecision(
    profile: PsychologicalProfile,
    clinicalFactors: {
      age: number;
      bmi: number;
      infertilityDuration: number;
      treatmentHistory: string[];
    }
  ): PsychoClinicDecision {
    const risk = this.calculatePsychologicalRisk(profile);
    const interventions = this.generateInterventions(profile);
    
    let proceedWithTreatment = true;
    let delayRecommended = false;
    let delayDuration: string | undefined;
    const reasoning: string[] = [];
    const contraindications: string[] = [];

    // Evaluación PSS-10 (Estrés)
    if (profile.assessments.stress?.totalScore && profile.assessments.stress.totalScore >= 27) {
      reasoning.push('Estrés severo detectado (PSS-10 ≥27), impacto negativo demostrado en fertilidad');
      if (profile.assessments.stress.totalScore >= 32) {
        delayRecommended = true;
        delayDuration = '4-8 semanas';
        contraindications.push('Estrés extremo requiere estabilización previa');
      }
    }

    // Evaluación PHQ-9F (Depresión)
    if (profile.assessments.depression?.totalScore && profile.assessments.depression.totalScore >= 15) {
      reasoning.push('Depresión moderada-severa detectada, reduce tasas éxito y adherencia');
      delayRecommended = true;
      delayDuration = '6-12 semanas';
      contraindications.push('Depresión requiere tratamiento previo a procedimientos reproductivos');
    }

    if (profile.assessments.depression?.totalScore && profile.assessments.depression.totalScore >= 20) {
      proceedWithTreatment = false;
      contraindications.push('Depresión severa: contraindicación temporal absoluta');
    }

    // Evaluación DAS-7 (Relación pareja)
    if (profile.assessments.relationship?.totalScore !== undefined && profile.assessments.relationship.totalScore < 14) {
      reasoning.push('Relación pareja severamente comprometida, riesgo alto abandono tratamiento');
      delayRecommended = true;
      delayDuration = '2-4 meses';
    }

    // Evaluación riesgo global
    if (risk.level === 'critico') {
      proceedWithTreatment = false;
      contraindications.push('Riesgo psicológico crítico requiere estabilización integral');
    } else if (risk.level === 'alto') {
      delayRecommended = true;
      delayDuration = '6-8 semanas';
      reasoning.push('Riesgo psicológico alto, intervención previa optimiza resultados');
    }

    // Factores clínicos modificadores
    if (clinicalFactors.age >= 41 && delayRecommended) {
      reasoning.push('Edad materna avanzada: balancear intervención psicológica vs. factor tiempo');
      if (delayDuration === '6-12 semanas') {
        delayDuration = '4-6 semanas'; // Acortar delay por factor edad
      }
    }

    return {
      patientId: profile.patientId,
      psychologicalProfile: profile,
      clinicalFactors,
      recommendation: {
        proceedWithTreatment,
        delayRecommended,
        delayDuration,
        requiredInterventions: interventions.filter(i => i.priority === 'alta'),
        monitoringPlan: {
          frequency: risk.level === 'alto' || risk.level === 'critico' ? 'semanal' : 'quincenal',
          assessments: ['PSS-10', 'PHQ-9F', 'estado clínico'],
          triggers: ['Deterioro escalas psicológicas', 'Crisis emocional', 'Ideación suicida'],
          escalationCriteria: ['PHQ-9F ≥20', 'PSS-10 ≥32', 'Ideación suicida', 'Crisis relacional']
        }
      },
      reasoning,
      contraindications
    };
  }

  /**
   * Evaluación de crisis psicológica
   */
  static assessCrisis(
    depressionScore: number,
    responses: Array<{ questionId: number; response: number }>,
    additionalFactors: { suicidalIdeation?: boolean; recentLoss?: boolean }
  ): CrisisAssessment {
    let riskLevel: 'bajo' | 'moderado' | 'alto' | 'inminente' = 'bajo';
    const immediateActions: string[] = [];
    
    // Evaluar ideación suicida (PHQ-9 ítem 9)
    const suicidalIdeationItem = responses.find(r => r.questionId === 9);
    const suicidalIdeation = additionalFactors.suicidalIdeation || 
                            (suicidalIdeationItem && suicidalIdeationItem.response > 0);

    if (suicidalIdeation) {
      riskLevel = 'inminente';
      immediateActions.push('Contacto inmediato profesional salud mental');
      immediateActions.push('No dejar sola a la paciente');
      immediateActions.push('Activar protocolo emergencia psiquiátrica');
    } else if (depressionScore >= 20) {
      riskLevel = 'alto';
      immediateActions.push('Evaluación psicológica urgente (24-48h)');
      immediateActions.push('Suspender tratamientos fertilidad temporalmente');
    } else if (depressionScore >= 15) {
      riskLevel = 'moderado';
      immediateActions.push('Derivación psicológica prioritaria (1 semana)');
    }

    return {
      patientId: '', // Se asignará externamente
      timestamp: new Date(),
      suicidalIdeation: suicidalIdeation || false,
      selfHarmRisk: suicidalIdeation || false,
      psychosis: false, // Requiere evaluación adicional
      severeDepression: depressionScore >= 20,
      riskLevel,
      immediateActions,
      emergencyContacts: [
        {
          type: 'emergencias',
          name: 'Emergencias Médicas',
          phone: '911',
          availability: '24/7'
        },
        {
          type: 'linea_crisis',
          name: 'Línea Crisis Suicidio',
          phone: '988',
          availability: '24/7'
        },
        {
          type: 'psicologo',
          name: 'Psicólogo Emergencia',
          phone: 'Contactar clínica',
          availability: 'Horario laboral'
        }
      ]
    };
  }

  /**
   * Cálculo predictivo impacto psicológico en tasas de éxito
   */
  static predictFertilityOutcome(
    baselineSuccess: number,
    psychologicalProfile: PsychologicalProfile
  ): {
    adjustedSuccessRate: number;
    confidenceInterval: [number, number];
    factors: string[];
  } {
    let adjustment = 0;
    const factors: string[] = [];

    // Factores positivos
    if (psychologicalProfile.assessments.stress?.riskLevel === 'bajo') {
      adjustment += 0.05; // +5%
      factors.push('Estrés bajo: +5% tasa éxito');
    }

    if (psychologicalProfile.assessments.relationship?.relationshipQuality === 'excelente') {
      adjustment += 0.08; // +8%
      factors.push('Relación pareja excelente: +8% tasa éxito');
    }

    if (psychologicalProfile.assessments.socialSupport?.supportLevel === 'alto') {
      adjustment += 0.04; // +4%
      factors.push('Soporte social alto: +4% tasa éxito');
    }

    // Factores negativos
    if (psychologicalProfile.assessments.stress?.riskLevel === 'alto') {
      adjustment -= 0.29; // -29%
      factors.push('Estrés alto: -29% tasa éxito');
    }

    if (psychologicalProfile.assessments.depression?.depressionLevel === 'moderada_severa' || 
        psychologicalProfile.assessments.depression?.depressionLevel === 'severa') {
      adjustment -= 0.34; // -34%
      factors.push('Depresión severa: -34% tasa éxito');
    }

    if (psychologicalProfile.assessments.relationship?.relationshipQuality === 'severamente_afectada') {
      adjustment -= 0.25; // -25%
      factors.push('Relación comprometida: -25% tasa éxito');
    }

    const adjustedSuccessRate = Math.max(0, Math.min(1, baselineSuccess + adjustment));
    const margin = 0.05; // Margen error ±5%
    
    return {
      adjustedSuccessRate,
      confidenceInterval: [
        Math.max(0, adjustedSuccessRate - margin),
        Math.min(1, adjustedSuccessRate + margin)
      ],
      factors
    };
  }
}
