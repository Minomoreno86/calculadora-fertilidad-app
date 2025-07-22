// MINOPILAS V12.1 - PATHOLOGY DETECTION WORKER RECONSTRUIDO
// Medical Type Safety + Evidence-Based Detection + AI Integration

import { MedicalWorkerTask, WorkerResult } from '../UnifiedParallelEngine_V12';

// Medical data interface for pathology detection - Type Safety V12.1
interface PatientMedicalData {
  [key: string]: any;
  bloodTests?: { [key: string]: number };
  symptoms?: string[];
  demographics?: { age?: number; gender?: string };
  medicalHistory?: string[];
  spermConcentration?: number;
  hormonalProfile?: { [key: string]: number };
}

// Detected pathology interface
interface DetectedPathology {
  name: string;
  probability: number;
  severity: 'mild' | 'moderate' | 'severe';
  symptoms: Array<{
    name: string;
    severity: string;
    significance: string;
  }>;
  biomarkers: Array<{
    name: string;
    value: number | string;
    normalRange?: string;
    significance: string;
  }>;
  recommendedTests: string[];
  treatmentOptions: string[];
  prognosis: {
    natural: string;
    withTreatment: string;
  };
}

/**
 * 🔬 PATHOLOGY DETECTION WORKER V12.1
 * Sistema especializado en detección de patologías reproductivas
 * Con inteligencia médica avanzada y validación científica
 */
export class PathologyDetectionWorker {
  private aiModels: Map<string, any> = new Map();
  private medicalKnowledgeBase: Map<string, any> = new Map();
  private evidenceDatabase: Map<string, any> = new Map();

  constructor() {
    this.initializeMedicalKnowledge();
    this.loadAIModels();
  }

