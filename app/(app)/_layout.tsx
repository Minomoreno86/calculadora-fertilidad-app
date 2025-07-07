import { Stack } from 'expo-router';
import { theme } from '../../src/config/theme'; // <- Ruta relativa

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.card },
        headerTintColor: theme.colors.text,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Calculadora' }} />
    </Stack>
  );
}