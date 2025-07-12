// src/app/results.tsx
import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';

// Importar el nuevo hook de carga de reportes
import { useReportLoader } from '@/presentation/features/results/hooks/useReportLoader'; // Ajusta la ruta si es necesario

// Importar el nuevo componente de display de resultados
import { ResultsDisplay } from '@/presentation/features/results/components/ResultsDisplay'; // Ajusta la ruta si es necesario

// Importar los sugeridores de tratamiento (base y premium)
import { suggestTreatments } from '@/core/domain/services/treatmentSuggester'; // Sugeridor base
import { suggestTreatmentsPremium } from '@/core/domain/services/treatmentSuggesterPremium'; // Sugeridor premium

import Text from '@/presentation/components/common/Text'; // Ruta a tu componente Text
import { theme } from '@/config/theme'; // Ruta a tu tema

// --- Pantalla Principal de Resultados ---
export default function ResultsScreen() {
  const params = useLocalSearchParams();
  const { evaluation, loading, error, isPremiumReport } = useReportLoader(params.reportKey); // Usar el nuevo hook

  // Definir qué sugeridor de tratamiento usar.
  // Por ahora, asumimos que si llegamos aquí, queremos el premium.
  // En una fase posterior, esto podría basarse en la suscripción del usuario o un parámetro.
  const treatmentSuggester = suggestTreatmentsPremium; // Usar el sugeridor PREMIUM

  // Estado de carga o error
  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Cargando tu informe...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.loadingText}>Error al cargar el informe: {error}</Text>
        <Text style={styles.loadingText}>Por favor, inténtalo de nuevo desde la pantalla de la calculadora.</Text>
      </View>
    );
  }

  if (!evaluation) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.loadingText}>No se pudo cargar el informe. Por favor, inténtalo de nuevo.</Text>
      </View>
    );
  }

  // Si no hay errores y la evaluación está disponible, calculamos las sugerencias
  const treatmentSuggestions = treatmentSuggester(evaluation);

  return (
    // Stack.Screen se mueve aquí si se quiere cambiar el título dinámicamente,
    // o se puede mantener en _layout.tsx si el título es estático.
    <View style={styles.fullScreenContainer}>
      <Stack.Screen options={{ title: 'Tu Informe de Fertilidad' }} />
      {/* Pasar la evaluación completa al componente ResultsDisplay */}
      <ResultsDisplay
        evaluation={evaluation}
        treatmentSuggestions={treatmentSuggestions}
        isPremiumReport={isPremiumReport}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: 16,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.text,
    textAlign: 'center',
  },
});