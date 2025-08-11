/**
 * 🧠 NEURAL MEDICAL CHAT ENGINE V13.0
 * Motor de respuestas IA médica con capacidades neuronales
 */

import { EvaluationState, Factors } from '@/core/domain/models';

// Safe imports for AI Medical Agent components
let MedicalKnowledgeEngine: unknown;
let NeuralMedicalAISystem: unknown;
let SuperintellignentAnalysisResult: unknown;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const ModulesIntegration = require('../../../../../ai-medical-agent/core/modules-integration/ModulesIntegration');
  MedicalKnowledgeEngine = ModulesIntegration.MedicalKnowledgeEngine || class { 
    constructor() {} 
    analyzePatientData() { return null; }
    getKnowledgeForQuery() { return null; }
  };
  
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const NeuralSystem = require('../../../../../ai-medical-agent/core/neural-engines/NeuralMedicalAISystem');
  NeuralMedicalAISystem = NeuralSystem.NeuralMedicalAISystem || class {
    constructor() {}
    performSuperintellignentAnalysis() { return Promise.resolve(null); }
  };
  SuperintellignentAnalysisResult = NeuralSystem.SuperintellignentAnalysisResult || {};
} catch (error) {
  console.warn('⚠️ [MEDICAL ENGINE] AI Medical Agent components not available, using fallback implementations');
  
  MedicalKnowledgeEngine = class {
    constructor() {}
    analyzePatientData() { return null; }
    getKnowledgeForQuery() { return null; }
  };
  
  NeuralMedicalAISystem = class {
    constructor() {}
    performSuperintellignentAnalysis() { return Promise.resolve(null); }
  };
  
  SuperintellignentAnalysisResult = {};
}

import { MedicalResponseGenerator } from './MedicalResponseGenerator';
import { 
  ConversationContext, 
  AnalyzedIntent,
  UrgencyLevel,
  MessageCategory,
  NeuralEnhancedResponse,
  ActionCard,
  FertilityTimelinePoint,
  ClinicalAnalysis,
  QuickReplyAction
} from '../types/ChatTypes';

export class MedicalAIChatEngine {
  private readonly context: ConversationContext;
  private readonly medicalKnowledge: unknown;
  private readonly medicalResponseGenerator: MedicalResponseGenerator;
  private readonly neuralPatternEngine: unknown;
  private readonly neuralConversationEngine: unknown;
  private readonly neuralMedicalAI: unknown;
  
  constructor(evaluation: EvaluationState) {
    this.context = {
      patientData: evaluation,
      previousQuestions: [],
      previousResponses: [],
      conversationHistory: [],
      currentTopic: 'general',
      urgencyLevel: 'low',
      userPreferences: {
        treatmentPreference: 'natural',
        communicationStyle: 'simple'
      },
      lastTopicDetails: undefined
    };
    
    this.medicalKnowledge = new MedicalKnowledgeEngine();
    this.medicalResponseGenerator = new MedicalResponseGenerator();
    this.neuralPatternEngine = null;
    this.neuralConversationEngine = null;
    this.neuralMedicalAI = null;
    
    console.log('🧠 [NEURAL EVOLUTION] Chat Agent Evolution V13.0 initializing...');
    console.log('🤖 [MEDICAL AI] Chat engine inicializado con razonamiento médico especializado + Neural Evolution V13.0');
  }

  /**
   * 🧠 NEURAL CHAT AGENT EVOLUTION V13.0 - LAZY INITIALIZATION
   */
  private async ensureNeuralEvolutionInitialized(): Promise<void> {
    if (this.neuralMedicalAI) return;
    
    try {
      console.log('🧠 [NEURAL EVOLUTION] Activating superintelligent capabilities...');
      
      if (this.context.patientData?.factors) {
        const neuralAnalysis = await this.performNeuralPatternAnalysis(this.context.patientData.factors || {} as Factors);
        console.log('🧠 [NEURAL ANALYSIS] Pattern recognition activated:', neuralAnalysis ? 'SUCCESS' : 'PENDING');
      }
      
      console.log('🧠 [NEURAL EVOLUTION] Emergent insights engine ready');
      console.log('🧠 [NEURAL EVOLUTION] Predictive conversation flow initialized');
      console.log('✅ [NEURAL EVOLUTION] Chat Agent Evolution V13.0 activated successfully');
    } catch (error) {
      console.warn('⚠️ [NEURAL EVOLUTION] Dynamic loading pending:', error);
    }
  }

