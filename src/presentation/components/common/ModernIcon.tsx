// ===================================================================
// 🎨 SISTEMA DE ICONOS MODERNOS
// ===================================================================

import React from 'react';
import { View, StyleSheet } from 'react-native';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: any;
}

export const ModernIcon: React.FC<IconProps> = ({ 
  name, 
  size = 20, 
  color = '#333', 
  style 
}) => {
  const getIconPath = (iconName: string) => {
    switch (iconName) {
      case 'document-text':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <path 
              d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" 
              stroke={color} 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              fill="none"
            />
            <polyline points="14,2 14,8 20,8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="16" y1="13" x2="8" y2="13" stroke={color} strokeWidth="2" strokeLinecap="round"/>
            <line x1="16" y1="17" x2="8" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round"/>
            <polyline points="10,9 9,9 8,9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      
      case 'star':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <polygon 
              points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" 
              stroke={color} 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              fill={color.includes('#') ? color + '20' : 'rgba(255,215,0,0.2)'}
            />
          </svg>
        );
      
      case 'lightning':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <polygon 
              points="13,2 3,14 12,14 11,22 21,10 12,10" 
              stroke={color} 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              fill={color + '20'}
            />
          </svg>
        );
      
      case 'check-circle':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <path 
              d="M22 11.08V12a10 10 0 1 1-5.93-9.14" 
              stroke={color} 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <polyline 
              points="22,4 12,14.01 9,11.01" 
              stroke={color} 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        );
      
      case 'trending-up':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <polyline 
              points="23,6 13.5,15.5 8.5,10.5 1,18" 
              stroke={color} 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <polyline 
              points="17,6 23,6 23,12" 
              stroke={color} 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        );
      
      case 'zap':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <polygon 
              points="13,2 3,14 12,14 11,22 21,10 12,10" 
              stroke={color} 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        );
      
      case 'target':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none"/>
            <circle cx="12" cy="12" r="6" stroke={color} strokeWidth="2" fill="none"/>
            <circle cx="12" cy="12" r="2" stroke={color} strokeWidth="2" fill={color}/>
          </svg>
        );
      
      case 'bar-chart':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <line x1="12" y1="20" x2="12" y2="10" stroke={color} strokeWidth="2" strokeLinecap="round"/>
            <line x1="18" y1="20" x2="18" y2="4" stroke={color} strokeWidth="2" strokeLinecap="round"/>
            <line x1="6" y1="20" x2="6" y2="16" stroke={color} strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      
      case 'activity':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <polyline 
              points="22,12 18,12 15,21 9,3 6,12 2,12" 
              stroke={color} 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        );
      
      case 'shield-check':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <path 
              d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" 
              stroke={color} 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              fill="none"
            />
            <polyline 
              points="9,12 11,14 15,10" 
              stroke={color} 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        );
      
      case 'refresh':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <polyline 
              points="23,4 23,10 17,10" 
              stroke={color} 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <polyline 
              points="1,20 1,14 7,14" 
              stroke={color} 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" 
              stroke={color} 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        );
      
      default:
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none"/>
            <line x1="15" y1="9" x2="9" y2="15" stroke={color} strokeWidth="2"/>
            <line x1="9" y1="9" x2="15" y2="15" stroke={color} strokeWidth="2"/>
          </svg>
        );
    }
  };

  return (
    <View style={[styles.iconContainer, style]}>
      {getIconPath(name)}
    </View>
  );
};

// 🎯 Iconos emoji modernos como fallback
export const getModernEmoji = (iconName: string): string => {
  switch (iconName) {
    case 'document-text-outline':
    case 'document-text':
      return '📋'; // Más moderno que 📄
    
    case 'star-outline':
    case 'star':
      return '⭐'; // Clásico pero efectivo
    
    case 'lightning':
    case 'zap':
      return '⚡'; // Perfecto para validación paralela
    
    case 'check-circle':
      return '✅'; // Universal y claro
    
    case 'trending-up':
    case 'bar-chart':
      return '📈'; // Para progreso y métricas
    
    case 'target':
      return '🎯'; // Para precisión y objetivos
    
    case 'activity':
      return '📊'; // Para métricas y actividad
    
    case 'shield-check':
      return '🛡️'; // Para seguridad y validación
    
    case 'refresh':
    case 'loading':
      return '🔄'; // Para procesos en curso
    
    case 'tip':
    case 'lightbulb':
      return '💡'; // Para consejos e ideas
    
    case 'success':
      return '🎉'; // Para celebrar logros
    
    case 'warning':
      return '⚠️'; // Para advertencias
    
    case 'error':
      return '🚨'; // Para errores importantes
    
    case 'info':
      return 'ℹ️'; // Para información
    
    case 'rocket':
      return '🚀'; // Para lanzamiento y velocidad
    
    case 'magic':
      return '✨'; // Para características especiales
    
    case 'trophy':
      return '🏆'; // Para logros y completación
    
    case 'gem':
      return '💎'; // Para características premium
    
    case 'fire':
      return '🔥'; // Para elementos destacados
    
    case 'sparkles':
      return '✨'; // Para efectos especiales
    
    case 'crown':
      return '👑'; // Para elementos premium
    
    case 'medal':
      return '🏅'; // Para reconocimientos
    
    case 'brain':
      return '🧠'; // Para inteligencia artificial
    
    case 'dna':
      return '🧬'; // Para análisis genético/fertilidad
    
    case 'microscope':
      return '🔬'; // Para análisis de laboratorio
    
    case 'test-tube':
      return '🧪'; // Para pruebas médicas
    
    case 'health':
      return '💚'; // Para salud y bienestar
    
    case 'chart':
      return '📊'; // Para análisis y gráficos
    
    case 'calculator':
      return '🧮'; // Para cálculos
    
    case 'atom':
      return '⚛️'; // Para ciencia y tecnología
    
    case 'gear':
      return '⚙️'; // Para configuración
    
    case 'lock':
      return '🔒'; // Para seguridad
    
    case 'key':
      return '🔑'; // Para acceso
    
    case 'download':
      return '⬇️'; // Para descargas
    
    case 'upload':
      return '⬆️'; // Para subidas
    
    case 'share':
      return '📤'; // Para compartir
    
    default:
      return '●'; // Punto simple y moderno
  }
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
