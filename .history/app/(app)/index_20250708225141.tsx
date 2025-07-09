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
    formState,
    setFormField,
    calculatedBmi,
    calculatedHoma,
    handleCalculate,
  } = useCalculatorForm();

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text variant="title" style={styles.header}>
        Calculadora de Fertilidad
      </Text>

      <Box style={styles.formContainer}>
        {/* Componente 1: Datos Demográficos */}
        <DemographicsForm
          age={formState.age}
          setAge={(val) => setFormField('age', val)}
          weight={formState.weight}
          setWeight={(val) => setFormField('weight', val)}
          height={formState.height}
          setHeight={(val) => setFormField('height', val)}
          calculatedBmi={calculatedBmi}
        />
        
        {/* Componente 2: Historia Ginecológica */}
        <GynecologyHistoryForm
          cycleLength={formState.cycleLength}
          setCycleLength={(val) => setFormField('cycleLength', val)}
          infertilityDuration={formState.infertilityDuration}
          setInfertilityDuration={(val) => setFormField('infertilityDuration', val)}
          hasPcos={formState.hasPcos}
          setHasPcos={(val) => setFormField('hasPcos', val)}
          endometriosisStage={formState.endometriosisStage}
          setEndometriosisStage={(val) => setFormField('endometriosisStage', val)}
          myomaType={formState.myomaType}
          setMyomaType={(val) => setFormField('myomaType', val)}
          adenomyosisType={formState.adenomyosisType}
          setAdenomyosisType={(val) => setFormField('adenomyosisType', val)}
          polypType={formState.polypType}
          setPolypType={(val) => setFormField('polypType', val)}
          hsgResult={formState.hsgResult}
          setHsgResult={(val) => setFormField('hsgResult', val)}
          hasPelvicSurgery={formState.hasPelvicSurgery}
          setHasPelvicSurgery={(val) => setFormField('hasPelvicSurgery', val)}
          hasOtb={formState.hasOtb}
          setHasOtb={(val) => setFormField('hasOtb', val)}
          numberOfPelvicSurgeries={formState.numberOfPelvicSurgeries}
          setNumberOfPelvicSurgeries={(val) => setFormField('numberOfPelvicSurgeries', val)}
        />
        
        {/* Componente 3: Pruebas de Laboratorio */}
        <LabTestsForm
          amhValue={formState.amhValue}
          setAmhValue={(val) => setFormField('amhValue', val)}
          tshValue={formState.tshValue}
          setTshValue={(val) => setFormField('tshValue', val)}
          prolactinValue={formState.prolactinValue}
          setProlactinValue={(val) => setFormField('prolactinValue', val)}
          tpoAbPositive={formState.tpoAbPositive}
          setTpoAbPositive={(val) => setFormField('tpoAbPositive', val)}
          insulinValue={formState.insulinValue}
          setInsulinValue={(val) => setFormField('insulinValue', val)}
          glucoseValue={formState.glucoseValue}
          setGlucoseValue={(val) => setFormField('glucoseValue', val)}
          calculatedHoma={calculatedHoma}
        />
        
        {/* Componente 4: Factor Masculino */}
        <MaleFactorForm
          spermConcentration={formState.spermConcentration}
          setSpermConcentration={(val) => setFormField('spermConcentration', val)}
          spermMotility={formState.spermMotility}
          setSpermMotility={(val) => setFormField('spermMotility', val)}
          spermMorphology={formState.spermMorphology}
          setSpermMorphology={(val) => setFormField('spermMorphology', val)}
        />
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