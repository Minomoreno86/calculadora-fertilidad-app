/**
 * 💊 TREATMENT ENGINE V12.0 - MOTOR AVANZADO DE TRATAMIENTOS
 * 
 * Sistema inteligente para análisis, selección y personalización de 
 * protocolos de tratamiento de fertilidad basados en evidencia científica.
 * 
 * CARACTERÍSTICAS V12.0:
 * - Análisis de líneas de tratamiento basado en evidencia
 * - Personalización según perfil clínico individual
 * - Cálculo de tasas de éxito esperadas
 * - Análisis de costo-efectividad
 * - Integración con guías clínicas internacionales
 * - Protocolo de seguimiento personalizado
 */

import { UserInput } from '../models';

// ===================================================================
// 🎯 INTERFACES PARA TRATAMIENTOS
// ===================================================================

export interface TreatmentRecommendation {
  treatmentId: string;
  name: string;
  category: 'lifestyle' | 'medical' | 'surgical' | 'art'; // ART = Assisted Reproductive Technology
  line: 'first' | 'second' | 'third' | 'experimental';
  priority: number; // 1-5 (1 = highest priority)
  
  // Personalización
  expectedSuccessRate: number; // 0-1
  confidenceLevel: number; // 0-1
  personalizedRationale: string;
  contraindicationsCheck: ContraindicationResult;
  
  // Detalles clínicos
  protocol: TreatmentProtocol;
  monitoring: MonitoringPlan;
  alternatives: string[]; // IDs de tratamientos alternativos
  
  // Análisis económico
  costAnalysis: CostAnalysis;
  timeframe: Timeframe;
  
  // Evidencia científica
  evidenceLevel: 'A' | 'B' | 'C' | 'D';
  sourceMedicalGuidelines: string[];
  lastUpdated: Date;
}

export interface TreatmentProtocol {
  protocolId: string;
  name: string;
  description: string;
  steps: TreatmentStep[];
  dosing?: MedicationDosing[];
  precautions: string[];
  contraindications: string[];
  expectedDuration: number; // días
  followUpSchedule: FollowUpSchedule[];
}

export interface TreatmentStep {
  stepNumber: number;
  name: string;
  description: string;
  duration?: number; // días
  requiredBefore?: string[]; // prerequisitos
  monitoringRequired: boolean;
  criticalStep: boolean; // paso crítico del protocolo
}

export interface MedicationDosing {
  medicationName: string;
  dose: string;
  frequency: string;
  route: 'oral' | 'injection' | 'topical' | 'vaginal';
  duration: number; // días
  instructions: string;
  sideEffects: string[];
  monitoringParameters: string[];
}

export interface ContraindicationResult {
  hasContraindications: boolean;
  absoluteContraindications: string[];
  relativeContraindications: string[];
  riskLevel: 'low' | 'moderate' | 'high' | 'prohibitive';
  mitigationStrategies: string[];
}

export interface MonitoringPlan {
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  parameters: MonitoringParameter[];
  alertCriteria: AlertCriterion[];
  adjustmentProtocol: string;
  emergencyContacts: string[];
}

export interface MonitoringParameter {
  parameterId: string;
  name: string;
  method: 'laboratory' | 'imaging' | 'clinical' | 'patient-reported';
  frequency: string;
  targetRange?: { min: number; max: number };
  alertThresholds: { low?: number; high?: number };
}

export interface AlertCriterion {
  criterionId: string;
  description: string;
  severity: 'info' | 'warning' | 'urgent' | 'emergency';
  action: string;
  responsibleClinician: string;
}

export interface CostAnalysis {
  estimatedTotalCost: number; // En moneda local
  costBreakdown: CostBreakdownItem[];
  costPerPregnancy: number;
  costEffectivenessRatio: number;
  insuranceCoverage?: number; // % cubierto por seguro
  paymentOptions: string[];
}

export interface CostBreakdownItem {
  category: string;
  description: string;
  unitCost: number;
  quantity: number;
  totalCost: number;
}

export interface Timeframe {
  minimumDuration: number; // días
  expectedDuration: number; // días
  maximumDuration: number; // días
  cyclesRequired?: number;
  followUpDuration: number; // días de seguimiento post-tratamiento
}

