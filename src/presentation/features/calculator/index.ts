// ===================================================================
// 🎯 ÍNDICE DE EXPORTACIONES - CALCULADORA DE FERTILIDAD
// ===================================================================

// 🚀 Hook principal
export { useCalculatorForm } from './useCalculatorFormModular';
export type { UseCalculatorFormReturn } from './useCalculatorFormModular';

// 🎯 Hooks especializados
export { useFormState } from './hooks/useFormState';
export { useFormValidation } from './hooks/useFormValidation';
export { useCalculations } from './hooks/useCalculations';
export { useFormProgress } from './hooks/useFormProgress';
export { useBenchmark } from './hooks/useBenchmark';

// 🛠️ Servicios
export { CalculationService } from './services/calculationService';
export { StorageService } from './services/storageService';

// 🔧 Utilidades
export * from './utils/formHelpers';
export * from './utils/formConstants';

// 📝 Tipos
export type * from './types/calculator.types';

// 📊 Componentes de formulario (re-exportar para conveniencia)
export { DemographicsForm } from './components/DemographicsForm';
export { GynecologyHistoryForm } from './components/GynecologyHistoryForm';
export { LabTestsForm } from './components/LabTestsForm';
export { MaleFactorForm } from './components/MaleFactorForm';

// 🔍 Validación
export { formSchema } from './utils/validationSchemas';
export { mapFormStateToUserInput } from './utils/dataMapper';
