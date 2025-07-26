import React, { useState } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import Text from './Text';
import { useDynamicTheme } from '../../../hooks/useDynamicTheme';

// 🎯 TIPOS DE CONFIGURACIÓN AVANZADA
interface AdvancedConfigState {
  // 🎨 Apariencia
  appearance: {
    darkMode: boolean;
    fontSize: 'small' | 'medium' | 'large' | 'xlarge';
    themeAccent: 'coral' | 'lavender' | 'mint' | 'sunset';
    animationsEnabled: boolean;
    reducedMotion: boolean;
  };
  
  // 🔔 Notificaciones
  notifications: {
    reminders: boolean;
    insights: boolean;
    updates: boolean;
    marketing: boolean;
    pushEnabled: boolean;
    quietHours: { start: number; end: number };
  };
  
  // 🧮 Cálculo y Performance
  calculation: {
    enginePreference: 'standard' | 'premium' | 'unified' | 'auto';
    cacheEnabled: boolean;
    performanceMode: 'balanced' | 'speed' | 'accuracy';
    backgroundSync: boolean;
    smartOptimizations: boolean;
  };
  
  // 🏥 Configuraciones Médicas
  medical: {
    units: 'metric' | 'imperial';
    language: 'es' | 'en' | 'pt' | 'fr';
    medicalTerminology: 'simple' | 'technical';
    riskTolerance: 'conservative' | 'moderate' | 'aggressive';
    showMedicalReferences: boolean;
  };
  
  // 💾 Datos y Privacidad
  privacy: {
    dataRetention: 'session' | '30days' | '1year' | 'indefinite';
    analyticsEnabled: boolean;
    crashReporting: boolean;
    shareAnonymousData: boolean;
    encryptData: boolean;
  };
  
  // 🎯 Experiencia de Usuario
  ux: {
    smartHints: boolean;
    progressAnimations: boolean;
    hapticFeedback: boolean;
    soundFeedback: boolean;
    autoSave: boolean;
    quickActions: boolean;
  };
}

interface ConfigModalAdvancedProps {
  visible: boolean;
  onClose: () => void;
  onConfigChange?: (config: AdvancedConfigState) => void;
}

