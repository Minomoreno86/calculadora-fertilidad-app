/**
 * 🧪 SCRIPT DE VALIDACIÓN - MOTOR UNIFICADO
 * 
 * Script de línea de comandos para validar la migración
 * del motor unificado vs motores originales.
 */

const { 
  calculateProbabilityUnified,
  calculateProbabilityMigrated,
  calculateProbabilityPremiumMigrated 
} = require('./calculationEngineUnified');
const { calculateProbability } = require('./calculationEngine');
const { calculateProbabilityPremium } = require('./calculationEnginePremium');

// 🎯 CASOS DE PRUEBA PREDEFINIDOS
const TEST_CASES = {
  simple: {
    age: 28,
    bmi: 22,
    cycleDuration: 28,
    infertilityDuration: 6,
    hasPcos: false,
    endometriosisGrade: 0,
    myomaType: 0, // MyomaType.None
    adenomyosisType: 0, // AdenomyosisType.None
    hsgResult: 0, // HsgResult.Normal
    hasOtb: false,
    hasOtherInfertilityFactors: false
  },
  
  moderate: {
    age: 34,
    bmi: 27,
    amh: 1.8,
    tsh: 3.2,
    cycleDuration: 32,
    infertilityDuration: 12,
    hasPcos: true,
    endometriosisGrade: 1,
    myomaType: 1, // MyomaType.Intramural
    adenomyosisType: 0,
    hsgResult: 0,
    hasOtb: false,
    hasOtherInfertilityFactors: false
  },
  
  complex: {
    age: 39,
    bmi: 32,
    amh: 0.6,
    tsh: 5.2,
    cycleDuration: 35,
    infertilityDuration: 18,
    hasPcos: true,
    endometriosisGrade: 3,
    myomaType: 2, // MyomaType.Submucosal
    adenomyosisType: 2, // AdenomyosisType.Diffuse
    hsgResult: 2, // HsgResult.Bilateral
    hasOtb: true,
    remainingTubalLength: 2,
    hasOtherInfertilityFactors: true,
    spermConcentration: 8,
    spermProgressiveMotility: 15,
    spermNormalMorphology: 1
  }
};

console.log('🚀 INICIANDO VALIDACIÓN DEL MOTOR UNIFICADO');
console.log('===========================================');

// 🎯 FUNCIÓN DE VALIDACIÓN PRINCIPAL
function validateEngineCompatibility() {
  let passed = 0;
  let failed = 0;
  const tolerance = 0.01; // 1% de tolerancia para diferencias de precisión
  
  console.log('\n📊 VALIDANDO COMPATIBILIDAD CON MOTORES ORIGINALES');
  console.log('====================================================');
  
  Object.entries(TEST_CASES).forEach(([caseName, testCase]) => {
    console.log(`\n🎯 Caso: ${caseName.toUpperCase()}`);
    console.log('-------------------');
    
    try {
      // Ejecutar con motores originales
      const standardResult = calculateProbability(testCase);
      const premiumResult = calculateProbabilityPremium(testCase);
      
      // Ejecutar con motor unificado
      const { result: unifiedStandard, metrics: standardMetrics } = 
        calculateProbabilityUnified(testCase, { mode: 'standard' });
      const { result: unifiedPremium, metrics: premiumMetrics } = 
        calculateProbabilityUnified(testCase, { mode: 'premium' });
      const { result: unifiedAuto, metrics: autoMetrics } = 
        calculateProbabilityUnified(testCase, { mode: 'auto' });
      
      // Validar compatibilidad Standard
      const standardDiff = Math.abs(
        standardResult.report.numericPrognosis - unifiedStandard.report.numericPrognosis
      );
      
      if (standardDiff <= tolerance) {
        console.log(`   ✅ Standard: Compatible (diff: ${standardDiff.toFixed(4)})`);
        passed++;
      } else {
        console.log(`   ❌ Standard: INCOMPATIBLE (diff: ${standardDiff.toFixed(4)})`);
        console.log(`      Original: ${standardResult.report.numericPrognosis}`);
        console.log(`      Unified:  ${unifiedStandard.report.numericPrognosis}`);
        failed++;
      }
      
      // Validar compatibilidad Premium
      const premiumDiff = Math.abs(
        premiumResult.report.numericPrognosis - unifiedPremium.report.numericPrognosis
      );
      
      if (premiumDiff <= tolerance) {
        console.log(`   ✅ Premium: Compatible (diff: ${premiumDiff.toFixed(4)})`);
        passed++;
      } else {
        console.log(`   ❌ Premium: INCOMPATIBLE (diff: ${premiumDiff.toFixed(4)})`);
        console.log(`      Original: ${premiumResult.report.numericPrognosis}`);
        console.log(`      Unified:  ${unifiedPremium.report.numericPrognosis}`);
        failed++;
      }
      
      // Mostrar selección automática
      console.log(`   🤖 Auto: ${autoMetrics.engineUsed} (score: ${autoMetrics.complexityScore.toFixed(2)})`);
      console.log(`   ⏱️  Timing: Standard=${standardMetrics.executionTime.toFixed(1)}ms, ` +
                  `Premium=${premiumMetrics.executionTime.toFixed(1)}ms, ` +
                  `Auto=${autoMetrics.executionTime.toFixed(1)}ms`);
      
    } catch (error) {
      console.log(`   ❌ ERROR: ${error.message}`);
      failed++;
    }
  });
  
  return { passed, failed };
}

