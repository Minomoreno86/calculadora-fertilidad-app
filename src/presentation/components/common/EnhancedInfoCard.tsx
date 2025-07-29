// ===================================================================
// 🎨 TARJETAS INFORMATIVAS MEJORADAS
// ===================================================================

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Text from './Text';
import { useDynamicTheme } from '@/hooks/useDynamicTheme';

// Safe Animated import for React Native compatibility
let Animated: any;
try {
  const RN = require('react-native');
  Animated = RN.Animated;
} catch {
  // Fallback for environments without Animated
  Animated = {
    Value: class { constructor(v: number) { this.value = v; } value: number; setValue: (v: number) => void = () => {}; },
    timing: () => ({ start: () => {} }),
    parallel: () => ({ start: () => {} }),
    View: View
  };
}

interface Props {
  type: 'tip' | 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  onPress?: () => void;
  showIcon?: boolean;
  animation?: 'slide' | 'fade' | 'none';
}

const EnhancedInfoCard: React.FC<Props> = ({
  type,
  title,
  message,
  onPress,
  showIcon = true,
  animation = 'slide'
}) => {
  // 🎨 TEMA DINÁMICO
  const theme = useDynamicTheme();
  
  const [scaleAnimation] = React.useState(new Animated.Value(0.95));
  const [opacityAnimation] = React.useState(new Animated.Value(0));

  // 🎯 MÉTODOS DE ANIMACIÓN ESPECÍFICOS
  const executeSlideAnimation = React.useCallback(() => {
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

  const executeFadeAnimation = React.useCallback(() => {
    Animated.timing(opacityAnimation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [opacityAnimation]);

  const setStaticDisplay = React.useCallback(() => {
    scaleAnimation.setValue(1);
    opacityAnimation.setValue(1);
  }, [scaleAnimation, opacityAnimation]);

  React.useEffect(() => {
    switch (animation) {
      case 'slide':
        executeSlideAnimation();
        break;
      case 'fade':
        executeFadeAnimation();
        break;
      case 'none':
        setStaticDisplay();
        break;
      default:
        setStaticDisplay();
    }
  }, [animation, executeSlideAnimation, executeFadeAnimation, setStaticDisplay]);

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

  const getAnimatedStyle = () => {
    switch (animation) {
      case 'slide':
        return {
          transform: [{ scale: scaleAnimation }],
          opacity: opacityAnimation,
        };
      case 'fade':
        return {
          opacity: opacityAnimation,
        };
      case 'none':
      default:
        return {};
    }
  };

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
          getAnimatedStyle(),
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
    fontWeight: '600' as const,
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
