import { useMemo, useState } from 'react';
import { useForm, Resolver } from 'react-hook-form';
import { useRouter } from 'expo-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { calculateProbability } from '@/core/domain/services/calculationEngine';
import { formSchema } from './utils/validationSchemas';
import { MyomaType, AdenomyosisType, PolypType, HsgResult, OtbMethod } from '@/core/domain/models';
import { mapFormStateToUserInput } from './utils/dataMapper';



export type FormState = z.infer<typeof formSchema>;


const REPORT_KEY_PREFIX = 'fertility_report_';

export const useCalculatorForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  // Ensure initialFormValues matches exactly the fields and types in formSchema
  const initialFormValues: FormState = {
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
    insulinValue: 0,
    glucoseValue: 0,
    semenVolume: 0, // Change to 0 if formSchema expects number, or match the type in formSchema
    // Add other fields as required by your formSchema, with correct types
  };

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormState>({
    resolver: zodResolver(formSchema) as Resolver<FormState>,
    defaultValues: initialFormValues,
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
      router.push(`/results?reportKey=${reportKey}`);
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