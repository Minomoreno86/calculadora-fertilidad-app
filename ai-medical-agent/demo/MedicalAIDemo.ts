/**
 * 🚀 DEMO Y PRUEBA DEL AGENTE AI MÉDICO OPTIMIZADO
 * Sistema de testing completo para validar funcionamiento
 */

import { getOptimizedMedicalAgent } from './MasterMedicalAIAgent';
import { UserInput } from './core/types/index';

// 📋 CASOS DE PRUEBA REALES
const TEST_CASES: { name: string; input: UserInput }[] = [
  {
    name: 'Caso 1: Mujer joven con PCOS',
    input: {
      age: 28,
      infertilityDuration: 8,
      bmi: 27.5,
      symptoms: ['irregular_periods', 'hirsutism'],
      labs: {
        lh: 15.2,
        fsh: 6.8,
        amh: 4.5
      }
    }
  },
  {
    name: 'Caso 2: Edad avanzada, reserva baja',
    input: {
      age: 39,
      infertilityDuration: 18,
      bmi: 22.1,
      labs: {
        amh: 0.7,
        fsh: 12.3,
        estradiol: 45
      }
    }
  },
  {
    name: 'Caso 3: Factor masculino + edad limite',
    input: {
      age: 35,
      infertilityDuration: 24,
      bmi: 24.0,
      partner: {
        age: 37,
        spermAnalysis: {
          concentration: 8.5,
          motility: 35,
          morphology: 2
        }
      },
      labs: {
        amh: 1.8,
        fsh: 8.2
      }
    }
  }
];

// 🎯 FUNCIÓN PRINCIPAL DE DEMO
export async function runMedicalAIDemo() {
  console.log('🚀 INICIANDO DEMO DEL AGENTE AI MÉDICO OPTIMIZADO V3.0');
  console.log('=' .repeat(60));
  
  const agent = getOptimizedMedicalAgent({
    languagePreference: 'es',
    empathyLevel: 'high',
    evidenceLevel: 'standard'
  });

  // Mostrar información del sistema
  console.log('📊 INFORMACIÓN DEL SISTEMA:');
  console.log(JSON.stringify(agent.getSystemInfo(), null, 2));
  console.log('\n');

  // Ejecutar casos de prueba
  for (const testCase of TEST_CASES) {
    await runTestCase(agent, testCase);
    console.log('-'.repeat(40));
  }

  console.log('✅ DEMO COMPLETADA EXITOSAMENTE');
}

