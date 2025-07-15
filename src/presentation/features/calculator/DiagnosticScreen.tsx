/**
 * Componente de diagnóstico para identificar errores
 * Usa solo lo básico para testear
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Text from '../../components/common/Text';
import { theme } from '@/config/theme';

export const DiagnosticScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Diagnóstico de Calculadora</Text>
      <Text style={styles.text}>Si ves este mensaje, la pantalla básica funciona.</Text>
      <Text style={styles.text}>El problema está en los componentes más complejos.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 10,
    textAlign: 'center',
  },
});