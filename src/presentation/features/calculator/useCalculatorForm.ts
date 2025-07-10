import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { calculateProbability } from '@/core/domain/services/calculationEngine';
import { UserInput, MyomaType, AdenomyosisType, PolypType, HsgResult } from '@/core/domain/models';

// Zod schema for form validation
const formSchema = z.object({
  age: z.string().min(1, 'La edad es obligatoria'),
  weight: z.string().min(1, 'El peso es obligatorio'),
  height: z.string().min(1, 'La altura es obligatoria'),
  cycleLength: z.string().optional(),
  infertilityDuration: z.string().optional(),
  hasPcos: z.boolean(),
  endometriosisStage: z.string(),
  myomaType: z.nativeEnum(MyomaType),
  adenomyosisType: z.nativeEnum(AdenomyosisType),
  polypType: z.nativeEnum(PolypType),
  hsgResult: z.nativeEnum(HsgResult),
  hasPelvicSurgery: z.boolean(),
  numberOfPelvicSurgeries: z.string().optional(),
  hasOtb: z.boolean(),
  amhValue: z.string().optional(),
  tshValue: z.string().optional(),
  prolactinValue: z.string().optional(),
  tpoAbPositive: z.boolean(),
  insulinValue: z.string().optional(),
  glucoseValue: z.string().optional(),
  spermConcentration: z.string().optional(),
  spermMotility: z.string().optional(),
  spermMorphology: z.string().optional(),
  semenVolume: z.string().optional(),
});

export type FormState = z.infer<typeof formSchema>;

export const useCalculatorForm = () => {
  const router = useRouter();
  const { control, handleSubmit, watch, setValue } = useForm<FormState>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: '30',
      weight: '65',
      height: '165',
      cycleLength: '28',
      infertilityDuration: '1',
      hasPcos: false,
      endometriosisStage: '0',
      myomaType: MyomaType.None,
      adenomyosisType: AdenomyosisType.None,
      polypType: PolypType.None,
      hsgResult: HsgResult.Unknown,
      hasPelvicSurgery: false,
      numberOfPelvicSurgeries: '0',
      hasOtb: false,
      tpoAbPositive: false,
    },
  });

  const watchedFields: FormState = watch();

  const calculatedBmi = (() => {
    const weightNum = parseFloat(watchedFields.weight);
    const heightNum = parseFloat(watchedFields.height);
    if (weightNum > 0 && heightNum > 0) {
      const heightInMeters = heightNum / 100;
      return weightNum / (heightInMeters * heightInMeters);
    }
    return null;
  })();

  const calculatedHoma = (() => {
    const insulinNum = parseFloat(watchedFields.insulinValue || '0');
    const glucoseNum = parseFloat(watchedFields.glucoseValue || '0');
    if (insulinNum > 0 && glucoseNum > 0) {
      return (insulinNum * glucoseNum) / 405;
    }
    return null;
  })();

  const handleCalculate = (data: FormState) => {
    const userInput: UserInput = {
      age: parseInt(data.age, 10),
      bmi: calculatedBmi,
      cycleDuration: data.cycleLength ? parseInt(data.cycleLength, 10) : undefined,
      infertilityDuration: data.infertilityDuration ? parseInt(data.infertilityDuration, 10) : 0,
      hasPcos: data.hasPcos,
      endometriosisGrade: parseInt(data.endometriosisStage, 10),
      myomaType: data.myomaType,
      adenomyosisType: data.adenomyosisType,
      polypType: data.polypType,
      hsgResult: data.hsgResult,
      hasOtb: data.hasOtb,
      hasPelvicSurgery: data.hasPelvicSurgery,
      pelvicSurgeriesNumber: data.numberOfPelvicSurgeries ? parseInt(data.numberOfPelvicSurgeries, 10) : 0,
      amh: data.amhValue ? parseFloat(data.amhValue) : undefined,
      prolactin: data.prolactinValue ? parseFloat(data.prolactinValue) : undefined,
      tsh: data.tshValue ? parseFloat(data.tshValue) : undefined,
      tpoAbPositive: data.tpoAbPositive,
      homaIr: calculatedHoma ?? undefined,
      spermConcentration: data.spermConcentration ? parseFloat(data.spermConcentration) : undefined,
      spermProgressiveMotility: data.spermMotility ? parseFloat(data.spermMotility) : undefined,
      spermNormalMorphology: data.spermMorphology ? parseFloat(data.spermMorphology) : undefined,
    };

    const finalReport = calculateProbability(userInput);

    router.push({
      pathname: '/results',
      params: { report: JSON.stringify(finalReport) },
    });
  };

  return {
    control,
    calculatedBmi,
    calculatedHoma,
    handleCalculate: handleSubmit(handleCalculate),
    setValue,
  };
};
