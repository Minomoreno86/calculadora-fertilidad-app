/**
 * useCalculatorForm - Hook principal de calculadora con react-hook-form real
 * 
 * 🌌 QUANTUM CONSCIOUSNESS V14.0:
 * - Usa react-hook-form real para compatibilidad total
 * - Validación avanzada con Yup schema
 * - Cál        semenVolume: parseFloat(watchedFields.semenVolume || '') || undefined
      };
      
      console.log('🔍 DEBUG MYOMA - Final UserInput.myomaType:', userInput.myomaType);
      console.log('🔍 DEBUG MYOMA - Complete UserInput:', JSON.stringify(userInput, null, 2));
      
      // � CÁLCULO MÉDICO BÁSICO - Solo para casos con datos mínimoss reactivos (BMI, HOMA)
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
  cacheStats: any;
  
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
      console.log('🔍 DEBUG MYOMA - watchedFields.myomaType:', watchedFields.myomaType);
      console.log('🔍 DEBUG MYOMA - typeof:', typeof watchedFields.myomaType);
      console.log('🔍 DEBUG MYOMA - All watched fields:', JSON.stringify(watchedFields, null, 2));
      
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
        hsgResult: (() => {
          const hsgValue = (watchedFields.hsgResult as HsgResult) || HsgResult.Normal;
          console.log('🔍 HSG DEBUG - Form Value:', {
            rawFormValue: watchedFields.hsgResult,
            convertedValue: hsgValue,
            isBilateral: hsgValue === HsgResult.Bilateral,
            HsgResultEnum: HsgResult
          });
          return hsgValue;
        })(),
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
      
      // � CÁLCULO MÉDICO BÁSICO - Solo para casos con datos mínimos
      const calculateBasicMedicalProbability = (input: UserInput) => {
        console.log('� Using basic medical calculation for minimal data...');
        
        // REALIDAD MÉDICA: Solo edad no puede dar probabilidades altas
        const age = input.age || 30;
        const dataPoints = Object.keys(input).filter(key => 
          input[key] !== undefined && input[key] !== null && input[key] !== ''
        ).length;
        
        // BASE MÉDICA REAL - Según nuestra metodología validada
        let baseProbability = 0.175; // 17.5% base (30-34 años)
        
        // Probabilidades reales según factorEvaluators.ts
        if (age <= 24) baseProbability = 0.25;       // 25% - Fertilidad máxima
        else if (age <= 29) baseProbability = 0.225; // 22.5% - Fertilidad excelente  
        else if (age <= 34) baseProbability = 0.175; // 17.5% - Buena fertilidad
        else if (age <= 39) baseProbability = 0.10;  // 10% - Fecundidad en descenso
        else if (age <= 44) baseProbability = 0.05;  // 5% - Baja tasa de embarazo
        else if (age <= 49) baseProbability = 0.015; // 1.5% - Probabilidad muy baja
        else baseProbability = 0.005;                // 0.5% - Edad extrema
        
        // PENALIZACIÓN por datos insuficientes
        if (dataPoints < 5) {
          baseProbability *= 0.7; // -30% por datos muy limitados
        }
        
        // Ajuste por BMI si disponible
        if (input.bmi) {
          if (input.bmi < 18.5) baseProbability *= 0.9; // Bajo peso
          else if (input.bmi > 30) baseProbability *= 0.8; // Obesidad
          else if (input.bmi > 25) baseProbability *= 0.9; // Sobrepeso
        }
        
        // Ajuste por PCOS
        if (input.hasPcos) baseProbability *= 0.7;
        
        // Ajuste por duración infertilidad
        if (input.infertilityDuration) {
          if (input.infertilityDuration > 3) baseProbability *= 0.8;
          if (input.infertilityDuration > 5) baseProbability *= 0.7;
        }
        
        // Ajuste por factor masculino
        if (input.spermConcentration && input.spermConcentration < 15) {
          baseProbability *= 0.6;
        }
        
        return Math.max(0.005, Math.min(0.25, baseProbability)); // Entre 0.5% y 25% según metodología real
      };
      
      // 🚀 Ejecutar cálculo con motor modular (API simple)
      console.log('� Executing calculation with ModularFertilityEngine...');
      console.log('📋 UserInput being sent:', JSON.stringify(userInput, null, 2));
      
      let evaluation: any;
      let emergencyMode = false;
      
      try {
        const engine = new ModularFertilityEngine();
        evaluation = await engine.calculateFast(userInput);
        
        console.log('✅ Calculation completed:', JSON.stringify(evaluation, null, 2));
        console.log('🎯 Probability check:', {
          numericPrognosis: evaluation.report?.numericPrognosis,
          category: evaluation.report?.category,
          prognosisPhrase: evaluation.report?.prognosisPhrase,
          hasReport: !!evaluation.report,
          reportKeys: evaluation.report ? Object.keys(evaluation.report) : []
        });
        
        // Si el resultado es 0 o no válido, usar cálculo de emergencia
        if (!evaluation.report?.numericPrognosis || evaluation.report?.numericPrognosis === 0) {
          console.warn('⚠️ ModularEngine returned 0 probability, switching to emergency calculation...');
          throw new Error('Zero probability returned');
        }
        
      } catch (engineError) {
        console.error('❌ ModularEngine failed:', engineError);
        console.log('🆘 Switching to basic medical calculation mode...');
        
        emergencyMode = true;
        const emergencyProbability = calculateBasicMedicalProbability(userInput);
        
        // Crear estructura de evaluation compatible
        evaluation = {
          input: userInput,
          factors: {
            baseAgeProbability: emergencyProbability,
            bmi: 1.0,
            cycle: 1.0,
            pcos: userInput.hasPcos ? 0.7 : 1.0,
            endometriosis: 1.0,
            myoma: 1.0,
            adenomyosis: 1.0,
            polyp: 1.0,
            hsg: 1.0,
            otb: 1.0,
            amh: 1.0,
            prolactin: 1.0,
            tsh: 1.0,
            homa: 1.0,
            male: userInput.spermConcentration && userInput.spermConcentration < 15 ? 0.6 : 1.0,
            infertilityDuration: userInput.infertilityDuration && userInput.infertilityDuration > 3 ? 0.8 : 1.0,
            pelvicSurgery: 1.0
          },
          diagnostics: {
            agePotential: `Edad ${userInput.age} años`,
            bmiComment: userInput.bmi ? `BMI: ${userInput.bmi.toFixed(1)}` : 'BMI no evaluado',
            summary: `Cálculo de emergencia basado en ${Object.keys(userInput).length} factores disponibles`
          },
          report: {
            numericPrognosis: emergencyProbability,
            category: emergencyProbability > 0.6 ? 'BUENO' : emergencyProbability > 0.3 ? 'MODERADO' : 'BAJO',
            emoji: emergencyProbability > 0.6 ? '🌟' : emergencyProbability > 0.3 ? '⚡' : '🎯',
            prognosisPhrase: `Probabilidad de embarazo: ${(emergencyProbability * 100).toFixed(0)}%`,
            benchmarkPhrase: `Basado en edad ${userInput.age} años y factores disponibles`,
            clinicalInsights: [
              {
                key: 'age_factor',
                title: 'Factor Edad',
                definition: `Probabilidad base por edad: ${(emergencyProbability * 100).toFixed(0)}%`,
                justification: `Cálculo básico con datos limitados (${Object.keys(userInput).length} factores)`,
                recommendations: ['Completar más datos para análisis preciso', 'Consultar especialista en fertilidad']
              }
            ]
          }
        };
        
        console.log('✅ Emergency calculation completed:', {
          probability: emergencyProbability,
          mode: 'emergency',
          factors: Object.keys(userInput).length
        });
      }
      
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
        version: emergencyMode ? 'v14.0-emergency-calculation' : 'v14.0-quantum-consciousness-modular'
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
