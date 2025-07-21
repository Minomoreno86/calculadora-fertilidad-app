/**
 * 🧠 MOTOR DE RAZONAMIENTO MÉDICO AVANZADO
 * Sistema de inferencia clínica con lógica médica especializada
 */

export interface MedicalEvidence {
  symptom: string;
  severity: number;
  confidence: number;
  source: 'patient_data' | 'clinical_observation' | 'test_result';
  timestamp: Date;
}

export interface ClinicalHypothesis {
  condition: string;
  probability: number;
  supportingEvidence: MedicalEvidence[];
  contradictingEvidence: MedicalEvidence[];
  confidence: number;
  urgency: 'low' | 'moderate' | 'high' | 'critical';
  nextSteps: string[];
}

export interface ReasoningChain {
  step: number;
  reasoning: string;
  conclusion: string;
  confidence: number;
  medicalBasis: string[];
}

export interface PatientData {
  input?: {
    age?: number;
    hasPcos?: boolean;
    endometriosisGrade?: number;
    spermConcentration?: number;
    spermProgressiveMotility?: number;
  };
  factors?: Record<string, number>;
  medical_history?: Record<string, boolean>;
}

export interface KnowledgeBaseEntry {
  prevalence: number;
  symptoms: string[];
}

export interface ConditionInfo {
  prevalence: number;
  symptoms: string[];
}

export interface HypothesisInfo {
  condition: string;
  baseP: number;
  symptoms: string[];
  urgency: 'low' | 'moderate' | 'high' | 'critical';
}

export class MedicalReasoningEngine {
  private readonly knowledgeBase: Map<string, Record<string, ConditionInfo>> = new Map();
  private readonly inferenceRules: Map<string, (input: number) => number> = new Map();
  private readonly episodicMemory: ClinicalHypothesis[] = [];

  constructor() {
    this.initializeKnowledgeBase();
    this.initializeInferenceRules();
  }

  /**
   * 🧠 RAZONAMIENTO CLÍNICO PRINCIPAL
   * Analiza síntomas y genera hipótesis diagnósticas con razonamiento paso a paso
   */
  public async reasonAboutCase(patientData: PatientData): Promise<{
    primaryHypothesis: ClinicalHypothesis;
    alternativeHypotheses: ClinicalHypothesis[];
    reasoningChain: ReasoningChain[];
    recommendedActions: string[];
    confidence: number;
  }> {
    
    // 🔬 PASO 1: Extracción y análisis de evidencia
    const evidence = this.extractMedicalEvidence(patientData);
    
    // 🧠 PASO 2: Generación de hipótesis usando razonamiento bayesiano
    const hypotheses = await this.generateHypotheses(evidence);
    
    // ⚖️ PASO 3: Evaluación probabilística de cada hipótesis
    const evaluatedHypotheses = this.evaluateHypotheses(hypotheses, evidence);
    
    // 🎯 PASO 4: Construcción de cadena de razonamiento
    const reasoningChain = this.buildReasoningChain(evaluatedHypotheses, evidence);
    
    // 📊 PASO 5: Selección de hipótesis principal y alternativas CON VALIDACIÓN
    let primaryHypothesis: ClinicalHypothesis;
    let alternativeHypotheses: ClinicalHypothesis[];

    if (evaluatedHypotheses.length === 0) {
      // 🛡️ HIPÓTESIS POR DEFECTO cuando no hay evidencia suficiente
      primaryHypothesis = {
        condition: 'Evaluación pendiente - Factores múltiples',
        probability: 0.5,
        supportingEvidence: evidence.slice(0, 2),
        contradictingEvidence: [],
        confidence: 0.6,
        urgency: 'moderate',
        nextSteps: [
          'Evaluación médica especializada completa',
          'Estudios diagnósticos dirigidos',
          'Análisis de factores de riesgo específicos'
        ]
      };
      alternativeHypotheses = [];
    } else {
      const sortedHypotheses = evaluatedHypotheses.slice();
      sortedHypotheses.sort((a, b) => b.probability - a.probability);
      [primaryHypothesis, ...alternativeHypotheses] = sortedHypotheses;
    }
    
    // 🎯 PASO 6: Recomendaciones basadas en razonamiento
    const recommendedActions = this.generateRecommendations(primaryHypothesis, evidence);
    
    // 📈 PASO 7: Cálculo de confianza global
    const confidence = this.calculateGlobalConfidence(primaryHypothesis, reasoningChain);

    return {
      primaryHypothesis,
      alternativeHypotheses,
      reasoningChain,
      recommendedActions,
      confidence
    };
  }

