/**
 * 🧪 SCRIPT DE PRUEBA - UNIFIED PARALLEL ENGINE V12.0
 * 
 * Prueba la integración completa del sistema de workers especializados
 * con datos de ejemplo para verificar funcionalidad.
 */

import { calculateFertilityWithAI, getSystemMetrics } from './calculatorIntegration';
import type { UserInput } from '../domain/models';

/**
 * 🧪 Datos de prueba completos
 */
const testCases: { name: string; input: UserInput }[] = [
  {
    name: 'Caso Básico - Mujer Joven Saludable',
    input: {
      age: 28,
      bmi: 22.5,
      cycleDuration: 28,
      infertilityDuration: 6,
      hasPcos: false,
      endometriosisGrade: 0,
      hasEndometriosis: false,
      smoking: false,
      alcoholConsumption: 'none',
      exerciseFrequency: 'regular',
      stressLevel: 'low'
    }
  },
  {
    name: 'Caso Complejo - Edad Avanzada + PCOS',
    input: {
      age: 38,
      bmi: 28.5,
      cycleDuration: 42,
      infertilityDuration: 24,
      hasPcos: true,
      endometriosisGrade: 0,
      hasEndometriosis: false,
      amh: 1.2,
      prolactin: 15.0,
      tsh: 2.1,
      homaIr: 3.5,
      smoking: false,
      alcoholConsumption: 'moderate',
      exerciseFrequency: 'occasional',
      stressLevel: 'high'
    }
  },
  {
    name: 'Caso Crítico - Factor Masculino Severo',
    input: {
      age: 35,
      bmi: 24.0,
      cycleDuration: 30,
      infertilityDuration: 18,
      hasPcos: false,
      endometriosisGrade: 2,
      hasEndometriosis: true,
      amh: 2.8,
      spermConcentration: 8.5,
      spermProgressiveMotility: 22,
      spermNormalMorphology: 2,
      semenVolume: 1.2,
      smoking: false,
      alcoholConsumption: 'low',
      exerciseFrequency: 'regular',
      stressLevel: 'medium'
    }
  },
  {
    name: 'Caso Completo con Biomarcadores',
    input: {
      age: 32,
      bmi: 26.2,
      cycleDuration: 35,
      infertilityDuration: 12,
      hasPcos: true,
      endometriosisGrade: 1,
      hasEndometriosis: true,
      amh: 0.8,
      prolactin: 28.5,
      tsh: 4.8,
      homaIr: 2.8,
      spermConcentration: 18,
      spermProgressiveMotility: 35,
      spermNormalMorphology: 5,
      semenVolume: 2.1,
      smoking: false,
      alcoholConsumption: 'none',
      exerciseFrequency: 'regular',
      stressLevel: 'low'
    }
  }
];

/**
 * 🏃‍♀️ Ejecutar pruebas de integración
 */
