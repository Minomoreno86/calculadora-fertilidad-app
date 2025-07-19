/**
 * 🎯 CALCULATION ORCHESTRATOR DEMO
 * 
 * Archivo de demostración que muestra cómo utilizar el CalculationOrchestrator
 * y todas sus funcionalidades avanzadas de manera práctica.
 */

import { UserInput, MyomaType, AdenomyosisType, PolypType, HsgResult } from '../../models';
import { 
  CalculationOrchestrator,
  getCalculationOrchestrator,
  calculateFertility,
  calculateFertilityFast,
  calculateFertilityWithRetry,
  calculateFertilityBatch,
  getSystemHealthReport,
  optimizeModularSystem,
  getSystemStats,
  CalculationOptions
} from './CalculationOrchestrator';

// ===================================================================
// 🎯 DATOS DE PRUEBA
// ===================================================================

/**
 * Casos de prueba para demostrar diferentes escenarios
 */
const testCases: { name: string; input: UserInput; options?: CalculationOptions }[] = [
  {
    name: 'Caso Simple - Mujer Joven',
    input: {
      age: 28,
      cycleDuration: 28,
      infertilityDuration: 1,
      bmi: 22.5,
      hasPcos: false,
      hasOtb: false,
      endometriosisGrade: 0,
      myomaType: MyomaType.None,
      adenomyosisType: AdenomyosisType.None,
      polypType: PolypType.None,
      hsgResult: HsgResult.Normal,
      pelvicSurgeriesNumber: 0,
      amh: 3.2,
      tsh: 2.1,
      prolactin: 15.5,
      spermConcentration: 25,
      spermProgressiveMotility: 45,
      spermNormalMorphology: 8,
      tpoAbPositive: false
    },
    options: {
      enableProfiling: true,
      useCache: true,
      userId: 'demo_user_1'
    }
  },
  {
    name: 'Caso Complejo - Múltiples Factores',
    input: {
      age: 38,
      cycleDuration: 35,
      infertilityDuration: 3,
      bmi: 29.5,
      hasPcos: true,
      hasOtb: false,
      endometriosisGrade: 2,
      myomaType: MyomaType.IntramuralLarge,
      adenomyosisType: AdenomyosisType.Focal,
      polypType: PolypType.Small,
      hsgResult: HsgResult.Normal,
      pelvicSurgeriesNumber: 1,
      amh: 1.8,
      tsh: 3.2,
      prolactin: 28.5,
      homaIr: 2.8,
      spermConcentration: 12,
      spermProgressiveMotility: 25,
      spermNormalMorphology: 4,
      tpoAbPositive: false
    },
    options: {
      enableProfiling: true,
      useCache: false,
      preferredEngine: 'PREMIUM',
      userId: 'demo_user_premium'
    }
  },
  {
    name: 'Caso Crítico - Edad Avanzada',
    input: {
      age: 42,
      cycleDuration: 45,
      infertilityDuration: 5,
      bmi: 32.1,
      hasPcos: true,
      hasOtb: false,
      endometriosisGrade: 3,
      myomaType: MyomaType.Submucosal,
      adenomyosisType: AdenomyosisType.Diffuse,
      polypType: PolypType.Large,
      hsgResult: HsgResult.Unilateral,
      pelvicSurgeriesNumber: 2,
      amh: 0.8,
      tsh: 4.5,
      prolactin: 45.2,
      homaIr: 4.2,
      spermConcentration: 8,
      spermProgressiveMotility: 15,
      spermNormalMorphology: 2,
      tpoAbPositive: true
    },
    options: {
      enableProfiling: true,
      useCache: true,
      enableRecovery: true,
      minConfidenceLevel: 0.8,
      userId: 'demo_user_critical'
    }
  }
];

// ===================================================================
// 🚀 FUNCIONES DE DEMOSTRACIÓN
// ===================================================================

/**
 * Demostración básica del CalculationOrchestrator
 */
export async function demoBasicCalculation(): Promise<void> {
  console.log('🎯 === DEMO: Cálculo Básico ===');
  
  try {
    const testCase = testCases[0];
    console.log(`📋 Caso: ${testCase.name}`);
    
    const result = await calculateFertility(testCase.input, testCase.options);
    
    console.log('✅ Resultado:', {
      prognosis: result.evaluation.report.numericPrognosis,
      category: result.evaluation.report.category,
      engineUsed: result.metadata.engineUsed,
      executionTime: `${result.metadata.totalExecutionTime.toFixed(2)}ms`,
      cacheHit: result.metadata.cacheHit,
      confidence: result.metadata.confidenceLevel
    });
    
    if (result.debug) {
      console.log('🔍 Debug Info:', {
        moduleTimings: result.debug.moduleTimings,
        cacheOperations: result.debug.cacheOperations.slice(0, 3), // Primeras 3
        performanceMetrics: result.debug.performanceMetrics
      });
    }
    
  } catch (error) {
    console.error('❌ Error en demo básico:', error);
  }
}

