import { StyleSheet, ScrollView, View } from 'react-native';
import { Link } from 'expo-router';
import Box from '@/presentation/components/common/Box';
import Text from '@/presentation/components/common/Text';
import { Button } from '@/presentation/components/common/Button';
import { EnhancedButton } from '@/presentation/components/common/EnhancedButton';
import { EnhancedProgressStepper } from '@/presentation/components/common/EnhancedProgressStepper';
import { EnhancedInfoCard, CompletionCard } from '@/presentation/components/common/EnhancedInfoCard';
import { EnhancedValidationMonitor } from '@/presentation/components/common/EnhancedValidationMonitor';
import { useCalculatorFormWithParallelValidation } from '@/presentation/features/calculator/useCalculatorFormWithParallelValidation.final';
import { clearEngineCache } from '@/core/domain/services/calculationEngine';
import { DemographicsForm } from '@/presentation/features/calculator/components/DemographicsForm';
import { GynecologyHistoryForm } from '@/presentation/features/calculator/components/GynecologyHistoryForm';
import { LabTestsForm } from '@/presentation/features/calculator/components/LabTestsForm';
import { MaleFactorForm } from '@/presentation/features/calculator/components/MaleFactorForm';
import { theme } from '@/config/theme';

export default function CalculatorScreen() {
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
    
    // Funciones auxiliares
    getRangeValidation,
    getCompletionScore,

    // ✨ NUEVAS CARACTERÍSTICAS DE VALIDACIÓN PARALELA
    isValidating,
    validationProgress,
    validationMetrics
  } = useCalculatorFormWithParallelValidation();

  // 📊 Usar completitud del hook con validación paralela
  const completionPercentage = getCompletionScore();

  const stepLabels = ['Demografia', 'Ginecología', 'Laboratorio', 'Factor Masculino'];

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Text variant="h1" style={styles.title}>
          Calculadora de Fertilidad
        </Text>
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

      <View style={styles.buttonContainer}>
        <EnhancedButton
          title={completionPercentage >= 70 ? "Generar Informe Completo" : "Generar Informe con Datos Disponibles"}
          onPress={handleCalculate}
          variant="primary"
          size="large"
          fullWidth
          loading={isLoading}
          disabled={isLoading || !canCalculate}
          iconName="lightning" // 🔥 Icono moderno para generación rápida
          completionPercentage={completionPercentage}
        />
        
        {/* 💡 Texto explicativo bajo el botón */}
        {!isLoading && (
          <Text style={styles.buttonHelpText}>
            {(() => {
              if (completionPercentage < 40) {
                return "💡 Funciona con datos mínimos - Puedes generar un informe básico ahora";
              } else if (completionPercentage < 70) {
                return "✅ Buenos datos disponibles - El informe será útil y preciso";
              } else {
                return "🏆 Datos completos - Obtendrás el análisis más detallado";
              }
            })()}
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

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc', // Fondo más suave
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 16, // Reducido de 20 a 16
    backgroundColor: '#ffffff',
    marginBottom: 6, // Reducido de 12 a 6
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    // Gradiente sutil
    position: 'relative',
  },
  title: {
    textAlign: 'center',
    marginBottom: 6, // Reducido de 8 a 6
    color: theme.colors.primary,
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  subtitle: {
    textAlign: 'center',
    color: theme.colors.subtleText,
    lineHeight: 22,
    fontSize: 16,
    opacity: 0.8,
  },
  infoCardContainer: {
    marginBottom: 4, // Reducido de 8 a 4 - Espacio mínimo antes del formulario
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressContainerMoved: {
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  formContainer: {
    marginHorizontal: 20, // Solo horizontal
    marginTop: 4, // Reducido de 8 a 4 - Muy poco espacio arriba
    marginBottom: 16, // Espacio abajo normal
    padding: 24,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  buttonContainer: {
    marginHorizontal: 20,
    marginBottom: 32,
  },
  secondaryButtonContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  buttonHelpText: {
    textAlign: 'center',
    fontSize: 13,
    color: theme.colors.subtleText,
    marginTop: 12,
    fontStyle: 'italic',
    lineHeight: 18,
    paddingHorizontal: 20,
  },
});
