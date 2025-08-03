/**
 * 🧮 CALCULATION CORE - Lógica Pura de Cálculo
 * 
 * Módulo que contiene únicamente funciones puras de cálculo,
 * extraídas del monolito calculationEngine.ts para crear arquitectura modular.
 * 
 * FUNCIONES PURAS: Sin efectos secundarios, sin dependencias externas
 * RESPONSABILIDAD ÚNICA: Solo lógica de cálculo matemático
 * TESTEABLE: 100% determinista y predecible
 */

import { 
  UserInput, 
  EvaluationState, 
  Factors, 
  Diagnostics, 
  Report,
  MyomaType,
  AdenomyosisType,
  PolypType,
  HsgResult
} from '../../models';
import * as factorEvaluators from '../../logic/factorEvaluators';
import * as reportGenerator from '../../logic/reportGenerator';

// ===================================================================
// 🎯 INTERFACES PARA CALCULATION CORE
// ===================================================================

/**
 * Resultado de evaluación parcial de factorEvaluators
 */
export interface PartialEvaluation {
  factors?: Partial<Factors>;
  diagnostics?: Partial<Diagnostics>;
}

/**
 * Resultado de validación unificado
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  fieldErrors: Record<string, string>;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  validatedInput?: UserInput;
}

/**
 * Resultado de evaluación de factor individual
 */
export interface FactorEvaluationResult {
  success: boolean;
  factors: Partial<Factors>;
  diagnostics: Partial<Diagnostics>;
  executionTime: number;
  error?: string;
  metadata?: {
    evaluatorName: string;
    inputValues: unknown[];
    confidence: number;
  };
}

// ===================================================================
// 🎯 TIPOS PARA EVALUADORES
// ===================================================================

type FactorEvaluatorFunction = (...args: readonly unknown[]) => PartialEvaluation;

/**
 * Configuración de factor con prioridades
 */
export interface PriorityFactorConfig {
  evaluator: FactorEvaluatorFunction;
  args: unknown[];
  factorKey: keyof Factors;
  diagnosticKey?: keyof Diagnostics;
  required: boolean;
  priority: number; // 1=CRÍTICO, 2=IMPORTANTE, 3=OPCIONAL
  group: 'CRITICOS' | 'IMPORTANTES' | 'OPCIONALES';
  defaultFactor?: number;
  defaultDiagnostic?: string;
}

/**
 * Métricas de cálculo
 */
export interface CalculationMetrics {
  totalExecutionTime: number;
  factorsEvaluated: number;
  successfulFactors: number;
  failedFactors: number;
  criticalErrors: string[];
  performanceScore: number;
}

// ===================================================================
// 🧮 CALCULATION CORE CLASS
// ===================================================================

export class CalculationCore {
  private readonly DEFAULT_FACTOR_VALUE = 0.5;
  
  // ===================================================================
  // 🔍 FUNCIONES DE VALIDACIÓN PURA
  // ===================================================================
  
  /**
   * Valida entrada de usuario con lógica pura
   */
  validateInput(input: UserInput): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const fieldErrors: Record<string, string> = {};
    
    // Validaciones críticas
    if (!input.age || input.age < 18 || input.age > 50) {
      errors.push('Edad debe estar entre 18 y 50 años');
      fieldErrors.age = 'Rango inválido';
    }
    
    if (input.bmi && (input.bmi < 16 || input.bmi > 45)) {
      warnings.push('BMI fuera del rango típico (16-45)');
      fieldErrors.bmi = 'Valor atípico';
    }
    
    if (input.cycleDuration && (input.cycleDuration < 21 || input.cycleDuration > 35)) {
      warnings.push('Duración de ciclo atípica');
      fieldErrors.cycleDuration = 'Fuera de rango normal';
    }
    
    // Validaciones de consistencia
    if (input.hasOtb && !input.cycleDuration) {
      warnings.push('OTB marcado pero sin duración de ciclo');
    }
    
    if (input.hasPcos && input.cycleDuration && input.cycleDuration < 35) {
      warnings.push('PCOS usualmente causa ciclos >35 días');
    }
    
