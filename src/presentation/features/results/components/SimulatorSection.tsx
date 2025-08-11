import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Text from '../../../components/common/Text';
import Box from '../../../components/common/Box';
import { EvaluationState, SimulatableFactor, Diagnostics } from '../../../../core/domain/models';
import { useFertilitySimulator } from '../../../features/simulator/useFertilitySimulator';
import { theme } from '../../../../config/theme';
import { SimulatorDashboard } from '../../../features/simulator/components/SimulatorDashboard';
import { ModernSimulatorDashboard } from '../../../features/simulator/components/ModernSimulatorDashboard';

type SimulationInsightProps = {
  label: string;
  value: string;
  factorName: SimulatableFactor;
  explanation: string;
  onSimulate: (factor: SimulatableFactor, explanation: string) => void;
};

const SimulationInsight: React.FC<SimulationInsightProps> = ({ label, value, factorName, explanation, onSimulate }) => (
  <View style={styles.insightRow}>
    <Text style={styles.insightText}>
      {label}: <Text style={{ fontWeight: 'normal' as const }}>{value}</Text>
    </Text>
    <TouchableOpacity style={styles.simulateButton} onPress={() => onSimulate(factorName, explanation)}>
      <Text style={styles.simulateButtonText}>✨ Simular Mejora</Text>
    </TouchableOpacity>
  </View>
);

const factorLabels: Partial<Record<keyof Diagnostics, string>> = {
  bmiComment: 'IMC',
  homaComment: 'Resistencia a la Insulina',
  ovarianReserve: 'Reserva Ovárica',
  cycleComment: 'Ciclo Menstrual',
  tshComment: 'Función Tiroidea (TSH)',
  prolactinComment: 'Prolactina',
  endometriosisComment: 'Endometriosis',
  myomaComment: 'Miomas',
  polypComment: 'Pólipos',
  adenomyosisComment: 'Adenomiosis',
  hsgComment: 'Trompas (HSG)',
  maleFactorDetailed: 'Factor Masculino',
};

type Props = { evaluation: EvaluationState };

