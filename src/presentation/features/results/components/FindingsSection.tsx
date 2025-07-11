import React from 'react';
import { View, StyleSheet } from 'react-native';
import Text from '@/presentation/components/common/Text';
import Box from '@/presentation/components/common/Box';
import { ClinicalFinding } from '@/core/domain/models';
import { theme } from '@/config/theme';

type Props = { findings: ClinicalFinding[] };

export const FindingsSection: React.FC<Props> = ({ findings }) => {
  if (!findings || findings.length === 0) {
    return (
      <Box style={styles.card}>
        <Text style={styles.cardTitle}>Hallazgos Clínicos</Text>
        <Text style={styles.noFindingsText}>
          No se han identificado factores de riesgo específicos en tu perfil actual. ¡Es una buena noticia!
        </Text>
      </Box>
    );
  }

  return (
    <Box style={styles.card}>
      <Text style={styles.cardTitle}>Hallazgos y Recomendaciones</Text>
      {findings.map((finding, index) => (
        <View key={finding.key} style={[styles.findingItem, index < findings.length - 1 && styles.divider]}>
          <Text style={styles.findingTitle}>{finding.title}</Text>
          <Text style={styles.definition}>{finding.definition}</Text>
          {finding.justification && (
            <Text style={styles.justification}>**Justificación:** {finding.justification}</Text>
          )}
          <Text style={styles.recTitle}>Recomendaciones:</Text>
          {finding.recommendations.map((rec, recIndex) => (
            <Text key={recIndex} style={styles.recommendation}>
              • {rec}
            </Text>
          ))}
        </View>
      ))}
    </Box>
  );
};

const styles = StyleSheet.create({
  card: {
    ...theme.card,
    padding: theme.spacing.l,
    marginBottom: theme.spacing.m,
  },
  cardTitle: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.m,
  },
  noFindingsText: {
    ...theme.typography.body,
    color: theme.colors.subtleText,
    textAlign: 'center',
    paddingVertical: theme.spacing.m,
  },
  findingItem: {
    paddingVertical: theme.spacing.m,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  findingTitle: {
    ...theme.typography.h3,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  explanation: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.s,
  },
  definition: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.s,
  },
  justification: {
    ...theme.typography.bodySmall,
    color: theme.colors.subtleText,
    fontStyle: 'italic',
    marginBottom: theme.spacing.s,
  },
  recTitle: {
    ...theme.typography.bodyBold,
    marginTop: theme.spacing.s,
    marginBottom: theme.spacing.xs,
  },
  recommendation: {
    ...theme.typography.body,
    color: theme.colors.subtleText,
    marginLeft: theme.spacing.xs,
    marginBottom: theme.spacing.xxs,
  },
});
