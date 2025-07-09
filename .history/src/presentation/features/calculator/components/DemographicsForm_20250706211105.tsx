import { StyleSheet, TextInput } from 'react-native';
import Text from '../../../../presentation/components/common/Text';
import { theme } from '../../../../config/theme';

type Props = {
  age: string;
  setAge: (value: string) => void;
  weight: string;
  setWeight: (value: string) => void;
  height: string;
  setHeight: (value: string) => void;
  calculatedBmi: number | null;
};

export const DemographicsForm = ({
  age,
  setAge,
  weight,
  setWeight,
  height,
  setHeight,
  calculatedBmi,
}: Props) => {
  return (
    <>
      <Text style={styles.groupLabel}>Perfil Básico</Text>
      
      <Text style={styles.label}>Edad (años)</Text>
      <TextInput
        style={styles.input}
        value={age}
        onChangeText={setAge}
        keyboardType="number-pad"
        placeholder="Ej: 32"
      />

      <Text style={styles.label}>Peso (kg)</Text>
      <TextInput
        style={styles.input}
        value={weight}
        onChangeText={setWeight}
        keyboardType="decimal-pad"
        placeholder="Ej: 65"
      />

      <Text style={styles.label}>Altura (cm)</Text>
      <TextInput
        style={styles.input}
        value={height}
        onChangeText={setHeight}
        keyboardType="number-pad"
        placeholder="Ej: 165"
      />
      
      {calculatedBmi && (
        <Text style={styles.calculatedValueText}>
          IMC Calculado: {calculatedBmi.toFixed(2)}
        </Text>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  groupLabel: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee', 
    paddingBottom: 8 
  },
  label: { 
    marginBottom: 8, 
    fontWeight: '500' 
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  calculatedValueText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    color: theme.colors.primary,
    marginBottom: 16,
  },
});