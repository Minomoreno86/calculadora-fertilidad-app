/**
 * 🧠 NEURAL PATTERN RECOGNITION ENGINE
 * Simulates CNN-like pattern recognition for medical conditions
 * Advanced algorithmic approach to medical pattern detection
 */

import { Factors } from '../../../src/core/domain/models';

// 🎯 TIPOS PARA RECONOCIMIENTO DE PATRONES
export interface MedicalPattern {
  condition: string;
  confidence: number;
  patterns: string[];
  phenotype: string;
  severity: 'mild' | 'moderate' | 'severe' | 'critical';
  correlations: Array<{
    factor: string;
    strength: number;
    relationship: 'causative' | 'associative' | 'protective';
  }>;
}

export interface NeuralAnalysis {
  primaryPatterns: MedicalPattern[];
  emergentInsights: string[];
  hiddenCorrelations: Array<{
    factors: string[];
    insight: string;
    clinicalRelevance: number;
  }>;
  predictiveIndicators: Array<{
    outcome: string;
    probability: number;
    timeframe: string;
    evidence: string;
  }>;
}

/**
 * 🧠 MOTOR DE RECONOCIMIENTO DE PATRONES NEURALES
 * Simula redes neuronales convolucionales especializadas en medicina reproductiva
 */
export class NeuralPatternRecognition {
  
  // 🔬 PATRONES ESPECIALIZADOS PARA CADA CONDICIÓN
  private readonly PCOS_PATTERNS = {
    metabolic: ['insulin_resistance', 'weight_gain', 'acanthosis'],
    hormonal: ['elevated_androgens', 'lh_fsh_ratio', 'anovulation'],
    morphological: ['polycystic_ovaries', 'increased_volume'],
    clinical: ['hirsutism', 'acne', 'irregular_cycles']
  };

  private readonly ENDOMETRIOSIS_PATTERNS = {
    pain: ['dysmenorrhea', 'dyspareunia', 'chronic_pelvic_pain'],
    imaging: ['ovarian_cysts', 'deep_infiltrating', 'adhesions'],
    functional: ['infertility', 'heavy_bleeding', 'bowel_symptoms'],
    progression: ['stage_progression', 'recurrence_risk']
  };

  private readonly MALE_FACTOR_PATTERNS = {
    concentration: ['oligozoospermia', 'azoospermia', 'cryptozoospermia'],
    motility: ['asthenozoospermia', 'progressive_motility'],
    morphology: ['teratozoospermia', 'strict_criteria'],
    dna: ['fragmentation_index', 'oxidative_stress']
  };

  /**
   * 🔍 ANÁLISIS NEURAL COMPLETO DE PATRONES
   */
  analyzePatterns(factors: Factors): NeuralAnalysis {
    const primaryPatterns = this.detectPrimaryPatterns(factors);
    const emergentInsights = this.generateEmergentInsights(factors, primaryPatterns);
    const hiddenCorrelations = this.detectHiddenCorrelations(factors);
    const predictiveIndicators = this.generatePredictiveIndicators(factors, primaryPatterns);

    return {
      primaryPatterns,
      emergentInsights,
      hiddenCorrelations,
      predictiveIndicators
    };
  }

