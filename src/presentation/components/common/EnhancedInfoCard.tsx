// ===================================================================
// 🎨 TARJETAS INFORMATIVAS MEJORADAS
// ===================================================================

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { theme } from '@/config/theme';

interface Props {
  type: 'tip' | 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  onPress?: () => void;
  showIcon?: boolean;
  animated?: boolean;
}

export const EnhancedInfoCard: React.FC<Props> = ({
  type,
  title,
  message,
  onPress,
  showIcon = true,
  animated = true
}) => {
  const [scaleAnimation] = React.useState(new Animated.Value(0.95));
  const [opacityAnimation] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    if (animated) {
      Animated.parallel([
        Animated.timing(scaleAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnimation, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnimation.setValue(1);
      opacityAnimation.setValue(1);
    }
  }, []);

  const getCardConfig = (type: string) => {
    switch (type) {
      case 'tip':
        return {
          backgroundColor: '#e8f5e8',
          borderColor: '#4caf50',
          iconColor: '#4caf50',
          icon: '💡',
          gradient: ['#e8f5e8', '#f1f8e9']
        };
      case 'info':
        return {
          backgroundColor: '#e3f2fd',
          borderColor: '#2196f3',
          iconColor: '#2196f3',
          icon: 'ℹ️',
          gradient: ['#e3f2fd', '#e8eaf6']
        };
      case 'success':
        return {
          backgroundColor: '#e8f5e8',
          borderColor: '#4caf50',
          iconColor: '#4caf50',
          icon: '✅',
          gradient: ['#e8f5e8', '#f1f8e9']
        };
      case 'warning':
        return {
          backgroundColor: '#fff8e1',
          borderColor: '#ff9800',
          iconColor: '#ff9800',
          icon: '⚠️',
          gradient: ['#fff8e1', '#fffde7']
        };
      case 'error':
        return {
          backgroundColor: '#ffebee',
          borderColor: '#f44336',
          iconColor: '#f44336',
          icon: '❌',
          gradient: ['#ffebee', '#fce4ec']
        };
      default:
        return {
          backgroundColor: '#f5f5f5',
          borderColor: '#e0e0e0',
          iconColor: '#757575',
          icon: '📝',
          gradient: ['#f5f5f5', '#fafafa']
        };
    }
  };

  const config = getCardConfig(type);

  const CardContent = () => (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: config.backgroundColor,
          borderColor: config.borderColor,
          transform: [{ scale: scaleAnimation }],
          opacity: opacityAnimation,
        }
      ]}
    >
      {/* 🎯 Header con icono y título */}
      <View style={styles.header}>
        {showIcon && (
          <View style={[styles.iconContainer, { backgroundColor: config.iconColor }]}>
            <Text style={styles.icon}>{config.icon}</Text>
          </View>
        )}
        
        <View style={styles.headerText}>
          {title && (
            <Text style={[styles.title, { color: config.iconColor }]}>
              {title}
            </Text>
          )}
          <Text style={styles.message}>{message}</Text>
        </View>
        
        {onPress && (
          <View style={styles.actionIndicator}>
            <Text style={[styles.actionIcon, { color: config.iconColor }]}>›</Text>
          </View>
        )}
      </View>

      {/* 🎯 Decoración visual */}
      <View style={[styles.decoration, { backgroundColor: config.iconColor }]} />
    </Animated.View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <CardContent />
      </TouchableOpacity>
    );
  }

  return <CardContent />;
};

// 🎨 Componente especializado para completitud
interface CompletionCardProps {
  completionPercentage: number;
  isValidating?: boolean;
}

export const CompletionCard: React.FC<CompletionCardProps> = ({
  completionPercentage,
  isValidating = false
}) => {
  const getCompletionConfig = (percentage: number) => {
    if (percentage < 40) {
      return {
        type: 'info' as const,
        title: '🚀 ¡Empezando bien!',
        message: `Completitud actual: ${percentage}%. Puedes generar un informe básico ahora o completar más campos para mayor precisión.`,
        icon: '📊'
      };
    } else if (percentage < 70) {
      return {
        type: 'success' as const,
        title: '⭐ ¡Buen progreso!',
        message: `${percentage}% completado. Tu informe será útil y preciso con estos datos.`,
        icon: '📈'
      };
    } else {
      return {
        type: 'success' as const,
        title: '🏆 ¡Excelente!',
        message: `${percentage}% completado. Obtendrás el análisis más detallado y preciso.`,
        icon: '🎯'
      };
    }
  };

  const config = getCompletionConfig(completionPercentage);

  return (
    <View style={styles.completionContainer}>
      <EnhancedInfoCard
        type={config.type}
        title={config.title}
        message={config.message}
        animated={true}
      />
      
      {isValidating && (
        <View style={styles.validatingOverlay}>
          <Text style={styles.validatingText}>🔄 Optimizando análisis...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  icon: {
    fontSize: 16,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    lineHeight: 20,
  },
  message: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
  },
  actionIndicator: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 24,
    height: 24,
  },
  actionIcon: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  decoration: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    borderBottomLeftRadius: 20,
    opacity: 0.1,
  },
  completionContainer: {
    position: 'relative',
  },
  validatingOverlay: {
    position: 'absolute',
    top: 8,
    right: 24,
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 152, 0, 0.3)',
  },
  validatingText: {
    fontSize: 11,
    color: '#ff6f00',
    fontWeight: '500',
  },
});
