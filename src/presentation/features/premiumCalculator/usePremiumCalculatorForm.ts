import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'expo-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { calculateProbabilityPremium } from '@/core/domain/services/calculationEnginePremium';
import { premiumFormSchema } from './utils/premiumValidationSchemas';
import { mapPremiumFormStateToUserInput } from './utils/dataMapperPremium';
import { MyomaType, AdenomyosisType, PolypType, HsgResult, OtbMethod } from '@/core/domain/models';

export type PremiumFormState = z.infer<typeof premiumFormSchema>;

const REPORT_KEY_PREFIX = 'premium_report_';

const initialPremiumFormValues = {
  age: 30,
  weight: 65,
  height: 165,
  cycleDuration: 28,
  infertilityDuration: 1,
  hasPcos: false,
  endometriosisGrade: 0,
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
  amh: undefined,
  tsh: undefined,
  prolactin: undefined,
  tpoAbPositive: false,
  insulin: undefined,
  glucose: undefined,
  spermConcentration: undefined,
  spermProgressiveMotility: undefined,
  spermNormalMorphology: undefined,
  semenVolume: undefined,
};

export const usePremiumCalculatorForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<PremiumFormState>({
    resolver: zodResolver(premiumFormSchema),
    defaultValues: initialPremiumFormValues,
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
    const insulinNum = watchedFields.insulin;
    const glucoseNum = watchedFields.glucose;
    if (insulinNum && glucoseNum && insulinNum > 0 && glucoseNum > 0) {
      return (insulinNum * glucoseNum) / 405;
    }
    return null;
  }, [watchedFields.insulin, watchedFields.glucose]);

  const handleCalculate = async (data: PremiumFormState): Promise<string> => {
    setIsLoading(true);
    try {
      // Asegúrate de que mapFormStateToUserInput pueda manejar PremiumFormState
      const userInput = mapPremiumFormStateToUserInput(data, calculatedBmi, calculatedHoma);
      const finalReport = calculateProbabilityPremium(userInput);
      const reportKey = `${REPORT_KEY_PREFIX}${Date.now()}`;
      await AsyncStorage.setItem(reportKey, JSON.stringify(finalReport));
      router.push(`/results?reportKey=${reportKey}`);
      return reportKey;
    } catch (error) {
      console.error('Error saving premium report to AsyncStorage:', error);
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