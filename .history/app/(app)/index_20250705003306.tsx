import { StyleSheet } from 'react-native';
import { theme } from '@/config/theme';
// Corregir las siguientes dos líneas:
import Box from '@/components/common/Box';
import Text from '@/components/common/Text';

export default function CalculatorScreen() {
  return (
    <Box style={styles.container}>
      <Text variant="title">Calcular Probabilidad</Text>
      <Box style={styles.formContainer}>
        <Text variant="body">
          Próximamente aquí estará el formulario para ingresar los datos
          clínicos.
        </Text>
      </Box>
    </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.m,
    backgroundColor: theme.colors.background,
  },
  formContainer: {
    marginTop: theme.spacing.l,
    padding: theme.spacing.m,
    backgroundColor: theme.colors.card,
    borderRadius: 8,
  },
});