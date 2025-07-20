/**
 * 🤖 AGENTE AI MÉDICO MAESTRO - VERSION 3.0 OPTIMIZADA
 * Sistema limpio, eficiente y profesional de IA médica
 * Arquitectura evolutiva sin regresiones
 */

import { 
  UserInput, 
  ClinicalAnalysis, 
  SuccessRate, 
  MedicalResponse, 
  OperationResult, 
  SessionState, 
  AgentConfig, 
  PerformanceMetrics 
} from './core/types';

import { SimplifiedClinicalEngine } from './core/engines/SimplifiedClinicalEngine';
import { OptimizedSuccessCalculator } from './core/engines/OptimizedSuccessCalculator';
import { IntelligentConversationEngine } from './core/engines/IntelligentConversationEngine';

// Instancias singleton de los motores
const clinicalEngine = SimplifiedClinicalEngine.getInstance();
const successCalculator = OptimizedSuccessCalculator.getInstance();
const conversationEngine = IntelligentConversationEngine.getInstance();

/**
 * 🧠 CLASE PRINCIPAL DEL AGENTE AI MÉDICO MAESTRO V3.0
 * Arquitectura limpia, escalable y altamente optimizada
 */
export class OptimizedMedicalAIAgent {
  private readonly sessionState: SessionState;
  private readonly config: AgentConfig;
  private performanceMetrics: PerformanceMetrics[] = [];

  constructor(config?: Partial<AgentConfig>) {
    this.sessionState = {
      sessionId: this.generateSessionId(),
      startTime: new Date(),
      interactions: 0,
      currentContext: 'consultation',
      lastInteraction: new Date()
    };

    this.config = {
      version: '3.0 Optimized',
      languagePreference: 'es',
      medicalSpecialty: 'fertility',
      evidenceLevel: 'standard',
      empathyLevel: 'balanced',
      ...config
    };

    console.log(`🤖 Dr. IA Fertilitas V3.0 iniciado - Sesión: ${this.sessionState.sessionId}`);
  }

  /**
   * 🎯 ANÁLISIS CLÍNICO COMPLETO
   * Método principal para evaluación médica integral
   */
  public async performClinicalAnalysis(
    userInput: UserInput
  ): Promise<OperationResult<{
    clinicalAnalysis: ClinicalAnalysis;
    successRates: SuccessRate[];
    recommendations: string[];
    metrics: PerformanceMetrics;
  }>> {
    
    const startTime = performance.now();
    console.log('🔬 Iniciando análisis clínico completo...');

    try {
      // 1. Análisis clínico principal
      const clinicalResult = await clinicalEngine.analyzeClinicalCase(userInput);
      if (!clinicalResult.success) {
        return {
          success: false,
          error: clinicalResult.error
        };
      }

      // 2. Cálculo de tasas de éxito
      const successResult = await successCalculator.calculateSuccessRates(
        userInput, 
        clinicalResult.data
      );
      if (!successResult.success) {
        return {
          success: false,
          error: successResult.error
        };
      }

      // 3. Generar recomendaciones
      const recommendations = this.generateActionableRecommendations(
        clinicalResult.data!,
        successResult.data!,
        userInput
      );

      // 4. Métricas de rendimiento
      const processingTime = performance.now() - startTime;
      const metrics: PerformanceMetrics = {
        responseTimeMs: processingTime,
        confidenceScore: clinicalResult.data!.primaryDiagnosis.confidence,
        evidenceQuality: clinicalResult.data!.primaryDiagnosis.evidenceLevel,
        userSatisfactionPredicted: this.predictUserSatisfaction(clinicalResult.data!, successResult.data!)
      };

      // 5. Actualizar estado de sesión
      this.updateSessionState();
      this.recordPerformanceMetrics(metrics);

      console.log(`✅ Análisis completado en ${processingTime.toFixed(2)}ms`);
      console.log(`🎯 Diagnóstico: ${clinicalResult.data!.primaryDiagnosis.pathology}`);
      console.log(`📊 Mejor tratamiento: ${successResult.data![0].technique}`);

      return {
        success: true,
        data: {
          clinicalAnalysis: clinicalResult.data!,
          successRates: successResult.data!,
          recommendations,
          metrics
        },
        metadata: {
          processingTime,
          confidence: metrics.confidenceScore,
          evidenceLevel: metrics.evidenceQuality
        }
      };

    } catch (error) {
      console.error('❌ Error en análisis clínico:', error);
      return {
        success: false,
        error: {
          code: 'CLINICAL_ANALYSIS_ERROR',
          message: `Error en análisis clínico: ${error}`
        }
      };
    }
  }

