import { Stack } from 'expo-router';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import AuthGuard from '@/components/auth/AuthGuard';
import '../i18n';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LanguageProvider>
          <AuthGuard>
            <Stack>
              <Stack.Screen name="(app)" options={{ headerShown: false }} />
            </Stack>
          </AuthGuard>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
