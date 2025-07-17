/**
 * 🧠 ALGORITMOS PSICO-CLÍNICOS INTEGRADOS - AEC-D
 * Implementación de los algoritmos del módulo psicológico
 */

import type {
  PsychologicalProfile,
  PsychologicalRisk,
  RiskFactor,
  InterventionRecommendation,
  PsychoMedicalIntegration,
  IntegratedRecommendation,
  PSS10Assessment,
  PHQ9FAssessment,
  DAS7Assessment
} from '../types/PsychologicalTypes';

export class PsychoClinicalAlgorithms {
  
  /**
   * 🎯 Algoritmo 1: Evaluación pre-tratamiento
   */
  static evaluatePreTreatment(profile: PsychologicalProfile): {
    canProceed: boolean;
    delayRecommended: boolean;
    delayWeeks: number;
    interventions: InterventionRecommendation[];
  } {
    const { assessments } = profile;
    
    // Criterios de alto riesgo
    const highDepression = assessments.phq9f && assessments.phq9f.totalScore >= 15;
    const severeStress = assessments.pss10 && assessments.pss10.totalScore >= 27;
    const relationshipCrisis = assessments.das7 && assessments.das7.totalScore < 14;
    
    if (highDepression || severeStress || relationshipCrisis) {
      return {
        canProceed: false,
        delayRecommended: true,
        delayWeeks: 4-8,
        interventions: this.generateUrgentInterventions(profile)
      };
    }
    
    // Criterios de riesgo moderado
    const moderateDepression = assessments.phq9f && assessments.phq9f.totalScore >= 10;
    const moderateStress = assessments.pss10 && assessments.pss10.totalScore >= 20;
    
    if (moderateDepression || moderateStress) {
      return {
        canProceed: true,
        delayRecommended: false,
        delayWeeks: 0,
        interventions: this.generateSupportiveInterventions(profile)
      };
    }
    
    return {
      canProceed: true,
      delayRecommended: false,
      delayWeeks: 0,
      interventions: this.generateStandardSupport(profile)
    };
  }

  /**
   * 🔄 Algoritmo 2: Seguimiento durante tratamiento
   */
  static monitorDuringTreatment(
    profile: PsychologicalProfile,
    treatmentPhase: 'stimulation' | 'retrieval' | 'transfer' | 'wait'
  ): {
    alertLevel: 'none' | 'moderate' | 'high' | 'critical';
    interventions: InterventionRecommendation[];
    nextEvaluation: Date;
  } {
    const currentStress = assessments.pss10?.totalScore || 0;
    
    switch (treatmentPhase) {
      case 'stimulation':
        if (currentStress >= 32) {
          return {
            alertLevel: 'critical',
            interventions: [{
              id: 'acute-stress-stimulation',
              type: 'urgent-referral',
              priority: 'urgent',
              title: 'Intervención Inmediata Estrés Agudo',
              description: 'Técnica respiración 4-7-8, contacto psicólogo 30min, alprazolam 0.25mg PRN',
              duration: '24-48h',
              provider: 'Psicólogo especialista + médico',
              evidenceLevel: 'A'
            }],
            nextEvaluation: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h
          };
        }
        break;
        
      case 'wait':
        return {
          alertLevel: 'moderate',
          interventions: [{
            id: 'beta-wait-support',
            type: 'lifestyle',
            priority: 'high',
            title: 'Soporte Beta Wait',
            description: 'Técnicas manejo ansiedad, distracción estructurada, mindfulness',
            duration: '14 días',
            provider: 'App + recursos online',
            evidenceLevel: 'B'
          }],
          nextEvaluation: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 días
        };
        
      default:
        return {
          alertLevel: 'none',
          interventions: [],
          nextEvaluation: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        };
    }
  }

