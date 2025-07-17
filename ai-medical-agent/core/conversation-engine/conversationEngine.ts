/**
 * 💬 MOTOR DE CONVERSACIÓN MÉDICA - AGENTE IA
 * Sistema de diálogo inteligente especializado en fertilidad
 */

import { ClinicalReasoningEngine, UserInput, DiagnosticAnalysis, TreatmentPlan, SuccessPrediction } from '../reasoning-engine/clinicalReasoningEngine';
import { PATHOLOGIES_DATABASE, PathologyDefinition } from '../knowledge-base/pathologies';
import { TREATMENTS_DATABASE } from '../knowledge-base/treatments';

export interface AIPersonality {
  id: string;
  name: string;
  tone: string;
  audience: string;
  language: string;
  detail: string;
  responseStyle: {
    greeting: string;
    explanation: string;
    recommendation: string;
    empathy: string;
    technicality: 'low' | 'medium' | 'high';
  };
}

export const AI_PERSONALITIES: Record<string, AIPersonality> = {
  familyDoctor: {
    id: 'familyDoctor',
    name: 'Dr. IA Familiar',
    tone: 'empático, comprensible, tranquilizador',
    audience: 'pacientes, parejas',
    language: 'lenguaje simple, analogías',
    detail: 'esencial con explicaciones',
    responseStyle: {
      greeting: 'Hola, soy el Dr. IA Fertilitas. Estoy aquí para ayudarte a entender tu situación y guiarte en los próximos pasos.',
      explanation: 'Te explico esto de manera sencilla:',
      recommendation: 'Basándome en tu caso, mi recomendación es:',
      empathy: 'Entiendo que esto puede ser abrumador. Es normal sentirse así.',
      technicality: 'low'
    }
  },
  
  specialist: {
    id: 'specialist',
    name: 'Dr. IA Especialista',
    tone: 'profesional, técnico, evidencia-basado',
    audience: 'médicos, especialistas',
    language: 'terminología médica completa',
    detail: 'máximo nivel técnico',
    responseStyle: {
      greeting: 'Consultor en Medicina Reproductiva. Análisis clínico basado en evidencia científica actual.',
      explanation: 'Análisis clínico:',
      recommendation: 'Recomendación terapéutica evidencia-basada:',
      empathy: 'Consideraciones clínicas relevantes:',
      technicality: 'high'
    }
  },
  
  educator: {
    id: 'educator',
    name: 'Dr. IA Educador',
    tone: 'didáctico, estructurado, motivacional',
    audience: 'estudiantes, residentes',
    language: 'pedagógico con ejemplos',
    detail: 'completo con referencias',
    responseStyle: {
      greeting: 'Bienvenido al módulo educativo de Medicina Reproductiva. Aprenderemos paso a paso.',
      explanation: 'Fundamentos científicos:',
      recommendation: 'Algoritmo clínico recomendado:',
      empathy: 'Recordemos los principios fundamentales:',
      technicality: 'medium'
    }
  }
};

export interface ConversationContext {
  userInput: UserInput;
  clinicalAnalysis?: {
    diagnosis: DiagnosticAnalysis;
    treatmentPlan: TreatmentPlan;
    successPrediction: SuccessPrediction;
  };
  conversationHistory: ConversationMessage[];
  currentPersonality: string;
  sessionId: string;
  timestamp: string;
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  messageType: 'question' | 'analysis' | 'recommendation' | 'education' | 'followup';
  metadata?: {
    confidence: number;
    sources: string[];
    relatedTopics: string[];
  };
}

export interface PromptTemplate {
  id: string;
  type: 'analysis' | 'recommendation' | 'education' | 'followup';
  personality: string;
  template: string;
  variables: string[];
  examples?: string[];
}

/**
 * 📝 TEMPLATES DE PROMPTS ESPECIALIZADOS
 */
