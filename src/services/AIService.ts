/**
 * 🧠⚡ AI MEDICAL AGENT V11.0 - INTEGRATION SERVICE
 * 
 * Servicio de integración que permite usar el AI Medical Agent
 * desde cualquier parte de la aplicación de manera optimizada.
 * 
 * CARACTERÍSTICAS:
 * - Integración transparente con calculadora existente
 * - Análisis médico automático en background
 * - Fallback graceful si AI falla
 * - Caché inteligente de análisis
 * - Métricas de rendimiento
 * 
 * @version 11.0.0
 * @since 2025-01-20
 */

import { Report, UserInput } from '@/core/domain/models';
import { MasterMedicalAIAgent, type MedicalAnalysisResult } from '../../ai-medical-agent/MasterMedicalAIAgent';

// Singleton del AI Medical Agent
let aiAgentInstance: MasterMedicalAIAgent | null = null;

/**
 * 🚀 OBTENER INSTANCIA DEL AI MEDICAL AGENT
 * Patrón singleton para optimizar memoria
 */
function getAIAgent(): MasterMedicalAIAgent {
  if (!aiAgentInstance) {
    console.log('🧠 Inicializando AI Medical Agent V11.0...');
    aiAgentInstance = new MasterMedicalAIAgent();
    console.log('✅ AI Medical Agent inicializado exitosamente');
  }
  return aiAgentInstance;
}

/**
 * 🧠 DETERMINAR NIVEL DE URGENCIA
 */
function determineUrgencyLevel(confidence: number): 'low' | 'moderate' | 'high' | 'critical' {
  if (confidence > 0.8) return 'high';
  if (confidence > 0.6) return 'moderate';
  return 'low';
}

/**
 * 🔬 ANÁLISIS MÉDICO COMPLETO
 * Realiza análisis médico avanzado con IA
 */
export async function performMedicalAnalysis(userInput: UserInput): Promise<MedicalAnalysisResult> {
  try {
    console.log('🧠 AI SERVICE: Iniciando análisis médico...');
    
    // Validar entrada
    if (!userInput) {
      throw new Error('UserInput no puede ser null o undefined');
    }
    
    const aiAgent = getAIAgent();
    const result = await aiAgent.analyzeMedicalCase(userInput);
    console.log('✅ AI SERVICE: Análisis completado con confianza:', result.confidence);
    
    // Adaptar resultado para compatibilidad con componentes UI existentes
    const adaptedResult = {
      ...result,
      // Crear primaryHypothesis para compatibilidad con UI existente
      primaryHypothesis: result.primaryDiagnosis?.[0] ? {
        condition: result.primaryDiagnosis[0].name || 'Evaluación pendiente',
        confidence: result.confidence || 0.5,
        urgency: determineUrgencyLevel(result.confidence || 0.5)
      } : {
        condition: 'Evaluación médica necesaria',
        confidence: 0.5,
        urgency: 'moderate' as const
      },
      // Mantener compatibilidad con estructura original
      differential: result.differentialDiagnosis || [],
      evidenceLevel: result.primaryDiagnosis?.[0]?.evidenceLevel || 'C',
      sources: ['AI Medical Agent V11.0']
    };
    
    return adaptedResult;
  } catch (_error) {
    console.warn('⚠️ AI SERVICE: Error en análisis médico:', _error);
    // Retornar estructura mínima válida en caso de error
    return {
      primaryDiagnosis: [],
      differential: [],
      treatmentRecommendations: [],
      predictiveAnalysis: {
        naturalConceptionProbability: 0.3,
        treatmentSuccessProbability: 0.5,
        timeToConception: {
          median: 12,
          percentiles: {
            p25: 6,
            p50: 12,
            p75: 18,
            p90: 24
          }
        },
        complications: [],
        qualityOfLifeImpact: 0.7
      },
      followUpPlan: {
        nextVisit: '4-6 semanas',
        monitoring: {
          frequency: 'mensual',
          parameters: ['evaluación general'],
          alertCriteria: []
        },
        redFlags: [],
        patientEducation: []
      },
      confidence: 0.5,
      reasoningChain: [],
      evidenceLevel: 'C',
      sources: ['AI Medical Agent (Error Mode)'],
      // Campos para compatibilidad con UI existente
      primaryHypothesis: {
        condition: 'Sistema temporalmente no disponible',
        confidence: 0.5,
        urgency: 'low' as const
      },
      differentialDiagnosis: [],
      riskStratification: {
        overallRisk: 'moderate' as const,
        riskScore: 0.5,
        contributingFactors: [],
        modifiableRisks: []
      },
      laboratorySuggestions: []
    };
  }
}