export interface FollowUpSchedule {
  timepoint: string; // "Week 2", "Month 1", etc.
  type: 'visit' | 'laboratory' | 'imaging' | 'phone';
  description: string;
  objectives: string[];
  required: boolean;
}

export interface TreatmentOutcome {
  outcomeId: string;
  treatmentId: string;
  patientProfile: string; // hash del perfil similar
  successAchieved: boolean;
  timeToSuccess?: number; // días
  complications?: string[];
  patientSatisfaction?: number; // 1-10
  costActual?: number;
  notes?: string;
}

// ===================================================================
// 💊 TREATMENT ENGINE CLASS
// ===================================================================

export class TreatmentEngine {
  private treatmentDatabase: Map<string, TreatmentProtocol> = new Map();
  private outcomeDatabase: TreatmentOutcome[] = [];
  private guidelinesDatabase: Map<string, string[]> = new Map();

  constructor() {
    this.initializeTreatmentDatabase();
    this.initializeGuidelinesDatabase();
    this.loadHistoricalOutcomes();
  }

  /**
   * Analiza un UserInput y genera recomendaciones de tratamiento personalizadas
   */
  generateTreatmentRecommendations(userInput: UserInput): TreatmentRecommendation[] {
    const recommendations: TreatmentRecommendation[] = [];

    // 1. Análisis de línea de tratamiento apropiada
    const treatmentLine = this.determineTreatmentLine(userInput);

    // 2. Evaluación de factores modificables (lifestyle)
    const lifestyleRecommendations = this.generateLifestyleRecommendations(userInput);
    recommendations.push(...lifestyleRecommendations);

    // 3. Tratamientos médicos específicos
    const medicalRecommendations = this.generateMedicalRecommendations(userInput, treatmentLine);
    recommendations.push(...medicalRecommendations);

    // 4. Técnicas de reproducción asistida si indicadas
    const artRecommendations = this.generateARTRecommendations(userInput, treatmentLine);
    recommendations.push(...artRecommendations);

    // 5. Tratamientos quirúrgicos si indicados
    const surgicalRecommendations = this.generateSurgicalRecommendations(userInput);
    recommendations.push(...surgicalRecommendations);

    // 6. Ordenar por prioridad y personalización
    return recommendations
      .sort((a, b) => a.priority - b.priority)
      .slice(0, 8); // Top 8 recomendaciones más relevantes
  }

  /**
   * Calcula tasa de éxito esperada para un tratamiento específico
   */
  calculateExpectedSuccessRate(treatmentId: string, userInput: UserInput): number {
    const baseSuccessRate = this.getBaseTreatmentSuccessRate(treatmentId);
    let personalizedRate = baseSuccessRate;

    // Ajustes basados en factores del paciente
    personalizedRate *= this.getAgeAdjustmentFactor(userInput.age);
    personalizedRate *= this.getBMIAdjustmentFactor(userInput.bmi);
    personalizedRate *= this.getEndometriosisAdjustmentFactor(userInput.endometriosisGrade);
    personalizedRate *= this.getMaleFactorAdjustmentFactor(userInput);
    personalizedRate *= this.getOvarianReserveAdjustmentFactor(userInput.amh);

    return Math.min(personalizedRate, 0.95); // Cap a 95%
  }

  /**
   * Análisis de costo-efectividad para múltiples tratamientos
   */
  analyzeCostEffectiveness(userInput: UserInput, treatmentIds: string[]): TreatmentRecommendation[] {
    return treatmentIds.map(treatmentId => {
      const successRate = this.calculateExpectedSuccessRate(treatmentId, userInput);
      const costAnalysis = this.calculateTreatmentCosts(treatmentId);
      const costPerPregnancy = successRate > 0 ? costAnalysis.estimatedTotalCost / successRate : Infinity;

      return {
        treatmentId,
        name: this.getTreatmentName(treatmentId),
        category: this.getTreatmentCategory(treatmentId),
        line: this.getTreatmentLine(treatmentId),
        priority: this.calculatePriority(treatmentId, userInput),
        expectedSuccessRate: successRate,
        confidenceLevel: this.calculateConfidenceLevel(treatmentId, userInput),
        personalizedRationale: this.generatePersonalizedRationale(treatmentId, userInput),
        contraindicationsCheck: this.checkContraindications(treatmentId, userInput),
        protocol: this.getTreatmentProtocol(treatmentId),
        monitoring: this.generateMonitoringPlan(treatmentId, userInput),
        alternatives: this.getAlternativeTreatments(treatmentId),
        costAnalysis: {
          ...costAnalysis,
          costPerPregnancy,
          costEffectivenessRatio: costPerPregnancy / 1000 // Normalizado
        },
        timeframe: this.getTreatmentTimeframe(treatmentId),
        evidenceLevel: this.getTreatmentEvidenceLevel(treatmentId),
        sourceMedicalGuidelines: this.getTreatmentGuidelines(treatmentId),
        lastUpdated: new Date()
      };
    }).sort((a, b) => a.costAnalysis.costPerPregnancy - b.costAnalysis.costPerPregnancy);
  }

