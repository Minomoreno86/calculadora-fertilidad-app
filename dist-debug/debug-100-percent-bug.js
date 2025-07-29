/**
 * 🐛 DEBUG SCRIPT - EXACTO PROBLEMA 100% PROBABILITY
 *
 * Script para debuggear exactamente qué pasa cuando input.age = 20
 * y sale 100% de probabilidad en lugar del 25% esperado.
 */
import { MyomaType, AdenomyosisType, PolypType, HsgResult } from './src/core/domain/models.ts';
import { calculatePureFertilityFactors } from './src/core/domain/services/modular/CalculationCore.ts';
// ===================================================================
// 🧪 TEST CASE COMPLETO - PERFIL REALISTA
// ===================================================================
console.log('🎯 PRUEBA COMPLETA CALCULADORA FERTILIDAD - SOP');
console.log('=============================================');
console.log('👩 PERFIL: Mujer 25 años, IMC 25, SOP + Resistencia Insulínica');
// Input completo con perfil SOP
const testInput = {
    age: 25,
    bmi: 25.0,
    cycleDuration: 37, // Ciclos irregulares típicos de SOP
    infertilityDuration: 12, // 1 año × 12 meses = 12 meses
    hasPcos: true, // SOP positivo
    endometriosisGrade: 0,
    myomaType: MyomaType.None,
    adenomyosisType: AdenomyosisType.None,
    polypType: PolypType.None,
    hsgResult: HsgResult.Unknown,
    hasOtb: false,
    tpoAbPositive: false,
    // Laboratorios - Resistencia insulínica
    amh: undefined, // No especificado
    prolactin: undefined,
    tsh: undefined,
    homaIr: 5.05, // (Insulina 22 × Glucosa 105) / 405 = 5.05 (resistencia alta)
    spermConcentration: undefined,
    spermProgressiveMotility: undefined,
    spermNormalMorphology: undefined,
    semenVolume: undefined
};
console.log('\n📥 INPUT:', JSON.stringify(testInput, null, 2));
try {
    // Ejecutar el cálculo exacto
    const result = calculatePureFertilityFactors(testInput);
    console.log('\n📊 RESULTADO COMPLETO CALCULADORA:');
    console.log('==================================');
    console.log('🎯 Probabilidad Final:', `${(result.report?.numericPrognosis || 0) * 100}%`);
    console.log('📈 Categoría:', result.report?.category);
    console.log('😊 Emoji:', result.report?.emoji);
    console.log('💬 Frase Pronóstico:', result.report?.prognosisPhrase);
    console.log('📊 Benchmark:', result.report?.benchmarkPhrase);
    console.log('\n🔬 FACTORES DETALLADOS (Para Dr. IA):');
    console.log('====================================');
    Object.entries(result.factors || {}).forEach(([key, value]) => {
        const displayValue = typeof value === 'number' ?
            (key === 'baseAgeProbability' ? `${value}%` :
                key === 'age' ? `${value} años` :
                    key === 'bmi' ? `${value} kg/m²` :
                        key === 'infertilityDuration' ? `${value} meses` :
                            value.toFixed(3)) : value;
        console.log(`📊 ${key}: ${displayValue}`);
    });
    console.log('\n🏥 DIAGNÓSTICOS MÉDICOS:');
    console.log('========================');
    Object.entries(result.diagnostics || {}).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            console.log(`🔍 ${key}: [${value.join(', ')}]`);
        }
        else {
            console.log(`🔍 ${key}: "${value}"`);
        }
    });
    console.log('\n📋 HALLAZGOS CLÍNICOS (Para Informe):');
    console.log('====================================');
    if (result.report?.clinicalInsights && result.report.clinicalInsights.length > 0) {
        result.report.clinicalInsights.forEach((insight, index) => {
            console.log(`\n${index + 1}. 🏥 ${insight.title}`);
            console.log(`   📖 Definición: ${insight.definition}`);
            console.log(`   🎯 Justificación: ${insight.justification}`);
            console.log(`   💊 Recomendaciones: ${insight.recommendations?.length || 0} items`);
            if (insight.recommendations && insight.recommendations.length > 0) {
                insight.recommendations.slice(0, 3).forEach(rec => {
                    console.log(`      • ${rec}`);
                });
                if (insight.recommendations.length > 3) {
                    console.log(`      ... y ${insight.recommendations.length - 3} más`);
                }
            }
        });
    }
    else {
        console.log('✅ No se detectaron hallazgos clínicos anormales');
    }
    console.log('\n🧠 ANÁLISIS PARA DR. IA:');
    console.log('========================');
    console.log('📈 Probabilidad base edad 32:', `${result.factors?.baseAgeProbability}%`);
    console.log('💪 Factor BMI (22):', result.factors?.bmi === 1.0 ? 'NORMAL ✅' : `Multiplicador: ${result.factors?.bmi}`);
    console.log('⏰ Factor duración infertilidad (5 años):', result.factors?.infertilityDuration || 'No evaluado');
    console.log('🔄 Factor ciclo menstrual:', result.factors?.cycle === 1.0 ? 'NORMAL ✅' : `Multiplicador: ${result.factors?.cycle}`);
    // Simular respuesta Dr. IA
    console.log('\n🤖 DR. IA - ANÁLISIS INTELIGENTE:');
    console.log('=================================');
    const probabilityPercent = (result.report?.numericPrognosis || 0) * 100;
    const ageGroup = result.factors?.age || 32;
    const infertilityYears = Math.round((result.factors?.infertilityDuration || 0) / 12);
    let aiAnalysis = `
🧠 EVALUACIÓN MÉDICA INTELIGENTE:
──────────────────────────────────

👩‍⚕️ RESUMEN CLÍNICO:
• Paciente de ${ageGroup} años con infertilidad de ${infertilityYears} años
• Probabilidad mensual estimada: ${probabilityPercent.toFixed(1)}%
• IMC: ${result.factors?.bmi || 22} (Normal)
• Ciclo menstrual: ${result.diagnostics?.cycleComment || 'Regular'}

🔍 FACTORES CRÍTICOS IDENTIFICADOS:`;
    if (infertilityYears >= 3) {
        aiAnalysis += `
• ⚠️ INFERTILIDAD PROLONGADA (${infertilityYears} años):
  - Reduce significativamente la probabilidad natural
  - Indica posible factor subyacente no diagnosticado
  - Recomendación: Evaluación especializada urgente`;
    }
    if (ageGroup >= 32) {
        aiAnalysis += `
• 📅 FACTOR EDAD (${ageGroup} años):
  - Declive natural de la reserva ovárica
  - Ventana de oportunidad limitada
  - Necesario actuar con celeridad`;
    }
    aiAnalysis += `

💡 ESTRATEGIA RECOMENDADA:
1. 🔬 Estudios complementarios:
   - AMH, FSH (día 3), recuento folicular antral
   - Espermatograma completo del cónyuge
   - HSG o sono-HSG (permeabilidad tubárica)

2. 🎯 Plan de acción inmediato:
   - Consulta especializada en fertilidad
   - Evaluación para tratamientos de reproducción asistida
   - Optimización preconcepcional

3. ⏰ Timeline sugerido:
   - Evaluación completa: 1-2 meses
   - Inicio tratamiento: 2-3 meses
   - No esperar más de 6 meses

🎗️ PRONÓSTICO: ${result.report?.category === 'BUENO' ? 'FAVORABLE' :
        result.report?.category === 'MODERADO' ? 'RESERVADO' : 'REQUIERE INTERVENCIÓN'}
`;
    console.log(aiAnalysis);
    console.log('\n🎯 ANÁLISIS DEL RESULTADO:');
    console.log('=========================');
    const finalProbability = (result.report?.numericPrognosis || 0) * 100;
    console.log(`✅ Probabilidad calculada: ${finalProbability.toFixed(1)}%`);
    if (finalProbability >= 15) {
        console.log('🟢 PRONÓSTICO BUENO: Embarazo natural posible');
    }
    else if (finalProbability >= 5) {
        console.log('� PRONÓSTICO MODERADO: Considerar asistencia');
    }
    else {
        console.log('🔴 PRONÓSTICO BAJO: Evaluación especializada necesaria');
    }
    console.log('\n📊 SIMULADOR DE RESULTADOS:');
    console.log('===========================');
    console.log(`🔄 Probabilidad por ciclo: ${finalProbability.toFixed(1)}%`);
    console.log(`📅 Probabilidad a 6 meses: ${(1 - Math.pow(1 - finalProbability / 100, 6) * 100).toFixed(1)}%`);
    console.log(`📅 Probabilidad a 12 meses: ${(1 - Math.pow(1 - finalProbability / 100, 12) * 100).toFixed(1)}%`);
    console.log(`📅 Probabilidad a 24 meses: ${(1 - Math.pow(1 - finalProbability / 100, 24) * 100).toFixed(1)}%`);
}
catch (error) {
    console.error('❌ ERROR EN CÁLCULO:', error.message);
    console.log('\n🔍 INFORMACIÓN DEL ERROR:');
    console.log('========================');
    console.log('Error:', error);
}
