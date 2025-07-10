import React from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import Text from '../../../components/common/Text';
import Box from '../../../components/common/Box';
import { TreatmentSuggestion } from '../../../../core/domain/models';
import { theme } from '../../../../config/theme';
import { TouchableOpacity } from 'react-native-gesture-handler';

type Props = { suggestions: TreatmentSuggestion[] };

const openLink = (url: string) => {
  Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
};

export const TreatmentCard: React.FC<Props> = ({ suggestions }) => (
  <Box style={styles.card}>
    <Text style={styles.title}>Sugerencias de Siguientes Pasos</Text>
    {suggestions.map((sugg, index) => (
      <View key={index} style={[styles.suggestionItem, index < suggestions.length - 1 && styles.divider]}>
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 16,
  },
  suggestionItem: {
    paddingVertical: 16,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  suggCategory: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.secondary,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  suggTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 8,
  },
  suggDetails: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.subtleText,
    marginBottom: 12,
  },
  suggSourceLink: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  suggSourceText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: theme.colors.subtleText,
  },
});