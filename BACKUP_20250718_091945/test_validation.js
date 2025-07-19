// Test rápido de conversión de tipos para endometriosis y cirugías pélvicas
import { formSchema } from '../src/presentation/features/calculator/utils/validationSchemas';

console.log('🧪 Probando conversión de tipos en validación...\n');

// Test 1: Endometriosis como string → number
const testData1 = {
  age: 30,
  weight: "65",
  height: "165", 
  cycleLength: "28",
  infertilityDuration: "12",
  hasPcos: false,
  endometriosisStage: "2", // ← STRING
  numberOfPelvicSurgeries: "1", // ← STRING
  // ... otros campos requeridos
  myomaType: "none",
  adenomyosisType: "none",
  polypType: "none",
  hsgResult: "unknown",
  hasPelvicSurgery: true,
  hasOtb: false,
  otbMethod: "Unknown",
  hasOtherInfertilityFactors: false,
  desireForMultiplePregnancies: false,
  tpoAbPositive: false,
  insulinValue: "10",
  glucoseValue: "90"
};

try {
  const validated = formSchema.parse(testData1);
  console.log('✅ Validación exitosa!');
  console.log('endometriosisStage:', validated.endometriosisStage, '(tipo:', typeof validated.endometriosisStage, ')');
  console.log('numberOfPelvicSurgeries:', validated.numberOfPelvicSurgeries, '(tipo:', typeof validated.numberOfPelvicSurgeries, ')');
} catch (error) {
  console.log('❌ Error de validación:', error.message);
}