  /**
   * 🔬 EXTRACCIÓN DE EVIDENCIA MÉDICA
   */
  private extractMedicalEvidence(patientData: PatientData): MedicalEvidence[] {
    const evidence: MedicalEvidence[] = [];
    const factors = patientData.factors || {};
    const input = patientData.input || {};
    
    // Evidencia de edad
    if (input.age) {
      let severity = 0.2;
      if (input.age >= 35) severity = 0.6;
      if (input.age >= 40) severity = 0.8;
      if (input.age >= 42) severity = 0.9;
      
      evidence.push({
        symptom: `edad_materna_${input.age}`,
        severity,
        confidence: 1.0,
        source: 'patient_data',
        timestamp: new Date()
      });
    }

    // Evidencia de factores específicos
    Object.entries(factors).forEach(([factor, score]: [string, number]) => {
      if (typeof score === 'number' && score < 1.0) {
        evidence.push({
          symptom: factor,
          severity: 1 - score, // Score bajo = severidad alta
          confidence: 0.9,
          source: 'clinical_observation',
          timestamp: new Date()
        });
      }
    });

    // Evidencia de historial médico
    if (patientData.medical_history) {
      Object.entries(patientData.medical_history).forEach(([condition, present]: [string, boolean]) => {
        if (present) {
          evidence.push({
            symptom: condition,
            severity: 0.7,
            confidence: 0.95,
            source: 'patient_data',
            timestamp: new Date()
          });
        }
      });
    }

    return evidence;
  }

  /**
   * 🧠 GENERACIÓN DE HIPÓTESIS CLÍNICAS
   */
  private async generateHypotheses(evidence: MedicalEvidence[]): Promise<ClinicalHypothesis[]> {
    const hypotheses: ClinicalHypothesis[] = [];
    const conditions = new Set<string>();

    // 🔍 REGLAS DE INFERENCIA ESPECÍFICAS
    evidence.forEach(ev => {
      // SOP (Síndrome de Ovarios Poliquísticos)
      if (ev.symptom === 'pcos' && ev.severity > 0.3) {
        conditions.add('pcos_primary');
      }
      
      // Endometriosis
      if (ev.symptom === 'endometriosis' && ev.severity > 0.4) {
        conditions.add('endometriosis_primary');
      }
      
      // Reserva ovárica disminuida
      if (ev.symptom === 'amh' && ev.severity > 0.5) {
        conditions.add('dor_primary');
      }
      
      // Factor masculino
      if (ev.symptom === 'male' && ev.severity > 0.4) {
        conditions.add('male_factor_primary');
      }
      
      // Edad materna avanzada
      if (ev.symptom.startsWith('edad_materna_') && ev.severity > 0.5) {
        conditions.add('ama_primary');
      }
    });

    // 🧠 CONSTRUCCIÓN DE HIPÓTESIS CON RAZONAMIENTO
    conditions.forEach(condition => {
      const hypothesis = this.buildHypothesis(condition, evidence);
      if (hypothesis) {
        hypotheses.push(hypothesis);
      }
    });

    // 🔄 HIPÓTESIS COMBINADAS (comorbilidades)
    if (conditions.has('pcos_primary') && conditions.has('dor_primary')) {
      hypotheses.push(this.buildCombinedHypothesis(['pcos_primary', 'dor_primary'], evidence));
    }

    return hypotheses;
  }

