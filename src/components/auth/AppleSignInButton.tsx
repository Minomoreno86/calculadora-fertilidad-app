import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 *  AppleSignInButton
 * Botón reutilizable para Sign in with Apple
 */
export const AppleSignInButton: React.FC = () => {
  const { loginWithApple } = useAuth();
  const { t } = useLanguage();
  const [available, setAvailable] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (Platform.OS === 'ios') {
          const isAvail = await AppleAuthentication.isAvailableAsync();
          if (mounted) setAvailable(isAvail);
        }
      } catch {
        setAvailable(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleAppleLogin = React.useCallback(async () => {
    if (!available || loading) return;
    setLoading(true);
    try {
      const result = await loginWithApple();
      if (!result.success && result.error) {
        // Cancel silencioso
        if (result.error.toLowerCase().includes('cancel')) return;
        // Importante: evitar Alert si no disponible en ambiente (patrón proyecto usa fallback en otras pantallas)
        try {
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          const { Alert } = require('react-native');
          Alert.alert('', result.error || t('login.error_generico'));
        } catch {
          console.log('[AppleSignInButton] Error Apple:', result.error);
        }
      }
    } catch (err) {
      const msg = (err as { message?: string })?.message || 'No se pudo completar el inicio con Apple';
      if (!/canceled|cancelled/i.test(msg)) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          const { Alert } = require('react-native');
          Alert.alert('', msg);
        } catch {
          console.log('[AppleSignInButton] Error inesperado:', msg);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [available, loading, loginWithApple, t]);

  // Reemplazo ActivityIndicator por spinner simple personalizado para evitar dependencia faltante
  const Spinner: React.FC<{ color?: string }> = ({ color = '#fff' }) => (
    <View style={styles.spinner}>
      <View style={[styles.spinnerInner, { borderTopColor: 'transparent', borderColor: color }]} />
    </View>
  );

  if (!available) return null;

  return (
    <View style={styles.wrapper}>
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={12}
        style={styles.appleButton}
        onPress={handleAppleLogin}
      />
      {loading && (
        <View style={styles.loadingOverlay} pointerEvents="none">
          <Spinner color="#fff" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 8,
    marginBottom: 12,
  },
  appleButton: {
    width: '100%',
    height: 50,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  spinner: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#fff',
    animationKeyframes: {}, // placeholder ignorado por RN, documentación futura
  },
});

export default AppleSignInButton;
