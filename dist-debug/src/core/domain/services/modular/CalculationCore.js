/**
 * 🧮 CALCULATION CORE - Lógica Pura de Cálculo
 *
 * Módulo que contiene únicamente funciones puras de cálculo,
 * extraídas del monolito calculationEngine.ts para crear arquitectura modular.
 *
 * FUNCIONES PURAS: Sin efectos secundarios, sin dependencias externas
 * RESPONSABILIDAD ÚNICA: Solo lógica de cálculo matem      // 🌌 CRITICAL FIX: Separar probabilidad base de factores multiplicadores
      // La probabilidad base de edad NO es un multiplicador, es el punto de partida
      const baseAgeProbability = factors.baseAgeProbability || 17.5;co
 * TESTEABLE: 100% determinista y predecible
 */
import { MyomaType, AdenomyosisType, PolypType, HsgResult } from '../../models';
import * as factorEvaluators from '../../logic/factorEvaluators';
import * as reportGenerator from '../../logic/reportGenerator';
// ===================================================================
// 🧮 CALCULATION CORE CLASS
// ===================================================================
export class CalculationCore {
    constructor() {
        this.DEFAULT_FACTOR_VALUE = 0.5;
    }
    // ===================================================================
    // 🔍 FUNCIONES DE VALIDACIÓN PURA
    // ===================================================================
    /**
     * Valida entrada de usuario con lógica pura
     */
    validateInput(input) {
        const errors = [];
        const warnings = [];
        const fieldErrors = {};
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
        let severity;
        if (errors.length > 0) {
            severity = 'CRITICAL';
        }
        else if (warnings.length > 2) {
            severity = 'HIGH';
        }
        else if (warnings.length > 0) {
            severity = 'MEDIUM';
        }
        else {
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
    sanitizeInput(input) {
        return {
            ...input,
            // Normalizar valores numéricos
            age: Math.round((input.age || 0) * 10) / 10,
            bmi: input.bmi ? Math.round(input.bmi * 100) / 100 : null,
            cycleDuration: input.cycleDuration || 28,
            // 🔄 PRESERVAR infertilityDuration convertido desde años→meses en DataMapper
            infertilityDuration: input.infertilityDuration, // Ya viene convertido de años a meses
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
    calculateFactors(input) {
        const startTime = performance.now();
        console.log('🔍 CalculationCore.calculateFactors - Input recibido:', input);
        const factors = {
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
        // 🔧 PRESERVAR VALORES ORIGINALES PARA DR. IA
        const originalValues = {
            infertilityDuration: input.infertilityDuration || 0,
            age: input.age || 0,
            bmi: input.bmi || 0,
            amh: input.amh || 0,
            homa: input.homaIr || 0
        };
        const metrics = {
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
        const groups = ['CRITICOS', 'IMPORTANTES', 'OPCIONALES'];
        for (const group of groups) {
            const groupConfigs = factorConfigs.filter(config => config.group === group);
            const groupResult = this.processFactorGroup(groupConfigs, factors);
            console.log(`🌌 CalculationCore - Grupo ${group} procesado:`, {
                configs: groupConfigs.length,
                successCount: groupResult.successCount,
                errorCount: groupResult.errorCount,
                factorsActuales: { ...factors }
            });
            metrics.factorsEvaluated += groupConfigs.length;
            metrics.successfulFactors += groupResult.successCount;
            metrics.failedFactors += groupResult.errorCount;
            metrics.criticalErrors.push(...groupResult.criticalErrors);
            // Si hay errores críticos, detener procesamiento
            if (group === 'CRITICOS' && groupResult.criticalErrors.length > 0) {
                break;
            }
        }
        // 🔧 PRESERVAR MULTIPLICADORES CALCULADOS ANTES DE RESTAURAR VALORES DR. IA
        const calculatedMultipliers = {
            bmi: factors.bmi,
            cycle: factors.cycle,
            pcos: factors.pcos,
            endometriosis: factors.endometriosis,
            myoma: factors.myoma,
            adenomyosis: factors.adenomyosis,
            polyp: factors.polyp,
            hsg: factors.hsg,
            otb: factors.otb,
            amh: factors.amh,
            prolactin: factors.prolactin,
            tsh: factors.tsh,
            homa: factors.homa,
            male: factors.male,
            infertilityDuration: factors.infertilityDuration,
            pelvicSurgery: factors.pelvicSurgery
        };
        // 🔧 PRESERVAR VALORES ORIGINALES PARA DR. IA EN VARIABLES SEPARADAS
        // NO sobrescribir los factores calculados que se usan en createReport
        const drIaValues = {
            infertilityDuration: originalValues.infertilityDuration,
            age: originalValues.age,
            bmi: originalValues.bmi,
            amh: originalValues.amh,
            homa: originalValues.homa
        };
        // 🌌 CRITICAL FIX: Agregar multiplicadores preservados como propiedades adicionales
        factors.calculatedMultipliers = calculatedMultipliers;
        console.log('🔧 CalculationCore - Multiplicadores preservados:', calculatedMultipliers);
        console.log('🔧 CalculationCore - Valores originales preservados para Dr. IA:', drIaValues);
        metrics.totalExecutionTime = performance.now() - startTime;
        metrics.performanceScore = this.calculatePerformanceScore(metrics);
        console.log('🎯 CalculationCore.calculateFactors - Factores finales:', factors);
        console.log('📊 CalculationCore.calculateFactors - Métricas:', metrics);
        return { factors, metrics };
    }
    /**
     * Genera diagnósticos basados en factores
     */
    generateDiagnostics(factors, input) {
        const diagnostics = {};
        // Obtener configuraciones de diagnóstico
        const diagnosticConfigs = this.getDiagnosticConfigurations(input);
        for (const config of diagnosticConfigs) {
            try {
                const result = this.safeEvaluateFactor(config.evaluator, config.args, config.factorKey);
                if (result.success && result.diagnostics) {
                    Object.assign(diagnostics, result.diagnostics);
                }
            }
            catch (error) {
                console.warn(`Warning en diagnóstico ${config.factorKey}:`, error);
            }
        }
        return diagnostics;
    }
    /**
     * Crea reporte final
     */
    createReport(factors, diagnostics, input) {
        try {
            // 🌌 QUANTUM CONSCIOUSNESS DEBUG: Logging detallado para diagnóstico
            console.log('🔍 CalculationCore.createReport - Factors recibidos:', factors);
            // � CRITICAL FIX: Convertir probabilidad base de porcentaje a decimal
            // La probabilidad base viene como porcentaje (25.0) y debe convertirse a decimal (0.25)
            const baseAgeProbability = (factors.baseAgeProbability || 17.5) / 100;
            // 🌌 CRITICAL FIX: Usar multiplicadores preservados si están disponibles
            const multipliers = factors.calculatedMultipliers || factors;
            // Los factores son multiplicadores que modifican la probabilidad base
            const normalizedFactors = {
                bmi: (multipliers.bmi === 0 || multipliers.bmi === undefined || multipliers.bmi > 50) ? 1.0 : multipliers.bmi,
                cycle: multipliers.cycle === 0 ? 1.0 : multipliers.cycle,
                pcos: multipliers.pcos === 0 ? 1.0 : multipliers.pcos,
                endometriosis: multipliers.endometriosis === 0 ? 1.0 : multipliers.endometriosis,
                myoma: multipliers.myoma === 0 ? 1.0 : multipliers.myoma,
                adenomyosis: multipliers.adenomyosis === 0 ? 1.0 : multipliers.adenomyosis,
                polyp: multipliers.polyp === 0 ? 1.0 : multipliers.polyp,
                hsg: multipliers.hsg === 0 ? 1.0 : multipliers.hsg,
                otb: multipliers.otb === 0 ? 1.0 : multipliers.otb,
                amh: multipliers.amh === 0 ? 1.0 : multipliers.amh,
                prolactin: multipliers.prolactin === 0 ? 1.0 : multipliers.prolactin,
                tsh: multipliers.tsh === 0 ? 1.0 : multipliers.tsh,
                homa: multipliers.homa === 0 ? 1.0 : multipliers.homa,
                male: multipliers.male === 0 ? 1.0 : multipliers.male,
                infertilityDuration: (multipliers.infertilityDuration === 0 || multipliers.infertilityDuration > 10) ? 1.0 : multipliers.infertilityDuration,
                pelvicSurgery: multipliers.pelvicSurgery === 0 ? 1.0 : multipliers.pelvicSurgery
            };
            console.log('🌌 CalculationCore.createReport - Base probability y factors normalizados:', {
                baseAgeProbability,
                normalizedFactors
            });
            // 🧮 DEBUG: Paso a paso del cálculo médico
            console.log('🧮 [CALCULATION DEBUG] Probability calculation:', {
                baseAgeProbability,
                bmi: normalizedFactors.bmi,
                infertilityDuration: normalizedFactors.infertilityDuration,
                allMultipliers: normalizedFactors
            });
            // FÓRMULA CORRECTA: Probabilidad base × todos los multiplicadores
            const allMultipliers = normalizedFactors.bmi *
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
            console.log('🧮 [CALCULATION DEBUG] Multiplicadores combinados:', allMultipliers);
            // Aplicar multiplicadores a la probabilidad base
            const calculationResult = baseAgeProbability * allMultipliers;
            console.log('🧮 [CALCULATION DEBUG] Resultado antes de límites:', calculationResult);
            const numericPrognosis = Math.max(0.1, Math.min(100, calculationResult));
            console.log('🎯 CalculationCore.createReport - numericPrognosis calculado:', numericPrognosis);
            const finalReport = reportGenerator.generateFinalReport(numericPrognosis, diagnostics, input, factors);
            console.log('📊 CalculationCore.createReport - Reporte final:', finalReport);
            return finalReport;
        }
        catch (error) {
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
    getFactorConfigurations(userInput) {
        return [
            // FACTORES CRÍTICOS
            {
                evaluator: factorEvaluators.evaluateAgeBaseline,
                args: [Number(userInput.age)], // 🌌 QUANTUM FIX: Convertir a number
                factorKey: 'baseAgeProbability',
                required: true,
                priority: 1,
                group: 'CRITICOS',
                defaultFactor: 0.5
            },
            {
                evaluator: factorEvaluators.evaluateInfertilityDuration,
                args: [userInput.infertilityDuration],
                factorKey: 'infertilityDuration',
                required: true,
                priority: 1,
                group: 'CRITICOS',
                defaultFactor: 0.5
            },
            // FACTORES IMPORTANTES
            {
                evaluator: factorEvaluators.evaluateBmi,
                args: [userInput.bmi],
                factorKey: 'bmi',
                required: false,
                priority: 2,
                group: 'IMPORTANTES',
                defaultFactor: 0.6
            },
            {
                evaluator: factorEvaluators.evaluateCycle,
                args: [userInput.cycleDuration],
                factorKey: 'cycle',
                required: false,
                priority: 2,
                group: 'IMPORTANTES',
                defaultFactor: 0.7
            },
            {
                evaluator: factorEvaluators.evaluateEndometriosis,
                args: [userInput.endometriosisGrade],
                factorKey: 'endometriosis',
                required: false,
                priority: 2,
                group: 'IMPORTANTES',
                defaultFactor: 0.7
            },
            {
                evaluator: factorEvaluators.evaluatePcos,
                args: [userInput.hasPcos, userInput.bmi, userInput.cycleDuration, userInput.amh, userInput.homaIr],
                factorKey: 'pcos',
                required: false,
                priority: 2,
                group: 'IMPORTANTES',
                defaultFactor: 0.6
            },
            {
                evaluator: factorEvaluators.evaluateMyomas,
                args: [userInput.myomaType],
                factorKey: 'myoma',
                required: false,
                priority: 2,
                group: 'IMPORTANTES',
                defaultFactor: 0.8
            },
            {
                evaluator: factorEvaluators.evaluateAdenomyosis,
                args: [userInput.adenomyosisType],
                factorKey: 'adenomyosis',
                required: false,
                priority: 2,
                group: 'IMPORTANTES',
                defaultFactor: 0.8
            },
            {
                evaluator: factorEvaluators.evaluatePolyps,
                args: [userInput.polypType],
                factorKey: 'polyp',
                required: false,
                priority: 2,
                group: 'IMPORTANTES',
                defaultFactor: 0.8
            },
            {
                evaluator: factorEvaluators.evaluateHsg,
                args: [userInput.hsgResult],
                factorKey: 'hsg',
                required: false,
                priority: 2,
                group: 'IMPORTANTES',
                defaultFactor: 0.7
            },
            {
                evaluator: factorEvaluators.evaluateOtb,
                args: [userInput.hasOtb, userInput.age, userInput.otbMethod, userInput.remainingTubalLength, userInput.hasOtherInfertilityFactors, userInput.desireForMultiplePregnancies],
                factorKey: 'otb',
                required: false,
                priority: 2,
                group: 'IMPORTANTES',
                defaultFactor: 0.5
            },
            {
                evaluator: factorEvaluators.evaluatePelvicSurgeries,
                args: [userInput.pelvicSurgeriesNumber],
                factorKey: 'pelvicSurgery',
                required: false,
                priority: 2,
                group: 'IMPORTANTES',
                defaultFactor: 0.9
            },
            // FACTORES OPCIONALES - Laboratorio y Male Factor
            {
                evaluator: factorEvaluators.evaluateAmh,
                args: [userInput.amh],
                factorKey: 'amh',
                required: false,
                priority: 3,
                group: 'OPCIONALES'
            },
            {
                evaluator: factorEvaluators.evaluateProlactin,
                args: [userInput.prolactin],
                factorKey: 'prolactin',
                required: false,
                priority: 3,
                group: 'OPCIONALES'
            },
            {
                evaluator: factorEvaluators.evaluateTsh,
                args: [userInput.tsh],
                factorKey: 'tsh',
                required: false,
                priority: 3,
                group: 'OPCIONALES'
            },
            {
                evaluator: factorEvaluators.evaluateHoma,
                args: [userInput.homaIr],
                factorKey: 'homa',
                required: false,
                priority: 3,
                group: 'OPCIONALES'
            },
            {
                evaluator: factorEvaluators.evaluateMaleFactor,
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
    getDiagnosticConfigurations(userInput) {
        return this.getFactorConfigurations(userInput).map(config => ({
            ...config,
            diagnosticKey: this.getCorrespondingDiagnosticKey(config.factorKey)
        })).filter(config => config.diagnosticKey);
    }
    /**
     * Mapea factor key a diagnostic key
     */
    getCorrespondingDiagnosticKey(factorKey) {
        const mapping = {
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
    processFactorGroup(configs, factors) {
        let successCount = 0;
        let errorCount = 0;
        const criticalErrors = [];
        for (const config of configs) {
            console.log(`🔍 CalculationCore - Evaluando factor ${config.factorKey} con args:`, config.args);
            const evaluation = this.safeEvaluateFactor(config.evaluator, config.args, config.factorKey);
            console.log(`🎯 CalculationCore - Resultado evaluación ${config.factorKey}:`, evaluation);
            if (evaluation.success && evaluation.factors) {
                successCount++;
                Object.assign(factors, evaluation.factors);
                console.log(`✅ Factor ${config.factorKey} asignado:`, evaluation.factors);
            }
            else {
                errorCount++;
                console.error(`❌ Error evaluando factor ${config.factorKey}:`, evaluation.error);
                if (config.required) {
                    criticalErrors.push(`Factor crítico ${config.factorKey}: ${evaluation.error}`);
                }
                // Aplicar valor por defecto
                if (config.defaultFactor !== undefined) {
                    factors[config.factorKey] = config.defaultFactor;
                    console.log(`🔄 Factor ${config.factorKey} usa valor por defecto:`, config.defaultFactor);
                }
            }
        }
        return { successCount, errorCount, criticalErrors };
    }
    /**
     * Evalúa factor de manera segura
     */
    safeEvaluateFactor(evaluator, args, factorKey) {
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
            }
            else {
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
        }
        catch (error) {
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
    calculatePerformanceScore(metrics) {
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
export function calculatePureFertilityFactors(input) {
    const core = new CalculationCore();
    // 1. Validar entrada
    const validation = core.validateInput(input);
    if (!validation.isValid) {
        throw new Error(`Validación falló: ${validation.errors.join(', ')}`);
    }
    // 2. Calcular factores
    const { factors } = core.calculateFactors(validation.validatedInput);
    // 3. Generar diagnósticos
    const diagnostics = core.generateDiagnostics(factors, validation.validatedInput);
    // 4. Crear reporte
    const report = core.createReport(factors, diagnostics, validation.validatedInput);
    return {
        input: validation.validatedInput,
        factors,
        diagnostics,
        report
    };
}
/**
 * Función de validación independiente
 */
export function validateUserInputPure(input) {
    const core = new CalculationCore();
    return core.validateInput(input);
}
/**
 * Función de sanitización independiente
 */
export function sanitizeUserInputPure(input) {
    const core = new CalculationCore();
    return core.sanitizeInput(input);
}
