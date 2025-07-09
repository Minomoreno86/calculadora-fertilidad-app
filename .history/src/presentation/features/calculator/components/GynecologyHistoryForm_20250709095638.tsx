import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Switch, TouchableOpacity } from 'react-native';
import Text from '../../../../presentation/components/common/Text';
import { OptionSelectorModal } from '../../../../presentation/components/common/OptionSelectorModal';
import { MyomaType, AdenomyosisType, PolypType, HsgResult } from '../../../../core/domain/models';
import { theme } from '../../../../config/theme';

type Props = {
  cycleLength: string;
  setCycleLength: (value: string) => void;
  infertilityDuration: string;
  setInfertilityDuration: (value: string) => void;
  hasPcos: boolean;
  setHasPcos: (value: boolean) => void;
  endometriosisStage: string; // CORRECCIÓN: Se usa string, ya que el valor es '0'-'4'.
  setEndometriosisStage: (value: string) => void;
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
  const [modalVisible, setModalVisible] = useState<string | null>(null);

  // Mapeo de opciones para mantener el JSX limpio
  const options = {
    endometriosis: [
      { label: 'Sin endometriosis', value: '0' },
      { label: 'Grado 1 - Mínima', value: '1' },
      { label: 'Grado 2 - Leve', value: '2' },
      { label: 'Grado 3 - Moderada', value: '3' },
      { label: 'Grado 4 - Severa', value: '4' },
    ],
    myoma: [
      { label: 'Sin miomas', value: 'none' },
      { label: 'Submucoso (> 1 cm)', value: 'submucosal' },
      { label: 'Intramural (> 4 cm)', value: 'intramural_large' },
      { label: 'Subseroso', value: 'subserosal' },
    ],
    polyp: [
      { label: 'Sin pólipos', value: 'none' },
      { label: 'Pólipo pequeño (< 1 cm)', value: 'small' },
      { label: 'Pólipo grande (≥ 1 cm o múltiples)', value: 'large' },
      { label: 'Pólipo sobre ostium tubárico', value: 'ostium' },
    ],
    adenomyosis: [
      { label: 'Sin adenomiosis', value: 'none' },
      { label: 'Adenomiosis focal', value: 'focal' },
      { label: 'Adenomiosis difusa', value: 'diffuse' },
    ],
    hsg: [
      { label: 'No realizado / Desconocido', value: 'unknown' },
      { label: 'Normal', value: 'normal' },
      { label: 'Obstrucción unilateral', value: 'unilateral' },
      { label: 'Obstrucción bilateral', value: 'bilateral' },
      { label: 'Malformación uterina', value: 'malformacion' },
    ],
  };

  const getLabelForValue = (key: keyof typeof options, value: string) => {
      return options[key].find(opt => opt.value === value)?.label || 'Seleccione una opción';
  }

  return (
    <>
      <Text style={styles.groupLabel}>Historia Ginecológica</Text>

      {/* --- Campos de Texto --- */}
      <Text style={styles.label}>Duración de infertilidad (años)</Text>
      <TextInput style={styles.input} value={props.infertilityDuration} onChangeText={props.setInfertilityDuration} keyboardType="number-pad" placeholder="Ej: 2"/>
      
      <Text style={styles.label}>Duración promedio del ciclo (días)</Text>
      <TextInput style={styles.input} value={props.cycleLength} onChangeText={props.setCycleLength} keyboardType="number-pad" placeholder="Ej: 28"/>

      {/* --- Campos de Selección con Modal --- */}
      <Text style={styles.label}>Endometriosis</Text>
      <TouchableOpacity style={styles.input} onPress={() => setModalVisible('endometriosis')}>
        <Text>{getLabelForValue('endometriosis', props.endometriosisStage)}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Miomas Uterinos</Text>
      <TouchableOpacity style={styles.input} onPress={() => setModalVisible('myoma')}>
         <Text>{getLabelForValue('myoma', props.myomaType)}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Pólipos Endometriales</Text>
      <TouchableOpacity style={styles.input} onPress={() => setModalVisible('polyp')}>
         <Text>{getLabelForValue('polyp', props.polypType)}</Text>
      </TouchableOpacity>
      
      <Text style={styles.label}>Adenomiosis</Text>
      <TouchableOpacity style={styles.input} onPress={() => setModalVisible('adenomyosis')}>
         <Text>{getLabelForValue('adenomyosis', props.adenomyosisType)}</Text>
      </TouchableOpacity>
      
      <Text style={styles.label}>Resultado Histerosalpingografía (HSG)</Text>
      <TouchableOpacity style={styles.input} onPress={() => setModalVisible('hsg')}>
        <Text>{getLabelForValue('hsg', props.hsgResult)}</Text>
      </TouchableOpacity>

      {/* --- Campos de Switch --- */}
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
          <TextInput style={styles.input} value={props.numberOfPelvicSurgeries} onChangeText={props.setNumberOfPelvicSurgeries} keyboardType="number-pad" placeholder="Ej: 1"/>
        </>
      )}

      <View style={styles.switchContainer}>
        <Text style={styles.labelSwitch}>¿Ligadura de trompas (OTB)?</Text>
        <Switch onValueChange={props.setHasOtb} value={props.hasOtb} trackColor={{ false: '#767577', true: theme.colors.primary }}/>
      </View>

      {/* --- Modales --- */}
      <OptionSelectorModal visible={modalVisible === 'endometriosis'} selectedValue={props.endometriosisStage} options={options.endometriosis} onSelect={(v) => props.setEndometriosisStage(v)} onClose={() => setModalVisible(null)}/>
      <OptionSelectorModal visible={modalVisible === 'myoma'} selectedValue={props.myomaType} options={options.myoma} onSelect={(v) => props.setMyomaType(v as MyomaType)} onClose={() => setModalVisible(null)}/>
      <OptionSelectorModal visible={modalVisible === 'polyp'} selectedValue={props.polypType} options={options.polyp} onSelect={(v) => props.setPolypType(v as PolypType)} onClose={() => setModalVisible(null)}/>
      <OptionSelectorModal visible={modalVisible === 'adenomyosis'} selectedValue={props.adenomyosisType} options={options.adenomyosis} onSelect={(v) => props.setAdenomyosisType(v as AdenomyosisType)} onClose={() => setModalVisible(null)}/>
      <OptionSelectorModal visible={modalVisible === 'hsg'} selectedValue={props.hsgResult} options={options.hsg} onSelect={(v) => props.setHsgResult(v as HsgResult)} onClose={() => setModalVisible(null)}/>
    </>
  );
};

// ... (los estilos permanecen igual)
const styles = StyleSheet.create({
  groupLabel: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 8, marginTop: 16 },
  label: { marginBottom: 8, fontWeight: '500' },
  labelSwitch: { flex: 1, fontWeight: '500' },
  input: { backgroundColor: '#fff', borderColor: '#ccc', borderWidth: 1, borderRadius: 4, padding: 12, marginBottom: 16, fontSize: 16 },
  switchContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, marginBottom: 8 },
});