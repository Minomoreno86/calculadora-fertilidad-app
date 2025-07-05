import { Stack } from 'expo-router';
// Update the import path below if your theme file is located elsewhere

import { theme } from '@/config/theme';
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
    </Stack>
  );
}