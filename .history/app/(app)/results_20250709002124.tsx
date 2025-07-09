import { StyleSheet, ScrollView, View } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import Box from '../../src/presentation/components/common/Box';
import Text from '../../src/presentation/components/common/Text';
import { theme } from '../../src/config/theme';
import { EvaluationState } from '../../src/core/domain/models';

// Los estilos no necesitan cambios. Los incluyo por completitud.
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
  prognosisGood: { color: theme.colors.primary },
  prognosisModerate: { color: theme.colors.secondary },
  prognosisLow: { color: theme.colors.error },
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
  },
});


export default function ResultsScreen() {
  const params = useLocalSearchParams<{ report: string }>();

  let report: EvaluationState | null = null;
  try {
    if (params.report) {
      report = JSON.parse(params.report);
    }
  } catch (e) {
    console.error("Error al parsear el informe de resultados:", e);
  }

  if (!report) {
    return (
      <Box style={styles.container}>
        <Text>Error al cargar el resultado. Por favor, intente de nuevo.</Text>
      </Box>
    );
  }

  const getPrognosisColor = () => {
    // CORRECCIÓN: Acceder a report.report.category
    if (report?.report.category === 'BUENO') return styles.prognosisGood;
    if (report?.report.category === 'MODERADO') return styles.prognosisModerate;
    return styles.prognosisLow;
  };

  const renderRecomendaciones = () => {
    // CORRECCIÓN: Acceder a report.report.recommendations
    if (!report?.report.recommendations?.length) return null;
    return (
      <Box style={styles.card}>
        <Text style={styles.cardTitle}>Recomendaciones Personalizadas</Text>
        {report.report.recommendations.map((rec) => (
          <View key={rec} style={styles.recommendationItem}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.recommendationText}>{rec}</Text>
          </View>
        ))}
      </Box>
    );
  };

  const renderDatosFaltantes = () => {
    // CORRECCIÓN: Acceder a report.diagnostics.missingData
    if (!report?.diagnostics.missingData?.length) return null;
    return (
      <Box style={[styles.card, styles.missingDataCard]}>
        <Text style={styles.cardTitle}>Datos Faltantes</Text>
        <Text style={styles.missingDataText}>
          Para un resultado más preciso, considere añadir: {report.diagnostics.missingData.join(', ')}.
        </Text>
      </Box>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: 'Tu Informe de Fertilidad' }} />

      <Box style={styles.mainResultCard}>
        {/* CORRECCIÓN: Acceder a las propiedades dentro de report.report */}
        <Text style={styles.emoji}>{report.report.emoji}</Text>
        <Text style={[styles.prognosisValue, getPrognosisColor()]}>
          {typeof report.report.numericPrognosis === 'number'
            ? `${report.report.numericPrognosis.toFixed(1)}%`
            : '--'}
        </Text>
        <Text style={styles.prognosisLabel}>Probabilidad por Ciclo</Text>
        <Text style={[styles.prognosisCategory, getPrognosisColor()]}>
          {report.report.category}
        </Text>
      </Box>

      <Box style={styles.card}>
        {/* CORRECCIÓN: Acceder a report.report.benchmarkPhrase */}
        <Text style={styles.benchmarkText}>{report.report.benchmarkPhrase}</Text>
      </Box>

      {renderRecomendaciones()}
      {renderDatosFaltantes()}
    </ScrollView>
  );
}