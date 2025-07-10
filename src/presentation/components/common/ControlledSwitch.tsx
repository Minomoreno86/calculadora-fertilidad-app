import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { theme } from '@/config/theme';

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
            trackColor={{ false: '#767577', true: theme.colors.primary }}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
  },
});