export const SimulatorSection: React.FC<Props> = ({ evaluation }) => {
  
  const [simulatorMode, setSimulatorMode] = React.useState<'basic' | 'advanced' | 'modern'>('modern');
  const { simulationResult, simulateFactor, simulateAllImprovements } = useFertilitySimulator(evaluation);
  // ✅ LÓGICA MEJORADA: Permitir que ModernSimulatorDashboard haga su propio filtrado inteligente
  const hasAnyData = evaluation && evaluation.factors && Object.keys(evaluation.factors).length > 0;
  
  console.log('🔍 [SimulatorSection] ANÁLISIS DE DATOS:', {
    hasEvaluation: !!evaluation,
    hasFactors: !!evaluation?.factors,
    factorsCount: Object.keys(evaluation?.factors || {}).length,
    hasAnyData,
    simulatorMode
  });
  
  if (!hasAnyData) {
    console.log('❌ [SimulatorSection] NO HAY DATOS - Ocultando simulador');
    return null;
  }
  
  // 🔄 MANTENER para compatibilidad con simulador básico
  const suboptimalFactors = Object.entries(evaluation.factors).filter(
    ([key, value]) => key !== 'baseAgeProbability' && (value as number) < 1.0,
  );

  const toggleSimulator = () => {
    setSimulatorMode(prev => {
      if (prev === 'modern') return 'advanced';
      if (prev === 'advanced') return 'basic';
      return 'modern';
    });
  };

  const getToggleText = () => {
    switch (simulatorMode) {
      case 'modern': return '✨ Vista Moderna';
      case 'advanced': return '📊 Vista Avanzada';
      case 'basic': return '📋 Vista Básica';
      default: return '✨ Vista Moderna';
    }
  };

  // ✨ NUEVA LÓGICA: 3 modos de simulador
  console.log('🎯 [SimulatorSection] RENDERIZANDO - Modo:', simulatorMode);
  
  if (simulatorMode === 'modern') {
    console.log('🚀 [SimulatorSection] EJECUTANDO MODO MODERNO - Llamando a ModernSimulatorDashboard');
    console.log('📊 [SimulatorSection] Datos que se pasan:', {
      evaluationExists: !!evaluation,
      factorsExists: !!evaluation?.factors,
      inputExists: !!evaluation?.input
    });
    
    return (
      <View style={styles.container}>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, styles.modernToggle]}
            onPress={toggleSimulator}
          >
            <Text style={[styles.toggleText, styles.modernToggleText]}>
              {getToggleText()}
            </Text>
          </TouchableOpacity>
        </View>
        <ModernSimulatorDashboard 
          evaluation={evaluation} 
          onModeChange={(mode: string) => console.log('Mode changed:', mode)}
        />
      </View>
    );
  }

  if (simulatorMode === 'advanced') {
    return (
      <View style={styles.container}>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={toggleSimulator}
          >
            <Text style={styles.toggleText}>
              {getToggleText()}
            </Text>
          </TouchableOpacity>
        </View>
        <SimulatorDashboard 
          evaluation={evaluation} 
          onModeChange={(mode: string) => console.log('Mode changed:', mode)}
        />
      </View>
    );
  }

  // 🔄 Mantener la implementación original como fallback
  return (
    <>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={toggleSimulator}
        >
          <Text style={styles.toggleText}>
            {getToggleText()}
          </Text>
        </TouchableOpacity>
      </View>
      
      {simulationResult && (
        <Box style={styles.simulatedCardRedesigned}>
          <Text style={styles.simulatedTitle}>🌱 Optimización Completa</Text>
          
          <View style={styles.prognosisContainer}>
            <Text style={styles.prognosisFrom}>{simulationResult.originalPrognosis.toFixed(1)}%</Text>
            <Text style={styles.prognosisArrow}>→</Text>
            <Text style={styles.prognosisTo}>{simulationResult.newPrognosis.toFixed(1)}%</Text>
          </View>
          
          <View style={styles.improvementContainer}>
            <Text style={styles.improvementLabel}>Mejora:</Text>
            <Text style={styles.improvementValue}>+{Math.abs(simulationResult.improvement).toFixed(1)}%</Text>
          </View>
          
          <Text style={styles.explanationText}>
            {simulationResult.explanation.replace('(Motor: basic + Neural IA)', '').trim()}
          </Text>
        </Box>
      )}

      <Box style={styles.card}>
        <Text style={styles.title}>Simulador de Potencial</Text>
        {suboptimalFactors.map(([factorName]) => {
          const diagnosticKey = `${factorName}Comment` as keyof Diagnostics;
          const diagnosticValue =
            evaluation.diagnostics[diagnosticKey] ||
            evaluation.diagnostics[factorName as keyof Diagnostics];

          if (typeof diagnosticValue !== 'string' || !diagnosticValue) return null;

          return (
            <SimulationInsight
              key={factorName}
              label={
                factorLabels[diagnosticKey] ||
                factorLabels[factorName as keyof Diagnostics] ||
                factorName
              }
              value={diagnosticValue}
              factorName={factorName as SimulatableFactor}
              explanation={
                factorLabels[diagnosticKey] ||
                factorLabels[factorName as keyof Diagnostics] ||
                factorName
              }
              onSimulate={simulateFactor}
            />
          );
        })}
        {suboptimalFactors.length > 1 && (
          <TouchableOpacity style={styles.simulateAllButton} onPress={simulateAllImprovements}>
            <Text style={styles.simulateAllButtonText}>🚀 Simular Todas las Mejoras</Text>
          </TouchableOpacity>
        )}
      </Box>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toggleContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  toggleButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  toggleText: {
    color: theme.colors.background,
    fontSize: 14,
    fontWeight: 'bold' as const,
  },
  // ✨ ESTILOS MODERNOS PARA EL TOGGLE
  modernToggle: {
    backgroundColor: '#0066CC',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    elevation: 4,
    shadowColor: '#0066CC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  modernToggleText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
  },
  card: { ...theme.card, padding: theme.spacing.l, marginBottom: theme.spacing.m },
  simulatedCard: {
    backgroundColor: theme.colors.surface,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  simulatedCardFixed: {
    backgroundColor: theme.colors.surface,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
    minHeight: 220, // ✅ Más altura para garantizar visibilidad completa
    paddingHorizontal: theme.spacing.l + 4, // ✅ Más padding horizontal
    paddingVertical: theme.spacing.l, // ✅ Más padding vertical
  },
  title: { ...theme.typography.h3, marginBottom: theme.spacing.m },
  simulatedText: {
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 24,
    color: theme.colors.text,
  },
  prognosisHighlight: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    color: theme.colors.success,
    textAlign: 'center' as const,
    marginVertical: 8,
  },
  improvementText: {
    fontSize: 14,
    textAlign: 'center' as const,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  improvementTextFixed: {
    fontSize: 15, // ✅ Ligeramente más grande
    textAlign: 'center' as const,
    color: theme.colors.textSecondary,
    marginBottom: 12, // ✅ Más margen
    lineHeight: 22, // ✅ Mejor espaciado de línea
    paddingHorizontal: 8, // ✅ Padding para evitar cortes
  },
  insightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  insightText: { flex: 1, ...theme.typography.bodyBold, paddingRight: theme.spacing.xs },
  simulateButton: {
    paddingHorizontal: theme.spacing.s,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.secondary,
    borderRadius: 15,
  },
  simulateButtonText: { ...theme.typography.small, fontWeight: 'bold' as const, color: theme.colors.buttonText },
  simulateAllButton: {
    marginTop: theme.spacing.m,
    padding: theme.spacing.s,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.card.borderRadius,
    alignItems: 'center',
  },
  simulateAllButtonText: { ...theme.typography.bodyBold, color: theme.colors.buttonText },
  // 🆕 NUEVOS ESTILOS PARA TARJETA REDISEÑADA
  simulatedCardRedesigned: {
    backgroundColor: theme.colors.surface,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
    minHeight: 160,
    paddingHorizontal: theme.spacing.l + 4,
    paddingVertical: theme.spacing.l,
    marginBottom: theme.spacing.m,
    borderRadius: 12,
  },
  simulatedTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: theme.colors.primary,
    marginBottom: 16,
    textAlign: 'center' as const,
  },
  prognosisContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginBottom: 12,
  },
  prognosisFrom: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: theme.colors.text,
  },
  prognosisArrow: {
    fontSize: 20,
    color: theme.colors.primary,
    marginHorizontal: 12,
  },
  prognosisTo: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: theme.colors.success,
  },
  improvementContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginBottom: 12,
  },
  improvementLabel: {
    fontSize: 16,
    color: theme.colors.text,
    marginRight: 8,
  },
  improvementValue: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: theme.colors.success,
  },
  explanationText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center' as const,
    lineHeight: 20,
  },
});