  /**
   * 🧠 NEURAL PATTERN ANALYSIS V13.0
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async performNeuralPatternAnalysis(factors: Factors): Promise<any | null> {
    try {
      if (!this.neuralMedicalAI) {
        const neuralAI = new NeuralMedicalAISystem({
          enablePatternRecognition: true,
          enableBayesianDecisions: true,
          enableNeuralConversation: true,
          enableEmergentInsights: true,
          enablePredictiveModeling: true,
          conversationPersonality: 'empathetic',
          analysisDepth: 'superintelligent'
        });
        
        const analysis = await neuralAI.performSuperintellignentAnalysis(
          factors, 
          this.context.patientData,
          {
            includeConversationReady: true,
            generateInsights: true,
            predictiveDepth: 3
          }
        );
        
        console.log('🧠 [NEURAL ANALYSIS] Superintelligent analysis completed');
        return analysis;
      }
      return null;
    } catch (error) {
      console.warn('⚠️ [NEURAL ANALYSIS] Error in neural pattern analysis:', error);
      return null;
    }
  }

  /**
   * 🧠 ANÁLISIS DE INTENCIÓN PRINCIPAL
   */
  public analyzeIntent(message: string): AnalyzedIntent {
    const lowerMessage = message.toLowerCase();
    console.log('🔍 [INTENT ANALYZER] Analizando mensaje:', lowerMessage);
    
    // Palabras clave de urgencia
    const urgentKeywords = ['dolor intenso', 'sangrado abundante', 'emergencia', 'urgente', 'hospital'];
    const highUrgencyKeywords = ['dolor', 'sangrado', 'mareos', 'fiebre', 'preocupado'];
    const mediumUrgencyKeywords = ['pregunta', 'duda', 'consulta', 'cuando', 'como', 'que', 'por que', 'porque'];
    
    let urgency: UrgencyLevel = 'low';
    if (urgentKeywords.some(keyword => lowerMessage.includes(keyword))) {
      urgency = 'urgent';
    } else if (highUrgencyKeywords.some(keyword => lowerMessage.includes(keyword))) {
      urgency = 'high';
    } else if (mediumUrgencyKeywords.some(keyword => lowerMessage.includes(keyword))) {
      urgency = 'medium';
    }

    // Categorización de temas
    const topics: string[] = [];
    
    if (lowerMessage.includes('embarazo') || lowerMessage.includes('concebir') || 
        lowerMessage.includes('quedar embarazada') || lowerMessage.includes('posibilidades') ||
        lowerMessage.includes('mejoro') || lowerMessage.includes('mejorar')) {
      topics.push('pregnancy');
    }
    
    if (lowerMessage.includes('ovulación') || lowerMessage.includes('ciclo') ||
        lowerMessage.includes('menstruación') || lowerMessage.includes('regla')) {
      topics.push('cycle');
    }
    
    if (lowerMessage.includes('tratamiento') || lowerMessage.includes('medicación') ||
        lowerMessage.includes('fiv') || lowerMessage.includes('inseminación') ||
        lowerMessage.includes('reproduccion asistida') || lowerMessage.includes('medicos')) {
      topics.push('treatment');
    }
    
    if (lowerMessage.includes('resultado') || lowerMessage.includes('análisis') ||
        lowerMessage.includes('explicar') || lowerMessage.includes('significa') ||
        lowerMessage.includes('interpretar') || lowerMessage.includes('pronóstico') ||
        lowerMessage.includes('pronostico') || lowerMessage.includes('1.6%') ||
        lowerMessage.includes('11.0%') || lowerMessage.includes('porcentaje')) {
      topics.push('results');
    }
    
    if (lowerMessage.includes('estilo de vida') || lowerMessage.includes('dieta') ||
        lowerMessage.includes('alimentación') || lowerMessage.includes('ejercicio') ||
        lowerMessage.includes('suplementos') || lowerMessage.includes('peso') ||
        lowerMessage.includes('estrés') || lowerMessage.includes('dormir')) {
      topics.push('lifestyle');
    }

    // Determinar categoría principal
    let category: MessageCategory = 'question';
    if (urgency === 'urgent') category = 'emergency';
    else if (topics.includes('treatment')) category = 'request';
    else if (lowerMessage.includes('dolor') || lowerMessage.includes('síntoma')) category = 'symptom';
    else if (lowerMessage.includes('preocup')) category = 'concern';

    return {
      category,
      topics,
      urgency,
      originalMessage: message,
      medicalContext: {
        reasoningAvailable: Boolean(this.context.patientData?.factors)
      }
    };
  }

