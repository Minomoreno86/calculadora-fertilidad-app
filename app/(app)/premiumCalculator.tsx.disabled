import { StyleSheet, Button, ScrollView, View } from 'react-native';
import Box from '@/presentation/components/common/Box';
import Text from '@/presentation/components/common/Text';
import { DemographicsForm } from '@/presentation/features/calculator/components/DemographicsForm';
import { GynecologyHistoryForm } from '@/presentation/features/calculator/components/GynecologyHistoryForm';
import { LabTestsForm } from '@/presentation/features/calculator/components/LabTestsForm';
import { MaleFactorForm } from '@/presentation/features/calculator/components/MaleFactorForm';
import { theme } from '@/config/theme';
import { usePremiumCalculatorForm } from '@/presentation/features/premiumCalculator/usePremiumCalculatorForm';

export default function PremiumCalculatorScreen() {
  const { control, calculatedBmi, calculatedHoma, handleCalculate, formState: { errors } } = usePremiumCalculatorForm();

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text variant="h1" style={styles.header}>
        Calculadora de Fertilidad Premium
      </Text>

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
        <Button title="Generar Informe Premium" onPress={handleCalculate} color={theme.colors.primary} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 0,
    textAlign: 'center',
  },
  formContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: theme.colors.card,
    borderRadius: 12,
  },
  buttonContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
});