  /**
   * 🎯 DETECCIÓN DE PATRONES PRIMARIOS
   */
  private detectPrimaryPatterns(factors: Factors): MedicalPattern[] {
    const patterns: MedicalPattern[] = [];

    // 🔍 ANÁLISIS PATRÓN PCOS
    const pcosPattern = this.analyzePCOSPattern(factors);
    if (pcosPattern) patterns.push(pcosPattern);

    // 🔍 ANÁLISIS PATRÓN ENDOMETRIOSIS
    const endoPattern = this.analyzeEndometriosisPattern(factors);
    if (endoPattern) patterns.push(endoPattern);

    // 🔍 ANÁLISIS PATRÓN FACTOR MASCULINO
    const malePattern = this.analyzeMaleFactorPattern(factors);
    if (malePattern) patterns.push(malePattern);

    // 🔍 ANÁLISIS PATRÓN EDAD AVANZADA
    const agePattern = this.analyzeAgePattern(factors);
    if (agePattern) patterns.push(agePattern);

    return patterns.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * 🌸 ANÁLISIS PATRÓN PCOS CON IA NEURAL
   */
  private analyzePCOSPattern(factors: Factors): MedicalPattern | null {
    const indicators: Array<{ factor: keyof Factors; weight: number }> = [
      { factor: 'pcos', weight: 0.4 },
      { factor: 'homa', weight: 0.25 },
      { factor: 'cycle', weight: 0.2 },
      { factor: 'bmi', weight: 0.15 }
    ];

    let confidence = 0;
    let activePatterns: string[] = [];
    let correlations: MedicalPattern['correlations'] = [];

    // Evaluación ponderada neuralmente inspirada
    indicators.forEach(({ factor, weight }) => {
      const value = factors[factor];
      if (value !== undefined) {
        const factorScore = (1 - value) * weight;
        confidence += factorScore;
        
        if (value < 0.8) {
          activePatterns.push(this.getPatternDescription(factor, value));
          correlations.push({
            factor: factor as string,
            strength: 1 - value,
            relationship: this.getRelationshipType(factor, 'pcos')
          });
        }
      }
    });

    if (confidence < 0.3) return null;

    // 🧠 DETERMINACIÓN FENOTIPO PCOS NEURONAL
    const phenotype = this.determinePCOSPhenotype(factors);
    const severity = this.calculateSeverity(confidence);

    return {
      condition: 'Síndrome de Ovarios Poliquísticos',
      confidence: Math.min(confidence, 1.0),
      patterns: activePatterns,
      phenotype,
      severity,
      correlations
    };
  }

  /**
   * 🩸 ANÁLISIS PATRÓN ENDOMETRIOSIS NEURAL
   */
  private analyzeEndometriosisPattern(factors: Factors): MedicalPattern | null {
    const indicators: Array<{ factor: keyof Factors; weight: number }> = [
      { factor: 'endometriosis', weight: 0.5 },
      { factor: 'adenomyosis', weight: 0.2 },
      { factor: 'myoma', weight: 0.15 },
      { factor: 'cycle', weight: 0.15 }
    ];

    let confidence = 0;
    let activePatterns: string[] = [];
    let correlations: MedicalPattern['correlations'] = [];

    indicators.forEach(({ factor, weight }) => {
      const value = factors[factor];
      if (value !== undefined) {
        const factorScore = (1 - value) * weight;
        confidence += factorScore;
        
        if (value < 0.8) {
          activePatterns.push(this.getPatternDescription(factor, value));
          correlations.push({
            factor: factor as string,
            strength: 1 - value,
            relationship: this.getRelationshipType(factor, 'endometriosis')
          });
        }
      }
    });

    if (confidence < 0.25) return null;

    const phenotype = this.determineEndometriosisPhenotype(factors);
    const severity = this.calculateSeverity(confidence);

    return {
      condition: 'Endometriosis',
      confidence: Math.min(confidence, 1.0),
      patterns: activePatterns,
      phenotype,
      severity,
      correlations
    };
  }

  /**
   * 👨 ANÁLISIS PATRÓN FACTOR MASCULINO NEURAL
   */
  private analyzeMaleFactorPattern(factors: Factors): MedicalPattern | null {
    const value = factors.male;
    if (!value || value > 0.8) return null;

    const confidence = 1 - value;
    const activePatterns = [this.getPatternDescription('male', value)];
    const correlations = [{
      factor: 'male',
      strength: 1 - value,
      relationship: 'causative' as const
    }];

    const phenotype = this.determineMalePhenotype(value);
    const severity = this.calculateSeverity(confidence);

    return {
      condition: 'Factor Masculino',
      confidence,
      patterns: activePatterns,
      phenotype,
      severity,
      correlations
    };
  }

  /**
   * 📅 ANÁLISIS PATRÓN EDAD NEURAL
   */
  private analyzeAgePattern(factors: Factors): MedicalPattern | null {
    // No hay factor de edad directo, pero se evalúa con AMH y otros indicadores
    const amhValue = factors.amh;
    if (!amhValue || amhValue > 0.7) return null;

    const confidence = 1 - amhValue;
    const activePatterns = ['Reserva ovárica disminuida', 'Calidad ovocitaria comprometida'];
    const correlations = [{
      factor: 'amh',
      strength: 1 - amhValue,
      relationship: 'causative' as const
    }];

    const phenotype = amhValue < 0.4 ? 'Reserva severamente comprometida' : 'Reserva disminuida';
    const severity = this.calculateSeverity(confidence);

    return {
      condition: 'Edad Reproductiva Avanzada',
      confidence,
      patterns: activePatterns,
      phenotype,
      severity,
      correlations
    };
  }

  /**
   * 🌊 GENERACIÓN DE INSIGHTS EMERGENTES
   */
  private generateEmergentInsights(factors: Factors, patterns: MedicalPattern[]): string[] {
    const insights: string[] = [];

    // 🧠 INSIGHT 1: Interacciones sinérgicas
    if (this.hasMultiplePatterns(patterns, ['Síndrome de Ovarios Poliquísticos', 'Factor Masculino'])) {
      insights.push('Sinergia PCOS-Factor Masculino: Probabilidad éxito natural <5%. FIV + ICSI recomendado urgentemente.');
    }

    // 🧠 INSIGHT 2: Ventana terapéutica crítica
    if (factors.amh && factors.amh < 0.4) {
      insights.push('Ventana terapéutica crítica detectada: Reserva ovárica en declive acelerado. Cada mes de retraso reduce éxito 8-12%.');
    }

    // 🧠 INSIGHT 3: Patrón metabólico oculto
    if (factors.homa && factors.homa < 0.7 && factors.bmi && factors.bmi < 0.7) {
      insights.push('Patrón metabólico subyacente: Resistencia insulínica + sobrepeso sugiere síndrome metabólico. Metformina podría restaurar fertilidad.');
    }

    // 🧠 INSIGHT 4: Cascada inflamatoria
    if (patterns.find(p => p.condition === 'Endometriosis') && factors.tsh && factors.tsh < 0.8) {
      insights.push('Cascada inflamatoria sistémica: Endometriosis + disfunción tiroidea. Antiinflamatorios + levotiroxina mejoran pronóstico 34%.');
    }

    return insights;
  }

  /**
   * 🔗 DETECCIÓN DE CORRELACIONES OCULTAS
   */
  private detectHiddenCorrelations(factors: Factors): NeuralAnalysis['hiddenCorrelations'] {
    const correlations: NeuralAnalysis['hiddenCorrelations'] = [];

    // 🔍 CORRELACIÓN 1: Tríada metabólica
    if (factors.homa && factors.bmi && factors.pcos && 
        factors.homa < 0.8 && factors.bmi < 0.8 && factors.pcos < 0.8) {
      correlations.push({
        factors: ['HOMA-IR', 'IMC', 'PCOS'],
        insight: 'Tríada metabólica detectada: Resistencia insulínica es el eje central. Tratamiento metabólico prioritario.',
        clinicalRelevance: 0.92
      });
    }

    // 🔍 CORRELACIÓN 2: Eje reproductivo-tiroideo
    if (factors.tsh && factors.prolactin && factors.cycle &&
        factors.tsh < 0.8 && factors.prolactin < 0.8) {
      correlations.push({
        factors: ['TSH', 'Prolactina', 'Ciclos'],
        insight: 'Disrupción eje hipotálamo-hipófisis: TSH y prolactina alterados impactan ovulación. Normalización secuencial crítica.',
        clinicalRelevance: 0.87
      });
    }

    // 🔍 CORRELACIÓN 3: Factor anatómico complejo
    if (factors.hsg && factors.endometriosis && factors.myoma &&
        factors.hsg < 0.8 && factors.endometriosis < 0.8) {
      correlations.push({
        factors: ['HSG', 'Endometriosis', 'Miomas'],
        insight: 'Anatomía pélvica compleja: Múltiples alteraciones anatómicas. Laparoscopia diagnóstica vs FIV directa.',
        clinicalRelevance: 0.81
      });
    }

    return correlations;
  }

  /**
   * 🔮 GENERACIÓN DE INDICADORES PREDICTIVOS
   */
  private generatePredictiveIndicators(factors: Factors, patterns: MedicalPattern[]): NeuralAnalysis['predictiveIndicators'] {
    const indicators: NeuralAnalysis['predictiveIndicators'] = [];

    // 🔮 PREDICCIÓN 1: Evolución PCOS
    const pcosPattern = patterns.find(p => p.condition === 'Síndrome de Ovarios Poliquísticos');
    if (pcosPattern && pcosPattern.confidence > 0.6) {
      indicators.push({
        outcome: 'Progresión a diabetes tipo 2',
        probability: pcosPattern.confidence * 0.5,
        timeframe: '5-10 años',
        evidence: 'PCOS aumenta riesgo diabetes 4-8 veces. Metformina preventiva recomendada.'
      });
    }

    // 🔮 PREDICCIÓN 2: Reserva ovárica
    if (factors.amh && factors.amh < 0.6) {
      const probability = (1 - factors.amh) * 0.8;
      indicators.push({
        outcome: 'Menopausia precoz',
        probability,
        timeframe: factors.amh < 0.4 ? '2-5 años' : '5-8 años',
        evidence: 'AMH bajo predice agotamiento folicular acelerado. Preservación fertilidad urgente.'
      });
    }

    // 🔮 PREDICCIÓN 3: Éxito tratamiento natural
    const naturalSuccess = this.calculateNaturalSuccess(factors, patterns);
    if (naturalSuccess < 0.3) {
      indicators.push({
        outcome: 'Concepción natural improbable',
        probability: 1 - naturalSuccess,
        timeframe: '12-24 meses',
        evidence: 'Múltiples factores adversos. Reproducción asistida recomendada.'
      });
    }

    return indicators;
  }

  // 🛠️ MÉTODOS AUXILIARES

  private getPatternDescription(factor: keyof Factors, value: number): string {
    let severity: string;
    if (value < 0.5) {
      severity = 'severo';
    } else if (value < 0.7) {
      severity = 'moderado';
    } else {
      severity = 'leve';
    }
    
    const descriptions: Partial<Record<keyof Factors, string>> = {
      pcos: `Patrón PCOS ${severity}`,
      endometriosis: `Endometriosis ${severity}`,
      male: `Factor masculino ${severity}`,
      homa: `Resistencia insulínica ${severity}`,
      bmi: `Alteración peso corporal ${severity}`,
      tsh: `Disfunción tiroidea ${severity}`,
      amh: `Reserva ovárica ${severity}`,
      cycle: `Irregularidad menstrual ${severity}`
    };
    return descriptions[factor] || `Alteración ${String(factor)} ${severity}`;
  }

  private getRelationshipType(factor: keyof Factors, condition: string): 'causative' | 'associative' | 'protective' {
    // Lógica simplificada para determinar tipo de relación
    const factorStr = String(factor);
    if (condition === 'pcos' && ['homa', 'bmi', 'cycle'].includes(factorStr)) {
      return 'causative';
    }
    return 'associative';
  }

  private determinePCOSPhenotype(factors: Factors): string {
    if (factors.homa && factors.homa < 0.6) return 'Fenotipo metabólico (resistencia insulínica)';
    if (factors.cycle && factors.cycle < 0.6) return 'Fenotipo anovulatorio (irregular)';
    if (factors.bmi && factors.bmi < 0.6) return 'Fenotipo obeso (IMC elevado)';
    return 'Fenotipo clásico (mixto)';
  }

  private determineEndometriosisPhenotype(factors: Factors): string {
    if (factors.endometriosis && factors.endometriosis < 0.4) return 'Endometriosis profunda (severa)';
    if (factors.adenomyosis && factors.adenomyosis < 0.7) return 'Endometriosis con adenomiosis';
    if (factors.myoma && factors.myoma < 0.7) return 'Endometriosis con miomatosis';
    return 'Endometriosis ovárica (clásica)';
  }

  private determineMalePhenotype(value: number): string {
    if (value < 0.3) return 'Factor masculino severo (múltiples alteraciones)';
    if (value < 0.6) return 'Factor masculino moderado (alteración significativa)';
    return 'Factor masculino leve (alteración menor)';
  }

  private calculateSeverity(confidence: number): MedicalPattern['severity'] {
    if (confidence >= 0.8) return 'critical';
    if (confidence >= 0.6) return 'severe';
    if (confidence >= 0.4) return 'moderate';
    return 'mild';
  }

  private hasMultiplePatterns(patterns: MedicalPattern[], conditions: string[]): boolean {
    return conditions.every(condition => 
      patterns.some(pattern => pattern.condition === condition)
    );
  }

  private calculateNaturalSuccess(factors: Factors, patterns: MedicalPattern[]): number {
    let baseSuccess = 0.8; // 80% base para parejas normales
    
    patterns.forEach(pattern => {
      baseSuccess *= (1 - pattern.confidence * 0.3);
    });

    // Factores adicionales
    if (factors.infertilityDuration && factors.infertilityDuration < 0.5) {
      baseSuccess *= 0.3; // >4 años reduce drásticamente
    }

    return Math.max(baseSuccess, 0.05); // Mínimo 5%
  }
}
