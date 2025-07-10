import React from 'react';
import { StyleSheet, ScrollView, View, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { EvaluationState } from 'src/core/domain/models';
import { suggestTreatments } from 'src/core/domain/services/treatmentSuggester';
import { theme } from 'src/config/theme';

// Importación de componentes de UI reutilizables
import Text from 'src/presentation/components/common/Text';
import Accordion from 'src/presentation/components/common/Accordion'; // Importar el nuevo componente Accordion
import { PrognosisCard } from 'src/presentation/features/results/components/PrognosisCard';
import { BenchmarkCard } from 'src/presentation/features/results/components/BenchmarkCard';
import { SimulatorSection } from 'src/presentation/features/results/components/SimulatorSection';
import { FindingsSection } from 'src/presentation/features/results/components/FindingsSection';
import { TreatmentCard } from 'src/presentation/features/results/components/TreatmentCard';

// --- Pantalla Principal de Resultados ---
export default function ResultsScreen() {
  const params = useLocalSearchParams<{ report: string }>();

  // Parseo de datos con manejo de errores básico
  let evaluation: EvaluationState | null = null;
  try {
    if (params.report) {
      evaluation = JSON.parse(params.report);
    }
  } catch (error) {
    console.error('Error parsing evaluation report:', error);
    // Opcional: podrías navegar hacia atrás o mostrar un mensaje de error
  }

  // Estado de carga o error
  if (!evaluation) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Cargando tu informe...</Text>
      </View>
    );
  }

  const { report } = evaluation;
  const treatmentSuggestions = suggestTreatments(evaluation);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Stack.Screen options={{ title: 'Tu Informe de Fertilidad' }} />

      {/* --- Card de Resultado Principal --- */}
      <PrognosisCard report={report} />

      {/* --- Card de Benchmark --- */}
      <BenchmarkCard report={report} />

      {/* --- Sección del Simulador de Potencial --- */}
      <Accordion title="Simulador de Potencial">
        <SimulatorSection evaluation={evaluation} />
      </Accordion>

      {/* --- Sección de Hallazgos Clínicos --- */}
      {report.clinicalInsights && report.clinicalInsights.length > 0 && (
        <Accordion title="Hallazgos y Recomendaciones">
          <FindingsSection findings={report.clinicalInsights} />
        </Accordion>
      )}

      {/* --- Sección de Sugerencias de Tratamiento --- */}
      {treatmentSuggestions && treatmentSuggestions.length > 0 && (
        <Accordion title="Sugerencias de Siguientes Pasos">
          <TreatmentCard suggestions={treatmentSuggestions} />
        </Accordion>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: theme.colors.text,
  },
});