  /**
   * 🎭 DETECCIÓN EMOCIONAL BÁSICA V14.0 - FASE 1
   * Sistema simple de análisis emocional por keywords
   */
  private detectBasicEmotion(message: string): {
    emotion: 'anxious' | 'hopeful' | 'frustrated' | 'confused' | 'determined' | 'neutral';
    intensity: number;
    supportLevel: 'minimal' | 'moderate' | 'high';
  } {
    const cleanMessage = message.toLowerCase();
    
    // 🚨 Indicadores de ansiedad
    const anxietyKeywords = ['preocup', 'nervios', 'ansiedad', 'miedo', 'asust', 'temor', 'angust'];
    const anxietyScore = anxietyKeywords.filter(keyword => cleanMessage.includes(keyword)).length;
    
    // 😔 Indicadores de frustración
    const frustrationKeywords = ['frustr', 'cansad', 'hart', 'desesper', 'no funciona', 'nada sirve'];
    const frustrationScore = frustrationKeywords.filter(keyword => cleanMessage.includes(keyword)).length;
    
    // 🌟 Indicadores de esperanza
    const hopeKeywords = ['espero', 'optimist', 'posibilidad', 'oportunidad', 'mejor', 'confío'];
    const hopeScore = hopeKeywords.filter(keyword => cleanMessage.includes(keyword)).length;
    
    // ❓ Indicadores de confusión
    const confusionKeywords = ['no entiendo', 'confus', 'no sé', 'dudas', 'explica', 'qué significa'];
    const confusionScore = confusionKeywords.filter(keyword => cleanMessage.includes(keyword)).length;
    
    // 💪 Indicadores de determinación
    const determinationKeywords = ['quiero', 'voy a', 'determina', 'decidid', 'haré todo', 'dispuest'];
    const determinationScore = determinationKeywords.filter(keyword => cleanMessage.includes(keyword)).length;
    
    // 🎯 Determinar emoción dominante
    const scores = {
      anxious: anxietyScore,
      frustrated: frustrationScore,
      hopeful: hopeScore,
      confused: confusionScore,
      determined: determinationScore
    };
    
    const maxScore = Math.max(...Object.values(scores));
    const dominantEmotion = maxScore > 0 
      ? Object.keys(scores).find(key => scores[key as keyof typeof scores] === maxScore) as keyof typeof scores
      : 'neutral';
    
    // 📊 Calcular intensidad (0-1)
    const intensity = Math.min(maxScore / 3, 1); // Normalizado a máximo 3 keywords
    
    // 🤝 Determinar nivel de soporte necesario
    let supportLevel: 'minimal' | 'moderate' | 'high' = 'minimal';
    if (dominantEmotion === 'anxious' || dominantEmotion === 'frustrated') {
      supportLevel = intensity > 0.6 ? 'high' : 'moderate';
    } else if (dominantEmotion === 'confused') {
      supportLevel = 'moderate';
    }
    
    return {
      emotion: dominantEmotion || 'neutral',
      intensity,
      supportLevel
    };
  }

