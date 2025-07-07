import { StyleSheet, TextInput, View, Switch } from 'react-native';
import Text from '../../../../presentation/components/common/Text';
import { theme } from '../../../../config/theme';

type Props = {
  amhValue: string;
  setAmhValue: (value: string) => void;
  tshValue: string;
  setTshValue: (value: string) => void;
  prolactinValue: string;
  setProlactinValue: (value: string) => void;
  tpoAbPositive: boolean;
  setTpoAbPositive: (value: boolean) => void;
  insulinValue: string;
  setInsulinValue: (value: string) => void;
  glucoseValue: string;
  setGlucoseValue: (value: string) => void;
  calculatedHoma: number | null;
};

export const LabTestsForm = (props: Props) => {
  return (
    <>
      <Text style={styles.groupLabel}>Resultados de Laboratorio</Text>

      <Text style={styles.label}>Hormona Antimülleriana (AMH en ng/mL)</Text>
      <TextInput
        style={styles.input}
        value={props.amhValue}
        onChangeText={props.setAmhValue}
        keyboardType="decimal-pad"
        placeholder="Ej: 1.8"
      />

      <Text style={styles.label}>Hormona Tiroidea (TSH en µIU/mL)</Text>
      <TextInput
        style={styles.input}
        value={props.tshValue}
        onChangeText={props.setTshValue}
        keyboardType="decimal-pad"
        placeholder="Ej: 2.1"
      />

      <Text style={styles.label}>Prolactina (ng/mL)</Text>
      <TextInput
        style={styles.input}
        value={props.prolactinValue}
        onChangeText={props.setProlactinValue}
        keyboardType="decimal-pad"
        placeholder="Ej: 15"
      />
      
      <View style={styles.switchContainer}>
        <Text style={styles.labelSwitch}>¿Anticuerpos Antitiroideos (TPO) positivos?</Text>
        <Switch onValueChange={props.setTpoAbPositive} value={props.tpoAbPositive} trackColor={{ false: '#767577', true: theme.colors.primary }}/>
      </View>

      <Text style={styles.label}>Insulina Basal (µU/mL)</Text>
      <TextInput
        style={styles.input}
        value={props.insulinValue}
        onChangeText={props.setInsulinValue}
        keyboardType="decimal-pad"
        placeholder="Ej: 10"
      />

      <Text style={styles.label}>Glucosa en Ayunas (mg/dL)</Text>
      <TextInput
        style={styles.input}
        value={props.glucoseValue}
        onChangeText={props.setGlucoseValue}
        keyboardType="decimal-pad"
        placeholder="Ej: 85"
      />

      {props.calculatedHoma && (
        <Text style={styles.calculatedValueText}>
          Índice HOMA-IR Calculado: {props.calculatedHoma.toFixed(2)}
        </Text>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  groupLabel: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 8, marginTop: 16 },
  label: { marginBottom: 8, fontWeight: '500' },
  labelSwitch: { flex: 1, fontWeight: '500' },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  switchContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: 8, 
    marginBottom: 8 
  },
  calculatedValueText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    color: theme.colors.primary,
    marginBottom: 16,
  },
});