// ===================================================================
// 🎯 HOOK DE ESTADO DEL FORMULARIO - Manejo centralizado del estado
// ===================================================================

import { useState, useEffect } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { FormState } from '../types/calculator.types';
import { INITIAL_FORM_VALUES } from '../utils/formConstants';
import { StorageService } from '../services/storageService';

/**
 * Hook para manejar el estado del formulario
 * Centraliza la configuración de react-hook-form y el estado de loading
 */
export function useFormState() {
  const [isLoading, setIsLoading] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  
  // 🔧 Configuración de react-hook-form - sin resolver por ahora para evitar conflictos de tipos
  const formInstance: UseFormReturn<FormState> = useForm<FormState>({
    // resolver: zodResolver(formSchema), // Comentado temporalmente por conflicto de tipos
    defaultValues: INITIAL_FORM_VALUES,
    mode: 'onChange' // Validación en tiempo real
  });

  const { control, handleSubmit, watch, setValue, getValues, formState, reset } = formInstance;
  
  // 🔍 Observar todos los campos
  const watchedFields = watch();

  // 💾 Auto-save cuando cambian los datos
  useEffect(() => {
    const hasData = Object.values(watchedFields).some(value => {
      if (typeof value === 'string') return value.trim() !== '' && value !== '0';
      if (typeof value === 'number') return value > 0;
      if (typeof value === 'boolean') return value;
      return false;
    });

    if (hasData) {
      StorageService.autoSave(watchedFields);
      setLastSavedAt(new Date());
    }
  }, [watchedFields]);

  // 📥 Cargar datos guardados al inicio
  useEffect(() => {
    const loadSavedData = () => {
      const savedData = StorageService.loadFormData();
      if (savedData) {
        // Aplicar datos guardados al formulario
        Object.entries(savedData).forEach(([key, value]) => {
          setValue(key as keyof FormState, value as never, { 
            shouldValidate: true,
            shouldDirty: true 
          });
        });
        setLastSavedAt(new Date());
        console.log('✅ Datos del formulario restaurados');
      }
    };

    loadSavedData();
  }, [setValue]);

  // 🔄 Funciones de control del estado
  const setLoadingState = (loading: boolean) => {
    setIsLoading(loading);
  };

  const saveCurrentState = () => {
    const success = StorageService.saveFormData(watchedFields);
    if (success) {
      setLastSavedAt(new Date());
    }
    return success;
  };

  const clearFormData = () => {
    reset(INITIAL_FORM_VALUES);
    StorageService.clearFormData();
    setLastSavedAt(null);
  };

  const loadFromData = (data: FormState) => {
    Object.entries(data).forEach(([key, value]) => {
      setValue(key as keyof FormState, value as never, { 
        shouldValidate: true,
        shouldDirty: true 
      });
    });
    setLastSavedAt(new Date());
  };

  // 📊 Información del estado
  const getFormInfo = () => {
    const storageInfo = StorageService.getStorageInfo();
    return {
      isDirty: formState.isDirty,
      isValid: formState.isValid,
      errorCount: Object.keys(formState.errors).length,
      lastSaved: lastSavedAt,
      hasStoredData: storageInfo.hasData,
      storageSize: storageInfo.size || 0
    };
  };

  // 📤 Exportar/Importar datos
  const exportFormData = () => {
    return StorageService.exportFormData(watchedFields);
  };

  const importFormData = (jsonData: string): boolean => {
    try {
      const importedData = StorageService.importFormData(jsonData);
      if (importedData) {
        loadFromData(importedData);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importando datos:', error);
      return false;
    }
  };

  return {
    // React Hook Form instance
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState,
    watchedFields,
    
    // Loading state
    isLoading,
    setLoadingState,
    
    // Data management
    saveCurrentState,
    clearFormData,
    loadFromData,
    
    // Information
    getFormInfo,
    lastSavedAt,
    
    // Import/Export
    exportFormData,
    importFormData,
    
    // Storage info
    storageInfo: StorageService.getStorageInfo(),
    storageStats: StorageService.getStorageStats()
  };
}
