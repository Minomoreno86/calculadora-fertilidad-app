/**
 * 🏥 PANTALLA PRINCIPAL - CALCULADORA MÉDICA PROFESIONAL
 * 
 * Integra TODOS los componentes médicos profesionales existentes:
 * - DemographicsForm, GynecologyHistoryForm, LabTestsForm, MaleFactorForm
 * - useCalculatorForm con ModularFertilityEngine avanzado
 * - Sistema modular de 44KB + Biblioteca clínica de 97KB
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';

// 🏥 COMPONENTE PRINCIPAL QUE USA TODA TU ARQUITECTURA EXISTENTE
import { CalculatorFormMain } from '@/presentation/features/calculator/components/CalculatorFormMain';

// ===================================================================
// 🏥 PANTALLA PRINCIPAL MÉDICA
// ===================================================================

export default function ProfessionalCalculatorScreen() {
  return (
    <View style={styles.container}>
      <CalculatorFormMain />
    </View>
  );
}

// ===================================================================
// 🎨 ESTILOS MÍNIMOS
// ===================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});