/**
 * 📋 TÉRMINOS DE SERVICIO
 * 
 * Documento legal para App Store compliance
 */

import React from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { theme as designTheme } from '@/config/theme';

export default function TermsOfServiceScreen() {
  const { isDark } = useTheme();
  const { t } = useLanguage();

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      {/* Header */}
      <LinearGradient
        colors={[designTheme.colors.primary, designTheme.colors.secondary]}
        style={styles.header}
      >
        <Ionicons name="document-text" size={32} color="white" />
        <Text style={styles.headerTitle}>{t('terms.titulo')}</Text>
        <Text style={styles.headerSubtitle}>
          {t('terms.subtitulo')}
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.lastUpdated, isDark && styles.textDark]}>
          {t('terms.ultima_actualizacion')}
        </Text>

        {/* Aceptación */}
        <View style={[styles.section, isDark && styles.sectionDark]}>
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
            {t('terms.aceptacion_titulo')}
          </Text>
          <Text style={[styles.sectionContent, isDark && styles.subtitleDark]}>
            {t('terms.aceptacion_contenido')}
          </Text>
        </View>

        {/* Descripción del Servicio */}
        <View style={[styles.section, isDark && styles.sectionDark]}>
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
            {t('terms.descripcion_titulo')}
          </Text>
          <Text style={[styles.sectionContent, isDark && styles.subtitleDark]}>
            {t('terms.descripcion_contenido')}
          </Text>
        </View>

        {/* Responsabilidades del Usuario */}
        <View style={[styles.section, isDark && styles.sectionDark]}>
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
            {t('terms.responsabilidades_titulo')}
          </Text>
          <Text style={[styles.sectionContent, isDark && styles.subtitleDark]}>
            {t('terms.responsabilidades_contenido')}
          </Text>
        </View>

        {/* Restricciones de Uso */}
        <View style={[styles.section, isDark && styles.sectionDark]}>
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
            {t('terms.restricciones_titulo')}
          </Text>
          <Text style={[styles.sectionContent, isDark && styles.subtitleDark]}>
            {t('terms.restricciones_contenido')}
          </Text>
        </View>

        {/* Propiedad Intelectual */}
        <View style={[styles.section, isDark && styles.sectionDark]}>
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
            {t('terms.propiedad_intelectual_titulo')}
          </Text>
          <Text style={[styles.sectionContent, isDark && styles.subtitleDark]}>
            {t('terms.propiedad_intelectual_contenido')}
          </Text>
        </View>

        {/* Limitación de Responsabilidad */}
        <View style={[styles.warningSection, isDark && styles.warningSectionDark]}>
          <Ionicons name="warning" size={24} color="#ff6b35" />
          <Text style={[styles.warningTitle, isDark && styles.textDark]}>
            {t('terms.limitaciones_titulo')}
          </Text>
          <Text style={[styles.warningContent, isDark && styles.subtitleDark]}>
            {t('terms.limitaciones_contenido')}
          </Text>
        </View>

        {/* Privacidad */}
        <View style={[styles.section, isDark && styles.sectionDark]}>
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
            {t('terms.privacidad_titulo')}
          </Text>
          <Text style={[styles.sectionContent, isDark && styles.subtitleDark]}>
            {t('terms.privacidad_contenido')}
          </Text>
        </View>

        {/* Actualizaciones */}
        <View style={[styles.section, isDark && styles.sectionDark]}>
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
            {t('terms.actualizaciones_titulo')}
          </Text>
          <Text style={[styles.sectionContent, isDark && styles.subtitleDark]}>
            {t('terms.actualizaciones_contenido')}
          </Text>
        </View>

        {/* Jurisdicción */}
        <View style={[styles.section, isDark && styles.sectionDark]}>
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
            {t('terms.jurisdiccion_titulo')}
          </Text>
          <Text style={[styles.sectionContent, isDark && styles.subtitleDark]}>
            {t('terms.jurisdiccion_contenido')}
          </Text>
        </View>

        {/* Contacto */}
        <View style={[styles.contactSection, isDark && styles.contactSectionDark]}>
          <Ionicons name="mail" size={24} color={designTheme.colors.primary} />
          <Text style={[styles.contactTitle, isDark && styles.textDark]}>
            {t('terms.contacto_legal_titulo')}
          </Text>
          <Text style={[styles.contactContent, isDark && styles.subtitleDark]}>
            {t('terms.contacto_legal_contenido')}
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, isDark && styles.subtitleDark]}>
            {t('terms.footer_aceptacion')}
          </Text>
          <Text style={[styles.footerText, isDark && styles.subtitleDark, { marginTop: 15 }]}>
            {t('terms.footer_copyright')}
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
  lastUpdated: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginVertical: 20,
    fontStyle: 'italic',
  },
  
  // Regular sections
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
  
  // Warning section
  warningSection: {
    backgroundColor: '#fff3cd',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ff6b35',
  },
  warningSectionDark: {
    backgroundColor: '#2d1b00',
    borderColor: '#ff6b35',
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    marginBottom: 12,
    textAlign: 'center',
  },
  warningContent: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  
  // Contact section
  contactSection: {
    backgroundColor: '#e7f3ff',
    borderRadius: 12,
    padding: 20,
    marginVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: designTheme.colors.primary,
  },
  contactSectionDark: {
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
  contactContent: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
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