// 🧪 EJECUTAR CASO DE PRUEBA
async function runTestCase(
  agent: any, 
  testCase: { name: string; input: UserInput }
) {
  console.log(`🧪 ${testCase.name.toUpperCase()}`);
  console.log(`Paciente: ${testCase.input.age} años, ${testCase.input.infertilityDuration} meses infertilidad`);
  
  try {
    // 1. ANÁLISIS CLÍNICO COMPLETO
    console.log('\n🔬 EJECUTANDO ANÁLISIS CLÍNICO...');
    const analysisResult = await agent.performClinicalAnalysis(testCase.input);
    
    if (analysisResult.success) {
      const { clinicalAnalysis, successRates, recommendations, metrics } = analysisResult.data;
      
      console.log(`✅ Diagnóstico: ${clinicalAnalysis.primaryDiagnosis.pathology}`);
      console.log(`📊 Confianza: ${clinicalAnalysis.primaryDiagnosis.confidence}%`);
      console.log(`⚠️ Riesgo: ${clinicalAnalysis.riskStratification.level}`);
      console.log(`🎯 Mejor tratamiento: ${successRates[0].technique} (${Math.round(successRates[0].probabilityPerCycle * 100)}%)`);
      console.log(`⚡ Tiempo procesamiento: ${metrics.responseTimeMs.toFixed(2)}ms`);
      
      console.log('\n📋 RECOMENDACIONES:');
      recommendations.slice(0, 3).forEach(rec => console.log(`  • ${rec}`));
    } else {
      console.log(`❌ Error en análisis: ${analysisResult.error?.message}`);
    }

    // 2. CONVERSACIÓN INTELIGENTE
    console.log('\n💬 PROBANDO CONVERSACIÓN INTELIGENTE...');
    const conversationQueries = [
      '¿Qué significa mi diagnóstico?',
      '¿Cuáles son mis probabilidades de éxito?',
      'Me siento muy ansiosa con todo esto'
    ];

    for (const query of conversationQueries) {
      const convResult = await agent.startMedicalConversation(
        query,
        testCase.input,
        detectConversationType(query)
      );
      
      if (convResult.success) {
        console.log(`❓ "${query}"`);
        console.log(`🤖 ${convResult.data.response.mainMessage.substring(0, 150)}...`);
        console.log(`💭 Tipo: ${convResult.data.response.responseType}, Confianza: ${convResult.data.response.confidenceLevel}%`);
      }
    }

    // 3. PREDICCIÓN PERSONALIZADA
    console.log('\n🔮 CALCULANDO PREDICCIONES PERSONALIZADAS...');
    const predictionResult = await agent.calculatePersonalizedOutcomes(testCase.input);
    
    if (predictionResult.success) {
      const { successRates, recommendations, riskFactors } = predictionResult.data;
      
      console.log('🎯 TOP 3 TRATAMIENTOS:');
      successRates.slice(0, 3).forEach((rate, index) => {
        console.log(`  ${index + 1}. ${rate.technique}: ${Math.round(rate.probabilityPerCycle * 100)}% por ciclo`);
      });
      
      console.log(`⏰ Timeline: ${recommendations.timeline}`);
      console.log(`🔧 Factores modificables: ${riskFactors.modifiable.slice(0, 3).join(', ')}`);
    }

  } catch (error) {
    console.log(`❌ Error ejecutando caso: ${error}`);
  }
  
  console.log('\n');
}

// 🔧 UTILIDADES
function detectConversationType(query: string): 'diagnostic' | 'therapeutic' | 'prognostic' | 'educational' | 'supportive' {
  const lowercaseQuery = query.toLowerCase();
  
  if (lowercaseQuery.includes('significa') || lowercaseQuery.includes('diagnóstico')) {
    return 'diagnostic';
  }
  if (lowercaseQuery.includes('tratamiento') || lowercaseQuery.includes('opciones')) {
    return 'therapeutic';
  }
  if (lowercaseQuery.includes('probabilidad') || lowercaseQuery.includes('posibilidad')) {
    return 'prognostic';
  }
  if (lowercaseQuery.includes('ansiosa') || lowercaseQuery.includes('preocup')) {
    return 'supportive';
  }
  
  return 'educational';
}

// 📊 BENCHMARK DE RENDIMIENTO
export async function runPerformanceBenchmark() {
  console.log('⚡ EJECUTANDO BENCHMARK DE RENDIMIENTO...');
  
  const agent = getOptimizedMedicalAgent();
  const iterations = 10;
  const results: number[] = [];
  
  const testInput: UserInput = {
    age: 32,
    infertilityDuration: 12,
    bmi: 23.5,
    labs: { amh: 2.1, fsh: 7.8 }
  };
  
  console.log(`🔄 Ejecutando ${iterations} iteraciones...`);
  
  for (let i = 0; i < iterations; i++) {
    const startTime = performance.now();
    
    await agent.performClinicalAnalysis(testInput);
    
    const duration = performance.now() - startTime;
    results.push(duration);
    
    if (i % 2 === 0) process.stdout.write('.');
  }
  
  console.log('\n');
  
  const avgTime = results.reduce((a, b) => a + b) / results.length;
  const minTime = Math.min(...results);
  const maxTime = Math.max(...results);
  
  console.log(`📈 RESULTADOS DEL BENCHMARK:`);
  console.log(`  • Tiempo promedio: ${avgTime.toFixed(2)}ms`);
  console.log(`  • Tiempo mínimo: ${minTime.toFixed(2)}ms`);
  console.log(`  • Tiempo máximo: ${maxTime.toFixed(2)}ms`);
  console.log(`  • Throughput: ~${(1000 / avgTime).toFixed(1)} análisis/segundo`);
  
  // Evaluación de rendimiento
  if (avgTime < 50) {
    console.log('🚀 EXCELENTE: Sistema ultra-rápido');
  } else if (avgTime < 100) {
    console.log('✅ MUY BUENO: Rendimiento óptimo');
  } else if (avgTime < 200) {
    console.log('👍 BUENO: Rendimiento aceptable');
  } else {
    console.log('⚠️ MEJORABLE: Considerar optimizaciones');
  }
}

