/**
 * 🧠 MOTOR DE RAZONAMIENTO CLÍNICO SIMPLIFICADO
 * Core engine limpio y eficiente
 */

import { 
  UserInput, 
  ClinicalAnalysis, 
  OperationResult,
  PerformanceMetrics 
} from '../types/UnifiedTypes';
import { PATHOLOGIES_DATABASE } from '../knowledge-base/pathologies';

export class SimplifiedClinicalEngine {
  private static instance: SimplifiedClinicalEngine;
  
  private constructor() {}
  
  public static getInstance(): SimplifiedClinicalEngine {
    if (!SimplifiedClinicalEngine.instance) {
      SimplifiedClinicalEngine.instance = new SimplifiedClinicalEngine();
    }
    return SimplifiedClinicalEngine.instance;
  }

  /**
   * 🎯 ANÁLISIS CLÍNICO PRINCIPAL
   * Método único y optimizado para diagnóstico
   */
  public async analyzeClinicalCase(
    userInput: UserInput
  ): Promise<OperationResult<ClinicalAnalysis>> {
    const startTime = performance.now();
    
    try {
      // 1. Validar entrada
      const validation = this.validateInput(userInput);
      if (!validation.isValid) {
        return {
          success: false,
          error: {
            code: 'INVALID_INPUT',
            message: validation.errors.join(', ')
          }
        };
      }

      // 2. Análisis de patrones
      const diagnosticPatterns = await this.identifyDiagnosticPatterns(userInput);
      
      // 3. Cálculo de probabilidades
      const diagnosisProbabilities = await this.calculateDiagnosisProbabilities(
        userInput, 
        diagnosticPatterns
      );
      
      // 4. Selección de diagnóstico principal
      const primaryDiagnosis = this.selectPrimaryDiagnosis(diagnosisProbabilities);
      
      // 5. Diagnósticos diferenciales
      const differentialDiagnoses = this.generateDifferentialDiagnoses(
        diagnosisProbabilities.slice(1, 4)
      );
      
      // 6. Estratificación de riesgo
      const riskStratification = this.performRiskStratification(userInput, primaryDiagnosis);
      
      // 7. Árbol de decisión terapéutica
      const treatmentTree = this.generateTreatmentDecisionTree(
        primaryDiagnosis,
        userInput,
        riskStratification
      );

      const processingTime = performance.now() - startTime;
      
      const analysis: ClinicalAnalysis = {
        primaryDiagnosis,
        differentialDiagnoses,
        riskStratification,
        treatmentDecisionTree
      };

      return {
        success: true,
        data: analysis,
        metadata: {
          processingTime,
          confidence: primaryDiagnosis.confidence,
          evidenceLevel: primaryDiagnosis.evidenceLevel
        }
      };

    } catch (error) {
      return {
        success: false,
        error: {
          code: 'ANALYSIS_ERROR',
          message: `Error en análisis clínico: ${error}`,
          details: error
        }
      };
    }
  }

