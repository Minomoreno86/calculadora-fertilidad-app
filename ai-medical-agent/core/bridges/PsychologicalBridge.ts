/**
 * 🧠💬 BRIDGE PSICOLÓGICO - INTEGRACIÓN CONVERSACIONAL
 * Conecta el sistema conversacional médico con el módulo psicológico
 */


import {
    ClinicalAnalysis,
    UserInput
} from '../types/UnifiedTypes';

/**
 * 🌊 RESPUESTA DE APOYO EMOCIONAL INTELIGENTE
 */
export interface EmotionalSupportResponse {
  empathy: string;
  encouragement: string;
  validation: string;
  copingStrategies: string[];
  professionalReferral: boolean;
  urgencyLevel: 'low' | 'moderate' | 'high' | 'urgent';
}

/**
 * 🧠 BRIDGE PSICOLÓGICO - CONEXIÓN CON SISTEMA ESPECIALIZADO
 */
export class PsychologicalBridge {
  private static instance: PsychologicalBridge;
  
  public static getInstance(): PsychologicalBridge {
    if (!PsychologicalBridge.instance) {
      PsychologicalBridge.instance = new PsychologicalBridge();
    }
    return PsychologicalBridge.instance;
  }

  /**
   * 🎯 GENERAR APOYO EMOCIONAL CONTEXTUAL
   */
  public generateEmotionalSupport(
    userInput: UserInput,
    clinicalAnalysis?: ClinicalAnalysis,
    conversationType?: string
  ): EmotionalSupportResponse {
    
    // Análisis de factores de estrés
    const stressFactors = this.identifyStressFactors(userInput, clinicalAnalysis);
    const riskLevel = this.assessPsychologicalRisk(userInput, clinicalAnalysis);
    
    return {
      empathy: this.generateEmpathyMessage(conversationType, stressFactors),
      encouragement: this.generateEncouragementMessage(riskLevel, clinicalAnalysis),
      validation: this.generateValidationMessage(conversationType),
      copingStrategies: this.generateCopingStrategies(riskLevel, stressFactors),
      professionalReferral: riskLevel === 'high' || riskLevel === 'urgent',
      urgencyLevel: riskLevel
    };
  }

  /**
   * 🔍 IDENTIFICAR FACTORES DE ESTRÉS
   */
  private identifyStressFactors(
    userInput: UserInput, 
    clinicalAnalysis?: ClinicalAnalysis
  ): string[] {
    const factors: string[] = [];
    
    // Factores temporales
    if (userInput.age >= 40) factors.push('age_pressure');
    if (userInput.infertilityDuration >= 24) factors.push('prolonged_journey');
    
    // Factores clínicos
    if (clinicalAnalysis?.riskStratification?.level === 'high') {
      factors.push('complex_diagnosis');
    }
    
    // Factores de tratamiento
    if (clinicalAnalysis?.treatmentDecisionTree?.firstLine?.complexity === 'high') {
      factors.push('complex_treatment');
    }
    
    return factors;
  }

  /**
   * ⚠️ EVALUAR RIESGO PSICOLÓGICO
   */
  private assessPsychologicalRisk(
    userInput: UserInput,
    clinicalAnalysis?: ClinicalAnalysis
  ): 'low' | 'moderate' | 'high' | 'urgent' {
    
    let riskScore = 0;
    
    // Edad y duración
    if (userInput.age >= 42) riskScore += 2;
    if (userInput.infertilityDuration >= 36) riskScore += 2;
    
    // Análisis clínico
    if (clinicalAnalysis?.riskStratification?.level === 'critical') {
      riskScore += 3;
    }
    
    // Factores de urgencia
    if (clinicalAnalysis?.riskStratification?.urgencyIndicators?.length > 0) {
      riskScore += 1;
    }
    
    if (riskScore >= 5) return 'urgent';
    if (riskScore >= 3) return 'high';
    if (riskScore >= 1) return 'moderate';
    return 'low';
  }

  /**
   * 💝 GENERAR MENSAJE DE EMPATÍA
   */
  private generateEmpathyMessage(
    conversationType?: string,
    stressFactors?: string[]
  ): string {
    
    const baseEmpathy = {
      diagnostic: 'Entiendo que esperar un diagnóstico puede generar mucha ansiedad.',
      therapeutic: 'Comprendo que pensar en tratamientos puede ser abrumador.',
      prognostic: 'Entiendo que quieras conocer las probabilidades, es completamente natural.',
      educational: 'Valoro tu deseo de entender mejor tu situación.',
      supportive: 'Reconozco que estás pasando por un momento muy difícil.',
      general: 'Entiendo que puedes tener muchas emociones encontradas.'
    };
    
    let message = baseEmpathy[conversationType as keyof typeof baseEmpathy] || baseEmpathy.general;
    
    // Personalizar según factores de estrés
    if (stressFactors?.includes('prolonged_journey')) {
      message += ' Después de tanto tiempo intentando, es natural sentirse agotada emocionalmente.';
    }
    
    if (stressFactors?.includes('age_pressure')) {
      message += ' La presión del tiempo puede hacer que todo se sienta más intenso.';
    }
    
    return message;
  }

