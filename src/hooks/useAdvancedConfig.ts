import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 🎯 TIPOS DE CONFIGURACIÓN AVANZADA
export interface AdvancedConfigState {
  // 🎨 Apariencia
  appearance: {
    darkMode: boolean;
    fontSize: 'small' | 'medium' | 'large' | 'xlarge';
    themeAccent: 'coral' | 'lavender' | 'mint' | 'sunset';
    animationsEnabled: boolean;
    reducedMotion: boolean;
  };
  
  // 🔔 Notificaciones
  notifications: {
    reminders: boolean;
    insights: boolean;
    updates: boolean;
    marketing: boolean;
    pushEnabled: boolean;
    quietHours: { start: number; end: number };
  };
  
  // 🧮 Cálculo y Performance
  calculation: {
    enginePreference: 'standard' | 'premium' | 'unified' | 'auto';
    cacheEnabled: boolean;
    performanceMode: 'balanced' | 'speed' | 'accuracy';
    backgroundSync: boolean;
    smartOptimizations: boolean;
    maxConcurrentCalculations: number;
    cacheSize: number;
    performanceThreshold: number;
  };
  
  // 🏥 Configuraciones Médicas
  medical: {
    units: 'metric' | 'imperial';
    language: 'es' | 'en' | 'pt' | 'fr';
    medicalTerminology: 'simple' | 'technical';
    riskTolerance: 'conservative' | 'moderate' | 'aggressive';
    showMedicalReferences: boolean;
    enableDiagnosticInsights: boolean;
    showConfidenceScores: boolean;
  };
  
  // 💾 Datos y Privacidad
  privacy: {
    dataRetention: 'session' | '30days' | '1year' | 'indefinite';
    analyticsEnabled: boolean;
    crashReporting: boolean;
    shareAnonymousData: boolean;
    encryptData: boolean;
    autoDelete: boolean;
  };
  
  // 🎯 Experiencia de Usuario
  ux: {
    smartHints: boolean;
    progressAnimations: boolean;
    hapticFeedback: boolean;
    soundFeedback: boolean;
    autoSave: boolean;
    quickActions: boolean;
    enhancedProgress: boolean;
    fieldFocusEffects: boolean;
  };

  // 🚀 Performance y Desarrollo
  development: {
    debugMode: boolean;
    showPerformanceMetrics: boolean;
    enableTelemetry: boolean;
    verboseLogging: boolean;
    enableBetaFeatures: boolean;
  };
}

// 📊 CONFIGURACIÓN POR DEFECTO
export const DEFAULT_ADVANCED_CONFIG: AdvancedConfigState = {
  appearance: {
    darkMode: false,
    fontSize: 'medium',
    themeAccent: 'coral',
    animationsEnabled: true,
    reducedMotion: false,
  },
  notifications: {
    reminders: true,
    insights: true,
    updates: false,
    marketing: false,
    pushEnabled: true,
    quietHours: { start: 22, end: 8 },
  },
  calculation: {
    enginePreference: 'auto',
    cacheEnabled: true,
    performanceMode: 'balanced',
    backgroundSync: true,
    smartOptimizations: true,
    maxConcurrentCalculations: 5,
    cacheSize: 1000,
    performanceThreshold: 1000,
  },
  medical: {
    units: 'metric',
    language: 'es',
    medicalTerminology: 'simple',
    riskTolerance: 'moderate',
    showMedicalReferences: true,
    enableDiagnosticInsights: true,
    showConfidenceScores: false,
  },
  privacy: {
    dataRetention: '1year',
    analyticsEnabled: true,
    crashReporting: true,
    shareAnonymousData: false,
    encryptData: true,
    autoDelete: false,
  },
  ux: {
    smartHints: true,
    progressAnimations: true,
    hapticFeedback: true,
    soundFeedback: false,
    autoSave: true,
    quickActions: true,
    enhancedProgress: true,
    fieldFocusEffects: true,
  },
  development: {
    debugMode: false,
    showPerformanceMetrics: false,
    enableTelemetry: false,
    verboseLogging: false,
    enableBetaFeatures: false,
  },
};