/**
 * Demostración del sistema de retry
 */
export async function demoRetrySystem(): Promise<void> {
  console.log('\n🔄 === DEMO: Sistema de Retry ===');
  
  try {
    const testCase = testCases[1];
    console.log(`📋 Caso: ${testCase.name}`);
    
    const result = await calculateFertilityWithRetry(testCase.input, testCase.options, 3);
    
    console.log('✅ Resultado con retry:', {
      prognosis: result.evaluation.report.numericPrognosis,
      recovered: result.metadata.recovered,
      fallbacksUsed: result.metadata.fallbacksUsed,
      executionTime: `${result.metadata.totalExecutionTime.toFixed(2)}ms`
    });
    
  } catch (error) {
    console.error('❌ Error en demo retry:', error);
  }
}

/**
 * Demostración del procesamiento por lotes
 */
export async function demoBatchProcessing(): Promise<void> {
  console.log('\n📦 === DEMO: Procesamiento por Lotes ===');
  
  try {
    const inputs = testCases.map(tc => tc.input);
    const options: CalculationOptions = {
      enableProfiling: false,
      useCache: true,
      userId: 'batch_demo'
    };
    
    console.log(`📋 Procesando ${inputs.length} casos en lote...`);
    
    const batchResult = await calculateFertilityBatch(inputs, options);
    
    console.log('✅ Resultado del lote:', {
      total: batchResult.summary.total,
      successful: batchResult.summary.successful,
      failed: batchResult.summary.failed,
      averageTime: `${batchResult.summary.averageTime.toFixed(2)}ms`,
      successRate: `${((batchResult.summary.successful / batchResult.summary.total) * 100).toFixed(1)}%`
    });
    
    // Mostrar algunos resultados individuales
    if (batchResult.results.length > 0) {
      console.log('📊 Muestra de resultados:');
      batchResult.results.slice(0, 2).forEach((result, index) => {
        console.log(`  ${index + 1}. Pronóstico: ${result.evaluation.report.numericPrognosis.toFixed(1)}% (${result.evaluation.report.category})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error en demo batch:', error);
  }
}

/**
 * Demostración del monitoreo de salud del sistema
 */
export async function demoSystemHealth(): Promise<void> {
  console.log('\n🏥 === DEMO: Salud del Sistema ===');
  
  try {
    const health = getSystemHealthReport();
    
    console.log('✅ Estado general:', health.overall);
    console.log('🔧 Estado de módulos:');
    
    Object.entries(health.modules).forEach(([module, status]) => {
      const icon = status.status === 'OK' ? '✅' : '⚠️';
      console.log(`  ${icon} ${module}: ${status.status} - ${status.message}`);
    });
    
    console.log('📊 Métricas del sistema:');
    console.log(`  • Requests totales: ${health.metrics.totalRequests}`);
    console.log(`  • Tasa de éxito: ${(health.metrics.successRate * 100).toFixed(1)}%`);
    console.log(`  • Tiempo promedio: ${health.metrics.averageResponseTime.toFixed(0)}ms`);
    console.log(`  • Eficiencia cache: ${(health.metrics.cacheEfficiency * 100).toFixed(1)}%`);
    console.log(`  • Carga del sistema: ${(health.metrics.systemLoad * 100).toFixed(1)}%`);
    
    if (health.recommendations.length > 0) {
      console.log('💡 Recomendaciones:');
      health.recommendations.forEach((rec, index) => {
        console.log(`  ${index + 1}. ${rec}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error en demo health:', error);
  }
}

/**
 * Demostración del sistema de optimización
 */
export async function demoOptimization(): Promise<void> {
  console.log('\n⚡ === DEMO: Optimización del Sistema ===');
  
  try {
    const optimization = optimizeModularSystem();
    
    console.log('✅ Optimizaciones aplicadas:');
    if (optimization.optimizationsApplied.length > 0) {
      optimization.optimizationsApplied.forEach((opt, index) => {
        console.log(`  ${index + 1}. ${opt}`);
      });
    } else {
      console.log('  • No se necesitaron optimizaciones');
    }
    
    console.log('📈 Mejoras esperadas:');
    Object.entries(optimization.expectedImprovements).forEach(([key, value]) => {
      console.log(`  • ${key}: ${value}`);
    });
    
    console.log(`⏰ Próxima optimización: ${optimization.nextOptimizationTime.toLocaleString()}`);
    
  } catch (error) {
    console.error('❌ Error en demo optimization:', error);
  }
}

/**
 * Demostración completa con comparación de engines
 */
export async function demoEngineComparison(): Promise<void> {
  console.log('\n🏎️ === DEMO: Comparación de Engines ===');
  
  try {
    const testCase = testCases[2]; // Caso más complejo
    const engines: Array<{ name: string; engine?: 'STANDARD' | 'PREMIUM' | 'UNIFIED' }> = [
      { name: 'Automático' },
      { name: 'Standard', engine: 'STANDARD' },
      { name: 'Premium', engine: 'PREMIUM' },
      { name: 'Unified', engine: 'UNIFIED' }
    ];
    
    console.log(`📋 Caso: ${testCase.name}`);
    console.log('🔄 Probando diferentes engines...\n');
    
    for (const engineTest of engines) {
      try {
        const options = {
          ...testCase.options,
          preferredEngine: engineTest.engine,
          enableProfiling: true,
          useCache: false // Evitar cache hits para comparación justa
        };
        
        const result = await calculateFertility(testCase.input, options);
        
        console.log(`${engineTest.name}:`);
        console.log(`  • Pronóstico: ${result.evaluation.report.numericPrognosis.toFixed(1)}% (${result.evaluation.report.category})`);
        console.log(`  • Engine usado: ${result.metadata.engineUsed}`);
        console.log(`  • Tiempo: ${result.metadata.totalExecutionTime.toFixed(2)}ms`);
        console.log(`  • Confianza: ${result.metadata.confidenceLevel.toFixed(2)}`);
        console.log(`  • Fallbacks: ${result.metadata.fallbacksUsed.length}`);
        console.log('');
        
      } catch (error) {
        console.log(`${engineTest.name}: ❌ Error - ${error}\n`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error en demo comparison:', error);
  }
}

/**
 * Demostración de estadísticas completas
 */
export async function demoCompleteStats(): Promise<void> {
  console.log('\n📊 === DEMO: Estadísticas Completas ===');
  
  try {
    const stats = getSystemStats();
    
    console.log('🎭 Orchestrator:');
    console.log(`  • Requests activos: ${stats.orchestrator.activeRequests}`);
    console.log(`  • Total requests: ${stats.orchestrator.totalRequests}`);
    
    console.log('💾 Cache:');
    console.log(`  • Hit rate: ${((stats.cache as { hitRate: number }).hitRate * 100).toFixed(1)}%`);
    console.log(`  • Total operations: ${(stats.cache as { totalOperations: number }).totalOperations}`);
    
    console.log('⚡ Performance:');
    console.log(`  • Operaciones totales: ${stats.performance.totalOperations}`);
    console.log(`  • Tasa de éxito: ${((stats.performance.successRate as number) * 100).toFixed(1)}%`);
    console.log(`  • Tiempo promedio: ${(stats.performance.averageExecutionTime as number).toFixed(0)}ms`);
    
    console.log('🤖 Selector:');
    console.log(`  • Feedback count: ${(stats.selector as { feedbackCount: number }).feedbackCount}`);
    console.log(`  • Current accuracy: ${((stats.selector as { currentAccuracy: number }).currentAccuracy * 100).toFixed(1)}%`);
    
  } catch (error) {
    console.error('❌ Error en demo stats:', error);
  }
}

// ===================================================================
// 🎯 FUNCIÓN PRINCIPAL DE DEMOSTRACIÓN
// ===================================================================

/**
 * Ejecuta todas las demostraciones del CalculationOrchestrator
 */
export async function runAllDemos(): Promise<void> {
  console.log('🚀 === INICIO DE DEMOSTRACIONES DEL CALCULATION ORCHESTRATOR ===\n');
  
  try {
    // Demostraciones secuenciales
    await demoBasicCalculation();
    await demoRetrySystem();
    await demoBatchProcessing();
    await demoSystemHealth();
    await demoOptimization();
    await demoEngineComparison();
    await demoCompleteStats();
    
    console.log('\n🎉 === TODAS LAS DEMOSTRACIONES COMPLETADAS ===');
    
  } catch (error) {
    console.error('❌ Error general en demostraciones:', error);
  }
}

/**
 * Función de conveniencia para pruebas rápidas
 */
export async function quickTest(): Promise<void> {
  console.log('⚡ === PRUEBA RÁPIDA ===');
  
  try {
    const input = testCases[0].input;
    const result = await calculateFertilityFast(input);
    
    console.log('✅ Resultado rápido:', {
      prognosis: `${result.report.numericPrognosis.toFixed(1)}%`,
      category: result.report.category,
      emoji: result.report.emoji,
      phrase: result.report.prognosisPhrase
    });
    
  } catch (error) {
    console.error('❌ Error en prueba rápida:', error);
  }
}

// ===================================================================
// 🎯 EXPORT PARA USO DIRECTO
// ===================================================================

export {
  testCases,
  CalculationOrchestrator,
  getCalculationOrchestrator,
  calculateFertility,
  calculateFertilityFast,
  calculateFertilityWithRetry,
  calculateFertilityBatch,
  getSystemHealthReport,
  optimizeModularSystem,
  getSystemStats
};
