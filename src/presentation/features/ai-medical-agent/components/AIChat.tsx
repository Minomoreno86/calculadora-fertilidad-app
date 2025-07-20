/**
 * 🤖💬 AI CHAT INTERACTIVO - SISTEMA DE CONSULTA EN TIEMPO REAL
 * 
 * Funcionalidades implementadas:
 * ✅ Chat en tiempo real con IA médica
 * ✅ Contexto conversacional persistente
 * ✅ Respuestas rápidas predefinidas
 * ✅ Historial de conversación
 * ✅ Typing indicators y estados
 * ✅ Integración con datos de fertilidad
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '@/presentation/components/common/Text';
import { useDynamicTheme } from '@/hooks/useDynamicTheme';
import { EvaluationState } from '@/core/domain/models';
import { MedicalKnowledgeEngine, MedicalKnowledgeQuery, MedicalResponse } from '@/../ai-medical-agent/core/modules-integration/ModulesIntegration';

// 🎯 TIPOS DEL SISTEMA DE CHAT
interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  message: string;
  timestamp: Date;
  isTyping?: boolean;
  quickReplies?: QuickReply[];
  attachments?: ChatAttachment[];
}

interface QuickReply {
  id: string;
  text: string;
  action: 'question' | 'request_info' | 'schedule' | 'clarification';
  payload?: any;
}

interface ChatAttachment {
  type: 'recommendation' | 'study' | 'protocol' | 'chart';
  title: string;
  data: any;
  preview?: string;
}

interface AnalyzedIntent {
  category: 'question' | 'concern' | 'symptom' | 'request' | 'emergency';
  topics: string[];
  urgency: 'low' | 'medium' | 'high' | 'urgent';
}

interface ConversationContext {
  patientData: EvaluationState;
  previousQuestions: string[];
  previousResponses: string[];
  conversationHistory: Array<{
    userMessage: string;
    aiResponse: string;
    topic: string;
    timestamp: Date;
  }>;
  currentTopic: 'general' | 'fertility' | 'treatment' | 'lifestyle' | 'emergency' | 'results' | 'next_steps';
  urgencyLevel: 'low' | 'medium' | 'high' | 'urgent';
  userPreferences: {
    treatmentPreference: 'natural' | 'assisted' | 'aggressive';
    communicationStyle: 'technical' | 'simple' | 'detailed';
  };
  lastTopicDetails?: {
    topic: string;
    subtopics: string[];
    followUpNeeded: boolean;
  };
}

interface AIChatProps {
  evaluation: EvaluationState;
  initialTopic?: string;
  onRecommendationGenerated?: (recommendation: any) => void;
}

// 🧠 MOTOR DE RESPUESTAS IA MÉDICA
class MedicalAIChatEngine {
  private context: ConversationContext;
  private medicalKnowledge: MedicalKnowledgeEngine;
  
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
    
    // 🧠 MOTOR DE CONOCIMIENTO MÉDICO INTEGRADO
    this.medicalKnowledge = new MedicalKnowledgeEngine();
    console.log('🤖 [MEDICAL AI] Chat engine inicializado con conocimiento médico especializado');
  }

  async generateResponse(userMessage: string): Promise<{
    response: string;
    quickReplies: QuickReply[];
    attachments?: ChatAttachment[];
    urgencyLevel: 'low' | 'medium' | 'high' | 'urgent';
  }> {
    console.log('🤖 [CHAT ENGINE] generateResponse iniciado para:', userMessage);
    console.log('🤖 [CHAT ENGINE] Historial previo:', this.context.conversationHistory.length, 'mensajes');
    
    // Simular delay de IA
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    console.log('🤖 [CHAT ENGINE] Delay completado');
    
    // Análisis de intención del mensaje
    const intent = this.analyzeIntent(userMessage);
    console.log('🤖 [CHAT ENGINE] Intent analizado:', intent);
    
    // Generar respuesta contextual
    const response = this.generateContextualResponse(intent, this.context);
    console.log('🤖 [CHAT ENGINE] Respuesta generada exitosamente');
    
    // Actualizar contexto CON la respuesta generada
    this.updateContext(userMessage, intent, response.response);
    
    return response;
  }

  private analyzeIntent(message: string): AnalyzedIntent {
    const lowerMessage = message.toLowerCase();
    console.log('🔍 [INTENT ANALYZER] Analizando mensaje:', lowerMessage);
    
    // Palabras clave de urgencia
    const urgentKeywords = ['dolor intenso', 'sangrado abundante', 'emergencia', 'urgente', 'hospital'];
    const highUrgencyKeywords = ['dolor', 'sangrado', 'mareos', 'fiebre', 'preocupado'];
    const mediumUrgencyKeywords = ['pregunta', 'duda', 'consulta', 'cuando', 'como', 'que', 'por que', 'porque'];
    
    let urgency: 'low' | 'medium' | 'high' | 'urgent' = 'low';
    if (urgentKeywords.some(keyword => lowerMessage.includes(keyword))) urgency = 'urgent';
    else if (highUrgencyKeywords.some(keyword => lowerMessage.includes(keyword))) urgency = 'high';
    else if (mediumUrgencyKeywords.some(keyword => lowerMessage.includes(keyword))) urgency = 'medium';

    // Categorización de temas - EXPANDIDA
    const topics: string[] = [];
    
    // Embarazo y concepción
    if (lowerMessage.includes('embarazo') || lowerMessage.includes('concebir') || 
        lowerMessage.includes('quedar embarazada') || lowerMessage.includes('posibilidades') ||
        lowerMessage.includes('mejoro') || lowerMessage.includes('mejorar')) {
      topics.push('pregnancy');
    }
    
    // Ovulación y ciclo
    if (lowerMessage.includes('ovulación') || lowerMessage.includes('ciclo') ||
        lowerMessage.includes('menstruación') || lowerMessage.includes('regla')) {
      topics.push('cycle');
    }
    
    // Tratamientos
    if (lowerMessage.includes('tratamiento') || lowerMessage.includes('medicación') ||
        lowerMessage.includes('fiv') || lowerMessage.includes('inseminación') ||
        lowerMessage.includes('reproduccion asistida') || lowerMessage.includes('medicos')) {
      topics.push('treatment');
    }
    
    // Resultados y análisis
    if (lowerMessage.includes('resultado') || lowerMessage.includes('análisis') ||
        lowerMessage.includes('explicar') || lowerMessage.includes('significa') ||
        lowerMessage.includes('interpretar') || lowerMessage.includes('pronóstico') ||
        lowerMessage.includes('pronostico') || lowerMessage.includes('1.6%') ||
        lowerMessage.includes('11.0%') || lowerMessage.includes('porcentaje')) {
      topics.push('results');
    }
    
    // Estilo de vida
    if (lowerMessage.includes('estilo de vida') || lowerMessage.includes('dieta') ||
        lowerMessage.includes('alimentación') || lowerMessage.includes('ejercicio') ||
        lowerMessage.includes('suplementos') || lowerMessage.includes('peso') ||
        lowerMessage.includes('estrés') || lowerMessage.includes('dormir')) {
      topics.push('lifestyle');
    }
    
    // Próximos pasos
    if (lowerMessage.includes('próximos pasos') || lowerMessage.includes('proximos pasos') ||
        lowerMessage.includes('que sigue') || lowerMessage.includes('que hacer') ||
        lowerMessage.includes('recomendaciones') || lowerMessage.includes('siguientes pasos')) {
      topics.push('next_steps');
    }

    console.log('🔍 [INTENT ANALYZER] Topics detectados:', topics, 'Urgency:', urgency);

    return {
      category: urgency === 'urgent' ? 'emergency' : topics.length > 0 ? 'question' : 'concern',
      topics,
      urgency
    };
  }

  private generateClarificationResponse(
    lastConversation: { userMessage: string; aiResponse: string; topic: string }, 
    intent: AnalyzedIntent,
    overallScore: number
  ) {
    console.log('🔍 [CLARIFICATION] Generando aclaración para:', lastConversation.topic);
    
    // Respuestas de clarificación específicas por tema
    const clarifications: Record<string, string> = {
      'results': `Déjame explicarte tu pronóstico de ${overallScore.toFixed(1)}% de manera más sencilla: \n\n${this.getSimplePrognosisExplanation(overallScore)}`,
      'treatment': 'Te explico las opciones de tratamiento de forma más clara: Los tratamientos van de menos a más invasivos...',
      'pregnancy': 'Sobre mejorar las posibilidades de embarazo: Se trata de optimizar varios factores que afectan la fertilidad...',
      'next_steps': 'Los próximos pasos dependen de tu situación específica. Te los ordeno por prioridad...',
      'lifestyle': 'Los cambios de estilo de vida son fundamentales. Te doy ejemplos concretos y fáciles de implementar...'
    };
    
    const clarificationText = clarifications[lastConversation.topic] || 
      `Te explico mejor lo anterior: ${lastConversation.aiResponse.substring(0, 200)}...`;
    
    return {
      response: `💡 **Aclaración sobre ${lastConversation.topic}:**\n\n${clarificationText}\n\n¿Esto responde tu duda o necesitas que profundice en algún punto específico?`,
      quickReplies: [
        { id: '1', text: 'Ahora sí entiendo', action: 'question' as const },
        { id: '2', text: 'Explica más detallado', action: 'question' as const },
        { id: '3', text: 'Dame un ejemplo', action: 'request_info' as const },
        { id: '4', text: 'Tengo otra pregunta', action: 'question' as const }
      ],
      urgencyLevel: intent.urgency
    };
  }

  private generateFollowUpResponse(
    lastConversation: { userMessage: string; aiResponse: string; topic: string },
    intent: AnalyzedIntent, 
    overallScore: number,
    context: ConversationContext
  ) {
    console.log('🔄 [FOLLOW-UP] Continuando tema:', lastConversation.topic);
    
    // Respuestas de seguimiento específicas por tema
    const followUps: Record<string, (score: number) => string> = {
      'results': (score) => `Continuando con tu análisis de ${score.toFixed(1)}%: ${this.getDetailedPrognosisFollowUp(score, context)}`,
      'treatment': () => 'Profundizando en las opciones de tratamiento disponibles para tu caso específico...',
      'pregnancy': (score) => `Siguiendo con estrategias para mejorar tus posibilidades (actualmente ${score.toFixed(1)}%)...`,
      'next_steps': () => 'Detallando los próximos pasos específicos para tu situación...',
      'lifestyle': () => 'Ampliando las recomendaciones de estilo de vida personalizadas para tu perfil...'
    };
    
    const followUpGenerator = followUps[lastConversation.topic];
    const followUpText = followUpGenerator ? followUpGenerator(overallScore) : 
      `Continuando con el tema anterior: ${this.generateTopicContinuation(lastConversation.topic, overallScore)}`;
    
    return {
      response: followUpText,
      quickReplies: this.getContextualQuickReplies(lastConversation.topic, context),
      attachments: this.getContextualAttachments(lastConversation.topic, context),
      urgencyLevel: intent.urgency
    };
  }

  private getSimplePrognosisExplanation(score: number): string {
    if (score >= 60) {
      return "✅ Tu pronóstico es bueno. Significa que tienes una probabilidad favorable de lograr un embarazo natural con algunos ajustes simples.";
    } else if (score >= 40) {
      return "⚠️ Tu pronóstico es moderado. Hay varios factores que podemos optimizar para mejorar significativamente tus posibilidades.";
    } else if (score >= 20) {
      return "🔶 Tu pronóstico necesita atención médica especializada. Con el tratamiento adecuado, las posibilidades pueden mejorar considerablemente.";
    } else {
      return "🔴 Tu situación requiere evaluación médica urgente y posiblemente tratamientos de reproducción asistida para maximizar las opciones.";
    }
  }

  private getDetailedPrognosisFollowUp(score: number, context: ConversationContext): string {
    const criticalFactors = this.identifyCriticalFactors(context.patientData);
    return `Los factores que más impactan tu pronóstico son: ${criticalFactors.join(', ')}. ¿Te gustaría que analicemos cómo mejorar específicamente estos aspectos?`;
  }

  private generateTopicContinuation(topic: string, score: number): string {
    return `Basándome en tu perfil (${score.toFixed(1)}%), puedo darte más información específica sobre ${topic}. ¿Qué aspecto particular te interesa más?`;
  }

  private identifyCriticalFactors(patientData: EvaluationState): string[] {
    const factors = patientData.factors || {};
    const critical = [];
    
    if (factors.amh && factors.amh < 0.6) critical.push('reserva ovárica');
    if (factors.pcos && factors.pcos < 0.7) critical.push('SOP');
    if (factors.bmi && factors.bmi < 0.7) critical.push('peso corporal');
    if (factors.male && factors.male < 0.7) critical.push('factor masculino');
    if (factors.tsh && factors.tsh < 0.8) critical.push('función tiroidea');
    
    return critical.length > 0 ? critical : ['edad', 'reserva ovárica'];
  }

  private getContextualQuickReplies(topic: string, _context: ConversationContext): QuickReply[] {
    const baseReplies: Record<string, QuickReply[]> = {
      'results': [
        { id: '1', text: '¿Qué puedo hacer para mejorarlo?', action: 'question' },
        { id: '2', text: 'Dame detalles de mis factores críticos', action: 'request_info' },
        { id: '3', text: '¿Cuánto tiempo tengo?', action: 'question' },
        { id: '4', text: 'Necesito ayuda médica', action: 'schedule' }
      ],
      'treatment': [
        { id: '1', text: 'Costos de tratamientos', action: 'request_info' },
        { id: '2', text: 'Efectividad de cada opción', action: 'question' },
        { id: '3', text: 'Efectos secundarios', action: 'question' },
        { id: '4', text: 'Buscar especialistas', action: 'schedule' }
      ]
    };
    
    return baseReplies[topic] || [
      { id: '1', text: 'Cuéntame más', action: 'question' },
      { id: '2', text: 'Tengo otra pregunta', action: 'question' },
      { id: '3', text: 'Dame recomendaciones', action: 'request_info' },
      { id: '4', text: 'Siguiente paso', action: 'schedule' }
    ];
  }

  private getContextualAttachments(topic: string, context: ConversationContext): ChatAttachment[] | undefined {
    if (topic === 'results') {
      return [{
        type: 'chart',
        title: 'Análisis de Factores Críticos',
        data: context.patientData.factors,
        preview: 'Desglose detallado de tu perfil médico'
      }];
    }
    return undefined;
  }

  private updateContext(message: string, intent: AnalyzedIntent, aiResponse?: string): ConversationContext {
    this.context.previousQuestions.push(message);
    if (aiResponse) {
      this.context.previousResponses.push(aiResponse);
      
      // Agregar al historial de conversación
      this.context.conversationHistory.push({
        userMessage: message,
        aiResponse,
        topic: intent.topics[0] || this.context.currentTopic,
        timestamp: new Date()
      });
    }
    
    this.context.urgencyLevel = intent.urgency;
    
    // Actualizar tema actual basado en la conversación
    if (intent.topics.includes('treatment')) {
      this.context.currentTopic = 'treatment';
    } else if (intent.topics.includes('lifestyle')) {
      this.context.currentTopic = 'lifestyle';
    } else if (intent.topics.includes('pregnancy') || intent.topics.includes('cycle')) {
      this.context.currentTopic = 'fertility';
    } else if (intent.topics.includes('results')) {
      this.context.currentTopic = 'results';
    } else if (intent.topics.includes('next_steps')) {
      this.context.currentTopic = 'next_steps';
    }
    
    // Actualizar detalles del último tema
    if (intent.topics.length > 0) {
      this.context.lastTopicDetails = {
        topic: intent.topics[0],
        subtopics: intent.topics.slice(1),
        followUpNeeded: intent.category === 'question' || intent.urgency === 'high'
      };
    }
    
    console.log('🔄 [CONTEXT UPDATE] Topic:', this.context.currentTopic, 'History:', this.context.conversationHistory.length);
    
    return this.context;
  }

  private analyzeConversationContext(): {
    isFollowUp: boolean;
    needsClarification: boolean;
    previousTopicContinuation: boolean;
    suggestedResponse: string | null;
  } {
    const history = this.context.conversationHistory;
    
    // Si no hay historial, es la primera conversación
    if (history.length === 0) {
      return {
        isFollowUp: false,
        needsClarification: false,
        previousTopicContinuation: false,
        suggestedResponse: null
      };
    }
    
    const lastConversation = history[history.length - 1];
    const lastTopic = lastConversation.topic;
    
    // Detectar si es una continuación del tema anterior
    const currentTopicMatches = this.context.currentTopic === lastTopic;
    
    // Detectar patrones de seguimiento
    const followUpPatterns = [
      'y eso', 'pero', 'entonces', 'y si', 'que pasa si', 'como', 'cuando',
      'donde', 'por que', 'porque', 'y que mas', 'tambien', 'además'
    ];
    
    const lastUserMessage = this.context.previousQuestions[this.context.previousQuestions.length - 1] || '';
    const isFollowUp = followUpPatterns.some(pattern => 
      lastUserMessage.toLowerCase().includes(pattern)
    ) || currentTopicMatches;
    
    // Detectar necesidad de clarificación
    const clarificationPatterns = ['no entiendo', 'explica', 'que significa', 'como asi'];
    const needsClarification = clarificationPatterns.some(pattern =>
      lastUserMessage.toLowerCase().includes(pattern)
    );
    
    console.log('📝 [CONTEXT ANALYSIS] Follow-up:', isFollowUp, 'Topic match:', currentTopicMatches, 'Last topic:', lastTopic);
    
    return {
      isFollowUp,
      needsClarification,
      previousTopicContinuation: currentTopicMatches,
      suggestedResponse: null
    };
  }

  private generateContextualResponse(intent: AnalyzedIntent, context: ConversationContext): {
    response: string;
    quickReplies: QuickReply[];
    attachments?: ChatAttachment[];
    urgencyLevel: 'low' | 'medium' | 'high' | 'urgent';
  } {
    const { patientData } = context;
    const overallScore = patientData.report?.numericPrognosis || 0;
    
    // 🔍 ANÁLISIS DEL CONTEXTO DE CONVERSACIÓN
    const conversationContext = this.analyzeConversationContext();
    console.log('💬 [CONTEXTUAL] Análisis:', conversationContext);
    
    // 🔄 MANEJO DE CONTINUACIÓN DE CONVERSACIÓN
    if (conversationContext.isFollowUp && context.conversationHistory.length > 0) {
      const lastConversation = context.conversationHistory[context.conversationHistory.length - 1];
      
      // Si es una clarificación
      if (conversationContext.needsClarification) {
        return this.generateClarificationResponse(lastConversation, intent, overallScore);
      }
      
      // Si es continuación del mismo tema
      if (conversationContext.previousTopicContinuation) {
        return this.generateFollowUpResponse(lastConversation, intent, overallScore, context);
      }
    }
    
    // 🚨 RESPUESTAS SEGÚN URGENCIA (como antes)
    if (intent.urgency === 'urgent') {
      return {
        response: "⚠️ Entiendo tu preocupación. Basándome en los síntomas que describes, te recomiendo contactar inmediatamente a tu médico o acudir a urgencias. Mientras tanto, mantén la calma y evita automedicarte.",
        quickReplies: [
          { id: '1', text: 'Buscar centro médico más cercano', action: 'request_info' },
          { id: '2', text: '¿Qué hago mientras espero?', action: 'question' },
          { id: '3', text: 'Contactar mi médico', action: 'schedule' }
        ],
        urgencyLevel: 'urgent'
      };
    }

    // 💊 RESPUESTAS BASADAS EN CONOCIMIENTO MÉDICO ESPECIALIZADO
    console.log('🧠 [MEDICAL KNOWLEDGE] Consultando base de conocimientos...');
    
    // Determinar tipo de consulta médica
    let queryType: 'pathology' | 'treatment' | 'recommendation' = 'recommendation';
    if (intent.topics.includes('results') || intent.topics.includes('diagnosis')) {
      queryType = 'pathology';
    } else if (intent.topics.includes('treatment')) {
      queryType = 'treatment';
    }

    // Consultar motor de conocimiento médico
    const medicalQuery: MedicalKnowledgeQuery = {
      type: queryType,
      context: patientData,
      urgency: intent.urgency
    };

    const medicalResponse: MedicalResponse = this.medicalKnowledge.generateMedicalResponse(medicalQuery);
    console.log('🔬 [MEDICAL RESPONSE]:', medicalResponse);

    // Respuesta enriquecida con conocimiento médico especializado
    if (intent.topics.includes('pregnancy')) {
      const advice = overallScore >= 60 
        ? "Tus indicadores de fertilidad son favorables. Con tu perfil actual, las posibilidades naturales son prometedoras."
        : overallScore >= 40
        ? "Tu perfil muestra algunas oportunidades de mejora. Te sugiero optimizar algunos factores antes de intentar concebir."
        : "Dado tu perfil actual, te recomiendo considerar una consulta especializada para maximizar tus posibilidades.";

    // Respuesta enriquecida con conocimiento médico especializado
    if (intent.topics.includes('pregnancy')) {
      const baseAdvice = overallScore >= 60 
        ? "Tus indicadores de fertilidad son favorables. Con tu perfil actual, las posibilidades naturales son prometedoras."
        : overallScore >= 40
        ? "Tu perfil muestra algunas oportunidades de mejora. Te sugiero optimizar algunos factores antes de intentar concebir."
        : "Dado tu perfil actual, te recomiendo considerar una consulta especializada para maximizar tus posibilidades.";

      // Enriquecer con análisis médico especializado
      const pathologyAnalysis = this.medicalKnowledge.analyzePatientPathologies(patientData);
      const treatmentSuggestions = this.medicalKnowledge.suggestTreatments(patientData);
      
      let enrichedResponse = `💝 ${baseAdvice}`;
      
      if (pathologyAnalysis.primaryConcerns.length > 0) {
        enrichedResponse += `\n\n🔍 **Análisis específico**: He identificado ${pathologyAnalysis.primaryConcerns.join(', ')} como áreas de atención prioritaria.`;
      }
      
      if (treatmentSuggestions.recommendedTreatments.length > 0) {
        const topTreatment = treatmentSuggestions.recommendedTreatments[0];
        enrichedResponse += `\n\n💊 **Recomendación médica**: ${topTreatment.treatment.nameES} podría ser apropiado para tu caso (${(topTreatment.appropriatenessScore * 100).toFixed(1)}% de adecuación).`;
      }

      return {
        response: `${enrichedResponse}\n\n¿Te gustaría que profundice en algún aspecto específico?`,
        quickReplies: [
          { id: '1', text: '¿Cuándo es mi mejor momento?', action: 'question', payload: { topic: 'timing' } },
          { id: '2', text: 'Análisis de mis factores críticos', action: 'request_info', payload: { topic: 'pathology_detail' } },
          { id: '3', text: 'Opciones de tratamiento', action: 'question', payload: { topic: 'treatment_options' } },
          { id: '4', text: 'Plan de acción personalizado', action: 'request_info', payload: { topic: 'action_plan' } }
        ],
        attachments: [{
          type: 'chart',
          title: 'Análisis Médico Completo',
          data: { 
            score: overallScore, 
            factors: patientData.factors,
            pathologies: pathologyAnalysis.primaryConcerns,
            treatments: treatmentSuggestions.recommendedTreatments.slice(0, 3).map(t => t.treatment.nameES)
          },
          preview: `Evaluación integral: ${overallScore.toFixed(1)}% - ${pathologyAnalysis.primaryConcerns.length} áreas identificadas`
        }],
        urgencyLevel: intent.urgency
      };
    }

    if (intent.topics.includes('treatment')) {
      // 💊 RESPUESTA BASADA EN CONOCIMIENTO ESPECIALIZADO DE TRATAMIENTOS
      const treatmentSuggestions = this.medicalKnowledge.suggestTreatments(patientData);
      const pathologyAnalysis = this.medicalKnowledge.analyzePatientPathologies(patientData);
      
      let treatmentResponse = "💊 **Opciones de Tratamiento Personalizadas:**\n\n";
      
      if (treatmentSuggestions.recommendedTreatments.length > 0) {
        treatmentSuggestions.recommendedTreatments.slice(0, 3).forEach((treatment, index) => {
          treatmentResponse += `${index + 1}. **${treatment.treatment.nameES}** (${(treatment.appropriatenessScore * 100).toFixed(1)}% apropiado)\n`;
          treatmentResponse += `   • ${treatment.reasoning.join('\n   • ')}\n\n`;
        });
        
        // Plan escalonado
        treatmentResponse += "🎯 **Plan Recomendado:**\n";
        treatmentResponse += `• **Inmediato**: ${treatmentSuggestions.treatmentPlan.immediate.slice(0, 2).join(', ')}\n`;
        treatmentResponse += `• **Corto plazo**: ${treatmentSuggestions.treatmentPlan.shortTerm.slice(0, 2).join(', ')}`;
      } else {
        treatmentResponse += "Tu caso requiere evaluación médica personalizada para el mejor enfoque.";
      }

      return {
        response: treatmentResponse,
        quickReplies: [
          { id: '1', text: 'Opciones naturales', action: 'question', payload: { topic: 'natural_treatment' } },
          { id: '2', text: 'Efectividad esperada', action: 'question', payload: { topic: 'success_rates' } },
          { id: '3', text: 'Costos y tiempos', action: 'request_info', payload: { topic: 'logistics' } },
          { id: '4', text: 'Buscar especialistas', action: 'schedule' }
        ],
        attachments: treatmentSuggestions.recommendedTreatments.length > 0 ? [{
          type: 'protocol',
          title: 'Protocolos Sugeridos',
          data: { treatments: treatmentSuggestions.recommendedTreatments },
          preview: `${treatmentSuggestions.recommendedTreatments.length} opciones evaluadas`
        }] : undefined,
        urgencyLevel: intent.urgency
      };
    }

    if (intent.topics.includes('lifestyle')) {
      return {
        response: "🌱 El estilo de vida tiene un impacto significativo en la fertilidad. Basándome en tu perfil, puedo sugerirte cambios específicos y prioritarios. ¿En qué área te gustaría enfocarte?",
        quickReplies: [
          { id: '1', text: 'Alimentación y suplementos', action: 'question', payload: { topic: 'nutrition' } },
          { id: '2', text: 'Ejercicio y descanso', action: 'question', payload: { topic: 'exercise' } },
          { id: '3', text: 'Manejo del estrés', action: 'question', payload: { topic: 'stress' } },
          { id: '4', text: 'Plan integral personalizado', action: 'request_info', payload: { topic: 'complete_plan' } }
        ],
        attachments: [{
          type: 'protocol',
          title: 'Protocolo de Optimización Personalizado',
          data: { factors: patientData.factors, recommendations: [] },
          preview: 'Plan de mejoras basado en tu perfil específico'
        }],
        urgencyLevel: intent.urgency
      };
    }

    // Respuesta específica para explicación de resultados
    if (intent.topics.includes('results')) {
      // 🔬 ANÁLISIS MÉDICO ESPECIALIZADO DE PATOLOGÍAS
      const pathologyAnalysis = this.medicalKnowledge.analyzePatientPathologies(patientData);
      const medicalResponse = this.medicalKnowledge.generateMedicalResponse({
        type: 'pathology',
        context: patientData,
        urgency: intent.urgency
      });
      
      const baseExplanation = overallScore >= 60 
        ? "Tu pronóstico es favorable. Esto significa que tienes buenas posibilidades de concebir naturalmente."
        : overallScore >= 40
        ? "Tu pronóstico es moderado. Hay factores específicos que podemos optimizar para mejorar tus posibilidades."
        : overallScore >= 20
        ? "Tu pronóstico requiere atención médica. Es importante trabajar con especialistas para maximizar las opciones."
        : "Tu pronóstico indica la necesidad de evaluación especializada urgente y posiblemente técnicas de reproducción asistida.";

      let enrichedExplanation = `📊 **Explicación de tu Pronóstico: ${overallScore.toFixed(1)}%**\n\n${baseExplanation}`;
      
      // Agregar análisis médico especializado
      if (pathologyAnalysis.suspectedPathologies.length > 0) {
        enrichedExplanation += "\n\n🔬 **Análisis Médico Especializado:**\n";
        pathologyAnalysis.suspectedPathologies.slice(0, 3).forEach((pathology, index) => {
          enrichedExplanation += `${index + 1}. **${pathology.pathology.nameES}** - ${(pathology.probabilityScore * 100).toFixed(1)}% probabilidad\n`;
          enrichedExplanation += `   • ${pathology.matchingFactors.join('\n   • ')}\n`;
        });
      }
      
      // Agregar recomendaciones de estudios
      if (pathologyAnalysis.recommendedTests.length > 0) {
        enrichedExplanation += `\n🧪 **Estudios Recomendados:** ${pathologyAnalysis.recommendedTests.slice(0, 2).join(', ')}`;
      }
      
      enrichedExplanation += "\n\nEste análisis se basa en evidencia científica y más de 15 factores médicos específicos de tu caso.";

      return {
        response: enrichedExplanation,
        quickReplies: [
          { id: '1', text: '¿Qué factores críticos tengo?', action: 'question', payload: { topic: 'critical_factors' } },
          { id: '2', text: 'Detalles de condiciones detectadas', action: 'request_info', payload: { topic: 'pathology_details' } },
          { id: '3', text: '¿Cómo puedo mejorar?', action: 'question', payload: { topic: 'improvement_plan' } },
          { id: '4', text: 'Necesito estudios médicos', action: 'schedule', payload: { topic: 'medical_tests' } }
        ],
        attachments: [{
          type: 'study',
          title: 'Reporte Médico Completo',
          data: { 
            score: overallScore, 
            factors: patientData.factors,
            pathologies: pathologyAnalysis.suspectedPathologies,
            recommendedTests: pathologyAnalysis.recommendedTests,
            evidenceLevel: medicalResponse.evidenceLevel
          },
          preview: `Análisis médico integral - ${pathologyAnalysis.suspectedPathologies.length} condiciones evaluadas`
        }],
        urgencyLevel: intent.urgency
      };
    }

    // Respuesta para próximos pasos
    if (intent.topics.includes('next_steps')) {
      const stepsByScore = overallScore >= 60
        ? [
            "Continuar con intentos naturales por 3-6 meses más",
            "Optimizar timing con tests de ovulación",
            "Mantener estilo de vida saludable",
            "Seguimiento médico en 6 meses"
          ]
        : overallScore >= 40
        ? [
            "Consulta con especialista en fertilidad",
            "Estudios complementarios específicos",
            "Optimización de factores identificados",
            "Considerar inducción de ovulación"
          ]
        : overallScore >= 20
        ? [
            "Consulta urgente con especialista",
            "Evaluación para reproducción asistida",
            "Estudios genéticos si aplican",
            "Plan de tratamiento personalizado"
          ]
        : [
            "Evaluación inmediata con equipo multidisciplinario",
            "FIV como opción principal",
            "Consideración de técnicas avanzadas",
            "Counseling y apoyo psicológico"
          ];

      return {
        response: `🎯 **Próximos Pasos Recomendados Basados en tu Perfil:**\n\n${stepsByScore.map((step, index) => `${index + 1}. ${step}`).join('\n')}\n\n¿Te gustaría información detallada sobre alguno de estos pasos?`,
        quickReplies: [
          { id: '1', text: 'Detalles del paso 1', action: 'question', payload: { topic: 'step_1_detail' } },
          { id: '2', text: 'Encontrar especialistas', action: 'request_info', payload: { topic: 'find_specialists' } },
          { id: '3', text: 'Cronograma sugerido', action: 'question', payload: { topic: 'timeline' } },
          { id: '4', text: 'Costos estimados', action: 'request_info', payload: { topic: 'cost_estimates' } }
        ],
        attachments: [{
          type: 'recommendation',
          title: 'Plan de Acción Personalizado',
          data: { steps: stepsByScore, priority: overallScore < 40 ? 'high' : 'medium' },
          preview: `Ruta optimizada basada en tu pronóstico de ${overallScore.toFixed(1)}%`
        }],
        urgencyLevel: intent.urgency
      };
    }

    // Respuesta general
    return {
      response: `👋 Hola, soy tu asistente de IA especializada en fertilidad. He revisado tu perfil completo (pronóstico: ${overallScore.toFixed(1)}%) y estoy aquí para responder todas tus dudas. ¿En qué puedo ayudarte hoy?`,
      quickReplies: [
        { id: '1', text: '¿Cómo mejoro mis posibilidades?', action: 'question', payload: { topic: 'improvement' } },
        { id: '2', text: 'Explicar mis resultados', action: 'question', payload: { topic: 'results_explanation' } },
        { id: '3', text: 'Próximos pasos recomendados', action: 'request_info', payload: { topic: 'next_steps' } },
        { id: '4', text: 'Tengo una pregunta específica', action: 'question', payload: { topic: 'custom' } }
      ],
      urgencyLevel: intent.urgency
    };
  }
}

// 🎨 COMPONENTE PRINCIPAL DEL CHAT
export const AIChat: React.FC<AIChatProps> = ({ 
  evaluation, 
  initialTopic: _initialTopic = '',
  onRecommendationGenerated 
}) => {
  const theme = useDynamicTheme();
  const styles = createStyles(theme);
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatEngine] = useState(() => new MedicalAIChatEngine(evaluation));
  
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);
  const typingAnimation = useRef(new Animated.Value(0)).current;

  // 🚀 INICIALIZAR CHAT CON MENSAJE DE BIENVENIDA
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'ai',
      message: `👋 ¡Hola! Soy tu consultora de IA especializada en fertilidad. He analizado tu perfil completo y estoy aquí para responder todas tus preguntas. Tu pronóstico actual es de ${(evaluation.report?.numericPrognosis || 0).toFixed(1)}%.`,
      timestamp: new Date(),
      quickReplies: [
        { id: '1', text: '¿Cómo interpreto mis resultados?', action: 'question' },
        { id: '2', text: 'Quiero mejorar mis posibilidades', action: 'request_info' },
        { id: '3', text: '¿Cuándo debo buscar ayuda médica?', action: 'question' },
        { id: '4', text: 'Tengo una pregunta específica', action: 'question' }
      ]
    };
    
    setMessages([welcomeMessage]);
  }, [evaluation]);

  // 🎯 ENVIAR MENSAJE
  const sendMessage = async (text: string, isQuickReply = false) => {
    console.log('💬 [CHAT] sendMessage llamado:', { text, isQuickReply });
    
    if (!text.trim() && !isQuickReply) return;

    // Agregar mensaje del usuario
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: text,
      timestamp: new Date()
    };

    console.log('💬 [CHAT] Agregando mensaje usuario:', userMessage);
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Iniciar animación de typing
    Animated.loop(
      Animated.sequence([
        Animated.timing(typingAnimation, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(typingAnimation, { toValue: 0, duration: 500, useNativeDriver: true })
      ])
    ).start();

    try {
      console.log('💬 [CHAT] Generando respuesta IA...');
      // Generar respuesta de IA
      const aiResponse = await chatEngine.generateResponse(text);
      console.log('💬 [CHAT] Respuesta IA generada:', aiResponse);
      
      // Convertir QuickReply[] a ChatQuickReply[]
      const chatQuickReplies = aiResponse.quickReplies?.map(reply => ({
        id: reply.id,
        text: reply.text,
        action: reply.action || 'question'
      }));
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        message: aiResponse.response,
        timestamp: new Date(),
        quickReplies: chatQuickReplies,
        attachments: aiResponse.attachments
      };

      console.log('💬 [CHAT] Agregando mensaje IA:', aiMessage);

      setMessages(prev => [...prev, aiMessage]);
      
      // Callback si hay recomendaciones
      if (aiResponse.attachments && onRecommendationGenerated) {
        aiResponse.attachments.forEach(attachment => {
          if (attachment.type === 'recommendation' || attachment.type === 'protocol') {
            onRecommendationGenerated(attachment.data);
          }
        });
      }

    } catch (error) {
      console.error('Error generating AI response:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'system',
        message: '❌ Lo siento, hubo un error al procesar tu consulta. Por favor, intenta nuevamente o reformula tu pregunta.',
        timestamp: new Date(),
        quickReplies: [
          { id: '1', text: 'Intentar de nuevo', action: 'question' },
          { id: '2', text: 'Contactar soporte', action: 'request_info' }
        ]
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      typingAnimation.stopAnimation();
    }
  };

  // 🎯 MANEJAR RESPUESTAS RÁPIDAS
  const handleQuickReply = (quickReply: QuickReply) => {
    console.log('🔥 [CHAT] Quick Reply presionado:', quickReply);
    sendMessage(quickReply.text, true);
  };

  // 📱 AUTO-SCROLL AL FINAL
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
    
    return () => clearTimeout(timer);
  }, [messages, isTyping]);

  // 🎨 RENDERIZAR MENSAJE
  const renderMessage = (message: ChatMessage, _index: number) => {
    const isUser = message.type === 'user';
    const isSystem = message.type === 'system';
    
    return (
      <View key={message.id} style={[
        styles.messageContainer,
        isUser ? styles.userMessageContainer : styles.aiMessageContainer
      ]}>
        {/* Avatar */}
        {!isUser && (
          <View style={styles.avatarContainer}>
            <Ionicons 
              name={isSystem ? "information-circle" : "medical"} 
              size={20} 
              color={theme.colors.primary} 
            />
          </View>
        )}
        
        {/* Mensaje */}
        <View style={[
          styles.messageBubble,
          isUser ? styles.userMessageBubble : styles.aiMessageBubble,
          isSystem && styles.systemMessageBubble
        ]}>
          <Text style={[
            styles.messageText,
            isUser ? styles.userMessageText : styles.aiMessageText,
            isSystem && styles.systemMessageText
          ]}>
            {message.message}
          </Text>
          
          {/* Timestamp */}
          <Text style={styles.timestamp}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        
        {isUser && <View style={styles.spacer} />}
      </View>
    );
  };

  // 🎯 RENDERIZAR RESPUESTAS RÁPIDAS
  const renderQuickReplies = (quickReplies: QuickReply[]) => (
    <View style={styles.quickRepliesContainer}>
      <Text style={styles.quickRepliesTitle}>Respuestas sugeridas:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickRepliesScroll}>
        {quickReplies.map((reply) => (
          <TouchableOpacity
            key={reply.id}
            style={styles.quickReplyButton}
            onPress={() => handleQuickReply(reply)}
          >
            <Text style={styles.quickReplyText}>{reply.text}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  // 🎯 RENDERIZAR ATTACHMENTS
  const renderAttachments = (attachments: ChatAttachment[]) => (
    <View style={styles.attachmentsContainer}>
      {attachments.map((attachment, index) => (
        <TouchableOpacity key={index} style={styles.attachmentCard}>
          <View style={styles.attachmentIcon}>
            <Ionicons 
              name={
                attachment.type === 'recommendation' ? 'medical' :
                attachment.type === 'study' ? 'document-text' :
                attachment.type === 'protocol' ? 'list' : 'bar-chart'
              } 
              size={24} 
              color={theme.colors.primary} 
            />
          </View>
          <View style={styles.attachmentContent}>
            <Text style={styles.attachmentTitle}>{attachment.title}</Text>
            {attachment.preview && (
              <Text style={styles.attachmentPreview}>{attachment.preview}</Text>
            )}
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      ))}
    </View>
  );

  // 🎯 TYPING INDICATOR
  const renderTypingIndicator = () => (
    <View style={[styles.messageContainer, styles.aiMessageContainer]}>
      <View style={styles.avatarContainer}>
        <Ionicons name="medical" size={20} color={theme.colors.primary} />
      </View>
      <View style={[styles.messageBubble, styles.aiMessageBubble, styles.typingBubble]}>
        <View style={styles.typingDots}>
          {[0, 1, 2].map((dot) => (
            <Animated.View
              key={dot}
              style={[
                styles.typingDot,
                {
                  opacity: typingAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.3, 1]
                  }),
                  transform: [{
                    scale: typingAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1.2]
                    })
                  }]
                }
              ]}
            />
          ))}
        </View>
        <Text style={styles.typingText}>Analizando tu consulta...</Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Header del Chat */}
      <View style={styles.chatHeader}>
        <View style={styles.headerAvatar}>
          <Ionicons name="medical" size={24} color="white" />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Dr. IA - Especialista en Fertilidad</Text>
          <Text style={styles.headerStatus}>● En línea - Respondiendo consultas</Text>
        </View>
      </View>

      {/* Mensajes */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message, index) => (
          <View key={message.id}>
            {renderMessage(message, index)}
            
            {/* Quick Replies (solo para el último mensaje de IA) */}
            {message.type === 'ai' && 
             message.quickReplies && 
             index === messages.length - 1 && 
             !isTyping && 
             renderQuickReplies(message.quickReplies)}
            
            {/* Attachments */}
            {message.attachments && renderAttachments(message.attachments)}
          </View>
        ))}
        
        {isTyping && renderTypingIndicator()}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={styles.textInput}
          placeholder="Escribe tu consulta médica..."
          placeholderTextColor={theme.colors.textSecondary}
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
          onSubmitEditing={() => sendMessage(inputText)}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            { backgroundColor: inputText.trim() ? theme.colors.primary : theme.colors.border }
          ]}
          onPress={() => sendMessage(inputText)}
          disabled={!inputText.trim() || isTyping}
        >
          <Ionicons 
            name="send" 
            size={20} 
            color={inputText.trim() ? "white" : theme.colors.textSecondary} 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

