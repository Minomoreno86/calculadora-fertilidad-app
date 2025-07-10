import React from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { EvaluationState, SimulatableFactor, Diagnostics } from 'src/core/domain/models';
import { suggestTreatments } from 'src/core/domain/services/treatmentSuggester';
import { useFertilitySimulator } from 'src/presentation/features/simulator/useFertilitySimulator';
import { theme } from 'src/config/theme';
import Text from 'src/presentation/components/common/Text';
import Box from 'src/presentation/components/common/Box';

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
  const evaluation: EvaluationState | null = params.report ? JSON.parse(params.report) : null;

  const { 
    simulationResult, 
    simulateFactor, 
    simulateAllImprovements 
  } = useFertilitySimulator(evaluation);

  if (!evaluation) {
    return <ActivityIndicator style={styles.loader} size="large" color={theme.colors.primary} />;
  }

  const { report, factors, diagnostics } = evaluation;
  const suboptimalFactors = Object.entries(factors).filter(([key, value]) => key !== 'baseAgeProbability' && value < 1.0);
  const treatmentSuggestions = suggestTreatments(evaluation);
  const getPrognosisColor = () => {
    if (report.category === 'BUENO') return theme.colors.primary;
    if (report.category === 'MODERADO') return theme.colors.secondary;
    return theme.colors.error;
  };

  // Mapa para mostrar etiquetas amigables en la UI
  const factorLabels: Partial<Record<keyof Factors, string>> = {
    bmi: "IMC",
    homa: "Resistencia a la Insulina",
    amh: "Reserva Ovárica",
    cycle: "Ciclo Menstrual",
    tsh: "Función Tiroidea (TSH)",
    prolactin: "Prolactina",
    endometriosis: "Endometriosis",
    myoma: "Miomas",
    polyp: "Pólipos",
    adenomyosis: "Adenomiosis",
    hsg: "Trompas de Falopio",
    male: "Factor Masculino",
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Stack.Screen options={{ title: 'Tu Informe de Fertilidad' }} />

      {/* --- Card de Resultado Principal --- */}
      <Box style={styles.mainResultCard}>
        <Text style={styles.emoji}>{report.emoji}</Text>
        <Text style={[styles.prognosisValue, { color: getPrognosisColor() }]}>
          {report.numericPrognosis.toFixed(1)}%
        </Text>
        <Text style={styles.prognosisLabel}>Probabilidad por Ciclo</Text>
      </Box>
      
      {/* --- Card de Pronóstico Simulado --- */}
      {simulationResult && (
        <Box style={[styles.card, styles.simulatedCard]}>
          <Text style={styles.cardTitle}>✨ Pronóstico Simulado</Text>
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

      {/* --- Card de Hallazgos y Simulador --- */}
      <Box style={styles.card}>
        <Text style={styles.cardTitle}>Insights Clínicos y Simulador</Text>
        {suboptimalFactors.length > 0 ? (
          suboptimalFactors.map(([factorName]) => {
            const label = factorLabels[factorName as keyof Factors] || factorName;
            const value = diagnostics[factorName as keyof Diagnostics] || 'Afectado';

            if(typeof value !== 'string') return null; // Previene renderizar `missingData`

            return (
              <SimulationInsight
                key={factorName}
                label={label}
                value={value}
                factorName={factorName as SimulatableFactor}
                explanation={label}
                onSimulate={simulateFactor}
              />
            )
          })
        ) : (
          <Text>No se encontraron factores de riesgo modificables en tu perfil.</Text>
        )}
        
        {suboptimalFactors.length > 1 && (
          <TouchableOpacity style={styles.simulateAllButton} onPress={simulateAllImprovements}>
            <Text style={styles.simulateAllButtonText}>🚀 Simular Todas las Mejoras</Text>
          </TouchableOpacity>
        )}
      </Box>
      
      {/* --- Aquí irían las otras tarjetas como FindingsSection y TreatmentCard --- */}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f8', padding: 16 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  mainResultCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 16 },
  emoji: { fontSize: 60 },
  prognosisValue: { fontSize: 72, fontWeight: 'bold' },
  prognosisLabel: { fontSize: 16, color: '#666', marginTop: -8 },
  card: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 16 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  insightRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  insightText: { flex: 1, fontWeight: 'bold', paddingRight: 8 },
  simulateButton: { paddingHorizontal: 10, paddingVertical: 6, backgroundColor: theme.colors.secondary, borderRadius: 15 },
  simulateButtonText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  simulatedCard: { backgroundColor: '#E6F4EA', borderColor: theme.colors.primary, borderWidth: 1 },
  simulatedText: { fontSize: 16, textAlign: 'center', lineHeight: 24 },
  prognosisHighlight: { fontSize: 24, fontWeight: 'bold', color: theme.colors.primary, textAlign: 'center', marginVertical: 8 },
  improvementText: { fontSize: 14, fontStyle: 'italic', textAlign: 'center', color: '#555' },
  simulateAllButton: { marginTop: 20, padding: 12, backgroundColor: theme.colors.primary, borderRadius: 8, alignItems: 'center' },
  simulateAllButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});