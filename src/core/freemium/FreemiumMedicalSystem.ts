/**
 * 🏥 FREEMIUM MEDICAL SYSTEM - APROVECHAR TODA TU ARQUITECTURA MÉDICA
 * 
 * Sistema inteligente que diferencia entre:
 * - BÁSICO: Motor de cálculo básico + probabilidad por edad 
 * - PREMIUM: 63 patologías + 35 tratamientos + AI Medical Agent + Chat médico
 * 
 * Aprovecha TODA tu información médica existente:
 * - pathologies.ts (89KB, 63 patologías)
 * - treatments.ts (26KB, 35 tratamientos) 
 * - clinicalContentLibrary.ts (97KB biblioteca clínica)
 * - AI Medical Agent (200KB análisis neural)
 * 
 * @author Sistema integrado con tu arquitectura médica existente
 */

import { UserInput, AnalysisResult } from '@/core/domain/models';
import { PATHOLOGIES_DATABASE } from '../../../ai-medical-agent/core/knowledge-base/pathologies';
import { TREATMENTS_DATABASE } from '../../../ai-medical-agent/core/knowledge-base/treatments';
import { clinicalContentLibrary } from '@/core/domain/logic/clinicalContentLibrary';

// 🎯 CONFIGURACIÓN FREEMIUM MÉDICA
export interface FreemiumConfig {
  tier: 'basic' | 'premium';
  userId?: string;
  subscriptionActive: boolean;
  medicalFeaturesEnabled: boolean;
}

// 🧬 ANÁLISIS MÉDICO BÁSICO VS PREMIUM
export interface MedicalAnalysisLevel {
  // BÁSICO: Solo factores principales
  basicAnalysis: {
    ageBaseline: number;
    bmiImpact: number;
    cycleDuration: number;
    totalProbability: number;
  };
  
  // PREMIUM: Análisis médico completo
  premiumAnalysis?: {
    pathologyDetection: string[];
    treatmentRecommendations: string[];
    medicalInsights: AnalysisResult[];
    aiChatEnabled: boolean;
    clinicalReferences: string[];
    detailedProtocols: string[];
  };
}

// ===================================================================
// 🏥 FREEMIUM MEDICAL ANALYZER
// ===================================================================

export class FreemiumMedicalSystem {
  
  /**
   * 🎯 ANÁLISIS FREEMIUM INTELIGENTE
   * Decide qué nivel de análisis médico proporcionar
   */
  static analyzeMedicalData(
    userInput: UserInput, 
    config: FreemiumConfig
  ): MedicalAnalysisLevel {
    
    // 🔍 ANÁLISIS BÁSICO (SIEMPRE DISPONIBLE)
    const basicAnalysis = this.getBasicAnalysis(userInput);
    
    // 🎯 SI ES PREMIUM: Análisis médico completo con toda tu información
    if (config.tier === 'premium' && config.subscriptionActive) {
      const premiumAnalysis = this.getPremiumMedicalAnalysis(userInput);
      return { basicAnalysis, premiumAnalysis };
    }
    
    // 📈 BÁSICO: Solo probabilidad y factores principales
    return { basicAnalysis };
  }
  
  /**
   * 🧮 ANÁLISIS BÁSICO - Tu algoritmo único de probabilidad por edad
   */
  private static getBasicAnalysis(userInput: UserInput) {
    // Usa tu motor de cálculo existente - solo factores principales
    const ageBaseline = this.calculateAgeBaseline(userInput.age); // Ya en porcentaje (25.0)
    const bmiImpact = userInput.bmi ? this.calculateBMIImpact(userInput.bmi) : 1.0; // Factor multiplicador
    const cycleDuration = userInput.cycleDuration || 28;
    
    // Tu algoritmo único: probabilidad base por edad * modificadores básicos
    const totalProbability = ageBaseline * bmiImpact; // 25.0 * 0.9 = 22.5%
    
    return {
      ageBaseline, // 25.0 (ya en porcentaje)
      bmiImpact,   // 0.9 (factor)
      cycleDuration, // 28 (días)
      totalProbability // 22.5 (porcentaje final)
    };
  }
  
  /**
   * 🏥 ANÁLISIS PREMIUM - TODA TU INFORMACIÓN MÉDICA
   * Usa las 63 patologías + 35 tratamientos + biblioteca clínica
   */
  private static getPremiumMedicalAnalysis(userInput: UserInput) {
    // 🔬 DETECCIÓN DE PATOLOGÍAS (63 disponibles)
    const pathologyDetection = this.detectPathologies(userInput);
    
    // 🎯 RECOMENDACIONES DE TRATAMIENTO (35 disponibles)
    const treatmentRecommendations = this.recommendTreatments(userInput, pathologyDetection);
    
    // 📚 INSIGHTS CLÍNICOS (Biblioteca 97KB)
    const medicalInsights = this.getClinicalInsights(userInput);
    
    // 🤖 REFERENCIAS CIENTÍFICAS
    const clinicalReferences = this.getClinicalReferences(pathologyDetection);
    
    // 📋 PROTOCOLOS DETALLADOS
    const detailedProtocols = this.getDetailedProtocols(treatmentRecommendations);
    
    return {
      pathologyDetection,
      treatmentRecommendations,
      medicalInsights,
      aiChatEnabled: true,
      clinicalReferences,
      detailedProtocols
    };
  }
  
