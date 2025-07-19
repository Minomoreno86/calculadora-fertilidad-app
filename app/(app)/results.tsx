// 🚀 RESULTS SCREEN - VERSIÓN LIMPIA Y PROFESIONAL
import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';

// 🎯 COMPONENTES ESENCIALES
import { useReportLoader } from '@/presentation/features/results/hooks/useReportLoader';
import { ResultsDisplay } from '@/presentation/features/results/components/ResultsDisplay';
import { suggestTreatments } from '@/core/domain/services/treatmentSuggester';

import Text from '@/presentation/components/common/Text';
import { useDynamicTheme } from '@/hooks/useDynamicTheme';

export default function ResultsScreen() {
  const params = useLocalSearchParams();
  const theme = useDynamicTheme();
  
  // 🎯 VALIDACIÓN SIMPLE Y LIMPIA
  const reportKeyParam = params.reportKey;
  console.log('🔍 ResultsScreen: Received params:', { reportKey: reportKeyParam });
  
  const { evaluation, loading, error, isPremiumReport } = useReportLoader(reportKeyParam);

  // 🎨 Crear estilos dinámicos
  const styles = createStyles(theme);

  // 🔄 ESTADOS DE CARGA
  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <Stack.Screen options={{ title: 'Cargando Informe...' }} />
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Generando tu análisis de fertilidad...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Stack.Screen options={{ title: 'Error' }} />
        <Text style={styles.errorText}>❌ Error al cargar el informe</Text>
        <Text style={styles.errorDetails}>{error}</Text>
        <Text style={styles.helpText}>
          Por favor, regresa a la calculadora e intenta nuevamente.
        </Text>
      </View>
    );
  }

  if (!evaluation) {
    return (
      <View style={styles.centeredContainer}>
        <Stack.Screen options={{ title: 'Sin Datos' }} />
        <Text style={styles.errorText}>❌ No se encontró el informe</Text>
        <Text style={styles.helpText}>
          Por favor, genera un nuevo informe desde la calculadora.
        </Text>
      </View>
    );
  }

  // 🎯 CÁLCULO DE SUGERENCIAS (SOLO UNA VEZ)
  const treatmentSuggestions = suggestTreatments(evaluation);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Tu Informe de Fertilidad' }} />
      
      {/* 🎯 COMPONENTE PRINCIPAL - TODO EN UNO */}
      <ResultsDisplay
        evaluation={evaluation}
        treatmentSuggestions={treatmentSuggestions}
        isPremiumReport={isPremiumReport}
      />
    </View>
  );
}

// 🎨 ESTILOS MINIMALISTAS
const createStyles = (theme: ReturnType<typeof useDynamicTheme>) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.text,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.error,
    textAlign: 'center',
    marginBottom: 12,
  },
  errorDetails: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  helpText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});