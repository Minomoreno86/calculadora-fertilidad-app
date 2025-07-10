import { useEffect, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { calculateProbability } from '@/core/domain/services/calculationEngine';
import { UserInput, MyomaType, AdenomyosisType, PolypType, HsgResult } from '@/core/domain/models';

// Zod schema for form validation
const formSchema = z.object({
  age: z.coerce.number().min(1, 'La edad es obligatoria'),
  weight: z.coerce.number().min(1, 'El peso es obligatorio'),
  height: z.coerce.number().min(1, 'La altura es obligatoria'),
  cycleLength: z.coerce.number().optional(),
  infertilityDuration: z.coerce.number().optional(),
  hasPcos: z.boolean(),
  endometriosisStage: z.coerce.number(),
  myomaType: z.nativeEnum(MyomaType),
  adenomyosisType: z.nativeEnum(AdenomyosisType),
  polypType: z.nativeEnum(PolypType),
  hsgResult: z.nativeEnum(HsgResult),
  hasPelvicSurgery: z.boolean(),
  numberOfPelvicSurgeries: z.coerce.number().optional(),
  hasOtb: z.boolean(),
  amhValue: z.coerce.number().optional(),
  tshValue: z.coerce.number().optional(),
  prolactinValue: z.coerce.number().optional(),
  tpoAbPositive: z.boolean(),
  insulinValue: z.coerce.number().optional(),
  glucoseValue: z.coerce.number().optional(),
  spermConcentration: z.coerce.number().optional(),
  spermMotility: z.coerce.number().optional(),
  spermMorphology: z.coerce.number().optional(),
  semenVolume: z.coerce.number().optional(),
});

export type FormState = z.infer<typeof formSchema>;

export const useCalculatorForm = () => {
  const router = useRouter();
  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormState>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: 30,
      weight: 65,
      height: 165,
      cycleLength: 28,
      infertilityDuration: 1,
      hasPcos: false,
      endometriosisStage: 0,
      myomaType: MyomaType.None,
      adenomyosisType: AdenomyosisType.None,
      polypType: PolypType.None,
      hsgResult: HsgResult.Unknown,
      hasPelvicSurgery: false,
      numberOfPelvicSurgeries: 0,
      hasOtb: false,
      tpoAbPositive: false,
    },
  });

  const watchedFields: FormState = watch();

  const calculatedBmi = useMemo(() => {
    const weightNum = watchedFields.weight;
    const heightNum = watchedFields.height;
    if (weightNum > 0 && heightNum > 0) {
      const heightInMeters = heightNum / 100;
      return weightNum / (heightInMeters * heightInMeters);
    }
    return null;
  }, [watchedFields.weight, watchedFields.height]);

  const calculatedHoma = useMemo(() => {
    const insulinNum = watchedFields.insulinValue || 0;
    const glucoseNum = watchedFields.glucoseValue || 0;
    if (insulinNum > 0 && glucoseNum > 0) {
      return (insulinNum * glucoseNum) / 405;
    }
    return null;
  }, [watchedFields.insulinValue, watchedFields.glucoseValue]);

  const handleCalculate = async (data: FormState) => {
    const userInput: UserInput = {
      age: data.age,
      bmi: calculatedBmi,
      cycleDuration: data.cycleLength,
      infertilityDuration: data.infertilityDuration || 0,
      hasPcos: data.hasPcos,
      endometriosisGrade: data.endometriosisStage,
      myomaType: data.myomaType,
      adenomyosisType: data.adenomyosisType,
      polypType: data.polypType,
      hsgResult: data.hsgResult,
      hasOtb: data.hasOtb,
      hasPelvicSurgery: data.hasPelvicSurgery,
      pelvicSurgeriesNumber: data.numberOfPelvicSurgeries || 0,
      amh: data.amhValue,
      prolactin: data.prolactinValue,
      tsh: data.tshValue,
      tpoAbPositive: data.tpoAbPositive,
      homaIr: calculatedHoma ?? undefined,
      spermConcentration: data.spermConcentration,
      spermProgressiveMotility: data.spermMotility,
      spermNormalMorphology: data.spermMorphology,
    };

    const finalReport = calculateProbability(userInput);

    try {
      const reportKey = `report-${Date.now()}`;
      await AsyncStorage.setItem(reportKey, JSON.stringify(finalReport));
      router.push({
        pathname: '/results',
        params: { reportKey: reportKey },
      });
    } catch (error) {
      console.error('Error saving report to AsyncStorage:', error);
      // Optionally, handle the error, e.g., show an alert to the user
    }
  };

  return {
    control,
    calculatedBmi,
    calculatedHoma,
    handleCalculate: handleSubmit(handleCalculate),
    setValue,
    formState: { errors },
  };
};