  // ===================================================================
  // 🔬 GENERADORES DE RECOMENDACIONES ESPECÍFICAS
  // ===================================================================

  private generateLifestyleRecommendations(userInput: UserInput): TreatmentRecommendation[] {
    const recommendations: TreatmentRecommendation[] = [];

    // BMI optimization
    if (userInput.bmi && (userInput.bmi < 18.5 || userInput.bmi > 25)) {
      const isUnderweight = userInput.bmi < 18.5;
      recommendations.push({
        treatmentId: isUnderweight ? 'WEIGHT_GAIN' : 'WEIGHT_LOSS',
        name: isUnderweight ? 'Ganancia de Peso Supervisada' : 'Reducción de Peso',
        category: 'lifestyle',
        line: 'first',
        priority: 1,
        expectedSuccessRate: 0.25, // 25% mejora en tasas de embarazo
        confidenceLevel: 0.90,
        personalizedRationale: `BMI ${userInput.bmi?.toFixed(1)} ${isUnderweight ? 'bajo peso' : 'elevado'} reduce significativamente las tasas de embarazo`,
        contraindicationsCheck: this.checkContraindications(isUnderweight ? 'WEIGHT_GAIN' : 'WEIGHT_LOSS', userInput),
        protocol: this.getLifestyleProtocol(isUnderweight ? 'weight_gain' : 'weight_loss'),
        monitoring: this.getLifestyleMonitoring(),
        alternatives: ['NUTRITIONAL_COUNSELING', 'EXERCISE_PROGRAM'],
        costAnalysis: {
          estimatedTotalCost: 800,
          costBreakdown: [
            { category: 'Consulta nutricional', description: '4 sesiones', unitCost: 100, quantity: 4, totalCost: 400 },
            { category: 'Plan alimentario', description: '3 meses', unitCost: 200, quantity: 2, totalCost: 400 }
          ],
          costPerPregnancy: 3200, // 800 / 0.25
          costEffectivenessRatio: 3.2,
          paymentOptions: ['Efectivo', 'Seguro de salud parcial']
        },
        timeframe: {
          minimumDuration: 90,
          expectedDuration: 180,
          maximumDuration: 365,
          followUpDuration: 90
        },
        evidenceLevel: 'A',
        sourceMedicalGuidelines: ['ASRM Practice Committee', 'Cochrane Review 2022'],
        lastUpdated: new Date()
      });
    }

    // Insulin resistance management
    if (userInput.homaIr && userInput.homaIr > 2.5) {
      recommendations.push({
        treatmentId: 'INSULIN_RESISTANCE_MANAGEMENT',
        name: 'Manejo de Resistencia Insulínica',
        category: 'medical',
        line: 'first',
        priority: 2,
        expectedSuccessRate: 0.30,
        confidenceLevel: 0.85,
        personalizedRationale: `HOMA-IR ${userInput.homaIr.toFixed(2)} indica resistencia insulínica que afecta la ovulación`,
        contraindicationsCheck: this.checkContraindications('INSULIN_RESISTANCE_MANAGEMENT', userInput),
        protocol: this.getInsulinResistanceProtocol(),
        monitoring: this.getMetabolicMonitoring(),
        alternatives: ['METFORMIN_THERAPY', 'LIFESTYLE_ONLY'],
        costAnalysis: {
          estimatedTotalCost: 1200,
          costBreakdown: [
            { category: 'Metformina', description: '6 meses', unitCost: 30, quantity: 6, totalCost: 180 },
            { category: 'Consultas médicas', description: '6 consultas', unitCost: 120, quantity: 6, totalCost: 720 },
            { category: 'Laboratorios', description: '4 controles', unitCost: 75, quantity: 4, totalCost: 300 }
          ],
          costPerPregnancy: 4000, // 1200 / 0.30
          costEffectivenessRatio: 4.0,
          paymentOptions: ['Efectivo', 'Seguro de salud']
        },
        timeframe: {
          minimumDuration: 90,
          expectedDuration: 180,
          maximumDuration: 365,
          followUpDuration: 180
        },
        evidenceLevel: 'A',
        sourceMedicalGuidelines: ['Endocrine Society', 'ESHRE Guidelines'],
        lastUpdated: new Date()
      });
    }

    return recommendations;
  }

