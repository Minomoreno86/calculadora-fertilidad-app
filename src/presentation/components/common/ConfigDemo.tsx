import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import Text from './Text';
import { useEnhancedTheme } from '../../../hooks/useEnhancedTheme';
import { useFeatureConfig } from '../../../hooks/useAdvancedConfig';

interface ConfigDemoProps {
  visible?: boolean;
}

export const ConfigDemo: React.FC<ConfigDemoProps> = ({ visible = true }) => {
  const theme = useEnhancedTheme();
  const config = useFeatureConfig();
  const [demoValue, setDemoValue] = useState(50);
  const styles = createStyles(theme);

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎭 Demo de Configuraciones</Text>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* 🎨 SECCIÓN DE TEMA */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎨 Tema Personalizado</Text>
          
          <View style={theme.utils.generateCardStyle('elevated')}>
            <View style={styles.colorPalette}>
              <View style={[styles.colorSwatch, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.colorLabel}>Primario</Text>
              </View>
              <View style={[styles.colorSwatch, { backgroundColor: theme.colors.secondary }]}>
                <Text style={styles.colorLabel}>Secundario</Text>
              </View>
              <View style={[styles.colorSwatch, { backgroundColor: theme.colors.accent }]}>
                <Text style={styles.colorLabel}>Acento</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 📏 SECCIÓN DE TIPOGRAFÍA */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📏 Tipografía Escalable</Text>
          
          <View style={theme.utils.generateCardStyle()}>
            <Text style={theme.typography.h1}>Título Principal</Text>
            <Text style={theme.typography.h2}>Título Secundario</Text>
            <Text style={theme.typography.h3}>Subtítulo</Text>
            <Text style={theme.typography.body}>
              Texto de cuerpo con el tamaño configurado: {config.fontSize}
            </Text>
            <Text style={theme.typography.caption}>
              Texto auxiliar y notas pequeñas
            </Text>
          </View>
        </View>

        {/* 🎯 SECCIÓN DE BOTONES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Botones Adaptativos</Text>
          
          <View style={styles.buttonGrid}>
            <TouchableOpacity style={theme.utils.generateButtonStyle('primary')}>
              <Text style={styles.buttonText}>Botón Primario</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={theme.utils.generateButtonStyle('secondary')}>
              <Text style={styles.buttonText}>Botón Secundario</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 📊 SECCIÓN DE PROGRESO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Indicadores de Progreso</Text>
          
          <View style={theme.utils.generateCardStyle()}>
            <Text style={styles.progressLabel}>Progreso Demo: {demoValue}%</Text>
            
            <View style={styles.progressContainer}>
              <View style={[
                styles.progressBar,
                { backgroundColor: theme.colors.border }
              ]}>
                <View style={[
                  styles.progressFill,
                  { 
                    width: `${demoValue}%`,
                    backgroundColor: theme.colors.primary,
                    borderRadius: config.enhancedProgress ? 8 : 4,
                  }
                ]} />
              </View>
            </View>

            <TouchableOpacity 
              style={styles.progressButton}
              onPress={() => setDemoValue(prev => (prev + 20) % 101)}
            >
              <Text style={styles.progressButtonText}>Cambiar Progreso</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 🎛️ SECCIÓN DE CONTROLES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎛️ Controles Interactivos</Text>
          
          <View style={theme.utils.generateCardStyle()}>
            {/* Switch Demo */}
            <View style={styles.controlItem}>
              <Text style={styles.controlLabel}>Demo Switch</Text>
              <Switch
                value={demoValue > 50}
                onValueChange={() => setDemoValue(prev => prev > 50 ? 25 : 75)}
                trackColor={{
                  false: theme.colors.border,
                  true: theme.colors.primary,
                }}
                thumbColor={'#FFFFFF'}
              />
            </View>

            {/* Input Demo */}
            <View style={styles.controlItem}>
              <Text style={styles.controlLabel}>Input Demo</Text>
              <View style={theme.utils.generateInputStyle(false)}>
                <Text style={styles.inputText}>
                  Configuración: {config.themeAccent} / {config.fontSize}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ⚙️ SECCIÓN DE ESTADO ACTUAL */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ Estado Actual</Text>
          
          <View style={theme.utils.generateCardStyle('elevated')}>
            <View style={styles.configGrid}>
              <View style={styles.configStat}>
                <Text style={styles.configStatValue}>
                  {config.enginePreference.toUpperCase()}
                </Text>
                <Text style={styles.configStatLabel}>Motor</Text>
              </View>
              
              <View style={styles.configStat}>
                <Text style={styles.configStatValue}>
                  {config.performanceMode.toUpperCase()}
                </Text>
                <Text style={styles.configStatLabel}>Performance</Text>
              </View>
              
              <View style={styles.configStat}>
                <Text style={styles.configStatValue}>
                  {config.themeAccent.toUpperCase()}
                </Text>
                <Text style={styles.configStatLabel}>Acento</Text>
              </View>
              
              <View style={styles.configStat}>
                <Text style={styles.configStatValue}>
                  {config.fontSize.toUpperCase()}
                </Text>
                <Text style={styles.configStatLabel}>Fuente</Text>
              </View>
            </View>
            
            <View style={styles.configToggles}>
              <View style={[
                styles.configToggle,
                { backgroundColor: config.smartHints ? theme.colors.success : theme.colors.border }
              ]}>
                <Text style={[
                  styles.configToggleText,
                  { color: config.smartHints ? '#FFFFFF' : theme.colors.textSecondary }
                ]}>
                  💡 Consejos: {config.smartHints ? 'ON' : 'OFF'}
                </Text>
              </View>
              
              <View style={[
                styles.configToggle,
                { backgroundColor: config.animationsEnabled ? theme.colors.success : theme.colors.border }
              ]}>
                <Text style={[
                  styles.configToggleText,
                  { color: config.animationsEnabled ? '#FFFFFF' : theme.colors.textSecondary }
                ]}>
                  ✨ Animaciones: {config.animationsEnabled ? 'ON' : 'OFF'}
                </Text>
              </View>
              
              <View style={[
                styles.configToggle,
                { backgroundColor: config.enhancedProgress ? theme.colors.success : theme.colors.border }
              ]}>
                <Text style={[
                  styles.configToggleText,
                  { color: config.enhancedProgress ? '#FFFFFF' : theme.colors.textSecondary }
                ]}>
                  📊 Progreso+: {config.enhancedProgress ? 'ON' : 'OFF'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Espaciado inferior */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

// 🎨 ESTILOS DINÁMICOS
const createStyles = (theme: ReturnType<typeof useEnhancedTheme>) => StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.l,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.m,
    fontWeight: '700',
  },
  
  // 🎨 Paleta de colores
  colorPalette: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: theme.spacing.m,
  },
  colorSwatch: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorLabel: {
    ...theme.typography.caption,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // 🎯 Botones
  buttonGrid: {
    gap: theme.spacing.m,
  },
  buttonText: {
    ...theme.typography.body,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },

  // 📊 Progreso
  progressLabel: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.s,
    fontWeight: '600',
  },
  progressContainer: {
    marginBottom: theme.spacing.m,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressButton: {
    alignSelf: 'center',
    paddingHorizontal: theme.spacing.l,
    paddingVertical: theme.spacing.s,
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
  },
  progressButtonText: {
    ...theme.typography.bodySmall,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // 🎛️ Controles
  controlItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  controlLabel: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
  },
  inputText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },

  // ⚙️ Estado de configuración
  configGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: theme.spacing.m,
  },
  configStat: {
    alignItems: 'center',
  },
  configStatValue: {
    ...theme.typography.bodyLarge,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  configStatLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  
  configToggles: {
    gap: theme.spacing.s,
  },
  configToggle: {
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    borderRadius: 20,
    alignItems: 'center',
  },
  configToggleText: {
    ...theme.typography.bodySmall,
    fontWeight: '600',
  },

  bottomSpacer: {
    height: theme.spacing.xxl,
  },
});
