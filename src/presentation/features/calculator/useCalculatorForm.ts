import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { calculateProbability } from '@/core/domain/services/calculationEngine';
import { MyomaType, AdenomyosisType, PolypType, HsgResult, OtbMethod } from '@/core/domain/models';
import { mapFormStateToUserInput } from './utils/dataMapper';

const REPORT_KEY_PREFIX = 'report-';

const preprocessNumberInput = (value: unknown) => {
  if (typeof value === 'string') {
    const sanitized = value.replace(',', '.');
    return sanitized === '' ? undefined : sanitized;
  }
  return value;
};

// Zod schema for form validation
const formSchema = z.object({
  age: z.coerce.number().min(1, 'La edad es obligatoria'),
  weight: z.preprocess(preprocessNumberInput, z.coerce.number().min(1, 'El peso es obligatorio')),
  height: z.preprocess(preprocessNumberInput, z.coerce.number().min(1, 'La altura es obligatoria')),
  cycleLength: z.preprocess(preprocessNumberInput, z.coerce.number().optional()),
  infertilityDuration: z.preprocess(preprocessNumberInput, z.coerce.number().optional()),
  hasPcos: z.boolean(),
  endometriosisStage: z.coerce.number(),
  myomaType: z.nativeEnum(MyomaType),
  adenomyosisType: z.nativeEnum(AdenomyosisType),
  polypType: z.nativeEnum(PolypType),
  hsgResult: z.nativeEnum(HsgResult),
  hasPelvicSurgery: z.boolean(),
  numberOfPelvicSurgeries: z.preprocess(preprocessNumberInput, z.coerce.number().optional()),
  hasOtb: z.boolean(),
  otbMethod: z.nativeEnum(OtbMethod).optional(),
  remainingTubalLength: z.preprocess(preprocessNumberInput, z.coerce.number().optional()),
  hasOtherInfertilityFactors: z.boolean().optional(),
  desireForMultiplePregnancies: z.boolean().optional(),
  amhValue: z.preprocess(preprocessNumberInput, z.coerce.number().optional()),
  tshValue: z.preprocess(preprocessNumberInput, z.coerce.number().optional()),
  prolactinValue: z.preprocess(preprocessNumberInput, z.coerce.number().optional()),
  tpoAbPositive: z.boolean(),
  insulinValue: z.preprocess(preprocessNumberInput, z.coerce.number().optional()),
  glucoseValue: z.preprocess(preprocessNumberInput, z.coerce.number().optional()),
  spermConcentration: z.preprocess(preprocessNumberInput, z.coerce.number().optional()),
  spermMotility: z.preprocess(preprocessNumberInput, z.coerce.number().optional()),
  spermMorphology: z.preprocess(preprocessNumberInput, z.coerce.number().optional()),
  semenVolume: z.preprocess(preprocessNumberInput, z.coerce.number().optional()),
});

export type FormState = z.infer<typeof formSchema>;

export const useCalculatorForm = () => {
  const [isLoading, setIsLoading] = useState(false);
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
      otbMethod: OtbMethod.Unknown,
      hasOtherInfertilityFactors: false,
      desireForMultiplePregnancies: false,
      tpoAbPositive: false,
    },
  });

  const watchedFields = watch();

  const calculatedBmi = useMemo(() => {
    const weightNum = watchedFields.weight;
    const heightNum = watchedFields.height;
    if (weightNum && heightNum && weightNum > 0 && heightNum > 0) {
      const heightInMeters = heightNum / 100;
      return weightNum / (heightInMeters * heightInMeters);
    }
    return null;
  }, [watchedFields.weight, watchedFields.height]);

  const calculatedHoma = useMemo(() => {
    const insulinNum = watchedFields.insulinValue;
    const glucoseNum = watchedFields.glucoseValue;
    if (insulinNum && glucoseNum && insulinNum > 0 && glucoseNum > 0) {
      return (insulinNum * glucoseNum) / 405;
    }
    return null;
  }, [watchedFields.insulinValue, watchedFields.glucoseValue]);

  const handleCalculate = async (data: FormState): Promise<string> => {
    setIsLoading(true);
    try {
      const userInput = mapFormStateToUserInput(data, calculatedBmi, calculatedHoma);
      const finalReport = calculateProbability(userInput);
      const reportKey = `${REPORT_KEY_PREFIX}${Date.now()}`;
      await AsyncStorage.setItem(reportKey, JSON.stringify(finalReport));
      return reportKey;
    } catch (error) {
      console.error('Error saving report to AsyncStorage:', error);
      throw error; // Re-throw the error to be caught by the UI
    } finally {
      setIsLoading(false);
    }
  };

  return {
    control,
    calculatedBmi,
    calculatedHoma,
    handleCalculate: handleSubmit(handleCalculate),
    setValue,
    formState: { errors },
    watchedFields,
    isLoading,
  };
};