export const PROMPT_TEMPLATES: Record<string, PromptTemplate> = {
  // 📊 ANÁLISIS DE RESULTADOS
  resultsAnalysis_familyDoctor: {
    id: 'resultsAnalysis_familyDoctor',
    type: 'analysis',
    personality: 'familyDoctor',
    template: `Como Dr. IA Fertilitas, tu médico de confianza especializado en fertilidad, he analizado tu caso detalladamente. 

**Tu situación actual:**
{diagnosis_summary}

**Lo que esto significa para ti:**
{explanation_simple}

**Factores positivos en tu caso:**
{positive_factors}

**Áreas que necesitan atención:**
{areas_attention}

**Mi análisis profesional:**
{clinical_reasoning}

¿Te gustaría que profundicemos en algún aspecto específico? Estoy aquí para resolver todas tus dudas.`,
    variables: ['diagnosis_summary', 'explanation_simple', 'positive_factors', 'areas_attention', 'clinical_reasoning']
  },

  resultsAnalysis_specialist: {
    id: 'resultsAnalysis_specialist',
    type: 'analysis',
    personality: 'specialist',
    template: `**ANÁLISIS CLÍNICO ESPECIALIZADO**

**Diagnósticos Principales:**
{primary_diagnoses}

**Evidencia Clínica:**
{clinical_evidence}

**Factores Pronósticos:**
- Favorables: {favorable_factors}
- Desfavorables: {unfavorable_factors}

**Nivel de Evidencia:** {evidence_level}
**Urgencia Clínica:** {urgency_level}

**Referencias Científicas:**
{scientific_references}

**Estudios Complementarios Recomendados:**
{recommended_tests}`,
    variables: ['primary_diagnoses', 'clinical_evidence', 'favorable_factors', 'unfavorable_factors', 'evidence_level', 'urgency_level', 'scientific_references', 'recommended_tests']
  },

  // 🎯 RECOMENDACIONES DE TRATAMIENTO
  treatmentRecommendation_familyDoctor: {
    id: 'treatmentRecommendation_familyDoctor',
    type: 'recommendation',
    personality: 'familyDoctor',
    template: `Basándome en tu análisis, he preparado un plan personalizado para ti:

**Mi recomendación principal:**
🎯 **{primary_treatment}**

**¿Por qué este tratamiento?**
{treatment_reasoning}

**Probabilidades de éxito:**
- Por ciclo: {success_per_cycle}%
- Probabilidad acumulada: {cumulative_success}%
- Tiempo estimado: {timeframe}

**Lo que puedes esperar:**
{what_to_expect}

**Alternativas a considerar:**
{alternative_options}

**Pasos que puedes tomar ahora:**
{immediate_steps}

**Costo aproximado:** {cost_estimate}

Recuerda: cada caso es único y estos números son estimaciones basadas en evidencia científica. ¿Qué te parece este plan?`,
    variables: ['primary_treatment', 'treatment_reasoning', 'success_per_cycle', 'cumulative_success', 'timeframe', 'what_to_expect', 'alternative_options', 'immediate_steps', 'cost_estimate']
  },

  // 📚 EDUCACIÓN MÉDICA
  medicalEducation_familyDoctor: {
    id: 'medicalEducation_familyDoctor',
    type: 'education',
    personality: 'familyDoctor',
    template: `Te explico todo sobre **{condition_name}** de manera sencilla:

**¿Qué es exactamente?**
{simple_definition}

**¿Por qué ocurre?**
{causes_explanation}

**¿Cómo afecta la fertilidad?**
{fertility_impact}

**Síntomas comunes:**
{common_symptoms}

**¿Cómo se diagnostica?**
{diagnostic_process}

**Opciones de tratamiento:**
{treatment_options}

**¿Se puede prevenir?**
{prevention_tips}

**Perspectiva positiva:**
{positive_outlook}

**¿Tienes más preguntas sobre {condition_name}?** Estoy aquí para aclarar cualquier duda.`,
    variables: ['condition_name', 'simple_definition', 'causes_explanation', 'fertility_impact', 'common_symptoms', 'diagnostic_process', 'treatment_options', 'prevention_tips', 'positive_outlook']
  },

  // 🔮 PREDICCIÓN Y PRONÓSTICO
  prognosis_familyDoctor: {
    id: 'prognosis_familyDoctor',
    type: 'followup',
    personality: 'familyDoctor',
    template: `Hablemos sobre tus probabilidades y qué esperar:

**Tu panorama personal:**

**Sin tratamiento:**
- Probabilidad natural: {natural_probability}%
- Tiempo estimado: {natural_timeframe}

**Con el tratamiento recomendado:**
- Probabilidad mejorada: {treatment_probability}%
- Tiempo estimado: {treatment_timeframe}

**Factores que juegan a tu favor:**
{positive_factors}

**Factores que debemos mejorar:**
{improvement_areas}

**Cómo puedes mejorar tus probabilidades:**
{improvement_tips}

**Mi pronóstico honesto:**
{realistic_prognosis}

**Próximos hitos importantes:**
{next_milestones}

Recuerda: las estadísticas son guías, pero tu caso es único. ¿Qué más te gustaría saber sobre tu pronóstico?`,
    variables: ['natural_probability', 'natural_timeframe', 'treatment_probability', 'treatment_timeframe', 'positive_factors', 'improvement_areas', 'improvement_tips', 'realistic_prognosis', 'next_milestones']
  }
};

