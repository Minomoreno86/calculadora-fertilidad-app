/**
 * 🔄 COMPONENTE DE RESET DE CONTRASEÑA
 * Modal para recuperación de contraseña con Supabase
 */

import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDynamicTheme } from '@/hooks/useDynamicTheme';

interface PasswordResetProps {
  visible: boolean;
  onClose: () => void;
}

export default function PasswordReset({ visible, onClose }: PasswordResetProps) {
  const { resetPassword } = useAuth();
  const { t } = useLanguage();
  const theme = useDynamicTheme();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('⚠️ Email Requerido', 'Por favor ingresa tu email');
      return;
    }

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('⚠️ Email Inválido', 'Por favor ingresa un email válido');
      return;
    }

    setIsLoading(true);

    try {
      const result = await resetPassword(email);

      if (result.success) {
        Alert.alert(
          '✅ Email Enviado',
          `Se ha enviado un enlace de recuperación a ${email}. Revisa tu bandeja de entrada y spam.`,
          [
            {
              text: 'Entendido',
              onPress: () => {
                setEmail('');
                onClose();
              },
            },
          ]
        );
      } else {
        Alert.alert('❌ Error', result.error || 'No se pudo enviar el email de recuperación');
      }
    } catch (error) {
      Alert.alert('❌ Error de Conexión', 'Verifica tu conexión a internet');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              🔄 Recuperar Contraseña
            </Text>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
              Ingresa tu email y te enviaremos un enlace para crear una nueva contraseña.
            </Text>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                📧 Email
              </Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.colors.inputBackground,
                  color: theme.colors.text,
                  borderColor: theme.colors.border 
                }]}
                placeholder="tu-email@ejemplo.com"
                placeholderTextColor={theme.colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>

            {/* Reset Button */}
            <TouchableOpacity
              style={[styles.resetButton, isLoading && styles.disabledButton]}
              onPress={handleResetPassword}
              disabled={isLoading}
            >
              <LinearGradient
                colors={isLoading ? ['#cccccc', '#999999'] : ['#4CAF50', '#45a049']}
                style={styles.resetButtonGradient}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.resetButtonText}>
                    🔄 Enviar Enlace de Recuperación
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Info */}
            <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
              💡 Si no recibes el email en unos minutos, revisa tu carpeta de spam.
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  content: {
    padding: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 25,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1,
  },
  resetButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  resetButtonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6,
  },
  infoText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});