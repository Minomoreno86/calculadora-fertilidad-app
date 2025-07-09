import { StyleSheet, TextInput } from 'react-native';
import Text from '../../../../presentation/components/common/Text';

type Props = {
  spermConcentration: string;
  setSpermConcentration: (value: string) => void;
  spermMotility: string;
  setSpermMotility: (value: string) => void;
  spermMorphology: string;
  setSpermMorphology: (value: string) => void;
};

export const MaleFactorForm = (props: Props) => {
  return (
    <>
      <Text style={styles.groupLabel}>Factor Masculino (Espermatograma)</Text>

      <Text style={styles.label}>Concentración (millones/mL)</Text>
      <TextInput
        style={styles.input}
        value={props.spermConcentration}
        onChangeText={props.setSpermConcentration}
        keyboardType="decimal-pad"
        placeholder="Ej: 45"
      />

      <Text style={styles.label}>Motilidad Progresiva (%)</Text>
      <TextInput
        style={styles.input}
        value={props.spermMotility}
        onChangeText={props.setSpermMotility}
        keyboardType="decimal-pad"
        placeholder="Ej: 50"
      />

      <Text style={styles.label}>Morfología Normal (%)</Text>
      <TextInput
        style={styles.input}
        value={props.spermMorphology}
        onChangeText={props.setSpermMorphology}
        keyboardType="decimal-pad"
        placeholder="Ej: 5"
      />
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
    paddingBottom: 8, 
    marginTop: 16 
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
});