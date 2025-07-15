import { StyleSheet, ScrollView, View, KeyboardAvoidingView, Platform } from 'react-native';
import { Link } from 'expo-router';
import Box from '@/presentation/components/common/Box';
import Text from '@/presentation/components/common/Text';
import { Button, EnhancedButton } from '@/presentation/components/common/EnhancedButton';
import { ConditionalProgressDisplay } from '@/presentation/features/calculator/components/ConditionalProgressDisplay';
import { EnhancedInfoCard, CompletionCard } from '@/presentation/components/common/EnhancedInfoCard';
import { EnhancedValidationMonitor } from '@/presentation/components/common/EnhancedValidationMonitor';

// ✅ IMPORT CORREGIDO - Usar el hook principal sin el .final
import { useCalculatorForm } from '@/presentation/features/calculator/useCalculatorForm';
// 🚀 O si tienes validación paralela disponible:
// import { useCalculatorWithParallelValidation } from '@/presentation/features/calculator';

import { clearEngineCache } from '@/core/domain/services/calculationEngine';
import { DemographicsForm } from '@/presentation/features/calculator/components/DemographicsForm';
import { GynecologyHistoryForm } from '@/presentation/features/calculator/components/GynecologyHistoryForm';
import { LabTestsForm } from '@/presentation/features/calculator/components/LabTestsForm';
import { MaleFactorForm } from '@/presentation/features/calculator/components/MaleFactorForm';
import SimpleValidationIntegrator from '@/presentation/components/features/validation/IntelligentValidationIntegrator';
import { useDynamicTheme } from '@/hooks/useDynamicTheme';
import { ConfigModal } from '@/presentation/components/common/ConfigModal';
import { useState } from 'react';

export default function CalculatorScreen() {
  // 🛠️ Estado para modal de configuración
  const [configModalVisible, setConfigModalVisible] = useState(false);

  return (
    <CalculatorScreenContent 
      configModalVisible={configModalVisible}
      setConfigModalVisible={setConfigModalVisible}
    />
  );
}

interface CalculatorScreenContentProps {
  readonly configModalVisible: boolean; 
  readonly setConfigModalVisible: (visible: boolean) => void;
}

