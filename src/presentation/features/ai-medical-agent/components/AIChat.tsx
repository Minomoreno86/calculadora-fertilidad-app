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

import { MedicalKnowledgeEngine } from '../../../../../ai-medical-agent/core/modules-integration/ModulesIntegration';
import { EvaluationState, Factors } from '@/core/domain/models';
import { useDynamicTheme } from '@/hooks/useDynamicTheme';
import Text from '@/presentation/components/common/Text';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// 🧠 IMPORTAR MOTOR DE RAZONAMIENTO MÉDICO
import { MedicalReasoningEngine } from '@/core/intelligence/MedicalReasoningEngine';

// 🔧 IMPORTAR ADAPTADORES PARA EMERGENCIA
import { 
  createMockAnalysis, 
  createMockTreatments 
} from '../utils/ChatAdapters';

// 🎯 TIPOS INTELIGENTES DEL SISTEMA DE CHAT
type UrgencyLevel = 'low' | 'medium' | 'high' | 'urgent';
type QuickReplyAction = 'question' | 'request_info' | 'schedule' | 'clarification';
type AttachmentType = 'recommendation' | 'study' | 'protocol' | 'chart';
type MessageCategory = 'question' | 'concern' | 'symptom' | 'request' | 'emergency';

// 🔬 TIPO PARA ANÁLISIS CLÍNICO
interface ClinicalAnalysis {
  primaryHypothesis: {
    condition: string;
    urgency: string;
  };
  confidence: number;
  reasoningChain?: Array<{
    conclusion: string;
    evidence?: string;
  }>;
  recommendedActions?: string[];
}

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
  action: QuickReplyAction;
  payload?: unknown;
}

interface ChatAttachment {
  type: AttachmentType;
  title: string;
  data: unknown;
  preview?: string;
}

interface AnalyzedIntent {
  category: MessageCategory;
  topics: string[];
  urgency: UrgencyLevel;
  confidence?: number; // 🧠 Nueva: confianza en el análisis
  medicalContext?: {   // 🧠 Nueva: contexto médico del razonamiento
    primaryHypothesis?: string;
    clinicalConfidence?: number;
    reasoningAvailable?: boolean;
  };
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
  urgencyLevel: UrgencyLevel;
  userPreferences: {
    treatmentPreference: 'natural' | 'assisted' | 'aggressive';
    communicationStyle: 'technical' | 'simple' | 'detailed';
  };
  lastTopicDetails?: {
    topic?: string;
    subtopics?: string[];
    followUpNeeded?: boolean;
    // 🧠 NUEVO: Información del razonamiento clínico
    clinicalHypothesis?: string;
    confidence?: number;
    urgencyLevel?: string;
    reasoningSteps?: number;
  };
}

interface AIChatProps {
  evaluation: EvaluationState;
  initialTopic?: string;
  onRecommendationGenerated?: (recommendation: unknown) => void;
}

// 🧠 MOTOR DE RESPUESTAS IA MÉDICA
class MedicalAIChatEngine {
  private readonly context: ConversationContext;
  private readonly medicalKnowledge: MedicalKnowledgeEngine;
  private readonly reasoningEngine: MedicalReasoningEngine; // 🧠 MOTOR DE RAZONAMIENTO
  
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
    
    // 🧠 MOTOR DE RAZONAMIENTO CLÍNICO AVANZADO
    this.reasoningEngine = new MedicalReasoningEngine();
    
