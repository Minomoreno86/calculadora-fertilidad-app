import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Text from '@/presentation/components/common/Text';
import Box from '@/presentation/components/common/Box';
import { EvaluationState, SimulatableFactor } from '@/core/domain/models';
import { useFertilitySimulator } from '@/presentation/features/simulator/useFertilitySimulator';
import { theme } from '@/config/theme';

// --- Componente helper interno ---
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

// --- Componente principal de la sección ---
type Props = { evaluation: EvaluationState };

export const SimulatorSection: React.FC<Props> = ({ evaluation }) => {
  const { simulationResult, simulateFactor, simulateAllImprovements } = useFertilitySimulator(evaluation);
  
  const suboptimalFactors = Object.entries(evaluation.factors).filter(([key, value]) => key !== 'baseAgeProbability' && value < 1.0);

  if (suboptimalFactors.length === 0) {
    return null; // No mostrar el simulador si no hay nada que mejorar
  }

  return (
    <>
      {/* Tarjeta de resultado de simulación */}
      {simulationResult && (
        <Box style={[styles.card, styles.simulatedCard]}>
          <Text style={styles.title}>✨ Pronóstico Simulado</Text>
          <Text style={styles.simulatedText}>
            Al mejorar tu <Text style={{fontWeight: 'bold'}}>{simulationResult.explanation}</Text>, 
            tu probabilidad podría aumentar de {simulationResult.originalPrognosis.toFixed(1)}% a:
          </Text>
          <Text style={styles.prognosisHighlight}> 
            {simulationResult.newPrognosis.toFixed(1)}%
          </Text>
          <Text style={styles.improvementText}>
            (una mejora de +{simulationResult.improvement.toFixed(1)} puntos)
          </Text>
        </Box>
      )}

      {/* Tarjeta con los botones de simulación */}
      <Box style={styles.card}>
        <Text style={styles.title}>Simulador de Potencial</Text>

        {/* --- Renderizado condicional de CADA factor simulable --- */}
        {evaluation.factors.bmi < 1.0 && <SimulationInsight label="IMC" value={evaluation.diagnostics.bmiComment} factorName="bmi" explanation="IMC" onSimulate={simulateFactor} />}
        {evaluation.factors.homa < 1.0 && <SimulationInsight label="Resistencia a la Insulina" value={evaluation.diagnostics.homaComment} factorName="homa" explanation="índice HOMA-IR" onSimulate={simulateFactor} />}
        {evaluation.factors.amh < 1.0 && <SimulationInsight label="Reserva Ovárica" value={evaluation.diagnostics.ovarianReserve} factorName="amh" explanation="reserva ovárica" onSimulate={simulateFactor} />}
        {evaluation.factors.cycle < 1.0 && <SimulationInsight label="Ciclo Menstrual" value={evaluation.diagnostics.cycleComment} factorName="cycle" explanation="regularidad del ciclo" onSimulate={simulateFactor} />}
        {evaluation.factors.tsh < 1.0 && <SimulationInsight label="Función Tiroidea (TSH)" value={evaluation.diagnostics.tshComment} factorName="tsh" explanation="función tiroidea" onSimulate={simulateFactor} />}
        {evaluation.factors.prolactin < 1.0 && <SimulationInsight label="Prolactina" value={evaluation.diagnostics.prolactinComment} factorName="prolactin" explanation="nivel de prolactina" onSimulate={simulateFactor} />}
        {evaluation.factors.endometriosis < 1.0 && <SimulationInsight label="Endometriosis" value={evaluation.diagnostics.endometriosisComment} factorName="endometriosis" explanation="endometriosis" onSimulate={simulateFactor} />}
        {evaluation.factors.myoma < 1.0 && <SimulationInsight label="Miomas" value={evaluation.diagnostics.myomaComment} factorName="myoma" explanation="miomas" onSimulate={simulateFactor} />}
        {evaluation.factors.polyp < 1.0 && <SimulationInsight label="Pólipos" value={evaluation.diagnostics.polypComment} factorName="polyp" explanation="pólipos" onSimulate={simulateFactor} />}
        {evaluation.factors.adenomyosis < 1.0 && <SimulationInsight label="Adenomiosis" value={evaluation.diagnostics.adenomyosisComment} factorName="adenomyosis" explanation="adenomiosis" onSimulate={simulateFactor} />}
        {evaluation.factors.hsg < 1.0 && evaluation.factors.hsg > 0.0 && <SimulationInsight label="Trompas (HSG)" value={evaluation.diagnostics.hsgComment} factorName="hsg" explanation="permeabilidad de las trompas" onSimulate={simulateFactor} />}
        {evaluation.factors.male < 1.0 && <SimulationInsight label="Factor Masculino" value={evaluation.diagnostics.maleFactorDetailed} factorName="male" explanation="factor masculino" onSimulate={simulateFactor} />}

        {/* Botón para simular todas las mejoras */}
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