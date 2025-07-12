import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { theme } from '@/config/theme';
import Text from './Text';

interface ProgressStepperProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export const ProgressStepper = ({ currentStep, totalSteps, stepLabels }: ProgressStepperProps) => {
  const progressWidth = (currentStep / totalSteps) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <Animated.View 
            style={[
              styles.progressFill, 
              { width: `${progressWidth}%` }
            ]} 
          />
        </View>
        <Text variant="caption" style={styles.progressText}>
          Paso {currentStep} de {totalSteps}
        </Text>
      </View>
      
      <View style={styles.stepsContainer}>
        {stepLabels.map((label, index) => (
          <View key={index} style={styles.stepItem}>
            <View style={[
              styles.stepCircle,
              index < currentStep ? styles.stepCompleted : 
              index === currentStep - 1 ? styles.stepActive : styles.stepInactive
            ]}>
              <Text style={[
                styles.stepNumber,
                index < currentStep ? styles.stepCompletedText :
                index === currentStep - 1 ? styles.stepActiveText : styles.stepInactiveText
              ]}>
                {index + 1}
              </Text>
            </View>
            <Text variant="caption" style={[
              styles.stepLabel,
              index === currentStep - 1 && styles.stepLabelActive
            ]}>
              {label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.l,
  },
  progressContainer: {
    marginBottom: theme.spacing.m,
  },
  progressTrack: {
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },
  progressText: {
    textAlign: 'center',
    marginTop: theme.spacing.xs,
    color: theme.colors.subtleText,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  stepCompleted: {
    backgroundColor: theme.colors.primary,
  },
  stepActive: {
    backgroundColor: theme.colors.primary,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  stepInactive: {
    backgroundColor: theme.colors.border,
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: '600',
  },
  stepCompletedText: {
    color: theme.colors.white,
  },
  stepActiveText: {
    color: theme.colors.white,
  },
  stepInactiveText: {
    color: theme.colors.subtleText,
  },
  stepLabel: {
    textAlign: 'center',
    fontSize: 10,
    color: theme.colors.subtleText,
  },
  stepLabelActive: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
});