  /**
   * 🌟 GENERAR MENSAJE DE ÁNIMO
   */
  private generateEncouragementMessage(
    riskLevel: string,
    clinicalAnalysis?: ClinicalAnalysis
  ): string {
    
    const baseEncouragement = {
      low: 'Tienes muchas razones para mantener la esperanza.',
      moderate: 'Aunque el camino pueda parecer difícil, hay opciones y apoyo disponible.',
      high: 'Sé que es muy desafiante, pero no estás sola y hay profesionales que pueden ayudarte.',
      urgent: 'Es importante que sepas que hay ayuda especializada disponible inmediatamente.'
    };
    
    let message = baseEncouragement[riskLevel as keyof typeof baseEncouragement];
    
    // Personalizar con análisis clínico
    if (clinicalAnalysis?.primaryDiagnosis?.confidence > 80) {
      message += ' Con un diagnóstico claro, podemos enfocar mejor el tratamiento.';
    }
    
    return message;
  }

  /**
   * ✅ GENERAR MENSAJE DE VALIDACIÓN
   */
  private generateValidationMessage(conversationType?: string): string {
    
    const validationMessages = {
      diagnostic: 'Tus preocupaciones sobre el diagnóstico son completamente válidas.',
      therapeutic: 'Es natural sentir incertidumbre sobre los tratamientos.',
      prognostic: 'Querer conocer las probabilidades muestra tu fortaleza y determinación.',
      educational: 'Buscar información es un paso muy inteligente y empoderador.',
      supportive: 'Todos tus sentimientos son normales y esperados en esta situación.',
      general: 'Tu búsqueda de respuestas muestra tu compromiso contigo misma.'
    };
    
    return validationMessages[conversationType as keyof typeof validationMessages] 
           || validationMessages.general;
  }

  /**
   * 🛠️ GENERAR ESTRATEGIAS DE AFRONTAMIENTO
   */
  private generateCopingStrategies(
    riskLevel: string,
    stressFactors: string[]
  ): string[] {
    
    const strategies: string[] = [];
    
    // Estrategias básicas para todos los niveles
    strategies.push('Técnicas de respiración profunda para momentos de ansiedad');
    strategies.push('Mantener una rutina diaria estructurada');
    
    // Estrategias según nivel de riesgo
    if (riskLevel === 'moderate' || riskLevel === 'high') {
      strategies.push('Considerar mindfulness o meditación guiada');
      strategies.push('Buscar grupos de apoyo de fertilidad');
    }
    
    if (riskLevel === 'high' || riskLevel === 'urgent') {
      strategies.push('Consulta con psicólogo especializado en fertilidad');
      strategies.push('Evaluar necesidad de apoyo farmacológico');
    }
    
    // Estrategias específicas según factores de estrés
    if (stressFactors.includes('prolonged_journey')) {
      strategies.push('Establecer límites temporales para decisiones importantes');
    }
    
    if (stressFactors.includes('complex_treatment')) {
      strategies.push('Dividir el proceso en pasos pequeños y manejables');
    }
    
    return strategies;
  }

  /**
   * 📊 EVALUAR NECESIDAD DE EVALUACIÓN PSICOLÓGICA FORMAL
   */
  public shouldRecommendPsychologicalAssessment(
    userInput: UserInput,
    clinicalAnalysis?: ClinicalAnalysis
  ): {
    recommended: boolean;
    urgency: 'routine' | 'priority' | 'urgent';
    assessments: string[];
    rationale: string;
  } {
    
    const riskLevel = this.assessPsychologicalRisk(userInput, clinicalAnalysis);
    
    if (riskLevel === 'urgent') {
      return {
        recommended: true,
        urgency: 'urgent',
        assessments: ['PHQ9F', 'PSS10', 'Crisis Assessment'],
        rationale: 'Los indicadores sugieren alto riesgo que requiere evaluación inmediata'
      };
    }
    
    if (riskLevel === 'high') {
      return {
        recommended: true,
        urgency: 'priority',
        assessments: ['PHQ9F', 'PSS10', 'FertiQoL'],
        rationale: 'Factores de riesgo elevado sugieren beneficio de evaluación psicológica'
      };
    }
    
    if (riskLevel === 'moderate') {
      return {
        recommended: true,
        urgency: 'routine',
        assessments: ['PSS10', 'FertiQoL'],
        rationale: 'Evaluación preventiva recomendada para optimizar bienestar'
      };
    }
    
    return {
      recommended: false,
      urgency: 'routine',
      assessments: [],
      rationale: 'No se identificaron factores de riesgo significativos actualmente'
    };
  }
}

// Exportar instancia singleton
export const psychologicalBridge = PsychologicalBridge.getInstance();