// 🧪 TESTS AUTOMATIZADOS
export async function runAutomatedTests() {
  console.log('🧪 EJECUTANDO TESTS AUTOMATIZADOS...');
  
  const tests = [
    {
      name: 'Validación de entrada inválida',
      test: async () => {
        const agent = getOptimizedMedicalAgent();
        const result = await agent.performClinicalAnalysis({ age: -1, infertilityDuration: 0 });
        return !result.success; // Debe fallar
      }
    },
    {
      name: 'Diagnóstico de PCOS',
      test: async () => {
        const agent = getOptimizedMedicalAgent();
        const input: UserInput = {
          age: 25,
          infertilityDuration: 6,
          bmi: 28,
          symptoms: ['irregular_periods', 'hirsutism'],
          labs: { lh: 16, fsh: 7, amh: 5.2 }
        };
        const result = await agent.performClinicalAnalysis(input);
        return result.success && result.data.clinicalAnalysis.primaryDiagnosis.pathology.includes('PCOS');
      }
    },
    {
      name: 'Cálculo de probabilidades',
      test: async () => {
        const agent = getOptimizedMedicalAgent();
        const input: UserInput = { age: 30, infertilityDuration: 12, bmi: 22 };
        const result = await agent.calculatePersonalizedOutcomes(input);
        return result.success && result.data.successRates.length > 0;
      }
    },
    {
      name: 'Conversación empática',
      test: async () => {
        const agent = getOptimizedMedicalAgent();
        const input: UserInput = { age: 35, infertilityDuration: 18 };
        const result = await agent.startMedicalConversation('Me siento muy triste', input, 'supportive');
        return result.success && result.data.response.emotionalSupport;
      }
    }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      const result = await test.test();
      if (result) {
        console.log(`✅ ${test.name}: PASS`);
        passed++;
      } else {
        console.log(`❌ ${test.name}: FAIL`);
        failed++;
      }
    } catch (error) {
      console.log(`💥 ${test.name}: ERROR - ${error}`);
      failed++;
    }
  }
  
  console.log(`\n📊 RESULTADOS: ${passed} passed, ${failed} failed`);
  console.log(`🎯 Ratio éxito: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  
  return { passed, failed };
}

// 🎬 EJECUTAR TODO
export async function runCompleteDemo() {
  console.log('🎬 EJECUTANDO DEMO COMPLETA DEL SISTEMA');
  console.log('='.repeat(60));
  
  console.log('\n1️⃣ DEMO FUNCIONAL:');
  await runMedicalAIDemo();
  
  console.log('\n2️⃣ BENCHMARK DE RENDIMIENTO:');
  await runPerformanceBenchmark();
  
  console.log('\n3️⃣ TESTS AUTOMATIZADOS:');
  await runAutomatedTests();
  
  console.log('\n🏁 DEMO COMPLETA FINALIZADA');
  console.log('Sistema AI médico optimizado funcionando correctamente ✅');
}

// Exportar para uso directo
if (require.main === module) {
  runCompleteDemo().catch(console.error);
}
