import { StyleSheet, ScrollView, View } from 'react-native';
import { Link } from 'expo-router';
import Box from '@/presentation/components/common/Box';
import Text from '@/presentation/components/common/Text';
import { Button } from '@/presentation/components/common/Button';
import { ProgressStepper } from '@/presentation/components/common/ProgressStepper';
import { InfoCard } from '@/presentation/components/common/InfoCard';
import { useCalculatorForm } from '@/presentation/features/calculator/useCalculatorForm';
import { DemographicsForm } from '@/presentation/features/calculator/components/DemographicsForm';
import { GynecologyHistoryForm } from '@/presentation/features/calculator/components/GynecologyHistoryForm';
import { LabTestsForm } from '@/presentation/features/calculator/components/LabTestsForm';
import { MaleFactorForm } from '@/presentation/features/calculator/components/MaleFactorForm';
import { theme } from '@/config/theme';

export default function CalculatorScreen() {
  const { 
    control, 
    calculatedBmi, 
    calculatedHoma, 
    handleCalculate, 
    formState: { errors },
    isLoading,
    formProgress,
    currentStep
  } = useCalculatorForm();

  const stepLabels = ['Demografia', 'Ginecología', 'Laboratorio', 'Factor Masculino'];

  const handleCalculateWithFeedback = async () => {
    try {
      await handleCalculate();
    } catch (error) {
      console.error('Error during calculation:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

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

      <View style={styles.progressContainer}>
        <ProgressStepper
          currentStep={currentStep}
          totalSteps={4}
          stepLabels={stepLabels}
        />
      </View>

      <InfoCard
        type="tip"
        title="Consejo"
        message="Completa todos los campos disponibles para obtener un análisis más preciso de tu perfil de fertilidad."
      />

      <Box style={styles.formContainer}>
        <DemographicsForm
          control={control}
          calculatedBmi={calculatedBmi}
          errors={errors}
        />
        <GynecologyHistoryForm control={control} errors={errors} />
        <LabTestsForm control={control} calculatedHoma={calculatedHoma} errors={errors} />
        <MaleFactorForm control={control} errors={errors} />
      </Box>

      <View style={styles.buttonContainer}>
        <Button
          title="Generar Informe de Fertilidad"
          onPress={handleCalculateWithFeedback}
          variant="primary"
          size="large"
          fullWidth
          loading={isLoading}
          disabled={isLoading || formProgress < 60}
          iconName="document-text-outline"
        />
        
        <View style={styles.secondaryButtonContainer}>
          <Link href="/premiumCalculator" asChild>
            <Button
              title="Calculadora Premium"
              onPress={() => {}}
              variant="outline"
              size="medium"
              iconName="star-outline"
              iconPosition="left"
            />
          </Link>
        </View>
      </View>

      {formProgress < 60 && (
        <InfoCard
          type="warning"
          message={`Completa al menos el 60% del formulario para generar el informe. Progreso actual: ${formProgress}%`}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 20,
    backgroundColor: theme.colors.card,
    marginBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    color: theme.colors.primary,
  },
  subtitle: {
    textAlign: 'center',
    color: theme.colors.subtleText,
    lineHeight: 22,
  },
  progressContainer: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  formContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonContainer: {
    marginHorizontal: 20,
    marginBottom: 32,
  },
  secondaryButtonContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
});
