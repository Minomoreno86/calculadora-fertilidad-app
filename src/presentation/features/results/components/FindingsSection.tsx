import React from 'react';
import { View, StyleSheet } from 'react-native';
import Text from '../../../components/common/Text';
import Box from '../../../components/common/Box';
import { ClinicalFinding } from '@/core/domain/models';
import { theme } from '@/config/theme';

type Props = { findings: ClinicalFinding[] };

export const FindingsSection: React.FC<Props> = ({ findings }) => {
  if (!findings || findings.length === 0) {
    return (
      <Box style={styles.card}>
        <Text style={styles.cardTitle}>Hallazgos Clínicos</Text>
        <Text style={styles.noFindingsText}>No se han identificado factores de riesgo específicos en tu perfil actual. ¡Es una buena noticia!</Text>
      </Box>
    );
  }

  return (
    <Box style={styles.card}>
      <Text style={styles.cardTitle}>Hallazgos y Recomendaciones</Text>
      {findings.map((finding, index) => (
        <View key={finding.key} style={[styles.findingItem, index < findings.length - 1 && styles.divider]}>
          <Text style={styles.findingTitle}>{finding.title}</Text>
          <Text style={styles.explanation}>{finding.explanation}</Text>
          <Text style={styles.recTitle}>Recomendaciones:</Text>
          {finding.recommendations.map((rec, recIndex) => (
            <Text key={recIndex} style={styles.recommendation}>• {rec}</Text>
          ))}
        </View>
      ))}
    </Box>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 16,
  },
  noFindingsText: {
    fontSize: 16,
    color: theme.colors.subtleText,
    textAlign: 'center',
    paddingVertical: 16,
  },
  findingItem: {
    paddingVertical: 16,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  findingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: 8,
  },
  explanation: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.text,
    marginBottom: 12,
  },
  recTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: 8,
    marginBottom: 8,
  },
  recommendation: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.subtleText,
    marginLeft: 8,
    marginBottom: 4,
  },
});