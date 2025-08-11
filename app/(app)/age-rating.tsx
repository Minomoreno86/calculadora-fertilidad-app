/**
 * 🔞 CLASIFICACIÓN POR EDAD
 */

import React from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { theme as designTheme } from '@/config/theme';

export default function AgeRatingScreen() {
  const { isDark } = useTheme();
  const { t } = useLanguage();

      const ageRestrictions = [
      {
        age: '17+',
        reason: t('age_rating.restricciones.contenido_medico.razon'),
        description: t('age_rating.restricciones.contenido_medico.descripcion'),
      },
      {
        age: '17+',
        reason: t('age_rating.restricciones.terminologia_avanzada.razon'),
        description: t('age_rating.restricciones.terminologia_avanzada.descripcion'),
      },
      {
        age: '17+',
        reason: t('age_rating.restricciones.salud_reproductiva.razon'),
        description: t('age_rating.restricciones.salud_reproductiva.descripcion'),
      },
    ];

  // Arrays de ejemplos hardcodeados para evitar problemas de tipos de i18n
  const contentCategories = [
    {
      category: t('age_rating.categorias.informacion_medica.categoria'),
      level: t('age_rating.categorias.informacion_medica.nivel'),
      description: t('age_rating.categorias.informacion_medica.descripcion'),
      examples: [
        'Análisis hormonal (AMH, TSH, Prolactina)',
        'Evaluación de reserva ovárica',
        'Factores masculinos de fertilidad',
        'Condiciones ginecológicas (SOP, endometriosis)',
      ],
    },
    {
      category: t('age_rating.categorias.analisis_probabilisticos.categoria'),
      level: t('age_rating.categorias.analisis_probabilisticos.nivel'),
      description: t('age_rating.categorias.analisis_probabilisticos.descripcion'),
      examples: [
        'Probabilidades de embarazo natural',
        'Análisis de factores de riesgo',
        'Simulaciones de escenarios médicos',
        'Interpretación de datos clínicos',
      ],
    },
    {
      category: t('age_rating.categorias.inteligencia_artificial.categoria'),
      level: t('age_rating.categorias.inteligencia_artificial.nivel'),
      description: t('age_rating.categorias.inteligencia_artificial.descripcion'),
      examples: [
        'Dr. IA: Análisis neural personalizado',
        'Recomendaciones médicas automatizadas',
        'Interpretación contextual de resultados',
        'Sugerencias de tratamientos',
      ],
    },
    {
      category: t('age_rating.categorias.contenido_educativo.categoria'),
      level: t('age_rating.categorias.contenido_educativo.nivel'),
      description: t('age_rating.categorias.contenido_educativo.descripcion'),
      examples: [
        'Fisiología reproductiva',
        'Ciclos menstruales y ovulación',
        'Tratamientos de fertilidad',
        'Técnicas de reproducción asistida',
      ],
    },
  ];

  const guidelines = [
    {
      organization: t('age_rating.directrices.app_store.organizacion'),
      rating: t('age_rating.directrices.app_store.rating'),
      criteria: t('age_rating.directrices.app_store.criterios'),
    },
    {
      organization: t('age_rating.directrices.google_play.organizacion'),
      rating: t('age_rating.directrices.google_play.rating'),
      criteria: t('age_rating.directrices.google_play.criterios'),
    },
    {
      organization: t('age_rating.directrices.esrb.organizacion'),
      rating: t('age_rating.directrices.esrb.rating'),
      criteria: t('age_rating.directrices.esrb.criterios'),
    },
  ];

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      {/* Header */}
      <LinearGradient
        colors={[designTheme.colors.primary, designTheme.colors.secondary]}
        style={styles.header}
      >
        <Ionicons name="information-circle" size={32} color="white" />
        <Text style={styles.headerTitle}>{t('age_rating.titulo')}</Text>
        <Text style={styles.headerSubtitle}>
          {t('age_rating.clasificacion')} - {t('age_rating.contenido_medico')}
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Rating Principal */}
        <View style={[styles.ratingCard, isDark && styles.ratingCardDark]}>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>17+</Text>
          </View>
          <Text style={[styles.ratingTitle, isDark && styles.textDark]}>
            {t('age_rating.clasificacion_completa')}
          </Text>
          <Text style={[styles.ratingDescription, isDark && styles.subtitleDark]}>
            {t('age_rating.descripcion_clasificacion')}
          </Text>
        </View>

        {/* Razones de Clasificación */}
        <Text style={[styles.sectionHeader, isDark && styles.textDark]}>
          {t('age_rating.razones_clasificacion')}
        </Text>
        
        {ageRestrictions.map((restriction, index) => (
          <View key={index} style={[styles.restrictionCard, isDark && styles.restrictionCardDark]}>
            <View style={styles.restrictionHeader}>
              <View style={styles.restrictionBadge}>
                <Text style={styles.restrictionBadgeText}>{restriction.age}</Text>
              </View>
              <Text style={[styles.restrictionReason, isDark && styles.textDark]}>
                {restriction.reason}
              </Text>
            </View>
            <Text style={[styles.restrictionDescription, isDark && styles.subtitleDark]}>
              {restriction.description}
            </Text>
          </View>
        ))}

        {/* Categorías de Contenido */}
        <Text style={[styles.sectionHeader, isDark && styles.textDark, { marginTop: 30 }]}>
          {t('age_rating.categorias_contenido')}
        </Text>
        
        {contentCategories.map((category, index) => (
          <View key={index} style={[styles.categoryCard, isDark && styles.categoryCardDark]}>
            <View style={styles.categoryHeader}>
              <Text style={[styles.categoryTitle, isDark && styles.textDark]}>
                {category.category}
              </Text>
              <View style={[styles.levelBadge, { backgroundColor: `${designTheme.colors.primary}20` }]}>
                <Text style={[styles.levelText, { color: designTheme.colors.primary }]}>
                  {category.level}
                </Text>
              </View>
            </View>
            <Text style={[styles.categoryDescription, isDark && styles.subtitleDark]}>
              {category.description}
            </Text>
            <Text style={[styles.examplesTitle, isDark && styles.textDark]}>
              {t('age_rating.ejemplos_titulo')}
            </Text>
            {category.examples && category.examples.map((example, exIndex) => (
              <Text key={exIndex} style={[styles.exampleText, isDark && styles.subtitleDark]}>
                • {example}
              </Text>
            ))}
          </View>
        ))}

        {/* Directrices de Plataformas */}
        <Text style={[styles.sectionHeader, isDark && styles.textDark, { marginTop: 30 }]}>
          {t('age_rating.directrices_plataformas')}
        </Text>
        
        {guidelines.map((guideline, index) => (
          <View key={index} style={[styles.guidelineCard, isDark && styles.guidelineCardDark]}>
            <Text style={[styles.guidelineOrg, isDark && styles.textDark]}>
              {guideline.organization}
            </Text>
            <Text style={[styles.guidelineRating, { color: designTheme.colors.primary }]}>
              {t('age_rating.rating_texto')} {guideline.rating}
            </Text>
            <Text style={[styles.guidelineCriteria, isDark && styles.subtitleDark]}>
              {guideline.criteria}
            </Text>
          </View>
        ))}

        {/* Supervisión Parental */}
        <View style={[styles.parentalCard, isDark && styles.parentalCardDark]}>
          <Ionicons name="shield-checkmark" size={24} color={designTheme.colors.primary} />
          <Text style={[styles.parentalTitle, isDark && styles.textDark]}>
            {t('age_rating.supervision_parental_titulo')}
          </Text>
          <Text style={[styles.parentalText, isDark && styles.subtitleDark]}>
            {t('age_rating.supervision_parental_contenido')}
          </Text>
        </View>

        {/* Aviso de Responsabilidad */}
        <View style={[styles.disclaimerCard, isDark && styles.disclaimerCardDark]}>
          <Ionicons name="warning" size={24} color="#ff6b35" />
          <Text style={[styles.disclaimerTitle, isDark && styles.textDark]}>
            {t('age_rating.aviso_responsabilidad_titulo')}
          </Text>
          <Text style={[styles.disclaimerText, isDark && styles.subtitleDark]}>
            {t('age_rating.aviso_responsabilidad_contenido')}
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, isDark && styles.subtitleDark]}>
            {t('age_rating.footer_medicina_reproductiva')}
          </Text>
          <Text style={[styles.footerText, isDark && styles.subtitleDark, { marginTop: 10 }]}>
            {t('age_rating.footer_consultas_contenido')}
          </Text>
          <Text style={[styles.footerText, isDark && styles.subtitleDark, { marginTop: 15 }]}>
            {t('age_rating.footer_clasificacion_actualizada')}
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
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 20,
  },
  
  // Main Rating
  ratingCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginVertical: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  ratingCardDark: {
    backgroundColor: '#1e1e1e',
  },
  ratingBadge: {
    backgroundColor: designTheme.colors.primary,
    borderRadius: 25,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  ratingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  ratingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  ratingDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  
  // Restrictions
  restrictionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  restrictionCardDark: {
    backgroundColor: '#1e1e1e',
  },
  restrictionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  restrictionBadge: {
    backgroundColor: '#ff6b35',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 12,
  },
  restrictionBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  restrictionReason: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  restrictionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  
  // Categories
  categoryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryCardDark: {
    backgroundColor: '#1e1e1e',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  levelBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '600',
  },
  categoryDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  examplesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 4,
  },
  
  // Guidelines
  guidelineCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  guidelineCardDark: {
    backgroundColor: '#1e1e1e',
  },
  guidelineOrg: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  guidelineRating: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  guidelineCriteria: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  
  // Parental
  parentalCard: {
    backgroundColor: '#e7f3ff',
    borderRadius: 12,
    padding: 20,
    marginVertical: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: designTheme.colors.primary,
  },
  parentalCardDark: {
    backgroundColor: '#0a1929',
  },
  parentalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    marginBottom: 12,
    textAlign: 'center',
  },
  parentalText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  
  // Disclaimer
  disclaimerCard: {
    backgroundColor: '#fff3cd',
    borderRadius: 12,
    padding: 20,
    marginVertical: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff6b35',
  },
  disclaimerCardDark: {
    backgroundColor: '#2d1b00',
  },
  disclaimerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    marginBottom: 12,
    textAlign: 'center',
  },
  disclaimerText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  
  // Footer
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
  
  // Dark theme
  textDark: {
    color: '#fff',
  },
  subtitleDark: {
    color: '#aaa',
  },
});