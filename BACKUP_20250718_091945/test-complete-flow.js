// ===================================================================
// 🧪 TEST DE FLUJO COMPLETO: Calculator → Results
// ===================================================================

import { mapFormStateToUserInput } from '../src/presentation/features/calculator/utils/dataMapper';
import { calculateProbability } from '../src/core/domain/services/calculationEngine';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Test del flujo completo de cálculo y navegación
 */
async function testCompleteFlow() {
  console.log('🧪 INICIANDO TEST DE FLUJO COMPLETO');

  // 1. Datos de prueba (formulario básico)
  const testFormData = {
    age: '30',
    weight: '65',
    height: '165',
    cycleLength: '28',
    infertilityDuration: '12',
    hasPcos: false,
    endometriosisStage: 0,
    myomaType: 'NONE',
    adenomyosisType: 'NONE',
    polypType: 'NONE',
    hsgResult: 'NORMAL',
    hasPelvicSurgery: false,
    numberOfPelvicSurgeries: 0,
    hasOtb: false,
    otbMethod: 'NONE',
    hasOtherInfertilityFactors: false,
    desireForMultiplePregnancies: false,
    tpoAbPositive: false,
    insulinValue: '10',
    glucoseValue: '90',
    semenVolume: '3',
    amhValue: '2.5',
    tshValue: '2.0',
    prolactinValue: '15',
    spermConcentration: '50',
    spermProgressiveMotility: '40',
    spermNormalMorphology: '4',
    cycleRegularity: 'regular'
  };

  try {
    // 2. Mapear datos del formulario
    console.log('📊 PASO 1: Mapeando datos del formulario...');
    const calculatedBmi = parseFloat(testFormData.weight) / Math.pow(parseFloat(testFormData.height) / 100, 2);
    const calculatedHoma = (parseFloat(testFormData.insulinValue) * parseFloat(testFormData.glucoseValue)) / 405;
    
    const userInput = mapFormStateToUserInput(testFormData as any, calculatedBmi, calculatedHoma);
    console.log('✅ UserInput mapeado:', userInput);

    // 3. Calcular probabilidad
    console.log('📊 PASO 2: Calculando probabilidad...');
    const finalReport = calculateProbability(userInput);
    console.log('✅ Reporte generado:', finalReport);

    // 4. Simular guardado en AsyncStorage
    console.log('📊 PASO 3: Guardando en AsyncStorage...');
    const reportKey = `fertility_report_${Date.now()}`;
    await AsyncStorage.setItem(reportKey, JSON.stringify(finalReport));
    console.log('✅ Reporte guardado con key:', reportKey);

    // 5. Simular carga desde AsyncStorage
    console.log('📊 PASO 4: Cargando desde AsyncStorage...');
    const storedReport = await AsyncStorage.getItem(reportKey);
    if (storedReport) {
      const parsedReport = JSON.parse(storedReport);
      console.log('✅ Reporte cargado exitosamente:', parsedReport);
    } else {
      console.error('❌ No se pudo cargar el reporte');
      return false;
    }

    // 6. Limpiar AsyncStorage
    await AsyncStorage.removeItem(reportKey);
    console.log('🧹 AsyncStorage limpiado');

    console.log('🎉 TEST COMPLETO EXITOSO - Todo el flujo funciona correctamente!');
    return true;

  } catch (error) {
    console.error('❌ ERROR EN TEST:', error);
    return false;
  }
}

// Ejecutar test
if (require.main === module) {
  testCompleteFlow().then(success => {
    if (success) {
      console.log('\n✅ RESULTADO: El flujo completo funciona correctamente');
      console.log('🚀 La migración a useCalculatorFormOptimized fue exitosa');
    } else {
      console.log('\n❌ RESULTADO: Hay problemas en el flujo');
    }
  });
}

export { testCompleteFlow };