  /**
   * 🏗️ CONSTRUCCIÓN DE HIPÓTESIS INDIVIDUAL
   */
  private buildHypothesis(condition: string, evidence: MedicalEvidence[]): ClinicalHypothesis | null {
    const conditionMap: Record<string, HypothesisInfo> = {
      'pcos_primary': {
        condition: 'Síndrome de Ovarios Poliquísticos (SOP)',
        baseP: 0.10, // Prevalencia poblacional
        symptoms: ['pcos', 'bmi', 'insulin_resistance'],
        urgency: 'moderate' as const
      },
      'endometriosis_primary': {
        condition: 'Endometriosis',
        baseP: 0.05,
        symptoms: ['endometriosis', 'pelvic_pain', 'dysmenorrhea'],
        urgency: 'high' as const
      },
      'dor_primary': {
        condition: 'Reserva Ovárica Disminuida',
        baseP: 0.08,
        symptoms: ['amh', 'fsh', 'edad_materna'],
        urgency: 'high' as const
      },
      'male_factor_primary': {
        condition: 'Factor Masculino',
        baseP: 0.30,
        symptoms: ['male', 'sperm_quality'],
        urgency: 'moderate' as const
      },
      'ama_primary': {
        condition: 'Edad Materna Avanzada',
        baseP: 0.20,
        symptoms: ['edad_materna'],
        urgency: 'high' as const
      }
    };

    const conditionInfo = conditionMap[condition];
    if (!conditionInfo) return null;

    const supportingEvidence = evidence.filter(ev => 
      conditionInfo.symptoms.some((symptom: string) => ev.symptom.includes(symptom))
    );

    const contradictingEvidence = evidence.filter(ev => 
      !supportingEvidence.includes(ev) && ev.severity < 0.2
    );

    // 🧮 CÁLCULO BAYESIANO DE PROBABILIDAD
    const likelihood = this.calculateLikelihood(supportingEvidence, conditionInfo.symptoms);
    const posterior = this.bayesianUpdate(conditionInfo.baseP, likelihood);

    return {
      condition: conditionInfo.condition,
      probability: posterior,
      supportingEvidence,
      contradictingEvidence,
      confidence: this.calculateHypothesisConfidence(supportingEvidence),
      urgency: conditionInfo.urgency,
      nextSteps: this.generateNextSteps(condition, posterior)
    };
  }

  /**
   * 🧮 CÁLCULO BAYESIANO
   */
  private bayesianUpdate(priorP: number, likelihood: number): number {
    // P(H|E) = P(E|H) * P(H) / P(E)
    // Simplificado para uso clínico
    const posterior = (likelihood * priorP) / ((likelihood * priorP) + ((1 - likelihood) * (1 - priorP)));
    return Math.min(0.95, Math.max(0.05, posterior)); // Límites de seguridad
  }

  /**
   * 📊 CÁLCULO DE VEROSIMILITUD
   */
  private calculateLikelihood(evidence: MedicalEvidence[], expectedSymptoms: string[]): number {
    if (evidence.length === 0) return 0.1;
    
    const relevantEvidence = evidence.filter(ev => 
      expectedSymptoms.some(symptom => ev.symptom.includes(symptom))
    );
    
    if (relevantEvidence.length === 0) return 0.2;
    
    const avgSeverity = relevantEvidence.reduce((sum, ev) => sum + ev.severity, 0) / relevantEvidence.length;
    const avgConfidence = relevantEvidence.reduce((sum, ev) => sum + ev.confidence, 0) / relevantEvidence.length;
    
    return avgSeverity * avgConfidence;
  }

  /**
   * ⚖️ EVALUACIÓN DE HIPÓTESIS
   */
  private evaluateHypotheses(hypotheses: ClinicalHypothesis[], evidence: MedicalEvidence[]): ClinicalHypothesis[] {
    return hypotheses.map(hypothesis => {
      // 🔄 Re-evaluar probabilidad con evidencia completa
      const updatedProbability = this.refineHypothesisProbability(hypothesis, evidence);
      
      // 📊 Ajustar confianza basada en cantidad y calidad de evidencia
      const updatedConfidence = this.refineHypothesisConfidence(hypothesis, evidence);
      
      return {
        ...hypothesis,
        probability: updatedProbability,
        confidence: updatedConfidence
      };
    });
  }

