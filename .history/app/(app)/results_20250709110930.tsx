import React from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import Box from '@/presentation/components/common/Box';
import Text from '@/presentation/components/common/Text';
import { theme } from '@/config/theme';
import { EvaluationState, SimulatableFactor } from '@/core/domain/models';
import { useFertilitySimulator } from '@/presentation/features/simulator/useFertilitySimulator';

// --- Componente interno para el Simulador ---
type SimulationInsightProps = {
  label: string;
  value: string;
  isSuboptimal: boolean;
  factorName: SimulatableFactor;
  onSimulate: (factor: SimulatableFactor) => void;
};

const SimulationInsight: React.FC<SimulationInsightProps> = ({ label, value, isSuboptimal, factorName, onSimulate }) => (
  <View style={styles.insightRow}>
    <Text style={styles.insightText}>{label}: <Text style={{ fontWeight: 'normal' }}>{value}</Text></Text>
    {isSuboptimal && (
      <TouchableOpacity style={styles.simulateButton} onPress={() => onSimulate(factorName)}>
        <Text style={styles.simulateButtonText}>✨ Simular Mejora</Text>
      </TouchableOpacity>
    )}
  </View>
);

// --- Pantalla Principal de Resultados ---
export default function ResultsScreen() {
  const params = useLocalSearchParams<{ report: string }>();
  const report: EvaluationState | null = params.report ? JSON.parse(params.report) : null;

  // Llamada al nuevo hook del simulador
  const { simulatedPrognosis, simulateFactor } = useFertilitySimulator(report);

  if (!report) {
    return <Box style={styles.container}><ActivityIndicator /></Box>;
  }

  // Devuelve un estilo de color según el pronóstico numérico
  const getPrognosisColor = () => {
    if (!report) return {};
    const value = report.report.numericPrognosis;
    if (value >= 40) return { color: theme.colors.primary };
    if (value >= 20) return { color: theme.colors.secondary };
    return { color: theme.colors.error };
  };

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: 'Tu Informe de Fertilidad' }} />

      {/* --- Card de Resultado Principal --- */}
      <Box style={styles.mainResultCard}>
        <Text style={styles.emoji}>{report.report.emoji}</Text>
        <Text style={[styles.prognosisValue, getPrognosisColor()]}>
          {report.report.numericPrognosis.toFixed(1)}%
        </Text>
        <Text style={styles.prognosisLabel}>Probabilidad por Ciclo</Text>
      </Box>
      
      {/* --- Card de Pronóstico Simulado (aparece cuando se usa el simulador) --- */}
      {simulatedPrognosis !== null && (
        <Box style={[styles.card, styles.simulatedCard]}>
          <Text style={styles.cardTitle}>✨ Pronóstico Simulado</Text>
          <Text style={styles.simulatedText}>
            Con esta mejora, tu probabilidad podría aumentar a: 
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}> {simulatedPrognosis.toFixed(1)}%</Text>
          </Text>
        </Box>
      )}

      {/* --- Card de Insights Clínicos y Simulador --- */}
      <Box style={styles.card}>
        <Text style={styles.cardTitle}>Insights Clínicos y Simulador</Text>
        <SimulationInsight
          label="IMC"
          value={report.diagnostics.bmiComment}
          isSuboptimal={report.factors.bmi < 1.0}
          factorName="bmi"
          onSimulate={simulateFactor}
        />
        <SimulationInsight
          label="Reserva Ovárica"
          value={report.diagnostics.ovarianReserve}
          isSuboptimal={report.factors.amh < 1.0}
          factorName="amh"
          onSimulate={simulateFactor}
        />
        <SimulationInsight
          label="Función Tiroidea (TSH)"
          value={report.diagnostics.tshComment || 'Óptima'}
          isSuboptimal={report.factors.tsh < 1.0}
          factorName="tsh"
          onSimulate={simulateFactor}
        />
        <SimulationInsight
          label="Factor Masculino"
          value={report.diagnostics.maleFactorDetailed}
          isSuboptimal={report.factors.male < 1.0}
          factorName="male"
          onSimulate={simulateFactor}
        />
      </Box>

      {/* ...resto de los componentes (Recomendaciones, Datos Faltantes, etc.) */}
    </ScrollView>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  // ...estilos anteriores...
  insightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  insightText: {
    flex: 1,
    fontWeight: 'bold',
  },
  simulateButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: theme.colors.secondary,
    borderRadius: 15,
  },
  simulateButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  simulatedCard: {
    backgroundColor: theme.colors.primary, // Cambia esto por un color existente, o agrega 'success' a tu theme
    borderColor: theme.colors.primary,
    borderWidth: 1,
  },
  simulatedText: {
    fontSize: 16,
    textAlign: 'center',
  },
  // Añadir los estilos que faltaban del componente original
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.m,
  },
  mainResultCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: theme.spacing.l,
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  emoji: {
    fontSize: 60,
  },
  prognosisValue: {
    fontSize: 72,
    fontWeight: 'bold',
  },
  prognosisLabel: {
    fontSize: 16,
    color: theme.colors.subtleText,
    marginTop: -8,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: theme.spacing.m,
  },
});