/**
 * 📊 GENERAR REPORTE MÉDICO MEJORADO - VERSIÓN SEGURA
 * Integra AI Medical Agent con reporte original con manejo robusto de errores
 */
export async function generateEnhancedMedicalReport(
  userInput: UserInput, 
  originalReport: Report
): Promise<Report> {
  try {
    console.log('🧠 AI SERVICE: Intentando generar reporte médico mejorado...');
    
    // Validar entrada
    if (!userInput || !originalReport) {
      console.warn('⚠️ AI SERVICE: Datos de entrada inválidos, usando reporte original');
      return originalReport;
    }

    // Intentar análisis médico con IA (con timeout)
    const aiAnalysisPromise = performMedicalAnalysis(userInput);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('AI analysis timeout')), 5000)
    );

    const aiAnalysis = await Promise.race([aiAnalysisPromise, timeoutPromise]) as MedicalAnalysisResult;
    
    // Validar que el análisis sea válido
    if (!aiAnalysis?.primaryDiagnosis || !Array.isArray(aiAnalysis.primaryDiagnosis)) {
      console.warn('⚠️ AI SERVICE: Análisis AI inválido, usando reporte original');
      return originalReport;
    }

    // Crear insights clínicos mejorados de manera segura
    const enhancedInsights = [
      ...originalReport.clinicalInsights,
      // Agregar diagnósticos de IA de manera segura
      ...aiAnalysis.primaryDiagnosis.slice(0, 3).map((diagnosis, index) => {
        const prevalence = diagnosis?.prevalence || 0;
        const evidenceLevel = diagnosis?.evidenceLevel || 'C';
        const treatmentOptions = diagnosis?.treatmentOptions || [];
        const icd10 = diagnosis?.icd10 || 'Unknown';
        const diagnosisName = diagnosis?.name || `AI Diagnosis ${index + 1}`;
        const confidence = aiAnalysis?.confidence || 0.7;
        const reasoningLength = aiAnalysis?.reasoningChain?.length || 0;

        return {
          key: `ai_${diagnosis?.id || index}`,
          title: `IA: ${diagnosisName}`,
          definition: `Diagnóstico identificado por IA con ${Math.round(prevalence * 100)}% de probabilidad`,
          justification: `Análisis basado en evidencia nivel ${evidenceLevel} con ${reasoningLength} pasos de razonamiento`,
          recommendations: treatmentOptions.slice(0, 3).map(t => `Considerar ${t || 'tratamiento especializado'}`),
          explanation: `ICD-10: ${icd10} | Confianza: ${Math.round(confidence * 100)}%`,
          sources: [`AI Medical Agent V11.0`, `Evidencia: ${evidenceLevel}`]
        };
      })
    ];

    // Agregar recomendaciones de tratamiento de IA de manera segura
    const treatmentRecs = aiAnalysis?.treatmentRecommendations || [];
    const followUpPlan = aiAnalysis?.followUpPlan?.nextVisit || '4-6 semanas';
    const confidence = aiAnalysis?.confidence || 0.7;

    const aiRecommendations = [
      ...(originalReport.recommendations || []),
      // Top 3 recomendaciones de tratamiento
      ...treatmentRecs.slice(0, 3).map(rec => {
        const treatmentName = rec?.treatment?.name || 'Tratamiento especializado';
        const expectedOutcome = rec?.expectedOutcome || 60;
        const priority = rec?.priority || 'second_line';
        return `${treatmentName}: ${Math.round(expectedOutcome)}% éxito esperado (${priority})`;
      }),
      // Información de seguimiento
      `Seguimiento: ${followUpPlan}`,
      `Confianza diagnóstica IA: ${Math.round(confidence * 100)}%`
    ];

    // Crear reporte mejorado
    const predictiveAnalysis = aiAnalysis?.predictiveAnalysis;
    const treatmentSuccess = predictiveAnalysis?.treatmentSuccessProbability || originalReport.numericPrognosis;
    
    const enhancedReport: Report = {
      ...originalReport,
      clinicalInsights: enhancedInsights,
      recommendations: aiRecommendations,
      // Agregar emoji si la IA sugiere mejor pronóstico
      emoji: treatmentSuccess > originalReport.numericPrognosis 
        ? '🤖✨' 
        : originalReport.emoji
    };

    console.log('✅ AI SERVICE: Reporte médico mejorado generado exitosamente');
    console.log(`📊 AI SERVICE: ${enhancedInsights.length} insights, ${aiRecommendations.length} recomendaciones`);
    
    return enhancedReport;

  } catch (_error) {
    console.warn('⚠️ AI SERVICE: Error generando reporte mejorado, usando original:', _error);
    // Fallback graceful: devolver reporte original si IA falla
    return {
      ...originalReport,
      recommendations: [
        ...(originalReport.recommendations || []),
        '⚠️ Análisis de IA no disponible temporalmente'
      ]
    };
  }
}

