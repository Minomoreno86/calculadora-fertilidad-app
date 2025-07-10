import React from 'react';
import { ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';

// --- IMPORTACIONES CORREGIDAS ---
import { EvaluationState } from '../../../core/domain/models';
import { suggestTreatments } from '../../../core/domain/services/treatmentSuggester';
import { PrognosisCard } from './components/PrognosisCard';
import { BenchmarkCard } from './components/BenchmarkCard';
import { FindingsSection } from './components/FindingsSection';
import { SimulatorSection } from './components/SimulatorSection';
import { TreatmentCard } from './components/TreatmentCard';
import { theme } from '../../../config/theme';

export default function ResultsScreen() {
  const params = useLocalSearchParams<{ report: string }>();
  const evaluation: EvaluationState | null = params.report ? JSON.parse(params.report) : null;

  if (!evaluation) {
    return <ActivityIndicator style={styles.loader} size="large" color={theme.colors.primary} />;
  }
  
  const treatmentSuggestions = suggestTreatments(evaluation);

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: 'Tu Informe de Fertilidad' }} />
      <PrognosisCard reportData={evaluation.report} />
      <BenchmarkCard reportData={evaluation.report} />
      <FindingsSection findings={evaluation.report.clinicalInsights} />
      <SimulatorSection evaluation={evaluation} />
     <TreatmentCard suggestions={treatmentSuggestions} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f8',
    paddingHorizontal: 8,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});