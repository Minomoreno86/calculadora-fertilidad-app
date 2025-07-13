import { FormState } from '../useCalculatorForm';
import { UserInput } from '@/core/domain/models';

export const mapFormStateToUserInput = (
  formData: FormState,
  calculatedBmi: number | null,
  calculatedHoma: number | null
): UserInput => {
  
  // 🔧 Helper para convertir campos opcionales correctamente
  const parseOptionalNumber = (value: number | undefined): number | undefined => {
    if (value === undefined || value === null) return undefined;
    if (typeof value === 'number' && value >= 0) return value;
    return undefined;
  };

  const result: UserInput = {
    // Demografia
    age: formData.age,
    bmi: calculatedBmi,

    // Ginecología
    cycleDuration: formData.cycleLength,
    infertilityDuration: formData.infertilityDuration,
    hasPcos: formData.hasPcos,
    endometriosisGrade: formData.endometriosisStage,
    myomaType: formData.myomaType,
    adenomyosisType: formData.adenomyosisType,
    polypType: formData.polypType,
    hsgResult: formData.hsgResult,

    // Laboratorio básico
    homaIr: calculatedHoma ?? undefined,
    tpoAbPositive: formData.tpoAbPositive,

    // 🔧 Laboratorio avanzado - Mapeo mejorado para permitir valores 0
    amh: parseOptionalNumber(formData.amhValue),
    tsh: parseOptionalNumber(formData.tshValue),
    prolactin: parseOptionalNumber(formData.prolactinValue),

    // 🔧 Factor masculino completo - Mapeo mejorado 
    spermConcentration: parseOptionalNumber(formData.spermConcentration),
    spermProgressiveMotility: parseOptionalNumber(formData.spermProgressiveMotility),
    spermNormalMorphology: parseOptionalNumber(formData.spermNormalMorphology),
    semenVolume: parseOptionalNumber(formData.semenVolume),

    // 🆕 Ginecología avanzada
    cycleRegularity: formData.cycleRegularity,

    // Cirugías y procedimientos
    pelvicSurgeriesNumber: formData.numberOfPelvicSurgeries,
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
    'result.myomaType': result.myomaType
  });

  return result;
};