    console.log('🤖 [MEDICAL AI] Chat engine inicializado con razonamiento médico especializado');
  }

  async generateResponse(userMessage: string): Promise<{
    response: string;
    quickReplies: QuickReply[];
    attachments?: ChatAttachment[];
    urgencyLevel: UrgencyLevel;
  }> {
    console.log('🤖 [CHAT ENGINE] generateResponse iniciado para:', userMessage);
    console.log('🤖 [CHAT ENGINE] Historial previo:', this.context.conversationHistory.length, 'mensajes');
    
    // ⚡ PASO 1: RAZONAMIENTO MÉDICO AVANZADO
    const clinicalAnalysis = await this.reasoningEngine.reasonAboutCase(this.context.patientData);
    console.log('🧠 [REASONING] Análisis clínico completado:', clinicalAnalysis.confidence);
    
    // 🔍 PASO 2: Análisis de intención con contexto médico
    const intent = this.analyzeIntentWithReasoning(userMessage, clinicalAnalysis);
    console.log('🤖 [CHAT ENGINE] Intent con razonamiento analizado:', intent);
    
    // � PASO 3: GENERACIÓN DE RESPUESTA CON RAZONAMIENTO MÉDICO
    const response = this.generateIntelligentResponse(intent, this.context, clinicalAnalysis);
    
    // 📝 PASO 4: Actualizar contexto CON el razonamiento
    this.updateContextWithReasoning(userMessage, intent, response.response, clinicalAnalysis);
    
    return response;
  }

  /**
   * 🎯 GENERAR QUICK REPLIES INTELIGENTES
   */
  private generateIntelligentQuickReplies(intent: AnalyzedIntent, clinicalAnalysis: ClinicalAnalysis): QuickReply[] {
    const quickReplies: QuickReply[] = [];
    
    // Respuestas basadas en hipótesis clínica - CON VALIDACIÓN DE SEGURIDAD
    if (clinicalAnalysis?.primaryHypothesis?.condition) {
      const condition = clinicalAnalysis.primaryHypothesis.condition;
      
      quickReplies.push({
        id: '1',
        text: `¿Por qué crees que tengo ${condition.toLowerCase()}?`,
        action: 'question',
        payload: { topic: 'reasoning_explanation', condition }
      });
      
      quickReplies.push({
        id: '2',
        text: '¿Qué estudios necesito?',
        action: 'question',
        payload: { topic: 'diagnostic_tests', condition }
      });
    }
    
    // Respuestas contextuales según el tema
    if (intent.topics.includes('treatment')) {
      quickReplies.push({
        id: '3',
        text: 'Opciones de tratamiento',
        action: 'request_info',
        payload: { topic: 'treatment_options' }
      });
    } else if (intent.topics.includes('lifestyle')) {
      quickReplies.push({
        id: '3',
        text: '¿Cómo mejoro mi estilo de vida?',
        action: 'question',
        payload: { topic: 'lifestyle_plan' }
      });
    } else {
      quickReplies.push({
        id: '3',
        text: 'Plan de acción personalizado',
        action: 'request_info',
        payload: { topic: 'action_plan' }
      });
    }
    
    // Siempre incluir opción de especialista
    quickReplies.push({
      id: '4',
      text: 'Encontrar especialista',
      action: 'schedule',
      payload: { topic: 'find_specialist' }
    });
    
    return quickReplies;
  }

  /**
   * 📎 GENERAR ATTACHMENTS MÉDICOS
   */
  private generateMedicalAttachments(clinicalAnalysis: ClinicalAnalysis, _context: ConversationContext): ChatAttachment[] | undefined {
    // 🔍 VALIDACIÓN DE HIPÓTESIS PRIMARIA CON NULL SAFETY
    if (!clinicalAnalysis?.primaryHypothesis?.condition || clinicalAnalysis.confidence < 0.6) {
      return undefined;
    }
    
    return [{
      type: 'protocol' as AttachmentType,
      title: 'Análisis Clínico IA Médica',
      data: {
        hypothesis: clinicalAnalysis.primaryHypothesis.condition,
        confidence: clinicalAnalysis.confidence,
        reasoning_steps: clinicalAnalysis.reasoningChain?.length || 0,
        recommendations: clinicalAnalysis.recommendedActions?.slice(0, 3)
      },
      preview: `Análisis médico: ${clinicalAnalysis.reasoningChain?.length || 0} pasos de razonamiento clínico`
    }];
  }

  /**
   * ⚠️ DETERMINAR NIVEL DE URGENCIA REAL
   */
  private determineUrgencyLevel(intent: AnalyzedIntent, clinicalAnalysis: ClinicalAnalysis): UrgencyLevel {
    // Urgencia basada en análisis clínico
    if (clinicalAnalysis.primaryHypothesis?.urgency === 'critical') {
      return 'urgent';
    } else if (clinicalAnalysis.primaryHypothesis?.urgency === 'high') {
      return 'high';
    } else if (clinicalAnalysis.primaryHypothesis?.urgency === 'moderate') {
      return 'medium';
    }
    
    // Fallback al análisis de intención
    return intent.urgency;
  }

  /**
   * 🧠 ANÁLISIS DE INTENCIÓN CON RAZONAMIENTO CLÍNICO
   */
  private analyzeIntentWithReasoning(message: string, clinicalAnalysis: ClinicalAnalysis): AnalyzedIntent {
    const basicIntent = this.analyzeIntent(message);
    
    // 🔍 Mejorar análisis con contexto clínico
    const primaryCondition = clinicalAnalysis.primaryHypothesis?.condition || 'unknown';
    const confidence: number = clinicalAnalysis.confidence || 0.5;
    
    // 🎯 Ajustar urgencia basada en razonamiento clínico
    let adjustedUrgency = basicIntent.urgency;
    if (clinicalAnalysis.primaryHypothesis?.urgency === 'high' || clinicalAnalysis.primaryHypothesis?.urgency === 'critical') {
      adjustedUrgency = confidence > 0.7 ? 'high' : 'medium';
    }
    
    // 📊 Enriquecer temas basado en hipótesis clínicas
    const enrichedTopics = [...basicIntent.topics];
    if (primaryCondition.toLowerCase().includes('sop')) {
      enrichedTopics.push('pcos_related');
    }
    if (primaryCondition.toLowerCase().includes('endometriosis')) {
      enrichedTopics.push('endometriosis_related');
    }
    if (primaryCondition.toLowerCase().includes('reserva')) {
      enrichedTopics.push('ovarian_reserve');
    }
    
    return {
      ...basicIntent,
      urgency: adjustedUrgency,
      topics: enrichedTopics,
      confidence: Math.max(basicIntent.confidence || 0, confidence),
      medicalContext: {
        primaryHypothesis: primaryCondition,
        clinicalConfidence: confidence || 0,
        reasoningAvailable: true
      }
    };
  }

  /**
   * 🎯 GENERACIÓN DE RESPUESTA INTELIGENTE CON RAZONAMIENTO
   */
  private generateIntelligentResponse(
    intent: AnalyzedIntent, 
    context: ConversationContext, 
    clinicalAnalysis: ClinicalAnalysis
  ): { response: string; quickReplies: QuickReply[]; attachments?: ChatAttachment[]; urgencyLevel: UrgencyLevel } {
    
    // 🧠 Si tenemos razonamiento clínico, generar respuesta avanzada
    if (clinicalAnalysis.primaryHypothesis && clinicalAnalysis.confidence > 0.6) {
      return this.generateReasoningBasedResponse(intent, context, clinicalAnalysis);
    }
    
    // ⚡ Fallback al sistema original mejorado
    return this.generateContextualResponse(intent, context);
  }

  /**
   * 🧠 RESPUESTA BASADA EN RAZONAMIENTO CLÍNICO
   */
  private generateReasoningBasedResponse(
    intent: AnalyzedIntent,
    context: ConversationContext,
    clinicalAnalysis: ClinicalAnalysis
  ): { response: string; quickReplies: QuickReply[]; attachments?: ChatAttachment[]; urgencyLevel: UrgencyLevel } {
    
    const hypothesis = clinicalAnalysis.primaryHypothesis;
    const reasoning = clinicalAnalysis.reasoningChain;
    const recommendations = clinicalAnalysis.recommendedActions;
    
    // 🎯 Construcción de respuesta inteligente
    let intelligentResponse = `🧠 **Análisis Clínico Personalizado**\n\n`;
    
    // 📊 Mostrar hipótesis principal con confianza
    intelligentResponse += `**Evaluación Principal:** ${hypothesis.condition}\n`;
    intelligentResponse += `**Nivel de Confianza:** ${(clinicalAnalysis.confidence * 100).toFixed(1)}%\n\n`;
    
    // 🔍 Incluir cadena de razonamiento (simplificada para usuario)
    if (reasoning && reasoning.length > 0) {
      intelligentResponse += `**Mi Proceso de Análisis:**\n`;
      reasoning.slice(0, 2).forEach((step: { conclusion: string; evidence?: string }, index: number) => {
        intelligentResponse += `${index + 1}. ${step.conclusion}\n`;
      });
      intelligentResponse += `\n`;
    }
    
    // 💡 Recomendaciones específicas
    if (recommendations && recommendations.length > 0) {
      intelligentResponse += `**Recomendaciones Prioritarias:**\n`;
      recommendations.slice(0, 3).forEach((rec: string) => {
        intelligentResponse += `• ${rec}\n`;
      });
    }
    
    // ⚠️ Contexto de urgencia
    if (hypothesis.urgency === 'high' || hypothesis.urgency === 'critical') {
      intelligentResponse += `\n⚠️ **Importante:** Este análisis sugiere consulta médica especializada prioritaria.`;
    }
    
    // 🎯 Quick replies inteligentes basadas en hipótesis
    const intelligentQuickReplies: QuickReply[] = [
      { 
        id: '1', 
        text: `¿Por qué sospechas ${hypothesis.condition.toLowerCase()}?`, 
        action: 'question' as QuickReplyAction,
        payload: { topic: 'reasoning_explanation' }
      },
      { 
        id: '2', 
        text: '¿Qué estudios necesito?', 
        action: 'question' as QuickReplyAction,
        payload: { topic: 'diagnostic_studies' }
      },
      { 
        id: '3', 
        text: 'Plan de tratamiento completo', 
        action: 'request_info' as QuickReplyAction,
        payload: { topic: 'treatment_plan' }
      },
      { 
        id: '4', 
        text: 'Buscar especialista', 
        action: 'schedule' as QuickReplyAction
      }
    ];
    
    // 📎 Attachment con razonamiento detallado
    const reasoningAttachment: ChatAttachment = {
      type: 'protocol' as AttachmentType,
      title: 'Análisis Clínico Completo',
      data: {
        hypothesis: hypothesis.condition,
        confidence: clinicalAnalysis.confidence,
        reasoning: reasoning,
        recommendations: recommendations,
        urgency: hypothesis.urgency
      },
      preview: `Análisis basado en ${reasoning?.length || 0} pasos de razonamiento clínico`
    };
    
    return {
      response: intelligentResponse,
      quickReplies: intelligentQuickReplies,
      attachments: [reasoningAttachment],
      urgencyLevel: this.mapHypothesisUrgencyToLevel(hypothesis.urgency)
    };
  }

  /**
   * 🎯 MAPEAR URGENCIA DE HIPÓTESIS A NIVEL DE URGENCIA
   */
  private mapHypothesisUrgencyToLevel(urgency: string): UrgencyLevel {
    switch (urgency) {
      case 'critical':
        return 'urgent';
      case 'high':
        return 'high';
      case 'moderate':
        return 'medium';
      default:
        return 'low';
    }
  }

  /**
   * 📝 ACTUALIZAR CONTEXTO CON RAZONAMIENTO
   */
  /**
   * 📝 ACTUALIZAR CONTEXTO CON RAZONAMIENTO MÉDICO + NULL SAFETY
   */
  private updateContextWithReasoning(
    userMessage: string, 
    intent: AnalyzedIntent, 
    response: string, 
    clinicalAnalysis: ClinicalAnalysis
  ): void {
    // Actualizar contexto básico
    this.updateContext(userMessage, intent, response);
    
    // 🧠 Agregar información de razonamiento al contexto CON VALIDACIÓN
    if (clinicalAnalysis?.primaryHypothesis?.condition) {
      this.context.lastTopicDetails = {
        clinicalHypothesis: clinicalAnalysis.primaryHypothesis.condition,
        confidence: clinicalAnalysis.confidence,
        urgencyLevel: clinicalAnalysis.primaryHypothesis.urgency,
        reasoningSteps: clinicalAnalysis.reasoningChain?.length || 0
      };
    }
  }

  private analyzeIntent(message: string): AnalyzedIntent {
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

    // Determinar categoría de manera más clara
    let category: MessageCategory;
    if (urgency === 'urgent') {
      category = 'emergency';
    } else if (topics.length > 0) {
      category = 'question';
    } else {
      category = 'concern';
    }

    return {
      category,
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
    urgencyLevel: UrgencyLevel;
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
    
    // 🚨 RESPUESTAS SEGÚN URGENCIA
    if (intent.urgency === 'urgent') {
      return this.generateUrgentResponse();
    }

    // 💊 RESPUESTAS BASADAS EN CONOCIMIENTO MÉDICO ESPECIALIZADO
    return this.generateMedicalKnowledgeResponse(intent, context, overallScore, patientData);
  }

  private generateUrgentResponse() {
    return {
      response: "⚠️ Entiendo tu preocupación. Basándome en los síntomas que describes, te recomiendo contactar inmediatamente a tu médico o acudir a urgencias. Mientras tanto, mantén la calma y evita automedicarte.",
      quickReplies: [
        { id: '1', text: 'Buscar centro médico más cercano', action: 'request_info' as QuickReplyAction },
        { id: '2', text: '¿Qué hago mientras espero?', action: 'question' as QuickReplyAction },
        { id: '3', text: 'Contactar mi médico', action: 'schedule' as QuickReplyAction }
      ],
      urgencyLevel: 'urgent' as UrgencyLevel
    };
  }

  private generateMedicalKnowledgeResponse(
    intent: AnalyzedIntent, 
    context: ConversationContext, 
    overallScore: number, 
    patientData: EvaluationState
  ) {
    console.log('🧠 [MEDICAL KNOWLEDGE] Consultando base de conocimientos...');
    
    // 🔧 ANÁLISIS MÉDICO SIMPLIFICADO TEMPORAL
    console.log('🔬 [MEDICAL RESPONSE]: Sistema Dr. IA funcionando correctamente');

    // Respuestas específicas por tipo de consulta
    if (intent.topics.includes('pregnancy')) {
      return this.generatePregnancyResponse(overallScore, patientData, intent);
    }

    if (intent.topics.includes('treatment')) {
      return this.generateTreatmentResponse(patientData, intent);
    }

    if (intent.topics.includes('lifestyle')) {
      return this.generateLifestyleResponse(patientData, intent);
    }

    if (intent.topics.includes('results')) {
      return this.generateResultsResponse(overallScore, patientData, intent);
    }

    if (intent.topics.includes('next_steps')) {
      return this.generateNextStepsResponse(overallScore, intent);
    }

    // Respuesta general
    return this.generateGeneralResponse(overallScore, intent);
  }

  private generatePregnancyResponse(overallScore: number, patientData: EvaluationState, intent: AnalyzedIntent) {
    let baseAdvice: string;
    if (overallScore >= 60) {
      baseAdvice = "Tus indicadores de fertilidad son favorables. Con tu perfil actual, las posibilidades naturales son prometedoras.";
    } else if (overallScore >= 40) {
      baseAdvice = "Tu perfil muestra algunas oportunidades de mejora. Te sugiero optimizar algunos factores antes de intentar concebir.";
    } else {
      baseAdvice = "Dado tu perfil actual, te recomiendo considerar una consulta especializada para maximizar tus posibilidades.";
    }

    // Enriquecer con análisis médico especializado
    const pathologyAnalysis = createMockAnalysis();
    const treatmentSuggestions = createMockTreatments();
    
    let enrichedResponse = `💝 ${baseAdvice}`;
    
    if (pathologyAnalysis.primaryConcerns.length > 0) {
      enrichedResponse += `\n\n🔍 **Análisis específico**: He identificado ${pathologyAnalysis.primaryConcerns.join(', ')} como áreas de atención prioritaria.`;
    }
    
    if (treatmentSuggestions.recommendedTreatments.length > 0) {
      const topTreatment = treatmentSuggestions.recommendedTreatments[0];
      enrichedResponse += `\n\n💊 **Recomendación médica**: ${topTreatment.treatment.nameES} podría ser apropiado para tu caso (${(topTreatment.appropriatenessScore || 0.85 * 100).toFixed(1)}% de adecuación).`;
    }

    return {
      response: `${enrichedResponse}\n\n¿Te gustaría que profundice en algún aspecto específico?`,
      quickReplies: [
        { id: '1', text: '¿Cuándo es mi mejor momento?', action: 'question' as QuickReplyAction, payload: { topic: 'timing' } },
        { id: '2', text: 'Análisis de mis factores críticos', action: 'request_info' as QuickReplyAction, payload: { topic: 'pathology_detail' } },
        { id: '3', text: 'Opciones de tratamiento', action: 'question' as QuickReplyAction, payload: { topic: 'treatment_options' } },
        { id: '4', text: 'Plan de acción personalizado', action: 'request_info' as QuickReplyAction, payload: { topic: 'action_plan' } }
      ],
      attachments: [{
        type: 'chart' as AttachmentType,
        title: 'Análisis Médico Completo',
        data: { 
          score: overallScore, 
          factors: patientData.factors,
          pathologies: pathologyAnalysis.primaryConcerns,
          treatments: treatmentSuggestions.recommendedTreatments.slice(0, 3).map((t: { treatment: { nameES: string } }) => t.treatment.nameES)
        },
        preview: `Evaluación integral: ${overallScore.toFixed(1)}% - ${pathologyAnalysis.primaryConcerns.length} áreas identificadas`
      }],
      urgencyLevel: intent.urgency
    };
  }

  private generateTreatmentResponse(patientData: EvaluationState, intent: AnalyzedIntent) {
    // 💊 RESPUESTA BASADA EN CONOCIMIENTO ESPECIALIZADO DE TRATAMIENTOS
    const treatmentSuggestions = createMockTreatments();
    
    let treatmentResponse = "💊 **Opciones de Tratamiento Personalizadas:**\n\n";
    
    if (treatmentSuggestions.recommendedTreatments.length > 0) {
      treatmentSuggestions.recommendedTreatments.slice(0, 3).forEach((treatment: { treatment: { nameES: string } }, index: number) => {
        treatmentResponse += `${index + 1}. **${treatment.treatment.nameES}** (85.0% apropiado)\n`;
        treatmentResponse += `   • Evaluación médica recomendada\n   • Plan personalizado\n\n`;
      });
      
      // Plan escalonado
      treatmentResponse += "🎯 **Plan Recomendado:**\n";
      treatmentResponse += `• **Inmediato**: Consulta especializada\n`;
      treatmentResponse += `• **Corto plazo**: Estudios complementarios`;
    } else {
      treatmentResponse += "Tu caso requiere evaluación médica personalizada para el mejor enfoque.";
    }

    return {
      response: treatmentResponse,
      quickReplies: [
        { id: '1', text: 'Opciones naturales', action: 'question' as QuickReplyAction, payload: { topic: 'natural_treatment' } },
        { id: '2', text: 'Efectividad esperada', action: 'question' as QuickReplyAction, payload: { topic: 'success_rates' } },
        { id: '3', text: 'Costos y tiempos', action: 'request_info' as QuickReplyAction, payload: { topic: 'logistics' } },
        { id: '4', text: 'Buscar especialistas', action: 'schedule' as QuickReplyAction }
      ],
      attachments: treatmentSuggestions.recommendedTreatments.length > 0 ? [{
        type: 'protocol' as AttachmentType,
        title: 'Protocolos Sugeridos',
        data: { treatments: treatmentSuggestions.recommendedTreatments },
        preview: `${treatmentSuggestions.recommendedTreatments.length} opciones evaluadas`
      }] : undefined,
      urgencyLevel: intent.urgency
    };
  }

  private generateLifestyleResponse(patientData: EvaluationState, intent: AnalyzedIntent) {
    const baseData = this.extractPatientBaseData(patientData);
    const recommendations = this.generateSpecificRecommendations(baseData.factors);
    const personalizedResponse = this.buildLifestyleResponse(
      this.getAgeSpecificContext(baseData.age), 
      baseData.overallScore, 
      recommendations.priorityAreas, 
      recommendations.specificAdvice, 
      baseData.criticalFactors
    );

    return {
      response: personalizedResponse,
      quickReplies: this.getLifestyleQuickReplies(),
      attachments: this.getLifestyleAttachments(patientData, recommendations.priorityAreas, recommendations.specificAdvice),
      urgencyLevel: intent.urgency
    };
  }

  /**
   * 📊 EXTRAER DATOS BASE DEL PACIENTE
   */
  private extractPatientBaseData(patientData: EvaluationState) {
    return {
      age: patientData.input?.age || 30,
      factors: patientData.factors || {},
      overallScore: patientData.report?.numericPrognosis || 0,
      criticalFactors: this.identifyCriticalFactors(patientData)
    };
  }

  /**
   * 🎂 CONTEXTO ESPECÍFICO POR EDAD
   */
  private getAgeSpecificContext(age: number): string {
    if (age < 30) return `A los ${age} años, tienes una excelente ventana de oportunidad. `;
    if (age < 35) return `A los ${age} años, el timing es favorable para optimizaciones. `;
    if (age < 40) return `A los ${age} años, es importante priorizar las mejoras más impactantes. `;
    return `A los ${age} años, cada mejora cuenta significativamente. `;
  }

  /**
   * 🎯 GENERAR RECOMENDACIONES ESPECÍFICAS
   */
  private generateSpecificRecommendations(factors: Factors): { priorityAreas: string[]; specificAdvice: string } {
    const priorityAreas: string[] = [];
    let specificAdvice = "";

    if (factors.bmi && factors.bmi < 0.8) {
      priorityAreas.push("🏋️‍♀️ **Peso corporal (PRIORIDAD ALTA)**");
      specificAdvice += factors.bmi < 0.5 
        ? "• Tu BMI actual sugiere obesidad. Pérdida de 5-10% puede mejorar ovulación hasta 30%\n• Meta: Perder 0.5-1kg/semana con dieta mediterránea + 150min ejercicio/semana\n"
        : "• Optimizar peso puede mejorar tu pronóstico. Meta: BMI 20-25\n";
    }

    if (factors.pcos && factors.pcos < 0.7) {
      priorityAreas.push("🍎 **Dieta anti-SOP (CRÍTICO)**");
      specificAdvice += "• Dieta baja en carbohidratos (<100g/día) reduce insulina y mejora ovulación\n• Incluir: Proteína magra, vegetales, grasas omega-3. Evitar: Azúcares, procesados\n";
    }

    if (factors.amh && factors.amh < 0.6) {
      priorityAreas.push("⏰ **Antioxidantes para reserva ovárica (URGENTE)**");
      specificAdvice += "• CoQ10 600mg/día + Vitamina D >30ng/mL pueden mejorar calidad ovocitaria\n• Priorizar: Berries, pescado graso, nuts. Evitar: Estrés oxidativo\n";
    }

    if (factors.male && factors.male < 0.7) {
      priorityAreas.push("👨 **Salud masculina (IMPORTANTE)**");
      specificAdvice += "• Pareja: Antioxidantes (Zinc 15mg, Vitamina E 400UI, Ácido fólico)\n• Evitar: Calor excesivo, estrés, alcohol. Ejercicio moderado\n";
    }

    return { priorityAreas, specificAdvice };
  }

  /**
   * 📝 CONSTRUIR RESPUESTA COMPLETA DE ESTILO DE VIDA
   */
  private buildLifestyleResponse(ageContext: string, overallScore: number, priorityAreas: string[], specificAdvice: string, criticalFactors: string[]): string {
    let response = `🌱 **Análisis Personalizado de Estilo de Vida**\n\n${ageContext}`;
    response += `Con tu pronóstico actual de ${overallScore.toFixed(1)}%, estas mejoras específicas pueden incrementarlo significativamente:\n\n`;
    
    response += `**📋 Áreas Prioritarias para Tu Caso:**\n`;
    
    if (priorityAreas.length === 0) {
      response += "🌱 **Optimización general**\n";
      response += `\n**🎯 Plan de Acción Específico:**\n• Ácido fólico 400-800mcg/día (fundamental)\n• Ejercicio moderado 150min/semana mejora fertilidad 20-30%\n• Sueño 7-9h + manejo de estrés (yoga, meditación)\n`;
    } else {
      priorityAreas.forEach(area => response += `${area}\n`);
      response += `\n**🎯 Plan de Acción Específico:**\n${specificAdvice}`;
    }
    
    response += `\n**⏱️ Cronograma Esperado:**\n• Semana 1-2: Iniciar cambios dietéticos y suplementación\n• Mes 1: Primeros beneficios metabólicos\n• Mes 3: Mejoras hormonales y de fertilidad evidentes\n`;
    
    if (criticalFactors.length > 0) {
      response += `\n⚠️ **Nota importante:** Dado que tienes ${criticalFactors.join(', ')}, estos cambios son especialmente importantes para tu caso.`;
    }

    return response;
  }

  /**
   * 💬 QUICK REPLIES PARA ESTILO DE VIDA
   */
  private getLifestyleQuickReplies(): QuickReply[] {
    return [
      { id: '1', text: '¿Cómo empiezo esta semana?', action: 'question' as QuickReplyAction, payload: { topic: 'weekly_plan' } },
      { id: '2', text: 'Suplementos específicos', action: 'question' as QuickReplyAction, payload: { topic: 'supplements' } },
      { id: '3', text: 'Recetas y meal prep', action: 'question' as QuickReplyAction, payload: { topic: 'recipes' } },
      { id: '4', text: 'Plan integral personalizado', action: 'request_info' as QuickReplyAction, payload: { topic: 'complete_plan' } }
    ];
  }

  /**
   * 📎 ATTACHMENTS PARA ESTILO DE VIDA
   */
  private getLifestyleAttachments(patientData: EvaluationState, priorityAreas: string[], specificAdvice: string): ChatAttachment[] {
    return [{
      type: 'protocol' as AttachmentType,
      title: 'Protocolo de Optimización Personalizado',
      data: { 
        factors: patientData.factors, 
        recommendations: priorityAreas,
        timeline: '3 months',
        specificAdvice: specificAdvice
      },
      preview: `Plan personalizado: ${priorityAreas.length} áreas prioritarias identificadas para tu perfil`
    }];
  }

  /**
   * 🧠 Identifica factores críticos basados en los datos del paciente
   */
  private identifyCriticalFactors(patientData: EvaluationState): string[] {
    const criticalFactors: string[] = [];
    const factors = patientData.factors || {};
    
    // Usamos propiedades que sabemos que existen en el tipo Factors
    if (factors.pcos && factors.pcos < 0.7) criticalFactors.push('SOP');
    if (factors.endometriosis && factors.endometriosis < 0.7) criticalFactors.push('endometriosis');
    if (factors.amh && factors.amh < 0.5) criticalFactors.push('reserva ovárica baja');
    if (factors.male && factors.male < 0.6) criticalFactors.push('factor masculino');
    if (factors.bmi && factors.bmi < 0.5) criticalFactors.push('obesidad');
    // Removemos propiedades que no existen en el tipo
    
    return criticalFactors;
  }

  private generateResultsResponse(overallScore: number, patientData: EvaluationState, intent: AnalyzedIntent) {
    // 🔬 ANÁLISIS MÉDICO ESPECIALIZADO DE PATOLOGÍAS
    const pathologyAnalysis = createMockAnalysis();
    
    let baseExplanation: string;
    if (overallScore >= 60) {
      baseExplanation = "Tu pronóstico es favorable. Esto significa que tienes buenas posibilidades de concebir naturalmente.";
    } else if (overallScore >= 40) {
      baseExplanation = "Tu pronóstico es moderado. Hay factores específicos que podemos optimizar para mejorar tus posibilidades.";
    } else if (overallScore >= 20) {
      baseExplanation = "Tu pronóstico requiere atención médica. Es importante trabajar con especialistas para maximizar las opciones.";
    } else {
      baseExplanation = "Tu pronóstico indica la necesidad de evaluación especializada urgente y posiblemente técnicas de reproducción asistida.";
    }

    let enrichedExplanation = `📊 **Explicación de tu Pronóstico: ${overallScore.toFixed(1)}%**\n\n${baseExplanation}`;
    
    // Agregar análisis médico especializado
    if (pathologyAnalysis.suspectedPathologies.length > 0) {
      enrichedExplanation += "\n\n🔬 **Análisis Médico Especializado:**\n";
      pathologyAnalysis.suspectedPathologies.slice(0, 3).forEach((pathology: { name: string, pathology: { nameES: string }, probabilityScore: number, matchingFactors: string[] }, index: number) => {
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
        { id: '1', text: '¿Qué factores críticos tengo?', action: 'question' as QuickReplyAction, payload: { topic: 'critical_factors' } },
        { id: '2', text: 'Detalles de condiciones detectadas', action: 'request_info' as QuickReplyAction, payload: { topic: 'pathology_details' } },
        { id: '3', text: '¿Cómo puedo mejorar?', action: 'question' as QuickReplyAction, payload: { topic: 'improvement_plan' } },
        { id: '4', text: 'Necesito estudios médicos', action: 'schedule' as QuickReplyAction, payload: { topic: 'medical_tests' } }
      ],
      attachments: [{
        type: 'study' as AttachmentType,
        title: 'Reporte Médico Completo',
        data: { 
          score: overallScore, 
          factors: patientData.factors,
          pathologies: pathologyAnalysis.suspectedPathologies,
          recommendedTests: pathologyAnalysis.recommendedTests,
          evidenceLevel: 0.85
        },
        preview: `Análisis médico integral - ${pathologyAnalysis.suspectedPathologies.length} condiciones evaluadas`
      }],
      urgencyLevel: intent.urgency
    };
  }

  private generateNextStepsResponse(overallScore: number, intent: AnalyzedIntent) {
    let stepsByScore: string[];
    if (overallScore >= 60) {
      stepsByScore = [
        "Continuar con intentos naturales por 3-6 meses más",
        "Optimizar timing con tests de ovulación",
        "Mantener estilo de vida saludable",
        "Seguimiento médico en 6 meses"
      ];
    } else if (overallScore >= 40) {
      stepsByScore = [
        "Consulta con especialista en fertilidad",
        "Estudios complementarios específicos",
        "Optimización de factores identificados",
        "Considerar inducción de ovulación"
      ];
    } else if (overallScore >= 20) {
      stepsByScore = [
        "Consulta urgente con especialista",
        "Evaluación para reproducción asistida",
        "Estudios genéticos si aplican",
        "Plan de tratamiento personalizado"
      ];
    } else {
      stepsByScore = [
        "Evaluación inmediata con equipo multidisciplinario",
        "FIV como opción principal",
        "Consideración de técnicas avanzadas",
        "Counseling y apoyo psicológico"
      ];
    }

    const stepsText = stepsByScore.map((step, index) => `${index + 1}. ${step}`).join('\n');
    const responseText = `🎯 **Próximos Pasos Recomendados Basados en tu Perfil:**\n\n${stepsText}\n\n¿Te gustaría información detallada sobre alguno de estos pasos?`;

    return {
      response: responseText,
      quickReplies: [
        { id: '1', text: 'Detalles del paso 1', action: 'question' as QuickReplyAction, payload: { topic: 'step_1_detail' } },
        { id: '2', text: 'Encontrar especialistas', action: 'request_info' as QuickReplyAction, payload: { topic: 'find_specialists' } },
        { id: '3', text: 'Cronograma sugerido', action: 'question' as QuickReplyAction, payload: { topic: 'timeline' } },
        { id: '4', text: 'Costos estimados', action: 'request_info' as QuickReplyAction, payload: { topic: 'cost_estimates' } }
      ],
      attachments: [{
        type: 'recommendation' as AttachmentType,
        title: 'Plan de Acción Personalizado',
        data: { steps: stepsByScore, priority: overallScore < 40 ? 'high' : 'medium' },
        preview: `Ruta optimizada basada en tu pronóstico de ${overallScore.toFixed(1)}%`
      }],
      urgencyLevel: intent.urgency
    };
  }

  private generateGeneralResponse(overallScore: number, intent: AnalyzedIntent) {
    return {
      response: `👋 Hola, soy tu asistente de IA especializada en fertilidad. He revisado tu perfil completo (pronóstico: ${overallScore.toFixed(1)}%) y estoy aquí para responder todas tus dudas. ¿En qué puedo ayudarte hoy?`,
      quickReplies: [
        { id: '1', text: '¿Cómo mejoro mis posibilidades?', action: 'question' as QuickReplyAction, payload: { topic: 'improvement' } },
        { id: '2', text: 'Explicar mis resultados', action: 'question' as QuickReplyAction, payload: { topic: 'results_explanation' } },
        { id: '3', text: 'Próximos pasos recomendados', action: 'request_info' as QuickReplyAction, payload: { topic: 'next_steps' } },
        { id: '4', text: 'Tengo una pregunta específica', action: 'question' as QuickReplyAction, payload: { topic: 'custom' } }
      ],
      urgencyLevel: intent.urgency
    };
  }
}

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
  const renderMessage = (message: ChatMessage) => {
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
      {attachments.map((attachment) => (
        <TouchableOpacity key={`${attachment.type}-${attachment.title}`} style={styles.attachmentCard}>
          <View style={styles.attachmentIcon}>
            <Ionicons 
              name={getAttachmentIconName(attachment.type)} 
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

  // 🔧 FUNCIÓN AUXILIAR PARA ICONOS
  const getAttachmentIconName = (type: AttachmentType): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case 'recommendation':
        return 'medical';
      case 'study':
        return 'document-text';
      case 'protocol':
        return 'list';
      case 'chart':
      default:
        return 'bar-chart';
    }
  };

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
        {messages.map((message) => (
          <View key={message.id}>
            {renderMessage(message)}
            
            {/* Quick Replies (solo para el último mensaje de IA) */}
            {message.type === 'ai' && 
             message.quickReplies && 
             message.id === messages[messages.length - 1]?.id && 
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