/**
 * 🤖 GENERADOR DE RESPUESTAS INTELIGENTES
 */
export class ConversationEngine {
  private context: ConversationContext;
  private personality: AIPersonality;
  
  constructor(context: ConversationContext) {
    this.context = context;
    this.personality = AI_PERSONALITIES[context.currentPersonality] || AI_PERSONALITIES.familyDoctor;
  }

  /**
   * Genera respuesta basada en tipo de consulta
   */
  generateResponse(
    query: string,
    messageType: ConversationMessage['messageType']
  ): ConversationMessage {
    const response = this.processQuery(query, messageType);
    
    const message: ConversationMessage = {
      id: this.generateMessageId(),
      role: 'assistant',
      content: response.content,
      timestamp: new Date().toISOString(),
      messageType,
      metadata: {
        confidence: response.confidence,
        sources: response.sources,
        relatedTopics: response.relatedTopics
      }
    };

    // Actualizar historial
    this.context.conversationHistory.push(message);
    
    return message;
  }

  /**
   * Procesa consulta según tipo
   */
  private processQuery(
    query: string,
    type: ConversationMessage['messageType']
  ): { content: string; confidence: number; sources: string[]; relatedTopics: string[] } {
    switch (type) {
      case 'analysis':
        return this.generateAnalysisResponse();
      case 'recommendation':
        return this.generateRecommendationResponse();
      case 'education':
        return this.generateEducationResponse(query);
      case 'followup':
        return this.generateFollowUpResponse(query);
      default:
        return this.generateGeneralResponse(query);
    }
  }

  /**
   * Genera respuesta de análisis
   */
  private generateAnalysisResponse(): {
    content: string;
    confidence: number;
    sources: string[];
    relatedTopics: string[];
  } {
    if (!this.context.clinicalAnalysis) {
      // Realizar análisis clínico
      this.context.clinicalAnalysis = ClinicalReasoningEngine.analyzeCase(this.context.userInput);
    }

    const { diagnosis, treatmentPlan, successPrediction } = this.context.clinicalAnalysis;
    const templateKey = `resultsAnalysis_${this.personality.id}`;
    const template = PROMPT_TEMPLATES[templateKey];

    if (!template) {
      return {
        content: 'Lo siento, no puedo procesar tu consulta en este momento.',
        confidence: 0,
        sources: [],
        relatedTopics: []
      };
    }

    // Preparar variables para el template
    const variables = this.prepareAnalysisVariables(diagnosis, treatmentPlan, successPrediction);
    
    // Generar contenido usando template
    let content = template.template;
    Object.entries(variables).forEach(([key, value]) => {
      content = content.replace(new RegExp(`{${key}}`, 'g'), value);
    });

    return {
      content,
      confidence: 0.9,
      sources: this.extractSources(diagnosis),
      relatedTopics: diagnosis.primaryDiagnoses.map(d => d.pathology)
    };
  }