  private generateMedicalRecommendations(userInput: UserInput, treatmentLine: 'first' | 'second' | 'third'): TreatmentRecommendation[] {
    const recommendations: TreatmentRecommendation[] = [];

    // Ovulation induction para PCOS/anovulación
    if (userInput.hasPcos || (userInput.cycleDuration && userInput.cycleDuration > 35)) {
      if (treatmentLine === 'first') {
        recommendations.push(this.generateClomipheneRecommendation(userInput));
      } else {
        recommendations.push(this.generateLetrozoleRecommendation(userInput));
        recommendations.push(this.generateGonadotropinRecommendation(userInput));
      }
    }

    // Thyroid management
    if (userInput.tsh && userInput.tsh > 2.5) {
      recommendations.push(this.generateThyroidManagementRecommendation(userInput));
    }

    // Hyperprolactinemia management
    if (userInput.prolactin && userInput.prolactin > 25) {
      recommendations.push(this.generateProlactinManagementRecommendation(userInput));
    }

    return recommendations;
  }

  private generateARTRecommendations(userInput: UserInput, treatmentLine: 'first' | 'second' | 'third'): TreatmentRecommendation[] {
    const recommendations: TreatmentRecommendation[] = [];

    // Determine if ART is indicated
    const artIndicated = this.isARTIndicated(userInput, treatmentLine);

    if (artIndicated.iui) {
      recommendations.push(this.generateIUIRecommendation(userInput));
    }

    if (artIndicated.ivf) {
      recommendations.push(this.generateIVFRecommendation(userInput));
    }

    if (artIndicated.ovodonation) {
      recommendations.push(this.generateOvodonationRecommendation(userInput));
    }

    return recommendations;
  }

  private generateSurgicalRecommendations(userInput: UserInput): TreatmentRecommendation[] {
    const recommendations: TreatmentRecommendation[] = [];

    // Laparoscopy para endometriosis
    if (userInput.endometriosisGrade >= 3) {
      recommendations.push(this.generateLaparoscopyRecommendation(userInput));
    }

    // HSG/tubal surgery para factor tubárico
    if (userInput.hasOtb) {
      // No surgical option for bilateral tubal occlusion - direct to IVF
    } else if (userInput.hasPelvicSurgery) {
      recommendations.push(this.generateHSGRecommendation(userInput));
    }

    return recommendations;
  }

  // ===================================================================
  // 🎯 RECOMENDACIONES ESPECÍFICAS DETALLADAS
  // ===================================================================

