/**
 * ©️ PÁGINA DE DERECHOS DE AUTOR
 */

import React from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { theme as designTheme } from '@/config/theme';

export default function CopyrightScreen() {
  const { isDark } = useTheme();
  const { t } = useLanguage();

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      {/* Header */}
      <LinearGradient
        colors={[designTheme.colors.primary, designTheme.colors.secondary]}
        style={styles.header}
      >
        <Ionicons name="shield-checkmark" size={32} color="white" />
        <Text style={styles.headerTitle}>{t('copyright.titulo')}</Text>
        <Text style={styles.headerSubtitle}>
          {t('copyright.subtitulo')}
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Autor Principal */}
        <View style={[styles.section, isDark && styles.sectionDark]}>
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
            {t('copyright.autor_principal_titulo')}
          </Text>
          <Text style={[styles.sectionContent, isDark && styles.subtitleDark]}>
            {t('copyright.autor_principal_contenido')}
          </Text>
        </View>

        {/* Copyright */}
        <View style={[styles.section, isDark && styles.sectionDark]}>
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
            {t('copyright.derechos_reservados_titulo')}
          </Text>
          <Text style={[styles.sectionContent, isDark && styles.subtitleDark]}>
            {t('copyright.derechos_reservados_contenido')}
          </Text>
        </View>

        {/* Algoritmos Médicos */}
        <View style={[styles.section, isDark && styles.sectionDark]}>
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
            {t('copyright.algoritmos_medicos_titulo')}
          </Text>
          <Text style={[styles.sectionContent, isDark && styles.subtitleDark]}>
            {t('copyright.algoritmos_medicos_contenido')}
          </Text>
        </View>

        {/* Licencia de Uso */}
        <View style={[styles.section, isDark && styles.sectionDark]}>
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
            {t('copyright.licencia_uso_titulo')}
          </Text>
          <Text style={[styles.sectionContent, isDark && styles.subtitleDark]}>
            {t('copyright.licencia_uso_contenido')}
          </Text>
        </View>

        {/* Atribuciones */}
        <View style={[styles.section, isDark && styles.sectionDark]}>
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
            {t('copyright.atribuciones_titulo')}
          </Text>
          <Text style={[styles.sectionContent, isDark && styles.subtitleDark]}>
            {t('copyright.atribuciones_contenido')}
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, isDark && styles.subtitleDark]}>
            {t('copyright.footer_consultas')}
          </Text>
          <Text style={[styles.footerText, isDark && styles.subtitleDark, { marginTop: 10 }]}>
            {t('copyright.footer_email')}
          </Text>
          <Text style={[styles.footerText, isDark && styles.subtitleDark, { marginTop: 15 }]}>
            {t('copyright.footer_copyright')}
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
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginVertical: 10,
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
  bold: {
    fontWeight: 'bold',
    color: designTheme.colors.primary,
  },
  footer: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
  textDark: {
    color: '#fff',
  },
  subtitleDark: {
    color: '#aaa',
  },
});