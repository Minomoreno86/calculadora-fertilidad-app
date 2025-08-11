/**
 * 🔒 POLÍTICA DE PRIVACIDAD
 * 
 * Documento legal requerido para App Store
 */

import React from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { theme as designTheme } from '@/config/theme';

export default function PrivacyPolicyScreen() {
  const { isDark } = useTheme();
  const { t } = useLanguage();

  const sections = [
    {
      title: t('privacy.informacion_titulo'),
      content: t('privacy.informacion_contenido')
    },
    {
      title: t('privacy.proteccion_titulo'),
      content: t('privacy.proteccion_contenido')
    },
    {
      title: t('privacy.almacenamiento_titulo'),
      content: t('privacy.almacenamiento_contenido')
    },
    {
      title: t('privacy.compartir_titulo'),
      content: t('privacy.compartir_contenido')
    },
    {
      title: t('privacy.tecnologias_titulo'),
      content: t('privacy.tecnologias_contenido')
    },
    {
      title: t('privacy.menores_titulo'),
      content: t('privacy.menores_contenido')
    },
    {
      title: t('privacy.transferencias_titulo'),
      content: t('privacy.transferencias_contenido')
    },
    {
      title: t('privacy.derechos_titulo'),
      content: t('privacy.derechos_contenido')
    },
    {
      title: t('privacy.contacto_titulo'),
      content: t('privacy.contacto_contenido')
    }
  ];

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      {/* Header */}
      <LinearGradient
        colors={[designTheme.colors.primary, designTheme.colors.secondary]}
        style={styles.header}
      >
        <Ionicons name="shield-checkmark" size={32} color="white" />
        <Text style={styles.headerTitle}>{t('privacy.titulo')}</Text>
        <Text style={styles.headerSubtitle}>
          {t('privacy.subtitulo')}
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.lastUpdated, isDark && styles.textDark]}>
          {t('privacy.ultima_actualizacion')}
        </Text>

        {sections.map((section, index) => (
          <View key={index} style={[styles.section, isDark && styles.sectionDark]}>
            <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
              {section.title}
            </Text>
            <Text style={[styles.sectionContent, isDark && styles.subtitleDark]}>
              {section.content}
            </Text>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={[styles.footerText, isDark && styles.subtitleDark]}>
            © 2024 Dr Jorge Vasquez R. - Todos los derechos reservados
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
  footer: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  textDark: {
    color: '#fff',
  },
  subtitleDark: {
    color: '#aaa',
  },
});