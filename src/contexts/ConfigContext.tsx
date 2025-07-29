import React from 'react';
import { useAdvancedConfig, AdvancedConfigState } from '../hooks/useAdvancedConfig';

// 🎯 TIPOS DEL CONTEXTO
interface ConfigContextType {
  config: AdvancedConfigState;
  isLoading: boolean;
  hasUnsavedChanges: boolean;
  
  // Acciones
  updateConfig: <T extends keyof AdvancedConfigState>(
    section: T,
    key: keyof AdvancedConfigState[T],
    value: AdvancedConfigState[T][keyof AdvancedConfigState[T]]
  ) => void;
  updateSection: <T extends keyof AdvancedConfigState>(
    section: T,
    newSection: Partial<AdvancedConfigState[T]>
  ) => void;
  saveConfig: () => Promise<boolean>;
  resetConfig: () => Promise<boolean>;
  
  // Utilidades
  getSectionConfig: <T extends keyof AdvancedConfigState>(section: T) => AdvancedConfigState[T];
  isFeatureEnabled: (feature: string) => boolean;
  getConfigStats: () => {
    totalFeatures: number;
    enabledFeatures: number;
    sections: Record<string, { enabled: number; total: number; percentage: number }>;
  };
  
  // Import/Export
  exportConfig: () => unknown;
  importConfig: (configData: string) => Promise<boolean>;
}

// 🎯 CONTEXTO
const ConfigContext = React.createContext<ConfigContextType | undefined>(undefined);

// 🎯 PROVIDER PRINCIPAL
interface ConfigProviderProps {
  children: React.ReactNode;
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children }) => {
  const configHook = useAdvancedConfig();

  const contextValue: ConfigContextType = React.useMemo(() => ({
    ...configHook,
  }), [configHook]);

  return (
    <ConfigContext.Provider value={contextValue}>
      {children}
    </ConfigContext.Provider>
  );
};

// 🎯 HOOK PARA USAR EL CONTEXTO
export const useConfigContext = (): ConfigContextType => {
  const context = React.useContext(ConfigContext);
  
  if (!context) {
    throw new Error('useConfigContext debe usarse dentro de ConfigProvider');
  }
  
  return context;
};

// 🎯 HOOKS ESPECÍFICOS PARA SECCIONES

/**
 * Hook específico para configuración de apariencia
 */
export const useAppearanceConfig = () => {
  const { config, updateConfig } = useConfigContext();
  
  return {
    ...config.appearance,
    updateAppearance: (key: keyof typeof config.appearance, value: typeof config.appearance[keyof typeof config.appearance]) =>
      updateConfig('appearance', key, value),
  };
};

/**
 * Hook específico para configuración de cálculo
 */
export const useCalculationConfig = () => {
  const { config, updateConfig } = useConfigContext();
  
  return {
    ...config.calculation,
    updateCalculation: (key: keyof typeof config.calculation, value: typeof config.calculation[keyof typeof config.calculation]) =>
      updateConfig('calculation', key, value),
  };
};

/**
 * Hook específico para configuración médica
 */
export const useMedicalConfig = () => {
  const { config, updateConfig } = useConfigContext();
  
  return {
    ...config.medical,
    updateMedical: (key: keyof typeof config.medical, value: typeof config.medical[keyof typeof config.medical]) =>
      updateConfig('medical', key, value),
  };
};

/**
 * Hook específico para configuración de UX
 */
export const useUXConfig = () => {
  const { config, updateConfig } = useConfigContext();
  
  return {
    ...config.ux,
    updateUX: (key: keyof typeof config.ux, value: typeof config.ux[keyof typeof config.ux]) =>
      updateConfig('ux', key, value),
  };
};

/**
 * Hook específico para configuración de notificaciones
 */
export const useNotificationsConfig = () => {
  const { config, updateConfig } = useConfigContext();
  
  return {
    ...config.notifications,
    updateNotifications: (key: keyof typeof config.notifications, value: typeof config.notifications[keyof typeof config.notifications]) =>
      updateConfig('notifications', key, value),
  };
};

/**
 * Hook específico para configuración de privacidad
 */
export const usePrivacyConfig = () => {
  const { config, updateConfig } = useConfigContext();
  
  return {
    ...config.privacy,
    updatePrivacy: (key: keyof typeof config.privacy, value: typeof config.privacy[keyof typeof config.privacy]) =>
      updateConfig('privacy', key, value),
  };
};
