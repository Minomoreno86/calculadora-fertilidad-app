// ===================================================================
// 🎨 TARJETAS INFORMATIVAS MEJORADAS
// ===================================================================

import React from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Text from './Text';
import { useDynamicTheme } from '@/hooks/useDynamicTheme';

interface Props {
  type: 'tip' | 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  onPress?: () => void;
  showIcon?: boolean;
  animated?: boolean;
}

const EnhancedInfoCard: React.FC<Props> = ({
  type,
  title,
  message,
  onPress,
  showIcon = true,
  animated = true
}) => {
  // 🎨 TEMA DINÁMICO
  const theme = useDynamicTheme();
  
  const [scaleAnimation] = React.useState(new Animated.Value(0.95));
  const [opacityAnimation] = React.useState(new Animated.Value(0));

  // 🎯 ANIMACIONES CONTROLADAS
  const initializeAnimations = React.useCallback(() => {
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
  }, [scaleAnimation, opacityAnimation]);

  const resetAnimations = React.useCallback(() => {
    scaleAnimation.setValue(1);
    opacityAnimation.setValue(1);
  }, [scaleAnimation, opacityAnimation]);

  React.useEffect(() => {
    if (animated) {
      initializeAnimations();
    } else {
      resetAnimations();
    }
  }, [animated, initializeAnimations, resetAnimations]);

  // 🎨 CONFIGURACIÓN DE TIPOS
  const getCardConfig = () => {
    switch (type) {
      case 'tip':
        return {
          backgroundColor: theme.colors.info + '10',
          borderColor: theme.colors.info,
          iconColor: theme.colors.info,
        };
      case 'info':
        return {
          backgroundColor: theme.colors.primary + '10',
          borderColor: theme.colors.primary,
          iconColor: theme.colors.primary,
        };
      case 'success':
        return {
          backgroundColor: theme.colors.success + '10',
          borderColor: theme.colors.success,
          iconColor: theme.colors.success,
        };
      case 'warning':
        return {
          backgroundColor: theme.colors.warning + '10',
          borderColor: theme.colors.warning,
          iconColor: theme.colors.warning,
        };
      case 'error':
        return {
          backgroundColor: theme.colors.error + '10',
          borderColor: theme.colors.error,
          iconColor: theme.colors.error,
        };
      default:
        return {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          iconColor: theme.colors.text,
        };
    }
  };

  // 🎨 ICONOS POR TIPO
  const getTypeIcon = () => {
    const iconMap = {
      tip: '💡',
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌'
    };
    return iconMap[type] || 'ℹ️';
  };

  const config = getCardConfig();

  const animatedStyle = animated ? {
    transform: [{ scale: scaleAnimation }],
    opacity: opacityAnimation,
  } : {};

  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <CardComponent
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
      disabled={!onPress}
    >
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor: config.backgroundColor,
            borderColor: config.borderColor,
          },
          animatedStyle,
        ]}
      >
        {showIcon && (
          <View style={styles.iconContainer}>
            <Text 
              style={[styles.icon, { color: config.iconColor }]}
            >
              {getTypeIcon()}
            </Text>
          </View>
        )}
        
        <View style={styles.content}>
          {title && (
            <Text style={[styles.title, { color: theme.colors.text }]}>
              {title}
            </Text>
          )}
          <Text style={[styles.message, { color: theme.colors.textSecondary }]}>
            {message}
          </Text>
        </View>
      </Animated.View>
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  icon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 22,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
  },
});

// Solo exportación por defecto
export default EnhancedInfoCard;
