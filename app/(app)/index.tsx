
import { StyleSheet, Button, ScrollView, View } from 'react-native';
import Box from '../../src/presentation/components/common/Box';
import Text from '../../src/presentation/components/common/Text';
import { useCalculatorForm } from '../../src/presentation/features/calculator/useCalculatorForm';
import { DemographicsForm } from '../../src/presentation/features/calculator/components/DemographicsForm';
import { GynecologyHistoryForm } from '../../src/presentation/features/calculator/components/GynecologyHistoryForm';
import { LabTestsForm } from '../../src/presentation/features/calculator/components/LabTestsForm';
import { MaleFactorForm } from '../../src/presentation/features/calculator/components/MaleFactorForm';
import { theme } from '../../src/config/theme';

export default function CalculatorScreen() {
  const {
    control,
    calculatedBmi,
    calculatedHoma,
    handleCalculate,
  } = useCalculatorForm();

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text variant="h1" style={styles.header}>
        Calculadora de Fertilidad
      </Text>

      <Box style={styles.formContainer}>
        <DemographicsForm control={control} calculatedBmi={calculatedBmi} />
        <GynecologyHistoryForm control={control} />
        <LabTestsForm control={control} calculatedHoma={calculatedHoma} />
        <MaleFactorForm control={control} />
      </Box>

      <View style={styles.buttonContainer}>
        <Button title="Generar Informe de Fertilidad" onPress={handleCalculate} color={theme.colors.primary} />
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
  }
});