  /**
   * 💬 CONVERSACIÓN MÉDICA INTELIGENTE
   * Sistema optimizado de diálogo médico
   */
  public async startMedicalConversation(
    userQuery: string,
    userInput: UserInput,
    conversationType: 'diagnostic' | 'therapeutic' | 'prognostic' | 'educational' | 'supportive' = 'diagnostic'
  ): Promise<OperationResult<{
    response: MedicalResponse;
    context: {
      sessionId: string;
      interactionNumber: number;
      conversationFlow: string;
    };
    suggestions: string[];
  }>> {

    const startTime = performance.now();
    console.log(`💬 Iniciando conversación médica: ${conversationType}`);

    try {
      // 1. Obtener contexto clínico si es necesario
      let clinicalContext: ClinicalAnalysis | undefined;
      let successContext: SuccessRate[] | undefined;

      if (['diagnostic', 'therapeutic', 'prognostic'].includes(conversationType)) {
        const clinicalResult = await clinicalEngine.analyzeClinicalCase(userInput);
        if (clinicalResult.success) {
          clinicalContext = clinicalResult.data;
          
          if (conversationType === 'prognostic') {
            const successResult = await successCalculator.calculateSuccessRates(userInput, clinicalContext);
            if (successResult.success) {
              successContext = successResult.data;
            }
          }
        }
      }

      // 2. Generar respuesta conversacional
      const conversationResult = await conversationEngine.generateResponse(
        userQuery,
        userInput,
        {
          clinicalAnalysis: clinicalContext,
          successRates: successContext,
          conversationType
        }
      );

      if (!conversationResult.success) {
        return {
          success: false,
          error: conversationResult.error
        };
      }

      // 3. Actualizar métricas
      const processingTime = performance.now() - startTime;
      this.updateSessionState();

      const context = {
        sessionId: this.sessionState.sessionId,
        interactionNumber: this.sessionState.interactions,
        conversationFlow: this.determineConversationFlow(conversationType)
      };

      const suggestions = this.generateConversationSuggestions(conversationType, conversationResult.data!);

      console.log(`✅ Conversación generada en ${processingTime.toFixed(2)}ms`);

      return {
        success: true,
        data: {
          response: conversationResult.data!,
          context,
          suggestions
        },
        metadata: {
          processingTime,
          confidence: conversationResult.data!.confidenceLevel,
          evidenceLevel: 'A'
        }
      };

    } catch (error) {
      console.error('❌ Error en conversación:', error);
      return {
        success: false,
        error: {
          code: 'CONVERSATION_ERROR',
          message: `Error en conversación médica: ${error}`
        }
      };
    }
  }

  /**
   * 🔮 PREDICCIÓN DE ÉXITO PERSONALIZADA
   * Cálculo rápido y optimizado de probabilidades
   */
  public async calculatePersonalizedOutcomes(
    userInput: UserInput
  ): Promise<OperationResult<{
    successRates: SuccessRate[];
    recommendations: {
      primary: string;
      alternatives: string[];
      timeline: string;
    };
    riskFactors: {
      modifiable: string[];
      nonModifiable: string[];
      actionPlan: string[];
    };
  }>> {

    const startTime = performance.now();
    console.log('🔮 Calculando resultados personalizados...');

    try {
      // 1. Análisis clínico básico
      const clinicalResult = await clinicalEngine.analyzeClinicalCase(userInput);
      if (!clinicalResult.success) {
        return {
          success: false,
          error: clinicalResult.error
        };
      }

      // 2. Cálculo de probabilidades
      const successResult = await successCalculator.calculateSuccessRates(
        userInput,
        clinicalResult.data
      );
      if (!successResult.success) {
        return {
          success: false,
          error: successResult.error
        };
      }

      // 3. Generar recomendaciones personalizadas
      const recommendations = this.generatePersonalizedRecommendations(
        successResult.data!,
        clinicalResult.data!,
        userInput
      );

      // 4. Análisis de factores de riesgo
      const riskFactors = this.analyzeRiskFactors(userInput, clinicalResult.data!);

      const processingTime = performance.now() - startTime;
      this.updateSessionState();

      console.log(`✅ Resultados calculados en ${processingTime.toFixed(2)}ms`);

      return {
        success: true,
        data: {
          successRates: successResult.data!,
          recommendations,
          riskFactors
        },
        metadata: {
          processingTime,
          confidence: 80,
          evidenceLevel: 'A'
        }
      };

    } catch (error) {
      console.error('❌ Error calculando resultados:', error);
      return {
        success: false,
        error: {
          code: 'PREDICTION_ERROR',
          message: `Error en predicción personalizada: ${error}`
        }
      };
    }
  }