  /**
   * Genera respuesta de recomendación
   */
  private generateRecommendationResponse(): {
    content: string;
    confidence: number;
    sources: string[];
    relatedTopics: string[];
  } {
    if (!this.context.clinicalAnalysis) {
      this.context.clinicalAnalysis = ClinicalReasoningEngine.analyzeCase(this.context.userInput);
    }

    const { treatmentPlan } = this.context.clinicalAnalysis;
    const templateKey = `treatmentRecommendation_${this.personality.id}`;
    const template = PROMPT_TEMPLATES[templateKey];

    if (!template || treatmentPlan.recommendedTreatments.length === 0) {
      return {
        content: 'Necesito más información para generar recomendaciones específicas.',
        confidence: 0.3,
        sources: [],
        relatedTopics: []
      };
    }

    const variables = this.prepareTreatmentVariables(treatmentPlan);
    
    let content = template.template;
    Object.entries(variables).forEach(([key, value]) => {
      content = content.replace(new RegExp(`{${key}}`, 'g'), value);
    });

    return {
      content,
      confidence: 0.85,
      sources: ['ASRM Guidelines', 'ESHRE Recommendations'],
      relatedTopics: treatmentPlan.recommendedTreatments.map(t => t.treatment)
    };
  }

  /**
   * Genera respuesta educativa
   */
  private generateEducationResponse(query: string): {
    content: string;
    confidence: number;
    sources: string[];
    relatedTopics: string[];
  } {
    // Extraer condición/término de la consulta
    const condition = this.extractMedicalTerm(query);
    const pathology = PATHOLOGIES_DATABASE[condition] || 
                     Object.values(PATHOLOGIES_DATABASE).find(p => 
                       p.nameES.toLowerCase().includes(condition.toLowerCase()) ||
                       p.name.toLowerCase().includes(condition.toLowerCase())
                     );

    if (!pathology) {
      return {
        content: `No encontré información específica sobre "${condition}". ¿Podrías ser más específico sobre qué aspecto de la fertilidad te interesa?`,
        confidence: 0.2,
        sources: [],
        relatedTopics: []
      };
    }

    const template = PROMPT_TEMPLATES[`medicalEducation_${this.personality.id}`];
    if (!template) {
      return {
        content: 'Lo siento, no puedo procesar esta consulta educativa.',
        confidence: 0,
        sources: [],
        relatedTopics: []
      };
    }

    const variables = this.prepareEducationVariables(pathology);
    
    let content = template.template;
    Object.entries(variables).forEach(([key, value]) => {
      content = content.replace(new RegExp(`{${key}}`, 'g'), value);
    });

    return {
      content,
      confidence: 0.95,
      sources: pathology.references.map(r => r.doi || r.pmid || r.guideline || 'Medical Literature'),
      relatedTopics: pathology.relatedConditions
    };
  }

