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
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.subtleText,
    textAlign: 'center',
    marginBottom: 8,
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.text,
  },
});