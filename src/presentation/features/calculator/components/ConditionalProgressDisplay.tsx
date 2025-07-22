// ===================================================================
// 🎯 WRAPPER CONDICIONAL PARA PROGRESO MEJORADO
// ===================================================================

import React from 'react';
import { EnhancedProgressDisplay } from './EnhancedProgressDisplay';
import { EnhancedProgressStepper } from '@/presentation/components/common/EnhancedProgressStepper';
import { useFeatureConfig } from '@/config/featureFlags';
import { useUXEnhancements } from '../hooks/useUXEnhancements';

interface Props {
  formData: Record<string, unknown>;
  currentStep: number;
  completionPercentage: number;
  stepLabels: string[];
}

export const ConditionalProgressDisplay: React.FC<Props> = ({
  formData,
  currentStep,
  completionPercentage,
  stepLabels,
}) => {
  // 🧠 NEURAL DEBUG V13.0: Log para debuggear el problema
  console.log('🔍 ConditionalProgressDisplay received:', {
    formData: formData ? 'exists' : 'undefined',
    formDataType: typeof formData,
    formDataKeys: formData ? Object.keys(formData) : 'N/A',
    hasAge: formData?.age !== undefined ? 'YES' : 'NO'
  });
  
  const featureConfig = useFeatureConfig();
  
  // Solo usar UX enhancements si están habilitadas
  const uxEnhancements = useUXEnhancements(formData);
  
  // Si las mejoras están deshabilitadas, usar componente básico
  if (!featureConfig.enableEnhancedProgress) {
    return (
      <EnhancedProgressStepper
        currentStep={currentStep}
        totalSteps={stepLabels.length}
        stepLabels={stepLabels}
        completionPercentage={completionPercentage}
      />
    );
  }
  
  // Si están habilitadas, usar el componente mejorado
  return (
    <EnhancedProgressDisplay
      sectionProgress={uxEnhancements.sectionProgress}
      currentStep={currentStep}
      gamificationMetrics={uxEnhancements.getGamificationMetrics}
      enableAnimations={featureConfig.enableProgressAnimations}
    />
  );
};

export default ConditionalProgressDisplay;