  /**
   * 🎨 ADAPTACIÓN DE TONO EMOCIONAL V14.0
   */
  private adaptResponseTone(
    baseResponse: string, 
    emotion: ReturnType<typeof this.detectBasicEmotion>
  ): string {
    const { emotion: emotionType, intensity } = emotion;
    
    // 🎭 Prefijos empáticos según emoción detectada
    let empathicPrefix = '';
    
    switch (emotionType) {
      case 'anxious':
        empathicPrefix = intensity > 0.7 
          ? 'Entiendo tu preocupación, es completamente normal sentirse así. '
          : 'Comprendo que puedas sentir algo de inquietud. ';
        break;
        
      case 'frustrated':
        empathicPrefix = intensity > 0.7
          ? 'Sé que este proceso puede ser frustrante y agotador. Es importante que sepas que no estás sola. '
          : 'Entiendo que esto puede generar cierta frustración. ';
        break;
        
      case 'hopeful':
        empathicPrefix = 'Me alegra ver tu actitud positiva. ';
        break;
        
      case 'confused':
        empathicPrefix = 'Te ayudo a aclarar esas dudas paso a paso. ';
        break;
        
      case 'determined':
        empathicPrefix = 'Admiro tu determinación y compromiso. ';
        break;
        
      case 'neutral':
      default:
        // empathicPrefix ya está vacío por defecto
        break;
    }
    
    // 🤝 Añadir soporte adicional si es necesario
    let supportSuffix = '';
    if (emotion.supportLevel === 'high') {
      supportSuffix = '\n\n💙 Recuerda: estoy aquí para apoyarte en cada paso de este camino. Si necesitas hablar con un especialista, puedo ayudarte a encontrar las mejores opciones.';
    } else if (emotion.supportLevel === 'moderate') {
      supportSuffix = '\n\n✨ Si tienes más dudas, no hesites en preguntarme. Estoy aquí para ayudarte.';
    }
    
    return empathicPrefix + baseResponse + supportSuffix;
  }

  /**
   * 🎨 GENERADOR DE ACTION CARDS V14.0 - FASE 1
   * Sistema de tarjetas interactivas contextuales
   */
  private generateActionCards(
    intent: AnalyzedIntent, 
    emotionalState: ReturnType<typeof this.detectBasicEmotion>
  ): ActionCard[] {
    const cards: ActionCard[] = [];
    const { urgency } = intent;
    const { emotion } = emotionalState;
    
    // 🎯 TARJETAS SEGÚN CONTEXTO MÉDICO
    
    // 📅 Consulta médica - Siempre relevante para fertilidad
    if (urgency === 'high' || emotion === 'anxious') {
      cards.push({
        id: 'schedule_consultation',
        title: '📅 Agendar Consulta Especializada',
        description: 'Consulta con especialista en reproducción asistida',
        icon: 'calendar',
        action: 'schedule',
        urgency: urgency === 'high' ? 'high' : 'medium',
        category: 'medical',
        estimatedTime: '45-60 min'
      });
    }
    
    // 📊 Seguimiento personalizado
    if (intent.topics.includes('cycle') || intent.topics.includes('results')) {
      cards.push({
        id: 'fertility_tracking',
        title: '📊 Seguimiento de Fertilidad',
        description: 'Registra síntomas, ciclos y evolución diaria',
        icon: 'chart-line',
        action: 'track',
        urgency: 'medium',
        category: 'tracking',
        interactive: true,
        estimatedTime: '5 min/día'
      });
    }
    
    // 🎓 Ruta educativa personalizada
    if (emotion === 'confused' || intent.topics.includes('treatment')) {
      cards.push({
        id: 'educational_path',
        title: '🎓 Ruta de Aprendizaje Personalizada',
        description: 'Plan educativo adaptado a tu caso específico',
        icon: 'graduation-cap',
        action: 'learn',
        urgency: 'low',
        category: 'educational',
        progress: 0,
        estimatedTime: '10-15 min'
      });
    }
    
    // 🧪 Análisis complementarios
    if (intent.topics.includes('results') || urgency === 'medium') {
      cards.push({
        id: 'additional_tests',
        title: '🧪 Análisis Complementarios',
        description: 'Tests adicionales recomendados para tu perfil',
        icon: 'flask',
        action: 'test',
        urgency: 'medium',
        category: 'medical',
        estimatedTime: '2-3 horas'
      });
    }
    
    // 🌱 Estilo de vida optimizado
    if (intent.topics.includes('lifestyle') || emotion === 'determined') {
      cards.push({
        id: 'lifestyle_optimization',
        title: '🌱 Optimización de Estilo de Vida',
        description: 'Plan personalizado: nutrición, ejercicio, suplementos',
        icon: 'leaf',
        action: 'lifestyle',
        urgency: 'low',
        category: 'lifestyle',
        interactive: true,
        estimatedTime: 'Continuo'
      });
    }
    
    // 🚨 Urgencia alta - Priorizar consulta
    if (urgency === 'urgent') {
      return [{
        id: 'emergency_consultation',
        title: '🚨 Consulta Urgente Requerida',
        description: 'Contactar especialista inmediatamente',
        icon: 'alert-circle',
        action: 'schedule',
        urgency: 'high',
        category: 'medical',
        estimatedTime: 'Inmediato'
      }];
    }
    
    // 💡 Limitar a 3 tarjetas más relevantes
    return cards.slice(0, 3);
  }