  private generateClomipheneRecommendation(userInput: UserInput): TreatmentRecommendation {
    const successRate = this.calculateClomipheneSuccessRate(userInput);
    
    return {
      treatmentId: 'CLOMIPHENE_CITRATE',
      name: 'Citrato de Clomifeno',
      category: 'medical',
      line: 'first',
      priority: 1,
      expectedSuccessRate: successRate,
      confidenceLevel: 0.85,
      personalizedRationale: 'Primera línea para inducción de ovulación en anovulación/PCOS',
      contraindicationsCheck: this.checkContraindications('CLOMIPHENE_CITRATE', userInput),
      protocol: {
        protocolId: 'CLOMIPHENE_STANDARD',
        name: 'Protocolo Estándar Clomifeno',
        description: 'Inducción ovulación con clomifeno 50-150mg días 3-7 del ciclo',
        steps: [
          {
            stepNumber: 1,
            name: 'Evaluación basal',
            description: 'Ecografía basal y laboratorios día 3',
            duration: 1,
            monitoringRequired: true,
            criticalStep: true
          },
          {
            stepNumber: 2,
            name: 'Administración clomifeno',
            description: 'Clomifeno 50mg vía oral días 3-7',
            duration: 5,
            monitoringRequired: false,
            criticalStep: true
          },
          {
            stepNumber: 3,
            name: 'Monitoreo folicular',
            description: 'Ecografía día 12-14 del ciclo',
            duration: 1,
            monitoringRequired: true,
            criticalStep: true
          }
        ],
        dosing: [
          {
            medicationName: 'Citrato de Clomifeno',
            dose: '50-150mg',
            frequency: 'Una vez al día',
            route: 'oral',
            duration: 5,
            instructions: 'Tomar días 3-7 del ciclo menstrual',
            sideEffects: ['Sofocos', 'Cambios visuales', 'Quistes ováricos'],
            monitoringParameters: ['Desarrollo folicular', 'Endometrio']
          }
        ],
        precautions: ['Embarazo múltiple 8%', 'Síndrome hiperestimulación leve'],
        contraindications: ['Embarazo', 'Quistes ováricos >5cm', 'Disfunción hepática'],
        expectedDuration: 28,
        followUpSchedule: [
          {
            timepoint: 'Día 12-14',
            type: 'imaging',
            description: 'Ecografía folicular',
            objectives: ['Confirmar ovulación', 'Evaluar respuesta'],
            required: true
          }
        ]
      },
      monitoring: {
        frequency: 'weekly',
        parameters: [
          {
            parameterId: 'FOLLICULAR_SIZE',
            name: 'Tamaño folicular',
            method: 'imaging',
            frequency: 'Día 12-14 del ciclo',
            targetRange: { min: 18, max: 25 },
            alertThresholds: { high: 30 }
          }
        ],
        alertCriteria: [
          {
            criterionId: 'OHSS_RISK',
            description: '>3 folículos >18mm',
            severity: 'warning',
            action: 'Considerar cancelación ciclo',
            responsibleClinician: 'Reproductive Endocrinologist'
          }
        ],
        adjustmentProtocol: 'Incrementar dosis 50mg si no ovulación',
        emergencyContacts: ['Dr. Fertilidad 24/7']
      },
      alternatives: ['LETROZOLE', 'GONADOTROPINS'],
      costAnalysis: {
        estimatedTotalCost: 800,
        costBreakdown: [
          { category: 'Medicamento', description: 'Clomifeno 3 ciclos', unitCost: 50, quantity: 3, totalCost: 150 },
          { category: 'Consultas', description: '6 consultas', unitCost: 80, quantity: 6, totalCost: 480 },
          { category: 'Ecografías', description: '6 ecografías', unitCost: 30, quantity: 6, totalCost: 180 }
        ],
        costPerPregnancy: successRate > 0 ? 800 / successRate : 4000,
        costEffectivenessRatio: 2.0,
        paymentOptions: ['Efectivo', 'Seguro de salud']
      },
      timeframe: {
        minimumDuration: 28,
        expectedDuration: 84, // 3 cycles
        maximumDuration: 168, // 6 cycles
        cyclesRequired: 3,
        followUpDuration: 30
      },
      evidenceLevel: 'A',
      sourceMedicalGuidelines: ['ASRM Practice Committee', 'Cochrane Database 2021'],
      lastUpdated: new Date()
    };
  }