  /**
   * 🔬 DETECCIÓN DE PATOLOGÍAS usando tu base de 63 patologías
   */
  private static detectPathologies(userInput: UserInput): string[] {
    const detectedPathologies: string[] = [];
    
    // Usar tu PATHOLOGIES_DATABASE existente
    Object.entries(PATHOLOGIES_DATABASE).forEach(([id, pathology]) => {
      // Lógica de detección basada en síntomas y factores de riesgo
      if (this.matchesPathologyCriteria(userInput, pathology)) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
        detectedPathologies.push((pathology as any).nameES || id);
      }
    });
    
    return detectedPathologies;
  }
  
  /**
   * 🎯 RECOMENDACIONES usando tu base de 35 tratamientos
   */
  private static recommendTreatments(userInput: UserInput, pathologies: string[]): string[] {
    const recommendations: string[] = [];
    
    // Usar tu TREATMENTS_DATABASE existente
    Object.entries(TREATMENTS_DATABASE).forEach(([id, treatment]) => {
      if (this.matchesTreatmentCriteria(userInput, pathologies, treatment)) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recommendations.push((treatment as any).nameES || id);
      }
    });
    
    return recommendations;
  }
  
  /**
   * 📚 INSIGHTS usando tu biblioteca clínica de 97KB
   */
  private static getClinicalInsights(userInput: UserInput): AnalysisResult[] {
    const insights: AnalysisResult[] = [];
    
    // Usar tu clinicalContentLibrary existente
    Object.entries(clinicalContentLibrary).forEach(([key, content]) => {
      if (this.isRelevantClinicalContent(userInput, key)) {
        insights.push({
          type: 'diagnostic',
          data: {
            condition: key,
            reasoning: content.explanation,
            evidenceLevel: 'B',
            priority: 'medium'
          }
        });
      }
    });
    
    return insights;
  }
  
  /**
   * 🧮 Tu algoritmo único de probabilidad por edad - ALGORITMO ORIGINAL CORRECTO
   */
  private static calculateAgeBaseline(age: number): number {
    // TU ALGORITMO ORIGINAL EXACTO de factorEvaluators.ts
    const ageRanges = [
      { max: 24, probability: 25.0 },  // 20 años = 25% ✅
      { max: 29, probability: 22.5 },
      { max: 34, probability: 17.5 },
      { max: 39, probability: 10.0 },
      { max: 44, probability: 5.0 },
      { max: 49, probability: 1.5 },
      { max: Infinity, probability: 0.5 }
    ];

    // Casos especiales
    if (age < 15) return 0.1;
    if (age < 18) return 15.0;

    for (const range of ageRanges) {
      if (age <= range.max) {
        return range.probability; // Devolver como porcentaje (25.0 = 25%)
      }
    }
    
    return 0.1; // Fallback
  }
  
  /**
   * 🏋️ Impacto del BMI en fertilidad
   */
  private static calculateBMIImpact(bmi: number): number {
    if (bmi >= 18.5 && bmi <= 24.9) return 1.0;
    if (bmi >= 25 && bmi <= 29.9) return 0.9;
    if (bmi >= 30) return 0.7;
    if (bmi < 18.5) return 0.8;
    return 1.0;
  }
  
  // 🔍 Métodos auxiliares para matching
  private static matchesPathologyCriteria(_userInput: UserInput, _pathology: unknown): boolean {
    // Lógica para determinar si los síntomas del usuario coinciden con la patología
    // Implementar basado en los criterios diagnósticos de cada patología
    return false; // Placeholder
  }
  
  private static matchesTreatmentCriteria(_userInput: UserInput, _pathologies: string[], _treatment: unknown): boolean {
    // Lógica para determinar si el tratamiento es apropiado
    return false; // Placeholder
  }
  
  private static isRelevantClinicalContent(_userInput: UserInput, _contentKey: string): boolean {
    // Lógica para determinar si el contenido clínico es relevante
    return false; // Placeholder
  }
  
  private static getClinicalReferences(_pathologies: string[]): string[] {
    // Extraer referencias científicas de las patologías detectadas
    return [];
  }
  
  private static getDetailedProtocols(_treatments: string[]): string[] {
    // Extraer protocolos detallados de los tratamientos recomendados
    return [];
  }
}

// ===================================================================
// 🎯 SUBSCRIPTION MANAGER
// ===================================================================

export class SubscriptionManager {
  
  /**
   * 🔐 Verificar estado de suscripción premium
   */
  static async checkPremiumStatus(_userId: string): Promise<boolean> {
    // Implementar verificación con sistema de pagos
    // App Store / Google Play billing
    return false; // Placeholder
  }
  
  /**
   * 💳 Activar suscripción premium
   */
  static async activatePremiumSubscription(_userId: string): Promise<boolean> {
    // Implementar activación de suscripción
    return false; // Placeholder
  }
  
  /**
   * 📊 Obtener métricas de uso
   */
  static async getUsageMetrics(_userId: string) {
    // Implementar tracking de uso para optimización
    return {
      calculationsPerformed: 0,
      premiumFeaturesUsed: 0,
      aiChatInteractions: 0
    };
  }
}

export default FreemiumMedicalSystem;