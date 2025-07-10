import React from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { EvaluationState, ClinicalFinding } from '../../../core/domain/models';
// Importamos los nuevos componentes
import { PrognosisCard } from './components/PrognosisCard';
import { BenchmarkCard } from './components/BenchmarkCard';
import { FindingsSection } from './components/FindingsSection';
import { SimulatorSection } from './components/SimulatorSection';
import { TreatmentCard } from './components/TreatmentCard';
import { suggestTreatments } from '../../../core/domain/services/treatmentSuggester';

export default function ResultsScreen() {
  const params = useLocalSearchParams<{ report: string }>();
  const evaluation: EvaluationState | null = params.report ? JSON.parse(params.report) : null;

  if (!evaluation) {
    return <ActivityIndicator />;
  }

  const treatmentSuggestions = suggestTreatments(evaluation);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <Stack.Screen options={{ title: 'Tu Informe de Fertilidad' }} />

      {/* Cada sección es ahora un componente limpio */}
      <PrognosisCard reportData={evaluation.report} />
      <BenchmarkCard reportData={evaluation.report} />
      <FindingsSection findings={evaluation.report.clinicalInsights.map((insight: ClinicalFinding, idx: number) => ({
        key: `finding-${idx}`,
        title: insight.title ?? `Hallazgo ${idx + 1}`,
        description: '', // 'description' does not exist on ClinicalFinding
        explanation: insight.explanation ?? '',
        recommendations: insight.recommendations ?? [],
      }))} />
      <SimulatorSection evaluation={evaluation} />
      <TreatmentCard suggestions={treatmentSuggestions} />

    </ScrollView>
  );
}