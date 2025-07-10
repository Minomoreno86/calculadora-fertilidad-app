import React from 'react';
import { StyleSheet } from 'react-native';
import Text from '../../../components/common/Text';
import Box from '../../../components/common/Box';
import { Report } from '../../../../core/domain/models';
import { theme } from '../../../../config/theme';

type Props = { report: Report };

export const PrognosisCard: React.FC<Props> = ({ report }) => {
  const getPrognosisColor = () => {
    if (report.category === 'BUENO') return theme.colors.primary;
    if (report.category === 'MODERADO') return theme.colors.secondary;
    return theme.colors.error;
  };

  return (
    <Box style={styles.mainResultCard}>
      <Text style={styles.emoji}>{report.emoji}</Text>
      <Text style={[styles.prognosisValue, { color: getPrognosisColor() }]}>
        {report.numericPrognosis.toFixed(1)}%
      </Text>
      <Text style={styles.prognosisLabel}>Probabilidad por Ciclo</Text>
      <Text style={styles.prognosisPhrase}>{report.prognosisPhrase}</Text>
      <Text style={styles.benchmarkPhrase}>{report.benchmarkPhrase}</Text>
    </Box>
  );
};

const styles = StyleSheet.create({
  mainResultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  emoji: {
    fontSize: 60,
    marginBottom: 12,
  },
  prognosisValue: {
    fontSize: 72,
    fontWeight: 'bold',
    lineHeight: 80,
  },
  prognosisLabel: {
    fontSize: 16,
    color: theme.colors.subtleText,
    marginTop: -8,
    marginBottom: 16,
  },
  prognosisPhrase: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: theme.colors.text,
    lineHeight: 26,
    marginBottom: 12,
  },
  benchmarkPhrase: {
    fontSize: 14,
    textAlign: 'center',
    color: theme.colors.subtleText,
    lineHeight: 20,
  },
});