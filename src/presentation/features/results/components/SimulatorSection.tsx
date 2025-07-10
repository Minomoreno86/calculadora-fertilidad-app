import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Text from '../../../components/common/Text';
import Box from '../../../components/common/Box';
import { EvaluationState, SimulatableFactor, Diagnostics } from '../../../../core/domain/models';
import { useFertilitySimulator } from '../../../features/simulator/useFertilitySimulator';
import { theme } from '../../../../config/theme';

type SimulationInsightProps = {
  label: string;
  value: string;
  factorName: SimulatableFactor;
  explanation: string;
  onSimulate: (factor: SimulatableFactor, explanation: string) => void;
};

const SimulationInsight: React.FC<SimulationInsightProps> = ({ label, value, factorName, explanation, onSimulate }) => (
  <View style={styles.insightRow}>
    <Text style={styles.insightText}>{label}: <Text style={{ fontWeight: 'normal' }}>{value}</Text></Text>
    <TouchableOpacity style={styles.simulateButton} onPress={() => onSimulate(factorName, explanation)}>
      <Text style={styles.simulateButtonText}>✨ Simular Mejora</Text>
    </TouchableOpacity>
  </View>
);

const factorLabels: Partial<Record<keyof Diagnostics, string>> = {
  bmiComment: "IMC",
  homaComment: "Resistencia a la Insulina",
  ovarianReserve: "Reserva Ovárica",
  cycleComment: "Ciclo Menstrual",
  tshComment: "Función Tiroidea (TSH)",
  prolactinComment: "Prolactina",
  endometriosisComment: "Endometriosis",
  myomaComment: "Miomas",
  polypComment: "Pólipos",
  adenomyosisComment: "Adenomiosis",
  hsgComment: "Trompas (HSG)",
  maleFactorDetailed: "Factor Masculino"
};

type Props = { evaluation: EvaluationState };

export const SimulatorSection: React.FC<Props> = ({ evaluation }) => {
  const { simulationResult, simulateFactor, simulateAllImprovements } = useFertilitySimulator(evaluation);
  const suboptimalFactors = Object.entries(evaluation.factors).filter(([key, value]) => key !== 'baseAgeProbability' && value < 1.0);

  if (suboptimalFactors.length === 0) return null;

  return (
    <>
      {simulationResult && (
        <Box style={[styles.card, styles.simulatedCard]}>
          <Text style={styles.title}>✨ Pronóstico Simulado</Text>
          <Text style={styles.simulatedText}>
            Al mejorar tu <Text style={{fontWeight: 'bold'}}>{simulationResult.explanation}</Text>, 
            tu probabilidad podría aumentar de {simulationResult.originalPrognosis.toFixed(1)}% a:
          </Text>
          <Text style={styles.prognosisHighlight}>{simulationResult.newPrognosis.toFixed(1)}%</Text>
          <Text style={styles.improvementText}>(una mejora de +{simulationResult.improvement.toFixed(1)} puntos)</Text>
        </Box>
      )}

      <Box style={styles.card}>
        <Text style={styles.title}>Simulador de Potencial</Text>
        {suboptimalFactors.map(([factorName]) => {
          const diagnosticKey = `${factorName}Comment` as keyof Diagnostics;
          const diagnosticValue = evaluation.diagnostics[diagnosticKey as keyof Diagnostics] || evaluation.diagnostics[factorName as keyof Diagnostics];
          
          if (typeof diagnosticValue !== 'string' || !diagnosticValue) return null;

          return (
            <SimulationInsight
              key={factorName}
              label={factorLabels[diagnosticKey as keyof Diagnostics] || factorLabels[factorName as keyof Diagnostics] || factorName}
              value={diagnosticValue}
              factorName={factorName as SimulatableFactor}
              explanation={factorLabels[diagnosticKey as keyof Diagnostics] || factorLabels[factorName as keyof Diagnostics] || factorName}
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
    card: { padding: 16, borderRadius: 12, backgroundColor: '#FFFFFF', marginBottom: 16 },
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
    insightRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    insightText: { flex: 1, fontWeight: 'bold', paddingRight: 8 },
    simulateButton: { paddingHorizontal: 10, paddingVertical: 6, backgroundColor: theme.colors.secondary, borderRadius: 15 },
    simulateButtonText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
    simulatedCard: { backgroundColor: '#E6F4EA', borderColor: theme.colors.primary, borderWidth: 1 },
    simulatedText: { fontSize: 16, textAlign: 'center', lineHeight: 24 },
    prognosisHighlight: { fontSize: 24, fontWeight: 'bold', color: theme.colors.primary, textAlign: 'center', marginVertical: 8 },
    improvementText: { fontSize: 14, fontStyle: 'italic', textAlign: 'center', color: theme.colors.subtleText },
    simulateAllButton: { marginTop: 20, padding: 12, backgroundColor: theme.colors.primary, borderRadius: 8, alignItems: 'center' },
    simulateAllButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});