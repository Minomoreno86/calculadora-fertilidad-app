// ===================================================================
// 🎨 HOOK DE MEJORAS UX - Sistema de mejoras de experiencia de usuario
// ===================================================================

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Animated } from 'react-native';

// 🎯 Tipos para mejoras UX
interface FieldUXState {
  isActive: boolean;
  hasBeenTouched: boolean;
  validationState: 'neutral' | 'valid' | 'warning' | 'error';
  showHint: boolean;
  animatedValue: Animated.Value;
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

// 🎨 Hook principal de mejoras UX
export const useUXEnhancements = (
  formData: Record<string, any>,
  config: UXEnhancementsConfig = {
    enableAnimations: true,
    enableSmartHints: true,
    enableProgressAnimations: true,
    enableFieldFocus: true,
  }
) => {
  const [fieldStates, setFieldStates] = useState<Record<string, FieldUXState>>({});
  const [currentFocusedField, setCurrentFocusedField] = useState<string | null>(null);
  const [sectionProgress, setSectionProgress] = useState<Record<string, FieldProgressInfo>>({});

  // 🎭 ANIMACIONES PARA CAMPOS
  const createFieldAnimation = useCallback((fieldName: string) => {
    if (!config.enableAnimations) return;

    const animatedValue = new Animated.Value(0);
    
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
  const onFieldFocus = useCallback((fieldName: string) => {
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
        Animated.spring(prev[fieldName].animatedValue, {
          toValue: 1,
          useNativeDriver: false,
          tension: 300,
          friction: 10,
        }).start();
      }
      return prev;
    });
  }, [config.enableFieldFocus, config.enableAnimations]);

  const onFieldBlur = useCallback((fieldName: string) => {
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
        Animated.spring(prev[fieldName].animatedValue, {
          toValue: 0,
          useNativeDriver: false,
          tension: 300,
          friction: 10,
        }).start();
      }
      return prev;
    });
  }, [config.enableAnimations]);

  // 📊 CÁLCULO DE PROGRESO POR SECCIÓN
  const calculateSectionProgress = useCallback(() => {
    const sections = {
      demographics: ['age', 'weight', 'height'],
      gynecology: ['cycleLength', 'infertilityDuration', 'hasPcos'],
      laboratory: ['amhValue', 'insulinValue', 'glucoseValue'],
      maleFactor: ['spermConcentration', 'spermProgressiveMotility'],
    };

    const progress: Record<string, FieldProgressInfo> = {};

    Object.entries(sections).forEach(([sectionName, fields]) => {
      const completedFields = fields.filter(field => {
        const value = formData[field];
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
          const value = formData[field];
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
  const getSmartHints = useCallback((fieldName: string) => {
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
  const getFieldValidationState = useCallback((fieldName: string, value: any, rangeValidation?: any) => {
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
  useEffect(() => {
    calculateSectionProgress();
    
    // Actualizar estados de validación de campos
    Object.keys(formData).forEach(fieldName => {
      const value = formData[fieldName];
      const validationState = getFieldValidationState(fieldName, value);
      
      setFieldStates(prev => ({
        ...prev,
        [fieldName]: {
          ...prev[fieldName],
          validationState,
        }
      }));
    });
  }, [formData]); // Solo depende de formData para evitar bucles infinitos

  // 🎯 SIGUIENTE CAMPO SUGERIDO
  const getNextSuggestedField = useCallback(() => {
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
  const getGamificationMetrics = useMemo(() => {
    const totalFieldsCompleted = Object.values(sectionProgress).reduce(
      (sum, section) => sum + section.completedFields, 0
    );
    const totalFields = Object.values(sectionProgress).reduce(
      (sum, section) => sum + section.totalFields, 0
    );
    
    const overallProgress = totalFields > 0 ? Math.round((totalFieldsCompleted / totalFields) * 100) : 0;
    
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
  const animatedProgress = useMemo(() => new Animated.Value(0), []);
  
  useEffect(() => {
    if (!enabled) return;
    
    Animated.timing(animatedProgress, {
      toValue: progress,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [progress, enabled, animatedProgress]);
  
  return animatedProgress;
};

export default useUXEnhancements;