// 🎯 HOOK PARA GESTIONAR CONFIGURACIÓN AVANZADA
export const useAdvancedConfig = () => {
  const [config, setConfig] = useState<AdvancedConfigState>(DEFAULT_ADVANCED_CONFIG);
  const [isLoading, setIsLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // 📱 CARGAR CONFIGURACIÓN DESDE STORAGE
  const loadConfig = useCallback(async () => {
    try {
      setIsLoading(true);
      const storedConfig = await AsyncStorage.getItem('@advanced_config');
      if (storedConfig) {
        const parsedConfig = JSON.parse(storedConfig);
        
        // Merge con configuración por defecto para manejar nuevas propiedades
        const mergedConfig = mergeConfigs(DEFAULT_ADVANCED_CONFIG, parsedConfig);
        setConfig(mergedConfig);
      }
    } catch (error) {
      console.warn('Error cargando configuración avanzada:', error);
      // En caso de error, usar configuración por defecto
      setConfig(DEFAULT_ADVANCED_CONFIG);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 💾 GUARDAR CONFIGURACIÓN EN STORAGE
  const saveConfig = useCallback(async (configToSave?: AdvancedConfigState) => {
    try {
      const configData = configToSave || config;
      await AsyncStorage.setItem('@advanced_config', JSON.stringify(configData));
      setHasUnsavedChanges(false);
      
      console.log('✅ Configuración guardada exitosamente');
      return true;
    } catch (error) {
      console.error('❌ Error guardando configuración:', error);
      return false;
    }
  }, [config]);

  // 🔄 ACTUALIZAR CONFIGURACIÓN
  const updateConfig = useCallback(<T extends keyof AdvancedConfigState>(
    section: T,
    key: keyof AdvancedConfigState[T],
    value: any
  ) => {
    setConfig(prev => {
      const updated = {
        ...prev,
        [section]: {
          ...prev[section],
          [key]: value,
        },
      };
      return updated;
    });
    setHasUnsavedChanges(true);
  }, []);

  // 🔄 ACTUALIZAR SECCIÓN COMPLETA
  const updateSection = useCallback(<T extends keyof AdvancedConfigState>(
    section: T,
    newSection: Partial<AdvancedConfigState[T]>
  ) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...newSection,
      },
    }));
    setHasUnsavedChanges(true);
  }, []);

  // 🔄 RESTABLECER CONFIGURACIÓN
  const resetConfig = useCallback(async () => {
    try {
      setConfig(DEFAULT_ADVANCED_CONFIG);
      await AsyncStorage.removeItem('@advanced_config');
      setHasUnsavedChanges(false);
      console.log('🔄 Configuración restablecida a valores por defecto');
      return true;
    } catch (error) {
      console.error('❌ Error restableciendo configuración:', error);
      return false;
    }
  }, []);

  // 📤 EXPORTAR CONFIGURACIÓN
  const exportConfig = useCallback(() => {
    try {
      const configJSON = JSON.stringify(config, null, 2);
      console.log('📤 Configuración exportada:', configJSON);
      
      // En una implementación real, esto podría:
      // - Guardar en un archivo
      // - Compartir por email
      // - Copiar al clipboard
      
      return {
        data: configJSON,
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      };
    } catch (error) {
      console.error('❌ Error exportando configuración:', error);
      return null;
    }
  }, [config]);

  // 📥 IMPORTAR CONFIGURACIÓN
  const importConfig = useCallback(async (configData: string) => {
    try {
      const parsedConfig = JSON.parse(configData);
      
      // Validar que tenga la estructura correcta
      if (!isValidConfig(parsedConfig)) {
        throw new Error('Formato de configuración inválido');
      }
      
      const mergedConfig = mergeConfigs(DEFAULT_ADVANCED_CONFIG, parsedConfig);
      setConfig(mergedConfig);
      
      const saved = await saveConfig(mergedConfig);
      if (saved) {
        console.log('📥 Configuración importada exitosamente');
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Error importando configuración:', error);
      return false;
    }
  }, [saveConfig]);

  // 🎯 OBTENER CONFIGURACIÓN DE SECCIÓN
  const getSectionConfig = useCallback(<T extends keyof AdvancedConfigState>(
    section: T
  ): AdvancedConfigState[T] => {
    return config[section];
  }, [config]);

  // 🎯 VERIFICAR SI UNA FUNCIONALIDAD ESTÁ HABILITADA
  const isFeatureEnabled = useCallback((feature: string): boolean => {
    const [section, key] = feature.split('.') as [keyof AdvancedConfigState, string];
    
    if (!section || !key) return false;
    
    const sectionConfig = config[section] as any;
    return sectionConfig?.[key] === true;
  }, [config]);

  // 📊 OBTENER ESTADÍSTICAS DE CONFIGURACIÓN
  const getConfigStats = useCallback(() => {
    const enabledFeatures = Object.entries(config).reduce((acc, [section, sectionConfig]) => {
      const enabled = Object.values(sectionConfig as any).filter(value => value === true).length;
      const total = Object.keys(sectionConfig as any).length;
      acc[section] = { enabled, total, percentage: Math.round((enabled / total) * 100) };
      return acc;
    }, {} as Record<string, { enabled: number; total: number; percentage: number }>);

    return {
      totalFeatures: Object.values(enabledFeatures).reduce((sum, { total }) => sum + total, 0),
      enabledFeatures: Object.values(enabledFeatures).reduce((sum, { enabled }) => sum + enabled, 0),
      sections: enabledFeatures,
    };
  }, [config]);

  // 🔄 AUTO-GUARDADO
  useEffect(() => {
    if (hasUnsavedChanges) {
      const timeoutId = setTimeout(() => {
        if (config.ux.autoSave) {
          saveConfig();
        }
      }, 2000); // Auto-guardar después de 2 segundos de inactividad

      return () => clearTimeout(timeoutId);
    }
  }, [hasUnsavedChanges, config.ux.autoSave, saveConfig]);

  // 📱 CARGAR CONFIGURACIÓN AL INICIAR
  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  return {
    // Estado
    config,
    isLoading,
    hasUnsavedChanges,
    
    // Acciones
    updateConfig,
    updateSection,
    saveConfig,
    resetConfig,
    loadConfig,
    
    // Utilidades
    getSectionConfig,
    isFeatureEnabled,
    getConfigStats,
    
    // Import/Export
    exportConfig,
    importConfig,
  };
};

