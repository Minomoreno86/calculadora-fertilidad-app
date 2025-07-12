import { PremiumFormState } from '../usePremiumCalculatorForm';
import { UserInput, MyomaType, AdenomyosisType, PolypType, HsgResult, OtbMethod } from '@/core/domain/models';

export const mapPremiumFormStateToUserInput = (
  data: PremiumFormState,
  calculatedBmi: number | null,
  calculatedHoma: number | null,
): UserInput => {
  return {
    age: data.age,
    bmi: calculatedBmi,
    cycleDuration: data.cycleDuration,
    infertilityDuration: data.infertilityDuration,
    hasPcos: data.hasPcos,
    endometriosisGrade: data.endometriosisGrade,
    myomaType: data.myomaType,
    adenomyosisType: data.adenomyosisType,
    polypType: data.polypType,
    hsgResult: data.hsgResult,
    hasOtb: data.hasOtb,
    otbMethod: data.otbMethod ?? OtbMethod.Unknown,
    remainingTubalLength: data.remainingTubalLength,
    hasOtherInfertilityFactors: !!data.hasOtherInfertilityFactors,
    desireForMultiplePregnancies: !!data.desireForMultiplePregnancies,
    hasPelvicSurgery: data.hasPelvicSurgery,
    pelvicSurgeriesNumber: data.numberOfPelvicSurgeries,
    amh: data.amh,
    prolactin: data.prolactin,
    tsh: data.tsh,
    tpoAbPositive: data.tpoAbPositive,
    homaIr: calculatedHoma ?? undefined,
    spermConcentration: data.spermConcentration,
    spermProgressiveMotility: data.spermProgressiveMotility,
    spermNormalMorphology: data.spermNormalMorphology,
    semenVolume: data.semenVolume,
  };
};