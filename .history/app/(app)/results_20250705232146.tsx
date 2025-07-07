import { StyleSheet, ScrollView, View } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import Box from '../../src/presentation/components/common/Box';
import Text from '../../src/presentation/components/common/Text';
import { theme } from '../../src/config/theme';
import { EvaluationState } from '../../src/core/domain/models';

export default function ResultsScreen() {
  const params = useLocalSearchParams<{ report: string }>();

  let report: EvaluationState | null = null;
  try {
    // 1. Recibimos el informe (que llega como un string JSON) y lo parseamos
    if (params.report) {
      report = JSON.parse(params.report);
    }
  } catch (e) {
    console.error("Error al parsear el informe de resultados:", e);
  }

  // Si no hay reporte, mostramos un mensaje de error
  if (!report) {
    return (
      <Box style={styles.container}>
        <Text>Error al cargar el resultado. Por favor, intente de nuevo.</Text>
      </Box>
    );
  }
  
  // Asignamos un color según la categoría del pronóstico
  const getPronosisColor = () => {
    if (report?.pronostico_categoria === 'BUENO') return styles.prognosisGood;
    if (report?.pronostico_categoria === 'MODERADO') return styles.prognosisModerate;
    return styles.prognosisLow;
  };

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: 'Tu Informe de Fertilidad' }}/>

      <Box style={styles.mainResultCard}>
        <Text style={styles.emoji}>{report.pronostico_emoji}</Text>
        <Text style={[styles.prognosisValue, getPronosisColor()]}>
          {(report.pronostico_numerico).toFixed(1)}%
        </Text>
        <Text style={styles.prognosisLabel}>Probabilidad por Ciclo</Text>
        <Text style={[styles.prognosisCategory, getPronosisColor()]}>{report.pronostico_categoria}</Text>
      </Box>

      <Box style={styles.card}>
        <Text style={styles.benchmarkText}>{report.benchmark_frase}</Text>
      </Box>

      {report.recomendaciones_lista && report.recomendaciones_lista.length > 0 && (
        <Box style={styles.card}>
          <Text style={styles.cardTitle}>Recomendaciones Personalizadas</Text>
          {report.recomendaciones_lista.map((rec, index) => (
            <View key={index} style={styles.recommendationItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.recommendationText}>{rec}</Text>
            </View>
          ))}
        </Box>
      )}

      {report.datos_faltantes && report.datos_faltantes.length > 0 && (
        <Box style={[styles.card, styles.missingDataCard]}>
          <Text style={styles.cardTitle}>Datos Faltantes</Text>
          <Text style={styles.missingDataText}>
            Para un resultado más preciso, considere añadir: {report.datos_faltantes.join(', ')}.
          </Text>
        </Box>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
  prognosisCategory: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 8,
    textTransform: 'uppercase',
  },
  prognosisGood: { color: '#28a745' },
  prognosisModerate: { color: '#ffc107' },
  prognosisLow: { color: '#dc3545' },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
  },
  benchmarkText: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: theme.spacing.m,
  },
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.s,
  },
  bulletPoint: {
    marginRight: theme.spacing.s,
    fontSize: 16,
    lineHeight: 24,
  },
  recommendationText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
  missingDataCard: {
    backgroundColor: '#fffbe6',
    borderColor: '#ffe58f',
    borderWidth: 1,
  },
  missingDataText: {
    fontSize: 16,
  }
});