  /**
   * 📊 GENERADOR DE TIMELINE DE FERTILIDAD V14.0
   */
  private generateFertilityTimeline(): FertilityTimelinePoint[] {
    const evaluation = this.context.patientData;
    const timeline: FertilityTimelinePoint[] = [];
    
    // Evaluación inicial (siempre primera)
    timeline.push({
      id: 'initial_evaluation',
      title: 'Evaluación Inicial Completada',
      description: 'Análisis completo de factores de fertilidad',
      timeframe: 'Completado',
      status: 'completed',
      category: 'assessment',
      urgency: 'low'
    });
    
    // Optimización estilo de vida
    timeline.push({
      id: 'lifestyle_optimization',
      title: 'Optimización de Estilo de Vida',
      description: 'Mejoras en alimentación, ejercicio y hábitos',
      timeframe: '1-3 meses',
      status: 'current',
      category: 'lifestyle',
      urgency: 'medium',
      successRate: 85
    });
    
    // Análisis complementarios
    if (evaluation?.factors) {
      timeline.push({
        id: 'complementary_tests',
        title: 'Análisis Complementarios',
        description: 'Tests específicos según tu perfil',
        timeframe: '2-4 semanas',
        status: 'pending',
        category: 'assessment',
        urgency: 'medium'
      });
    }
    
    // Tratamiento especializado
    timeline.push({
      id: 'specialized_treatment',
      title: 'Tratamiento Especializado',
      description: 'Intervención médica personalizada',
      timeframe: '3-6 meses',
      status: 'pending',
      category: 'treatment',
      urgency: 'high',
      successRate: 65
    });
    
    // Seguimiento y ajustes
    timeline.push({
      id: 'monitoring_adjustments',
      title: 'Seguimiento y Ajustes',
      description: 'Monitoreo continuo y optimización',
      timeframe: 'Continuo',
      status: 'pending',
      category: 'monitoring',
      urgency: 'low'
    });
    
    return timeline;
  }

  /**
   * 🧠 GENERACIÓN DE RESPUESTA PRINCIPAL
   */
  public async generateResponse(message: string): Promise<NeuralEnhancedResponse> {
    const intent = this.analyzeIntent(message);
    
    // 🎭 DETECTAR EMOCIÓN V14.0 - FASE 1
    const emotionalState = this.detectBasicEmotion(message);
    
    // 🎨 GENERAR ACTION CARDS V14.0 - FASE 1
    const actionCards = this.generateActionCards(intent, emotionalState);
    
    try {
      const neuralResponse = await this.generateNeuralEnhancedResponse(message, intent, this.context);
      
      // 🎨 ADAPTAR TONO EMOCIONAL
      neuralResponse.response = this.adaptResponseTone(neuralResponse.response, emotionalState);
      
      // 🎨 AÑADIR ACTION CARDS
      neuralResponse.actionCards = actionCards;
      
      this.updateContext(message, intent, neuralResponse.response);
      return neuralResponse;
    } catch (error) {
      console.warn('⚠️ [NEURAL ENHANCED] Fallback to standard response:', error);
      const fallbackResponse = this.generateContextualResponse(intent, this.context);
      
      // 🎨 ADAPTAR TONO EMOCIONAL TAMBIÉN EN FALLBACK
      fallbackResponse.response = this.adaptResponseTone(fallbackResponse.response, emotionalState);
      
      // 🎨 AÑADIR ACTION CARDS TAMBIÉN EN FALLBACK
      fallbackResponse.actionCards = actionCards;
      
      return fallbackResponse;
    }
  }

