import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Text from './Text';
import { useDynamicTheme } from '../../../hooks/useDynamicTheme';

// Safe imports con tipos específicos
let Modal: React.ComponentType<{
  visible: boolean;
  animationType?: string;
  transparent?: boolean;
  onRequestClose?: () => void;
  children?: React.ReactNode;
}>;
let FlatList: React.ComponentType<{
  data: unknown[];
  renderItem: (item: { item: unknown; index: number }) => React.ReactNode;
  keyExtractor?: (item: unknown, index: number) => string;
  showsVerticalScrollIndicator?: boolean;
}>;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const RN = require('react-native');
  Modal = RN.Modal;
  FlatList = RN.FlatList;
} catch {
  // Fallback for environments without Modal/FlatList
  const FallbackModal = ({ children }: { children?: React.ReactNode }) => <View>{children}</View>;
  FallbackModal.displayName = 'FallbackModal';
  
  const FallbackFlatList = ({ data, renderItem }: { data: unknown[]; renderItem: (item: { item: unknown; index: number }) => React.ReactNode }) => (
    <View>{data?.map((item, index) => renderItem({ item, index }))}</View>
  );
  FallbackFlatList.displayName = 'FallbackFlatList';
  
  Modal = FallbackModal;
  FlatList = FallbackFlatList;
}

type OptionSelectorModalProps = {
  visible: boolean;
  options: { label: string; value: string }[];
  selectedValue: string;
  onSelect: (value: string) => void;
  onClose: () => void;
};

export const OptionSelectorModal: React.FC<OptionSelectorModalProps> = ({
  visible,
  options,
  selectedValue,
  onSelect,
  onClose,
}) => {
  // 🎨 TEMA DINÁMICO
  const theme = useDynamicTheme();
  const styles = createStyles(theme);
  
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Seleccione una opción</Text>

          <FlatList
            data={options}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.optionItem, 
                  item.value === selectedValue && { backgroundColor: theme.isDark ? '#1a4b3d' : '#e8f5e8' }
                ]}
                onPress={() => {
                  onSelect(item.value);
                  onClose();
                }}
              >
                <Text style={[
                  styles.optionText,
                  item.value === selectedValue && { color: theme.colors.primary, fontWeight: '600' as const }
                ]}>
                  {item.label} {item.value === selectedValue ? '✔️' : ''}
                </Text>
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// 🎨 Función para crear estilos dinámicos
const createStyles = (theme: ReturnType<typeof useDynamicTheme>) => StyleSheet.create({
  modalOverlay: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.5)' 
  },
  modalContainer: { 
    backgroundColor: theme.colors.surface, 
    padding: 20, 
    borderRadius: 10, 
    width: '80%',
    maxHeight: '70%',
  },
  modalTitle: { 
    fontSize: 18, 
    fontWeight: 'bold' as const, 
    marginBottom: 16,
    color: theme.colors.text,
    textAlign: 'center' as const,
  },
  optionItem: { 
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.isDark ? '#404040' : '#f0f0f0',
  },
  optionText: { 
    fontSize: 16,
    color: theme.colors.text,
  },
  closeButton: { 
    marginTop: 20, 
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  closeButtonText: { 
    color: theme.colors.white, 
    fontSize: 16,
    fontWeight: '600' as const,
  },
});
