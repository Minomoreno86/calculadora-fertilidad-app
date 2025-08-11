import { Stack, router } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../src/config/theme'; // <- Ruta relativa
import { ParallelValidationProvider } from '@/core/context/ParallelValidationContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useDynamicTheme } from '@/hooks/useDynamicTheme';
import ProtectedRoute, { GuestOnlyRoute } from '@/components/auth/ProtectedRoute';

export default function AppLayout() {
  const { isDark } = useTheme();
  const dynamicTheme = useDynamicTheme();
  
  // 🔧 Botón de configuración mejorado para header
  const ConfigButton = () => (
    <TouchableOpacity
      onPress={() => router.push('/config')}
      style={{ 
        marginRight: 12, 
        padding: 10,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
      }}
      activeOpacity={0.7}
    >
      <Ionicons name="settings-outline" size={22} color="white" />
    </TouchableOpacity>
  );

  return (
    <ParallelValidationProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: dynamicTheme.colors.surface },
          headerTintColor: dynamicTheme.colors.text,
          headerTitleStyle: { fontWeight: 'bold' },
          headerRight: () => <ConfigButton />,
        }}
        initialRouteName="calculator"

      >
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen 
          name="calculator" 
          options={{ 
            headerShown: false, // 🚫 Sin header - pantalla completa
            gestureEnabled: false, // 🚫 Sin swipe back
          }} 
        />
        <Stack.Screen 
          name="results" 
          options={{ 
            title: 'Análisis de Fertilidad',
            gestureEnabled: false, // 🚫 Solo resultados sin swipe back
            headerStyle: { backgroundColor: 'transparent' },
            headerBackground: () => (
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={{ flex: 1 }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
            ),
            headerTintColor: 'white',
            headerTitleStyle: { 
              fontWeight: 'bold', 
              fontSize: 18,
              color: 'white' 
            },
          }} 
        />
        <Stack.Screen 
          name="config" 
          options={{ 
            headerShown: false, // 🚫 Sin header - pantalla completa
            presentation: 'modal',
            gestureEnabled: true, // ✅ Config con slide hacia abajo
          }} 
        />
        <Stack.Screen 
          name="login" 
          options={{ 
            title: '👤 Iniciar Sesión',
            presentation: 'modal',
            headerStyle: { backgroundColor: dynamicTheme.colors.primary },
            headerTintColor: 'white',
          }} 
        />
      </Stack>
    </ParallelValidationProvider>
  );
}
