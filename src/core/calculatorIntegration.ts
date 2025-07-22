/**
 * 🚀 INTEGRACIÓN CALCULADORA CON UNIFIED PARALLEL ENGINE V12.0
 * 
 * Conecta la calculadora principal con el sistema de workers especializados
 */

import type { UserInput } from './domain/models';
import { UnifiedParallelEngine, type MedicalResult } from './workers/UnifiedParallelEngine_V12';

// 🎯 TYPE DEFINITIONS
type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

// 🎯 TIPOS ESPECÍFICOS PARA DATA WORKERS
interface WorkerDataPayload {
  successProbability?: number;
  totalAdjustment?: number;
  totalRiskReduction?: number;
  treatments?: TreatmentRecommendation[];
  pathologies?: PathologyFlag[];
  biomarkers?: BiomarkerStatus[];
  riskFactors?: RiskFactor[];
  [key: string]: unknown;
}

// Instancia singleton del motor
let engineInstance: UnifiedParallelEngine | null = null;

/**
 * Obtener instancia del motor unificado
 */
export async function getUnifiedEngine(): Promise<UnifiedParallelEngine> {
  if (!engineInstance) {
    engineInstance = UnifiedParallelEngine.getInstance();
    await engineInstance.initialize();
  }
  return engineInstance;
}

/**
 * 🧮 CALCULADORA INTEGRADA V12.0
 * Función principal que reemplaza el cálculo básico anterior
 */
export async function calculateFertilityWithAI(input: UserInput): Promise<CalculationResult> {
  try {
    console.log('🚀 Iniciando cálculo con UnifiedParallelEngine V12.0');
    
    // 1. Obtener motor unificado
    const engine = await getUnifiedEngine();
    
    // 2. Procesar con workers especializados - FIX: Usar método correcto
    const result = await engine.processMedicalInput(input);
    
    // 3. Consolidar resultados
    const consolidatedResult = consolidateResults(result, input);
    
    console.log('✅ Cálculo completado con AI medical workers');
    return consolidatedResult;
    
  } catch (error) {
    console.error('❌ Error en cálculo con AI:', error);
    
    // Fallback a cálculo básico
    return calculateBasicFallback(input);
  }
}

/**
 * 📊 Resultado consolidado del cálculo
 */
export interface CalculationResult {
  // Resultado principal
  successProbability: number;
  confidence: number;
  
  // Análisis detallado
  ageFactorImpact: number;
  medicalConditionsImpact: number;
  lifestyleFactorsImpact: number;
  maleFactorImpact: number;
  
  // Recomendaciones AI
  treatmentRecommendations: TreatmentRecommendation[];
  lifestyleRecommendations: string[];
  medicalRecommendations: string[];
  urgencyLevel: UrgencyLevel;
  
  // Métricas del sistema
  processingTime: number;
  workersUsed: string[];
  cacheHit: boolean;
  aiAnalysisUsed: boolean;
  
  // Detalles médicos
  pathologiesDetected: PathologyFlag[];
  biomarkerStatus: BiomarkerStatus[];
  riskFactors: RiskFactor[];
  
  // Próximos pasos
  recommendedTests: string[];
  followUpSchedule: string[];
  estimatedTimeToConception: string;
}

