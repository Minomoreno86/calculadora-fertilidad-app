/**
 * 👤 PANTALLA DE LOGIN PROFESIONAL
 * 
 * Diseño moderno para acceso a funciones premium de fertilidad
 */

import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

// Contextos y themes
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { theme as designTheme } from '@/config/theme';
import PasswordReset from '@/components/auth/PasswordReset';
import AppleSignInButton from '@/components/auth/AppleSignInButton';

const { width, height } = Dimensions.get('window');

// ================= Utilidades de Validación & Constantes =================
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type LoginMode = 'login' | 'register';

interface ValidationResult {
  valid: boolean;
  errors: { email?: string; password?: string };
}

type TranslateFn = (key: string) => string;

function validateCredentials(mode: LoginMode, emailRaw: string, password: string, t: TranslateFn): ValidationResult {
  const email = emailRaw.replace(/\s+/g, ' ').trim().toLowerCase();
  const errors: { email?: string; password?: string } = {};
  if (!email) errors.email = t('login.error_email_requerido');
  else if (!EMAIL_REGEX.test(email)) errors.email = t('login.error_email_invalido');

  if (!password) errors.password = t('login.error_password_requerido');
  else if (mode === 'register' && password.length < 8) errors.password = t('login.error_password_debil');

  return { valid: Object.keys(errors).length === 0, errors };
}

// ===================================================================
// 🏠 COMPONENTE PRINCIPAL
// ===================================================================

