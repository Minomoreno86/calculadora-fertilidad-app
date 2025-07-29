// ===================================================================
// 🎯 ÍNDICE DE EXPORTACIONES - CALCULADORA DE FERTILIDAD CONSOLIDADO
// ===================================================================

// 🚀 Hook principal unificado (versión corregida y consolidada)
export { useCalculatorForm } from './useCalculatorForm';
export type { UseCalculatorFormReturn } from './useCalculatorForm';

// 🎯 Hooks especializados consolidados
export { useCalculations } from './hooks/useCalculations';
export { useFormProgress } from './hooks/useFormProgress'; // ✨ Incluye métricas de benchmark consolidadas
export { useUXEnhancements } from './hooks/useUXEnhancements';
export { useStableFormValidation } from './hooks/useStableFormValidation'; // ✨ Incluye validaciones de rangos consolidadas
export { useParallelValidation } from './hooks/useParallelValidation';
export { useLazyValidation } from './hooks/useLazyValidation';
export { useIntelligentCache } from './hooks/useIntelligentCache';
export { useMathMemoization } from './hooks/useMathMemoization';
export { useDynamicThrottle } from './hooks/useDynamicThrottle';
export { useStableWatchedFields } from './hooks/useStableWatchedFields';
export { useRenderOptimization } from './hooks/useRenderOptimization';
export { useQuantumCache } from './hooks/useQuantumCache';

// 🛠️ Servicios
export { CalculationService } from './services/calculationService';
export { StorageService } from './services/storageService';

// 🔧 Utilidades consolidadas
export * from './utils/formHelpers';
export * from './utils/formConstants';
// export * from './utils/rangeValidation'; // Skip to avoid conflicts with formHelpers

// 🔍 Validación y mapeo
export { formSchema } from './utils/validationSchemas';
export { mapFormStateToUserInput } from './utils/dataMapper';

// 📝 Tipos
export type * from './types/calculator.types';

// 📊 Componentes de formulario consolidados
export { DemographicsForm } from './components/DemographicsForm';
export { GynecologyHistoryForm } from './components/GynecologyHistoryForm';
export { LabTestsForm } from './components/LabTestsForm';
export { MaleFactorForm } from './components/MaleFactorForm';
export { default as CalculatorPerformanceMonitor } from './components/CalculatorPerformanceMonitor';
export { EnhancedProgressDisplay } from './components/EnhancedProgressDisplay';
export { ConditionalProgressDisplay } from './components/ConditionalProgressDisplay';
export { EnhancedTextInput } from './components/EnhancedTextInput';

// ===================================================================
// 🎯 GUÍA DE USO - CALCULADORA DE FERTILIDAD
// ===================================================================
//
// HOOKS PRINCIPALES:
// - useCalculatorForm: Hook principal de formulario con validación
// - useCalculations: Cálculos BMI, HOMA y probabilidades
// - useFormProgress: Progreso del formulario con métricas
// - useParallelValidation: Validación en paralelo para performance
//
// COMPONENTES:
// - DemographicsForm, GynecologyHistoryForm, LabTestsForm, MaleFactorForm
// - CalculatorPerformanceMonitor: Monitor de rendimiento
// - EnhancedProgressDisplay: Display de progreso mejorado
//
// SERVICIOS:
// - CalculationService: Interfaz con motor de cálculo
// - StorageService: Persistencia de datos
//
// UTILIDADES:
// - formHelpers: Helpers de validación y formateo
// - formConstants: Constantes del formulario
// - validationSchemas: Esquemas de validación
//
// ===================================================================
