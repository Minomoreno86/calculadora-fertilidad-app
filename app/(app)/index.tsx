import { StyleSheet, ScrollView, View, KeyboardAvoidingView, Platform } from 'react-native';
import { Link } from 'expo-router';
import Box from '@/presentation/components/common/Box';
import Text from '@/presentation/components/common/Text';
import { Button, EnhancedButton } from '@/presentation/components/common/EnhancedButton';
import { EnhancedProgressStepper } from '@/presentation/components/common/EnhancedProgressStepper';
import { EnhancedInfoCard, CompletionCard } from '@/presentation/components/common/EnhancedInfoCard';
import { EnhancedValidationMonitor } from '@/presentation/components/common/EnhancedValidationMonitor';
import { useCalculatorFormWithParallelValidation } from '@/presentation/features/calculator/useCalculatorFormWithParallelValidation.final';
import { clearEngineCache } from '@/core/domain/services/calculationEngine';
import { DemographicsForm } from '@/presentation/features/calculator/components/DemographicsForm';
import { GynecologyHistoryForm } from '@/presentation/features/calculator/components/GynecologyHistoryForm';
import { LabTestsForm } from '@/presentation/features/calculator/components/LabTestsForm';
import { MaleFactorForm } from '@/presentation/features/calculator/components/MaleFactorForm';
import SimpleValidationIntegrator from '@/presentation/components/features/validation/SimpleValidationIntegrator';
import { theme } from '@/config/theme';
import { ConfigModal } from '@/presentation/components/common/ConfigModal'; // Importando el ConfigModal
import { useState } from 'react';

export default function CalculatorScreen() {
  // 🛠️ Estado para modal de configuración
  const [configModalVisible, setConfigModalVisible] = useState(false);

  // 🚀 HOOK CON VALIDACIÓN PARALELA AVANZADA - FASE 2
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
    getCompletionScore,

    // ✨ NUEVAS CARACTERÍSTICAS DE VALIDACIÓN PARALELA
    isValidating,
    validationProgress,
    validationMetrics
  } = useCalculatorFormWithParallelValidation();

  // 📊 Obtener datos del formulario para validación inteligente
  const formData = watch();

  // 📊 Usar completitud del hook con validación paralela
  const completionPercentage = getCompletionScore();

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

      {/* 📊 PROGRESO MOVIDO AQUÍ - Más natural después de completar */}
      {completionPercentage > 0 && (
        <View style={styles.progressContainerMoved}>
          <EnhancedProgressStepper
            currentStep={currentStep}
            totalSteps={4}
            stepLabels={stepLabels}
            completionPercentage={completionPercentage}
          />
        </View>
      )}

      {/* 🧠 SISTEMA INTELIGENTE DE VALIDACIÓN CLÍNICA - FASE PROFESIONAL */}
      <View style={styles.intelligentValidationContainer}>
        <SimpleValidationIntegrator
          formData={formData}
          onValidationChange={(isValid, canProceed) => {
            // El sistema inteligente proporciona feedback adicional
            console.log('Validación inteligente:', { isValid, canProceed });
          }}
          onActionRequired={(insight) => {
            // Manejar acciones requeridas (ej: contactar especialista)
            console.log('Acción requerida:', insight.title);
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
          iconName="lightning" // 🔥 Icono moderno para generación rápida
          enhanced={true} // 🆕 Activar efectos especiales
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
              iconName="gem" // 🔥 Icono moderno para premium
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
        isValidating={isValidating}
      />

      {/* 🚀 MONITOR DE VALIDACIÓN PARALELA - Solo para desarrollo, al final */}
      {process.env.NODE_ENV === 'development' && (
        <EnhancedValidationMonitor
          isValidating={isValidating}
          progress={validationProgress}
          metrics={validationMetrics}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background, // 🎨 Nuevo fondo del theme
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
    ...theme.components.card.default, // 🃏 Nuevo estilo de card del theme
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
    ...theme.components.card.elevated, // 🃏 Card elevado del theme
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
    ...theme.typography.caption, // 🎨 Nueva tipografía del theme
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.s,
    paddingHorizontal: theme.spacing.l,
  },
});
