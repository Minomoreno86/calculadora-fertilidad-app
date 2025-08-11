/**
 * 🏥 CALCULADORA MÉDICA PRINCIPAL - INTEGRACIÓN COMPLETA
 * 
 * Usa TODOS los componentes profesionales existentes del usuario:
 * - DemographicsForm (edad, peso, altura, BMI automático)
 * - GynecologyHistoryForm (endometriosis, miomas, adenomiosis, HSG, OTB)  
 * - LabTestsForm (AMH, TSH, prolactina, HOMA-IR automático)
 * - MaleFactorForm (espermatograma completo)
 * 
 * Integrado con:
 * - useCalculatorForm (hook principal con ModularFertilityEngine)
 * - Sistema modular avanzado de 44KB
 * - Biblioteca clínica de 97KB
 * - Generador de reportes médicos
 * 
 * @author Integración con arquitectura existente del usuario
 */

import React from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  TouchableOpacity
} from 'react-native';

// Importación segura de Alert usando tu patrón existente
let Alert: unknown = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const RN = require('react-native');
  Alert = RN.Alert;
} catch (error) {
  console.warn('Alert no disponible en esta versión de React Native');
  Alert = {
    alert: (title: string, message: string, buttons?: unknown[]) => {
      console.log(`[FALLBACK ALERT] ${title}: ${message}`);
    }
  };
}
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// 🏥 COMPONENTES MÉDICOS PROFESIONALES EXISTENTES
import { DemographicsForm } from './DemographicsForm';
import { GynecologyHistoryForm } from './GynecologyHistoryForm';
import { LabTestsForm } from './LabTestsForm';
import { MaleFactorForm } from './MaleFactorForm';

// 🎯 HOOK PRINCIPAL EXISTENTE
import { useCalculatorForm } from '../useCalculatorForm';

// 🎨 UI COMPONENTS EXISTENTES
import Text from '../../../components/common/Text';
import { useDynamicTheme } from '../../../../hooks/useDynamicTheme';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { theme as designTheme } from '../../../../config/theme';

// ===================================================================
// 🏥 CALCULADORA MÉDICA PRINCIPAL
// ===================================================================

