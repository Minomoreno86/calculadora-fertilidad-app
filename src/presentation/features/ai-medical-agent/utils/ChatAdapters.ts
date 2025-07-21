/**
 * 🩺 CHAT ADAPTERS V12.1 - MEDICAL AI INTEGRATION
 * Sistema de conversión entre EvaluationState y MedicalKnowledgeQuery
 * Type-safe, simplified, and defensive
 */

import { EvaluationState } from '../../../../core/domain/models';
import { MedicalKnowledgeQuery } from '../../../../../ai-medical-agent/core/modules-integration/ModulesIntegration';

/**
 * 🧬 CONVERSOR PRINCIPAL: EvaluationState → MedicalKnowledgeQuery
 * Extrae factores de riesgo relevantes de forma segura
 */
export function convertEvaluationToMedicalQuery(evaluation: EvaluationState): MedicalKnowledgeQuery {
  const input = evaluation.input;
  const factors = evaluation.factors;
  
  // Extract primary risk factors
  const symptoms = [];
  
  // PCOS Analysis
  if (input.hasPcos) {
    symptoms.push('PCOS confirmado');
  }
  
  // Endometriosis Analysis  
  if (input.endometriosisGrade > 0) {
    symptoms.push(`Endometriosis grado ${input.endometriosisGrade}`);
  }
  
  // Age Factor
  if (input.age >= 35) {
    symptoms.push(`Edad avanzada: ${input.age} años`);
  }
  
  // Male Factor Analysis
  if (input.spermConcentration !== undefined && input.spermConcentration < 15) {
    symptoms.push('Oligospermia');
  }
  
  if (input.spermProgressiveMotility !== undefined && input.spermProgressiveMotility < 32) {
    symptoms.push('Astenospermia');
  }
  
  // Ovulatory dysfunction
  if (factors.cycle < 0.8) {
    symptoms.push('Alteraciones del ciclo menstrual');
  }
  
  // Hormonal issues
  if (factors.amh < 0.7) {
    symptoms.push('Baja reserva ovárica');
  }
  
  return {
    symptoms: symptoms.length > 0 ? symptoms : ['Consulta rutinaria de fertilidad'],
    patientAge: input.age,
    medicalHistory: [],
    medications: [],
    lifestyle: {
      exercise: 'moderate',
      diet: 'balanced', 
      stress: 'moderate'
    }
  };
}

/**
 * 🩺 GENERADOR DE RESPUESTA MÉDICA CONTEXTUALIZADA
 * Crea respuestas para el chat con metadata médica enriquecida
 */
export function createChatResponse(
  message: string,
  patientAge: number = 30,
  confidence: number = 0.85,
  urgencyLevel: 'low' | 'medium' | 'high' | 'urgent' = 'medium'
) {
  // Determine age group
  let ageGroup: string;
  if (patientAge < 25) ageGroup = 'young';
  else if (patientAge < 35) ageGroup = 'optimal';
  else if (patientAge < 40) ageGroup = 'advanced';
  else ageGroup = 'critical';
  
  // Determine confidence level
  let confidenceLevel: string;
  if (confidence > 0.8) confidenceLevel = 'high';
  else if (confidence > 0.6) confidenceLevel = 'medium';
  else confidenceLevel = 'low';
  
  return {
    response: message,
    metadata: {
      timestamp: new Date().toISOString(),
      confidence: Math.round(confidence * 100),
      medicalContext: {
        patientAge,
        ageGroup,
        confidenceLevel,
        urgencyLevel
      },
      systemInfo: {
        version: '12.1',
        source: 'AI Medical Agent',
        language: 'es'
      }
    }
  };
}

/**
 * 🔄 MOCK ADAPTERS FOR EMERGENCY COMPATIBILITY
 * Temporary fallback while integration is completed
 */
export const mockChatAdapters = {
  convertEvaluationToMedicalQuery,
  createChatResponse,
  
  // Emergency fallbacks
  processMedicalQuery: (query: string) => ({
    response: `Procesando consulta médica: ${query}`,
    confidence: 0.85,
    recommendations: ['Consulte con su médico especialista']
  }),
  
  formatMedicalResponse: (response: string) => ({
    formattedResponse: response,
    timestamp: new Date().toISOString(),
    source: 'AI Medical Agent V12.1'
  })
};

/**
 * 🧪 MOCK CLINICAL ANALYSIS FOR TESTING - COMPATIBLE FORMAT
 */
export function createMockAnalysis() {
  return {
    primaryHypothesis: {
      condition: 'Factor múltiple',
      confidence: 0.75,
      urgency: 'moderate'
    },
    confidence: 0.75,
    reasoningChain: ['Análisis de factores', 'Evaluación de riesgo'],
    treatmentRecommendations: ['Consulta especialista', 'Análisis hormonal'],
    // Properties expected by existing code
    primaryConcerns: ['PCOS', 'Factor edad', 'Reserva ovárica'],
    suspectedPathologies: [
      {
        name: 'PCOS',
        pathology: { nameES: 'Síndrome de ovarios poliquísticos' },
        probabilityScore: 0.75,
        matchingFactors: ['Alteraciones menstruales', 'Resistencia insulínica']
      },
      {
        name: 'Endometriosis',
        pathology: { nameES: 'Endometriosis' },
        probabilityScore: 0.45,
        matchingFactors: ['Dolor pélvico', 'Dismenorrea']
      }
    ],
    recommendedTests: ['FSH/LH', 'AMH', 'Perfil hormonal completo']
  };
}

/**
 * 🧪 MOCK TREATMENTS FOR TESTING - COMPATIBLE FORMAT
 */
export function createMockTreatments() {
  return {
    recommendedTreatments: [
      {
        treatment: {
          nameES: 'Estimulación Ovárica Controlada'
        },
        title: 'Estimulación Ovárica',
        description: 'Protocolo de estimulación controlada',
        successRate: 0.65,
        appropriatenessScore: 0.85
      },
      {
        treatment: {
          nameES: 'Fertilización in Vitro'
        },
        title: 'FIV',
        description: 'Fertilización in vitro',
        successRate: 0.45,
        appropriatenessScore: 0.78
      }
    ]
  };
}
