import { FormState } from '../useCalculatorForm';
import { UserInput, MyomaType, AdenomyosisType, PolypType, HsgResult, OtbMethod } from '@/core/domain/models';

export const mapFormStateToUserInput = (
  data: FormState,
  calculatedBmi: number | null,
  calculatedHoma: number | null,
): UserInput => {
  return {
    age: data.age,
    bmi: calculatedBmi,
    cycleDuration: data.cycleLength,
    infertilityDuration: data.infertilityDuration,
    hasPcos: data.hasPcos,
    endometriosisGrade: data.endometriosisStage,
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
    amh: data.amhValue,
    prolactin: data.prolactinValue,
    tsh: data.tshValue,
    tpoAbPositive: data.tpoAbPositive,
    homaIr: calculatedHoma ?? undefined,
    spermConcentration: data.spermConcentration,
    spermProgressiveMotility: data.spermMotility,
    spermNormalMorphology: data.spermMorphology,
    semenVolume: data.semenVolume,
  };
};