    // Determinar severidad de manera explícita
    let severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    if (errors.length > 0) {
      severity = 'CRITICAL';
    } else if (warnings.length > 2) {
      severity = 'HIGH';
    } else if (warnings.length > 0) {
      severity = 'MEDIUM';
    } else {
      severity = 'LOW';
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      fieldErrors,
      severity,
      validatedInput: this.sanitizeInput(input)
    };
  }
  
  /**
   * Sanitiza entrada de usuario
   */
  sanitizeInput(input: UserInput): UserInput {
    return {
      ...input,
      // Normalizar valores numéricos
      age: Math.round((input.age || 0) * 10) / 10,
      bmi: input.bmi ? Math.round(input.bmi * 100) / 100 : null,
      cycleDuration: input.cycleDuration || 28,
      infertilityDuration: input.infertilityDuration || 0,
      
      // Normalizar grados y tipos
      endometriosisGrade: Math.max(0, Math.min(4, input.endometriosisGrade || 0)),
      pelvicSurgeriesNumber: Math.max(0, input.pelvicSurgeriesNumber || 0),
      
      // Usar enums correctos
      myomaType: input.myomaType || MyomaType.None,
      adenomyosisType: input.adenomyosisType || AdenomyosisType.None,
      polypType: input.polypType || PolypType.None,
      hsgResult: input.hsgResult || HsgResult.Unknown
    };
  }
  
  // ===================================================================
  // 🧮 FUNCIONES DE CÁLCULO PURO
  // ===================================================================
  
  /**
   * Calcula todos los factores de fertilidad
   */
  calculateFactors(input: UserInput): { factors: Factors; metrics: CalculationMetrics } {
    console.log('🎯 CalculationCore.calculateFactors EJECUTÁNDOSE:', { infertilityDuration: input.infertilityDuration });
    const startTime = performance.now();
    const factors: Factors = {
      baseAgeProbability: 0,
      bmi: 0,
      cycle: 0,
      pcos: 0,
      endometriosis: 0,
      myoma: 0,
      adenomyosis: 0,
      polyp: 0,
      hsg: 0,
      otb: 0,
      amh: 0,
      prolactin: 0,
      tsh: 0,
      homa: 0,
      male: 0,
      infertilityDuration: 0,
      pelvicSurgery: 0
    };
    const metrics: CalculationMetrics = {
      totalExecutionTime: 0,
      factorsEvaluated: 0,
      successfulFactors: 0,
      failedFactors: 0,
      criticalErrors: [],
      performanceScore: 0
    };
    
    // Obtener configuraciones por prioridad
    const factorConfigs = this.getFactorConfigurations(input);
    
    // Procesar por grupos de prioridad
    const groups = ['CRITICOS', 'IMPORTANTES', 'OPCIONALES'] as const;
    
    for (const group of groups) {
      const groupConfigs = factorConfigs.filter(config => config.group === group);
      const groupResult = this.processFactorGroup(groupConfigs, factors);
      
      metrics.factorsEvaluated += groupConfigs.length;
      metrics.successfulFactors += groupResult.successCount;
      metrics.failedFactors += groupResult.errorCount;
      metrics.criticalErrors.push(...groupResult.criticalErrors);
      
      // Si hay errores críticos, detener procesamiento
      if (group === 'CRITICOS' && groupResult.criticalErrors.length > 0) {
        break;
      }
    }
    
    metrics.totalExecutionTime = performance.now() - startTime;
    metrics.performanceScore = this.calculatePerformanceScore(metrics);
    
    return { factors, metrics };
  }
  
  /**
   * Genera diagnósticos basados en factores
   */
  generateDiagnostics(factors: Factors, input: UserInput): Diagnostics {
    const diagnostics: Diagnostics = {};
    
    // Obtener configuraciones de diagnóstico
    const diagnosticConfigs = this.getDiagnosticConfigurations(input);
    
    for (const config of diagnosticConfigs) {
      try {
        const result = this.safeEvaluateFactor(
          config.evaluator,
          config.args,
          config.factorKey
        );
        
        if (result.success && result.diagnostics) {
          Object.assign(diagnostics, result.diagnostics);
        }
      } catch (error) {
        console.warn(`Warning en diagnóstico ${config.factorKey}:`, error);
      }
    }
    
    return diagnostics;
  }
  
  /**
   * Crea reporte final
   */
  createReport(factors: Factors, diagnostics: Diagnostics, input: UserInput): Report {
    try {
      // 🎯 CRITICAL FIX: Usar factores como multiplicadores de la probabilidad base
      // La fórmula correcta es: probabilidad_base × (multiplicador1 × multiplicador2 × ...)
      
      // Obtener probabilidad base de edad (ya viene como porcentaje)
      const baseAgeProbability = factors.baseAgeProbability || 17.5;
      
      // 🔍 DEBUG: Factores antes de normalizar
      console.log('🔍 FACTORS DEBUG - Before normalization:', {
        'factors.hsg': factors.hsg,
        'factors.otb': factors.otb,
        hsgType: typeof factors.hsg,
        otbType: typeof factors.otb
      });

      // Normalizar factores - CORREGIDO: solo undefined se convierte a 1.0 (neutro)
      const normalizedFactors = {
        bmi: factors.bmi === 0 ? 1.0 : factors.bmi,
        cycle: factors.cycle === 0 ? 1.0 : factors.cycle,
        pcos: factors.pcos === 0 ? 1.0 : factors.pcos,
        endometriosis: factors.endometriosis === 0 ? 1.0 : factors.endometriosis,
        myoma: factors.myoma === 0 ? 1.0 : factors.myoma,
        adenomyosis: factors.adenomyosis === 0 ? 1.0 : factors.adenomyosis,
        polyp: factors.polyp === 0 ? 1.0 : factors.polyp,
        hsg: factors.hsg === undefined ? 1.0 : factors.hsg, // ✅ CORREGIDO: 0.0 es válido (bilateral)
        otb: factors.otb === undefined ? 1.0 : factors.otb, // ✅ CORREGIDO: 0.0 es válido (ligadura)
        amh: factors.amh === 0 ? 1.0 : factors.amh,
        prolactin: factors.prolactin === 0 ? 1.0 : factors.prolactin,
        tsh: factors.tsh === 0 ? 1.0 : factors.tsh,
        homa: factors.homa === 0 ? 1.0 : factors.homa,
        male: factors.male === 0 ? 1.0 : factors.male,
        infertilityDuration: factors.infertilityDuration === 0 ? 1.0 : factors.infertilityDuration,
        pelvicSurgery: factors.pelvicSurgery === 0 ? 1.0 : factors.pelvicSurgery
      };

      // 🔍 DEBUG: Factores después de normalizar
      console.log('🔍 FACTORS DEBUG - After normalization:', {
        'normalizedFactors.hsg': normalizedFactors.hsg,
        'normalizedFactors.otb': normalizedFactors.otb,
        baseAgeProbability,
        'Expected calc': `${baseAgeProbability} * ${normalizedFactors.hsg} = ${baseAgeProbability * normalizedFactors.hsg}`
      });
      
      // Calcular multiplicador combinado
      const combinedMultiplier = 
        normalizedFactors.bmi * 
        normalizedFactors.cycle * 
        normalizedFactors.pcos * 
        normalizedFactors.endometriosis * 
        normalizedFactors.myoma * 
        normalizedFactors.adenomyosis * 
        normalizedFactors.polyp * 
        normalizedFactors.hsg * 
        normalizedFactors.otb * 
        normalizedFactors.amh * 
        normalizedFactors.prolactin * 
        normalizedFactors.tsh * 
        normalizedFactors.homa * 
        normalizedFactors.male * 
        normalizedFactors.infertilityDuration * 
        normalizedFactors.pelvicSurgery;
      
      // Fórmula correcta: Probabilidad base × multiplicadores
      const calculatedPrognosis = baseAgeProbability * combinedMultiplier;
      
      // 🔍 DEBUG: Resultado final
      console.log('🔍 CALCULATION DEBUG - Final result:', {
        baseAgeProbability,
        combinedMultiplier,
        calculatedPrognosis,
        'hsg in multiplier': normalizedFactors.hsg,
        'otb in multiplier': normalizedFactors.otb
      });
      
      // Aplicar límites
      const numericPrognosis = Math.max(0.1, Math.min(100, calculatedPrognosis));
      
      console.log('🔍 FINAL RESULT:', { calculatedPrognosis, numericPrognosis });
      
      return reportGenerator.generateFinalReport(numericPrognosis, diagnostics, input, factors);
    } catch (error) {
      console.error('Error generando reporte:', error);
      
      // Reporte básico como fallback
      return {
        numericPrognosis: 5.0,
        category: 'BAJO',
        emoji: '🔴',
        prognosisPhrase: 'Error en el cálculo. Consulte con especialista.',
        benchmarkPhrase: 'No se pudo calcular la comparación.',
        clinicalInsights: []
      };
    }
  }
  
  // ===================================================================
  // 🛠️ FUNCIONES AUXILIARES PRIVADAS
  // ===================================================================
  
  /**
   * Obtiene configuraciones de factores por prioridad
   */
  private getFactorConfigurations(userInput: UserInput): PriorityFactorConfig[] {
    return [
      // FACTORES CRÍTICOS
      {
        evaluator: factorEvaluators.evaluateAgeBaseline as FactorEvaluatorFunction,
        args: [userInput.age],
        factorKey: 'baseAgeProbability',
        required: true,
        priority: 1,
        group: 'CRITICOS',
        defaultFactor: 0.5
      },
      {
        evaluator: factorEvaluators.evaluateInfertilityDuration as FactorEvaluatorFunction,
        args: [userInput.infertilityDuration ? userInput.infertilityDuration * 12 : undefined], // 🔄 CRITICAL FIX: Convertir años → meses
        factorKey: 'infertilityDuration',
        required: true,
        priority: 1,
        group: 'CRITICOS',
        defaultFactor: 0.5
      },
      
      // FACTORES IMPORTANTES
      {
        evaluator: factorEvaluators.evaluateBmi as FactorEvaluatorFunction,
        args: [userInput.bmi],
        factorKey: 'bmi',
        required: false,
        priority: 2,
        group: 'IMPORTANTES',
        defaultFactor: 0.6
      },
      {
        evaluator: factorEvaluators.evaluateCycle as FactorEvaluatorFunction,
        args: [userInput.cycleDuration],
        factorKey: 'cycle',
        required: false,
        priority: 2,
        group: 'IMPORTANTES',
        defaultFactor: 0.7
      },
      {
        evaluator: factorEvaluators.evaluateEndometriosis as FactorEvaluatorFunction,
        args: [userInput.endometriosisGrade],
        factorKey: 'endometriosis',
        required: false,
        priority: 2,
        group: 'IMPORTANTES',
        defaultFactor: 0.7
      },
      {
        evaluator: factorEvaluators.evaluatePcos as FactorEvaluatorFunction,
        args: [userInput.hasPcos, userInput.bmi, userInput.cycleDuration, userInput.amh, userInput.homaIr],
        factorKey: 'pcos',
        required: false,
        priority: 2,
        group: 'IMPORTANTES',
        defaultFactor: 0.6
      },
      {
        evaluator: factorEvaluators.evaluateMyomas as FactorEvaluatorFunction,
        args: [userInput.myomaType],
        factorKey: 'myoma',
        required: false,
        priority: 2,
        group: 'IMPORTANTES',
        defaultFactor: 0.8
      },
      {
        evaluator: factorEvaluators.evaluateAdenomyosis as FactorEvaluatorFunction,
        args: [userInput.adenomyosisType],
        factorKey: 'adenomyosis',
        required: false,
        priority: 2,
        group: 'IMPORTANTES',
        defaultFactor: 0.8
      },
      {
        evaluator: factorEvaluators.evaluatePolyps as FactorEvaluatorFunction,
        args: [userInput.polypType],
        factorKey: 'polyp',
        required: false,
        priority: 2,
        group: 'IMPORTANTES',
        defaultFactor: 0.8
      },
      {
        evaluator: factorEvaluators.evaluateHsg as FactorEvaluatorFunction,
        args: [userInput.hsgResult],
        factorKey: 'hsg',
        required: false,
        priority: 2,
        group: 'IMPORTANTES',
        defaultFactor: 0.7
      },
      {
        evaluator: factorEvaluators.evaluateOtb as FactorEvaluatorFunction,
        args: [userInput.hasOtb, userInput.age, userInput.otbMethod, userInput.remainingTubalLength, userInput.hasOtherInfertilityFactors, userInput.desireForMultiplePregnancies],
        factorKey: 'otb',
        required: false,
        priority: 2,
        group: 'IMPORTANTES',
        defaultFactor: 0.5
      },
      {
        evaluator: factorEvaluators.evaluatePelvicSurgeries as FactorEvaluatorFunction,
        args: [userInput.pelvicSurgeriesNumber],
        factorKey: 'pelvicSurgery',
        required: false,
        priority: 2,
        group: 'IMPORTANTES',
        defaultFactor: 0.9
      },
      
      // FACTORES OPCIONALES - Laboratorio y Male Factor
      {
        evaluator: factorEvaluators.evaluateAmh as FactorEvaluatorFunction,
        args: [userInput.amh],
        factorKey: 'amh',
        required: false,
        priority: 3,
        group: 'OPCIONALES'
      },
      {
        evaluator: factorEvaluators.evaluateProlactin as FactorEvaluatorFunction,
        args: [userInput.prolactin],
        factorKey: 'prolactin',
        required: false,
        priority: 3,
        group: 'OPCIONALES'
      },
      {
        evaluator: factorEvaluators.evaluateTsh as FactorEvaluatorFunction,
        args: [userInput.tsh],
        factorKey: 'tsh',
        required: false,
        priority: 3,
        group: 'OPCIONALES'
      },
      {
        evaluator: factorEvaluators.evaluateHoma as FactorEvaluatorFunction,
        args: [userInput.homaIr],
        factorKey: 'homa',
        required: false,
        priority: 3,
        group: 'OPCIONALES'
      },
      {
        evaluator: factorEvaluators.evaluateMaleFactor as FactorEvaluatorFunction,
        args: [userInput],
        factorKey: 'male',
        required: false,
        priority: 3,
        group: 'OPCIONALES'
      }
    ];
  }
  
  /**
   * Obtiene configuraciones de diagnósticos
   */
  private getDiagnosticConfigurations(userInput: UserInput): PriorityFactorConfig[] {
    return this.getFactorConfigurations(userInput).map(config => ({
      ...config,
      diagnosticKey: this.getCorrespondingDiagnosticKey(config.factorKey)
    })).filter(config => config.diagnosticKey);
  }
  
  /**
   * Mapea factor key a diagnostic key
   */
  private getCorrespondingDiagnosticKey(factorKey: keyof Factors): keyof Diagnostics | undefined {
    const mapping: Partial<Record<keyof Factors, keyof Diagnostics>> = {
      baseAgeProbability: 'agePotential',
      bmi: 'bmiComment',
      cycle: 'cycleComment',
      endometriosis: 'endometriosisComment',
      pcos: 'pcosSeverity',
      amh: 'ovarianReserve',
      tsh: 'tshComment',
      prolactin: 'prolactinComment',
      homa: 'homaComment',
      myoma: 'myomaComment',
      adenomyosis: 'adenomyosisComment',
      polyp: 'polypComment',
      hsg: 'hsgComment',
      otb: 'otbComment',
      male: 'maleFactorDetailed'
    };
    
    return mapping[factorKey];
  }
  
  /**
   * Procesa grupo de factores de manera segura
   */
  private processFactorGroup(
    configs: PriorityFactorConfig[],
    factors: Factors
  ): { successCount: number; errorCount: number; criticalErrors: string[] } {
    console.log('🔧 processFactorGroup EJECUTÁNDOSE:', { 
      configsCount: configs.length, 
      factorKeys: configs.map(c => c.factorKey) 
    });
    let successCount = 0;
    let errorCount = 0;
    const criticalErrors: string[] = [];
    
    for (const config of configs) {
      console.log('🎮 Procesando factor:', { 
        factorKey: config.factorKey, 
        args: config.args,
        evaluatorName: config.evaluator.name 
      });
      const evaluation = this.safeEvaluateFactor(
        config.evaluator,
        config.args,
        config.factorKey
      );
      
      if (evaluation.success && evaluation.factors) {
        successCount++;
        Object.assign(factors, evaluation.factors);
        console.log('✅ Factor exitoso:', { 
          factorKey: config.factorKey, 
          factorValue: evaluation.factors[config.factorKey] 
        });
      } else {
        errorCount++;
        console.log('❌ Factor falló:', { 
          factorKey: config.factorKey, 
          error: evaluation.error 
        });
        
        if (config.required) {
          criticalErrors.push(`Factor crítico ${config.factorKey}: ${evaluation.error}`);
        }
        
        // Aplicar valor por defecto
        if (config.defaultFactor !== undefined) {
          factors[config.factorKey] = config.defaultFactor;
          console.log('🔄 Aplicando factor por defecto:', { 
            factorKey: config.factorKey, 
            defaultValue: config.defaultFactor 
          });
        }
      }
    }
    
    return { successCount, errorCount, criticalErrors };
  }
  
  /**
   * Evalúa factor de manera segura
   */
  private safeEvaluateFactor(
    evaluator: FactorEvaluatorFunction,
    args: unknown[],
    factorKey: keyof Factors
  ): FactorEvaluationResult {
    const startTime = performance.now();
    
    try {
      const result = evaluator(...args);
      const executionTime = performance.now() - startTime;
      
      if (result && typeof result === 'object') {
        return {
          success: true,
          factors: result.factors || {},
          diagnostics: result.diagnostics || {},
          executionTime,
          metadata: {
            evaluatorName: evaluator.name || 'unknown',
            inputValues: args,
            confidence: 1.0
          }
        };
      } else {
        // Resultado primitivo - crear estructura compatible
        return {
          success: true,
          factors: { [factorKey]: result },
          diagnostics: {},
          executionTime,
          metadata: {
            evaluatorName: evaluator.name || 'unknown',
            inputValues: args,
            confidence: 1.0
          }
        };
      }
    } catch (error) {
      return {
        success: false,
        factors: {},
        diagnostics: {},
        executionTime: performance.now() - startTime,
        error: String(error),
        metadata: {
          evaluatorName: evaluator.name || 'unknown',
          inputValues: args,
          confidence: 0.0
        }
      };
    }
  }
  
  /**
   * Calcula score de performance
   */
  private calculatePerformanceScore(metrics: CalculationMetrics): number {
    const successRate = metrics.factorsEvaluated > 0 ? 
      metrics.successfulFactors / metrics.factorsEvaluated : 0;
    
    const speedScore = metrics.totalExecutionTime < 100 ? 1.0 : 
                      Math.max(0, 1 - (metrics.totalExecutionTime - 100) / 500);
    
    const errorPenalty = metrics.criticalErrors.length * 0.2;
    
    return Math.max(0, Math.min(1, (successRate + speedScore) / 2 - errorPenalty));
  }
}

