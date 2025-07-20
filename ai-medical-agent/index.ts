/**
 * 🤖 AI MEDICAL AGENT - ENTRADA PRINCIPAL UNIFICADA v3.0
 * Sistema de inteligencia artificial médica de nueva generación
 * Arquitectura limpia, escalable y profesional
 */

// ====================================================================
// 📦 IMPORTS DEL SISTEMA UNIFICADO
// ====================================================================

// Sistema principal unificado
import UnifiedMedicalAI, { 
  createMedicalAI,
  quickAnalysis,
  quickConsultation,
  type UnifiedMedicalAIConfig
} from './UnifiedMedicalAI';

// Tipos centralizados y unificados
import type {
  UnifiedUserInput,
  UnifiedClinicalAnalysis,
  UnifiedSuccessRate,
  UnifiedMedicalResponse,
  UnifiedConversationContext,
  UnifiedSystemHealth,
  UnifiedAgentConfig,
  UnifiedOperationResult,
  ComprehensiveAnalysisResult,
  UnifiedAlert,
  UnifiedQualityMetrics
} from './core/types/UnifiedTypes';

// Re-exportar tipos con nombres simplificados
export type UserInput = UnifiedUserInput;
export type ClinicalAnalysis = UnifiedClinicalAnalysis;
export type SuccessRate = UnifiedSuccessRate;
export type MedicalResponse = UnifiedMedicalResponse;
export type ConversationContext = UnifiedConversationContext;
export type SystemHealth = UnifiedSystemHealth;
export type AgentConfig = UnifiedAgentConfig;
export type OperationResult<T = unknown> = UnifiedOperationResult<T>;

// Re-exportar los tipos unificados también
export type {
  UnifiedUserInput,
  UnifiedClinicalAnalysis,
  UnifiedSuccessRate,
  UnifiedMedicalResponse,
  UnifiedConversationContext,
  UnifiedSystemHealth,
  UnifiedAgentConfig,
  UnifiedOperationResult,
  ComprehensiveAnalysisResult
};

// Orquestador central
export { default as MedicalOrchestrator } from './core/orchestrator/MedicalOrchestrator';

// Componentes del sistema unificado
export { default as IntelligentCache } from './core/orchestrator/IntelligentCache';
export { default as RobustValidator } from './core/orchestrator/RobustValidator';
export { default as PerformanceMonitor } from './core/orchestrator/PerformanceMonitor';

// Nota: Los motores especializados serán exportados cuando se actualicen para el nuevo sistema

// ====================================================================
// 🎯 API PRINCIPAL UNIFICADA
// ====================================================================

/**
 * 🚀 Función principal para crear agente médico unificado
 * Nueva interfaz que reemplaza createMedicalAgent
 */
export function createMedicalAgent(config?: UnifiedMedicalAIConfig): UnifiedMedicalAI {
  console.log('🆕 Usando UnifiedMedicalAI v3.0 - Sistema de nueva generación');
  return createMedicalAI(config);
}

/**
 * 💡 Función de conveniencia para análisis médico completo
 * Versión mejorada con análisis integral
 */
export async function quickMedicalAnalysis(
  userInput: UserInput,
  config?: UnifiedMedicalAIConfig
): Promise<{
  analysis: ClinicalAnalysis;
  successRates: SuccessRate[];
  recommendations: string[];
  confidence: number;
  alerts: UnifiedAlert[];
  qualityMetrics: UnifiedQualityMetrics;
}> {
  
  console.log('🔬 Ejecutando análisis médico rápido con sistema unificado...');
  
  const result = await quickAnalysis(userInput, config);
  
  if (!result.success) {
    throw new Error(`Error en análisis: ${result.error?.message}`);
  }
  
  const data = result.data!;
  
  return {
    analysis: data.clinicalAnalysis,
    successRates: data.successRates,
    recommendations: data.primaryRecommendations,
    confidence: data.qualityMetrics.overallConfidence,
    alerts: [...data.alerts.critical, ...data.alerts.warnings],
    qualityMetrics: data.qualityMetrics
  };
}

/**
 * 💬 Función de conveniencia para consulta médica
 * Sistema de chat médico inteligente
 */
export async function quickMedicalConsultation(
  query: string,
  userInput?: UserInput,
  config?: UnifiedMedicalAIConfig
): Promise<{
  response: string;
  suggestions: string[];
  followUpQuestions: string[];
  confidence: number;
}> {
  
  console.log('💬 Ejecutando consulta médica rápida...');
  
  const result = await quickConsultation(query, userInput, config);
  
  if (!result.success) {
    throw new Error(`Error en consulta: ${result.error?.message}`);
  }
  
  const data = result.data!;
  
  return {
    response: data.primaryInfo,
    suggestions: data.recommendations.immediate,
    followUpQuestions: data.followUpQuestions,
    confidence: data.confidenceLevel
  };
}

