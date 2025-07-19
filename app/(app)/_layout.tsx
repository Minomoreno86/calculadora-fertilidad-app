import { Stack } from 'expo-router';
import { theme } from '../../src/config/theme'; // <- Ruta relativa
import { ParallelValidationProvider } from '@/core/context/ParallelValidationContext';

export default function AppLayout() {
  return (
    <ParallelValidationProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.card },
          headerTintColor: theme.colors.text,
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Calculadora' }} />
        <Stack.Screen name="results" options={{ title: 'Resultados' }} />
      </Stack>
    </ParallelValidationProvider>
  );
}
