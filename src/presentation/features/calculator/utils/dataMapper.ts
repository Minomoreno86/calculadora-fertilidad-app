import { FormState } from '../useCalculatorFormOptimized';
import { UserInput } from '@/core/domain/models';

export const mapFormStateToUserInput = (
  formData: FormState,
  calculatedBmi: number | null,
  calculatedHoma: number | null
): UserInput => {
  
  // 🔧 Helper para convertir campos string a number correctamente
  const parseOptionalNumber = (value: string | number | undefined): number | undefined => {
    if (value === undefined || value === null || value === '') return undefined;
    
    // Si ya es un número
    if (typeof value === 'number' && value >= 0) return value;
    
    // Si es string, intentar convertir
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) || parsed < 0 ? undefined : parsed;
    }
    
    return undefined;
  };

  // Helper para convertir age obligatorio
  const parseAge = (value: string | number | undefined): number => {
    if (value === undefined || value === null || value === '') return 0;
    
    if (typeof value === 'number') return value;
    
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? 0 : parsed;
    }
    
    return 0;
  };

  const result: UserInput = {
    // Demografia - convertir age de string a number
    age: parseAge(formData.age),
    bmi: calculatedBmi,

    // Ginecología - convertir strings a numbers
    cycleDuration: parseOptionalNumber(formData.cycleLength),
    infertilityDuration: parseOptionalNumber(formData.infertilityDuration),
    hasPcos: formData.hasPcos,
    endometriosisGrade: formData.endometriosisStage,
    myomaType: formData.myomaType,
    adenomyosisType: formData.adenomyosisType,
    polypType: formData.polypType,
    hsgResult: formData.hsgResult,

    // Laboratorio básico
    homaIr: calculatedHoma ?? undefined,
    tpoAbPositive: formData.tpoAbPositive,

    // 🔧 Laboratorio avanzado - Convertir strings a numbers
    amh: parseOptionalNumber(formData.amhValue),
    tsh: parseOptionalNumber(formData.tshValue),
    prolactin: parseOptionalNumber(formData.prolactinValue),

    // 🔧 Factor masculino completo - Convertir strings a numbers
    spermConcentration: parseOptionalNumber(formData.spermConcentration),
    spermProgressiveMotility: parseOptionalNumber(formData.spermProgressiveMotility),
    spermNormalMorphology: parseOptionalNumber(formData.spermNormalMorphology),
    semenVolume: parseOptionalNumber(formData.semenVolume),

    // Cirugías y procedimientos - convertir strings a numbers
    pelvicSurgeriesNumber: parseOptionalNumber(formData.numberOfPelvicSurgeries),
    hasOtb: formData.hasOtb,
    otbMethod: formData.otbMethod,
    hasOtherInfertilityFactors: formData.hasOtherInfertilityFactors,
    desireForMultiplePregnancies: formData.desireForMultiplePregnancies,
    hasPelvicSurgery: formData.hasPelvicSurgery,
    
    // 🔧 CAMPOS FALTANTES QUE ESPERA EL MOTOR - Agregar valores por defecto
    remainingTubalLength: undefined, // El motor lo espera pero no lo tenemos en el formulario
  };

  // 🔧 LOG DETALLADO DEL MAPEO PARA DEBUGGING
  console.log('🔧 MAPEO DATATYPE:', {
    'formData.prolactinValue': formData.prolactinValue,
    'typeof prolactinValue': typeof formData.prolactinValue,
    'result.prolactin': result.prolactin,
    'formData.tshValue': formData.tshValue,
    'result.tsh': result.tsh,
    'formData.endometriosisStage': formData.endometriosisStage,
    'result.endometriosisGrade': result.endometriosisGrade,
    'formData.myomaType': formData.myomaType,
    'result.myomaType': result.myomaType,
    // 🔧 DEBUG OTB - Para verificar el problema
    'formData.hasOtb': formData.hasOtb,
    'result.hasOtb': result.hasOtb,
    'formData.otbMethod': formData.otbMethod,
    'result.otbMethod': result.otbMethod
  });

  return result;
};
