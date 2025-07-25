import React from 'react';
import { View, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import Text from '../../../components/common/Text';
import Box from '../../../components/common/Box';
import { TreatmentSuggestion } from '../../../../core/domain/models';
import { theme } from '../../../../config/theme';

type Props = { suggestions: TreatmentSuggestion[] };

const openLink = (url: string) => {
  Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
};

export const TreatmentCard: React.FC<Props> = ({ suggestions }) => (
  <Box style={styles.card}>
    <Text style={styles.title}>Sugerencias de Siguientes Pasos</Text>
    {suggestions.map((sugg, index) => (
      <View key={`treatment-${index}-${sugg.category}`} style={[styles.suggestionItem, index < suggestions.length - 1 && styles.divider]}>
        <Text style={styles.suggCategory}>{sugg.category}</Text>
        <Text style={styles.suggTitle}>{sugg.title}</Text>
        <Text style={styles.suggDetails}>{sugg.details}</Text>
        {sugg.source.startsWith('http') ? (
          <TouchableOpacity onPress={() => openLink(sugg.source)}>
            <Text style={styles.suggSourceLink}>Fuente y más información</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.suggSourceText}>Fuente: {sugg.source}</Text>
        )}
      </View>
    ))}
  </Box>
);

const styles = StyleSheet.create({
  card: {
    ...theme.card,
    padding: theme.spacing.l,
    marginBottom: theme.spacing.m,
  },
  title: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.m,
  },
  suggestionItem: {
    paddingVertical: theme.spacing.m,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  suggCategory: {
    ...theme.typography.small,
    fontWeight: '600',
    color: theme.colors.secondary,
    marginBottom: theme.spacing.xs,
    textTransform: 'uppercase',
  },
  suggTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  suggDetails: {
    ...theme.typography.body,
    color: theme.colors.subtleText,
    marginBottom: theme.spacing.s,
  },
  suggSourceLink: {
    ...theme.typography.small,
    color: theme.colors.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  suggSourceText: {
    ...theme.typography.small,
    fontStyle: 'italic',
    color: theme.colors.subtleText,
  },
});
