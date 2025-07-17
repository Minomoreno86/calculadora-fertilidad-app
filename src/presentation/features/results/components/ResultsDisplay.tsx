// src/presentation/features/results/components/ResultsDisplay.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { EvaluationState, TreatmentSuggestion } from '@/core/domain/models'; // Importa EvaluationState y TreatmentSuggestion

// Importación de componentes de UI reutilizables
import Accordion from '@/presentation/components/common/Accordion'; // Asegúrate de que esta ruta sea correcta
import { PrognosisCard } from './PrognosisCard'; // Ruta relativa, ya que estarán en la misma carpeta
import { BenchmarkCard } from './BenchmarkCard'; // Ruta relativa
import { SimulatorSection } from './SimulatorSection'; // Ruta relativa
import { FindingsSection } from './FindingsSection'; // Ruta relativa
import { TreatmentCard } from './TreatmentCard'; // Ruta relativa
import { useDynamicTheme } from '../../../../hooks/useDynamicTheme';


interface ResultsDisplayProps {
  evaluation: EvaluationState;
  treatmentSuggestions: TreatmentSuggestion[];
  isPremiumReport: boolean;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ evaluation, treatmentSuggestions, isPremiumReport }) => {
  // 🎨 TEMA DINÁMICO
  const theme = useDynamicTheme();
  const styles = createStyles(theme);
  
  const { report } = evaluation;

  return (
    <View style={styles.container}>
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
    </View>
  );
};

// 🎨 Función para crear estilos dinámicos
const createStyles = (theme: ReturnType<typeof useDynamicTheme>) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    gap: 16, // Espaciado entre componentes
  },
});