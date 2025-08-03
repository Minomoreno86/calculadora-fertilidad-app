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
let Alert: any = null;
try {
  const RN = require('react-native');
  Alert = RN.Alert;
} catch (error) {
  console.warn('Alert no disponible en esta versión de React Native');
  Alert = {
    alert: (title: string, message: string, buttons?: any[]) => {
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

// ===================================================================
// 🏥 CALCULADORA MÉDICA PRINCIPAL
// ===================================================================

export const CalculatorFormMain: React.FC = () => {
  // 🎨 TEMA DINÁMICO
  const theme = useDynamicTheme();
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
      title: 'Demografía', 
      icon: 'person-outline',
      component: DemographicsForm
    },
    { 
      id: 'gynecology', 
      title: 'Ginecología', 
      icon: 'medical-outline',
      component: GynecologyHistoryForm
    },
    { 
      id: 'laboratory', 
      title: 'Laboratorio', 
      icon: 'flask-outline',
      component: LabTestsForm
    },
    { 
      id: 'malefactor', 
      title: 'Factor Masculino', 
      icon: 'male-outline',
      component: MaleFactorForm
    }
  ];

  // 🎯 MANEJAR CÁLCULO MÉDICO
  const handleSubmitCalculation = async () => {
    try {
      Alert.alert(
        '🧮 Iniciando Análisis',
        'Procesando con Motor Médico Avanzado...',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Analizar', 
            onPress: handleCalculate,
            style: 'default'
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo procesar el análisis médico');
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
      {/* 🎯 HEADER CON PROGRESO */}
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primary + '80']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Calculadora de Fertilidad</Text>
          <Text style={styles.headerSubtitle}>
            Motor Médico Avanzado • {completionPercentage.toFixed(0)}% Completo
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
      </LinearGradient>

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
      <ScrollView style={styles.formContainer}>
        <View style={styles.sectionContainer}>
          {renderActiveSection()}
        </View>
      </ScrollView>

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
                <Text style={styles.buttonText}>Procesando...</Text>
              </>
            ) : (
              <>
                <Ionicons name="analytics-outline" size={20} color="white" />
                <Text style={styles.buttonText}>Analizar Fertilidad</Text>
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
    backgroundColor: theme.colors.background,
  },
  
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  
  headerContent: {
    alignItems: 'center',
  },
  
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: 'white',
    marginBottom: 4,
  },
  
  headerSubtitle: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
    marginBottom: 16,
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
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
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
    backgroundColor: theme.colors.background,
  },
  
  activeTab: {
    backgroundColor: theme.colors.primary + '20',
  },
  
  tabText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginLeft: 6,
  },
  
  activeTabText: {
    color: theme.colors.primary,
    fontWeight: '600' as const,
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