export default function LoginScreen() {
  const { isDark } = useTheme();
  const { login, register } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [loginMode, setLoginMode] = React.useState<LoginMode>('login');
  const [showPasswordReset, setShowPasswordReset] = React.useState(false);
  const [errors, setErrors] = React.useState<{ email?: string; password?: string }>({});
  const submittingRef = React.useRef(false);
  // Ajuste refs para evitar error de tipo en definiciones personalizadas
  const emailInputRef = React.useRef<ReturnType<typeof TextInput> | null>(null);
  const passwordInputRef = React.useRef<ReturnType<typeof TextInput> | null>(null);

  const normalizeEmail = React.useCallback((v: string) => v.trim().toLowerCase(), []);

  const resetErrors = React.useCallback(() => setErrors({}), []);

  // 🔐 Handle Login con Supabase (optimizado)
  const handleLogin = React.useCallback(async () => {
    if (submittingRef.current) return; // evita doble submit
    resetErrors();
    const validation = validateCredentials('login', email, password, t);
    if (!validation.valid) {
      setErrors(validation.errors);
      Alert.alert('⚠️', t('login.error_validacion_general'));
      return;
    }
    const normalizedEmail = normalizeEmail(email);
    setIsLoading(true);
    submittingRef.current = true;
    try {
      const result = await login(normalizedEmail, password);
      if (result.success) {
        const namePart = normalizedEmail.split('@')[0];
        const raw = t('login.mensaje_bienvenida');
        const message = raw.replace('{name}', namePart);
        Alert.alert(
          '✅',
          message,
          [{ text: t('login.continuar'), onPress: () => router.replace('/(app)/calculator') }]
        );
        setPassword('');
      } else {
        Alert.alert('❌', result.error || t('login.error_credenciales_incorrectas'));
      }
    } catch {
      Alert.alert('❌', t('login.error_conexion'));
    } finally {
      submittingRef.current = false;
      setIsLoading(false);
    }
  }, [email, password, login, t, normalizeEmail, resetErrors]);

  // 📝 Handle Register con Supabase (optimizado)
  const handleRegister = React.useCallback(async () => {
    if (submittingRef.current) return;
    resetErrors();
    const validation = validateCredentials('register', email, password, t);
    if (!validation.valid) {
      setErrors(validation.errors);
      Alert.alert('⚠️', t('login.error_validacion_general'));
      return;
    }
    const normalizedEmail = normalizeEmail(email);
    setIsLoading(true);
    submittingRef.current = true;
    try {
      const fullName = normalizedEmail.split('@')[0];
      const result = await register(normalizedEmail, password, fullName);
      if (result.success) {
        const fullNameDisplay = fullName;
        const rawOk = t('login.registro_exitoso');
        const rawObs = t('login.registro_exitoso_con_observacion');
        const baseMsg = (result.error ? rawObs : rawOk)
          .replace('{name}', fullNameDisplay)
          .replace('{obs}', result.error || '');
        Alert.alert(
          '🎉',
            baseMsg,
          [{ text: t('login.comenzar'), onPress: () => router.replace('/(app)/calculator') }]
        );
        setPassword('');
      } else {
        Alert.alert('❌', result.error || t('login.error_registro_generico'));
      }
    } catch {
      Alert.alert('❌', t('login.error_conexion'));
    } finally {
      submittingRef.current = false;
      setIsLoading(false);
    }
  }, [email, password, register, t, normalizeEmail, resetErrors]);

  const isRegister = loginMode === 'register';

  // Enfocar primer input al montar para accesibilidad (opcional)
  React.useEffect(() => {
    // Evita interferir si el usuario ya está interactuando
    const timeout = setTimeout(() => {
      emailInputRef.current?.focus();
    }, 400);
    return () => clearTimeout(timeout);
  }, []);

  const onSubmitPrimary = React.useCallback(() => {
    if (isRegister) handleRegister(); else handleLogin();
  }, [isRegister, handleLogin, handleRegister]);

  const toggleMode = React.useCallback((mode: LoginMode) => {
    if (mode !== loginMode) {
      setLoginMode(mode);
      setErrors({});
    }
  }, [loginMode]);

  return (
    <KeyboardAvoidingView
      style={[styles.container, isDark && styles.containerDark]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* 🎨 Background Gradient */}
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

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        accessibilityRole="form"
      >
        {/* 🏥 Logo y Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
              style={styles.logoBackground}
            >
              <Ionicons name="medical" size={48} color="white" />
            </LinearGradient>
          </View>
          
          <Text style={styles.appTitle}>{t('login.fertilidad_ia')}</Text>
          <Text style={styles.appSubtitle}>
            {loginMode === 'login' 
              ? t('login.accede_analisis')
              : t('login.unete_comunidad')
            }
          </Text>
        </View>

        {/* 📱 Formulario Principal */}
        <View style={[styles.formContainer, isDark && styles.formContainerDark]}
          accessibilityHint={isRegister ? t('login.hint_form_registro') : t('login.hint_form_login')}
        >
          {/* 🔄 Toggle Login/Register */}
          <View style={[styles.modeToggle, isDark && styles.modeToggleDark]} accessibilityRole="tablist">
            <TouchableOpacity
              accessibilityRole="tab"
              accessibilityState={{ selected: !isRegister }}
              accessibilityLabel={t('login.iniciar_sesion')}
              style={[styles.modeButton, !isRegister && styles.modeButtonActive, isDark && styles.modeButtonDark, (!isRegister && isDark) && styles.modeButtonActiveDark]}
              onPress={() => toggleMode('login')}
              disabled={isLoading}
            >
              <Text style={[styles.modeButtonText, !isRegister && styles.modeButtonTextActive]}>{t('login.iniciar_sesion')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityRole="tab"
              accessibilityState={{ selected: isRegister }}
              accessibilityLabel={t('login.registrarse')}
              style={[styles.modeButton, isRegister && styles.modeButtonActive, isDark && styles.modeButtonDark, (isRegister && isDark) && styles.modeButtonActiveDark]}
              onPress={() => toggleMode('register')}
              disabled={isLoading}
            >
              <Text style={[styles.modeButtonText, isRegister && styles.modeButtonTextActive]}>{t('login.registrarse')}</Text>
            </TouchableOpacity>
          </View>

          {/* 📧 Email Input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputIconContainer}>
              <Ionicons 
                name="mail" 
                size={20} 
                color={isDark ? '#aaa' : '#666'} 
              />
            </View>
            <TextInput
              ref={emailInputRef}
              style={[styles.input, isDark && styles.inputDark]}
              placeholder={t('login.email_placeholder')}
              placeholderTextColor={isDark ? '#888' : '#999'}
              value={email}
              onChangeText={(v) => { setEmail(v); if (errors.email) setErrors(e => ({ ...e, email: undefined })); }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              textContentType="emailAddress"
              autoComplete="email"
              accessibilityLabel={t('login.email_label')}
              onSubmitEditing={() => passwordInputRef.current?.focus()}
              editable={!isLoading}
            />
          </View>
          {errors.email && <Text style={styles.errorText} accessibilityLiveRegion="polite">{errors.email}</Text>}

          {/* 🔒 Password Input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputIconContainer}>
              <Ionicons 
                name="lock-closed" 
                size={20} 
                color={isDark ? '#aaa' : '#666'} 
              />
            </View>
            <TextInput
              ref={passwordInputRef}
              style={[styles.input, isDark && styles.inputDark]}
              placeholder={t('login.password_placeholder')}
              placeholderTextColor={isDark ? '#888' : '#999'}
              value={password}
              onChangeText={(v) => { setPassword(v); if (errors.password) setErrors(e => ({ ...e, password: undefined })); }}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              textContentType="password"
              autoComplete="password"
              accessibilityLabel={t('login.password_label')}
              onSubmitEditing={onSubmitPrimary}
              editable={!isLoading}
            />
            <TouchableOpacity
              style={styles.passwordToggle}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons 
                name={showPassword ? "eye-off" : "eye"} 
                size={20} 
                color={isDark ? '#aaa' : '#666'} 
              />
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={styles.errorText} accessibilityLiveRegion="polite">{errors.password}</Text>}

          {/* 🔑 Main Action Button */}
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={isRegister ? t('login.boton_registrar') : t('login.boton_iniciar')}
            accessibilityState={{ busy: isLoading, disabled: isLoading }}
            style={[styles.mainButton, (isLoading) && styles.mainButtonDisabled]}
            onPress={onSubmitPrimary}
            disabled={isLoading}
          >
            <LinearGradient
              colors={[designTheme.colors.primary, designTheme.colors.secondary]}
              style={styles.mainButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <Ionicons name="hourglass" size={20} color="white" style={{ marginRight: 8 }} />
                  <Text style={styles.mainButtonText}>
                    {isRegister ? t('login.registrando') : t('login.iniciando')}
                  </Text>
                </View>
              ) : (
                <View style={styles.buttonContent}>
                  <Ionicons name={isRegister ? 'person-add' : 'log-in'} size={20} color="white" />
                  <Text style={styles.mainButtonText}>
                    {isRegister ? t('login.registrarse') : t('login.iniciar_sesion')}
                  </Text>
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/*  Apple Sign In solo iOS */}
          {Platform.OS === 'ios' && <AppleSignInButton />}

          {/* 🔄 Forgot Password */}
          {loginMode === 'login' && (
            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={() => setShowPasswordReset(true)}
            >
              <Text style={[styles.forgotPasswordText, isDark && styles.linkTextDark]}>
                {t('login.olvide_contrasena')}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 📋 Beneficios Premium */}
        <View style={[styles.benefitsContainer, isDark && styles.benefitsContainerDark]}>
          <Text style={[styles.benefitsTitle, isDark && styles.textDark]}>
            {t('login.beneficios_premium')}
          </Text>
          
          <View style={styles.benefitsList}>
            <View style={styles.benefit}>
              <Ionicons name="checkmark-circle" size={20} color={designTheme.colors.primary} />
              <Text style={[styles.benefitText, isDark && styles.textDark]}>
                {t('login.analisis_completo_ia')}
              </Text>
            </View>
            
            <View style={styles.benefit}>
              <Ionicons name="checkmark-circle" size={20} color={designTheme.colors.primary} />
              <Text style={[styles.benefitText, isDark && styles.textDark]}>
                {t('login.simulador_avanzado')}
              </Text>
            </View>
            
            <View style={styles.benefit}>
              <Ionicons name="checkmark-circle" size={20} color={designTheme.colors.primary} />
              <Text style={[styles.benefitText, isDark && styles.textDark]}>
                {t('login.reportes_pdf')}
              </Text>
            </View>
            
            <View style={styles.benefit}>
              <Ionicons name="checkmark-circle" size={20} color={designTheme.colors.primary} />
              <Text style={[styles.benefitText, isDark && styles.textDark]}>
                {t('login.soporte_prioritario')}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* 🔄 Password Reset Modal */}
      <PasswordReset 
        visible={showPasswordReset}
        onClose={() => setShowPasswordReset(false)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.4,
  },
  
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  
  // Header
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoBackground: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  appSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: width * 0.8,
  },
  
  // Form
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  formContainerDark: {
    backgroundColor: '#1e1e1e',
  },
  
  // Mode Toggle
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  modeToggleDark: {
    backgroundColor: '#2a2a2a',
  },
  modeButtonDark: {
    backgroundColor: 'transparent',
  },
  modeButtonActiveDark: {
    backgroundColor: '#3a3a3a',
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  modeButtonActive: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  modeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  modeButtonTextActive: {
    color: designTheme.colors.primary,
  },
  
  // Inputs
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  inputIconContainer: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#333',
  },
  inputDark: {
    color: '#fff',
    backgroundColor: '#2a2a2a',
  },
  passwordToggle: {
    padding: 4,
  },
  
  // Main Button
  mainButton: {
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  mainButtonDisabled: {
    opacity: 0.7,
  },
  mainButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  
  // Links
  forgotPassword: {
    alignItems: 'center',
  },
  forgotPasswordText: {
    fontSize: 16,
    color: designTheme.colors.primary,
    fontWeight: '600',
  },
  linkTextDark: {
    color: '#4a9eff',
  },
  
  // Benefits
  benefitsContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  benefitsContainerDark: {
    backgroundColor: '#1e1e1e',
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  benefitsList: {
    // gap reemplazado por margin en children
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  textDark: {
    color: '#fff',
  },
  errorText: {
    color: '#d9534f',
    fontSize: 13,
    marginTop: -8,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
});