  /**
   * 🎯 Algoritmo 3: Personalización por perfil psicológico
   */
  static personalizeIntervention(profile: PsychologicalProfile): InterventionRecommendation[] {
    const interventions: InterventionRecommendation[] = [];
    const { assessments } = profile;
    
    // Ansiedad alta
    if (assessments.fertiqol && assessments.fertiqol.emotional < 40) {
      interventions.push({
        id: 'high-anxiety-intervention',
        type: 'psychotherapy',
        priority: 'high',
        title: 'Terapia Cognitivo-Conductual Ansiedad',
        description: 'Mindfulness, técnicas respiración, reestructuración cognitiva',
        duration: '8-12 sesiones',
        provider: 'Psicólogo clínico especializado',
        evidenceLevel: 'A'
      });
    }
    
    // Depresión moderada
    if (assessments.phq9f && assessments.phq9f.totalScore >= 10) {
      interventions.push({
        id: 'depression-intervention',
        type: 'medication',
        priority: 'high',
        title: 'Tratamiento Depresión + TCC',
        description: 'Sertralina 50mg + terapia cognitivo-conductual semanal',
        duration: '12-16 semanas',
        provider: 'Psiquiatra + Psicólogo',
        evidenceLevel: 'A',
        contraindications: ['Embarazo actual', 'Alergia ISRS']
      });
    }
    
    // Relación comprometida
    if (assessments.das7 && assessments.das7.totalScore < 20) {
      interventions.push({
        id: 'couples-therapy',
        type: 'couples-therapy',
        priority: 'high',
        title: 'Terapia de Pareja Fertilidad',
        description: 'Comunicación específica fertilidad, manejo conflictos, intimidad emocional',
        duration: '6-8 sesiones',
        provider: 'Terapeuta pareja especializado fertilidad',
        evidenceLevel: 'B'
      });
    }
    
    // Bajo soporte social
    if (assessments.mspssf && assessments.mspssf.totalScore < 42) {
      interventions.push({
        id: 'social-support-building',
        type: 'support-group',
        priority: 'moderate',
        title: 'Construcción Red Soporte',
        description: 'Grupos apoyo presenciales + online, psicoeducación familiar',
        duration: '8-12 semanas',
        provider: 'Grupos especializados + app',
        evidenceLevel: 'B'
      });
    }
    
    return interventions;
  }

  /**
   * 📊 Cálculo de riesgo psicológico integrado
   */
  static calculatePsychologicalRisk(profile: PsychologicalProfile): PsychologicalRisk {
    const factors: RiskFactor[] = [];
    let totalScore = 0;
    
    // Evaluar estrés (PSS-10)
    if (profile.assessments.pss10) {
      const score = profile.assessments.pss10.totalScore;
      if (score >= 27) {
        factors.push({
          type: 'stress',
          severity: 'critical',
          description: 'Estrés severo (PSS-10 ≥27) - Impacto significativo en fertilidad',
          intervention: 'Intervención inmediata requerida antes de tratamiento'
        });
        totalScore += 30;
      } else if (score >= 20) {
        factors.push({
          type: 'stress',
          severity: 'moderate',
          description: 'Estrés moderado - Soporte psicológico recomendado',
          intervention: 'Técnicas manejo estrés + seguimiento'
        });
        totalScore += 15;
      }
    }
    
    // Evaluar depresión (PHQ-9F)
    if (profile.assessments.phq9f) {
      const score = profile.assessments.phq9f.totalScore;
      if (score >= 15) {
        factors.push({
          type: 'depression',
          severity: 'high',
          description: 'Depresión moderada-severa - Contraindicación relativa',
          intervention: 'Tratamiento psiquiátrico prioritario'
        });
        totalScore += 25;
      } else if (score >= 10) {
        factors.push({
          type: 'depression',
          severity: 'moderate',
          description: 'Depresión leve-moderada - Tratamiento recomendado',
          intervention: 'TCC + evaluación psiquiátrica'
        });
        totalScore += 12;
      }
    }
    
    // Evaluar relación pareja (DAS-7)
    if (profile.assessments.das7) {
      const score = profile.assessments.das7.totalScore;
      if (score < 14) {
        factors.push({
          type: 'relationship',
          severity: 'high',
          description: 'Relación en riesgo - Impacta adherencia tratamiento',
          intervention: 'Terapia pareja urgente'
        });
        totalScore += 20;
      } else if (score < 20) {
        factors.push({
          type: 'relationship',
          severity: 'moderate',
          description: 'Relación comprometida - Soporte recomendado',
          intervention: 'Terapia pareja preventiva'
        });
        totalScore += 10;
      }
    }
    
    // Determinar nivel de riesgo
    let level: 'low' | 'moderate' | 'high' | 'critical';
    if (totalScore >= 50) level = 'critical';
    else if (totalScore >= 30) level = 'high';
    else if (totalScore >= 15) level = 'moderate';
    else level = 'low';
    
    // Calcular impacto en fertilidad basado en evidencia
    const impactOnFertility = this.calculateFertilityImpact(totalScore, factors);
    
    return {
      level,
      score: totalScore,
      factors,
      impactOnFertility
    };
  }