// 🎯 FUNCIÓN DE BENCHMARK DE PERFORMANCE
function performanceBenchmark() {
  console.log('\n⚡ BENCHMARK DE PERFORMANCE');
  console.log('============================');
  
  const iterations = 50;
  const testCase = TEST_CASES.moderate;
  
  // Benchmark Standard Original
  const startStandard = performance.now();
  for (let i = 0; i < iterations; i++) {
    calculateProbability(testCase);
  }
  const standardTime = performance.now() - startStandard;
  
  // Benchmark Premium Original
  const startPremium = performance.now();
  for (let i = 0; i < iterations; i++) {
    calculateProbabilityPremium(testCase);
  }
  const premiumTime = performance.now() - startPremium;
  
  // Benchmark Unified Standard
  const startUnifiedStd = performance.now();
  for (let i = 0; i < iterations; i++) {
    calculateProbabilityUnified(testCase, { mode: 'standard' });
  }
  const unifiedStdTime = performance.now() - startUnifiedStd;
  
  // Benchmark Unified Premium
  const startUnifiedPrm = performance.now();
  for (let i = 0; i < iterations; i++) {
    calculateProbabilityUnified(testCase, { mode: 'premium' });
  }
  const unifiedPrmTime = performance.now() - startUnifiedPrm;
  
  // Benchmark Unified Auto
  const startUnifiedAuto = performance.now();
  for (let i = 0; i < iterations; i++) {
    calculateProbabilityUnified(testCase, { mode: 'auto' });
  }
  const unifiedAutoTime = performance.now() - startUnifiedAuto;
  
  console.log(`\n📊 Resultados (${iterations} iteraciones):`);
  console.log(`   Standard Original:    ${(standardTime/iterations).toFixed(2)}ms/call`);
  console.log(`   Premium Original:     ${(premiumTime/iterations).toFixed(2)}ms/call`);
  console.log(`   Unified Standard:     ${(unifiedStdTime/iterations).toFixed(2)}ms/call`);
  console.log(`   Unified Premium:      ${(unifiedPrmTime/iterations).toFixed(2)}ms/call`);
  console.log(`   Unified Auto:         ${(unifiedAutoTime/iterations).toFixed(2)}ms/call`);
  
  // Calcular overhead
  const stdOverhead = ((unifiedStdTime - standardTime) / standardTime) * 100;
  const prmOverhead = ((unifiedPrmTime - premiumTime) / premiumTime) * 100;
  
  console.log(`\n📈 Overhead del motor unificado:`);
  console.log(`   Standard: ${stdOverhead.toFixed(1)}%`);
  console.log(`   Premium:  ${prmOverhead.toFixed(1)}%`);
  
  if (stdOverhead < 20 && prmOverhead < 20) {
    console.log(`   ✅ Performance aceptable (< 20% overhead)`);
    return true;
  } else {
    console.log(`   ⚠️  Performance overhead elevado`);
    return false;
  }
}

