import React from 'react';
import { StyleSheet } from 'react-native';
import Text from '../../../components/common/Text';
import Box from '../../../components/common/Box';
import { Report } from '../../../../core/domain/models';
import { theme } from '../../../../config/theme';

type Props = { report: Report };

export const PrognosisCard: React.FC<Props> = ({ report }) => {
  const getPrognosisColor = () => {
    if (report.category === 'BUENO') return theme.colors.success;
    if (report.category === 'MODERADO') return theme.colors.warning;
    return theme.colors.error;
  };

  return (
    <Box style={styles.mainResultCard}>
      <Text style={styles.emoji}>{report.emoji}</Text>
      <Text style={[styles.prognosisValue, { color: getPrognosisColor() }]}>{report.numericPrognosis.toFixed(1)}%</Text>
      <Text style={styles.prognosisLabel}>Probabilidad por Ciclo</Text>
      <Text style={styles.prognosisPhrase}>{report.prognosisPhrase}</Text>
      <Text style={styles.benchmarkPhrase}>{report.benchmarkPhrase}</Text>
    </Box>
  );
};

const styles = StyleSheet.create({
  mainResultCard: {
    ...theme.card,
    padding: theme.spacing.l,
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  emoji: {
    fontSize: 60,
    marginBottom: theme.spacing.m,
  },
  prognosisValue: {
    ...theme.typography.h1,
    fontSize: 72, // Override for extra large display
    lineHeight: 80,
  },
  prognosisLabel: {
    ...theme.typography.body,
    color: theme.colors.subtleText,
    marginTop: -theme.spacing.xs,
    marginBottom: theme.spacing.m,
  },
  prognosisPhrase: {
    ...theme.typography.h3,
    textAlign: 'center',
    color: theme.colors.text,
    marginBottom: theme.spacing.s,
  },
  benchmarkPhrase: {
    ...theme.typography.small,
    textAlign: 'center',
    color: theme.colors.subtleText,
  },
});