async function runIntegrationTests() {
  console.log('🚀 INICIANDO PRUEBAS DE INTEGRACIÓN - UNIFIED PARALLEL ENGINE V12.0');
  console.log('=' .repeat(80));
  
  let passedTests = 0;
  let failedTests = 0;
  const testResults: any[] = [];

  for (const testCase of testCases) {
    try {
      console.log(`\n🧪 EJECUTANDO: ${testCase.name}`);
      console.log('-'.repeat(50));
      
      const startTime = Date.now();
      
      // Ejecutar cálculo con AI
      const result = await calculateFertilityWithAI(testCase.input);
      
      const endTime = Date.now();
      const executionTime = endTime - startTime;
      
      // Verificar resultado
      if (result && typeof result.successProbability === 'number' && result.workersUsed.length > 0) {
        console.log('✅ PRUEBA EXITOSA');
        console.log(`📊 Probabilidad de éxito: ${(result.successProbability * 100).toFixed(1)}%`);
        console.log(`🎯 Confianza: ${(result.confidence * 100).toFixed(1)}%`);
        console.log(`⚡ Workers utilizados: ${result.workersUsed.join(', ')}`);
        console.log(`⏱️ Tiempo de procesamiento: ${result.processingTime}ms (total: ${executionTime}ms)`);
        console.log(`🚨 Urgencia: ${result.urgencyLevel}`);
        console.log(`🔬 AI Analysis: ${result.aiAnalysisUsed ? 'SÍ' : 'NO'}`);
        
        passedTests++;
        testResults.push({
          testName: testCase.name,
          status: 'PASSED',
          successProbability: result.successProbability,
          confidence: result.confidence,
          workersUsed: result.workersUsed,
          processingTime: result.processingTime,
          executionTime,
          urgencyLevel: result.urgencyLevel,
          treatmentsCount: result.treatmentRecommendations.length,
          pathologiesCount: result.pathologiesDetected.length,
          biomarkersCount: result.biomarkerStatus.length,
          riskFactorsCount: result.riskFactors.length
        });
      } else {
        throw new Error('Resultado inválido o incompleto');
      }
      
    } catch (error) {
      console.log('❌ PRUEBA FALLIDA');
      console.error('Error:', error);
      
      failedTests++;
      testResults.push({
        testName: testCase.name,
        status: 'FAILED',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  // Resumen de pruebas
  console.log('\n' + '='.repeat(80));
  console.log('📋 RESUMEN DE PRUEBAS');
  console.log('='.repeat(80));
  console.log(`✅ Pruebas exitosas: ${passedTests}`);
  console.log(`❌ Pruebas fallidas: ${failedTests}`);
  console.log(`📊 Tasa de éxito: ${((passedTests / testCases.length) * 100).toFixed(1)}%`);

  // Métricas del sistema
  try {
    console.log('\n📈 MÉTRICAS DEL SISTEMA:');
    const metrics = await getSystemMetrics();
    console.log(`🎯 Total de tareas: ${metrics.totalTasks}`);
    console.log(`✅ Tareas completadas: ${metrics.completedTasks}`);
    console.log(`❌ Tareas fallidas: ${metrics.failedTasks}`);
    console.log(`⚡ Tiempo promedio de respuesta: ${metrics.averageResponseTime}ms`);
    console.log(`🎯 Objetivo: ${metrics.targetResponseTime}ms`);
    console.log(`📈 Mejora de rendimiento: ${metrics.performanceImprovement}%`);
    console.log(`💾 Cache hit rate: ${(metrics.cacheHitRate * 100).toFixed(1)}%`);
    console.log(`🧠 Workers activos: ${metrics.activeWorkers}/${metrics.totalWorkers}`);
    console.log(`🤖 Análisis AI realizados: ${metrics.aiAnalysisCount}`);
    console.log(`🔬 Patologías detectadas: ${metrics.pathologiesDetected}`);
  } catch (error) {
    console.error('❌ Error obteniendo métricas del sistema:', error);
  }

  // Análisis detallado de resultados exitosos
  const successfulTests = testResults.filter(t => t.status === 'PASSED');
  if (successfulTests.length > 0) {
    console.log('\n🔍 ANÁLISIS DETALLADO:');
    console.log('-'.repeat(50));
    
    const avgProcessingTime = successfulTests.reduce((sum, t) => sum + t.processingTime, 0) / successfulTests.length;
    const avgExecutionTime = successfulTests.reduce((sum, t) => sum + t.executionTime, 0) / successfulTests.length;
    const avgSuccessRate = successfulTests.reduce((sum, t) => sum + t.successProbability, 0) / successfulTests.length;
    const avgConfidence = successfulTests.reduce((sum, t) => sum + t.confidence, 0) / successfulTests.length;
    
    console.log(`⏱️ Tiempo promedio de procesamiento: ${avgProcessingTime.toFixed(1)}ms`);
    console.log(`🏁 Tiempo promedio de ejecución total: ${avgExecutionTime.toFixed(1)}ms`);
    console.log(`📊 Probabilidad de éxito promedio: ${(avgSuccessRate * 100).toFixed(1)}%`);
    console.log(`🎯 Confianza promedio: ${(avgConfidence * 100).toFixed(1)}%`);
    
    // Verificar objetivo de 80ms
    const targetMet = avgProcessingTime <= 80;
    console.log(`🎯 Objetivo de 80ms: ${targetMet ? '✅ CUMPLIDO' : '❌ NO CUMPLIDO'} (${avgProcessingTime.toFixed(1)}ms)`);
  }

  console.log('\n🏁 PRUEBAS DE INTEGRACIÓN COMPLETADAS');
  console.log('='.repeat(80));
  
  return {
    passed: passedTests,
    failed: failedTests,
    totalTests: testCases.length,
    successRate: (passedTests / testCases.length) * 100,
    results: testResults
  };
}

/**
 * 🚀 Ejecutar si se llama directamente
 */
if (require.main === module) {
  runIntegrationTests()
    .then(results => {
      console.log('\n✅ Pruebas completadas:', results);
      process.exit(results.failed > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('❌ Error ejecutando pruebas:', error);
      process.exit(1);
    });
}

export { runIntegrationTests };