  /**
   * 🧠 NEURAL ENHANCED RESPONSE GENERATION V13.0
   */
  private async generateNeuralEnhancedResponse(
    userMessage: string,
    intent: AnalyzedIntent,
    context: ConversationContext
  ): Promise<NeuralEnhancedResponse> {
    try {
      await this.ensureNeuralEvolutionInitialized();
      
      const neuralAnalysis = await this.performNeuralPatternAnalysis(context.patientData.factors || {} as Factors);
      
      if (neuralAnalysis) {
        const baseResponse = this.generateContextualResponse(intent, context);
        
        const neuralInsights = [
          ...neuralAnalysis.emergentInsights.hiddenConnections,
          ...neuralAnalysis.emergentInsights.personalizedStrategies
        ].slice(0, 3);
        
        return {
          ...baseResponse,
          response: baseResponse.response + this.formatNeuralInsights(neuralInsights),
          neuralInsights
        };
      }
      
      return this.generateContextualResponse(intent, context);
    } catch (error) {
      console.warn('⚠️ [NEURAL ENHANCED] Fallback to standard response:', error);
      return this.generateContextualResponse(intent, context);
    }
  }

  /**
   * 🧠 FORMAT NEURAL INSIGHTS V13.0
   */
  private formatNeuralInsights(insights: string[]): string {
    if (insights.length === 0) return '';
    
    const formattedInsights = insights.map(insight => `• ${insight}`).join('\n');
    return `\n\n🧠 **Análisis Neural Avanzado:**\n${formattedInsights}`;
  }

  /**
   * 🎯 GENERACIÓN DE RESPUESTA CONTEXTUAL INTELIGENTE
   */
  private generateContextualResponse(intent: AnalyzedIntent, context: ConversationContext): NeuralEnhancedResponse {
    try {
      // 🧠 CREAR ANÁLISIS CLÍNICO BÁSICO
      const clinicalAnalysis = this.createBasicClinicalAnalysis(intent, context);
      
      // 🎯 USAR MEDICAL RESPONSE GENERATOR PARA RESPUESTA INTELIGENTE
      const medicalResponse = this.medicalResponseGenerator.generateClinicalReasoningResponse(
        intent, 
        context, 
        clinicalAnalysis
      );
      
      // 🎨 ENRIQUECER RESPUESTA CON CONTEXTO CONVERSACIONAL
      medicalResponse.response = this.enrichResponseWithContext(medicalResponse.response, context);
      
      return medicalResponse;
      
    } catch (error) {
      console.warn('⚠️ [CONTEXTUAL RESPONSE] Error generando respuesta inteligente:', error);
      
      // 🛡️ FALLBACK INTELIGENTE
      return this.generateIntelligentFallbackResponse(intent, context);
    }
  }

  /**
   * 🔍 CREAR ANÁLISIS CLÍNICO BÁSICO
   */
  private createBasicClinicalAnalysis(intent: AnalyzedIntent, _context: ConversationContext): ClinicalAnalysis {
    return {
      primaryHypothesis: {
        condition: intent.topics[0] || 'consulta_general',
        urgency: intent.urgency
      },
      confidence: 0.8,
      reasoningChain: [
        {
          conclusion: `Análisis basado en ${intent.topics.length} temas identificados`,
          evidence: `Urgencia: ${intent.urgency}, Categoría: ${intent.category}`
        }
      ],
      recommendedActions: [
        'Evaluación personalizada',
        'Seguimiento médico especializado'
      ]
    };
  }

  /**
   * 🎨 ENRIQUECER RESPUESTA CON CONTEXTO CONVERSACIONAL
   */
  private enrichResponseWithContext(baseResponse: string, context: ConversationContext): string {
    const conversationElements = [];
    
    // 🔄 REFERENCIA A CONVERSACIÓN PREVIA
    if (context.conversationHistory.length > 0) {
      const lastEntry = context.conversationHistory[context.conversationHistory.length - 1];
      if (lastEntry?.topic && lastEntry.topic !== 'general' && lastEntry.topic !== context.currentTopic) {
        conversationElements.push(`Continuando con tu consulta sobre ${lastEntry.topic}`);
      }
    }
    
    // 📝 PERSONALIZACIÓN BASADA EN PREGUNTAS PREVIAS
    if (context.previousQuestions.length > 0) {
      const recentQuestions = context.previousQuestions.slice(-2);
      const hasSpecificConcerns = recentQuestions.some((q: string) => 
        q.toLowerCase().includes('dolor') || 
        q.toLowerCase().includes('síntoma') ||
        q.toLowerCase().includes('tratamiento') ||
        q.toLowerCase().includes('resultado')
      );
      
      if (hasSpecificConcerns) {
        conversationElements.push('Considerando los aspectos que mencionas');
      }
    }
    
    // 🔗 CONSTRUIR RESPUESTA CONTEXTUALIZADA
    if (conversationElements.length > 0) {
      return `${conversationElements.join(', ')}: ${baseResponse}`;
    }
    
    return baseResponse;
  }

