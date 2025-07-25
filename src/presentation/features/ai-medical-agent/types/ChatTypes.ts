/**
 * 🧠 NEURAL MEDICAL CHAT TYPES V13.0
 * Definiciones de tipos para el sistema de chat médico inteligente
 */

import { EvaluationState } from '@/core/domain/models';
import { SuperintellignentAnalysisResult, NeuralMedicalAISystem } from '../../../../../ai-medical-agent/core/neural-engines/NeuralMedicalAISystem';

// 🎯 TIPOS DE URGENCIA Y ACCIONES
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'urgent';
export type QuickReplyAction = 'question' | 'request_info' | 'schedule' | 'clarification';
export type AttachmentType = 'recommendation' | 'study' | 'protocol' | 'chart';
export type MessageCategory = 'question' | 'concern' | 'symptom' | 'request' | 'emergency';

// 🧠 TIPOS PARA ANÁLISIS MÉDICO NEURAL V13.0
export interface MedicalAnalysisResult {
  primaryConcerns: string[];
  suspectedPathologies: string[];
  recommendedTests: string[];
  confidenceScore: number;
}

export interface TreatmentSuggestions {
  recommendedTreatments: Array<{
    name: string;
    priority: string;
    successRate: number;
    timeframe: string;
  }>;
  urgencyLevel: string;
}

// 🔬 ANÁLISIS CLÍNICO
export interface ClinicalAnalysis {
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

// 💬 MENSAJES Y CHAT
export interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  message: string;
  timestamp: Date;
  isTyping?: boolean;
  quickReplies?: QuickReply[];
  attachments?: ChatAttachment[];
}

export interface QuickReply {
  id: string;
  text: string;
  action: QuickReplyAction;
  payload?: unknown;
}

export interface ChatAttachment {
  type: AttachmentType;
  title: string;
  data: unknown;
  preview?: string;
}

// 🧠 INTENCIÓN ANALIZADA
export interface AnalyzedIntent {
  category: MessageCategory;
  topics: string[];
  urgency: UrgencyLevel;
  confidence?: number;
  originalMessage?: string;
  medicalContext?: {
    primaryHypothesis?: string;
    clinicalConfidence?: number;
    reasoningAvailable?: boolean;
  };
}

// 🗣️ CONTEXTO CONVERSACIONAL
export interface ConversationContext {
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
    clinicalHypothesis?: string;
    confidence?: number;
    urgencyLevel?: string;
    reasoningSteps?: number;
  };
}

// 🎯 PROPS DEL COMPONENTE
export interface AIChatProps {
  evaluation: EvaluationState;
  initialTopic?: string;
  onRecommendationGenerated?: (recommendation: unknown) => void;
  neuralSystem?: NeuralMedicalAISystem;
  neuralAnalysis?: SuperintellignentAnalysisResult;
}

// 🎨 TEMA
export interface ThemeInterface {
  primary: string;
  secondary: string;
  background: string;
  border?: string;
  textSecondary?: string;
}

// 🧠 RESPUESTA NEURAL MEJORADA
export interface NeuralEnhancedResponse {
  response: string;
  quickReplies: QuickReply[];
  attachments?: ChatAttachment[];
  urgencyLevel: UrgencyLevel;
  neuralInsights?: string[];
}