export const ConfigModalAdvanced: React.FC<ConfigModalAdvancedProps> = ({ 
  visible, 
  onClose, 
  onConfigChange 
}) => {
  // 🎨 TEMA DINÁMICO
  const theme = useDynamicTheme();
  const { isDark, toggleTheme } = theme;
  const styles = createStyles(theme);

  // 📊 ESTADO DE CONFIGURACIÓN AVANZADA
  const [config, setConfig] = useState<AdvancedConfigState>({
    appearance: {
      darkMode: isDark,
      fontSize: 'medium',
      themeAccent: 'coral',
      animationsEnabled: true,
      reducedMotion: false,
    },
    notifications: {
      reminders: true,
      insights: true,
      updates: false,
      marketing: false,
      pushEnabled: true,
      quietHours: { start: 22, end: 8 },
    },
    calculation: {
      enginePreference: 'auto',
      cacheEnabled: true,
      performanceMode: 'balanced',
      backgroundSync: true,
      smartOptimizations: true,
    },
    medical: {
      units: 'metric',
      language: 'es',
      medicalTerminology: 'simple',
      riskTolerance: 'moderate',
      showMedicalReferences: true,
    },
    privacy: {
      dataRetention: '1year',
      analyticsEnabled: true,
      crashReporting: true,
      shareAnonymousData: false,
      encryptData: true,
    },
    ux: {
      smartHints: true,
      progressAnimations: true,
      hapticFeedback: Platform.OS === 'ios',
      soundFeedback: false,
      autoSave: true,
      quickActions: true,
    },
  });

  // 🔄 ACTUALIZAR CONFIGURACIÓN
  const updateConfig = <T extends keyof AdvancedConfigState>(
    section: T, 
    key: string, 
    value: AdvancedConfigState[T][keyof AdvancedConfigState[T]]
  ) => {
    setConfig(prev => {
      const updated = {
        ...prev,
        [section]: {
          ...prev[section],
          [key]: value,
        },
      };
      onConfigChange?.(updated);
      return updated;
    });
  };

  // 🎨 HELPERS
  const getFontSize = (size: string) => {
    switch (size) {
      case 'small': return 12;
      case 'medium': return 16;
      case 'large': return 20;
      case 'xlarge': return 24;
      default: return 16;
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

  // 🚀 HANDLERS ESPECÍFICOS
  const handleResetConfig = () => {
    Alert.alert(
      '🔄 Restablecer Configuración',
      '¿Quieres restablecer todas las configuraciones a los valores por defecto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Restablecer', 
          style: 'destructive',
          onPress: () => {
            // Reset to defaults
            console.log('🔄 Restableciendo configuración...');
          }
        },
      ]
    );
  };

  const handleExportConfig = () => {
    Alert.alert(
      '📤 Exportar Configuración',
      'Tu configuración será exportada como archivo JSON.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Exportar', onPress: () => console.log('🔄 Exportando configuración...') },
      ]
    );
  };

  const handleImportConfig = () => {
    Alert.alert(
      '📥 Importar Configuración',
      'Selecciona un archivo de configuración para importar.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Importar', onPress: () => console.log('🔄 Importando configuración...') },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* 📱 HEADER AVANZADO */}
        <View style={[styles.header, { backgroundColor: getAccentColor(config.appearance.themeAccent) }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title}>⚙️ Configuración Avanzada</Text>
          <TouchableOpacity onPress={handleResetConfig} style={styles.resetButton}>
            <Text style={styles.resetText}>🔄</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          
          {/* 🎨 SECCIÓN DE APARIENCIA */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎨 Apariencia y Tema</Text>
            
            {/* Modo Oscuro */}
            <View style={styles.option}>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>🌙 Modo Oscuro</Text>
                <Text style={styles.optionSubtitle}>Tema oscuro para mejor experiencia nocturna</Text>
              </View>
              <Switch
                value={config.appearance.darkMode}
                onValueChange={(value) => {
                  updateConfig('appearance', 'darkMode', value);
                  toggleTheme();
                }}
                trackColor={{
                  false: '#E5E7EB',
                  true: getAccentColor(config.appearance.themeAccent),
                }}
                thumbColor={'#FFFFFF'}
              />
            </View>

            {/* Tamaño de Fuente */}
            <View style={styles.option}>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>📏 Tamaño de Fuente</Text>
                <Text style={styles.optionSubtitle}>Ajustar legibilidad del texto</Text>
              </View>
              <View style={styles.segmentedControl}>
                {(['small', 'medium', 'large', 'xlarge'] as const).map((size) => (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.segmentButton,
                      config.appearance.fontSize === size && styles.segmentButtonActive,
                    ]}
                    onPress={() => updateConfig('appearance', 'fontSize', size)}
                  >
                    <Text
                      style={[
                        styles.segmentText,
                        config.appearance.fontSize === size && styles.segmentTextActive,
                        { fontSize: getFontSize(size) / 1.5 }
                      ]}
                    >
                      A
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Color de Acento */}
            <View style={styles.option}>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>🎨 Color de Acento</Text>
                <Text style={styles.optionSubtitle}>Personaliza el color principal</Text>
              </View>
              <View style={styles.colorPalette}>
                {(['coral', 'lavender', 'mint', 'sunset'] as const).map((accent) => (
                  <TouchableOpacity
                    key={accent}
                    style={[
                      styles.colorOption,
                      { backgroundColor: getAccentColor(accent) },
                      config.appearance.themeAccent === accent && styles.colorOptionActive,
                    ]}
                    onPress={() => updateConfig('appearance', 'themeAccent', accent)}
                  >
                    {config.appearance.themeAccent === accent && (
                      <Text style={styles.colorCheckmark}>✓</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Animaciones */}
            <View style={styles.option}>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>✨ Animaciones</Text>
                <Text style={styles.optionSubtitle}>Habilitar efectos visuales</Text>
              </View>
              <Switch
                value={config.appearance.animationsEnabled}
                onValueChange={(value) => updateConfig('appearance', 'animationsEnabled', value)}
                trackColor={{
                  false: '#E5E7EB',
                  true: getAccentColor(config.appearance.themeAccent),
                }}
                thumbColor={'#FFFFFF'}
              />
            </View>
          </View>

          {/* 🧮 SECCIÓN DE CÁLCULO */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🧮 Motor de Cálculo</Text>
            
            {/* Preferencia de Engine */}
            <View style={styles.option}>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>⚡ Motor de Cálculo</Text>
                <Text style={styles.optionSubtitle}>
                  {config.calculation.enginePreference === 'auto' && 'Selección automática optimizada'}
                  {config.calculation.enginePreference === 'standard' && 'Motor estándar (rápido)'}
                  {config.calculation.enginePreference === 'premium' && 'Motor premium (preciso)'}
                  {config.calculation.enginePreference === 'unified' && 'Motor unificado (balanceado)'}
                </Text>
              </View>
              <View style={styles.segmentedControl}>
                {(['auto', 'standard', 'premium', 'unified'] as const).map((engine) => (
                  <TouchableOpacity
                    key={engine}
                    style={[
                      styles.segmentButton,
                      config.calculation.enginePreference === engine && styles.segmentButtonActive,
                    ]}
                    onPress={() => updateConfig('calculation', 'enginePreference', engine)}
                  >
                    <Text
                      style={[
                        styles.segmentText,
                        config.calculation.enginePreference === engine && styles.segmentTextActive,
                      ]}
                    >
                      {engine === 'auto' && '🔄'}
                      {engine === 'standard' && '⚡'}
                      {engine === 'premium' && '💎'}
                      {engine === 'unified' && '🎯'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Modo de Performance */}
            <View style={styles.option}>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>🚀 Modo de Performance</Text>
                <Text style={styles.optionSubtitle}>
                  {config.calculation.performanceMode === 'speed' && 'Priorizar velocidad'}
                  {config.calculation.performanceMode === 'balanced' && 'Equilibrio velocidad-precisión'}
                  {config.calculation.performanceMode === 'accuracy' && 'Máxima precisión'}
                </Text>
              </View>
              <View style={styles.segmentedControl}>
                {(['speed', 'balanced', 'accuracy'] as const).map((mode) => (
                  <TouchableOpacity
                    key={mode}
                    style={[
                      styles.segmentButton,
                      config.calculation.performanceMode === mode && styles.segmentButtonActive,
                    ]}
                    onPress={() => updateConfig('calculation', 'performanceMode', mode)}
                  >
                    <Text
                      style={[
                        styles.segmentText,
                        config.calculation.performanceMode === mode && styles.segmentTextActive,
                      ]}
                    >
                      {mode === 'speed' && '⚡'}
                      {mode === 'balanced' && '⚖️'}
                      {mode === 'accuracy' && '🎯'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Cache Habilitado */}
            <View style={styles.option}>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>💾 Cache Inteligente</Text>
                <Text style={styles.optionSubtitle}>Acelera cálculos guardando resultados</Text>
              </View>
              <Switch
                value={config.calculation.cacheEnabled}
                onValueChange={(value) => updateConfig('calculation', 'cacheEnabled', value)}
                trackColor={{
                  false: '#E5E7EB',
                  true: getAccentColor(config.appearance.themeAccent),
                }}
                thumbColor={'#FFFFFF'}
              />
            </View>

            {/* Optimizaciones Inteligentes */}
            <View style={styles.option}>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>🧠 Optimizaciones IA</Text>
                <Text style={styles.optionSubtitle}>Mejoras automáticas basadas en uso</Text>
              </View>
              <Switch
                value={config.calculation.smartOptimizations}
                onValueChange={(value) => updateConfig('calculation', 'smartOptimizations', value)}
                trackColor={{
                  false: '#E5E7EB',
                  true: getAccentColor(config.appearance.themeAccent),
                }}
                thumbColor={'#FFFFFF'}
              />
            </View>
          </View>

          {/* 🏥 SECCIÓN MÉDICA */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🏥 Configuración Médica</Text>
            
            {/* Unidades */}
            <View style={styles.option}>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>📏 Sistema de Unidades</Text>
                <Text style={styles.optionSubtitle}>
                  {config.medical.units === 'metric' ? 'Sistema métrico (kg, cm)' : 'Sistema imperial (lb, in)'}
                </Text>
              </View>
              <View style={styles.toggleContainer}>
                <TouchableOpacity
                  style={[
                    styles.toggleOption,
                    config.medical.units === 'metric' && styles.toggleOptionActive,
                  ]}
                  onPress={() => updateConfig('medical', 'units', 'metric')}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      config.medical.units === 'metric' && styles.toggleTextActive,
                    ]}
                  >
                    Métrico
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toggleOption,
                    config.medical.units === 'imperial' && styles.toggleOptionActive,
                  ]}
                  onPress={() => updateConfig('medical', 'units', 'imperial')}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      config.medical.units === 'imperial' && styles.toggleTextActive,
                    ]}
                  >
                    Imperial
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Terminología Médica */}
            <View style={styles.option}>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>🔬 Terminología Médica</Text>
                <Text style={styles.optionSubtitle}>
                  {config.medical.medicalTerminology === 'simple' 
                    ? 'Lenguaje sencillo y comprensible'
                    : 'Terminología técnica profesional'}
                </Text>
              </View>
              <View style={styles.toggleContainer}>
                <TouchableOpacity
                  style={[
                    styles.toggleOption,
                    config.medical.medicalTerminology === 'simple' && styles.toggleOptionActive,
                  ]}
                  onPress={() => updateConfig('medical', 'medicalTerminology', 'simple')}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      config.medical.medicalTerminology === 'simple' && styles.toggleTextActive,
                    ]}
                  >
                    Simple
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toggleOption,
                    config.medical.medicalTerminology === 'technical' && styles.toggleOptionActive,
                  ]}
                  onPress={() => updateConfig('medical', 'medicalTerminology', 'technical')}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      config.medical.medicalTerminology === 'technical' && styles.toggleTextActive,
                    ]}
                  >
                    Técnico
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Tolerancia al Riesgo */}
            <View style={styles.option}>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>⚖️ Perfil de Riesgo</Text>
                <Text style={styles.optionSubtitle}>
                  {config.medical.riskTolerance === 'conservative' && 'Enfoque conservador'}
                  {config.medical.riskTolerance === 'moderate' && 'Enfoque equilibrado'}
                  {config.medical.riskTolerance === 'aggressive' && 'Enfoque optimizado'}
                </Text>
              </View>
              <View style={styles.segmentedControl}>
                {(['conservative', 'moderate', 'aggressive'] as const).map((risk) => (
                  <TouchableOpacity
                    key={risk}
                    style={[
                      styles.segmentButton,
                      config.medical.riskTolerance === risk && styles.segmentButtonActive,
                    ]}
                    onPress={() => updateConfig('medical', 'riskTolerance', risk)}
                  >
                    <Text
                      style={[
                        styles.segmentText,
                        config.medical.riskTolerance === risk && styles.segmentTextActive,
                      ]}
                    >
                      {risk === 'conservative' && '🛡️'}
                      {risk === 'moderate' && '⚖️'}
                      {risk === 'aggressive' && '🚀'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Referencias Médicas */}
            <View style={styles.option}>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>📚 Referencias Científicas</Text>
                <Text style={styles.optionSubtitle}>Mostrar estudios y fuentes médicas</Text>
              </View>
              <Switch
                value={config.medical.showMedicalReferences}
                onValueChange={(value) => updateConfig('medical', 'showMedicalReferences', value)}
                trackColor={{
                  false: '#E5E7EB',
                  true: getAccentColor(config.appearance.themeAccent),
                }}
                thumbColor={'#FFFFFF'}
              />
            </View>
          </View>

          {/* 🔔 SECCIÓN DE NOTIFICACIONES */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔔 Notificaciones Inteligentes</Text>
            
            {/* Notificaciones Push */}
            <View style={styles.option}>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>📱 Notificaciones Push</Text>
                <Text style={styles.optionSubtitle}>Habilitar notificaciones del sistema</Text>
              </View>
              <Switch
                value={config.notifications.pushEnabled}
                onValueChange={(value) => updateConfig('notifications', 'pushEnabled', value)}
                trackColor={{
                  false: '#E5E7EB',
                  true: getAccentColor(config.appearance.themeAccent),
                }}
                thumbColor={'#FFFFFF'}
              />
            </View>

            {/* Recordatorios */}
            <View style={styles.option}>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>💊 Recordatorios de Salud</Text>
                <Text style={styles.optionSubtitle}>Citas, medicamentos y seguimiento</Text>
              </View>
              <Switch
                value={config.notifications.reminders}
                onValueChange={(value) => updateConfig('notifications', 'reminders', value)}
                trackColor={{
                  false: '#E5E7EB',
                  true: getAccentColor(config.appearance.themeAccent),
                }}
                thumbColor={'#FFFFFF'}
              />
            </View>

            {/* Insights */}
            <View style={styles.option}>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>💡 Insights Personalizados</Text>
                <Text style={styles.optionSubtitle}>Consejos basados en tus datos</Text>
              </View>
              <Switch
                value={config.notifications.insights}
                onValueChange={(value) => updateConfig('notifications', 'insights', value)}
                trackColor={{
                  false: '#E5E7EB',
                  true: getAccentColor(config.appearance.themeAccent),
                }}
                thumbColor={'#FFFFFF'}
              />
            </View>
          </View>

          {/* 🎯 SECCIÓN DE EXPERIENCIA */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎯 Experiencia de Usuario</Text>
            
            {/* Consejos Inteligentes */}
            <View style={styles.option}>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>💡 Consejos Inteligentes</Text>
                <Text style={styles.optionSubtitle}>Ayudas contextuales dinámicas</Text>
              </View>
              <Switch
                value={config.ux.smartHints}
                onValueChange={(value) => updateConfig('ux', 'smartHints', value)}
                trackColor={{
                  false: '#E5E7EB',
                  true: getAccentColor(config.appearance.themeAccent),
                }}
                thumbColor={'#FFFFFF'}
              />
            </View>

            {/* Animaciones de Progreso */}
            <View style={styles.option}>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>📊 Animaciones de Progreso</Text>
                <Text style={styles.optionSubtitle}>Visualización animada del progreso</Text>
              </View>
              <Switch
                value={config.ux.progressAnimations}
                onValueChange={(value) => updateConfig('ux', 'progressAnimations', value)}
                trackColor={{
                  false: '#E5E7EB',
                  true: getAccentColor(config.appearance.themeAccent),
                }}
                thumbColor={'#FFFFFF'}
              />
            </View>

            {/* Feedback Háptico */}
            {Platform.OS === 'ios' && (
              <View style={styles.option}>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>📳 Feedback Háptico</Text>
                  <Text style={styles.optionSubtitle}>Vibraciones sutiles de confirmación</Text>
                </View>
                <Switch
                  value={config.ux.hapticFeedback}
                  onValueChange={(value) => updateConfig('ux', 'hapticFeedback', value)}
                  trackColor={{
                    false: '#E5E7EB',
                    true: getAccentColor(config.appearance.themeAccent),
                  }}
                  thumbColor={'#FFFFFF'}
                />
              </View>
            )}

            {/* Auto-guardado */}
            <View style={styles.option}>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>💾 Auto-guardado</Text>
                <Text style={styles.optionSubtitle}>Guardar automáticamente el progreso</Text>
              </View>
              <Switch
                value={config.ux.autoSave}
                onValueChange={(value) => updateConfig('ux', 'autoSave', value)}
                trackColor={{
                  false: '#E5E7EB',
                  true: getAccentColor(config.appearance.themeAccent),
                }}
                thumbColor={'#FFFFFF'}
              />
            </View>
          </View>

          {/* 💾 SECCIÓN DE PRIVACIDAD */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔒 Privacidad y Datos</Text>
            
            {/* Retención de Datos */}
            <View style={styles.option}>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>📅 Retención de Datos</Text>
                <Text style={styles.optionSubtitle}>
                  {config.privacy.dataRetention === 'session' && 'Solo durante la sesión'}
                  {config.privacy.dataRetention === '30days' && 'Conservar 30 días'}
                  {config.privacy.dataRetention === '1year' && 'Conservar 1 año'}
                  {config.privacy.dataRetention === 'indefinite' && 'Conservar indefinidamente'}
                </Text>
              </View>
              <View style={styles.segmentedControl}>
                {(['session', '30days', '1year', 'indefinite'] as const).map((retention) => (
                  <TouchableOpacity
                    key={retention}
                    style={[
                      styles.segmentButton,
                      config.privacy.dataRetention === retention && styles.segmentButtonActive,
                    ]}
                    onPress={() => updateConfig('privacy', 'dataRetention', retention)}
                  >
                    <Text
                      style={[
                        styles.segmentText,
                        config.privacy.dataRetention === retention && styles.segmentTextActive,
                      ]}
                    >
                      {retention === 'session' && '⏰'}
                      {retention === '30days' && '📅'}
                      {retention === '1year' && '🗓️'}
                      {retention === 'indefinite' && '∞'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Encriptación */}
            <View style={styles.option}>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>🔐 Encriptación Local</Text>
                <Text style={styles.optionSubtitle}>Proteger datos con encriptación</Text>
              </View>
              <Switch
                value={config.privacy.encryptData}
                onValueChange={(value) => updateConfig('privacy', 'encryptData', value)}
                trackColor={{
                  false: '#E5E7EB',
                  true: getAccentColor(config.appearance.themeAccent),
                }}
                thumbColor={'#FFFFFF'}
              />
            </View>

            {/* Analytics */}
            <View style={styles.option}>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>📊 Análisis de Uso</Text>
                <Text style={styles.optionSubtitle}>Ayudar a mejorar la app (anónimo)</Text>
              </View>
              <Switch
                value={config.privacy.analyticsEnabled}
                onValueChange={(value) => updateConfig('privacy', 'analyticsEnabled', value)}
                trackColor={{
                  false: '#E5E7EB',
                  true: getAccentColor(config.appearance.themeAccent),
                }}
                thumbColor={'#FFFFFF'}
              />
            </View>
          </View>

          {/* 📤 SECCIÓN DE GESTIÓN */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📋 Gestión de Configuración</Text>
            
            <TouchableOpacity style={styles.actionOption} onPress={handleExportConfig}>
              <Text style={styles.optionTitle}>📤 Exportar Configuración</Text>
              <Text style={styles.optionSubtitle}>Crear respaldo de tus preferencias</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionOption} onPress={handleImportConfig}>
              <Text style={styles.optionTitle}>📥 Importar Configuración</Text>
              <Text style={styles.optionSubtitle}>Restaurar configuración guardada</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionOption} onPress={handleResetConfig}>
              <Text style={[styles.optionTitle, styles.dangerText]}>🔄 Restablecer Todo</Text>
              <Text style={styles.optionSubtitle}>Volver a configuración por defecto</Text>
            </TouchableOpacity>
          </View>

          {/* Espaciado inferior */}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </View>
    </Modal>
  );
};

// 🎨 ESTILOS DINÁMICOS
const createStyles = (theme: ReturnType<typeof useDynamicTheme>) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.secondary,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  closeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  resetButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  resetText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'Lato-Bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 15,
    fontFamily: 'Lato-Bold',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: theme.isDark ? theme.colors.black : '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: theme.isDark ? 0.3 : 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    fontFamily: 'Lato-Bold',
  },
  optionSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 2,
    fontFamily: 'Lato-Regular',
  },
  actionOption: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: theme.isDark ? theme.colors.black : '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: theme.isDark ? 0.3 : 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dangerText: {
    color: theme.colors.error,
  },
  
  // 🎯 CONTROLES SEGMENTADOS
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: theme.colors.border,
    borderRadius: 8,
    padding: 2,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentButtonActive: {
    backgroundColor: theme.colors.surface,
    shadowColor: theme.colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  segmentTextActive: {
    color: theme.colors.text,
  },

  // 🎨 PALETA DE COLORES
  colorPalette: {
    flexDirection: 'row',
    gap: 8,
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorOptionActive: {
    borderColor: '#FFFFFF',
  },
  colorCheckmark: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // 🔄 TOGGLE CONTAINER
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.border,
    borderRadius: 8,
    padding: 2,
  },
  toggleOption: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleOptionActive: {
    backgroundColor: theme.colors.surface,
  },
  toggleText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: theme.colors.text,
  },

  bottomSpacer: {
    height: 40,
  },
});
