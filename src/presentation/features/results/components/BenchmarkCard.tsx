import React from 'react';
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Text from '../../../components/common/Text';
import Box from '../../../components/common/Box';
import { Report } from '../../../../core/domain/models';
import { theme } from '../../../../config/theme';
import { withPerformanceTracking } from '../../../../core/utils/performanceBenchmark';
import { useSimplePerformance } from '../../../hooks/useComponentPerformance';

type Props = { report: Report };

// 🎯 Componente optimizado con performance tracking avanzado
const BenchmarkCardBase: React.FC<Props> = ({ report }) => {
  const { performanceData, analyzeProps, measureFunction } = useSimplePerformance('BenchmarkCard');

  // 📊 Analizar cambios de props para optimización
  React.useEffect(() => {
    analyzeProps({ benchmarkPhrase: report.benchmarkPhrase });
  }, [report.benchmarkPhrase, analyzeProps]);

  // 🧠 Memoización inteligente con medición de performance
  const memoizedContent = React.useMemo(() => {
    return measureFunction('contentMemoization', () => ({
      title: 'Comparativa',
      text: report.benchmarkPhrase,
      // 🎨 Análisis de longitud para optimización visual
      isLongText: report.benchmarkPhrase.length > 100,
      wordCount: report.benchmarkPhrase.split(' ').length
    }));
  }, [report.benchmarkPhrase, measureFunction]);

  // 🎯 Estilos dinámicos basados en contenido
  const textStyle = React.useMemo(() => {
    return measureFunction('styleCalculation', () => {
      if (memoizedContent.wordCount > 50) {
        return [styles.text, { fontSize: 14, lineHeight: 20 }];
      }
      if (memoizedContent.isLongText) {
        return [styles.text, { lineHeight: 22 }];
      }
      return styles.text;
    });
  }, [memoizedContent, measureFunction]);

  // 🔍 Debug info en desarrollo
  if (process.env.NODE_ENV === 'development' && performanceData.renderCount % 10 === 0) {
    console.log(`📊 BenchmarkCard Performance:`, {
      renders: performanceData.renderCount,
      avgTime: performanceData.averageRenderTime.toFixed(2) + 'ms',
      optimized: performanceData.isOptimized ? '✅' : '❌'
    });
  }

  return (
    <Box style={styles.card}>
      <Text style={styles.title}>{memoizedContent.title}</Text>
      <Text style={textStyle}>
        {memoizedContent.text}
      </Text>
      
      {/* 🔧 Performance indicator en desarrollo */}
      {process.env.NODE_ENV === 'development' && !performanceData.isOptimized && (
        <Text style={styles.perfWarning}>
          ⚠️ Performance: {performanceData.averageRenderTime.toFixed(1)}ms
        </Text>
      )}
    </Box>
  );
};

// 🎯 Componente final con todas las optimizaciones
export const BenchmarkCard = React.memo(
  withPerformanceTracking(BenchmarkCardBase, 'BenchmarkCard'),
  // 🧠 Comparación personalizada para memo
  (prevProps, nextProps) => {
    return prevProps.report.benchmarkPhrase === nextProps.report.benchmarkPhrase;
  }
);

const styles = StyleSheet.create({
  card: {
    ...(theme.card as object),
    backgroundColor: theme.colors.background,
    padding: theme.spacing.l,
    marginBottom: theme.spacing.m,
  } as ViewStyle,
  title: {
    ...theme.typography.h3,
    color: theme.colors.subtleText,
    textAlign: 'center' as const,
    marginBottom: theme.spacing.s,
  } as TextStyle,
  text: {
    ...theme.typography.body,
    textAlign: 'center' as const,
    color: theme.colors.text,
  } as TextStyle,
  perfWarning: {
    fontSize: 10,
    color: '#ff6b00',
    textAlign: 'center',
    marginTop: 4,
    fontWeight: 'bold' as const
  } as TextStyle,
});
