import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
  Dimensions,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

// Contextos y themes
import { useTheme } from '@/contexts/ThemeContext';
import { useDynamicTheme } from '@/hooks/useDynamicTheme';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { theme as designTheme } from '@/config/theme';
import ThemeSelector from '@/components/common/ThemeSelector';

const { width, height } = Dimensions.get('window');

// ===================================================================
// 🎨 INTERFAZ Y TIPOS
// ===================================================================

interface ConfigOption {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  type: 'toggle' | 'navigation' | 'external' | 'action';
  value?: boolean;
  onPress?: () => void;
  url?: string;
}

// ===================================================================
// 🏠 COMPONENTE PRINCIPAL
// ===================================================================

export default function ConfigScreen() {
  const { themeMode, toggleTheme, isDark, effectiveTheme, systemTheme } = useTheme();
  const theme = useDynamicTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const { currentLanguage, changeLanguage, t } = useLanguage();

  const [showThemeSelector, setShowThemeSelector] = React.useState(false);
  
  // 🎨 Estilos dinámicos
  const styles = React.useMemo(() => createStyles(theme), [theme]);



  // 🔗 Abrir URL externa
  const openURL = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert('Error', 'No se pudo abrir el enlace');
    }
  };

  // 📧 Abrir email
  const openEmail = async (email: string) => {
    try {
      await Linking.openURL(`mailto:${email}`);
    } catch (error) {
      Alert.alert('Error', 'No se pudo abrir el email');
    }
  };

  // 📋 Configuración de opciones
  const configSections = [
    {
      title: `🎨 ${t('config.apariencia_personalizacion')}`,
      options: [
        {
          id: 'theme_selector',
          title: t('config.tema_aplicacion'),
          subtitle: `${themeMode === 'auto' ? `${t('config.tema_automatico')} (${effectiveTheme === 'dark' ? t('config.tema_oscuro') : t('config.tema_claro')})` : themeMode === 'dark' ? `${t('config.tema_oscuro')}` : `${t('config.tema_claro')}`}`,
          icon: themeMode === 'auto' ? 'phone-portrait' : themeMode === 'dark' ? 'moon' : 'sunny',
          type: 'navigation' as const,
          onPress: () => setShowThemeSelector(true),
        },
        {
          id: 'language',
          title: t('config.idioma_language'),
          subtitle: `${t('config.idioma_actual')}: ${currentLanguage === 'es' ? t('espanol') : t('ingles')}`,
          icon: 'language',
          type: 'navigation' as const,
          onPress: () => {
            Alert.alert(
              `🌍 ${t('config.seleccionar_idioma')}`,
              t('config.elige_idioma'),
              [
                { 
                  text: t('espanol'), 
                  onPress: () => changeLanguage('es')
                },
                { 
                  text: t('ingles'), 
                  onPress: () => changeLanguage('en')
                },
                { 
                  text: t('config.cancelar'), 
                  style: 'cancel' 
                },
              ]
            );
          },
        },

      ],
    },
    {
      title: `⚖️ ${t('config.legal_privacidad')}`,
      options: [
        {
          id: 'privacy_policy',
          title: t('config.politica_privacidad'),
          subtitle: t('config.info_manejo_datos'),
          icon: 'shield-checkmark',
          type: 'navigation' as const,
          onPress: () => router.push('/privacy-policy'),
        },
        {
          id: 'medical_disclaimer',
          title: t('config.aviso_medico'),
          subtitle: t('config.informacion_medica'),
          icon: 'medical',
          type: 'navigation' as const,
          onPress: () => router.push('/medical-disclaimer'),
        },
        {
          id: 'terms_of_service',
          title: t('config.terminos_servicio'),
          subtitle: t('config.condiciones_uso'),
          icon: 'document-text',
          type: 'navigation' as const,
          onPress: () => router.push('/terms-of-service'),
        },
      ],
    },
    {
      title: t('config.informacion_recursos'),
      options: [
        {
          id: 'copyright',
          title: t('config.derechos_autor'),
          subtitle: t('config.derechos_autor_subtitulo'),
          icon: 'document-text',
          type: 'navigation' as const,
          onPress: () => router.push('/copyright'),
        },
        {
          id: 'bibliography',
          title: t('config.bibliografia_medica'),
          subtitle: t('config.bibliografia_subtitulo'),
          icon: 'library',
          type: 'navigation' as const,
          onPress: () => router.push('/bibliography'),
        },
        {
          id: 'age_rating',
          title: t('config.clasificacion_edad'),
          subtitle: t('config.clasificacion_edad_subtitulo'),
          icon: 'information-circle',
          type: 'navigation' as const,
          onPress: () => router.push('/age-rating'),
        },
      ],
    },
    {
      title: `🌐 ${t('config.redes_soporte')}`,
      options: [
        {
          id: 'whatsapp',
          title: t('config.whatsapp'),
          subtitle: t('config.consulta_medica_directa'),
          icon: 'logo-whatsapp',
          type: 'external' as const,
          url: 'https://wa.me/593993942614',
        },
        {
          id: 'instagram',
          title: t('config.instagram'),
          subtitle: '@fertilidad.drjorgeavasquezr',
          icon: 'logo-instagram',
          type: 'external' as const,
          url: 'https://www.instagram.com/fertilidad.drjorgeavasquezr/',
        },
        {
          id: 'tiktok',
          title: t('config.tiktok'),
          subtitle: '@fertilidadrjorgevasquez',
          icon: 'logo-tiktok',
          type: 'external' as const,
          url: 'https://www.tiktok.com/@fertilidadrjorgevasquez',
        },
        {
          id: 'customer_support',
          title: t('config.servicio_cliente'),
          subtitle: t('config.contacta_soporte'),
          icon: 'headset',
          type: 'navigation' as const,
          onPress: () => router.push('/customer-support'),
        },
        {
          id: 'website',
          title: t('config.sitio_web_oficial'),
          subtitle: t('config.visita_portal'),
          icon: 'globe',
          type: 'external' as const,
          url: 'https://drjorgevasquezr.com/aplicaciones/calculadora-fertilidad/index.html',
        },
      ],
    },
    {
      title: `👤 ${t('config.cuenta_sesion')}`,
      options: [
        isAuthenticated ? {
          id: 'logout',
          title: t('config.cerrar_sesion'),
          subtitle: `${t('config.desconectar_cuenta').replace('tu cuenta', user?.name || 'tu cuenta')}`,
          icon: 'log-out',
          type: 'action' as const,
          onPress: async () => {
            Alert.alert(
              '👋 Cerrar Sesión',
              '¿Estás seguro de que quieres cerrar sesión?',
              [
                { text: 'Cancelar', style: 'cancel' },
                { 
                  text: 'Cerrar Sesión', 
                  style: 'destructive',
                  onPress: async () => {
                    await logout();
                    router.replace('/welcome');
                  }
                }
              ]
            );
          },
        } : {
          id: 'login',
          title: t('config.iniciar_sesion'),
          subtitle: t('config.acceder_premium'),
          icon: 'log-in',
          type: 'navigation' as const,
          onPress: () => router.push('/login'),
        },
      ],
    },
  ];

  // 🎨 Renderizar opción individual
  const renderOption = (option: ConfigOption) => {
    const iconColor = 'white';

    return (
      <TouchableOpacity
        key={option.id}
        style={styles.optionItem}
        onPress={() => {
          if (option.type === 'external' && option.url) {
            openURL(option.url);
          } else if (option.onPress) {
            option.onPress();
          }
        }}
        activeOpacity={0.7}
      >
        <View style={styles.optionLeft}>
          <View style={styles.optionIcon}>
            <Ionicons name={option.icon as any} size={22} color={iconColor} />
          </View>
          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>{option.title}</Text>
            <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
          </View>
        </View>
        
        <View style={styles.optionRight}>
          {option.type === 'toggle' ? (
            <Switch
              value={option.value}
              onValueChange={option.onPress}
              trackColor={{ false: 'rgba(255,255,255,0.3)', true: 'rgba(255,255,255,0.8)' }}
              thumbColor={option.value ? designTheme.colors.primary : '#f4f3f4'}
            />
          ) : (
            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.6)" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* 🎨 Fondo gradiente completo como login */}
      <LinearGradient
        colors={[
          designTheme.colors.primary,
          designTheme.colors.secondary,
          '#4a90e2',
        ]}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* 🔧 Header personalizado */}
        <View style={styles.customHeader}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>⚙️ Configuración</Text>
          
          <View style={{ width: 44 }} />
        </View>

        {/* 📋 Contenido en contenedor blanco */}
        <View style={styles.contentContainer}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {configSections.map((section, sectionIndex) => (
              <View key={sectionIndex} style={styles.section}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <View style={styles.sectionOptions}>
                  {section.options.map((option) => renderOption(option))}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>

      {/* Selector de Tema */}
      <ThemeSelector
        visible={showThemeSelector}
        onClose={() => setShowThemeSelector(false)}
        showAsModal={true}
      />
    </View>
  );
}

// ===================================================================
// 🎨 ESTILOS DINÁMICOS
// ===================================================================

const createStyles = (theme: ReturnType<typeof useDynamicTheme>) => StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: height,
  },
  safeArea: {
    flex: 1,
  },
  customHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  backButton: {
    padding: 10,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 16,
    borderRadius: 20,
    shadowColor: theme.colors.shadow || '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 12,
    paddingLeft: 4,
  },
  sectionOptions: {
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    overflow: 'hidden',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  optionRight: {
    marginLeft: 12,
  },
});