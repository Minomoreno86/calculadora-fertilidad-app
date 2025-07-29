import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Text from './Text';
import { useDynamicTheme } from '../../../hooks/useDynamicTheme';
import { useFeatureConfig } from '../../../hooks/useAdvancedConfig';

interface QuickConfigProps {
  onOpenAdvanced?: () => void;
}

export const QuickConfig: React.FC<QuickConfigProps> = ({ onOpenAdvanced }) => {
  const theme = useDynamicTheme();
  const {
    enginePreference,
    performanceMode,
    smartHints,
    enhancedProgress,
    themeAccent,
    animationsEnabled
  } = useFeatureConfig();
  
  const styles = createStyles(theme);

  const getEngineIcon = (engine: string) => {
    switch (engine) {
      case 'auto': return '🔄';
      case 'standard': return '⚡';
      case 'premium': return '💎';
      case 'unified': return '🎯';
      default: return '⚙️';
    }
  };

  const getPerformanceIcon = (mode: string) => {
    switch (mode) {
      case 'speed': return '🚀';
      case 'balanced': return '⚖️';
      case 'accuracy': return '🎯';
      default: return '⚙️';
    }
  };

  const getAccentColor = (accent: string) => {
    switch (accent) {
      case 'coral': return '#FF6B6B';
      case 'lavender': return '#8B5FBF';
      case 'mint': return '#4ECDC4';
      case 'sunset': return '#FF8A65';
      default: return theme.colors.primary;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>⚡ Config Rápida</Text>
        <TouchableOpacity onPress={onOpenAdvanced} style={styles.advancedButton}>
          <Text style={styles.advancedText}>Avanzada</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.configGrid}>
        {/* Motor de Cálculo */}
        <View style={styles.configItem}>
          <Text style={styles.configLabel}>Motor</Text>
          <View style={[styles.configBadge, { backgroundColor: getAccentColor(themeAccent) }]}>
            <Text style={styles.configBadgeText}>
              {getEngineIcon(enginePreference)} {enginePreference.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Modo de Performance */}
        <View style={styles.configItem}>
          <Text style={styles.configLabel}>Performance</Text>
          <View style={[styles.configBadge, { backgroundColor: theme.colors.secondary }]}>
            <Text style={styles.configBadgeText}>
              {getPerformanceIcon(performanceMode)} {performanceMode.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Smart Hints */}
        <View style={styles.configItem}>
          <Text style={styles.configLabel}>Consejos</Text>
          <View style={[
            styles.configToggle,
            { backgroundColor: smartHints ? theme.colors.success : theme.colors.border }
          ]}>
            <Text style={[
              styles.configToggleText,
              { color: smartHints ? '#FFFFFF' : theme.colors.textSecondary }
            ]}>
              {smartHints ? '✓ ON' : '✗ OFF'}
            </Text>
          </View>
        </View>

        {/* Enhanced Progress */}
        <View style={styles.configItem}>
          <Text style={styles.configLabel}>Progreso+</Text>
          <View style={[
            styles.configToggle,
            { backgroundColor: enhancedProgress ? theme.colors.success : theme.colors.border }
          ]}>
            <Text style={[
              styles.configToggleText,
              { color: enhancedProgress ? '#FFFFFF' : theme.colors.textSecondary }
            ]}>
              {enhancedProgress ? '✓ ON' : '✗ OFF'}
            </Text>
          </View>
        </View>

        {/* Animaciones */}
        <View style={styles.configItem}>
          <Text style={styles.configLabel}>Animación</Text>
          <View style={[
            styles.configToggle,
            { backgroundColor: animationsEnabled ? theme.colors.success : theme.colors.border }
          ]}>
            <Text style={[
              styles.configToggleText,
              { color: animationsEnabled ? '#FFFFFF' : theme.colors.textSecondary }
            ]}>
              {animationsEnabled ? '✨ ON' : '⚪ OFF'}
            </Text>
          </View>
        </View>

        {/* Tema */}
        <View style={styles.configItem}>
          <Text style={styles.configLabel}>Tema</Text>
          <View style={[styles.configBadge, { backgroundColor: getAccentColor(themeAccent) }]}>
            <Text style={styles.configBadgeText}>
              🎨 {themeAccent.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

// 🎨 ESTILOS DINÁMICOS
const createStyles = (theme: ReturnType<typeof useDynamicTheme>) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: theme.spacing.screen,
    marginBottom: theme.spacing.m,
    shadowColor: theme.isDark ? theme.colors.black : '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: theme.isDark ? 0.3 : 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    ...theme.typography.bodyLarge,
    fontWeight: '700' as const,
    color: theme.colors.text,
  },
  advancedButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
  },
  advancedText: {
    ...theme.typography.caption,
    color: '#FFFFFF',
    fontWeight: '600' as const,
  },
  configGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  configItem: {
    flex: 1,
    minWidth: '30%',
    alignItems: 'center',
    gap: 4,
  },
  configLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontWeight: '600' as const,
    textAlign: 'center' as const,
  },
  configBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 60,
    alignItems: 'center',
  },
  configBadgeText: {
    ...theme.typography.caption,
    color: '#FFFFFF',
    fontWeight: '700' as const,
    fontSize: 10,
  },
  configToggle: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 50,
    alignItems: 'center',
  },
  configToggleText: {
    ...theme.typography.caption,
    fontWeight: '700' as const,
    fontSize: 10,
  },
});
