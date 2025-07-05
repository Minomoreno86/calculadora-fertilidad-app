import { Stack } from 'expo-router';
import { theme } from '@/config/theme'; // Use this alias path

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.card,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Calculadora' }} />
      {/* Add a screen for the results page later */}
    </Stack>
  );
}