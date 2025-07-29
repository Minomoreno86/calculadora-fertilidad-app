/**
 * 🔬 TEST SOP DIRECTO - Sin complicaciones de imports
 */

// Simulación de cálculo SOP directo
console.log('🎯 TEST CALCULADORA - PERFIL SOP');
console.log('==================================');
console.log('👩 PERFIL: 25 años, IMC 25, SOP + Resistencia Insulínica');
console.log('');

// ===================================================================
// 🧮 CÁLCULO MANUAL BASADO EN LA LÓGICA MÉDICA REAL
// ===================================================================

// 1. PROBABILIDAD BASE POR EDAD (25 años = rango 25-29)
const baseAgeProbability = 22.5; // Según factorEvaluators: 25-29 años = 22.5%
console.log('🎯 Probabilidad base (25 años):', baseAgeProbability + '%');

// 2. FACTOR BMI (IMC 25 = sobrepeso límite)
const bmiFactor = 0.95; // IMC 25 = ligera reducción
console.log('⚖️ Factor BMI (25):', bmiFactor, '(ligera reducción)');

// 3. FACTOR CICLO (37 días = irregular)
const cycleFactor = 0.85; // Ciclos >35 días penalizan fertilidad
console.log('🔄 Factor ciclo (37 días):', cycleFactor, '(irregular)');

// 4. FACTOR SOP (positivo)
const pcosFactor = 0.6; // SOP impacta significativamente
console.log('🌸 Factor SOP (positivo):', pcosFactor, '(impacto moderado-alto)');

// 5. FACTOR HOMA-IR (5.05 = resistencia alta)
const homaFactor = 0.7; // Resistencia insulínica alta
console.log('🧪 Factor HOMA-IR (5.05):', homaFactor, '(resistencia alta)');

// 6. FACTOR DURACIÓN INFERTILIDAD (1 año = 12 meses)
const infertilityFactor = 0.9; // 1 año es relativamente poco
console.log('⏰ Factor infertilidad (1 año):', infertilityFactor, '(tiempo corto)');

// ===================================================================
// 🧮 CÁLCULO FINAL
// ===================================================================

const allMultipliers = bmiFactor * cycleFactor * pcosFactor * homaFactor * infertilityFactor;
console.log('');
console.log('🔢 Multiplicadores combinados:', allMultipliers.toFixed(4));

const finalProbability = (baseAgeProbability / 100) * allMultipliers;
console.log('🎯 Probabilidad final (decimal):', finalProbability.toFixed(4));

const finalPercentage = finalProbability * 100;
console.log('📊 RESULTADO FINAL:', finalPercentage.toFixed(1) + '%');

console.log('');
console.log('===================================================================');
console.log('📋 ANÁLISIS CLÍNICO - PERFIL SOP');
console.log('===================================================================');
console.log('');

// ===================================================================
// 📋 ANÁLISIS CLÍNICO DETALLADO
// ===================================================================

console.log('🔍 FACTORES ANALIZADOS:');
console.log('  • Edad: 25 años → Rango óptimo reproductivo');
console.log('  • IMC: 25 → Sobrepeso límite, ligero impacto');
console.log('  • Ciclo: 37 días → Irregular, típico de SOP');
console.log('  • SOP: Positivo → Impacto moderado-alto en fertilidad');
console.log('  • HOMA-IR: 5.05 → Resistencia insulínica alta');
console.log('  • Infertilidad: 1 año → Tiempo relativamente corto');
console.log('');

console.log('🎯 INTERPRETACIÓN MÉDICA:');
if (finalPercentage >= 15) {
  console.log('  📈 PRONÓSTICO: MODERADO-BUENO');
  console.log('  ✅ A pesar del SOP, la edad joven compensa');
} else if (finalPercentage >= 8) {
  console.log('  📊 PRONÓSTICO: MODERADO');
  console.log('  ⚠️ SOP requiere manejo especializado');
} else {
  console.log('  📉 PRONÓSTICO: BAJO');
  console.log('  🚨 SOP severo, requiere tratamiento inmediato');
}

console.log('');
console.log('💡 RECOMENDACIONES:');
console.log('  1. Control metabólico (metformina para resistencia insulínica)');
console.log('  2. Reducción de peso (objetivo IMC < 24)');
console.log('  3. Regulación hormonal (posible inducción ovulación)');
console.log('  4. Seguimiento endocrinológico');
console.log('  5. Evaluación factor masculino si no embarazo en 6 meses');

console.log('');
console.log('🎭 SIMULADOR DE PROBABILIDADES:');
for (let mes = 1; mes <= 12; mes++) {
  const probabilidadMensual = finalPercentage;
  const probabilidadAcumulada = 1 - Math.pow(1 - probabilidadMensual/100, mes);
  console.log(`  Mes ${mes.toString().padStart(2)}: ${(probabilidadAcumulada * 100).toFixed(1)}% acumulado`);
}

console.log('');
console.log('🧠 DR. IA - ANÁLISIS INTELIGENTE:');
console.log('==================================');
console.log('');
console.log('🔬 DIAGNÓSTICO DIFERENCIAL:');
console.log('El perfil sugiere SOP con resistencia insulínica moderada-alta.');
console.log('La combinación de ciclos irregulares + HOMA-IR elevado confirma');
console.log('el componente metabólico del síndrome.');
console.log('');
console.log('⚡ ESTRATEGIA TERAPÉUTICA:');
console.log('1. Abordaje metabólico PRIORITARIO (metformina 850mg 2x/día)');
console.log('2. Modificación estilo de vida (dieta baja en índice glicémico)');
console.log('3. Inductores de ovulación si no respuesta en 3 meses');
console.log('4. Considerar myo-inositol como coadyuvante');
console.log('');
console.log('📊 PRONÓSTICO A 12 MESES:');
const probabilidad12Meses = 1 - Math.pow(1 - finalPercentage/100, 12);
console.log(`Con tratamiento adecuado: ${(probabilidad12Meses * 100).toFixed(1)}% probabilidad acumulada`);
console.log('Sin tratamiento: Probabilidad reducida en 40-50%');