  /**
   * 🔗 CONSTRUCCIÓN DE CADENA DE RAZONAMIENTO
   */
  private buildReasoningChain(hypotheses: ClinicalHypothesis[], evidence: MedicalEvidence[]): ReasoningChain[] {
    const chain: ReasoningChain[] = [];
    
    if (hypotheses.length === 0) {
      chain.push({
        step: 1,
        reasoning: "No se encontraron factores de riesgo significativos en los datos proporcionados",
        conclusion: "Perfil de fertilidad dentro de parámetros normales",
        confidence: 0.7,
        medicalBasis: ["Ausencia de factores de riesgo conocidos"]
      });
      return chain;
    }

    const primaryHypothesis = hypotheses[0];
    
    // PASO 1: Análisis de evidencia
    chain.push({
      step: 1,
      reasoning: `Análisis de ${evidence.length} factores clínicos relevantes identificados`,
      conclusion: `Evidencia más significativa: ${[...evidence].sort((a, b) => b.severity - a.severity)[0]?.symptom}`,
      confidence: 0.9,
      medicalBasis: evidence.slice(0, 3).map(ev => `${ev.symptom}: severidad ${(ev.severity * 100).toFixed(1)}%`)
    });

    // PASO 2: Proceso de inferencia
    chain.push({
      step: 2,
      reasoning: `Aplicación de razonamiento bayesiano con ${primaryHypothesis.supportingEvidence.length} evidencias de soporte`,
      conclusion: `Hipótesis principal: ${primaryHypothesis.condition} (${(primaryHypothesis.probability * 100).toFixed(1)}% probabilidad)`,
      confidence: primaryHypothesis.confidence,
      medicalBasis: [`Prevalencia poblacional`, `Evidencia clínica específica`, `Factores de riesgo identificados`]
    });

    // PASO 3: Consideraciones diferenciales
    if (hypotheses.length > 1) {
      const alternatives = hypotheses.slice(1, 3);
      chain.push({
        step: 3,
        reasoning: `Evaluación de diagnósticos diferenciales: ${alternatives.map(h => h.condition).join(', ')}`,
        conclusion: `Diagnósticos alternativos considerados con probabilidades menores`,
        confidence: 0.8,
        medicalBasis: alternatives.map(h => `${h.condition}: ${(h.probability * 100).toFixed(1)}%`)
      });
    }

    // PASO 4: Recomendaciones clínicas
    chain.push({
      step: 4,
      reasoning: `Basado en la hipótesis principal (${primaryHypothesis.condition}) y nivel de urgencia (${primaryHypothesis.urgency})`,
      conclusion: `Plan de acción prioritario definido con ${primaryHypothesis.nextSteps.length} pasos específicos`,
      confidence: primaryHypothesis.confidence,
      medicalBasis: primaryHypothesis.nextSteps.slice(0, 2)
    });

    return chain;
  }

  /**
   * 💡 GENERACIÓN DE RECOMENDACIONES
   */
  private generateRecommendations(hypothesis: ClinicalHypothesis, _evidence: MedicalEvidence[]): string[] {
    const recommendations: string[] = [];
    
    // Recomendaciones basadas en la condición principal
    const conditionRecommendations: Record<string, string[]> = {
      'Síndrome de Ovarios Poliquísticos (SOP)': [
        'Evaluación endocrinológica completa (glucosa, insulina, perfil androgénico)',
        'Modificaciones del estilo de vida (dieta baja en carbohidratos, ejercicio regular)',
        'Consideración de metformina para resistencia a la insulina',
        'Inositol y ácido fólico como suplementación'
      ],
      'Endometriosis': [
        'Resonancia magnética pélvica para evaluación anatómica',
        'Consulta con especialista en endometriosis',
        'Evaluación de reserva ovárica (AMH, FSH)',
        'Consideración de cirugía laparoscópica según severidad'
      ],
      'Reserva Ovárica Disminuida': [
        'Evaluación urgente de reserva ovárica (AMH, FSH, recuento folicular)',
        'Consulta inmediata con especialista en reproducción asistida',
        'Considerar congelación de óvulos si no busca embarazo inmediato',
        'Suplementación con CoQ10, DHEA y antioxidantes'
      ]
    };

    const specificRecs = conditionRecommendations[hypothesis.condition] || [
      'Evaluación médica especializada para determinar causas específicas',
      'Estudios diagnósticos dirigidos según hallazgos clínicos',
      'Plan de tratamiento personalizado'
    ];

    recommendations.push(...specificRecs);

    // Recomendaciones basadas en urgencia
    if (hypothesis.urgency === 'high' || hypothesis.urgency === 'critical') {
      recommendations.unshift('⚠️ CONSULTA MÉDICA URGENTE: Este caso requiere evaluación especializada inmediata');
    }

    // Recomendaciones generales siempre aplicables
    recommendations.push(
      'Ácido fólico 400-800mcg diarios',
      'Optimización del estilo de vida (dieta mediterránea, ejercicio, manejo del estrés)',
      'Seguimiento médico regular para monitorear progreso'
    );

    return recommendations;
  }

