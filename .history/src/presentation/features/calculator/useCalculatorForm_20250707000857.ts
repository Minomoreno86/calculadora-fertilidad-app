import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { calculateProbability } from '../../../core/domain/services/calculationEngine';

// If UserInput and EvaluationState are needed, import them from the correct path or define them here
import { UserInput } from '../../../core/domain/models';

// Tipos para las opciones de selección, que también serán usados por los componentes de la UI
export type EndometriosisStage = 'none' | 'stage_1_2' | 'stage_3_4';
export type MyomaType = 'none' | 'submucosal' | 'intramural_large';
export type AdenomyosisType = 'none' | 'focal' | 'diffuse';
export type PolypType = 'none' | 'single' | 'multiple';
export type HsgResult = 'normal' | 'unilateral' | 'bilateral' | 'malformacion';

// Interfaz para el estado del formulario (para organización y claridad)
export interface FormState {
    age: string;
    weight: string;
    height: string;
    cycleLength: string;
    infertilityDuration: string;
    hasPcos: boolean;
    endometriosisStage: EndometriosisStage;
    myomaType: MyomaType;
    adenomyosisType: AdenomyosisType;
    polypType: PolypType;
    hasPelvicSurgery: boolean;
    hsgResult: HsgResult;
    hasOtb: boolean;
    amhValue: string;
    tshValue: string;
    prolactinValue: string;
    tpoAbPositive: boolean; // <-- CAMPO AÑADIDO
    insulinValue: string;
    glucoseValue: string;
    spermConcentration: string;
    spermMotility: string;
    spermMorphology: string;
}

export const useCalculatorForm = () => {
  const router = useRouter();

  // Se inicializa el estado con todos los campos, incluyendo el que faltaba
  const [formState, setFormState] = useState<FormState>({
    age: '20',
    weight: '60',
    height: '165',
    cycleLength: '28',
    infertilityDuration: '0',
    hasPcos: false,
    endometriosisStage: 'none',
    myomaType: 'none',
    adenomyosisType: 'none',
    polypType: 'none',
    hasPelvicSurgery: false,
    hsgResult: 'normal',
    hasOtb: false,
    amhValue: '',
    tshValue: '',
    prolactinValue: '',
    tpoAbPositive: false, // <-- CAMPO AÑADIDO
    insulinValue: '',
    glucoseValue: '',
    spermConcentration: '',
    spermMotility: '',
    spermMorphology: '',
  });

  const [calculatedBmi, setCalculatedBmi] = useState<number | null>(null);
  const [calculatedHoma, setCalculatedHoma] = useState<number | null>(null);

  // Función genérica para actualizar cualquier campo del estado
  const setFormField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setFormState(prevState => ({ ...prevState, [key]: value }));
  };

  // Efecto para calcular el IMC
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

  // Efecto para calcular el HOMA-IR
  useEffect(() => {
    const insulinNum = parseFloat(formState.insulinValue);
    const glucoseNum = parseFloat(formState.glucoseValue);
    if (insulinNum > 0 && glucoseNum > 0) {
      setCalculatedHoma((insulinNum * glucoseNum) / 405);
    } else {
      setCalculatedHoma(null);
    }
  }, [formState.insulinValue, formState.glucoseValue]);

  // Función de cálculo que ahora usa el estado completo
  const handleCalculate = () => {
    if (!formState.age) {
      alert("La edad es un campo obligatorio.");
      return;
    }

    const userInput: UserInput = {
      edad: parseInt(formState.age, 10),
      imc: calculatedBmi,
      duracion_ciclo: formState.cycleLength ? parseInt(formState.cycleLength, 10) : undefined,
      tiene_sop: formState.hasPcos,
      grado_endometriosis: formState.endometriosisStage === 'stage_1_2' ? 1 : (formState.endometriosisStage === 'stage_3_4' ? 3 : 0),
      tiene_miomas: formState.myomaType !== 'none',
      mioma_submucoso: formState.myomaType === 'submucosal',
      mioma_intramural_significativo: formState.myomaType === 'intramural_large',
      mioma_subseroso_grande: false,
      tipo_adenomiosis: formState.adenomyosisType,
      tipo_polipo: formState.polypType,
      resultado_hsg: formState.hsgResult,
      tiene_otb: formState.hasOtb,
      amh: formState.amhValue ? parseFloat(formState.amhValue) : undefined,
      prolactina: formState.prolactinValue ? parseFloat(formState.prolactinValue) : undefined,
      tsh: formState.tshValue ? parseFloat(formState.tshValue) : undefined,
      tpo_ab_positivo: formState.tpoAbPositive, // <-- CAMPO AÑADIDO
      insulina_ayunas: formState.insulinValue ? parseFloat(formState.insulinValue) : undefined,
      glicemia_ayunas: formState.glucoseValue ? parseFloat(formState.glucoseValue) : undefined,
      volumen_seminal: undefined,
      concentracion_esperm: formState.spermConcentration ? parseFloat(formState.spermConcentration) : undefined,
      motilidad_progresiva: formState.spermMotility ? parseFloat(formState.spermMotility) : undefined,
      morfologia_normal: formState.spermMorphology ? parseFloat(formState.spermMorphology) : undefined,
      vitalidad_esperm: undefined,
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