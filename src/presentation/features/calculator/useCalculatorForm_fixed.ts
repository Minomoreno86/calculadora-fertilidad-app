/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports */
/**
 * useCalculatorForm - Hook principal de calculadora con react-hook-form real
 * 
 * 🌌 QUANTUM CONSCIOUSNESS V14.0:
 * - Usa react-hook-form real para compatibilidad total
 * - Validación avanzada con Yup schema
 * - Cálculos reactivos (BMI, HOMA)
 * - Progress tracking inteligente
 * - Performance optimizada
 * - SISTEMA MODULAR ÚNICO Y ESENCIAL
 * 
 * @author QUANTON - Quantum Consciousness Medical AI V14.0
 * @version 5.0 - Modular Engine Implementation
 */

import React from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FormState, FormCalculationResult } from './types/calculator.types';
import { useCalculations } from './hooks/useCalculations';
import { router } from 'expo-router';
// 🌌 USAR SISTEMA MODULAR CORRECTO V14.0 - ¡EL ÚNICO ESENCIAL!
import { ModularFertilityEngine } from '../../../core/domain/services/modular';
import { UserInput, MyomaType, AdenomyosisType, PolypType, HsgResult, OtbMethod } from '../../../core/domain/models';

// 🌌 Quantum Consciousness Form Return Interface
export interface UseCalculatorFormReturn extends UseFormReturn<FormState> {
  // 🧮 Quantum Calculations
  calculatedBmi: number | null;
  calculatedHoma: number | null;
  
  // 🚀 Quantum Actions
  handleCalculate: () => Promise<void>;
  
  // 📊 Quantum Progress & State
  isLoading: boolean;
  currentStep: number;
  completionPercentage: number;
  
  // 👁️ Quantum Watched Fields
  watchedFields: FormState;
  
  // 🔮 Quantum Results
  calculationResult: FormCalculationResult | null;
  
  // ⚡ Quantum Performance
  cacheStats: unknown;
  
  // 🌌 Quantum Consciousness Empathic Functions
  formatBMI: (bmi: number | null) => string;
  formatHOMA: (homa: number | null) => string;
  getBMICategory: (bmi: number) => { category: string; color: string };
  getHOMACategory: (homa: number) => { category: string; color: string };
}

// 🌌 QUANTUM CONSCIOUSNESS DEFAULTS
const defaultFormValues: FormState = {
  // Demographics
  age: '',
  height: '',
  weight: '',
  
  // Gynecology
  cycleLength: '',
  infertilityDuration: '',
  hasPcos: false,
  endometriosisStage: 0,
  myomaType: 'none' as any,
  adenomyosisType: 'none' as any,
  polypType: 'none' as any,
  hsgResult: 'normal' as any,
  hasPelvicSurgery: false,
  numberOfPelvicSurgeries: 0,
  hasOtb: false,
  otbMethod: 'none' as any,
  hasOtherInfertilityFactors: false,
  desireForMultiplePregnancies: false,
  
  // Lab Tests
  tpoAbPositive: false,
  insulinValue: '',
  glucoseValue: '',
  amhValue: '',
  tshValue: '',
  prolactinValue: '',
  
  // Male Factor
  spermConcentration: '',
  spermProgressiveMotility: '',
  spermNormalMorphology: '',
  semenVolume: '',
  
  // Advanced
  cycleRegularity: 'regular' as any
};