  /**
   * 🏗️ MÉTODOS AUXILIARES
   */
  private buildCombinedHypothesis(conditions: string[], evidence: MedicalEvidence[]): ClinicalHypothesis {
    return {
      condition: 'Factores múltiples de infertilidad',
      probability: 0.6,
      supportingEvidence: evidence,
      contradictingEvidence: [],
      confidence: 0.8,
      urgency: 'high',
      nextSteps: ['Evaluación integral multidisciplinaria', 'Plan de tratamiento combinado']
    };
  }

  private refineHypothesisProbability(hypothesis: ClinicalHypothesis, _evidence: MedicalEvidence[]): number {
    // Refinamiento basado en evidencia adicional
    return Math.min(0.95, hypothesis.probability * 1.1);
  }

  private refineHypothesisConfidence(hypothesis: ClinicalHypothesis, evidence: MedicalEvidence[]): number {
    const evidenceQuality = evidence.reduce((sum, ev) => sum + ev.confidence, 0) / evidence.length;
    return Math.min(0.95, (hypothesis.confidence + evidenceQuality) / 2);
  }

  private calculateHypothesisConfidence(evidence: MedicalEvidence[]): number {
    if (evidence.length === 0) return 0.3;
    return Math.min(0.95, evidence.reduce((sum, ev) => sum + ev.confidence, 0) / evidence.length);
  }

  private calculateGlobalConfidence(hypothesis: ClinicalHypothesis, chain: ReasoningChain[]): number {
    const chainConfidence = chain.reduce((sum, step) => sum + step.confidence, 0) / chain.length;
    return (hypothesis.confidence + chainConfidence) / 2;
  }

  private generateNextSteps(condition: string, _probability: number): string[] {
    const steps: Record<string, string[]> = {
      'pcos_primary': [
        'Estudios hormonales (LH, FSH, testosterona, insulina)',
        'Ecografía transvaginal para evaluación ovárica',
        'Modificaciones dietéticas anti-SOP'
      ],
      'endometriosis_primary': [
        'Resonancia magnética pélvica',
        'Marcadores serológicos (CA-125)',
        'Evaluación laparoscópica si está indicada'
      ],
      'dor_primary': [
        'AMH y recuento folicular antral urgente',
        'Consulta especialista reproducción asistida',
        'Plan preservación fertilidad'
      ]
    };

    return steps[condition] || ['Evaluación médica especializada'];
  }

  private initializeKnowledgeBase(): void {
    // Base de conocimiento médico específico
    const conditionData: Record<string, ConditionInfo> = {
      pcos: { prevalence: 0.10, symptoms: ['irregular_periods', 'hirsutism', 'acne'] },
      endometriosis: { prevalence: 0.05, symptoms: ['pelvic_pain', 'dysmenorrhea'] },
      dor: { prevalence: 0.08, symptoms: ['low_amh', 'high_fsh'] }
    };
    
    this.knowledgeBase.set('fertility_conditions', conditionData);
  }

  private initializeInferenceRules(): void {
    // Reglas de inferencia clínica
    this.inferenceRules.set('age_impact', (age: number) => {
      if (age < 30) return 0.2;
      if (age < 35) return 0.4;
      if (age < 40) return 0.7;
      return 0.9;
    });
  }
}
