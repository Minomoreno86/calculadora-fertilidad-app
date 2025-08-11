import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, StatusBar, SafeAreaView } from 'react-native';
import { CalculatorFormMain } from '@/presentation/features/calculator/components/CalculatorFormMain';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { theme as designTheme } from '@/config/theme';


const { width, height } = Dimensions.get('window');

export default function CalculatorScreen() {
  const { user, isAuthenticated } = useAuth();
  const { isDark } = useTheme();

  console.log('🏥 CALCULATOR SCREEN: Cargando calculadora principal...');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* 🎨 Fondo gradiente completo como login */}
      <LinearGradient
        colors={[
          designTheme.colors.primary,
          designTheme.colors.secondary,
          '#4a90e2',
        ]}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* 🔧 Header con botón config */}
        <View style={styles.customHeader}>
          {/* 👤 Info del usuario */}
          {isAuthenticated && user && (
            <View style={styles.userInfo}>
              <Text style={styles.welcomeText}>
                👋 ¡Hola {user.name}!
              </Text>
              <Text style={styles.userType}>
                {user.type === 'guest' ? '🎯 Modo Invitado' : 
                 user.type === 'login' ? '⭐ Usuario Premium' : 
                 '🆕 Usuario Registrado'}
              </Text>
            </View>
          )}
          
          {/* 🔧 Botón configuración */}
          <TouchableOpacity
            onPress={() => router.push('/config')}
            style={styles.configButton}
          >
            <Ionicons name="settings-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* 🏥 Calculadora principal */}
        <View style={[styles.calculatorContainer, isDark && styles.calculatorContainerDark]}>
          <CalculatorFormMain />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: height,
  },
  safeArea: {
    flex: 1,
  },
  customHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  userInfo: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: 'white',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  userType: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    opacity: 0.9,
  },

  configButton: {
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
  },
  calculatorContainer: {
    flex: 1,
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  calculatorContainerDark: {
    backgroundColor: '#1e1e1e',
  },
});