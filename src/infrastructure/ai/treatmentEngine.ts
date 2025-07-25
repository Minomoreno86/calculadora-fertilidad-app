/**
 * 💊 TREATMENT ENGINE V12.0 - AI TREATMENT OPTIMIZATION MOCK
 * 
 * Motor de tratamientos integrado con Evidence-Based Medicine
 * Versión mock compatible con workers especializados
 */

// 🎯 TIPOS ESPECIALIZADOS PARA TRATAMIENTOS
export type EvidenceLevel = 'expert_opinion' | 'case_series' | 'cohort' | 'rct' | 'meta_analysis';
export type TreatmentCategory = 'lifestyle' | 'medication' | 'surgical' | 'assisted_reproductive';
export type SeverityLevel = 'mild' | 'moderate' | 'severe';

export interface PatientProfile {
  age: number;
  bmi?: number;
  medicalHistory: string[];
  currentMedications: string[];
  allergies?: string[];
  fertilityGoals: 'conception' | 'pregnancy_maintenance' | 'symptom_management';
  reproductiveHistory?: {
    pregnancies: number;
    miscarriages?: number;
    livebirths?: number;
  };
}

export interface TreatmentProtocol {
  name: string;
  category: TreatmentCategory;
  interventions: string[];
  dosage?: string;
  duration?: string;
  effectiveness: number; // 0-1 scale
  evidence: EvidenceLevel;
  contraindications: string[];
  sideEffects: string[];
  cost?: 'low' | 'moderate' | 'high' | 'very_high';
  monitoring?: string[];
}

export interface TreatmentSuggestion {
  primary: TreatmentProtocol[];
  secondary: TreatmentProtocol[];
  alternative: TreatmentProtocol[];
  overallEffectiveness: number;
  recommendedSequence: string[];
  patientEducation: string[];
}

export interface TreatmentValidation {
  valid: boolean;
  confidence: number;
  evidence: EvidenceLevel;
  warnings: string[];
  interactions?: string[];
  contraindications?: string[];
  recommendations?: string[];
}

export interface TreatmentOutcomes {
  response: 'excellent' | 'good' | 'partial' | 'poor' | 'no_response';
  timeToResponse?: number; // weeks
  sideEffects?: string[];
  biomarkerChanges?: Record<string, number>;
  patientSatisfaction?: number; // 1-10 scale
  qualityOfLife?: number; // 1-10 scale
}

export interface TreatmentOptimization {
  optimized: boolean;
  adjustments: string[];
  confidence: number;
  newProtocol?: TreatmentProtocol;
  reasonsForChange: string[];
  expectedImprovement: number;
}

export class TreatmentEngine {
  private readonly treatmentDatabase: Map<string, TreatmentProtocol> = new Map();

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    // Mock treatment database with comprehensive protocols
    this.treatmentDatabase.set('lifestyle_pcos', {
      name: 'Modificaciones del estilo de vida para PCOS',
      category: 'lifestyle',
      interventions: [
        'Dieta mediterránea baja en índice glucémico',
        'Ejercicio aeróbico 150 min/semana',
        'Entrenamiento de resistencia 2-3x/semana',
        'Manejo del estrés y mindfulness'
      ],
      effectiveness: 0.70,
      evidence: 'meta_analysis',
      contraindications: ['Trastornos alimentarios activos'],
      sideEffects: ['Fatiga inicial', 'Cambios del estado de ánimo'],
      cost: 'low',
      monitoring: ['Peso mensual', 'Circunferencia abdominal', 'Adherencia al programa']
    });

    this.treatmentDatabase.set('metformin_pcos', {
      name: 'Metformina para PCOS',
      category: 'medication',
      interventions: ['Metformina 500-2000mg/día'],
      dosage: '500mg 2-3 veces al día con alimentos',
      duration: '3-6 meses mínimo',
      effectiveness: 0.85,
      evidence: 'meta_analysis',
      contraindications: [
        'Insuficiencia renal (eGFR <30)',
        'Insuficiencia hepática',
        'Acidosis metabólica'
      ],
      sideEffects: [
        'Náuseas (30%)',
        'Diarrea (20%)',
        'Dolor abdominal (15%)',
        'Sabor metálico'
      ],
      cost: 'low',
      monitoring: ['Función renal cada 3 meses', 'Vitamina B12 anual']
    });

