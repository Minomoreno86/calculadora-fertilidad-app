/**
 * useStableWatchedFields - Hook para estabilizar watchedFields y evitar re-renders
 * 
 * Soluciona:
 * - Referencias inestables en watchedFields
 * - Re-renders innecesarios en componentes
 * - Performance degradada en formularios
 * 
 * @author AEC-D (Arquitecto Experto Clínico-Digital)
 * @version 1.0 - Optimización crítica
 */

import React from 'react';
import { UseFormWatch } from 'react-hook-form';
import { FormState } from '../types/calculator.types';

interface UseStableWatchedFieldsOptions {
  /**
   * Tiempo mínimo entre actualizaciones (ms)
   * @default 100
   */
  throttleTime?: number;
  
  /**
   * Campos a observar específicamente
   */
  watchFields?: (keyof FormState)[];
}

interface UseStableWatchedFieldsReturn {
  /** Campos observados estabilizados */
  stableWatchedFields: FormState;
  
  /** Función para forzar actualización */
  forceUpdate: () => void;
  
  /** Función para verificar si un campo es válido */
  isFieldValid: (fieldName: keyof FormState) => boolean;
  
  /** Porcentaje de completitud estabilizado */
  completionPercentage: number;
}

/**
 * Hook para estabilizar watchedFields y optimizar performance
 */
export const useStableWatchedFields = (
  watch: UseFormWatch<FormState>,
  options: UseStableWatchedFieldsOptions = {}
): UseStableWatchedFieldsReturn => {
  
  const { throttleTime = 100 } = options;
  
  // 🚀 Referencias estables
  const watchedFieldsRef = React.useRef<string>('{}');
  const stableFieldsRef = React.useRef<FormState | null>(null);
  const lastUpdateRef = React.useRef<number>(0);
  
  // 🚀 Observar campos con throttling - versión simplificada
  const watchedFieldsRaw = watch(); // Observar todos los campos
  
  // 🚀 Estabilizar watchedFields solo cuando sea necesario
  const stableWatchedFields = React.useMemo(() => {
    const now = Date.now();
    const watchedFieldsString = JSON.stringify(watchedFieldsRaw || {});
    
    // NEURAL FIX V13.0: Inicializar con datos reales del formulario
    if (stableFieldsRef.current === null && watchedFieldsRaw) {
      stableFieldsRef.current = watchedFieldsRaw;
      watchedFieldsRef.current = watchedFieldsString;
      lastUpdateRef.current = now;
      return watchedFieldsRaw;
    }
    
    // Solo actualizar si han pasado suficiente tiempo Y los datos cambiaron
    if (
      watchedFieldsRef.current !== watchedFieldsString &&
      (now - lastUpdateRef.current) >= throttleTime
    ) {
      watchedFieldsRef.current = watchedFieldsString;
      lastUpdateRef.current = now;
      stableFieldsRef.current = watchedFieldsRaw || {} as FormState;
    }
    
    return stableFieldsRef.current || ({} as FormState);
  }, [watchedFieldsRaw, throttleTime]);
  
  // 🚀 Función para forzar actualización
  const forceUpdate = React.useCallback(() => {
    const watchedFieldsString = JSON.stringify(watchedFieldsRaw || {});
    watchedFieldsRef.current = watchedFieldsString;
    lastUpdateRef.current = Date.now();
    stableFieldsRef.current = watchedFieldsRaw || ({} as FormState);
  }, [watchedFieldsRaw]);
  
  // 🚀 Función optimizada para verificar validez de campo
  const isFieldValid = React.useCallback((fieldName: string): boolean => {
    const value = stableWatchedFields[fieldName as keyof FormState];
    
    if (value === undefined || value === null) return false;
    
    if (typeof value === 'number') {
      return value > 0;
    }
    
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed === '') return false;
      
      // Para campos numéricos, verificar que sean números válidos > 0
      const numericFields = [
        'age', 'weight', 'height', 'cycleLength', 'infertilityDuration',
        'insulinValue', 'glucoseValue', 'amhValue', 'tshValue',
        'spermConcentration', 'spermProgressiveMotility', 'spermNormalMorphology'
      ];
      
      if (numericFields.includes(fieldName)) {
        const numValue = parseFloat(trimmed);
        return !isNaN(numValue) && numValue > 0;
      }
      
      return true;
    }
    
    if (typeof value === 'boolean') {
      return true; // Los booleanos siempre son válidos
    }
    
    return false;
  }, [stableWatchedFields]);
  
  // 🚀 Cálculo estabilizado de completitud
  const completionPercentage = React.useMemo(() => {
    // Campos básicos (peso 60%)
    const basicFields: (keyof FormState)[] = [
      'age', 'weight', 'height', 'cycleLength', 'infertilityDuration'
    ];
    
    // Campos importantes (peso 40%)
    const importantFields: (keyof FormState)[] = [
      'hasPcos', 'amhValue', 'insulinValue', 'glucoseValue', 
      'spermConcentration', 'spermProgressiveMotility'
    ];
    
    const completedBasic = basicFields.filter(isFieldValid);
    const completedImportant = importantFields.filter(isFieldValid);
    
    // Score ponderado: 60% básicos + 40% importantes
    const basicScore = basicFields.length > 0 ? (completedBasic.length / basicFields.length) * 60 : 0;
    const importantScore = importantFields.length > 0 ? (completedImportant.length / importantFields.length) * 40 : 0;
    
    return Math.round(basicScore + importantScore);
  }, [stableWatchedFields, isFieldValid]);
  
  return {
    stableWatchedFields,
    forceUpdate,
    isFieldValid,
    completionPercentage,
  };
};