// 🛠️ UTILIDADES AUXILIARES

/**
 * Merge profundo de configuraciones
 */
function mergeConfigs(
  defaultConfig: AdvancedConfigState, 
  userConfig: Partial<AdvancedConfigState>
): AdvancedConfigState {
  const merged = { ...defaultConfig };
  
  for (const [section, sectionConfig] of Object.entries(userConfig)) {
    if (merged[section as keyof AdvancedConfigState] && typeof sectionConfig === 'object') {
      merged[section as keyof AdvancedConfigState] = {
        ...merged[section as keyof AdvancedConfigState],
        ...sectionConfig,
      } as any;
    }
  }
  
  return merged;
}

/**
 * Validar estructura de configuración
 */
function isValidConfig(config: any): config is AdvancedConfigState {
  if (!config || typeof config !== 'object') return false;
  
  const requiredSections = ['appearance', 'notifications', 'calculation', 'medical', 'privacy', 'ux'];
  
  return requiredSections.every(section => 
    config[section] && typeof config[section] === 'object'
  );
}

// 🎯 HOOK PARA ACCESO RÁPIDO A CONFIGURACIONES ESPECÍFICAS
export const useFeatureConfig = () => {
  const { config, isFeatureEnabled } = useAdvancedConfig();
  
  return {
    // 🎨 Apariencia
    isDarkMode: config.appearance.darkMode,
    fontSize: config.appearance.fontSize,
    themeAccent: config.appearance.themeAccent,
    animationsEnabled: config.appearance.animationsEnabled,
    
    // 🧮 Cálculo
    enginePreference: config.calculation.enginePreference,
    cacheEnabled: config.calculation.cacheEnabled,
    performanceMode: config.calculation.performanceMode,
    smartOptimizations: config.calculation.smartOptimizations,
    
    // 🏥 Médico
    units: config.medical.units,
    medicalTerminology: config.medical.medicalTerminology,
    riskTolerance: config.medical.riskTolerance,
    showMedicalReferences: config.medical.showMedicalReferences,
    
    // 🎯 UX
    smartHints: config.ux.smartHints,
    progressAnimations: config.ux.progressAnimations,
    hapticFeedback: config.ux.hapticFeedback,
    autoSave: config.ux.autoSave,
    enhancedProgress: config.ux.enhancedProgress,
    
    // 🔔 Notificaciones
    pushEnabled: config.notifications.pushEnabled,
    reminders: config.notifications.reminders,
    insights: config.notifications.insights,
    
    // 💾 Privacidad
    dataRetention: config.privacy.dataRetention,
    encryptData: config.privacy.encryptData,
    analyticsEnabled: config.privacy.analyticsEnabled,
    
    // 🎯 Utilidades
    isFeatureEnabled,
  };
};