  private generateIVFRecommendation(userInput: UserInput): TreatmentRecommendation {
    const successRate = this.calculateIVFSuccessRate(userInput);
    
    return {
      treatmentId: 'IVF_ICSI',
      name: 'Fertilización In Vitro (FIV/ICSI)',
      category: 'art',
      line: 'second',
      priority: 3,
      expectedSuccessRate: successRate,
      confidenceLevel: 0.92,
      personalizedRationale: this.generateIVFRationale(userInput),
      contraindicationsCheck: this.checkContraindications('IVF_ICSI', userInput),
      protocol: this.getIVFProtocol(userInput),
      monitoring: this.getIVFMonitoring(),
      alternatives: ['IUI', 'OVODONATION'],
      costAnalysis: {
        estimatedTotalCost: 12000,
        costBreakdown: [
          { category: 'Procedimiento FIV', description: '1 ciclo completo', unitCost: 8000, quantity: 1, totalCost: 8000 },
          { category: 'Medicamentos', description: 'Estimulación ovárica', unitCost: 2500, quantity: 1, totalCost: 2500 },
          { category: 'Laboratorio', description: 'ICSI y cultivo', unitCost: 1500, quantity: 1, totalCost: 1500 }
        ],
        costPerPregnancy: successRate > 0 ? 12000 / successRate : 24000,
        costEffectivenessRatio: 5.5,
        insuranceCoverage: 30,
        paymentOptions: ['Efectivo', 'Financiamiento', 'Seguro parcial']
      },
      timeframe: {
        minimumDuration: 45,
        expectedDuration: 60,
        maximumDuration: 90,
        cyclesRequired: 1,
        followUpDuration: 90
      },
      evidenceLevel: 'A',
      sourceMedicalGuidelines: ['SART Guidelines', 'ESHRE Good Practice', 'ASRM Committee Opinion'],
      lastUpdated: new Date()
    };
  }

  // ===================================================================
  // 🧮 CÁLCULOS DE TASAS DE ÉXITO PERSONALIZADAS
  // ===================================================================

  private calculateClomipheneSuccessRate(userInput: UserInput): number {
    let baseRate = 0.20; // 20% base pregnancy rate per cycle

    // Age adjustment
    if (userInput.age >= 35) baseRate *= 0.8;
    if (userInput.age >= 40) baseRate *= 0.6;

    // BMI adjustment
    if (userInput.bmi && userInput.bmi > 30) baseRate *= 0.75;
    if (userInput.bmi && userInput.bmi > 35) baseRate *= 0.65;

    // PCOS severity
    if (userInput.hasPcos && userInput.homaIr && userInput.homaIr > 3.5) baseRate *= 0.7;

    // Duration of infertility
    if (userInput.infertilityDuration && userInput.infertilityDuration > 36) baseRate *= 0.8;

    return Math.max(baseRate, 0.05); // Minimum 5%
  }

  private calculateIVFSuccessRate(userInput: UserInput): number {
    let baseRate = 0.45; // 45% base success rate

    // Strong age effect in IVF
    if (userInput.age >= 35) baseRate *= 0.85;
    if (userInput.age >= 38) baseRate *= 0.70;
    if (userInput.age >= 40) baseRate *= 0.50;
    if (userInput.age >= 42) baseRate *= 0.25;

    // AMH effect
    if (userInput.amh !== undefined) {
      if (userInput.amh < 0.5) baseRate *= 0.4;
      else if (userInput.amh < 1.0) baseRate *= 0.6;
      else if (userInput.amh > 4.0) baseRate *= 1.1; // Better response
    }

    // BMI effect
    if (userInput.bmi && userInput.bmi > 35) baseRate *= 0.75;

    // Male factor adjustment
    if (userInput.spermConcentration && userInput.spermConcentration < 5) baseRate *= 0.85;

    // Endometriosis adjustment
    if (userInput.endometriosisGrade >= 3) baseRate *= 0.80;

    return Math.min(Math.max(baseRate, 0.05), 0.85); // Between 5-85%
  }

  // ===================================================================
  // 🔍 UTILIDADES Y HELPERS
  // ===================================================================

  private determineTreatmentLine(userInput: UserInput): 'first' | 'second' | 'third' {
    // Factores que indican líneas avanzadas de tratamiento
    let advancedFactors = 0;

    if (userInput.age >= 38) advancedFactors++;
    if (userInput.endometriosisGrade >= 3) advancedFactors++;
    if (userInput.hasOtb) advancedFactors += 2; // Peso mayor
    if (userInput.infertilityDuration && userInput.infertilityDuration >= 36) advancedFactors++;
    if (userInput.amh && userInput.amh < 1.0) advancedFactors++;

    if (advancedFactors >= 3) return 'third';
    if (advancedFactors >= 1) return 'second';
    return 'first';
  }

  private isARTIndicated(userInput: UserInput, treatmentLine: 'first' | 'second' | 'third'): {
    iui: boolean;
    ivf: boolean;
    ovodonation: boolean;
  } {
    return {
      iui: treatmentLine === 'second' && !userInput.hasOtb && userInput.age < 40,
      ivf: treatmentLine === 'second' || treatmentLine === 'third' || userInput.hasOtb,
      ovodonation: userInput.age >= 43 || (userInput.amh !== undefined && userInput.amh < 0.5)
    };
  }

