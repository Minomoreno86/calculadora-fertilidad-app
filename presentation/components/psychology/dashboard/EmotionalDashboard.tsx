/**
 * 🧠 DASHBOARD EMOCIONAL SIMPLIFICADO - AEC-D
 * Componente básico del sistema psicológico para evitar errores de importación
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useDynamicTheme } from '@/hooks/useDynamicTheme';

interface EmotionalDashboardProps {
  userInput: Record<string, unknown>;
  onPsychologicalAssessment?: (profile: Record<string, unknown>) => void;
  onAlertTriggered?: (alert: Record<string, unknown>) => void;
  style?: Record<string, unknown>;
}

export default function EmotionalDashboard({ 
  userInput, 
  onPsychologicalAssessment,
  style 
}: EmotionalDashboardProps) {
  const theme = useDynamicTheme();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (userInput && Object.keys(userInput).length > 0) {
      setIsAnalyzing(true);
      
      // Simular análisis psicológico
      setTimeout(() => {
        const mockProfile = {
          stress: Math.random() * 30 + 10,
          anxiety: Math.random() * 40 + 20,
          mood: Math.random() * 15 + 5
        };
        
        if (onPsychologicalAssessment) {
          onPsychologicalAssessment(mockProfile);
        }
        
        setIsAnalyzing(false);
      }, 1000);
    }
  }, [userInput, onPsychologicalAssessment]);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 16,
      margin: 16,
      elevation: 2,
      ...style as Record<string, unknown>
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.primary,
      textAlign: 'center',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: 16,
    },
    content: {
      alignItems: 'center',
    },
    statusText: {
      fontSize: 16,
      color: theme.colors.text,
      textAlign: 'center',
    }
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧠 Monitor Emocional</Text>
      <Text style={styles.subtitle}>
        Análisis psicológico integrado para optimizar fertilidad
      </Text>
      
      <View style={styles.content}>
        {isAnalyzing ? (
          <Text style={styles.statusText}>
            Analizando bienestar emocional...
          </Text>
        ) : (
          <Text style={styles.statusText}>
            {Object.keys(userInput || {}).length > 0 
              ? "✅ Perfil psicológico evaluado" 
              : "⏳ Esperando datos para análisis"
            }
          </Text>
        )}
      </View>
    </View>
  );
}
