// src/presentation/features/results/components/ResultsDisplay.tsx
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { EvaluationState, TreatmentSuggestion } from '@/core/domain/models'; // Importa EvaluationState y TreatmentSuggestion

// Importación de componentes de UI reutilizables
import Accordion from '@/presentation/components/common/Accordion'; // Asegúrate de que esta ruta sea correcta
import { PrognosisCard } from './PrognosisCard'; // Ruta relativa, ya que estarán en la misma carpeta
import { BenchmarkCard } from './BenchmarkCard'; // Ruta relativa
import { SimulatorSection } from './SimulatorSection'; // Ruta relativa
import { FindingsSection } from './FindingsSection'; // Ruta relativa
import { TreatmentCard } from './TreatmentCard'; // Ruta relativa
import { theme } from '@/config/theme'; // Importa el tema


interface ResultsDisplayProps {
  evaluation: EvaluationState;
  treatmentSuggestions: TreatmentSuggestion[];
  isPremiumReport: boolean;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ evaluation, treatmentSuggestions, isPremiumReport }) => {
  const { report } = evaluation;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* --- Card de Resultado Principal --- */}
      <PrognosisCard report={report} />

      {/* --- Card de Benchmark --- */}
      <BenchmarkCard report={report} />

      {/* --- Sección del Simulador de Potencial (solo para informes no premium) --- */}
      {!isPremiumReport && (
        <Accordion title="Simulador de Potencial">
          <SimulatorSection evaluation={evaluation} />
        </Accordion>
      )}

      {/* --- Sección de Hallazgos Clínicos --- */}
      {/* Aquí, report.clinicalInsights ya viene preparado por reportGeneratorPremium.ts */}
      {report.clinicalInsights && report.clinicalInsights.length > 0 && (
        <Accordion title="Hallazgos y Recomendaciones">
          <FindingsSection findings={report.clinicalInsights} />
        </Accordion>
      )}
       {/* --- Sección de Sugerencias de Siguientes Pasos --- */}
      {/* Las sugerencias de tratamiento ya vienen calculadas por suggestTreatmentsPremium.ts */}
      {treatmentSuggestions && treatmentSuggestions.length > 0 && (
        <Accordion title="Sugerencias de Siguientes Pasos">
          <TreatmentCard suggestions={treatmentSuggestions} />
        </Accordion>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
});