export interface TreatmentRecommendation {
  treatment: string;
  successRate: number;
  timeframe: string;
  cost: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

export interface PathologyFlag {
  name: string;
  probability: number;
  severity: 'mild' | 'moderate' | 'severe';
  impact: number;
  recommendations: string[];
}

export interface BiomarkerStatus {
  name: string;
  value: number;
  unit: string;
  status: 'optimal' | 'normal' | 'borderline' | 'abnormal' | 'critical';
  trend: 'improving' | 'stable' | 'declining';
}

export interface RiskFactor {
  factor: string;
  impact: number;
  modifiable: boolean;
  interventions: string[];
  priority: 'low' | 'medium' | 'high';
}

/**
 * 🔄 Consolidar resultados de múltiples workers
 */
function consolidateResults(engineResults: MedicalResult[], input: UserInput): CalculationResult {
  const startTime = Date.now();
  
  // Extraer datos de diferentes workers - FIX: engineResults es array directo
  const calculationResults = engineResults.find((r: MedicalResult) => r.workerUsed?.includes('calculation'));
  const pathologyResults = engineResults.find((r: MedicalResult) => r.workerUsed?.includes('pathology'));
  const biomarkerResults = engineResults.find((r: MedicalResult) => r.workerUsed?.includes('biomarker'));
  const riskResults = engineResults.find((r: MedicalResult) => r.workerUsed?.includes('risk'));
  const treatmentResults = engineResults.find((r: MedicalResult) => r.workerUsed?.includes('treatment'));
  
  // Calcular probabilidad de éxito consolidada
  const baseSuccess = (calculationResults?.data as WorkerDataPayload)?.successProbability || calculateBasicSuccessRate(input);
  const medicalAdjustments = (pathologyResults?.data as WorkerDataPayload)?.totalAdjustment || 0;
  const riskAdjustments = (riskResults?.data as WorkerDataPayload)?.totalRiskReduction || 0;
  
  const finalSuccessProbability = Math.max(0, Math.min(1, baseSuccess + medicalAdjustments + riskAdjustments));
  
  // Determinar nivel de urgencia
  const urgencyLevel = determineUrgencyLevel(input, pathologyResults?.data, riskResults?.data);
  
  return {
    // Resultado principal
    successProbability: finalSuccessProbability,
    confidence: calculateOverallConfidence(engineResults),
    
    // Análisis detallado
    ageFactorImpact: calculateAgeImpact(input.age),
    medicalConditionsImpact: medicalAdjustments,
    lifestyleFactorsImpact: calculateLifestyleImpact(input),
    maleFactorImpact: calculateMaleFactorImpact(input),
    
    // Recomendaciones AI
    treatmentRecommendations: (treatmentResults?.data as WorkerDataPayload)?.treatments || generateBasicTreatments(input),
    lifestyleRecommendations: generateLifestyleRecommendations(input),
    medicalRecommendations: treatmentResults?.treatmentSuggestions?.map(t => t.treatmentType) || [],
    urgencyLevel,
    
    // Métricas del sistema
    processingTime: Date.now() - startTime,
    workersUsed: engineResults.map((r: MedicalResult) => r.workerUsed) || [],
    cacheHit: engineResults.some((r: MedicalResult) => r.cacheHit) || false,
    aiAnalysisUsed: engineResults.some((r: MedicalResult) => r.workerUsed.includes('pathology') || r.workerUsed.includes('treatment')) || false,
    
    // Detalles médicos
    pathologiesDetected: (pathologyResults?.data as WorkerDataPayload)?.pathologies || [],
    biomarkerStatus: (biomarkerResults?.data as WorkerDataPayload)?.biomarkers || [],
    riskFactors: (riskResults?.data as WorkerDataPayload)?.riskFactors || [],
    
    // Próximos pasos
    recommendedTests: biomarkerResults?.medicalInsights?.map(insight => insight.description) || [],
    followUpSchedule: generateFollowUpSchedule(urgencyLevel),
    estimatedTimeToConception: estimateTimeToConception(finalSuccessProbability, input)
  };
}

/**
 * 📋 Cálculo básico de probabilidad de éxito (fallback)
 */
function calculateBasicSuccessRate(input: UserInput): number {
  let baseRate = 0.6; // 60% base
  
  // Factor edad
  if (input.age) {
    if (input.age < 30) baseRate += 0.2;
    else if (input.age < 35) baseRate += 0.1;
    else if (input.age < 40) baseRate -= 0.1;
    else baseRate -= 0.3;
  }
  
  // Factor BMI
  if (input.bmi) {
    if (input.bmi >= 18.5 && input.bmi < 25) baseRate += 0.1;
    else if (input.bmi >= 30) baseRate -= 0.15;
  }
  
  // Condiciones médicas
  if (input.hasPcos) baseRate -= 0.15;
  if (input.endometriosisGrade > 0) baseRate -= (input.endometriosisGrade * 0.05);
  
  return Math.max(0.1, Math.min(0.9, baseRate));
}

/**
 * 🔍 Determinar nivel de urgencia
 */
function determineUrgencyLevel(input: UserInput, _pathologyData: unknown, _riskData: unknown): UrgencyLevel {
  // Edad crítica
  if (input.age && input.age >= 42) return 'critical';
  if (input.age && input.age >= 38) return 'high';
  
  // Patologías detectadas (datos not structured yet)
  // if (pathologyData?.criticalFindings?.length > 0) return 'critical';
  // if (pathologyData?.severePaths?.length > 0) return 'high';
  
  // Factores de riesgo (datos not structured yet)
  // if (riskData?.criticalRisks?.length > 0) return 'critical';
  // if (riskData?.highRisks?.length > 1) return 'high';
  
  // AMH muy baja
  if (input.amh && input.amh < 0.5) return 'critical';
  if (input.amh && input.amh < 1.0) return 'high';
  
  return 'medium';
}

/**
 * 🎯 Calcular impacto de edad
 */
function calculateAgeImpact(age?: number): number {
  if (!age) return 0;
  
  if (age < 30) return 0.2;
  if (age < 35) return 0.1;
  if (age < 40) return -0.1;
  return -0.3;
}

/**
 * 🏃‍♀️ Calcular impacto de estilo de vida
 */
function calculateLifestyleImpact(input: UserInput): number {
  let impact = 0;
  
  if (input.bmi) {
    if (input.bmi >= 18.5 && input.bmi < 25) impact += 0.1;
    else if (input.bmi >= 30) impact -= 0.15;
  }
  
  // Future lifestyle factors (not yet implemented in UserInput interface):
  // if (input.smoking) impact -= 0.2;
  // if (input.alcoholConsumption === 'high') impact -= 0.1;
  // if (input.exerciseFrequency === 'regular') impact += 0.05;
  
  return impact;
}

/**
 * 👨 Calcular impacto de factor masculino
 */
function calculateMaleFactorImpact(input: UserInput): number {
  if (!input.spermConcentration) return 0;
  
  let impact = 0;
  
  if (input.spermConcentration < 15) impact -= 0.2;
  else if (input.spermConcentration >= 40) impact += 0.1;
  
  if (input.spermProgressiveMotility && input.spermProgressiveMotility < 32) impact -= 0.15;
  if (input.spermNormalMorphology && input.spermNormalMorphology < 4) impact -= 0.1;
  
  return impact;
}

/**
 * 🎯 Calcular confianza general
 */
function calculateOverallConfidence(results: MedicalResult[]): number {
  if (results.length === 0) return 0.5;
  
  // Calcular confianza basada en éxito de workers y tiempo de procesamiento
  const successRate = results.filter(r => r.success).length / results.length;
  const avgProcessingTime = results.reduce((sum, r) => sum + r.processingTimeMs, 0) / results.length;
  
  // Confianza basada en éxito y eficiencia
  const baseConfidence = successRate * 0.8;
  const efficiencyBonus = avgProcessingTime < 1000 ? 0.2 : 0.1;
  
  return Math.min(1.0, baseConfidence + efficiencyBonus);
}

/**
 * 💊 Generar tratamientos básicos
 */
function generateBasicTreatments(input: UserInput): TreatmentRecommendation[] {
  const treatments: TreatmentRecommendation[] = [];
  
  if (input.age && input.age < 35) {
    treatments.push({
      treatment: 'Coito dirigido + optimización estilo vida',
      successRate: 0.65,
      timeframe: '6-12 meses',
      cost: 500,
      priority: 'medium',
      description: 'Seguimiento de ovulación y relaciones dirigidas'
    });
  } else if (input.age && input.age < 40) {
    treatments.push({
      treatment: 'Fecundación in vitro (FIV)',
      successRate: 0.45,
      timeframe: '2-3 ciclos',
      cost: 8000,
      priority: 'high',
      description: 'Fertilización in vitro con óvulos propios'
    });
  }
  
  return treatments;
}

/**
 * 🌱 Generar recomendaciones de estilo de vida
 */
function generateLifestyleRecommendations(input: UserInput): string[] {
  const recommendations = [
    'Dieta mediterránea rica en antioxidantes',
    'Suplementación con ácido fólico 400mcg/día',
    'Ejercicio moderado 150 min/semana'
  ];
  
  if (input.bmi && input.bmi >= 30) {
    recommendations.push('Pérdida de peso del 5-10%');
  }
  
  // Future lifestyle factors (not yet implemented in UserInput interface):
  // if (input.smoking) {
  //   recommendations.push('Cese completo del tabaco');
  // }
  
  return recommendations;
}

/**
 * 📅 Generar cronograma de seguimiento
 */
function generateFollowUpSchedule(urgency: string): string[] {
  switch (urgency) {
    case 'critical':
      return ['Consulta especializada en 48-72 horas', 'Monitoreo semanal'];
    case 'high':
      return ['Consulta especializada en 1-2 semanas', 'Monitoreo cada 2 semanas'];
    case 'medium':
      return ['Consulta especializada en 4-6 semanas', 'Monitoreo mensual'];
    default:
      return ['Consulta especializada en 2-3 meses', 'Monitoreo cada 3 meses'];
  }
}

/**
 * ⏱️ Estimar tiempo hasta concepción
 */
function estimateTimeToConception(successRate: number, input: UserInput): string {
  const baseMonths = 12; // 12 meses promedio
  const adjustedMonths = Math.round(baseMonths / successRate);
  
  // Ajuste por edad
  let ageMultiplier = 1;
  if (input.age && input.age >= 35) ageMultiplier = 1.5;
  if (input.age && input.age >= 40) ageMultiplier = 2.0;
  
  const finalMonths = Math.round(adjustedMonths * ageMultiplier);
  
  if (finalMonths <= 6) return '3-6 meses';
  if (finalMonths <= 12) return '6-12 meses';
  if (finalMonths <= 24) return '12-24 meses';
  return '24+ meses - considerar TRA';
}

/**
 * 🆘 Cálculo básico de emergencia (fallback)
 */
function calculateBasicFallback(input: UserInput): CalculationResult {
  const basicSuccess = calculateBasicSuccessRate(input);
  
  return {
    successProbability: basicSuccess,
    confidence: 0.6,
    ageFactorImpact: calculateAgeImpact(input.age),
    medicalConditionsImpact: 0,
    lifestyleFactorsImpact: calculateLifestyleImpact(input),
    maleFactorImpact: calculateMaleFactorImpact(input),
    treatmentRecommendations: generateBasicTreatments(input),
    lifestyleRecommendations: generateLifestyleRecommendations(input),
    medicalRecommendations: ['Evaluación médica especializada recomendada'],
    urgencyLevel: 'medium',
    processingTime: 50,
    workersUsed: ['basic_fallback'],
    cacheHit: false,
    aiAnalysisUsed: false,
    pathologiesDetected: [],
    biomarkerStatus: [],
    riskFactors: [],
    recommendedTests: ['Evaluación básica de fertilidad'],
    followUpSchedule: ['Consulta en 4-6 semanas'],
    estimatedTimeToConception: estimateTimeToConception(basicSuccess, input)
  };
}

/**
 * 📊 Obtener métricas del sistema
 */
export async function getSystemMetrics() {
  const engine = await getUnifiedEngine();
  return engine.getMetrics();
}
