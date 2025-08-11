/**
 * 🏥 AVISO MÉDICO (MEDICAL DISCLAIMER)
 * 
 * Documento legal crítico para apps médicas en App Store
 */

import React from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { theme as designTheme } from '@/config/theme';

export default function MedicalDisclaimerScreen() {
  const { isDark } = useTheme();
  const { t } = useLanguage();

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      {/* Header */}
      <LinearGradient
        colors={[designTheme.colors.primary, designTheme.colors.secondary]}
        style={styles.header}
      >
        <Ionicons name="medical" size={32} color="white" />
        <Text style={styles.headerTitle}>{t('medical_disclaimer.titulo')}</Text>
        <Text style={styles.headerSubtitle}>
          {t('medical_disclaimer.subtitulo')}
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Aviso Principal */}
        <View style={[styles.warningBox, isDark && styles.warningBoxDark]}>
          <Ionicons name="warning" size={24} color="#ff6b35" />
          <Text style={[styles.warningTitle, isDark && styles.textDark]}>
            {t('medical_disclaimer.aviso_critico')}
          </Text>
          <Text style={[styles.warningText, isDark && styles.subtitleDark]}>
            {t('medical_disclaimer.aviso_texto')}
          </Text>
        </View>

        {/* Propósito */}
        <View style={[styles.section, isDark && styles.sectionDark]}>
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
            {t('medical_disclaimer.proposito_titulo')}
          </Text>
          <Text style={[styles.sectionContent, isDark && styles.subtitleDark]}>
            {t('medical_disclaimer.proposito_contenido')}
          </Text>
        </View>

        {/* Limitaciones */}
        <View style={[styles.section, isDark && styles.sectionDark]}>
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
            {t('medical_disclaimer.limitaciones_titulo')}
          </Text>
          <Text style={[styles.sectionContent, isDark && styles.subtitleDark]}>
            {t('medical_disclaimer.limitaciones_contenido')}
          </Text>
        </View>

        {/* Consulta Médica */}
        <View style={[styles.section, isDark && styles.sectionDark]}>
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
            {t('medical_disclaimer.recomendaciones_titulo')}
          </Text>
          <Text style={[styles.sectionContent, isDark && styles.subtitleDark]}>
            {t('medical_disclaimer.recomendaciones_contenido')}
          </Text>
        </View>

        {/* Emergencias */}
        <View style={[styles.emergencyBox, isDark && styles.emergencyBoxDark]}>
          <Ionicons name="alert-circle" size={24} color="#dc3545" />
          <Text style={[styles.emergencyTitle, isDark && styles.textDark]}>
            {t('medical_disclaimer.emergencias_titulo')}
          </Text>
          <Text style={[styles.emergencyText, isDark && styles.subtitleDark]}>
            {t('medical_disclaimer.emergencias_contenido')}
          </Text>
        </View>

        {/* Responsabilidad */}
        <View style={[styles.section, isDark && styles.sectionDark]}>
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
            {t('medical_disclaimer.responsabilidad_titulo')}
          </Text>
          <Text style={[styles.sectionContent, isDark && styles.subtitleDark]}>
            {t('medical_disclaimer.responsabilidad_contenido')}
          </Text>
        </View>

        {/* Base Científica */}
        <View style={[styles.section, isDark && styles.sectionDark]}>
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
            {t('medical_disclaimer.base_cientifica_titulo')}
          </Text>
          <Text style={[styles.sectionContent, isDark && styles.subtitleDark]}>
            {t('medical_disclaimer.base_cientifica_contenido')}
          </Text>
        </View>

        {/* Edad y Uso */}
        <View style={[styles.section, isDark && styles.sectionDark]}>
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
            {t('medical_disclaimer.restriccion_edad_titulo')}
          </Text>
          <Text style={[styles.sectionContent, isDark && styles.subtitleDark]}>
            {t('medical_disclaimer.restriccion_edad_contenido')}
          </Text>
        </View>

        {/* Contacto Médico */}
        <View style={[styles.contactBox, isDark && styles.contactBoxDark]}>
          <Ionicons name="medical" size={24} color={designTheme.colors.primary} />
          <Text style={[styles.contactTitle, isDark && styles.textDark]}>
            {t('medical_disclaimer.recomendacion_final_titulo')}
          </Text>
          <Text style={[styles.contactText, isDark && styles.subtitleDark]}>
            {t('medical_disclaimer.recomendacion_final_contenido')}
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, isDark && styles.subtitleDark]}>
            {t('medical_disclaimer.footer_aviso')}
          </Text>
          <Text style={[styles.footerText, isDark && styles.subtitleDark, { marginTop: 10 }]}>
            {t('medical_disclaimer.footer_copyright')}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  
  // Warning Box
  warningBox: {
    backgroundColor: '#fff3cd',
    borderRadius: 12,
    padding: 20,
    marginVertical: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ff6b35',
  },
  warningBoxDark: {
    backgroundColor: '#2d1b00',
    borderColor: '#ff6b35',
  },
  warningTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    marginBottom: 12,
    textAlign: 'center',
  },
  warningText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  
  // Emergency Box
  emergencyBox: {
    backgroundColor: '#f8d7da',
    borderRadius: 12,
    padding: 20,
    marginVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#dc3545',
  },
  emergencyBoxDark: {
    backgroundColor: '#2d0a0e',
    borderColor: '#dc3545',
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    marginBottom: 12,
    textAlign: 'center',
  },
  emergencyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  
  // Contact Box
  contactBox: {
    backgroundColor: '#e7f3ff',
    borderRadius: 12,
    padding: 20,
    marginVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: designTheme.colors.primary,
  },
  contactBoxDark: {
    backgroundColor: '#0a1929',
    borderColor: designTheme.colors.primary,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    marginBottom: 12,
    textAlign: 'center',
  },
  contactText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  
  // Sections
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionDark: {
    backgroundColor: '#1e1e1e',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  sectionContent: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  
  // Footer
  footer: {
    paddingVertical: 30,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
  
  // Dark theme
  textDark: {
    color: '#fff',
  },
  subtitleDark: {
    color: '#aaa',
  },
});