/**
 * 🎧 SERVICIO AL CLIENTE
 */

import React from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Linking, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useDynamicTheme } from '@/hooks/useDynamicTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import { theme as designTheme } from '@/config/theme';

export default function CustomerSupportScreen() {
  const { isDark } = useTheme();
  const theme = useDynamicTheme();
  const { t } = useLanguage();
  
  // 🎨 Estilos dinámicos
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  // 📧 Abrir email
  const openEmail = async () => {
    try {
      await Linking.openURL('mailto:minomoreno86@gmail.com?subject=Soporte Calculadora Fertilidad');
    } catch (error) {
      Alert.alert('Error', 'No se pudo abrir el email');
    }
  };

  // 🌐 Abrir web
  const openWebsite = async () => {
    try {
      await Linking.openURL('https://drjorgevasquezr.com/aplicaciones/calculadora-fertilidad/index.html');
    } catch (error) {
      Alert.alert('Error', 'No se pudo abrir el sitio web');
    }
  };

  const supportOptions = [
    {
      id: 'email',
      title: t('customer_support.email_titulo'),
      subtitle: 'minomoreno86@gmail.com',
      description: t('customer_support.email_respuesta'),
      icon: 'mail',
      onPress: openEmail,
    },
    {
      id: 'website',
      title: t('customer_support.sitio_web_titulo'),
      subtitle: 'drjorgevasquezr.com/aplicaciones/calculadora-fertilidad',
      description: t('customer_support.sitio_descripcion'),
      icon: 'globe',
      onPress: openWebsite,
    },
    {
      id: 'faq',
      title: t('customer_support.preguntas_frecuentes_titulo'),
      subtitle: t('customer_support.preguntas_frecuentes_descripcion'),
      description: 'Disponible próximamente',
      icon: 'help-circle',
      onPress: () => Alert.alert('Próximamente', 'Esta sección estará disponible en una futura actualización'),
    },
  ];

  const faqItems = [
    {
      question: '¿Los resultados son 100% precisos?',
      answer: 'Los resultados son estimaciones probabilísticas basadas en literatura médica. NO sustituyen la consulta médica profesional.',
    },
    {
      question: '¿Mis datos médicos están seguros?',
      answer: 'Sí, todos los datos se procesan localmente en tu dispositivo y no se envían a servidores externos.',
    },
    {
      question: '¿Puedo usar la app sin registrarme?',
      answer: 'Sí, puedes usar todas las funciones básicas como invitado. El registro ofrece funciones premium adicionales.',
    },
    {
      question: '¿La app es adecuada para todas las edades?',
      answer: 'La app está clasificada para mayores de 17 años debido a su contenido médico especializado.',
    },
  ];

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      {/* Header */}
      <LinearGradient
        colors={[designTheme.colors.primary, designTheme.colors.secondary]}
        style={styles.header}
      >
        <Ionicons name="headset" size={32} color="white" />
        <Text style={styles.headerTitle}>{t('customer_support.titulo')}</Text>
        <Text style={styles.headerSubtitle}>
          {t('customer_support.subtitulo')}
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Opciones de Contacto */}
        <Text style={[styles.sectionHeader, isDark && styles.textDark]}>
          {t('customer_support.contacto_directo_titulo')}
        </Text>
        
        {supportOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[styles.optionCard, isDark && styles.optionCardDark]}
            onPress={option.onPress}
            activeOpacity={0.7}
          >
            <View style={styles.optionLeft}>
              <View style={[styles.iconContainer, { backgroundColor: `${designTheme.colors.primary}20` }]}>
                <Ionicons name={option.icon as any} size={24} color={designTheme.colors.primary} />
              </View>
              <View style={styles.optionText}>
                <Text style={[styles.optionTitle, isDark && styles.textDark]}>
                  {option.title}
                </Text>
                <Text style={[styles.optionSubtitle, isDark && styles.subtitleDark]}>
                  {option.subtitle}
                </Text>
                <Text style={[styles.optionDescription, isDark && styles.subtitleDark]}>
                  {option.description}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={isDark ? '#888' : '#ccc'} />
          </TouchableOpacity>
        ))}

        {/* FAQ */}
        <Text style={[styles.sectionHeader, isDark && styles.textDark, { marginTop: 30 }]}>
          ❓ Preguntas Frecuentes
        </Text>
        
        {faqItems.map((item, index) => (
          <View key={index} style={[styles.faqCard, isDark && styles.faqCardDark]}>
            <Text style={[styles.faqQuestion, isDark && styles.textDark]}>
              {item.question}
            </Text>
            <Text style={[styles.faqAnswer, isDark && styles.subtitleDark]}>
              {item.answer}
            </Text>
          </View>
        ))}

        {/* Horarios de Atención */}
        <View style={[styles.scheduleCard, isDark && styles.scheduleCardDark]}>
          <Text style={[styles.scheduleTitle, isDark && styles.textDark]}>
            🕒 Horarios de Atención
          </Text>
          <Text style={[styles.scheduleText, isDark && styles.subtitleDark]}>
            📧 Email: 24/7 (respuesta en 24-48h)
            🌐 Web: Disponible siempre
            📱 App: Soporte automático integrado
          </Text>
          <Text style={[styles.scheduleNote, isDark && styles.subtitleDark]}>
            * Para emergencias médicas, contacte inmediatamente a su médico o servicios de emergencia.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, isDark && styles.subtitleDark]}>
            Dr Jorge Vasquez R. - Especialista en Reproducción Asistida
          </Text>
          <Text style={[styles.footerText, isDark && styles.subtitleDark, { marginTop: 10 }]}>
            📧 minomoreno86@gmail.com | 🌐 drjorgevasquezr.com/aplicaciones/calculadora-fertilidad
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

// 🎨 Función para crear estilos dinámicos
const createStyles = (theme: ReturnType<typeof useDynamicTheme>) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  containerDark: {
    backgroundColor: theme.colors.background,
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
  
  // Option Cards
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  optionCardDark: {
    backgroundColor: '#1e1e1e',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 14,
    color: designTheme.colors.primary,
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 12,
    color: '#999',
  },
  
  // FAQ
  faqCard: {
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
  faqCardDark: {
    backgroundColor: '#1e1e1e',
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  
  // Schedule
  scheduleCard: {
    backgroundColor: '#e7f3ff',
    borderRadius: 12,
    padding: 20,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: designTheme.colors.primary,
  },
  scheduleCardDark: {
    backgroundColor: '#0a1929',
  },
  scheduleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  scheduleText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 12,
  },
  scheduleNote: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
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