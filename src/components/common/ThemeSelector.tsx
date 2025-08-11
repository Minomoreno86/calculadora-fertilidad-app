/**
 * 🎨 SELECTOR DE TEMA MEJORADO
 * 
 * Componente para cambiar entre modo claro, oscuro y automático
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, ThemeMode } from '@/contexts/ThemeContext';
import { useDynamicTheme } from '@/hooks/useDynamicTheme';
import { theme as designTheme } from '@/config/theme';

interface ThemeSelectorProps {
  visible: boolean;
  onClose: () => void;
  showAsModal?: boolean;
}

const { width } = Dimensions.get('window');

export default function ThemeSelector({ visible, onClose, showAsModal = true }: ThemeSelectorProps) {
  const { themeMode, effectiveTheme, systemTheme, setTheme, isDark } = useTheme();
  const theme = useDynamicTheme();
  
  // 🎨 Estilos dinámicos
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  const themeOptions: Array<{
    mode: ThemeMode;
    title: string;
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
  }> = [
    {
      mode: 'light',
      title: 'Modo Claro',
      description: 'Siempre usar tema claro',
      icon: 'sunny',
    },
    {
      mode: 'dark',
      title: 'Modo Oscuro',
      description: 'Siempre usar tema oscuro',
      icon: 'moon',
    },
    {
      mode: 'auto',
      title: 'Automático',
      description: `Seguir configuración del sistema (${systemTheme === 'dark' ? 'oscuro' : 'claro'})`,
      icon: 'phone-portrait',
    },
  ];

  const handleThemeSelect = (mode: ThemeMode) => {
    setTheme(mode);
    onClose();
  };

  const getThemeStatusText = () => {
    switch (themeMode) {
      case 'light':
        return '☀️ Modo Claro';
      case 'dark':
        return '🌙 Modo Oscuro';
      case 'auto':
        return `📱 Automático (${effectiveTheme === 'dark' ? 'Oscuro' : 'Claro'})`;
      default:
        return 'Tema';
    }
  };

  const SelectorContent = () => (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        <Text style={[styles.title, isDark && styles.textDark]}>
          🎨 Seleccionar Tema
        </Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={isDark ? 'white' : 'black'} />
        </TouchableOpacity>
      </View>

      <View style={styles.currentTheme}>
        <Text style={[styles.currentThemeText, isDark && styles.textSecondaryDark]}>
          Tema actual: {getThemeStatusText()}
        </Text>
      </View>

      <View style={styles.options}>
        {themeOptions.map((option) => (
          <TouchableOpacity
            key={option.mode}
            style={[
              styles.option,
              isDark && styles.optionDark,
              themeMode === option.mode && styles.optionActive,
              themeMode === option.mode && isDark && styles.optionActiveDark,
            ]}
            onPress={() => handleThemeSelect(option.mode)}
          >
            <View style={styles.optionLeft}>
              <View style={[
                styles.iconContainer,
                themeMode === option.mode && styles.iconContainerActive,
              ]}>
                <Ionicons 
                  name={option.icon} 
                  size={24} 
                  color={themeMode === option.mode ? 'white' : (isDark ? '#aaa' : '#666')}
                />
              </View>
              <View style={styles.optionText}>
                <Text style={[
                  styles.optionTitle,
                  isDark && styles.textDark,
                  themeMode === option.mode && styles.optionTitleActive,
                ]}>
                  {option.title}
                </Text>
                <Text style={[
                  styles.optionDescription,
                  isDark && styles.textSecondaryDark,
                ]}>
                  {option.description}
                </Text>
              </View>
            </View>
            
            {themeMode === option.mode && (
              <Ionicons 
                name="checkmark-circle" 
                size={24} 
                color={designTheme.colors.primary} 
              />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  if (!visible) return null;

  if (showAsModal) {
    return (
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={onClose}
      >
        <SelectorContent />
      </Modal>
    );
  }

  return (
    <View style={styles.overlay}>
      <View style={styles.modalContainer}>
        <SelectorContent />
      </View>
    </View>
  );
}

const createStyles = (theme: ReturnType<typeof useDynamicTheme>) => StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    margin: 20,
    maxWidth: width * 0.9,
    width: '100%',
  },
  container: {
    backgroundColor: theme.colors.surface,
    padding: 20,
    borderRadius: 20,
  },
  containerDark: {
    backgroundColor: theme.colors.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  closeButton: {
    padding: 8,
  },
  currentTheme: {
    backgroundColor: theme.colors.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  currentThemeText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
  },
  options: {
    gap: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    backgroundColor: theme.colors.background,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionDark: {
    backgroundColor: theme.colors.background,
  },
  optionActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '20',
  },
  optionActiveDark: {
    backgroundColor: theme.colors.primary + '30',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e9ecef',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  iconContainerActive: {
    backgroundColor: designTheme.colors.primary,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  optionTitleActive: {
    color: theme.colors.primary,
  },
  optionDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  textDark: {
    color: theme.colors.text,
  },
  textSecondaryDark: {
    color: theme.colors.textSecondary,
  },
});