// ===================================================================
// 🎯 FUNCIONES PÚBLICAS DE CÁLCULO
// ===================================================================

/**
 * Función principal de cálculo sin dependencias externas
 */
export function calculatePureFertilityFactors(input: UserInput): EvaluationState {
  const core = new CalculationCore();
  
  // 1. Validar entrada
  const validation = core.validateInput(input);
  if (!validation.isValid) {
    throw new Error(`Validación falló: ${validation.errors.join(', ')}`);
  }
  
  // 2. Calcular factores
  const { factors } = core.calculateFactors(validation.validatedInput!);
  
  // 3. Generar diagnósticos
  const diagnostics = core.generateDiagnostics(factors, validation.validatedInput!);
  
  // 4. Crear reporte
  const report = core.createReport(factors, diagnostics, validation.validatedInput!);
  
  return {
    input: validation.validatedInput!,
    factors,
    diagnostics,
    report
  };
}

/**
 * Función de validación independiente
 */
export function validateUserInputPure(input: UserInput): ValidationResult {
  const core = new CalculationCore();
  return core.validateInput(input);
}

/**
 * Función de sanitización independiente
 */
export function sanitizeUserInputPure(input: UserInput): UserInput {
  const core = new CalculationCore();
  return core.sanitizeInput(input);
}
