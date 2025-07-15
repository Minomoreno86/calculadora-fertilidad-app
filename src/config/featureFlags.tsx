// ===================================================================
// 🎛️ CONFIGURACIÓN DE FEATURES - Sistema de flags de funcionalidades
// ===================================================================

export interface FeatureConfig {
  // 🎨 Mejoras de UX
  enableEnhancedProgress: boolean;      // Progreso gamificado
  enableProgressAnimations: boolean;    // Animaciones de progreso
  enableSmartHints: boolean;           // Sugerencias inteligentes
  
  // 🚀 Validación Paralela
  enableParallelValidation: boolean;    // Sistema de validación paralela
  enablePerformanceMonitor: boolean;   // Monitor de performance
  
  // 🎯 A/B Testing
  abTestGroup?: 'control' | 'enhanced' | 'minimal';
  
  // 🔧 Desarrollo
  showDevInfo: boolean;               // Información de desarrollo
  enableDebugMode: boolean;           // Modo debug
}

// Detectar si estamos en modo desarrollo
const __DEV__ = process.env.NODE_ENV === 'development';

export const DEFAULT_FEATURES: FeatureConfig = {
  // 🎨 UX Features - Activadas por defecto para mejor experiencia
  enableEnhancedProgress: true,
  enableProgressAnimations: true,
  enableSmartHints: true,
  
  // 🚀 Validación - Activada por defecto para mejor performance
  enableParallelValidation: true,
  enablePerformanceMonitor: __DEV__, // Solo en desarrollo por defecto
  
  // 🎯 A/B Testing - Sin asignación por defecto
  abTestGroup: undefined,
  
  // 🔧 Debug - Solo en desarrollo
  showDevInfo: __DEV__,
  enableDebugMode: __DEV__,
};

// 🎯 Configuraciones predefinidas para A/B testing
export const AB_TEST_CONFIGS: Record<string, Partial<FeatureConfig>> = {
  control: {
    enableEnhancedProgress: false,
    enableProgressAnimations: false,
    enableSmartHints: false,
  },
  enhanced: {
    enableEnhancedProgress: true,
    enableProgressAnimations: true,
    enableSmartHints: true,
  },
  minimal: {
    enableEnhancedProgress: false,
    enableProgressAnimations: false,
    enableSmartHints: false,
    enablePerformanceMonitor: false,
  },
};

// 🔧 Función para obtener configuración efectiva
export const getEffectiveConfig = (
  userConfig: Partial<FeatureConfig> = {},
  abTestGroup?: string
): FeatureConfig => {
  const baseConfig = { ...DEFAULT_FEATURES };
  
  // Aplicar configuración de A/B testing si está definida
  if (abTestGroup && AB_TEST_CONFIGS[abTestGroup]) {
    Object.assign(baseConfig, AB_TEST_CONFIGS[abTestGroup]);
  }
  
  // Aplicar configuración del usuario
  Object.assign(baseConfig, userConfig);
  
  return baseConfig;
};

// 🎯 Hook para usar la configuración de features
import React, { createContext, useContext, ReactNode } from 'react';

const FeatureConfigContext = createContext<FeatureConfig>(DEFAULT_FEATURES);

export const useFeatureConfig = () => {
  return useContext(FeatureConfigContext);
};

interface FeatureConfigProviderProps {
  children: ReactNode;
  config?: Partial<FeatureConfig>;
  abTestGroup?: string;
}

export const FeatureConfigProvider: React.FC<FeatureConfigProviderProps> = ({
  children,
  config = {},
  abTestGroup,
}) => {
  const effectiveConfig = getEffectiveConfig(config, abTestGroup);
  
  return (
    <FeatureConfigContext.Provider value={effectiveConfig}>
      {children}
    </FeatureConfigContext.Provider>
  );
};
