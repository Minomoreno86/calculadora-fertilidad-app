import React from 'react';
import { StyleSheet } from 'react-native';
import Text from '../../../components/common/Text';
import Box from '../../../components/common/Box';
import { Report } from '../../../../core/domain/models';
import { theme } from '../../../../config/theme';

type Props = { report: Report };

export const BenchmarkCard: React.FC<Props> = ({ report }) => (
  <Box style={styles.card}>
    <Text style={styles.title}>Comparativa</Text>
    <Text style={styles.text}>{report.benchmarkPhrase}</Text>
  </Box>
);

const styles = StyleSheet.create({
  card: {
    ...theme.card,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.l,
    marginBottom: theme.spacing.m,
  },
  title: {
    ...theme.typography.h3,
    color: theme.colors.subtleText,
    textAlign: 'center',
    marginBottom: theme.spacing.s,
  },
  text: {
    ...theme.typography.body,
    textAlign: 'center',
    color: theme.colors.text,
  },
});