  /**
   * 📊 INFORMACIÓN DEL SISTEMA
   */
  public getSystemInfo() {
    return {
      version: this.config.version,
      sessionId: this.sessionState.sessionId,
      uptime: Date.now() - this.sessionState.startTime.getTime(),
      totalInteractions: this.sessionState.interactions,
      averageResponseTime: this.calculateAverageResponseTime(),
      capabilities: [
        'Análisis Clínico Avanzado',
        'Predicción Probabilística',
        'Conversación Inteligente',
        'Recomendaciones Personalizadas',
        'Apoyo Emocional'
      ],
      config: this.config
    };
  }

  /**
   * 🔧 MÉTODOS PRIVADOS DE APOYO
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  }

  private updateSessionState(): void {
    this.sessionState.interactions++;
    this.sessionState.lastInteraction = new Date();
  }

  private recordPerformanceMetrics(metrics: PerformanceMetrics): void {
    this.performanceMetrics.push(metrics);
    // Mantener solo las últimas 100 métricas
    if (this.performanceMetrics.length > 100) {
      this.performanceMetrics = this.performanceMetrics.slice(-100);
    }
  }

  private calculateAverageResponseTime(): number {
    if (this.performanceMetrics.length === 0) return 0;
    const total = this.performanceMetrics.reduce((sum, m) => sum + m.responseTimeMs, 0);
    return total / this.performanceMetrics.length;
  }

  private generateActionableRecommendations(
    clinicalAnalysis: ClinicalAnalysis,
    successRates: SuccessRate[],
    userInput: UserInput
  ): string[] {
    const recommendations: string[] = [];
    
    // Urgencia basada en edad y riesgo
    if (userInput.age >= 38 || clinicalAnalysis.riskStratification.level === 'critical') {
      recommendations.push('🚨 PRIORITARIO: Consulta especialista en 1-2 semanas');
    } else if (userInput.age >= 35 || clinicalAnalysis.riskStratification.level === 'high') {
      recommendations.push('⚠️ URGENTE: Programa especialista en 2-4 semanas');
    } else {
      recommendations.push('📅 RUTINA: Consulta especialista en 4-8 semanas');
    }

    // Recomendación de tratamiento principal
    if (successRates.length > 0) {
      recommendations.push(`🎯 TRATAMIENTO: ${successRates[0].technique} - ${successRates[0].recommendation}`);
    }

    // Optimizaciones lifestyle
    recommendations.push('💊 Iniciar ácido fólico 400-800mcg diarios');
    if (userInput.bmi && (userInput.bmi < 18.5 || userInput.bmi > 25)) {
      recommendations.push('⚖️ Optimizar peso corporal (BMI 20-25)');
    }
    recommendations.push('🏃‍♀️ Ejercicio regular moderado');
    recommendations.push('🚭 Eliminar completamente tabaco y alcohol');

    return recommendations;
  }

  private generatePersonalizedRecommendations(
    successRates: SuccessRate[],
    clinicalAnalysis: ClinicalAnalysis,
    userInput: UserInput
  ) {
    const primary = successRates.length > 0 ? 
      `${successRates[0].technique} (${Math.round(successRates[0].probabilityPerCycle * 100)}% por ciclo)` :
      'Evaluación médica especializada';

    const alternatives = successRates.slice(1, 3).map(sr => 
      `${sr.technique} (${Math.round(sr.probabilityPerCycle * 100)}%)`
    );

    const timeline = this.generateTimeline(userInput, clinicalAnalysis.riskStratification.level);

    return {
      primary,
      alternatives,
      timeline
    };
  }

  private generateTimeline(userInput: UserInput, riskLevel: string): string {
    if (userInput.age >= 40 || riskLevel === 'critical') {
      return 'Acción inmediata - máximo 3 meses para iniciar tratamiento';
    } else if (userInput.age >= 35 || riskLevel === 'high') {
      return 'Acción prioritaria - 3-6 meses para optimización + tratamiento';
    } else if (riskLevel === 'moderate') {
      return 'Plan estructurado - 6-12 meses con seguimiento';
    } else {
      return 'Enfoque gradual - hasta 12 meses con optimización lifestyle';
    }
  }

  private analyzeRiskFactors(userInput: UserInput, clinicalAnalysis: ClinicalAnalysis) {
    const modifiable: string[] = [];
    const nonModifiable: string[] = [];
    const actionPlan: string[] = [];

    // Factores modificables
    if (userInput.bmi && (userInput.bmi < 18.5 || userInput.bmi > 25)) {
      modifiable.push('Peso corporal');
      actionPlan.push('Consulta nutricional especializada');
    }
    
    if (!userInput.labs?.amh) {
      modifiable.push('Evaluación hormonal completa');
      actionPlan.push('Solicitar panel hormonal básico');
    }

    modifiable.push('Estilo de vida', 'Suplementación', 'Manejo del estrés');
    actionPlan.push('Plan de ejercicio regular', 'Vitaminas preconcepcionales', 'Técnicas de relajación');

    // Factores no modificables
    nonModifiable.push('Edad actual', 'Duración infertilidad');
    if (clinicalAnalysis.primaryDiagnosis.pathology.includes('GENETIC')) {
      nonModifiable.push('Factores genéticos');
    }

    return {
      modifiable,
      nonModifiable,
      actionPlan
    };
  }

  private predictUserSatisfaction(
    clinicalAnalysis: ClinicalAnalysis, 
    successRates: SuccessRate[]
  ): number {
    let satisfaction = 70; // Base

    // Confianza diagnóstica
    satisfaction += (clinicalAnalysis.primaryDiagnosis.confidence - 50) * 0.3;

    // Probabilidades de éxito
    if (successRates.length > 0) {
      const bestSuccess = successRates[0].probabilityPerCycle;
      if (bestSuccess >= 0.3) satisfaction += 20;
      else if (bestSuccess >= 0.2) satisfaction += 10;
      else if (bestSuccess < 0.1) satisfaction -= 10;
    }

    // Nivel de riesgo
    if (clinicalAnalysis.riskStratification.level === 'low') satisfaction += 15;
    else if (clinicalAnalysis.riskStratification.level === 'high') satisfaction -= 10;
    else if (clinicalAnalysis.riskStratification.level === 'critical') satisfaction -= 20;

    return Math.max(20, Math.min(95, satisfaction));
  }

  private determineConversationFlow(conversationType: string): string {
    const flowMap: { [key: string]: string } = {
      'diagnostic': 'clinical-focused',
      'therapeutic': 'treatment-focused',
      'prognostic': 'outcome-focused',
      'educational': 'learning-focused',
      'supportive': 'emotion-focused'
    };
    
    return flowMap[conversationType] || 'exploratory';
  }

  private generateConversationSuggestions(
    conversationType: string, 
    response: MedicalResponse
  ): string[] {
    const baseSuggestions = response.followUpQuestions;
    
    const contextSuggestions: string[] = [];
    
    if (conversationType === 'diagnostic') {
      contextSuggestions.push('¿Quieres saber sobre opciones de tratamiento?');
    } else if (conversationType === 'therapeutic') {
      contextSuggestions.push('¿Te interesa conocer las probabilidades de éxito?');
    } else if (conversationType === 'prognostic') {
      contextSuggestions.push('¿Cómo te sientes con esta información?');
    } else if (conversationType === 'supportive') {
      contextSuggestions.push('¿Hay algo más en lo que pueda apoyarte?');
    }
    
    return [...baseSuggestions, ...contextSuggestions].slice(0, 4);
  }
}

// Instancia singleton
let agentInstance: OptimizedMedicalAIAgent | null = null;

export function getOptimizedMedicalAgent(config?: Partial<AgentConfig>): OptimizedMedicalAIAgent {
  agentInstance ??= new OptimizedMedicalAIAgent(config);
  return agentInstance;
}

export default OptimizedMedicalAIAgent;