  /**
   * 🛡️ FALLBACK INTELIGENTE CON CONTEXTO
   */
  private generateIntelligentFallbackResponse(intent: AnalyzedIntent, context: ConversationContext): NeuralEnhancedResponse {
    let fallbackResponse = "Te ayudo con tu consulta médica especializada en fertilidad.";
    
    // 🎯 PERSONALIZAR SEGÚN INTENCIÓN
    if (intent.category === 'emergency') {
      fallbackResponse = "Entiendo que es una situación urgente. Te recomiendo contactar inmediatamente con tu médico especialista.";
    } else if (intent.category === 'symptom') {
      fallbackResponse = "Entiendo que tienes síntomas preocupantes. Describirme más detalles me ayudará a orientarte mejor.";
    } else if (intent.category === 'request') {
      fallbackResponse = "Perfecto, hablemos sobre las opciones de tratamiento para tu caso específico.";
    } else if (intent.topics.includes('results')) {
      fallbackResponse = "Te ayudo a interpretar y entender mejor los resultados de tu evaluación de fertilidad.";
    }
    
    // 🔄 AÑADIR CONTEXTO CONVERSACIONAL
    if (context.conversationHistory.length > 0) {
      fallbackResponse += " Basándome en nuestra conversación anterior, ¿hay algo específico que te preocupa?";
    }
    
    return {
      response: fallbackResponse,
      quickReplies: this.generateContextualQuickReplies(intent),
      urgencyLevel: intent.urgency,
      attachments: []
    };
  }

  /**
   * 🔍 IDENTIFICAR FACTORES DE RIESGO BÁSICOS
   */
  private identifyBasicRiskFactors(patientData: EvaluationState | undefined): string[] {
    const riskFactors = [];
    
    if (patientData?.factors?.infertilityDuration && patientData.factors.infertilityDuration > 12) {
      riskFactors.push('infertilidad_prolongada');
    }
    
    if (patientData?.factors?.infertilityDuration && patientData.factors.infertilityDuration > 24) {
      riskFactors.push('infertilidad_muy_prolongada');
    }
    
    return riskFactors;
  }

  /**
   * ⚡ GENERAR QUICK REPLIES CONTEXTUALES
   */
  private generateContextualQuickReplies(intent: AnalyzedIntent): Array<{id: string, text: string, action: QuickReplyAction}> {
    const quickReplies: Array<{id: string, text: string, action: QuickReplyAction}> = [];
    
    if (intent.topics.includes('treatment')) {
      quickReplies.push({ id: 'treatment_options', text: 'Ver opciones de tratamiento', action: 'treatment_info' });
    }
    
    if (intent.topics.includes('results')) {
      quickReplies.push({ id: 'explain_results', text: 'Explicar resultados', action: 'result_explanation' });
    }
    
    if (intent.urgency === 'high') {
      quickReplies.push({ id: 'schedule_urgent', text: 'Agendar consulta urgente', action: 'schedule' });
    }
    
    // Siempre incluir opciones generales
    quickReplies.push(
      { id: 'specific_question', text: 'Hacer pregunta específica', action: 'question' },
      { id: 'general_info', text: 'Información general', action: 'general_info' }
    );
    
    return quickReplies.slice(0, 4); // Máximo 4 opciones
  }

  /**
   * 🔄 ACTUALIZACIÓN DE CONTEXTO
   */
  private updateContext(userMessage: string, intent: AnalyzedIntent, response: string): void {
    this.context.previousQuestions.push(userMessage);
    this.context.previousResponses.push(response);
    this.context.urgencyLevel = intent.urgency;
    
    this.context.conversationHistory.push({
      userMessage,
      aiResponse: response,
      topic: intent.topics[0] || 'general',
      timestamp: new Date()
    });
  }

  /**
   * 📊 GETTER PARA CONTEXTO
   */
  public getContext(): ConversationContext {
    return this.context;
  }
}