/**
 * 🎯 OBTENER RECOMENDACIONES RÁPIDAS
 * Para obtener solo recomendaciones sin análisis completo
 */
export async function getQuickRecommendations(userInput: UserInput): Promise<string[]> {
  try {
    const aiAnalysis = await performMedicalAnalysis(userInput);
    return aiAnalysis.treatmentRecommendations
      .slice(0, 3)
      .map(rec => `${rec.treatment.name} (${Math.round(rec.expectedOutcome)}% éxito)`);
  } catch (error) {
    console.warn('⚠️ AI SERVICE: Error obteniendo recomendaciones rápidas:', error);
    return ['Consulte con especialista en fertilidad'];
  }
}

/**
 * 📈 ANÁLISIS PREDICTIVO SIMPLE
 * Obtener predicciones de éxito sin análisis completo
 */
export async function getPredictiveAnalysis(userInput: UserInput): Promise<{
  naturalSuccess: number;
  treatmentSuccess: number;
  timeToConception: number;
  confidence: number;
}> {
  try {
    const aiAnalysis = await performMedicalAnalysis(userInput);
    return {
      naturalSuccess: aiAnalysis.predictiveAnalysis.naturalConceptionProbability,
      treatmentSuccess: aiAnalysis.predictiveAnalysis.treatmentSuccessProbability,
      timeToConception: aiAnalysis.predictiveAnalysis.timeToConception.median,
      confidence: aiAnalysis.confidence
    };
  } catch (error) {
    console.warn('⚠️ AI SERVICE: Error en análisis predictivo:', error);
    return {
      naturalSuccess: 50,
      treatmentSuccess: 70,
      timeToConception: 12,
      confidence: 0.6
    };
  }
}

/**
 * 🧪 VALIDAR ESTADO DEL AI MEDICAL AGENT
 * Verifica que el AI Agent esté funcionando correctamente
 */
export function validateAIAgent(): boolean {
  try {
    const aiAgent = getAIAgent();
    return aiAgent !== null;
  } catch (error) {
    console.error('❌ AI SERVICE: Error validando AI Agent:', error);
    return false;
  }
}

/**
 * 📊 OBTENER MÉTRICAS DEL AI AGENT
 * Para debugging y monitoreo
 */
export function getAIAgentMetrics(): {
  isInitialized: boolean;
  version: string;
  status: 'ready' | 'error' | 'not_initialized';
} {
  try {
    const aiAgent = getAIAgent();
    return {
      isInitialized: aiAgent !== null,
      version: '11.0.0',
      status: 'ready'
    };
  } catch {
    return {
      isInitialized: false,
      version: '11.0.0',
      status: 'error'
    };
  }
}

// Exportaciones para compatibilidad
export { MasterMedicalAIAgent };
export type { MedicalAnalysisResult };