  /**
   * 🔍 VALIDACIÓN DE ENTRADA
   */
  private validateInput(userInput: UserInput): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!userInput.age || userInput.age < 18 || userInput.age > 50) {
      errors.push('Edad debe estar entre 18-50 años');
    }
    
    if (!userInput.infertilityDuration || userInput.infertilityDuration < 1) {
      errors.push('Duración de infertilidad requerida');
    }
    
    if (userInput.bmi && (userInput.bmi < 15 || userInput.bmi > 50)) {
      errors.push('BMI fuera de rango válido (15-50)');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * 🔄 IDENTIFICACIÓN DE PATRONES DIAGNÓSTICOS
   */
  private async identifyDiagnosticPatterns(userInput: UserInput): Promise<string[]> {
    const patterns: string[] = [];
    
    // Patrones por edad
    if (userInput.age >= 35) {
      patterns.push('advanced_maternal_age');
    }
    
    // Patrones por duración
    if (userInput.infertilityDuration >= 12) {
      patterns.push('prolonged_infertility');
    }
    
    // Patrones por BMI
    if (userInput.bmi) {
      if (userInput.bmi < 18.5) patterns.push('underweight');
      if (userInput.bmi > 25) patterns.push('overweight');
      if (userInput.bmi > 30) patterns.push('obesity');
    }
    
    // Patrones por síntomas
    if (userInput.symptoms) {
      if (userInput.symptoms.includes('irregular_periods')) {
        patterns.push('menstrual_dysfunction');
      }
      if (userInput.symptoms.includes('hirsutism')) {
        patterns.push('hyperandrogenism');
      }
      if (userInput.symptoms.includes('galactorrhea')) {
        patterns.push('hyperprolactinemia');
      }
    }
    
    // Patrones por laboratorios
    if (userInput.labs) {
      if (userInput.labs.amh && userInput.labs.amh < 1.0) {
        patterns.push('diminished_ovarian_reserve');
      }
      if (userInput.labs.fsh && userInput.labs.fsh > 10) {
        patterns.push('elevated_fsh');
      }
    }
    
    return patterns;
  }

  /**
   * 📊 CÁLCULO DE PROBABILIDADES DIAGNÓSTICAS
   */
  private async calculateDiagnosisProbabilities(
    userInput: UserInput, 
    patterns: string[]
  ): Promise<Array<{ pathology: string; probability: number; evidence: string[] }>> {
    const probabilities: Array<{ pathology: string; probability: number; evidence: string[] }> = [];
    
    // Iterar sobre todas las patologías disponibles
    for (const [pathologyId, pathologyData] of Object.entries(PATHOLOGIES_DATABASE)) {
      let probability = 0;
      const evidence: string[] = [];
      
      // Probabilidad base por prevalencia
      const baseProb = this.parsePrevalence(pathologyData.prevalence);
      probability += baseProb * 10; // Factor de 10 para escalar
      
      // Ajustes por edad
      if (userInput.age >= 35 && pathologyId === 'DIMINISHED_OVARIAN_RESERVE') {
        probability += 30;
        evidence.push('Edad ≥35 años');
      }
      
      // Ajustes por patrones identificados
      patterns.forEach(pattern => {
        switch (pathologyId) {
          case 'PCOS':
            if (pattern === 'menstrual_dysfunction' || pattern === 'hyperandrogenism' || pattern === 'overweight') {
              probability += 25;
              evidence.push(`Patrón: ${pattern}`);
            }
            break;
          case 'DIMINISHED_OVARIAN_RESERVE':
            if (pattern === 'advanced_maternal_age' || pattern === 'elevated_fsh') {
              probability += 20;
              evidence.push(`Patrón: ${pattern}`);
            }
            break;
          case 'HYPERPROLACTINEMIA':
            if (pattern === 'hyperprolactinemia') {
              probability += 40;
              evidence.push(`Patrón: ${pattern}`);
            }
            break;
        }
      });
      
      // Ajustes por laboratorios específicos
      if (userInput.labs) {
        if (pathologyId === 'DIMINISHED_OVARIAN_RESERVE' && userInput.labs.amh && userInput.labs.amh < 1.0) {
          probability += 35;
          evidence.push(`AMH: ${userInput.labs.amh} ng/ml`);
        }
        if (pathologyId === 'PCOS' && userInput.labs.lh && userInput.labs.fsh && (userInput.labs.lh / userInput.labs.fsh) > 2) {
          probability += 30;
          evidence.push('Ratio LH/FSH >2');
        }
      }
      
      // Normalizar probabilidad (máximo 95%)
      probability = Math.min(probability, 95);
      
      if (probability > 5) { // Solo incluir probabilidades significativas
        probabilities.push({
          pathology: pathologyId,
          probability,
          evidence
        });
      }
    }
    
    // Ordenar por probabilidad descendente
    return probabilities.sort((a, b) => b.probability - a.probability);
  }

  /**
   * 🎯 SELECCIÓN DE DIAGNÓSTICO PRINCIPAL
   */
  private selectPrimaryDiagnosis(
    probabilities: Array<{ pathology: string; probability: number; evidence: string[] }>
  ): ClinicalAnalysis['primaryDiagnosis'] {
    if (probabilities.length === 0) {
      return {
        pathology: 'UNEXPLAINED_INFERTILITY',
        confidence: 60,
        evidenceLevel: 'C',
        clinicalJustification: 'No se identificaron patrones diagnósticos específicos. Diagnóstico por exclusión.'
      };
    }
    
    const top = probabilities[0];
    const pathologyData = PATHOLOGIES_DATABASE[top.pathology];
    
    return {
      pathology: pathologyData?.nameES || top.pathology,
      confidence: Math.round(top.probability),
      evidenceLevel: pathologyData?.evidenceLevel || 'C',
      clinicalJustification: `Diagnóstico basado en: ${top.evidence.join(', ')}. ${pathologyData?.definition || ''}`
    };
  }

  /**
   * 🔄 GENERACIÓN DE DIAGNÓSTICOS DIFERENCIALES
   */
  private generateDifferentialDiagnoses(
    probabilities: Array<{ pathology: string; probability: number; evidence: string[] }>
  ): ClinicalAnalysis['differentialDiagnoses'] {
    return probabilities.map(prob => {
      const pathologyData = PATHOLOGIES_DATABASE[prob.pathology];
      return {
        pathology: pathologyData?.nameES || prob.pathology,
        probability: Math.round(prob.probability),
        reasoning: `Evidencia: ${prob.evidence.slice(0, 2).join(', ')}`
      };
    });
  }

  /**
   * ⚠️ ESTRATIFICACIÓN DE RIESGO
   */
  private performRiskStratification(
    userInput: UserInput, 
    primaryDiagnosis: ClinicalAnalysis['primaryDiagnosis']
  ): ClinicalAnalysis['riskStratification'] {
    let riskScore = 0;
    const factors: string[] = [];
    
    // Factores de edad
    if (userInput.age >= 40) {
      riskScore += 30;
      factors.push('Edad ≥40 años');
    } else if (userInput.age >= 35) {
      riskScore += 15;
      factors.push('Edad ≥35 años');
    }
    
    // Factores de duración
    if (userInput.infertilityDuration >= 24) {
      riskScore += 20;
      factors.push('Infertilidad >2 años');
    } else if (userInput.infertilityDuration >= 12) {
      riskScore += 10;
      factors.push('Infertilidad ≥1 año');
    }
    
    // Factores de laboratorio
    if (userInput.labs?.amh && userInput.labs.amh < 0.5) {
      riskScore += 25;
      factors.push('AMH muy baja (<0.5)');
    } else if (userInput.labs?.amh && userInput.labs.amh < 1.0) {
      riskScore += 15;
      factors.push('AMH baja (<1.0)');
    }
    
    // Factores del diagnóstico
    if (primaryDiagnosis.pathology.includes('DIMINISHED_OVARIAN_RESERVE')) {
      riskScore += 20;
      factors.push('Reserva ovárica disminuida');
    }
    
    // Determinar nivel de riesgo
    let level: 'low' | 'moderate' | 'high' | 'critical';
    if (riskScore >= 70) level = 'critical';
    else if (riskScore >= 50) level = 'high';
    else if (riskScore >= 30) level = 'moderate';
    else level = 'low';
    
    return {
      level,
      factors,
      score: riskScore
    };
  }

  /**
   * 🌳 GENERACIÓN DE ÁRBOL DE DECISIÓN TERAPÉUTICA
   */
  private generateTreatmentDecisionTree(
    primaryDiagnosis: ClinicalAnalysis['primaryDiagnosis'],
    userInput: UserInput,
    riskStratification: ClinicalAnalysis['riskStratification']
  ): ClinicalAnalysis['treatmentDecisionTree'] {
    
    // Tratamientos por defecto (conservadores)
    let firstLine = {
      treatment: 'Optimización lifestyle + Intentos dirigidos',
      successProbability: 15,
      timeframe: '3-6 meses',
      rationale: 'Enfoque conservador inicial'
    };
    
    let secondLine = {
      treatment: 'Inducción de ovulación + IUI',
      successProbability: 25,
      rationale: 'Estimulación ovárica controlada'
    };
    
    let thirdLine = {
      treatment: 'FIV',
      successProbability: 35,
      rationale: 'Técnica de reproducción asistida'
    };
    
    // Ajustes específicos por diagnóstico
    if (primaryDiagnosis.pathology.includes('PCOS')) {
      firstLine = {
        treatment: 'Metformina + Lifestyle + Clomifeno',
        successProbability: 25,
        timeframe: '3-6 meses',
        rationale: 'Control resistencia insulínica + inducción ovulación'
      };
      secondLine = {
        treatment: 'Letrozol + IUI',
        successProbability: 30,
        rationale: 'Inhibidor aromatasa más efectivo en PCOS'
      };
    }
    
    if (primaryDiagnosis.pathology.includes('DIMINISHED_OVARIAN_RESERVE')) {
      firstLine = {
        treatment: 'FIV con protocolo suave',
        successProbability: 20,
        timeframe: '1-2 ciclos',
        rationale: 'Tiempo limitado por reserva baja'
      };
      thirdLine = {
        treatment: 'Ovodonación',
        successProbability: 60,
        rationale: 'Mejor opción con reserva muy baja'
      };
    }
    
    // Ajustes por edad y riesgo
    if (userInput.age >= 40 || riskStratification.level === 'critical') {
      firstLine.treatment = 'FIV inmediata';
      firstLine.successProbability = Math.max(15, firstLine.successProbability - 10);
      firstLine.rationale = 'Urgencia por edad/riesgo alto';
    }
    
    return {
      firstLine,
      secondLine,
      thirdLine
    };
  }

  /**
   * 🔧 UTILIDADES PRIVADAS
   */
  private parsePrevalence(prevalence: string): number {
    // Extrae número de cadenas como "5-10%" → 7.5
    const match = prevalence.match(/(\d+)(?:-(\d+))?%/);
    if (match) {
      const min = parseInt(match[1]);
      const max = match[2] ? parseInt(match[2]) : min;
      return (min + max) / 2;
    }
    return 5; // Default
  }
}

// Exportar instancia singleton
export const clinicalEngine = SimplifiedClinicalEngine.getInstance();