// 🎯 FUNCIÓN DE ANÁLISIS DE DECISIONES
function analyzeDecisionLogic() {
  console.log('\n🧠 ANÁLISIS DE LÓGICA DE DECISIÓN');
  console.log('=================================');
  
  const scenarios = [
    { name: 'Joven simple', case: { age: 25, bmi: 20, hasPcos: false, endometriosisGrade: 0, hasOtb: false } },
    { name: 'Edad moderada', case: { age: 35, bmi: 24, hasPcos: false, endometriosisGrade: 1, hasOtb: false } },
    { name: 'PCOS + sobrepeso', case: { age: 30, bmi: 28, hasPcos: true, endometriosisGrade: 0, hasOtb: false } },
    { name: 'Endometriosis severa', case: { age: 32, bmi: 22, hasPcos: false, endometriosisGrade: 4, hasOtb: false } },
    { name: 'OTB bilateral', case: { age: 30, bmi: 22, hasPcos: false, endometriosisGrade: 0, hasOtb: true } },
    { name: 'Edad avanzada + baja reserva', case: { age: 42, bmi: 24, amh: 0.5, hasPcos: false, endometriosisGrade: 0, hasOtb: false } }
  ];
  
  scenarios.forEach(({ name, case: testCase }) => {
    const { metrics } = calculateProbabilityUnified(testCase, { mode: 'auto' });
    
    console.log(`\n   ${name}:`);
    console.log(`     Motor: ${metrics.engineUsed}`);
    console.log(`     Score: ${metrics.complexityScore.toFixed(2)}`);
    console.log(`     Razón: ${metrics.decisionReason}`);
  });
}

// 🎯 EJECUTAR VALIDACIÓN COMPLETA
async function runFullValidation() {
  console.log(`Fecha: ${new Date().toLocaleString()}`);
  console.log(`Node.js: ${process.version}`);
  
  // 1. Validar compatibilidad
  const { passed, failed } = validateEngineCompatibility();
  
  // 2. Benchmark de performance
  const performanceOK = performanceBenchmark();
  
  // 3. Análisis de decisiones
  analyzeDecisionLogic();
  
  // 4. Resumen final
  console.log('\n🎯 RESUMEN FINAL');
  console.log('================');
  console.log(`✅ Tests pasados: ${passed}`);
  console.log(`❌ Tests fallidos: ${failed}`);
  console.log(`⚡ Performance: ${performanceOK ? 'ACEPTABLE' : 'REQUIERE OPTIMIZACIÓN'}`);
  
  const success = failed === 0 && performanceOK;
  console.log(`\n🎉 RESULTADO: ${success ? 'VALIDACIÓN EXITOSA' : 'VALIDACIÓN FALLIDA'}`);
  
  if (success) {
    console.log('🚀 El motor unificado está listo para producción');
  } else {
    console.log('⚠️  Se requieren correcciones antes del despliegue');
  }
  
  return success;
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  runFullValidation()
    .then(success => process.exit(success ? 0 : 1))
    .catch(error => {
      console.error('❌ Error durante la validación:', error);
      process.exit(1);
    });
}

module.exports = {
  validateEngineCompatibility,
  performanceBenchmark,
  analyzeDecisionLogic,
  runFullValidation
};