export const CalculatorFormMain: React.FC = () => {
  console.log('🏥 CALCULATOR FORM MAIN: Renderizando componente principal');
  // 🎨 TEMA DINÁMICO
  const theme = useDynamicTheme();
  const { t } = useLanguage();
  const styles = createStyles(theme);

  // 🏥 HOOK PRINCIPAL CON MOTOR MODULAR AVANZADO
  const {
    control,
    formState: { errors },
    handleCalculate,
    isLoading,
    calculatedBmi,
    calculatedHoma,
    watchedFields,
    currentStep,
    completionPercentage
  } = useCalculatorForm();

  // 📊 ESTADO DE SECCIONES
  const [activeSection, setActiveSection] = React.useState<string>('demographics');

  // 🎯 SECCIONES DE LA CALCULADORA
  const sections = [
    { 
      id: 'demographics', 
      title: t('calculator.demografia'), 
      icon: 'person-outline',
      component: DemographicsForm
    },
    { 
      id: 'gynecology', 
      title: t('calculator.ginecologia'), 
      icon: 'medical-outline',
      component: GynecologyHistoryForm
    },
    { 
      id: 'laboratory', 
      title: t('calculator.laboratorio'), 
      icon: 'flask-outline',
      component: LabTestsForm
    },
    { 
      id: 'malefactor', 
      title: t('calculator.factor_masculino'), 
      icon: 'male-outline',
      component: MaleFactorForm
    }
  ];

  // 🎯 MANEJAR CÁLCULO MÉDICO
  const handleSubmitCalculation = async () => {
    try {
      Alert.alert(
        `🧮 ${t('calculator.iniciando_analisis')}`,
        t('calculator.procesando_motor'),
        [
          { text: t('calculator.cancelar'), style: 'cancel' },
          { 
            text: t('calculator.analizar'), 
            onPress: handleCalculate,
            style: 'default'
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', t('calculator.error_procesamiento'));
    }
  };

  // 🎯 RENDERIZAR SECCIÓN ACTIVA
  const renderActiveSection = () => {
    const section = sections.find(s => s.id === activeSection);
    if (!section) return null;

    const Component = section.component;
    
    // Props específicos para cada componente
    const commonProps = { control, errors };
    
    switch (activeSection) {
      case 'demographics':
        return <Component {...commonProps} calculatedBmi={calculatedBmi} />;
      case 'laboratory':
        return <Component {...commonProps} calculatedHoma={calculatedHoma} />;
      default:
        return <Component {...commonProps} />;
    }
  };

  return (
    <View style={styles.container}>
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
      
      {/* 🎯 HEADER CON PROGRESO */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{t('calculator.titulo')}</Text>
          <Text style={styles.headerSubtitle}>
            {t('calculator.subtitulo', { percentage: completionPercentage.toFixed(0) })}
          </Text>
          
          {/* 📊 Barra de progreso */}
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${completionPercentage}%` }
              ]} 
            />
          </View>
        </View>
      </View>

      {/* 🎯 NAVEGACIÓN DE SECCIONES */}
      <View style={styles.sectionTabs}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
        >
          {sections.map((section) => (
            <TouchableOpacity
              key={section.id}
              style={[
                styles.tab,
                activeSection === section.id && styles.activeTab
              ]}
              onPress={() => setActiveSection(section.id)}
            >
              <Ionicons 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                name={section.icon as any} 
                size={20} 
                color={
                  activeSection === section.id 
                    ? theme.colors.primary 
                    : theme.colors.textSecondary
                } 
              />
              <Text style={[
                styles.tabText,
                activeSection === section.id && styles.activeTabText
              ]}>
                {section.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 🏥 FORMULARIO MÉDICO PRINCIPAL */}
      <View style={styles.formWrapper}>
        <ScrollView style={styles.formContainer}>
          <View style={styles.sectionContainer}>
            {renderActiveSection()}
          </View>
        </ScrollView>
      </View>

      {/* 🎯 BOTÓN DE ANÁLISIS */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.calculateButton, isLoading && styles.buttonDisabled]}
          onPress={handleSubmitCalculation}
          disabled={isLoading}
        >
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.primary + 'CC']}
            style={styles.buttonGradient}
          >
            {isLoading ? (
              <>
                <Ionicons name="hourglass-outline" size={20} color="white" />
                <Text style={styles.buttonText}>{t('calculator.procesando')}</Text>
              </>
            ) : (
              <>
                <Ionicons name="analytics-outline" size={20} color="white" />
                <Text style={styles.buttonText}>{t('calculator.analizar_fertilidad')}</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
    bottom: 0,
  },
  
  header: {
    paddingTop: 50,
    paddingBottom: 25,
    paddingHorizontal: 20,
  },
  
  headerContent: {
    alignItems: 'center',
  },
  
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold' as const,
    color: theme.colors.onPrimary || 'white',
    marginBottom: 8,
    textAlign: 'center' as const,
    lineHeight: 32,
  },
  
  headerSubtitle: {
    fontSize: 14,
    color: theme.colors.onPrimary || 'white',
    opacity: 0.9,
    marginBottom: 20,
    textAlign: 'center' as const,
    lineHeight: 18,
  },
  
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 2,
  },
  
  sectionTabs: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
  },
  
  tabsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  
  activeTab: {
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderColor: 'rgba(255,255,255,0.6)',
  },
  
  tabText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 6,
  },
  
  activeTabText: {
    color: 'white',
    fontWeight: '600' as const,
  },
  
  formWrapper: {
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
  
  formContainer: {
    flex: 1,
  },
  
  sectionContainer: {
    padding: 20,
  },
  
  footer: {
    padding: 20,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    marginHorizontal: 16,
    marginBottom: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  
  calculateButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  
  buttonDisabled: {
    opacity: 0.6,
  },
  
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: 'white',
    marginLeft: 8,
  },
});