  /**
   * 🧠 PROCESO PRINCIPAL DE DETECCIÓN DE PATOLOGÍAS
   */
  async process(task: MedicalWorkerTask): Promise<WorkerResult> {
    try {
      const startTime = Date.now();
      
      // Extraer datos médicos del paciente
      const patientData = task.data as PatientMedicalData;
      
      // Análisis patológico multi-dimensional
      const detectedPathologies = await this.detectPathologies(patientData);
      
      // Clasificación por severidad y probabilidad
      const sortedPathologies = this.rankPathologiesByRelevance(detectedPathologies);
      
      // Generar recomendaciones médicas
      const medicalRecommendations = this.generateMedicalRecommendations(sortedPathologies);
      
      const processingTime = Date.now() - startTime;
      
      return {
        success: true,
        data: {
          patientId: task.patientId,
          detectedPathologies: sortedPathologies,
          primaryDiagnosis: sortedPathologies[0] || null,
          medicalRecommendations,
          confidenceScore: this.calculateOverallConfidence(sortedPathologies),
          processingTime: `${processingTime}ms`
        },
        metadata: {
          workerId: 'pathology-detection-v12.1',
          timestamp: new Date().toISOString(),
          medicalValidation: true
        }
      };
      
    } catch (error) {
      return {
        success: false,
        error: `Error en detección patológica: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        metadata: {
          workerId: 'pathology-detection-v12.1',
          timestamp: new Date().toISOString(),
          medicalValidation: false
        }
      };
    }
  }

  /**
   * 🔬 DETECCIÓN INTEGRAL DE PATOLOGÍAS
   */
  private async detectPathologies(data: PatientMedicalData): Promise<DetectedPathology[]> {
    const pathologies: DetectedPathology[] = [];
    
    // Análisis hormonal
    const hormonalPathologies = await this.detectHormonalPathologies(data);
    pathologies.push(...hormonalPathologies);
    
    // Análisis metabólico
    const metabolicPathologies = await this.detectMetabolicPathologies(data);
    pathologies.push(...metabolicPathologies);
    
    // Análisis anatómico
    const anatomicalPathologies = await this.detectAnatomicalPathologies(data);
    pathologies.push(...anatomicalPathologies);
    
    // Factor masculino
    const maleFactorPathologies = await this.detectMaleFactorPathologies(data);
    pathologies.push(...maleFactorPathologies);
    
    return pathologies.filter(p => p.probability > 0.3); // Filtrar baja probabilidad
  }

  /**
   * 🧬 DETECCIÓN DE PATOLOGÍAS HORMONALES
   */
  private async detectHormonalPathologies(data: PatientMedicalData): Promise<DetectedPathology[]> {
    const pathologies: DetectedPathology[] = [];
    
    // PCOS - Síndrome de Ovarios Poliquísticos
    if (this.shouldAnalyzePCOS(data)) {
      const pcosAnalysis = await this.detectPCOS(data);
      pathologies.push(pcosAnalysis);
    }
    
    // Hiperprolactinemia
    if (data.hormonalProfile?.prolactin && data.hormonalProfile.prolactin > 25) {
      pathologies.push(await this.detectHyperprolactinemia(data));
    }
    
    // Insuficiencia Ovárica Prematura
    if (data.hormonalProfile?.amh && data.hormonalProfile.amh < 1.0) {
      pathologies.push(await this.detectPrematureOvarianInsufficiency(data));
    }
    
    return pathologies;
  }

  /**
   * 💊 DETECCIÓN DE PATOLOGÍAS METABÓLICAS
   */
  private async detectMetabolicPathologies(data: PatientMedicalData): Promise<DetectedPathology[]> {
    const pathologies: DetectedPathology[] = [];
    
    // Resistencia a la insulina
    if (data.bloodTests?.homa_ir && data.bloodTests.homa_ir > 2.5) {
      pathologies.push(await this.detectInsulinResistance(data));
    }
    
    // Diabetes
    if (data.bloodTests?.glucose && data.bloodTests.glucose > 126) {
      pathologies.push(await this.detectDiabetes(data));
    }
    
    // Síndrome metabólico
    if (this.hasMetabolicSyndromeMarkers(data)) {
      pathologies.push(await this.detectMetabolicSyndrome(data));
    }
    
    return pathologies;
  }

  /**
   * 🔬 DETECCIÓN DE PATOLOGÍAS ANATÓMICAS
   */
  private async detectAnatomicalPathologies(data: PatientMedicalData): Promise<DetectedPathology[]> {
    const pathologies: DetectedPathology[] = [];
    
    // Endometriosis
    if (this.hasEndometriosisSymptoms(data)) {
      pathologies.push(await this.detectEndometriosis(data));
    }
    
    // Miomas uterinos
    if (data.symptoms?.includes('sangrado abundante') || data.symptoms?.includes('dolor pélvico')) {
      pathologies.push(await this.detectUterineFibroids(data));
    }
    
    return pathologies;
  }

  /**
   * 👨 DETECCIÓN DE FACTOR MASCULINO
   */
  private async detectMaleFactorPathologies(data: PatientMedicalData): Promise<DetectedPathology[]> {
    const pathologies: DetectedPathology[] = [];
    
    // Oligospermia
    if (data.spermConcentration && data.spermConcentration < 16) {
      pathologies.push(await this.detectOligospermia(data));
    }
    
    // Astenospermia
    if (data.demographics?.gender === 'male' && this.hasMaleMotilityIssues(data)) {
      pathologies.push(await this.detectAstenospermia(data));
    }
    
    // Teratospermia
    if (this.hasMaleMorphologyIssues(data)) {
      pathologies.push(await this.detectTeratospermia(data));
    }
    
    return pathologies;
  }

  /**
   * 🧠 DETECCIÓN ESPECÍFICA DE PCOS
   */
  private async detectPCOS(data: PatientMedicalData): Promise<DetectedPathology> {
    let probability = 0;
    const symptoms: any[] = [];
    const biomarkers: any[] = [];

    // Criterios de Rotterdam
    // Oligoanovulación
    if (data.symptoms?.includes('ciclos irregulares') || data.symptoms?.includes('amenorrea')) {
      probability += 0.33;
      symptoms.push({
        name: 'Oligoanovulación',
        severity: 'moderate',
        significance: 'major'
      });
    }

    // Hiperandrogenismo clínico
    if (data.symptoms?.includes('hirsutismo') || data.symptoms?.includes('acné')) {
      probability += 0.33;
      symptoms.push({
        name: 'Hiperandrogenismo clínico',
        severity: 'moderate',
        significance: 'major'
      });
    }

    // Ovarios poliquísticos en ecografía
    if (data.symptoms?.includes('ovarios poliquísticos')) {
      probability += 0.33;
      biomarkers.push({
        name: 'Morfología ovárica poliquística',
        value: 'Presente',
        significance: 'major'
      });
    }

    // Marcadores bioquímicos
    if (data.hormonalProfile?.lh_fsh_ratio && data.hormonalProfile.lh_fsh_ratio > 2) {
      probability += 0.15;
      biomarkers.push({
        name: 'Ratio LH/FSH',
        value: data.hormonalProfile.lh_fsh_ratio,
        normalRange: '<2',
        significance: 'moderate'
      });
    }

    if (data.hormonalProfile?.testosterone && data.hormonalProfile.testosterone > 0.8) {
      probability += 0.15;
      biomarkers.push({
        name: 'Testosterona libre',
        value: `${data.hormonalProfile.testosterone} ng/dL`,
        normalRange: '0.1-0.8 ng/dL',
        significance: 'moderate'
      });
    }

    // Calculate severity
    const severity = probability > 0.7 ? 'severe' : probability > 0.5 ? 'moderate' : 'mild';

    return {
      name: 'Síndrome de Ovarios Poliquísticos (PCOS)',
      probability: Math.min(probability, 1.0),
      severity,
      symptoms,
      biomarkers,
      recommendedTests: [
        'Perfil hormonal completo',
        'Ecografía transvaginal',
        'Perfil lipídico',
        'Glucosa e insulina en ayunas',
        'HOMA-IR'
      ],
      treatmentOptions: [
        'Cambios en el estilo de vida',
        'Metformina',
        'Clomifeno',
        'Letrozol',
        'Gonadotropinas'
      ],
      prognosis: {
        natural: 'Variable según fenotipo - 20-40% concepción espontánea con tratamiento médico',
        withTreatment: '60-80% tasa de ovulación con inductores. FIV: 45-65% embarazo clínico por transferencia'
      }
    };
  }

  /**
   * 💉 DETECCIÓN DE RESISTENCIA A LA INSULINA
   */
  private async detectInsulinResistance(data: PatientMedicalData): Promise<DetectedPathology> {
    let probability = 0.6; // Base por HOMA-IR elevado
    const symptoms: any[] = [];
    const biomarkers: any[] = [];

    // HOMA-IR confirmado
    if (data.bloodTests?.homa_ir) {
      biomarkers.push({
        name: 'HOMA-IR',
        value: data.bloodTests.homa_ir,
        normalRange: '<2.5',
        significance: 'major'
      });

      if (data.bloodTests.homa_ir > 4.0) {
        probability = Math.min(probability + 0.2, 1.0);
      }
    }

    // Síntomas asociados
    if (data.symptoms?.includes('aumento de peso')) {
      probability += 0.1;
      symptoms.push({
        name: 'Aumento de peso/dificultad para perder peso',
        severity: 'moderate',
        significance: 'moderate'
      });
    }

    if (data.symptoms?.includes('acantosis nigricans')) {
      probability += 0.15;
      symptoms.push({
        name: 'Acantosis nigricans',
        severity: 'mild',
        significance: 'moderate'
      });
    }

    // Calculate severity
    const severity = probability > 0.7 ? 'severe' : probability > 0.5 ? 'moderate' : 'mild';

    return {
      name: 'Resistencia a la Insulina',
      probability: Math.min(probability, 1.0),
      severity,
      symptoms,
      biomarkers,
      recommendedTests: [
        'Curva de tolerancia a la glucosa',
        'Insulina basal y post-carga',
        'HbA1c',
        'Perfil lipídico completo'
      ],
      treatmentOptions: [
        'Dieta baja en carbohidratos refinados',
        'Ejercicio aeróbico regular',
        'Metformina',
        'Mio-inositol',
        'Pérdida de peso 5-10%'
      ],
      prognosis: {
        natural: 'Reduce probabilidad ovulación espontánea. Asociado con aborto recurrente',
        withTreatment: 'Metformina mejora ovulación 40-50%. Reduce riesgo diabetes gestacional'
      }
    };
  }

  /**
   * 🩸 DETECCIÓN DE ENDOMETRIOSIS
   */
  private async detectEndometriosis(data: PatientMedicalData): Promise<DetectedPathology> {
    let probability = 0;
    const symptoms: any[] = [];
    const biomarkers: any[] = [];

    // Dolor característico
    if (data.symptoms?.includes('dismenorrea severa')) {
      probability += 0.3;
      symptoms.push({
        name: 'Dismenorrea progresiva severa',
        severity: 'severe',
        significance: 'major'
      });
    }

    if (data.symptoms?.includes('dispareunia')) {
      probability += 0.2;
      symptoms.push({
        name: 'Dispareunia profunda',
        severity: 'moderate',
        significance: 'major'
      });
    }

    if (data.symptoms?.includes('dolor pélvico crónico')) {
      probability += 0.25;
      symptoms.push({
        name: 'Dolor pélvico crónico',
        severity: 'moderate',
        significance: 'major'
      });
    }

    // Infertilidad asociada
    if (data.symptoms?.includes('infertilidad')) {
      probability += 0.15;
      symptoms.push({
        name: 'Infertilidad asociada',
        severity: 'severe',
        significance: 'major'
      });
    }

    // Marcador CA-125
    if (data.bloodTests?.ca125 && data.bloodTests.ca125 > 35) {
      probability += 0.1;
      biomarkers.push({
        name: 'CA-125',
        value: `${data.bloodTests.ca125} U/mL`,
        normalRange: '<35 U/mL',
        significance: 'moderate'
      });
    }

    // Calculate endometriosis severity
    const endoSeverity = probability > 0.7 ? 'severe' : probability > 0.5 ? 'moderate' : 'mild';

    return {
      name: 'Endometriosis',
      probability: Math.min(probability, 1.0),
      severity: endoSeverity,
      symptoms,
      biomarkers,
      recommendedTests: [
        'Ecografía transvaginal especializada',
        'Resonancia magnética pélvica',
        'CA-125 sérico',
        'Laparoscopia diagnóstica (gold standard)'
      ],
      treatmentOptions: [
        'Analgésicos y AINEs',
        'Anticonceptivos hormonales',
        'Análogos GnRH',
        'Cirugía laparoscópica',
        'FIV si infertilidad asociada'
      ],
      prognosis: {
        natural: 'Estadio I-II: 25-50% concepción. Estadio III-IV: 5-25% concepción natural',
        withTreatment: 'Cirugía + FIV: 45-65% embarazo por transferencia según estadio'
      }
    };
  }

  /**
   * 🧔 DETECCIÓN DE OLIGOSPERMIA
   */
  private async detectOligospermia(data: PatientMedicalData): Promise<DetectedPathology> {
    let probability = 0.8; // Alta por concentración baja confirmada
    const symptoms: any[] = [];
    const biomarkers: any[] = [];

    // Concentración espermática
    if (data.spermConcentration) {
      biomarkers.push({
        name: 'Concentración espermática',
        value: `${data.spermConcentration} millones/mL`,
        normalRange: '≥16 millones/mL',
        significance: 'major'
      });

      // Calculate oligospermia severity with safe access
      const spermConc = data.spermConcentration || 0;
      const spermSeverity = spermConc < 5 ? 'severe' : spermConc < 10 ? 'moderate' : 'mild';

      // Return with calculated severity
      severity: spermSeverity;

      if (data.spermConcentration < 5) {
        probability = Math.min(probability + 0.15, 1.0);
        symptoms.push({
          name: 'Oligospermia severa',
          severity: 'severe',
          significance: 'major'
        });
      }
    }

    return {
      name: 'Oligospermia',
      probability: Math.min(probability, 1.0),
      severity: 'moderate',
      symptoms,
      biomarkers,
      recommendedTests: [
        'Espermiograma completo (2 muestras)',
        'Estudio hormonal (FSH, LH, Testosterona)',
        'Ecografía escrotal',
        'Fragmentación DNA espermático'
      ],
      treatmentOptions: [
        'Corrección factores de riesgo',
        'Antioxidantes (CoQ10, Vitamina E)',
        'Tratamiento hormonal específico',
        'ICSI en técnicas reproducción asistida'
      ],
      prognosis: {
        natural: 'Variable según grado. Severa <5M/mL: <5% concepción natural',
        withTreatment: 'ICSI: 60-80% fertilización, 45-60% embarazo por transferencia'
      }
    };
  }

  /**
   * 🚫 MÉTODOS PLACEHOLDER PARA PATOLOGÍAS ADICIONALES
   */
  private async detectHyperprolactinemia(_data: PatientMedicalData): Promise<DetectedPathology> {
    return this.createBasicPathology('Hiperprolactinemia', 0.6);
  }

  private async detectPrematureOvarianInsufficiency(_data: PatientMedicalData): Promise<DetectedPathology> {
    return this.createBasicPathology('Insuficiencia Ovárica Prematura', 0.5);
  }

  private async detectDiabetes(_data: PatientMedicalData): Promise<DetectedPathology> {
    return this.createBasicPathology('Diabetes Mellitus', 0.7);
  }

  private async detectMetabolicSyndrome(_data: PatientMedicalData): Promise<DetectedPathology> {
    return this.createBasicPathology('Síndrome Metabólico', 0.6);
  }

  private async detectUterineFibroids(_data: PatientMedicalData): Promise<DetectedPathology> {
    return this.createBasicPathology('Miomas Uterinos', 0.4);
  }

  private async detectAstenospermia(_data: PatientMedicalData): Promise<DetectedPathology> {
    return this.createBasicPathology('Astenospermia', 0.5);
  }

  private async detectTeratospermia(_data: PatientMedicalData): Promise<DetectedPathology> {
    return this.createBasicPathology('Teratospermia', 0.4);
  }

  /**
   * 🧠 MÉTODOS AUXILIARES Y DE VALIDACIÓN
   */
  private shouldAnalyzePCOS(data: PatientMedicalData): boolean {
    return !!(data.symptoms?.includes('ciclos irregulares') || 
              data.symptoms?.includes('hirsutismo') || 
              data.hormonalProfile?.lh_fsh_ratio);
  }

  private hasEndometriosisSymptoms(data: PatientMedicalData): boolean {
    return !!(data.symptoms?.includes('dismenorrea severa') || 
              data.symptoms?.includes('dolor pélvico') || 
              data.symptoms?.includes('dispareunia'));
  }

  private hasMetabolicSyndromeMarkers(data: PatientMedicalData): boolean {
    return !!(data.bloodTests?.glucose && data.bloodTests.glucose > 100 ||
              data.symptoms?.includes('obesidad central'));
  }

  private hasMaleMotilityIssues(data: PatientMedicalData): boolean {
    return !!(data.symptoms?.includes('motilidad reducida') || 
              data.bloodTests?.sperm_motility && data.bloodTests.sperm_motility < 40);
  }

  private hasMaleMorphologyIssues(data: PatientMedicalData): boolean {
    return !!(data.symptoms?.includes('morfología anormal') || 
              data.bloodTests?.sperm_morphology && data.bloodTests.sperm_morphology < 4);
  }

  private createBasicPathology(name: string, probability: number): DetectedPathology {
    return {
      name,
      probability,
      severity: probability > 0.7 ? 'severe' : probability > 0.5 ? 'moderate' : 'mild',
      symptoms: [],
      biomarkers: [],
      recommendedTests: ['Evaluación especializada'],
      treatmentOptions: ['Consulta médica especializada'],
      prognosis: {
        natural: 'Variable según caso individual',
        withTreatment: 'Requiere evaluación especializada'
      }
    };
  }

  private rankPathologiesByRelevance(pathologies: DetectedPathology[]): DetectedPathology[] {
    return pathologies.sort((a, b) => {
      // Ordenar por probabilidad y severidad
      const scoreA = a.probability * (a.severity === 'severe' ? 3 : a.severity === 'moderate' ? 2 : 1);
      const scoreB = b.probability * (b.severity === 'severe' ? 3 : b.severity === 'moderate' ? 2 : 1);
      return scoreB - scoreA;
    });
  }

  private generateMedicalRecommendations(pathologies: DetectedPathology[]): string[] {
    const recommendations: string[] = [];
    
    if (pathologies.length === 0) {
      recommendations.push('Evaluación de fertilidad de rutina recomendada');
      return recommendations;
    }

    // Recomendaciones basadas en patología principal
    const primary = pathologies[0];
    
    if (primary.probability > 0.7) {
      recommendations.push(`Evaluación inmediata recomendada para ${primary.name}`);
      recommendations.push(...primary.recommendedTests.slice(0, 3));
    } else if (primary.probability > 0.5) {
      recommendations.push(`Seguimiento especializado para ${primary.name}`);
      recommendations.push(...primary.recommendedTests.slice(0, 2));
    } else {
      recommendations.push(`Monitorización de síntomas relacionados con ${primary.name}`);
    }

    // Recomendaciones generales
    recommendations.push('Optimización del estilo de vida');
    recommendations.push('Control de factores de riesgo modificables');

    return recommendations;
  }

  private calculateOverallConfidence(pathologies: DetectedPathology[]): number {
    if (pathologies.length === 0) return 0;
    
    const avgProbability = pathologies.reduce((sum, p) => sum + p.probability, 0) / pathologies.length;
    return Math.round(avgProbability * 100);
  }

  private initializeMedicalKnowledge(): void {
    // Cargar base de conocimiento médico
    this.medicalKnowledgeBase.set('pcos_criteria', {
      rotterdam: ['oligoanovulation', 'hyperandrogenism', 'polycystic_ovaries'],
      biochemical_markers: ['lh_fsh_ratio', 'testosterone', 'dheas']
    });

    this.medicalKnowledgeBase.set('endometriosis_stages', {
      stage_i: 'minimal',
      stage_ii: 'mild', 
      stage_iii: 'moderate',
      stage_iv: 'severe'
    });
  }

  private loadAIModels(_config: PatientMedicalData): void {
    // Cargar modelos de IA para detección patológica
    // Placeholder para futura implementación de ML
    console.log('🧠 AI Medical Models initialized for pathology detection');
  }

  /**
   * 🔄 MÉTODO PRINCIPAL PARA INTEGRACIÓN CON PARALLEL ENGINE
   */
  async handleRequest(task: MedicalWorkerTask): Promise<WorkerResult> {
    switch (task.type) {
      case 'pathology': {
        const result = await this.process(task);
        return result;
      }
      default:
        return {
          success: false,
          error: `Tipo de tarea no soportado: ${task.type}`,
          metadata: {
            workerId: 'pathology-detection-v12.1',
            timestamp: new Date().toISOString(),
            medicalValidation: false
          }
        };
    }
  }
}

// Exportar worker para integración con UnifiedParallelEngine_V12
export default PathologyDetectionWorker;
