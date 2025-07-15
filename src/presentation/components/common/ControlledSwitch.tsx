import React from 'react';
import { View, Switch, StyleSheet } from 'react-native';
import Text from './Text';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { useDynamicTheme } from '@/hooks/useDynamicTheme';

type ControlledSwitchProps<TFormValues extends FieldValues> = {
  control: Control<TFormValues>;
  name: Path<TFormValues>;
  label: string;
};

export const ControlledSwitch = <TFormValues extends FieldValues>({
  control,
  name,
  label,
}: ControlledSwitchProps<TFormValues>) => {
  // 🎨 TEMA DINÁMICO
  const theme = useDynamicTheme();
  
  // 🎨 Crear estilos dinámicos
  const styles = createStyles(theme);
  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <Switch
            onValueChange={onChange}
            value={value}
            trackColor={{ 
              false: theme.isDark ? '#3A3A3A' : '#767577', 
              true: theme.colors.primary 
            }}
            thumbColor={theme.isDark ? '#F4F3F4' : '#FFFFFF'}
          />
        )}
      />
    </View>
  );
};

// 🎨 Función para crear estilos dinámicos
const createStyles = (theme: ReturnType<typeof useDynamicTheme>) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
    marginBottom: theme.spacing.s,
  },
  label: {
    ...theme.typography.body,
    flex: 1,
    color: theme.colors.text,
  },
});
