/**
 * 🦠 COMPONENTE EVALUACIÓN AUTOINMUNE - AEC-D
 * Sistema de detección y análisis de enfermedades autoinmunes
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useDynamicTheme } from '@/hooks/useDynamicTheme';
import type { AutoimmuneProfile, AutoimmuneAlert } from '../types/AutoimmuneTypes';

interface AutoimmuneAssessmentProps {
  userInput: any;
  onAutoimmuneProfile?: (profile: AutoimmuneProfile) => void;
  onRiskAlert?: (alert: AutoimmuneAlert) => void;
  style?: any;
}

export default function AutoimmuneAssessment({ 
  userInput, 
  onAutoimmuneProfile,
  onRiskAlert,
  style 
}: AutoimmuneAssessmentProps) {
  const theme = useDynamicTheme();
  const [autoimmuneProfile, setAutoimmuneProfile] = useState<AutoimmuneProfile | null>(null);
  const [riskLevel, setRiskLevel] = useState<'low' | 'moderate' | 'high' | 'critical'>('low');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (userInput) {
      analyzeAutoimmuneRisk();
    }
  }, [userInput]);

  const analyzeAutoimmuneRisk = async () => {
    setIsAnalyzing(true);
    
    try {
      // Simular análisis de riesgo autoinmune basado en datos clínicos
      const profile: AutoimmuneProfile = {
        patientId: 'current-user',
        date: new Date(),
        conditions: {
          thyroid: {
            suspected: checkThyroidRisk(userInput),
            tsh: userInput.tsh || null,
            antiTPO: false,
            treatment: 'none',
            controlled: true
          },
          antiphospholipid: {
            suspected: checkAntiphospholipidRisk(userInput),
            lupusAnticoagulant: false,
            antiCardiolipin: false,
            antiBeta2GP1: false,
            diagnosed: false
          },
          lupus: {
            suspected: false,
            ana: false,
            antiDsDNA: 0,
            activity: 'remission',
            renalInvolvement: false
          }
        },
        overallRisk: 'low',
        recommendations: [],
        nextEvaluation: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      };

      // Calcular riesgo general
      const calculatedRisk = calculateOverallRisk(profile);
      profile.overallRisk = calculatedRisk;
      profile.recommendations = generateRecommendations(profile);

      setAutoimmuneProfile(profile);
      setRiskLevel(calculatedRisk);

      if (onAutoimmuneProfile) {
        onAutoimmuneProfile(profile);
      }

      // Generar alertas si es necesario
      if (calculatedRisk === 'high' || calculatedRisk === 'critical') {
        const alert: AutoimmuneAlert = {
          id: 'autoimmune-risk-alert',
          type: 'screening-required',
          urgency: calculatedRisk === 'critical' ? 'urgent' : 'high',
          title: 'Evaluación Autoinmune Recomendada',
          message: 'Los datos sugieren posible riesgo autoinmune que puede afectar la fertilidad',
          actionRequired: 'Solicitar evaluación inmunológica completa',
          timeline: calculatedRisk === 'critical' ? 'Inmediato' : '2-4 semanas'
        };

        if (onRiskAlert) {
          onRiskAlert(alert);
        }
      }

    } catch (error) {
      console.error('Error analizando riesgo autoinmune:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 🧮 Funciones de análisis de riesgo
  const checkThyroidRisk = (input: any): boolean => {
    // Factores de riesgo tiroideo
    const riskFactors = [
      input.age >= 35,
      input.irregularCycles === true,
      input.infertilityDuration >= 12,
      input.previousMiscarriages >= 2,
      input.familyHistoryThyroid === true
    ];
    
    return riskFactors.filter(Boolean).length >= 2;
  };

  const checkAntiphospholipidRisk = (input: any): boolean => {
    // Factores de riesgo SAF
    return input.recurrentMiscarriages >= 3 || 
           input.thrombosisHistory === true ||
           input.preeclampsiaHistory === true;
  };

  const calculateOverallRisk = (profile: AutoimmuneProfile): 'low' | 'moderate' | 'high' | 'critical' => {
    let riskScore = 0;
    
    if (profile.conditions.thyroid.suspected) riskScore += 2;
    if (profile.conditions.antiphospholipid.suspected) riskScore += 3;
    if (profile.conditions.lupus.suspected) riskScore += 3;
    
    if (riskScore >= 6) return 'critical';
    if (riskScore >= 4) return 'high';
    if (riskScore >= 2) return 'moderate';
    return 'low';
  };

  const generateRecommendations = (profile: AutoimmuneProfile): string[] => {
    const recommendations: string[] = [];
    
    if (profile.conditions.thyroid.suspected) {
      recommendations.push('Solicitar TSH, Anti-TPO y T4 libre');
    }
    
    if (profile.conditions.antiphospholipid.suspected) {
      recommendations.push('Evaluación coagulación: Anticoagulante lúpico, Anti-cardiolipina, Anti-β2GP1');
    }
    
    if (profile.overallRisk === 'high' || profile.overallRisk === 'critical') {
      recommendations.push('Interconsulta con inmunología/reumatología');
      recommendations.push('Considerar retrasar tratamientos fertilidad hasta evaluación');
    }
    
    return recommendations;
  };

  const getRiskColor = () => {
    switch (riskLevel) {
      case 'low': return theme.colors.success;
      case 'moderate': return theme.colors.warning;
      case 'high': return theme.colors.error;
      case 'critical': return '#d32f2f';
      default: return theme.colors.textSecondary;
    }
  };

  const getRiskIcon = () => {
    switch (riskLevel) {
      case 'low': return '✅';
      case 'moderate': return '⚠️';
      case 'high': return '🚨';
      case 'critical': return '🔴';
      default: return '❓';
    }
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.spacing.m,
      padding: theme.spacing.card,
      margin: theme.spacing.screen,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      ...style
    },
    header: {
      marginBottom: theme.spacing.m,
      alignItems: 'center',
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginBottom: theme.spacing.xs,
    },
    subtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    riskContainer: {
      backgroundColor: getRiskColor() + '20',
      padding: theme.spacing.m,
      borderRadius: theme.spacing.s,
      marginBottom: theme.spacing.m,
      borderLeftWidth: 4,
      borderLeftColor: getRiskColor(),
    },
    riskHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    riskIcon: {
      fontSize: 24,
      marginRight: theme.spacing.s,
    },
    riskTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: getRiskColor(),
    },
    riskDescription: {
      fontSize: 14,
      color: theme.colors.text,
      lineHeight: 20,
    },
    conditionsContainer: {
      marginBottom: theme.spacing.m,
    },
    conditionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.s,
      backgroundColor: theme.colors.background,
      borderRadius: theme.spacing.xs,
      marginBottom: theme.spacing.xs,
    },
    conditionIcon: {
      fontSize: 20,
      marginRight: theme.spacing.s,
    },
    conditionContent: {
      flex: 1,
    },
    conditionName: {
      fontSize: 14,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    conditionStatus: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    recommendationsContainer: {
      marginTop: theme.spacing.s,
    },
    recommendationItem: {
      backgroundColor: theme.colors.info + '10',
      padding: theme.spacing.s,
      borderRadius: theme.spacing.xs,
      marginBottom: theme.spacing.xs,
      borderLeftWidth: 3,
      borderLeftColor: theme.colors.info,
    },
    recommendationText: {
      fontSize: 13,
      color: theme.colors.text,
      lineHeight: 18,
    },
    loadingContainer: {
      padding: theme.spacing.xl,
      alignItems: 'center',
    },
    loadingText: {
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.s,
    }
  });

  if (isAnalyzing) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Analizando riesgo autoinmune...</Text>
        </View>
      </View>
    );
  }

  if (!autoimmuneProfile) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🦠 Evaluación Autoinmune</Text>
        <Text style={styles.subtitle}>
          Análisis de enfermedades autoinmunes que pueden afectar la fertilidad
        </Text>
      </View>

      {/* 📊 Nivel de riesgo general */}
      <View style={styles.riskContainer}>
        <View style={styles.riskHeader}>
          <Text style={styles.riskIcon}>{getRiskIcon()}</Text>
          <Text style={styles.riskTitle}>
            Riesgo {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}
          </Text>
        </View>
        <Text style={styles.riskDescription}>
          {riskLevel === 'low' && 'Bajo riesgo de condiciones autoinmunes que afecten la fertilidad'}
          {riskLevel === 'moderate' && 'Riesgo moderado - Se recomienda evaluación adicional'}
          {riskLevel === 'high' && 'Alto riesgo - Evaluación inmunológica necesaria antes del tratamiento'}
          {riskLevel === 'critical' && 'Riesgo crítico - Evaluación urgente requerida'}
        </Text>
      </View>

      {/* 🔍 Condiciones evaluadas */}
      <View style={styles.conditionsContainer}>
        <Text style={[styles.title, { fontSize: 16 }]}>Condiciones Evaluadas</Text>
        
        <View style={styles.conditionItem}>
          <Text style={styles.conditionIcon}>🦋</Text>
          <View style={styles.conditionContent}>
            <Text style={styles.conditionName}>Función Tiroidea</Text>
            <Text style={styles.conditionStatus}>
              {autoimmuneProfile.conditions.thyroid.suspected ? 'Requiere evaluación' : 'Sin factores de riesgo'}
            </Text>
          </View>
        </View>

        <View style={styles.conditionItem}>
          <Text style={styles.conditionIcon}>🩸</Text>
          <View style={styles.conditionContent}>
            <Text style={styles.conditionName}>Síndrome Antifosfolípido</Text>
            <Text style={styles.conditionStatus}>
              {autoimmuneProfile.conditions.antiphospholipid.suspected ? 'Factores de riesgo presentes' : 'Sin indicadores'}
            </Text>
          </View>
        </View>

        <View style={styles.conditionItem}>
          <Text style={styles.conditionIcon}>🔴</Text>
          <View style={styles.conditionContent}>
            <Text style={styles.conditionName}>Lupus Eritematoso</Text>
            <Text style={styles.conditionStatus}>
              {autoimmuneProfile.conditions.lupus.suspected ? 'Evaluación recomendada' : 'Sin signos evidentes'}
            </Text>
          </View>
        </View>
      </View>

      {/* 💡 Recomendaciones */}
      {autoimmuneProfile.recommendations.length > 0 && (
        <View style={styles.recommendationsContainer}>
          <Text style={[styles.title, { fontSize: 16 }]}>Recomendaciones</Text>
          {autoimmuneProfile.recommendations.map((rec, index) => (
            <View key={index} style={styles.recommendationItem}>
              <Text style={styles.recommendationText}>• {rec}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
