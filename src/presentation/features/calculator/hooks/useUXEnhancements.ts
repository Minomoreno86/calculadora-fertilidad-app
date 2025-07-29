// ===================================================================
// 🎨 HOOK DE MEJORAS UX - Sistema de mejoras de experiencia de usuario
// ===================================================================

import React from 'react';
import { useFeatureConfig } from '@/config/featureFlags';

// Tipado temporal para Animated hasta resolver el import
type AnimatedValue = any;

const createAnimatedValue = (initialValue: number): AnimatedValue => {
  // Implementación simplificada para evitar error de import
  return { setValue: () => {}, interpolate: () => {} };
};

// 🎯 Tipos para mejoras UX
interface FieldUXState {
  isActive: boolean;
  hasBeenTouched: boolean;
  validationState: 'neutral' | 'valid' | 'warning' | 'error';
  showHint: boolean;
  animatedValue: any; // React Native Animated.Value type
}

interface UXEnhancementsConfig {
  enableAnimations: boolean;
  enableSmartHints: boolean;
  enableProgressAnimations: boolean;
  enableFieldFocus: boolean;
}

interface FieldProgressInfo {
  completedFields: number;
  totalFields: number;
  percentage: number;
  nextSuggestedField?: string;
}

// 🎨 Hook principal de mejoras UX con feature flags
export const useUXEnhancements = (
  formData: Record<string, unknown>,
  customConfig?: Partial<UXEnhancementsConfig>
) => {
  const featureConfig = useFeatureConfig();
  
  // Combinar configuración de features con configuración personalizada
  const config: UXEnhancementsConfig = React.useMemo(() => ({
    enableAnimations: featureConfig.enableProgressAnimations,
    enableSmartHints: featureConfig.enableSmartHints,
    enableProgressAnimations: featureConfig.enableProgressAnimations,
    enableFieldFocus: true, // Siempre habilitado para accesibilidad
    ...customConfig,
  }), [featureConfig, customConfig]);
  const [fieldStates, setFieldStates] = React.useState<Record<string, FieldUXState>>({});
  const [currentFocusedField, setCurrentFocusedField] = React.useState<string | null>(null);
  const [sectionProgress, setSectionProgress] = React.useState<Record<string, FieldProgressInfo>>({});

  // 🎭 ANIMACIONES PARA CAMPOS
  const createFieldAnimation = React.useCallback((fieldName: string) => {
    if (!config.enableAnimations) return;

    const animatedValue = createAnimatedValue(0);
    
    setFieldStates(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        animatedValue,
        isActive: false,
        hasBeenTouched: false,
        validationState: 'neutral',
        showHint: false,
      }
    }));

    return animatedValue;
  }, [config.enableAnimations]);

  // 🎯 SEGUIMIENTO DE FOCO DE CAMPOS
  const onFieldFocus = React.useCallback((fieldName: string) => {
    if (!config.enableFieldFocus) return;

    setCurrentFocusedField(fieldName);
    
    setFieldStates(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        isActive: true,
        hasBeenTouched: true,
      }
    }));

    // Animación de entrada
    setFieldStates(prev => {
      if (prev[fieldName]?.animatedValue && config.enableAnimations) {
        // Simplified animation call
        prev[fieldName].animatedValue.setValue?.(1);
      }
      return prev;
    });
  }, [config.enableFieldFocus, config.enableAnimations]);

  const onFieldBlur = React.useCallback((fieldName: string) => {
    setCurrentFocusedField(null);
    
    setFieldStates(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        isActive: false,
      }
    }));

    // Animación de salida
    setFieldStates(prev => {
      if (prev[fieldName]?.animatedValue && config.enableAnimations) {
        // Simplified animation call
        prev[fieldName].animatedValue.setValue?.(0);
      }
      return prev;
    });
  }, [config.enableAnimations]);

  // 📊 CÁLCULO DE PROGRESO POR SECCIÓN
  const calculateSectionProgress = React.useCallback(() => {
    // 🧠 NEURAL FIX V13.0: Validación de formData para evitar undefined errors
    if (!formData || typeof formData !== 'object') {
      console.warn('⚠️ useUXEnhancements: formData is undefined or invalid');
      return {};
    }
    
    const sections = {
      demographics: ['age', 'weight', 'height'],
      gynecology: ['cycleLength', 'infertilityDuration', 'hasPcos'],
      laboratory: ['amhValue', 'insulinValue', 'glucoseValue'],
      maleFactor: ['spermConcentration', 'spermProgressiveMotility'],
    };

    const progress: Record<string, FieldProgressInfo> = {};

    Object.entries(sections).forEach(([sectionName, fields]) => {
      const completedFields = fields.filter(field => {
        // 🛡️ NEURAL SAFETY: Acceso seguro a formData
        const value = formData?.[field];
        if (typeof value === 'string') {
          return value.trim() !== '' && value !== '0' && value !== '';
        }
        if (typeof value === 'number') {
          return value > 0;
        }
        if (typeof value === 'boolean') {
          return true; // Los booleanos siempre cuentan como completados
        }
        return !!value;
      }).length;

      progress[sectionName] = {
        completedFields,
        totalFields: fields.length,
        percentage: Math.round((completedFields / fields.length) * 100),
        nextSuggestedField: fields.find(field => {
          // 🛡️ NEURAL SAFETY: Acceso seguro a formData
          const value = formData?.[field];
          if (typeof value === 'string') {
            return value.trim() === '' || value === '0';
          }
          return !value;
        }),
      };
    });

    setSectionProgress(progress);
    return progress;
  }, [formData]);

  // 🎯 SUGERENCIAS INTELIGENTES
  const getSmartHints = React.useCallback((fieldName: string) => {
    if (!config.enableSmartHints) return null;

    const hints: Record<string, string> = {
      age: 'Ingresa tu edad actual para cálculos precisos',
      weight: 'Tu peso actual en kilogramos',
      height: 'Tu altura en centímetros',
      cycleLength: 'Duración promedio de tu ciclo menstrual',
      infertilityDuration: 'Tiempo buscando embarazo activamente',
      amhValue: 'Hormona antimulleriana - indicador de reserva ovárica',
      spermConcentration: 'Millones de espermatozoides por mL',
      spermProgressiveMotility: 'Porcentaje de espermatozoides con motilidad progresiva',
    };

    return hints[fieldName] || null;
  }, [config.enableSmartHints]);

  // 🎨 VALIDACIÓN VISUAL MEJORADA
  const getFieldValidationState = React.useCallback((fieldName: string, value: any, rangeValidation?: any) => {
    if (rangeValidation) {
      if (rangeValidation.isError) return 'error';
      if (rangeValidation.isWarning) return 'warning';
      if (rangeValidation.isNormal || rangeValidation.isValid) return 'valid';
    }

    // Validación básica basada en valor
    if (!value || value === '' || value === '0') return 'neutral';
    
    // Validaciones específicas por campo
    switch (fieldName) {
      case 'age':
        const age = parseFloat(value);
        if (age < 18 || age > 50) return 'warning';
        if (age >= 18 && age <= 35) return 'valid';
        return 'warning';
        
      case 'weight':
        const weight = parseFloat(value);
        if (weight < 40 || weight > 120) return 'warning';
        return 'valid';
        
      case 'height':
        const height = parseFloat(value);
        if (height < 140 || height > 200) return 'warning';
        return 'valid';
        
      default:
        return value ? 'valid' : 'neutral';
    }
  }, []);

  // 🔄 ACTUALIZAR ESTADOS CUANDO CAMBIAN LOS DATOS
  React.useEffect(() => {
    calculateSectionProgress();
    
    // 🧠 NEURAL FIX V13.0: Validación de formData antes de Object.keys
    if (!formData || typeof formData !== 'object') {
      console.warn('⚠️ useUXEnhancements: formData is undefined in useEffect');
      return;
    }
    
    // Actualizar estados de validación de campos
    Object.keys(formData).forEach(fieldName => {
      const value = formData[fieldName]; // Ya validado arriba, seguro usar []
      const validationState = getFieldValidationState(fieldName, value);
      
      setFieldStates(prev => ({
        ...prev,
        [fieldName]: {
          ...prev[fieldName],
          validationState,
        }
      }));
    });
  }, [formData, calculateSectionProgress, getFieldValidationState]); // ✨ Agregar dependencias

  // 🎯 SIGUIENTE CAMPO SUGERIDO
  const getNextSuggestedField = React.useCallback(() => {
    const allSections = ['demographics', 'gynecology', 'laboratory', 'maleFactor'];
    
    for (const section of allSections) {
      const sectionInfo = sectionProgress[section];
      if (sectionInfo?.nextSuggestedField) {
        return {
          fieldName: sectionInfo.nextSuggestedField,
          section,
          reason: `Completa ${section} para continuar`,
        };
      }
    }
    
    return null;
  }, [sectionProgress]);

  // 🏆 MÉTRICAS DE GAMIFICACIÓN
  const getGamificationMetrics = React.useMemo(() => {
    const totalFieldsCompleted = Object.values(sectionProgress).reduce(
      (sum: number, section: FieldProgressInfo) => sum + section.completedFields, 0
    );
    const totalFields = Object.values(sectionProgress).reduce(
      (sum: number, section: FieldProgressInfo) => sum + section.totalFields, 0
    );
    
    const overallProgress = (totalFields as number) > 0 ? Math.round(((totalFieldsCompleted as number) / (totalFields as number)) * 100) : 0;
    
    let badge = '';
    let message = '';
    
    if (overallProgress >= 90) {
      badge = '🏆';
      message = '¡Excelente! Perfil casi completo';
    } else if (overallProgress >= 70) {
      badge = '🎯';
      message = '¡Muy bien! Continúa completando';
    } else if (overallProgress >= 50) {
      badge = '📈';
      message = 'Buen progreso, sigue así';
    } else if (overallProgress >= 30) {
      badge = '🌱';
      message = 'Comenzando bien, continúa';
    } else {
      badge = '⭐';
      message = 'Comencemos tu perfil';
    }

    return {
      overallProgress,
      totalFieldsCompleted,
      totalFields,
      badge,
      message,
    };
  }, [sectionProgress]);

  return {
    // 🎯 Estados de campos
    fieldStates,
    currentFocusedField,
    
    // 📊 Progreso
    sectionProgress,
    getGamificationMetrics,
    
    // 🎭 Funciones de interacción
    onFieldFocus,
    onFieldBlur,
    createFieldAnimation,
    
    // 💡 Ayudas inteligentes
    getSmartHints,
    getNextSuggestedField,
    getFieldValidationState,
    
    // 🔧 Utilidades
    calculateSectionProgress,
  };
};

// 🎨 Hook específico para animaciones de progreso
export const useProgressAnimations = (progress: number, enabled = true) => {
  const animatedProgress = React.useMemo(() => createAnimatedValue(0), []);
  
  React.useEffect(() => {
    if (!enabled) return;
    
    // Simplified animation timing
    animatedProgress.setValue?.(progress);
  }, [progress, enabled, animatedProgress]);
  
  return animatedProgress;
};

export default useUXEnhancements;