  /**
   * 📈 Cálculo de impacto en fertilidad
   */
  private static calculateFertilityImpact(score: number, factors: RiskFactor[]) {
    // Basado en meta-análisis evidencia científica
    let pregnancyReduction = 0;
    let adherenceReduction = 0;
    let abortionIncrease = 0;
    
    factors.forEach(factor => {
      switch (factor.type) {
        case 'stress':
          if (factor.severity === 'critical') {
            pregnancyReduction += 29; // Evidencia: -29% con estrés severo
            adherenceReduction += 15;
            abortionIncrease += 12;
          } else if (factor.severity === 'moderate') {
            pregnancyReduction += 12;
            adherenceReduction += 8;
            abortionIncrease += 6;
          }
          break;
          
        case 'depression':
          if (factor.severity === 'high') {
            pregnancyReduction += 34; // Evidencia: -34% con depresión no tratada
            adherenceReduction += 25;
            abortionIncrease += 15;
          } else if (factor.severity === 'moderate') {
            pregnancyReduction += 18;
            adherenceReduction += 12;
            abortionIncrease += 8;
          }
          break;
          
        case 'relationship':
          if (factor.severity === 'high') {
            pregnancyReduction += 25;
            adherenceReduction += 35; // Impacto alto en adherencia
            abortionIncrease += 10;
          }
          break;
      }
    });
    
    return {
      pregnancyProbability: Math.max(-50, -pregnancyReduction), // Máximo -50%
      treatmentAdherence: Math.max(30, 100 - adherenceReduction), // Mínimo 30%
      abortionRisk: Math.min(40, abortionIncrease) // Máximo +40%
    };
  }

  /**
   * 🚨 Intervenciones urgentes
   */
  private static generateUrgentInterventions(profile: PsychologicalProfile): InterventionRecommendation[] {
    return [
      {
        id: 'urgent-stabilization',
        type: 'urgent-referral',
        priority: 'urgent',
        title: 'Estabilización Psicológica Urgente',
        description: 'Evaluación psiquiátrica inmediata + terapia intensiva',
        duration: '4-8 semanas',
        provider: 'Psiquiatra + Psicólogo especialista',
        evidenceLevel: 'A'
      }
    ];
  }

  /**
   * 💚 Intervenciones de soporte
   */
  private static generateSupportiveInterventions(profile: PsychologicalProfile): InterventionRecommendation[] {
    return [
      {
        id: 'supportive-therapy',
        type: 'psychotherapy',
        priority: 'high',
        title: 'Terapia de Soporte Continua',
        description: 'TCC + técnicas manejo estrés durante tratamiento',
        duration: '8-12 semanas',
        provider: 'Psicólogo clínico',
        evidenceLevel: 'A'
      }
    ];
  }

  /**
   * ✅ Soporte estándar
   */
  private static generateStandardSupport(profile: PsychologicalProfile): InterventionRecommendation[] {
    return [
      {
        id: 'standard-support',
        type: 'lifestyle',
        priority: 'moderate',
        title: 'Soporte Psicológico Estándar',
        description: 'Recursos educacionales + mindfulness + seguimiento mensual',
        duration: 'Durante tratamiento',
        provider: 'App + recursos online',
        evidenceLevel: 'B'
      }
    ];
  }
}