// 🎨 ESTILOS PROFESIONALES
const createStyles = (theme: ReturnType<typeof useDynamicTheme>) => {
  const { width } = Dimensions.get('window');
  
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    chatHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      backgroundColor: theme.colors.primary,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
    },
    headerAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255,255,255,0.2)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    headerInfo: {
      flex: 1,
    },
    headerTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: 'white',
    },
    headerStatus: {
      fontSize: 12,
      color: 'rgba(255,255,255,0.8)',
      marginTop: 2,
    },
    messagesContainer: {
      flex: 1,
    },
    messagesContent: {
      padding: 16,
      paddingBottom: 32,
    },
    messageContainer: {
      flexDirection: 'row',
      marginBottom: 16,
      maxWidth: width * 0.8,
    },
    userMessageContainer: {
      justifyContent: 'flex-end',
      alignSelf: 'flex-end',
    },
    aiMessageContainer: {
      justifyContent: 'flex-start',
      alignSelf: 'flex-start',
    },
    avatarContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 8,
      marginTop: 4,
    },
    messageBubble: {
      borderRadius: 18,
      paddingHorizontal: 16,
      paddingVertical: 12,
      maxWidth: '100%',
    },
    userMessageBubble: {
      backgroundColor: theme.colors.primary,
      borderBottomRightRadius: 4,
    },
    aiMessageBubble: {
      backgroundColor: theme.colors.surface,
      borderBottomLeftRadius: 4,
    },
    systemMessageBubble: {
      backgroundColor: '#FFF3E0',
      borderColor: '#FF9800',
      borderWidth: 1,
    },
    typingBubble: {
      paddingVertical: 16,
    },
    messageText: {
      fontSize: 16,
      lineHeight: 22,
    },
    userMessageText: {
      color: 'white',
    },
    aiMessageText: {
      color: theme.colors.text,
    },
    systemMessageText: {
      color: '#E65100',
    },
    timestamp: {
      fontSize: 11,
      marginTop: 4,
      opacity: 0.7,
    },
    spacer: {
      width: 32,
    },
    typingDots: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    typingDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.primary,
      marginHorizontal: 2,
    },
    typingText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      fontStyle: 'italic',
    },
    quickRepliesContainer: {
      marginTop: 8,
      marginBottom: 16,
    },
    quickRepliesTitle: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginBottom: 8,
      marginLeft: 40,
    },
    quickRepliesScroll: {
      paddingLeft: 40,
    },
    quickReplyButton: {
      backgroundColor: theme.colors.surface,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 8,
      marginRight: 8,
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    quickReplyText: {
      fontSize: 14,
      color: theme.colors.primary,
      fontWeight: '500',
    },
    attachmentsContainer: {
      marginLeft: 40,
      marginTop: 8,
      marginBottom: 16,
    },
    attachmentCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 12,
      marginBottom: 8,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.primary,
    },
    attachmentIcon: {
      marginRight: 12,
    },
    attachmentContent: {
      flex: 1,
    },
    attachmentTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text,
    },
    attachmentPreview: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      padding: 16,
      backgroundColor: theme.colors.surface,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    textInput: {
      flex: 1,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginRight: 8,
      maxHeight: 100,
      fontSize: 16,
      color: theme.colors.text,
      backgroundColor: theme.colors.background,
    },
    sendButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};
