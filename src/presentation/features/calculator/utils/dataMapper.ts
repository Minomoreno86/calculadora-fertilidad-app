import { FormState } from '../useCalculatorForm';
import { UserInput } from '@/core/domain/models';

export const mapFormStateToUserInput = (
  formData: FormState,
  calculatedBmi: number | null,
  calculatedHoma: number | null
): UserInput => {
  return {
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
    homaIr: calculatedHoma,
    tpoAbPositive: formData.tpoAbPositive,

    // 🆕 Laboratorio avanzado - Con valores por defecto para undefined
    amh: formData.amhValue && formData.amhValue > 0 ? formData.amhValue : undefined,
    tsh: formData.tshValue && formData.tshValue > 0 ? formData.tshValue : undefined,
    prolactin: formData.prolactinValue && formData.prolactinValue > 0 ? formData.prolactinValue : undefined,

    // 🆕 Factor masculino completo - Con valores por defecto para undefined
    spermConcentration: formData.spermConcentration && formData.spermConcentration > 0 ? formData.spermConcentration : undefined,
    spermProgressiveMotility: formData.spermProgressiveMotility && formData.spermProgressiveMotility > 0 ? formData.spermProgressiveMotility : undefined,
    spermNormalMorphology: formData.spermNormalMorphology && formData.spermNormalMorphology > 0 ? formData.spermNormalMorphology : undefined,
    semenVolume: formData.semenVolume && formData.semenVolume > 0 ? formData.semenVolume : undefined,

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
};
