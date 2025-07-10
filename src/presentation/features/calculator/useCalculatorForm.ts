import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { calculateProbability } from '../../../core/domain/services/calculationEngine';
import { UserInput, MyomaType, AdenomyosisType, PolypType, HsgResult } from '../../../core/domain/models';

// Esta interfaz representa el estado del formulario, que principalmente contiene strings.
export interface FormState {
  age: string;
  weight: string;
  height: string;
  cycleLength: string;
  infertilityDuration: string;
  hasPcos: boolean;
  endometriosisStage: string; // '0' a '4'
  myomaType: MyomaType;
  adenomyosisType: AdenomyosisType;
  polypType: PolypType;
  hsgResult: HsgResult;
  hasPelvicSurgery: boolean;
  numberOfPelvicSurgeries: string;
  hasOtb: boolean;
  amhValue: string;
  tshValue: string;
  prolactinValue: string;
  tpoAbPositive: boolean;
  insulinValue: string;
  glucoseValue: string;
  spermConcentration: string;
  spermMotility: string;
  spermMorphology: string;
  semenVolume: string
}

export const useCalculatorForm = () => {
  const router = useRouter();

  const [formState, setFormState] = useState<FormState>({
    age: '30',
    weight: '65',
    height: '165',
    cycleLength: '28',
    infertilityDuration: '1',
    hasPcos: false,
    endometriosisStage: '0',
    myomaType: 'none',
    adenomyosisType: 'none',
    polypType: 'none',
    hsgResult: 'unknown',
    hasPelvicSurgery: false,
    numberOfPelvicSurgeries: '0',
    hasOtb: false,
    amhValue: '',
    tshValue: '',
    prolactinValue: '',
    tpoAbPositive: false,
    insulinValue: '',
    glucoseValue: '',
    spermConcentration: '',
    spermMotility: '',
    spermMorphology: '',
    semenVolume: '',
  });

  const [calculatedBmi, setCalculatedBmi] = useState<number | null>(null);
  const [calculatedHoma, setCalculatedHoma] = useState<number | null>(null);

  const setFormField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setFormState(prevState => ({ ...prevState, [key]: value }));
  };

  useEffect(() => {
    const weightNum = parseFloat(formState.weight);
    const heightNum = parseFloat(formState.height);
    if (weightNum > 0 && heightNum > 0) {
      const heightInMeters = heightNum / 100;
      setCalculatedBmi(weightNum / (heightInMeters * heightInMeters));
    } else {
      setCalculatedBmi(null);
    }
  }, [formState.weight, formState.height]);

  useEffect(() => {
    const insulinNum = parseFloat(formState.insulinValue);
    const glucoseNum = parseFloat(formState.glucoseValue);
    if (insulinNum > 0 && glucoseNum > 0) {
      setCalculatedHoma((insulinNum * glucoseNum) / 405);
    } else {
      setCalculatedHoma(null);
    }
  }, [formState.insulinValue, formState.glucoseValue]);

  const handleCalculate = () => {
    if (!formState.age) {
      alert("La edad es un campo obligatorio.");
      return;
    }

    // Mapeo preciso y seguro desde FormState (strings) a UserInput (tipos correctos)
    const userInput: UserInput = {
      age: parseInt(formState.age, 10),
      bmi: calculatedBmi,
      cycleDuration: formState.cycleLength ? parseInt(formState.cycleLength, 10) : undefined,
      infertilityDuration: formState.infertilityDuration ? parseInt(formState.infertilityDuration, 10) : 0,
      hasPcos: formState.hasPcos,
      endometriosisGrade: parseInt(formState.endometriosisStage, 10),
      myomaType: formState.myomaType,
      adenomyosisType: formState.adenomyosisType,
      polypType: formState.polypType,
      hsgResult: formState.hsgResult,
      hasOtb: formState.hasOtb,
      hasPelvicSurgery: formState.hasPelvicSurgery,
      pelvicSurgeriesNumber: formState.numberOfPelvicSurgeries ? parseInt(formState.numberOfPelvicSurgeries, 10) : 0,
      amh: formState.amhValue ? parseFloat(formState.amhValue) : undefined,
      prolactin: formState.prolactinValue ? parseFloat(formState.prolactinValue) : undefined,
      tsh: formState.tshValue ? parseFloat(formState.tshValue) : undefined,
      tpoAbPositive: formState.tpoAbPositive,
      homaIr: calculatedHoma ?? undefined,
      spermConcentration: formState.spermConcentration ? parseFloat(formState.spermConcentration) : undefined,
      spermProgressiveMotility: formState.spermMotility ? parseFloat(formState.spermMotility) : undefined,
      spermNormalMorphology: formState.spermMorphology ? parseFloat(formState.spermMorphology) : undefined,
    };

    const finalReport = calculateProbability(userInput);

    router.push({
      pathname: '/results',
      params: { report: JSON.stringify(finalReport) },
    });
  };

  return {
    formState,
    setFormField,
    calculatedBmi,
    calculatedHoma,
    handleCalculate,
  };
};