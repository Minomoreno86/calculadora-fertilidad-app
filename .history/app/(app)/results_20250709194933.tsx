import React from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import Text from 'src/presentation/components/common/Text';
import Box from 'src/presentation/components/common/Box';
import { theme } from '@/config/theme';
import { EvaluationState, SimulatableFactor } from '@/core/domain/models';
import { useFertilitySimulator } from '@/presentation/features/simulator/useFertilitySimulator';

// --- Componente interno para el Simulador ---
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

// --- Pantalla Principal de Resultados ---
export default function ResultsScreen() {
  const params = useLocalSearchParams<{ report: string }>();
  const report: EvaluationState | null = params.report ? JSON.parse(params.report) : null;

  const { 
    simulatedPrognosis, 
    potentialPrognosis,
    simulationExplanation, 
    simulateFactor, 
    simulateAllImprovements 
  } = useFertilitySimulator(report);

  if (!report) {
    return <Box style={styles.container}><ActivityIndicator size="large" color={theme.colors.primary} /></Box>;
  }

  const suboptimalFactorsCount = Object.values(report.factors).filter(f => f < 1.0 && f > 0.0).length;

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
            <Text style={styles.prognosisHighlight}> {simulatedPrognosis.toFixed(1)}%</Text>.
          </Text>
          
          {potentialPrognosis && potentialPrognosis.toFixed(1) !== simulatedPrognosis.toFixed(1) && (
             <Text style={[styles.simulatedText, {marginTop: 10}]}>
               Si además optimizaras todos los demás factores, podrías alcanzar un potencial total de 
               <Text style={styles.prognosisHighlight}> {potentialPrognosis.toFixed(1)}%</Text>.
             </Text>
          )}
        </Box>
      )}

      <Box style={styles.card}>
        <Text style={styles.cardTitle}>Insights Clínicos y Simulador</Text>
        
        {report.factors.bmi < 1.0 && <SimulationInsight label="IMC" value={report.diagnostics.bmiComment} factorName="bmi" explanation="IMC (llevándolo a un rango normal)" onSimulate={simulateFactor} />}
        {report.factors.homa < 1.0 && <SimulationInsight label="Resistencia a la Insulina" value={report.diagnostics.homaComment} factorName="homa" explanation="índice HOMA-IR (optimizándolo)" onSimulate={simulateFactor} />}
        {report.factors.amh < 1.0 && <SimulationInsight label="Reserva Ovárica (AMH)" value={report.diagnostics.ovarianReserve} factorName="amh" explanation="reserva ovárica (valorándola como óptima)" onSimulate={simulateFactor} />}
        {report.factors.cycle < 1.0 && <SimulationInsight label="Ciclo Menstrual" value={report.diagnostics.cycleComment} factorName="cycle" explanation="regularidad del ciclo" onSimulate={simulateFactor} />}
        {report.factors.tsh < 1.0 && <SimulationInsight label="Función Tiroidea (TSH)" value={report.diagnostics.tshComment} factorName="tsh" explanation="función tiroidea (llevando la TSH a < 2.5)" onSimulate={simulateFactor} />}
        {report.factors.prolactin < 1.0 && <SimulationInsight label="Prolactina" value={report.diagnostics.prolactinComment} factorName="prolactin" explanation="nivel de prolactina (normalizándolo)" onSimulate={simulateFactor} />}
        {report.factors.endometriosis < 1.0 && <SimulationInsight label="Endometriosis" value={report.diagnostics.endometriosisComment} factorName="endometriosis" explanation="endometriosis (sin impacto)" onSimulate={simulateFactor} />}
        {report.factors.myoma < 1.0 && <SimulationInsight label="Miomas" value={report.diagnostics.myomaComment} factorName="myoma" explanation="miomas (sin impacto)" onSimulate={simulateFactor} />}
        {report.factors.polyp < 1.0 && <SimulationInsight label="Pólipos" value={report.diagnostics.polypComment} factorName="polyp" explanation="pólipos (considerando un útero sin pólipos)" onSimulate={simulateFactor} />}
        {report.factors.adenomyosis < 1.0 && <SimulationInsight label="Adenomiosis" value={report.diagnostics.adenomyosisComment} factorName="adenomyosis" explanation="adenomiosis (sin impacto)" onSimulate={simulateFactor} />}
        {report.factors.hsg < 1.0 && report.factors.hsg > 0.0 && <SimulationInsight label="Trompas (HSG)" value={report.diagnostics.hsgComment} factorName="hsg" explanation="permeabilidad de las trompas" onSimulate={simulateFactor} />}
        {report.factors.male < 1.0 && <SimulationInsight label="Factor Masculino" value={report.diagnostics.maleFactorDetailed} factorName="male" explanation="factor masculino (parámetros normales)" onSimulate={simulateFactor} />}
        
        {suboptimalFactorsCount > 1 && (
          <TouchableOpacity style={styles.simulateAllButton} onPress={simulateAllImprovements}>
            <Text style={styles.simulateAllButtonText}>🚀 Simular Todas las Mejoras</Text>
          </TouchableOpacity>
        )}
      </Box>
    </ScrollView>
  );
}

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
  prognosisHighlight: { fontSize: 18, fontWeight: 'bold', color: theme.colors.primary },
  simulateAllButton: { marginTop: 20, padding: 12, backgroundColor: theme.colors.primary, borderRadius: 8, alignItems: 'center' },
  simulateAllButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});