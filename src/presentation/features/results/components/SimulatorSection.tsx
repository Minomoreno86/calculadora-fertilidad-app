import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Text from '../../../components/common/Text';
import Box from '../../../components/common/Box';
import { EvaluationState, SimulatableFactor, Diagnostics } from '../../../../core/domain/models';
import { useFertilitySimulator } from '../../../features/simulator/useFertilitySimulator';
import { theme } from '../../../../config/theme';
import { SimulatorDashboard } from '../../../features/simulator/components/SimulatorDashboard';

type SimulationInsightProps = {
  label: string;
  value: string;
  factorName: SimulatableFactor;
  explanation: string;
  onSimulate: (factor: SimulatableFactor, explanation: string) => void;
};

const SimulationInsight: React.FC<SimulationInsightProps> = ({ label, value, factorName, explanation, onSimulate }) => (
  <View style={styles.insightRow}>
    <Text style={styles.insightText}>
      {label}: <Text style={{ fontWeight: 'normal' }}>{value}</Text>
    </Text>
    <TouchableOpacity style={styles.simulateButton} onPress={() => onSimulate(factorName, explanation)}>
      <Text style={styles.simulateButtonText}>✨ Simular Mejora</Text>
    </TouchableOpacity>
  </View>
);

const factorLabels: Partial<Record<keyof Diagnostics, string>> = {
  bmiComment: 'IMC',
  homaComment: 'Resistencia a la Insulina',
  ovarianReserve: 'Reserva Ovárica',
  cycleComment: 'Ciclo Menstrual',
  tshComment: 'Función Tiroidea (TSH)',
  prolactinComment: 'Prolactina',
  endometriosisComment: 'Endometriosis',
  myomaComment: 'Miomas',
  polypComment: 'Pólipos',
  adenomyosisComment: 'Adenomiosis',
  hsgComment: 'Trompas (HSG)',
  maleFactorDetailed: 'Factor Masculino',
};

type Props = { evaluation: EvaluationState };

export const SimulatorSection: React.FC<Props> = ({ evaluation }) => {
  const [useAdvancedSimulator, setUseAdvancedSimulator] = useState(true);
  const { simulationResult, simulateFactor, simulateAllImprovements } = useFertilitySimulator(evaluation);
  const suboptimalFactors = Object.entries(evaluation.factors).filter(
    ([key, value]) => key !== 'baseAgeProbability' && value < 1.0,
  );

  if (suboptimalFactors.length === 0) return null;

  const toggleSimulator = () => {
    setUseAdvancedSimulator(prev => !prev);
  };

  // 🚀 Usar el nuevo SimulatorDashboard si está activado
  if (useAdvancedSimulator) {
    return (
      <View style={styles.container}>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={toggleSimulator}
          >
            <Text style={styles.toggleText}>
              {useAdvancedSimulator ? '📊 Vista Avanzada' : '📋 Vista Básica'}
            </Text>
          </TouchableOpacity>
        </View>
        <SimulatorDashboard 
          evaluation={evaluation} 
          onModeChange={(mode: string) => console.log('Mode changed:', mode)}
        />
      </View>
    );
  }

  // 🔄 Mantener la implementación original como fallback
  return (
    <>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={toggleSimulator}
        >
          <Text style={styles.toggleText}>
            {useAdvancedSimulator ? '📊 Vista Avanzada' : '📋 Vista Básica'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {simulationResult && (
        <Box style={[styles.card, styles.simulatedCard]}>
          <Text style={styles.title}>✨ Pronóstico Simulado</Text>
          <Text style={styles.simulatedText}>
            Al mejorar tu <Text style={{ fontWeight: 'bold' }}>{simulationResult.explanation}</Text>, tu probabilidad
            podría aumentar de {simulationResult.originalPrognosis.toFixed(1)}% a:
          </Text>
          <Text style={styles.prognosisHighlight}>{simulationResult.newPrognosis.toFixed(1)}%</Text>
          <Text style={styles.improvementText}>(una mejora de +{simulationResult.improvement.toFixed(1)} puntos)</Text>
        </Box>
      )}

      <Box style={styles.card}>
        <Text style={styles.title}>Simulador de Potencial</Text>
        {suboptimalFactors.map(([factorName]) => {
          const diagnosticKey = `${factorName}Comment` as keyof Diagnostics;
          const diagnosticValue =
            evaluation.diagnostics[diagnosticKey] ||
            evaluation.diagnostics[factorName as keyof Diagnostics];

          if (typeof diagnosticValue !== 'string' || !diagnosticValue) return null;

          return (
            <SimulationInsight
              key={factorName}
              label={
                factorLabels[diagnosticKey] ||
                factorLabels[factorName as keyof Diagnostics] ||
                factorName
              }
              value={diagnosticValue}
              factorName={factorName as SimulatableFactor}
              explanation={
                factorLabels[diagnosticKey] ||
                factorLabels[factorName as keyof Diagnostics] ||
                factorName
              }
              onSimulate={simulateFactor}
            />
          );
        })}
        {suboptimalFactors.length > 1 && (
          <TouchableOpacity style={styles.simulateAllButton} onPress={simulateAllImprovements}>
            <Text style={styles.simulateAllButtonText}>🚀 Simular Todas las Mejoras</Text>
          </TouchableOpacity>
        )}
      </Box>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toggleContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  toggleButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  toggleText: {
    color: theme.colors.background,
    fontSize: 14,
    fontWeight: 'bold',
  },
  card: { ...theme.card, padding: theme.spacing.l, marginBottom: theme.spacing.m },
  simulatedCard: {
    backgroundColor: theme.colors.surface,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  title: { ...theme.typography.h3, marginBottom: theme.spacing.m },
  simulatedText: {
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 24,
    color: theme.colors.text,
  },
  prognosisHighlight: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.success,
    textAlign: 'center',
    marginVertical: 8,
  },
  improvementText: {
    fontSize: 14,
    textAlign: 'center',
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  insightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  insightText: { flex: 1, ...theme.typography.bodyBold, paddingRight: theme.spacing.xs },
  simulateButton: {
    paddingHorizontal: theme.spacing.s,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.secondary,
    borderRadius: 15,
  },
  simulateButtonText: { ...theme.typography.small, fontWeight: 'bold', color: theme.colors.buttonText },
  simulateAllButton: {
    marginTop: theme.spacing.m,
    padding: theme.spacing.s,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.card.borderRadius,
    alignItems: 'center',
  },
  simulateAllButtonText: { ...theme.typography.bodyBold, color: theme.colors.buttonText },
});