  /**
   * Genera respuesta de seguimiento
   */
  private generateFollowUpResponse(_query: string): {
    content: string;
    confidence: number;
    sources: string[];
    relatedTopics: string[];
  } {
    if (!this.context.clinicalAnalysis) {
      return {
        content: 'Primero necesito analizar tu caso. ¿Podrías compartir tus datos médicos?',
        confidence: 0.4,
        sources: [],
        relatedTopics: []
      };
    }

    const { successPrediction } = this.context.clinicalAnalysis;
    const template = PROMPT_TEMPLATES[`prognosis_${this.personality.id}`];

    if (!template) {
      return {
        content: 'Basándome en tu análisis, tu pronóstico es favorable con el tratamiento adecuado.',
        confidence: 0.6,
        sources: [],
        relatedTopics: []
      };
    }

    const variables = this.preparePrognosisVariables(successPrediction);
    
    let content = template.template;
    Object.entries(variables).forEach(([key, value]) => {
      content = content.replace(new RegExp(`{${key}}`, 'g'), value);
    });

    return {
      content,
      confidence: 0.8,
      sources: ['Clinical Data Analysis', 'Predictive Models'],
      relatedTopics: ['prognosis', 'success rates', 'treatment outcomes']
    };
  }

  /**
   * Genera respuesta general
   */
  private generateGeneralResponse(query: string): {
    content: string;
    confidence: number;
    sources: string[];
    relatedTopics: string[];
  } {
    const greeting = this.personality.responseStyle.greeting;
    
    return {
      content: `${greeting}\n\nHe recibido tu consulta: "${query}"\n\nPara darte la mejor respuesta, ¿podrías especificar si quieres:\n\n📊 Análisis de tus resultados\n🎯 Recomendaciones de tratamiento\n📚 Información sobre alguna condición\n🔮 Pronóstico de tu caso\n\n¿Con cuál te gustaría que empecemos?`,
      confidence: 0.7,
      sources: [],
      relatedTopics: ['consultation', 'medical advice', 'fertility guidance']
    };
  }

  // MÉTODOS AUXILIARES PARA PREPARAR VARIABLES

  private prepareAnalysisVariables(
    diagnosis: DiagnosticAnalysis,
    _treatmentPlan: TreatmentPlan,
    _successPrediction: SuccessPrediction
  ): Record<string, string> {
    return {
      diagnosis_summary: diagnosis.primaryDiagnoses.map(d => 
        `• ${d.pathology} (${d.probability}% probabilidad)`
      ).join('\n'),
      explanation_simple: this.simplifyDiagnosis(diagnosis),
      positive_factors: diagnosis.prognosticFactors.favorable.join('\n• '),
      areas_attention: diagnosis.prognosticFactors.unfavorable.join('\n• '),
      clinical_reasoning: diagnosis.primaryDiagnoses[0]?.reasoning || 'Análisis basado en datos clínicos'
    };
  }

  private prepareTreatmentVariables(treatmentPlan: TreatmentPlan): Record<string, string> {
    const primary = treatmentPlan.recommendedTreatments[0];
    const treatment = TREATMENTS_DATABASE[primary?.treatment];
    
    return {
      primary_treatment: treatment?.nameES || primary?.treatment || 'Tratamiento personalizado',
      treatment_reasoning: primary?.reasoning || 'Basado en guías clínicas actuales',
      success_per_cycle: primary?.successRate.perCycle?.toString() || 'Variable',
      cumulative_success: primary?.successRate.cumulative?.toString() || 'Variable',
      timeframe: primary?.timeframe || 'Variable según respuesta',
      what_to_expect: treatment?.procedure.execution.join('\n• ') || 'Proceso supervisado médicamente',
      alternative_options: treatmentPlan.alternativeTreatments.map(a => 
        `• ${a.treatment}: ${a.reasoning}`
      ).join('\n'),
      immediate_steps: treatmentPlan.lifestyle.slice(0, 3).join('\n• '),
      cost_estimate: primary?.costs || treatment?.costs.estimate || 'Consultar con clínica'
    };
  }

