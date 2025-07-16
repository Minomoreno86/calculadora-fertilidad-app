/**
 * 🚀 FASE 3B: ADAPTADOR PARA PREDICCIÓN IA
 * 
 * Convierte los datos del formulario (formData) en un objeto UserInput
 * válido para el motor de predicción avanzada.
 * 
 * Maneja:
 * ✅ Conversión de string a number
 * ✅ Campos opcionales y obligatorios
 * ✅ Validación de tipos
 * ✅ Valores por defecto
 */

import { UserInput, MyomaType, AdenomyosisType, PolypType, HsgResult, OtbMethod } from '../../core/domain/models';

/**
 * Convierte un objeto con datos del formulario a UserInput válido
 * para el sistema de predicción IA
 */
export function convertFormDataToUserInput(formData: Record<string, unknown>): UserInput {
  // Helper para conversión segura de números
  const parseNumber = (value: unknown): number | undefined => {
    if (value === undefined || value === null || value === '') return undefined;
    
    if (typeof value === 'number') return value;
    
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? undefined : parsed;
    }
    
    return undefined;
  };

  // Helper para conversión obligatoria
  const parseRequiredNumber = (value: unknown, defaultValue: number = 0): number => {
    const result = parseNumber(value);
    return result !== undefined ? result : defaultValue;
  };

  // Helper para booleanos
  const parseBoolean = (value: unknown): boolean => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return false;
  };

  // Construir UserInput completo
  const userInput: UserInput = {
    // CAMPOS OBLIGATORIOS
    age: parseRequiredNumber(formData.age, 25), // Default a 25 si no hay edad
    bmi: parseNumber(formData.bmi) || parseNumber(formData.calculatedBmi) || null,
    
    // CAMPOS OPCIONALES - Ginecología
    cycleDuration: parseNumber(formData.cycleDuration || formData.cycleLength),
    infertilityDuration: parseNumber(formData.infertilityDuration),
    hasPcos: parseBoolean(formData.hasPcos),
    endometriosisGrade: parseRequiredNumber(formData.endometriosisGrade || formData.endometriosisStage, 0),
    
    // Campos con enums - conversión segura
    myomaType: (formData.myomaType as MyomaType) || MyomaType.None,
    adenomyosisType: (formData.adenomyosisType as AdenomyosisType) || AdenomyosisType.None,
    polypType: (formData.polypType as PolypType) || PolypType.None,
    hsgResult: (formData.hsgResult as HsgResult) || HsgResult.Unknown,
    
    // OTB
    hasOtb: parseBoolean(formData.hasOtb),
    otbMethod: (formData.otbMethod as OtbMethod) || OtbMethod.Unknown,
    remainingTubalLength: parseNumber(formData.remainingTubalLength),
    hasOtherInfertilityFactors: parseBoolean(formData.hasOtherInfertilityFactors),
    desireForMultiplePregnancies: parseBoolean(formData.desireForMultiplePregnancies),
    
    // Cirugía pélvica
    hasPelvicSurgery: parseBoolean(formData.hasPelvicSurgery),
    pelvicSurgeriesNumber: parseNumber(formData.numberOfPelvicSurgeries || formData.pelvicSurgeriesNumber),
    
    // LABORATORIO
    amh: parseNumber(formData.amh || formData.amhValue),
    prolactin: parseNumber(formData.prolactin || formData.prolactinValue),
    tsh: parseNumber(formData.tsh || formData.tshValue),
    tpoAbPositive: parseBoolean(formData.tpoAbPositive),
    homaIr: parseNumber(formData.homaIr || formData.calculatedHoma),
    
    // FACTOR MASCULINO
    spermConcentration: parseNumber(formData.spermConcentration),
    spermProgressiveMotility: parseNumber(formData.spermProgressiveMotility),
    spermNormalMorphology: parseNumber(formData.spermNormalMorphology),
    semenVolume: parseNumber(formData.semenVolume)
  };

  return userInput;
}

/**
 * Valida si un UserInput tiene suficientes datos para predicción IA
 */
export function validateUserInputForPrediction(userInput: UserInput): {
  isValid: boolean;
  missingCritical: string[];
  dataQuality: number;
} {
  const missingCritical: string[] = [];
  let filledFields = 0;
  let totalFields = 0;

  // Campos críticos
  const criticalFields = [
    { key: 'age', value: userInput.age, name: 'Edad' },
    { key: 'bmi', value: userInput.bmi, name: 'BMI' }
  ];

  criticalFields.forEach(field => {
    totalFields++;
    if (field.value !== undefined && field.value !== null && field.value > 0) {
      filledFields++;
    } else {
      missingCritical.push(field.name);
    }
  });

  // Campos importantes opcionales
  const importantFields = [
    { key: 'cycleDuration', value: userInput.cycleDuration },
    { key: 'infertilityDuration', value: userInput.infertilityDuration },
    { key: 'amh', value: userInput.amh },
    { key: 'spermConcentration', value: userInput.spermConcentration },
    { key: 'spermProgressiveMotility', value: userInput.spermProgressiveMotility }
  ];

  importantFields.forEach(field => {
    totalFields++;
    if (field.value !== undefined && field.value !== null && field.value > 0) {
      filledFields++;
    }
  });

  const dataQuality = Math.round((filledFields / totalFields) * 100);
  const isValid = missingCritical.length === 0; // Solo necesita campos críticos

  return {
    isValid,
    missingCritical,
    dataQuality
  };
}

/**
 * Debug helper - muestra la calidad de los datos
 */
export function debugUserInputQuality(userInput: UserInput): void {
  console.group('🔍 Calidad de datos UserInput para predicción IA');
  
  const validation = validateUserInputForPrediction(userInput);
  
  console.log('✅ Campos críticos:', validation.missingCritical.length === 0 ? 'Completos' : `Faltan: ${validation.missingCritical.join(', ')}`);
  console.log('📊 Calidad de datos:', `${validation.dataQuality}%`);
  console.log('🎯 Listo para predicción:', validation.isValid ? 'Sí' : 'No');
  
  // Mostrar campos completados
  const completedFields = Object.entries(userInput)
    .filter(([, value]) => value !== undefined && value !== null && value !== 0 && value !== false)
    .map(([key]) => key);
    
  console.log('✅ Campos completados:', completedFields.join(', '));
  
  console.groupEnd();
}

export default {
  convertFormDataToUserInput,
  validateUserInputForPrediction,
  debugUserInputQuality
};