    this.treatmentDatabase.set('letrozole_ovulation', {
      name: 'Letrozol para inducción de ovulación',
      category: 'medication',
      interventions: ['Letrozol 2.5-7.5mg días 3-7 del ciclo'],
      dosage: '2.5mg inicial, incrementar según respuesta',
      duration: 'Hasta 6 ciclos',
      effectiveness: 0.88,
      evidence: 'rct',
      contraindications: [
        'Embarazo',
        'Insuficiencia hepática severa',
        'Osteoporosis severa'
      ],
      sideEffects: [
        'Sofocos (25%)',
        'Fatiga (15%)',
        'Mareos (10%)',
        'Embarazo múltiple (8%)'
      ],
      cost: 'moderate',
      monitoring: [
        'Ecografía folicular',
        'Monitoreo hormonal',
        'Prueba de embarazo'
      ]
    });

    console.log('💊 TreatmentEngine V12.0: Mock initialized with comprehensive protocols');
  }

  public async suggestTreatments(
    _diagnosis: string, 
    _patientProfile: PatientProfile
  ): Promise<TreatmentSuggestion> {
    // Mock treatment suggestion with comprehensive protocols
    const primaryTreatments: TreatmentProtocol[] = [
      this.treatmentDatabase.get('lifestyle_pcos')!,
      this.treatmentDatabase.get('metformin_pcos')!
    ];

    const secondaryTreatments: TreatmentProtocol[] = [
      this.treatmentDatabase.get('letrozole_ovulation')!
    ];

    const alternativeTreatments: TreatmentProtocol[] = [
      {
        name: 'Inositol para PCOS',
        category: 'medication',
        interventions: ['Myo-inositol 2g + D-chiro-inositol 50mg BID'],
        effectiveness: 0.72,
        evidence: 'rct',
        contraindications: ['Hipersensibilidad conocida'],
        sideEffects: ['Náuseas leves', 'Mareos ocasionales'],
        cost: 'moderate'
      }
    ];

    return {
      primary: primaryTreatments,
      secondary: secondaryTreatments,
      alternative: alternativeTreatments,
      overallEffectiveness: 0.80,
      recommendedSequence: [
        '1. Iniciar modificaciones del estilo de vida',
        '2. Agregar metformina si no hay contraindicaciones',
        '3. Considerar inducción de ovulación después de 3 meses',
        '4. Evaluar respuesta y ajustar según necesidad'
      ],
      patientEducation: [
        'Importancia de la adherencia al tratamiento',
        'Reconocimiento de efectos secundarios',
        'Cuándo contactar al profesional de salud',
        'Expectativas realistas de tiempo de respuesta'
      ]
    };
  }

  public async validateTreatment(_treatment: TreatmentProtocol): Promise<TreatmentValidation> {
    // Mock treatment validation with comprehensive assessment
    return {
      valid: true,
      confidence: 0.90,
      evidence: 'meta_analysis',
      warnings: [
        'Monitorear función renal durante tratamiento con metformina',
        'Seguimiento ecográfico necesario durante inducción de ovulación'
      ],
      interactions: [
        'Metformina + contrastes yodados: suspender 48h antes de procedimientos',
        'Letrozol + tamoxifeno: evitar uso concomitante'
      ],
      contraindications: [
        'Embarazo confirmado o sospechado',
        'Insuficiencia renal moderada-severa',
        'Trastornos alimentarios no controlados'
      ],
      recommendations: [
        'Iniciar con dosis mínima efectiva',
        'Titulación gradual según tolerancia',
        'Monitoreo regular de parámetros de seguridad'
      ]
    };
  }

  public async optimizeTreatment(
    _treatment: TreatmentProtocol, 
    _outcomes: TreatmentOutcomes
  ): Promise<TreatmentOptimization> {
    // Mock treatment optimization based on outcomes
    return {
      optimized: true,
      adjustments: [
        'Incrementar dosis de metformina a 1000mg BID',
        'Agregar suplementación con vitamina D',
        'Intensificar programa de ejercicio',
        'Considerar derivación a nutricionista especializada'
      ],
      confidence: 0.85,
      newProtocol: {
        name: 'Protocolo PCOS optimizado',
        category: 'medication',
        interventions: [
          'Metformina 1000mg BID',
          'Vitamina D 2000 UI/día',
          'Inositol 2g BID',
          'Dieta mediterránea personalizada'
        ],
        effectiveness: 0.88,
        evidence: 'rct',
        contraindications: ['Insuficiencia renal'],
        sideEffects: ['Náuseas leves', 'Molestias gastrointestinales']
      },
      reasonsForChange: [
        'Respuesta parcial al tratamiento inicial',
        'Tolerancia adecuada a metformina',
        'Deficiencia de vitamina D detectada',
        'Motivación alta para cambios de estilo de vida'
      ],
      expectedImprovement: 0.25
    };
  }

  /**
   * 📊 Análisis de adherencia al tratamiento
   */
  public async analyzeAdherence(patientData: {
    prescribedTreatment: TreatmentProtocol;
    actualCompliance: number; // 0-1 scale
    missedDoses?: number;
    sideEffectsReported?: string[];
    reasonsForNonCompliance?: string[];
  }): Promise<{
    adherenceScore: number;
    riskFactors: string[];
    interventions: string[];
    predictedOutcome: number;
  }> {
    return {
      adherenceScore: patientData.actualCompliance,
      riskFactors: [
        'Efectos secundarios gastrointestinales',
        'Complejidad del régimen de dosificación',
        'Falta de mejoría percibida'
      ],
      interventions: [
        'Educación personalizada sobre beneficios',
        'Simplificación del régimen posológico',
        'Apoyo psicológico y motivacional',
        'Sistemas de recordatorio digital'
      ],
      predictedOutcome: patientData.actualCompliance * 0.9
    };
  }

  /**
   * 🎯 Evaluación de costo-efectividad
   */
  public async evaluateCostEffectiveness(treatments: TreatmentProtocol[]): Promise<{
    ranking: Array<{
      treatment: string;
      costEffectivenessRatio: number;
      qualityAdjustedLifeYears: number;
      incrementalCost: number;
    }>;
    recommendation: string;
  }> {
    const ranking = treatments.map(treatment => {
      // Calculate cost multiplier
      let costMultiplier = 1; // default for 'low'
      if (treatment.cost === 'moderate') {
        costMultiplier = 2;
      } else if (treatment.cost === 'high' || treatment.cost === 'very_high') {
        costMultiplier = 4;
      }

      // Calculate incremental cost
      let incrementalCost = 100; // default for 'low'
      if (treatment.cost === 'moderate') {
        incrementalCost = 500;
      } else if (treatment.cost === 'high' || treatment.cost === 'very_high') {
        incrementalCost = 2000;
      }

      return {
        treatment: treatment.name,
        costEffectivenessRatio: treatment.effectiveness / costMultiplier,
        qualityAdjustedLifeYears: treatment.effectiveness * 0.8,
        incrementalCost
      };
    });

    return {
      ranking,
      recommendation: 'Priorizar tratamientos con mayor ratio costo-efectividad y evidencia robusta'
    };
  }

  /**
   * ✅ Verificar disponibilidad del motor
   */
  public isReady(): boolean {
    return this.treatmentDatabase.size > 0;
  }

  /**
   * 📋 Obtener protocolo específico
   */
  public getProtocol(protocolName: string): TreatmentProtocol | undefined {
    return this.treatmentDatabase.get(protocolName);
  }

  /**
   * 📊 Listar todos los protocolos disponibles
   */
  public getAvailableProtocols(): string[] {
    return Array.from(this.treatmentDatabase.keys());
  }
}

// Singleton instance
let instance: TreatmentEngine | null = null;

export function getTreatmentEngine(): TreatmentEngine {
  instance ??= new TreatmentEngine();
  return instance;
}