function CalculatorScreenContent({ 
  configModalVisible, 
  setConfigModalVisible 
}: CalculatorScreenContentProps) {

  // 🎨 TEMA DINÁMICO
  const theme = useDynamicTheme();

  // 🚀 HOOK PRINCIPAL DEL CALCULADOR (CORREGIDO)
  const {
    // API principal del formulario
    control, 
    calculatedBmi, 
    calculatedHoma, 
    handleCalculate, 
    formState: { errors },
    isLoading = false,
    currentStep = 0,
    canCalculate = false,
    watch,
    
    // Funciones auxiliares
    getRangeValidation,
    getCompletionScore
  } = useCalculatorForm(); // ✅ Hook corregido

  // 📊 Obtener datos del formulario para validación inteligente
  const formData = watch();

  // 📊 Usar completitud del hook
  const completionPercentage = getCompletionScore();

  // 🎨 Crear estilos dinámicos basados en el tema actual
  const styles = createStyles(theme);

  const stepLabels = ['Demografia', 'Ginecología', 'Laboratorio', 'Factor Masculino'];

  // 💡 Helper para mensaje de completitud
  const getCompletionMessage = () => {
    if (completionPercentage < 40) {
      return "💡 Funciona con datos mínimos - Puedes generar un informe básico ahora";
    }
    if (completionPercentage < 70) {
      return "✅ Buenos datos disponibles - El informe será útil y preciso";
    }
    return "🏆 Datos completos - Obtendrás el análisis más detallado";
  };

  // 💡 Helper para título del botón
  const getButtonTitle = () => {
    return completionPercentage >= 70 ? "Generar Informe Completo" : "Generar Informe con Datos Disponibles";
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          {/* 🛠️ Header con título y botón en línea */}
          <View style={styles.headerRow}>
            <Text variant="h1" style={styles.title}>
              Calculadora de Fertilidad
            </Text>
            <Button
              title=""
              onPress={() => {
                console.log('🛠️ Abriendo configuración');
                setConfigModalVisible(true);
              }}
              variant="text"
              size="small"
              iconName="settings"
              style={styles.configButton}
            />
          </View>
          <Text variant="body" style={styles.subtitle}>
            Completa los siguientes datos para obtener tu análisis personalizado
          </Text>
        </View>

        <View style={styles.infoCardContainer}>
          <EnhancedInfoCard
            type="tip"
            title="✨ Calculadora Inteligente"
            message="Esta calculadora puede generar informes útiles incluso con datos parciales. Completa más campos para obtener un análisis más preciso."
          />
        </View>

        <Box style={styles.formContainer}>
          <DemographicsForm
            control={control}
            calculatedBmi={calculatedBmi}
            errors={errors}
            getRangeValidation={getRangeValidation}
          />
          <GynecologyHistoryForm control={control} errors={errors} />
          <LabTestsForm control={control} calculatedHoma={calculatedHoma} errors={errors} />
          <MaleFactorForm control={control} errors={errors} />
        </Box>

        {/* 📊 PROGRESO INTELIGENTE CON FEATURE FLAGS */}
        {completionPercentage > 0 && (
          <View style={styles.progressContainerMoved}>
            <ConditionalProgressDisplay
              formData={formData}
              currentStep={currentStep}
              completionPercentage={completionPercentage}
              stepLabels={stepLabels}
            />
          </View>
        )}

        {/* 🧠 SISTEMA INTELIGENTE DE VALIDACIÓN CLÍNICA - ACTIVADO */}
        <View style={styles.intelligentValidationContainer}>
          <SimpleValidationIntegrator
            formData={formData}
            onValidationChange={(isValid, canProceed) => {
              // El sistema inteligente proporciona feedback de patrones complejos
              console.log('🧠 Validación inteligente:', { isValid, canProceed });
            }}
            onActionRequired={(insight) => {
              // Manejar insights clínicos avanzados (ej: contactar especialista)
              console.log('🚨 Acción clínica requerida:', insight.title);
            }}
            showInlineAlerts={true}
            style={{ marginTop: 16 }}
          />
        </View>

        <View style={styles.buttonContainer}>
          <EnhancedButton
            title={getButtonTitle()}
            onPress={handleCalculate}
            variant="primary"
            size="large"
            fullWidth
            loading={isLoading}
            disabled={isLoading || !canCalculate}
            iconName="lightning"
            enhanced={true}
            completionPercentage={completionPercentage}
          />
          
          {/* 💡 Texto explicativo bajo el botón */}
          {!isLoading && (
            <Text style={styles.buttonHelpText}>
              {getCompletionMessage()}
            </Text>
          )}
          
          <View style={styles.secondaryButtonContainer}>
            <Link href="/premiumCalculator" asChild>
              <Button
                title="Calculadora Premium"
                onPress={() => {}}
                variant="outline"
                size="medium"
                iconName="gem"
                iconPosition="left"
              />
            </Link>
            
            {/* 🔧 DEBUG: Botón para limpiar cache durante desarrollo */}
            {process.env.NODE_ENV === 'development' && (
              <Button
                title="🧹 Limpiar Cache (Debug)"
                onPress={() => {
                  clearEngineCache();
                  console.log('✅ Cache limpiado manualmente');
                }}
                variant="text"
                size="small"
                style={{ marginTop: 8 }}
              />
            )}
          </View>
        </View>

        {/* 💡 Tarjeta de completitud mejorada */}
        <CompletionCard
          completionPercentage={completionPercentage}
          isValidating={false}
        />

        {/* 🚀 MONITOR DE VALIDACIÓN PARALELA - Solo en desarrollo */}
        {process.env.NODE_ENV === 'development' && (
          <EnhancedValidationMonitor
            isValidating={false}
            progress={0}
            metrics={{
              isValidating: false,
              progress: 0,
              totalTasks: 0,
              completedTasks: 0,
              averageTaskTime: 0,
              cacheHitRate: 0,
              tasksPerSecond: 0,
              efficiency: 'N/A',
            }}
            showDevInfo={true}
          />
        )}

        {/* ⚙️ Modal de Configuración */}
        <ConfigModal
          visible={configModalVisible}
          onClose={() => setConfigModalVisible(false)}
        />

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// 🎨 Función para crear estilos dinámicos
const createStyles = (theme: ReturnType<typeof useDynamicTheme>) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingTop: 32,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: theme.spacing.xs,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    ...theme.typography.h1,
    color: theme.colors.primary,
  },
  subtitle: {
    textAlign: 'center',
    ...theme.typography.bodyLarge,
    color: theme.colors.textSecondary,
  },
  configButton: {
    backgroundColor: 'transparent',
    padding: 8,
    marginLeft: 8,
  },
  infoCardContainer: {
    marginBottom: theme.spacing.xxs,
  },
  progressContainer: {
    marginBottom: theme.spacing.xs,
  },
  progressContainerMoved: {
    marginHorizontal: theme.spacing.screen,
    marginTop: theme.spacing.m,
    marginBottom: theme.spacing.xs,
    padding: theme.spacing.card,
    ...theme.components.card.default,
  },
  intelligentValidationContainer: {
    marginHorizontal: theme.spacing.screen,
    marginBottom: theme.spacing.m,
  },
  formContainer: {
    marginHorizontal: theme.spacing.screen,
    marginTop: theme.spacing.xxs,
    marginBottom: theme.spacing.m,
    padding: theme.spacing.card,
    ...theme.components.card.elevated,
  },
  buttonContainer: {
    marginHorizontal: theme.spacing.screen,
    marginBottom: theme.spacing.xl,
  },
  secondaryButtonContainer: {
    marginTop: theme.spacing.m,
    alignItems: 'center',
  },
  buttonHelpText: {
    textAlign: 'center',
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.s,
    paddingHorizontal: theme.spacing.l,
  },
});