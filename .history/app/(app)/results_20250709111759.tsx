import React from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import Box from '@/presentation/components/common/Box';
import Text from '@/presentation/components/common/Text';
import { theme } from '@/config/theme';
import { EvaluationState, SimulatableFactor } from '@/core/domain/models';
import { useFertilitySimulator } from '@/presentation/features/simulator/useFertilitySimulator';

// --- Componente interno para el Simulador (Actualizado para pasar la explicación) ---
type SimulationInsightProps = {
  label: string;
  value: string;
  isSuboptimal: boolean;
  factorName: SimulatableFactor;
  explanation: string;
  onSimulate: (factor: SimulatableFactor, explanation: string) => void;
};

const SimulationInsight: React.FC<SimulationInsightProps> = ({ label, value, isSuboptimal, factorName, explanation, onSimulate }) => (
  <View style={styles.insightRow}>
    <Text style={styles.insightText}>{label}: <Text style={{ fontWeight: 'normal' }}>{value}</Text></Text>
    {isSuboptimal && (
      <TouchableOpacity style={styles.simulateButton} onPress={() => onSimulate(factorName, explanation)}>
        <Text style={styles.simulateButtonText}>✨ Simular Mejora</Text>
      </TouchableOpacity>
    )}
  </View>
);

// --- Pantalla Principal de Resultados ---
export default function ResultsScreen() {
  const params = useLocalSearchParams<{ report: string }>();
  const report: EvaluationState | null = params.report ? JSON.parse(params.report) : null;

  // Llamada al hook actualizado con la nueva lógica
  const { simulatedPrognosis, simulationExplanation, simulateFactor, simulateAllImprovements } = useFertilitySimulator(report);

  if (!report) {
    return <Box style={styles.container}><ActivityIndicator /></Box>;
  }

  // Calculamos cuántos factores se pueden mejorar para mostrar el botón "Simular Todo"
  const suboptimalFactorsCount = Object.values(report.factors).filter(f => f < 1.0 && f > 0.0).length;

  // La función de color ahora usa la prop `style` directamente, no es necesario cambiarla.
  const getPrognosisColor = () => {
    const value = report.report.numericPrognosis;
    if (value >= 15) return theme.colors.primary;
    if (value >= 5) return theme.colors.secondary;
    return theme.colors.error;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Stack.Screen options={{ title: 'Tu Informe de Fertilidad' }} />

      <Box style={styles.mainResultCard}>
        <Text style={styles.emoji}>{report.report.emoji}</Text>
        <Text style={[styles.prognosisValue, { color: getPrognosisColor() }]}>
          {report.report.numericPrognosis.toFixed(1)}%
        </Text>
        <Text style={styles.prognosisLabel}>Probabilidad por Ciclo</Text>
      </Box>
      
      {simulatedPrognosis !== null && simulationExplanation && (
        <Box style={[styles.card, styles.simulatedCard]}>
          <Text style={styles.cardTitle}>✨ Pronóstico Simulado</Text>
          <Text style={styles.simulatedText}>
            Al mejorar tu <Text style={{fontWeight: 'bold'}}>{simulationExplanation}</Text>, tu probabilidad podría aumentar a: 
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}> {simulatedPrognosis.toFixed(1)}%</Text>
          </Text>
        </Box>
      )}

      <Box style={styles.card}>
        <Text style={styles.cardTitle}>Insights Clínicos y Simulador</Text>
        <SimulationInsight
          label="IMC"
          value={report.diagnostics.bmiComment}
          isSuboptimal={report.factors.bmi < 1.0}
          factorName="bmi"
          explanation="IMC (llevándolo a un rango normal)"
          onSimulate={simulateFactor}
        />
        <SimulationInsight
          label="Reserva Ovárica"
          value={report.diagnostics.ovarianReserve}
          isSuboptimal={report.factors.amh < 1.0}
          factorName="amh"
          explanation="reserva ovárica (valorándola como óptima)"
          onSimulate={simulateFactor}
        />
        <SimulationInsight
          label="Función Tiroidea (TSH)"
          value={report.diagnostics.tshComment || 'Óptima'}
          isSuboptimal={report.factors.tsh < 1.0}
          factorName="tsh"
          explanation="función tiroidea (llevando la TSH a < 2.5)"
          onSimulate={simulateFactor}
        />
        <SimulationInsight
          label="Factor Masculino"
          value={report.diagnostics.maleFactorDetailed}
          isSuboptimal={report.factors.male < 1.0}
          factorName="male"
          explanation="factor masculino (asumiendo parámetros normales)"
          onSimulate={simulateFactor}
        />
        
        {suboptimalFactorsCount > 1 && (
          <TouchableOpacity style={styles.simulateAllButton} onPress={simulateAllImprovements}>
            <Text style={styles.simulateAllButtonText}>🚀 Simular Todas las Mejoras</Text>
          </TouchableOpacity>
        )}
      </Box>

    </ScrollView>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: theme.spacing.m },
  mainResultCard: { backgroundColor: theme.colors.card, borderRadius: 16, padding: theme.spacing.l, alignItems: 'center', marginBottom: theme.spacing.m },
  emoji: { fontSize: 60 },
  prognosisValue: { fontSize: 72, fontWeight: 'bold' },
  prognosisLabel: { fontSize: 16, color: theme.colors.subtleText, marginTop: -8 },
  card: { backgroundColor: theme.colors.card, borderRadius: 12, padding: theme.spacing.m, marginBottom: theme.spacing.m },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: theme.spacing.m },
  insightRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  insightText: { flex: 1, fontWeight: 'bold', paddingRight: 8 },
  simulateButton: { paddingHorizontal: 10, paddingVertical: 6, backgroundColor: theme.colors.secondary, borderRadius: 15 },
  simulateButtonText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  simulatedCard: { backgroundColor: '#E6F4EA', borderColor: theme.colors.primary, borderWidth: 1 },
  simulatedText: { fontSize: 16, textAlign: 'center', lineHeight: 24 },
  simulateAllButton: { marginTop: 20, padding: 12, backgroundColor: theme.colors.primary, borderRadius: 8, alignItems: 'center' },
  simulateAllButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});