  private getAgeAdjustmentFactor(age: number): number {
    if (age < 35) return 1.0;
    if (age < 38) return 0.9;
    if (age < 40) return 0.8;
    if (age < 42) return 0.6;
    return 0.4;
  }

  private getBMIAdjustmentFactor(bmi: number | null): number {
    if (!bmi) return 1.0;
    if (bmi < 18.5) return 0.85;
    if (bmi <= 25) return 1.0;
    if (bmi <= 30) return 0.9;
    if (bmi <= 35) return 0.8;
    return 0.7;
  }

  private getEndometriosisAdjustmentFactor(grade: number): number {
    if (grade === 0) return 1.0;
    if (grade <= 2) return 0.95;
    return 0.85;
  }

  private getMaleFactorAdjustmentFactor(userInput: UserInput): number {
    let factor = 1.0;
    if (userInput.spermConcentration && userInput.spermConcentration < 15) factor *= 0.9;
    if (userInput.spermProgressiveMotility && userInput.spermProgressiveMotility < 32) factor *= 0.95;
    return factor;
  }

  private getOvarianReserveAdjustmentFactor(amh: number | undefined): number {
    if (!amh) return 1.0;
    if (amh < 0.5) return 0.5;
    if (amh < 1.0) return 0.7;
    if (amh <= 4.0) return 1.0;
    return 1.1; // High AMH might be better for some treatments
  }

  // ===================================================================
  // 🏗️ MÉTODOS DE INICIALIZACIÓN Y HELPERS
  // ===================================================================

  private initializeTreatmentDatabase(): void {
    // Initialize treatment protocols database
    // This would be populated with actual treatment protocols
  }

  private initializeGuidelinesDatabase(): void {
    // Initialize medical guidelines database
    this.guidelinesDatabase.set('CLOMIPHENE_CITRATE', [
      'ASRM Practice Committee Opinion',
      'Cochrane Database Systematic Review 2021',
      'ESHRE Guideline on Ovulation Induction'
    ]);
  }

  private loadHistoricalOutcomes(): void {
    // Load historical treatment outcomes for machine learning
    // This would be populated from a real database
  }

  // Placeholder methods - these would have full implementations
  private getBaseTreatmentSuccessRate(treatmentId: string): number {
    const rates: { [key: string]: number } = {
      'CLOMIPHENE_CITRATE': 0.20,
      'LETROZOLE': 0.25,
      'IVF_ICSI': 0.45,
      'IUI': 0.15,
      'WEIGHT_LOSS': 0.25
    };
    return rates[treatmentId] || 0.10;
  }

  private getTreatmentName(treatmentId: string): string {
    const names: { [key: string]: string } = {
      'CLOMIPHENE_CITRATE': 'Citrato de Clomifeno',
      'LETROZOLE': 'Letrozol',
      'IVF_ICSI': 'FIV/ICSI'
    };
    return names[treatmentId] || treatmentId;
  }

  private getTreatmentCategory(treatmentId: string): 'lifestyle' | 'medical' | 'surgical' | 'art' {
    const categories: { [key: string]: 'lifestyle' | 'medical' | 'surgical' | 'art' } = {
      'WEIGHT_LOSS': 'lifestyle',
      'CLOMIPHENE_CITRATE': 'medical',
      'IVF_ICSI': 'art'
    };
    return categories[treatmentId] || 'medical';
  }

  private getTreatmentLine(treatmentId: string): 'first' | 'second' | 'third' | 'experimental' {
    const lines: { [key: string]: 'first' | 'second' | 'third' | 'experimental' } = {
      'CLOMIPHENE_CITRATE': 'first',
      'LETROZOLE': 'first',
      'IVF_ICSI': 'second'
    };
    return lines[treatmentId] || 'first';
  }

  private calculatePriority(treatmentId: string, userInput: UserInput): number {
    // Complex priority calculation based on patient factors
    return 1; // Placeholder
  }

  private calculateConfidenceLevel(treatmentId: string, userInput: UserInput): number {
    // Confidence calculation based on available data
    return 0.8; // Placeholder
  }