// ====================================================================
// 🎯 EXPORTS PRINCIPALES
// ====================================================================

/**
 * 🌟 Export principal del sistema unificado
 */
export default UnifiedMedicalAI;

/**
 * 🔗 Exports de funciones de conveniencia
 */
export {
  createMedicalAI,
  quickAnalysis,
  quickConsultation,
  type UnifiedMedicalAIConfig
};

// ====================================================================
// 🔧 INFORMACIÓN DEL SISTEMA Y CONSTANTES
// ====================================================================

export const AI_MEDICAL_VERSION = '3.0.0-UNIFIED';
export const SYSTEM_NAME = 'UnifiedMedicalAI';
export const SUPPORTED_LANGUAGES = ['es', 'en'];
export const SUPPORTED_SPECIALTIES = ['fertility', 'general', 'reproductive'];

export const DEFAULT_CONFIG: UnifiedMedicalAIConfig = {
  version: AI_MEDICAL_VERSION,
  languagePreference: 'es',
  medicalSpecialty: 'fertility',
  evidenceLevel: 'standard',
  empathyLevel: 'balanced',
  enableAdvancedAnalytics: true,
  enableRealTimeMonitoring: true,
  enableAutoOptimization: true
};

/**
 * 📊 Información del sistema
 */
export const SYSTEM_INFO = {
  version: AI_MEDICAL_VERSION,
  name: SYSTEM_NAME,
  description: 'Sistema AI Médico Unificado de Nueva Generación',
  capabilities: [
    'Análisis Clínico Completo',
    'Predicción de Éxito Personalizada',
    'Conversación Médica Inteligente',
    'Validación Robusta de Datos',
    'Cache Inteligente con Context-Awareness',
    'Monitoreo de Performance en Tiempo Real',
    'Alertas Médicas Automáticas',
    'Arquitectura Escalable y Modular',
    'Soporte Multi-idioma',
    'Base de Evidencia Actualizada'
  ],
  architecture: {
    pattern: 'Unified Orchestrator with Specialized Engines',
    caching: 'Intelligent Medical Context-Aware',
    validation: 'Multi-layer Robust Validation',
    monitoring: 'Real-time Performance & Health',
    scalability: 'Modular and Extensible'
  }
};

// ====================================================================
// 🎉 SISTEMA COMPLETAMENTE ACTUALIZADO
// ====================================================================

console.log(`🚀 ${SYSTEM_NAME} v${AI_MEDICAL_VERSION} - Sistema cargado y optimizado`);
console.log('✨ Arquitectura unificada implementada exitosamente');

// ====================================================================
// 💾 COMPATIBILIDAD CON VERSIONES ANTERIORES
// ====================================================================

/**
 * 🔄 Función legacy para compatibilidad
 * Mantiene compatibilidad con código existente mientras migra al sistema unificado
 */
export function createOptimizedMedicalAgent(config?: Partial<UnifiedAgentConfig>) {
  console.warn('⚠️  createOptimizedMedicalAgent está deprecated. Use createMedicalAgent');
  return createMedicalAgent(config);
}

/**
 * 🔄 Clase legacy para compatibilidad
 */
export class OptimizedMedicalAIAgent {
  private readonly unifiedAI: UnifiedMedicalAI;
  
  constructor(config?: Partial<UnifiedAgentConfig>) {
    console.warn('⚠️  OptimizedMedicalAIAgent está deprecated. Use UnifiedMedicalAI');
    this.unifiedAI = createMedicalAI(config);
  }
  
  async performClinicalAnalysis(userInput: UserInput) {
    return this.unifiedAI.analyze(userInput);
  }
  
  async calculateSuccessRates(userInput: UserInput) {
    const result = await this.unifiedAI.predict(userInput);
    return {
      success: result.success,
      data: result.data,
      error: result.error
    };
  }
  
  async startMedicalConversation(query: string, userInput?: UserInput) {
    return this.unifiedAI.chat(query, { userInput });
  }
  
  getSystemHealth() {
    return this.unifiedAI.getSystemHealth();
  }
}

// Export legacy para compatibilidad
export { OptimizedMedicalAIAgent as MasterMedicalAIAgent };

/**
 * 🎯 Función legacy para obtener agente optimizado
 */
export function getOptimizedMedicalAgent(config?: Partial<UnifiedAgentConfig>): OptimizedMedicalAIAgent {
  console.warn('⚠️  getOptimizedMedicalAgent está deprecated. Use createMedicalAgent');
  return new OptimizedMedicalAIAgent(config);
}
