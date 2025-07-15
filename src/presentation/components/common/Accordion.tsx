import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, LayoutAnimation, Platform, UIManager } from 'react-native';
import Text from './Text';
import { useDynamicTheme } from '../../../hooks/useDynamicTheme';
import { Ionicons } from '@expo/vector-icons';

// Habilitar LayoutAnimation para Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  initialExpanded?: boolean;
}

const Accordion: React.FC<AccordionProps> = ({ title, children, initialExpanded = false }) => {
  // 🎨 TEMA DINÁMICO
  const theme = useDynamicTheme();
  const styles = createStyles(theme);
  
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleExpand} style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={24} color={theme.colors.primary} />
      </TouchableOpacity>
      {isExpanded && <View style={styles.content}>{children}</View>}
    </View>
  );
};

// 🎨 Función para crear estilos dinámicos
const createStyles = (theme: ReturnType<typeof useDynamicTheme>) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});

export default Accordion;