  private prepareEducationVariables(pathology: PathologyDefinition): Record<string, string> {
    return {
      condition_name: pathology.nameES,
      simple_definition: pathology.definition,
      causes_explanation: pathology.riskFactors.join(', '),
      fertility_impact: `Prevalencia: ${pathology.prevalence}. Afecta la fertilidad principalmente por ${pathology.category}`,
      common_symptoms: pathology.symptoms.join('\n• '),
      diagnostic_process: pathology.diagnosticCriteria.join('\n• '),
      treatment_options: 'Disponibles según severidad y caso individual',
      prevention_tips: 'Mantener estilo de vida saludable y controles médicos regulares',
      positive_outlook: pathology.prognosis.withTreatment
    };
  }

  private preparePrognosisVariables(successPrediction: SuccessPrediction): Record<string, string> {
    return {
      natural_probability: successPrediction.probabilityNatural.toString(),
      natural_timeframe: successPrediction.timeToConception.natural,
      treatment_probability: successPrediction.probabilityWithTreatment.toString(),
      treatment_timeframe: successPrediction.timeToConception.withTreatment,
      positive_factors: successPrediction.factors.positive.join('\n• '),
      improvement_areas: successPrediction.factors.negative.join('\n• '),
      improvement_tips: successPrediction.recommendations.join('\n• '),
      realistic_prognosis: 'Pronóstico favorable con adherencia al tratamiento',
      next_milestones: 'Evaluación en 3-6 meses según respuesta inicial'
    };
  }

  // MÉTODOS UTILITARIOS

  private simplifyDiagnosis(diagnosis: DiagnosticAnalysis): string {
    if (diagnosis.primaryDiagnoses.length === 0) {
      return 'Los estudios iniciales están dentro de rangos normales. Continuaremos con evaluación detallada.';
    }

    const main = diagnosis.primaryDiagnoses[0];
    const pathology = PATHOLOGIES_DATABASE[main.pathology];
    
    if (pathology) {
      return `Identificamos ${pathology.nameES} como factor principal. Esto significa ${pathology.definition.substring(0, 100)}...`;
    }

    return `Se identificó ${main.pathology} como factor principal con ${main.probability}% de probabilidad.`;
  }

  private extractMedicalTerm(query: string): string {
    // Lógica simplificada para extraer términos médicos
    const medicalTerms = Object.keys(PATHOLOGIES_DATABASE);
    const foundTerm = medicalTerms.find(term => 
      query.toLowerCase().includes(term.toLowerCase())
    );
    
    if (foundTerm) return foundTerm;
    
    // Buscar por nombres en español
    for (const [key, pathology] of Object.entries(PATHOLOGIES_DATABASE)) {
      if (query.toLowerCase().includes(pathology.nameES.toLowerCase())) {
        return key;
      }
    }
    
    return query.split(' ').find(word => word.length > 4) || 'fertilidad';
  }

  private extractSources(diagnosis: DiagnosticAnalysis): string[] {
    const sources: string[] = [];
    
    diagnosis.primaryDiagnoses.forEach(d => {
      const pathology = PATHOLOGIES_DATABASE[d.pathology];
      if (pathology) {
        pathology.references.forEach(ref => {
          if (ref.doi) sources.push(`DOI: ${ref.doi}`);
          if (ref.pmid) sources.push(`PMID: ${ref.pmid}`);
          if (ref.guideline) sources.push(ref.guideline);
        });
      }
    });
    
    return sources.slice(0, 3); // Máximo 3 fuentes
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * 🎭 MANAGER DE PERSONALIDADES
 */
export class PersonalityManager {
  static switchPersonality(
    context: ConversationContext,
    newPersonalityId: string
  ): ConversationContext {
    if (!AI_PERSONALITIES[newPersonalityId]) {
      throw new Error(`Personalidad "${newPersonalityId}" no encontrada`);
    }

    return {
      ...context,
      currentPersonality: newPersonalityId
    };
  }

  static getPersonalityInfo(personalityId: string): AIPersonality | null {
    return AI_PERSONALITIES[personalityId] || null;
  }

  static getAllPersonalities(): AIPersonality[] {
    return Object.values(AI_PERSONALITIES);
  }
}

export default ConversationEngine;
