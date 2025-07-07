import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Switch, TouchableOpacity } from 'react-native';
import Text from '../../../../presentation/components/common/Text';
import { OptionSelectorModal } from '../../../../presentation/components/common/OptionSelectorModal';
import { SegmentedControl } from '../../../../presentation/components/common/SegmentedControl';
import {
  EndometriosisStage,
  MyomaType,
  AdenomyosisType,
  PolypType,
  HsgResult,
} from '../useCalculatorForm';
import { theme } from '../../../../config/theme';

type Props = {
  cycleLength: string;
  setCycleLength: (value: string) => void;
  infertilityDuration: string;
  setInfertilityDuration: (value: string) => void;
  hasPcos: boolean;
  setHasPcos: (value: boolean) => void;
  endometriosisStage: EndometriosisStage;
  setEndometriosisStage: (value: EndometriosisStage) => void;
  myomaType: MyomaType;
  setMyomaType: (value: MyomaType) => void;
  adenomyosisType: AdenomyosisType;
  setAdenomyosisType: (value: AdenomyosisType) => void;
  polypType: PolypType;
  setPolypType: (value: PolypType) => void;
  hsgResult: HsgResult;
  setHsgResult: (value: HsgResult) => void;
  hasPelvicSurgery: boolean;
  setHasPelvicSurgery: (value: boolean) => void;
  hasOtb: boolean;
  setHasOtb: (value: boolean) => void;
  numberOfPelvicSurgeries: string;
  setNumberOfPelvicSurgeries: (value: string) => void;
};

export const GynecologyHistoryForm = (props: Props) => {
  const [showEndometriosisModal, setShowEndometriosisModal] = useState(false);

  const [showMyomaModal, setShowMyomaModal] = useState(false);

  return (
    <>
      <Text style={styles.groupLabel}>Historia Ginecológica</Text>

      <Text style={styles.label}>Duración de infertilidad (años)</Text>
      <TextInput
        style={styles.input}
        value={props.infertilityDuration}
        onChangeText={props.setInfertilityDuration}
        keyboardType="number-pad"
        placeholder="Ej: 2"
      />
      
      <Text style={styles.label}>Duración promedio del ciclo (días)</Text>
      <TextInput
        style={styles.input}
        value={props.cycleLength}
        onChangeText={props.setCycleLength}
        keyboardType="number-pad"
        placeholder="Ej: 28"
      />

   <Text style={styles.label}>Endometriosis</Text>
<TouchableOpacity
  style={styles.input}
  onPress={() => setShowEndometriosisModal(true)}
>
  <Text>
    {props.endometriosisStage === 'none' ? 'Seleccione una opción' : props.endometriosisStage}
  </Text>
</TouchableOpacity>

<OptionSelectorModal
  visible={showEndometriosisModal}
  selectedValue={props.endometriosisStage}
  options={[
    { label: 'Sin endometriosis', value: '0' }, // ✅ Opción de limpieza (obligatoria)
    { label: 'Grado 1 - Mínima', value: '1' },
    { label: 'Grado 2 - Leve', value: '2' },
    { label: 'Grado 3 - Moderada', value: '3' },
    { label: 'Grado 4 - Severa', value: '4' },
  ]}
  onSelect={(value) => props.setEndometriosisStage(value as EndometriosisStage)}
  onClose={() => setShowEndometriosisModal(false)}
/>
<OptionSelectorModal
  visible={showMyomaModal}
  selectedValue={props.myomaType}
  options={[
    { label: 'Sin miomas', value: 'none' }, // ✅ Opción de limpieza
    { label: 'Submucoso (> 1 cm)', value: 'submucosal' },
    { label: 'Intramural (> 4 cm)', value: 'intramural_large' },
    { label: 'Subseroso', value: 'subserosal' },
  ]}
  onSelect={(value) => props.setMyomaType(value as MyomaType)}
  onClose={() => setShowMyomaModal(false)}
/>
   <Text style={styles.label}>Miomas Uterinos</Text>
<TouchableOpacity
  style={styles.input}
  onPress={() => setShowMyomaModal(true)}
>
  <Text>
    {props.myomaType === 'none' ? 'Seleccione una opción' : props.myomaType}
  </Text>
</TouchableOpacity>

      <Text style={styles.label}>Pólipos Endometriales</Text>
      <SegmentedControl
        options={['none', 'single', 'multiple']}
        selectedValue={props.polypType}
        onSelect={(value) => props.setPolypType(value as PolypType)}
      />

      <Text style={styles.label}>Adenomiosis</Text>
      <SegmentedControl
        options={['none', 'focal', 'diffuse']}
        selectedValue={props.adenomyosisType}
        onSelect={(value) => props.setAdenomyosisType(value as AdenomyosisType)}
      />

      <Text style={styles.label}>Resultado Histerosalpingografía (HSG)</Text>
      <SegmentedControl
        options={['normal', 'unilateral', 'bilateral', 'malformacion']}
        selectedValue={props.hsgResult}
        onSelect={(value) => props.setHsgResult(value as HsgResult)}
      />
      
      <View style={styles.switchContainer}>
        <Text style={styles.labelSwitch}>¿Tiene SOP diagnosticado?</Text>
        <Switch onValueChange={props.setHasPcos} value={props.hasPcos} trackColor={{ false: '#767577', true: theme.colors.primary }}/>
      </View>
      
      <View style={styles.switchContainer}>
        <Text style={styles.labelSwitch}>¿Cirugías pélvicas previas?</Text>
        <Switch onValueChange={props.setHasPelvicSurgery} value={props.hasPelvicSurgery} trackColor={{ false: '#767577', true: theme.colors.primary }}/>
      </View>
      {props.hasPelvicSurgery && (
  <>
    <Text style={styles.label}>Número de cirugías pélvicas</Text>
    <TextInput
      style={styles.input}
      value={props.numberOfPelvicSurgeries}
      onChangeText={props.setNumberOfPelvicSurgeries}
      keyboardType="number-pad"
      placeholder="Ej: 1"
    />
  </>
)}

      <View style={styles.switchContainer}>
        <Text style={styles.labelSwitch}>¿Ligadura de trompas (OTB)?</Text>
        <Switch onValueChange={props.setHasOtb} value={props.hasOtb} trackColor={{ false: '#767577', true: theme.colors.primary }}/>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  groupLabel: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 8, marginTop: 16 },
  label: { marginBottom: 8, fontWeight: '500' },
  labelSwitch: { flex: 1, fontWeight: '500' },
  input: { backgroundColor: '#fff', borderColor: '#ccc', borderWidth: 1, borderRadius: 4, padding: 12, marginBottom: 16, fontSize: 16 },
  switchContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, marginBottom: 8 },
});