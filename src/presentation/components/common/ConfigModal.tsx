import React from 'react';
const { useState } = React;
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Text from './Text';
import { useDynamicTheme } from '../../../hooks/useDynamicTheme';

// Importación segura con tipos específicos
let Modal: React.ComponentType<{
  visible: boolean;
  animationType?: string;
  transparent?: boolean;
  onRequestClose?: () => void;
  children?: React.ReactNode;
}>;
let Switch: React.ComponentType<{
  value: boolean;
  onValueChange: (value: boolean) => void;
  trackColor?: { false?: string; true?: string };
  thumbColor?: string;
}>;
let Alert: {
  alert: (title: string, message?: string, buttons?: unknown[]) => void;
};

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const RN = require('react-native');
  Modal = RN.Modal;
  Switch = RN.Switch;
  Alert = RN.Alert;
} catch (error) {
  console.warn('Modal, Switch o Alert no disponibles en esta versión de React Native:', error);
  
  const FallbackModal = ({ children }: { children?: React.ReactNode }) => <View>{children}</View>;
  FallbackModal.displayName = 'FallbackModal';
  
  const FallbackSwitch = ({ onValueChange, value }: { onValueChange: (value: boolean) => void; value: boolean }) => (
    <TouchableOpacity onPress={() => onValueChange(!value)}>
      <View style={{ width: 50, height: 30, backgroundColor: value ? '#4CAF50' : '#ccc' }} />
    </TouchableOpacity>
  );
  FallbackSwitch.displayName = 'FallbackSwitch';
  
  Modal = FallbackModal;
  Switch = FallbackSwitch;
  Alert = { alert: (title: string, message?: string) => console.log(title, message) };
}

interface ConfigModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({ visible, onClose }) => {
  const [notifications, setNotifications] = useState(true);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  
  // 🎨 Obtener tema dinámico y funciones de control
  const theme = useDynamicTheme();
  const { isDark, toggleTheme } = theme;
  
  // 🎨 Crear estilos dinámicos basados en el tema actual
  const styles = createStyles(theme);

  // 💡 Helper para tamaño de fuente
  const getFontSize = (size: 'small' | 'medium' | 'large') => {
    switch (size) {
      case 'small': return 12;
      case 'medium': return 16;
      case 'large': return 20;
      default: return 16;
    }
  };

  const handleExportData = () => {
    if (!Alert) {
      console.log('📤 Exportar Datos - Alert no disponible');
      return;
    }
    
    Alert.alert(
      '📤 Exportar Datos',
      'Tu información será exportada de forma segura y privada.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Exportar', onPress: () => console.log('🔄 Exportando datos...') },
      ]
    );
  };

  const handleClearData = () => {
    if (!Alert) {
      console.log('🧹 Limpiar Datos - Alert no disponible');
      return;
    }
    
    Alert.alert(
      '🧹 Limpiar Datos',
      '¿Estás segura de que quieres eliminar toda la información? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Limpiar', 
          style: 'destructive',
          onPress: () => console.log('🗑️ Limpiando datos...') 
        },
      ]
    );
  };

  const handleAbout = () => {
    if (!Alert) {
      console.log('ℹ️ Acerca de - Alert no disponible');
      return;
    }
    
    Alert.alert(
      'ℹ️ Acerca de',
      'Calculadora de Fertilidad v1.0\n\nDesarrollada con cuidado para proporcionar información personalizada sobre fertilidad.\n\n⚠️ Esta app es solo informativa y no reemplaza la consulta médica.',
      [{ text: 'Entendido' }]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title}>⚙️ Configuración</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content}>
          {/* Apariencia */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎨 Apariencia</Text>
            
            <View style={styles.option}>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>🌙 Modo Oscuro</Text>
                <Text style={styles.optionSubtitle}>Cambiar a tema oscuro</Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{
                  false: '#E5E7EB',
                  true: theme.colors.primary,
                }}
                thumbColor={'#FFFFFF'}
              />
            </View>

            <View style={styles.option}>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>📏 Tamaño de Fuente</Text>
                <Text style={styles.optionSubtitle}>Ajustar legibilidad</Text>
              </View>
              <View style={styles.fontSizeContainer}>
                {(['small', 'medium', 'large'] as const).map((size) => (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.fontSizeButton,
                      fontSize === size && styles.fontSizeButtonActive,
                    ]}
                    onPress={() => setFontSize(size)}
                  >
                    <Text
                      style={[
                        styles.fontSizeText,
                        fontSize === size && styles.fontSizeTextActive,
                        { fontSize: getFontSize(size) }
                      ]}
                    >
                      A
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Notificaciones */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔔 Notificaciones</Text>
            
            <View style={styles.option}>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>💊 Recordatorios</Text>
                <Text style={styles.optionSubtitle}>Notificaciones sobre salud reproductiva</Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{
                  false: '#E5E7EB',
                  true: theme.colors.primary,
                }}
                thumbColor={'#FFFFFF'}
              />
            </View>
          </View>

          {/* Datos */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💾 Gestión de Datos</Text>
            
            <TouchableOpacity style={styles.actionOption} onPress={handleExportData}>
              <Text style={styles.optionTitle}>📤 Exportar Datos</Text>
              <Text style={styles.optionSubtitle}>Guardar tu información de forma segura</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionOption} onPress={handleClearData}>
              <Text style={[styles.optionTitle, styles.dangerText]}>🧹 Limpiar Datos</Text>
              <Text style={styles.optionSubtitle}>Eliminar toda la información guardada</Text>
            </TouchableOpacity>
          </View>

          {/* Información */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ℹ️ Información</Text>
            
            <TouchableOpacity style={styles.actionOption} onPress={handleAbout}>
              <Text style={styles.optionTitle}>📋 Acerca de la App</Text>
              <Text style={styles.optionSubtitle}>Versión, términos y condiciones</Text>
            </TouchableOpacity>
          </View>

          {/* Espaciado inferior */}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </View>
    </Modal>
  );
};

// 🎨 Función para crear estilos dinámicos
const createStyles = (theme: ReturnType<typeof useDynamicTheme>) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: theme.colors.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.secondary,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
  },
  closeText: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: theme.colors.primary,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: theme.colors.surface,
    fontFamily: 'Lato-Bold',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: theme.colors.text,
    marginBottom: 15,
    fontFamily: 'Lato-Bold',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: theme.isDark ? theme.colors.black : '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: theme.isDark ? 0.3 : 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: theme.colors.text,
    fontFamily: 'Lato-Bold',
  },
  optionSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 2,
    fontFamily: 'Lato-Regular',
  },
  actionOption: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: theme.isDark ? theme.colors.black : '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: theme.isDark ? 0.3 : 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dangerText: {
    color: theme.colors.error,
  },
  fontSizeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  fontSizeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.border,
  },
  fontSizeButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  fontSizeText: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: theme.colors.textSecondary,
  },
  fontSizeTextActive: {
    color: theme.colors.surface,
  },
  bottomSpacer: {
    height: 40,
  },
});