  private generatePersonalizedRationale(treatmentId: string, userInput: UserInput): string {
    return `Tratamiento personalizado basado en perfil clínico individual`; // Placeholder
  }

  private checkContraindications(treatmentId: string, userInput: UserInput): ContraindicationResult {
    return {
      hasContraindications: false,
      absoluteContraindications: [],
      relativeContraindications: [],
      riskLevel: 'low',
      mitigationStrategies: []
    }; // Placeholder
  }

  private getTreatmentProtocol(treatmentId: string): TreatmentProtocol {
    return {
      protocolId: treatmentId,
      name: this.getTreatmentName(treatmentId),
      description: 'Protocolo estándar',
      steps: [],
      precautions: [],
      contraindications: [],
      expectedDuration: 30,
      followUpSchedule: []
    }; // Placeholder
  }

  private generateMonitoringPlan(treatmentId: string, userInput: UserInput): MonitoringPlan {
    return {
      frequency: 'weekly',
      parameters: [],
      alertCriteria: [],
      adjustmentProtocol: 'Ajuste según respuesta',
      emergencyContacts: []
    }; // Placeholder
  }

  private getAlternativeTreatments(treatmentId: string): string[] {
    return []; // Placeholder
  }

  private calculateTreatmentCosts(treatmentId: string): CostAnalysis {
    return {
      estimatedTotalCost: 1000,
      costBreakdown: [],
      costPerPregnancy: 2000,
      costEffectivenessRatio: 2.0,
      paymentOptions: ['Efectivo']
    }; // Placeholder
  }

  private getTreatmentTimeframe(treatmentId: string): Timeframe {
    return {
      minimumDuration: 30,
      expectedDuration: 60,
      maximumDuration: 90,
      followUpDuration: 30
    }; // Placeholder
  }

  private getTreatmentEvidenceLevel(treatmentId: string): 'A' | 'B' | 'C' | 'D' {
    return 'A'; // Placeholder
  }

  private getTreatmentGuidelines(treatmentId: string): string[] {
    return this.guidelinesDatabase.get(treatmentId) || [];
  }

  // Additional placeholder methods for complete implementations
  private getLifestyleProtocol(type: string): TreatmentProtocol { return {} as TreatmentProtocol; }
  private getLifestyleMonitoring(): MonitoringPlan { return {} as MonitoringPlan; }
  private getInsulinResistanceProtocol(): TreatmentProtocol { return {} as TreatmentProtocol; }
  private getMetabolicMonitoring(): MonitoringPlan { return {} as MonitoringPlan; }
  private generateLetrozoleRecommendation(userInput: UserInput): TreatmentRecommendation { return {} as TreatmentRecommendation; }
  private generateGonadotropinRecommendation(userInput: UserInput): TreatmentRecommendation { return {} as TreatmentRecommendation; }
  private generateThyroidManagementRecommendation(userInput: UserInput): TreatmentRecommendation { return {} as TreatmentRecommendation; }
  private generateProlactinManagementRecommendation(userInput: UserInput): TreatmentRecommendation { return {} as TreatmentRecommendation; }
  private generateIUIRecommendation(userInput: UserInput): TreatmentRecommendation { return {} as TreatmentRecommendation; }
  private generateOvodonationRecommendation(userInput: UserInput): TreatmentRecommendation { return {} as TreatmentRecommendation; }
  private generateLaparoscopyRecommendation(userInput: UserInput): TreatmentRecommendation { return {} as TreatmentRecommendation; }
  private generateHSGRecommendation(userInput: UserInput): TreatmentRecommendation { return {} as TreatmentRecommendation; }
  private generateIVFRationale(userInput: UserInput): string { return 'Protocolo personalizado FIV'; }
  private getIVFProtocol(userInput: UserInput): TreatmentProtocol { return {} as TreatmentProtocol; }
  private getIVFMonitoring(): MonitoringPlan { return {} as MonitoringPlan; }
}

/**
 * Singleton instance
 */
let treatmentEngineInstance: TreatmentEngine | null = null;

export function getTreatmentEngine(): TreatmentEngine {
  if (!treatmentEngineInstance) {
    treatmentEngineInstance = new TreatmentEngine();
  }
  return treatmentEngineInstance;
}
