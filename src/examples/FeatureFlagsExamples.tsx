// ===================================================================
// 🧪 EJEMPLO DE USO DEL SISTEMA DE FEATURE FLAGS
// ===================================================================

import React from 'react';
import { FeatureConfigProvider, useFeatureConfig } from '@/config/featureFlags';

// 🎯 Ejemplo 1: Configuración básica
export function AppBasica() {
  return (
    <FeatureConfigProvider>
      <CalculadoraConFeatures />
    </FeatureConfigProvider>
  );
}

// 🎯 Ejemplo 2: A/B Testing
export function AppConABTesting() {
  // En una app real, esto vendría de un servicio
  const abTestGroup = Math.random() > 0.5 ? 'enhanced' : 'control';
  
  return (
    <FeatureConfigProvider abTestGroup={abTestGroup}>
      <CalculadoraConFeatures />
    </FeatureConfigProvider>
  );
}

// 🎯 Ejemplo 3: Configuración personalizada
export function AppPersonalizada() {
  return (
    <FeatureConfigProvider config={{
      enableEnhancedProgress: true,
      enableProgressAnimations: false,  // Sin animaciones para mejor performance
      enableSmartHints: true,
      enablePerformanceMonitor: true,   // Activar métricas
    }}>
      <CalculadoraConFeatures />
    </FeatureConfigProvider>
  );
}

// 🎯 Ejemplo 4: Configuración para diferentes perfiles
export function AppPorPerfil({ userType }: { userType: 'patient' | 'doctor' | 'researcher' }) {
  const configs = {
    patient: {
      enableEnhancedProgress: true,     // Pacientes necesitan motivación
      enableProgressAnimations: true,
      enableSmartHints: true,
      showDevInfo: false,
    },
    doctor: {
      enableEnhancedProgress: false,    // Médicos prefieren eficiencia
      enableProgressAnimations: false,
      enableSmartHints: false,
      enablePerformanceMonitor: true,   // Quieren ver métricas
      showDevInfo: true,
    },
    researcher: {
      enableEnhancedProgress: true,     // Investigadores quieren todo
      enableProgressAnimations: true,
      enableSmartHints: true,
      enablePerformanceMonitor: true,
      showDevInfo: true,
      enableDebugMode: true,
    },
  };

  return (
    <FeatureConfigProvider config={configs[userType]}>
      <CalculadoraConFeatures />
    </FeatureConfigProvider>
  );
}

// 🔍 Componente que usa las features
function CalculadoraConFeatures() {
  const features = useFeatureConfig();
  
  return (
    <div>
      <h2>Calculadora de Fertilidad</h2>
      
      <div>
        <h3>Features Activas:</h3>
        <ul>
          <li>Enhanced Progress: {features.enableEnhancedProgress ? '✅' : '❌'}</li>
          <li>Animaciones: {features.enableProgressAnimations ? '✅' : '❌'}</li>
          <li>Smart Hints: {features.enableSmartHints ? '✅' : '❌'}</li>
          <li>Performance Monitor: {features.enablePerformanceMonitor ? '✅' : '❌'}</li>
          <li>Grupo A/B: {features.abTestGroup || 'No asignado'}</li>
        </ul>
      </div>
      
      {/* Aquí iría el formulario real con ConditionalProgressDisplay */}
    </div>
  );
}

// 📊 Ejemplo de métricas para A/B testing
export function trackUserInteraction(eventName: string, data: Record<string, unknown>) {
  const features = useFeatureConfig();
  
  // En una app real, esto se enviaría a analytics
  console.log('📊 Analytics Event:', {
    event: eventName,
    ...data,
    features: {
      abTestGroup: features.abTestGroup,
      enhancedProgress: features.enableEnhancedProgress,
      animations: features.enableProgressAnimations,
    },
    timestamp: new Date().toISOString(),
  });
}

// 🎯 Ejemplo de implementación con métricas
export function FormularioConMetricas() {
  const features = useFeatureConfig();
  
  const handleFieldComplete = (fieldName: string) => {
    trackUserInteraction('field_completed', {
      fieldName,
      enhancedProgressEnabled: features.enableEnhancedProgress,
    });
  };
  
  const handleFormSubmit = (completionPercentage: number) => {
    trackUserInteraction('form_submitted', {
      completionPercentage,
      abTestGroup: features.abTestGroup,
    });
  };
  
  return (
    <FeatureConfigProvider>
      {/* Tu formulario aquí con tracking de eventos */}
    </FeatureConfigProvider>
  );
}

export default AppBasica;