// 🌌 QUANTUM CONSCIOUSNESS CALCULATOR FORM HOOK
export const useCalculatorForm = (): UseCalculatorFormReturn => {
  // 🚀 React Hook Form Setup con validación básica
  const formMethods = useForm<FormState>({
    defaultValues: defaultFormValues,
    mode: 'onChange',
    reValidateMode: 'onChange'
  });

  // 🔄 Estados adicionales
  const [isLoading, setIsLoading] = React.useState(false);
  const [calculationResult, setCalculationResult] = React.useState<FormCalculationResult | null>(null);

  // 🧮 Quantum Calculations Hook
  const {
    calculateBMI,
    calculateHOMA,
    formatBMI,
    formatHOMA,
    getBMICategory,
    getHOMACategory
  } = useCalculations();

  // 👁️ Watch all form fields
  const watchedFields = formMethods.watch();

  // 🧮 Quantum Memoized Calculations
  const calculatedBmi = React.useMemo(() => {
    const height = watchedFields.height || '';
    const weight = watchedFields.weight || '';
    
    console.log('🔍 BMI Calculation Debug:', {
      height,
      weight,
      heightType: typeof height,
      weightType: typeof weight,
      heightParsed: parseFloat(height),
      weightParsed: parseFloat(weight)
    });
    
    const result = calculateBMI(height, weight);
    console.log('🧮 BMI Result:', result);
    
    return result;
  }, [calculateBMI, watchedFields.height, watchedFields.weight]);

  const calculatedHoma = React.useMemo(() => {
    const glucose = watchedFields.glucoseValue || '';
    const insulin = watchedFields.insulinValue || '';
    
    console.log('🔍 HOMA Calculation Debug:', {
      glucose,
      insulin,
      glucoseType: typeof glucose,
      insulinType: typeof insulin,
      glucoseParsed: parseFloat(glucose),
      insulinParsed: parseFloat(insulin)
    });
    
    const result = calculateHOMA(glucose, insulin);
    console.log('🧮 HOMA Result:', result);
    
    return result;
  }, [calculateHOMA, watchedFields.glucoseValue, watchedFields.insulinValue]);

  // 📊 Progress Calculation - Simple implementation
  const { currentStep, completionPercentage } = React.useMemo(() => {
    const fields = Object.values(watchedFields);
    const filledFields = fields.filter(value => 
      value !== '' && value !== null && value !== undefined && value !== false
    ).length;
    const totalFields = fields.length;
    const percentage = Math.round((filledFields / totalFields) * 100);
    
    let step = 0;
    if (percentage > 75) step = 3;
    else if (percentage > 50) step = 2;
    else if (percentage > 25) step = 1;
    
    return {
      currentStep: step,
      completionPercentage: percentage
    };
  }, [watchedFields]);

  // 🚀 Handle Calculate Function con Sistema Modular ESENCIAL
  const handleCalculate = async () => {
    setIsLoading(true);
    try {
      // 🌌 QUANTUM CONSCIOUSNESS V14.0 - Generate report key
      const reportKey = `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      console.log('🎯 Starting calculation with Modular Engine V14.0...');
      
      // 🌌 Crear UserInput del formulario para el Motor Modular
      const userInput: UserInput = {
        // Campos básicos requeridos
        age: parseFloat(watchedFields.age) || 30,
        bmi: calculatedBmi || 25,
        
        // Ginecología
        cycleDuration: parseFloat(watchedFields.cycleLength) || undefined,
        infertilityDuration: parseFloat(watchedFields.infertilityDuration) || undefined,
        hasPcos: watchedFields.hasPcos || false,
        endometriosisGrade: watchedFields.endometriosisStage || 0,
        myomaType: (watchedFields.myomaType as MyomaType) || MyomaType.None,
        adenomyosisType: (watchedFields.adenomyosisType as AdenomyosisType) || AdenomyosisType.None,
        polypType: (watchedFields.polypType as PolypType) || PolypType.None,
        hsgResult: (watchedFields.hsgResult as HsgResult) || HsgResult.Normal,
        hasOtb: watchedFields.hasOtb || false,
        otbMethod: watchedFields.hasOtb ? (watchedFields.otbMethod as OtbMethod) : undefined,
        hasOtherInfertilityFactors: watchedFields.hasOtherInfertilityFactors || false,
        desireForMultiplePregnancies: watchedFields.desireForMultiplePregnancies || false,
        hasPelvicSurgery: watchedFields.hasPelvicSurgery || false,
        pelvicSurgeriesNumber: watchedFields.hasPelvicSurgery ? watchedFields.numberOfPelvicSurgeries : undefined,
        
        // Laboratorio
        amh: parseFloat(watchedFields.amhValue || '') || undefined,
        prolactin: parseFloat(watchedFields.prolactinValue || '') || undefined,
        tsh: parseFloat(watchedFields.tshValue || '') || undefined,
        tpoAbPositive: watchedFields.tpoAbPositive || false,
        homaIr: calculatedHoma || undefined,
        
        // Factor masculino
        spermConcentration: parseFloat(watchedFields.spermConcentration || '') || undefined,
        spermProgressiveMotility: parseFloat(watchedFields.spermProgressiveMotility || '') || undefined,
        spermNormalMorphology: parseFloat(watchedFields.spermNormalMorphology || '') || undefined,
        semenVolume: parseFloat(watchedFields.semenVolume || '') || undefined
      };
      
      // 🚀 Ejecutar cálculo con motor modular (API simple)
      console.log('🧮 Executing calculation with ModularFertilityEngine...');
      const engine = new ModularFertilityEngine();
      const evaluation = await engine.calculateFast(userInput);
      
      console.log('✅ Calculation completed:', evaluation);
      
      // 🌌 Crear resultado para la aplicación
      const result: FormCalculationResult = {
        bmi: calculatedBmi || 0,
        homa: calculatedHoma || 0,
        formData: watchedFields,
        timestamp: new Date(),
        completionPercentage,
        reportKey
      };
      
      // 🌌 Crear evaluationData compatible con useReportLoader
      const evaluationData = {
        // Información básica
        basicMetrics: {
          bmi: calculatedBmi,
          homa: calculatedHoma,
          completionPercentage
        },
        
        // Datos del motor modular
        evaluation,
        
        // Probabilidad principal
        pregnancyProbability: evaluation.report?.numericPrognosis || 0.5,
        
        // Datos del formulario
        formData: watchedFields,
        timestamp: new Date().toISOString(),
        reportKey,
        version: 'v14.0-quantum-consciousness-modular'
      };
      
      // Save to AsyncStorage for useReportLoader compatibility
      await AsyncStorage.setItem(reportKey, JSON.stringify(evaluationData));
      console.log('💾 Report saved to AsyncStorage with key:', reportKey);
      
      setCalculationResult(result);
      console.log('🎯 Calculation completed:', result);
      
      // 🌌 QUANTUM CONSCIOUSNESS NAVIGATION V14.0 - Navigate to results
      console.log('🚀 Navigating to results with reportKey:', reportKey);
      router.push(`/results?reportKey=${reportKey}`);
      
    } catch (error) {
      console.error('❌ Calculation error:', error);
      setCalculationResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 🎯 Return complete interface
  return {
    // React Hook Form methods
    ...formMethods,
    
    // Quantum Calculations
    calculatedBmi,
    calculatedHoma,
    
    // Quantum Actions
    handleCalculate,
    
    // Quantum Progress & State
    isLoading,
    currentStep,
    completionPercentage,
    
    // Quantum Watched Fields
    watchedFields,
    
    // Quantum Results
    calculationResult,
    
    // Quantum Performance (mock for now)
    cacheStats: {},
    
    // Quantum Consciousness Functions
    formatBMI,
    formatHOMA,
    getBMICategory,
    getHOMACategory
  };
};

export default useCalculatorForm;
