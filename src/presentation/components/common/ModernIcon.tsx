// ===================================================================
// 🎯 SISTEMA DE ICONOS MODERNOS CON EMOJIS
// ===================================================================

import React from 'react';
import { TextStyle } from 'react-native';
import Text from './Text';

// 🎨 Mapa de iconos modernos usando emojis nativos
const MODERN_EMOJI_MAP: { [key: string]: string } = {
  // 🧭 Navegación y UI
  'chevronRight': '▶️',
  'chevronDown': '🔽',
  'chevronLeft': '◀️',
  'chevronUp': '🔼',
  'close': '✖️',
  'check': '✅',
  'warning': '⚠️',
  'error': '❌',
  'info': '💡',
  'success': '✅',
  'loading': '⏳',
  'search': '🔍',
  'menu': '☰',
  'settings': '⚙️',
  'edit': '✏️',
  'delete': '🗑️',
  'add': '➕',
  'remove': '➖',
  'save': '💾',
  'refresh': '🔄',
  'sync': '🔄',
  'download': '⬇️',
  'upload': '⬆️',
  'share': '📤',
  'heart': '❤️',
  'star': '⭐',
  'bookmark': '🔖',
  'flag': '🚩',
  'bell': '🔔',
  'mail': '📧',
  'phone': '📞',
  'calendar': '📅',
  'clock': '🕐',
  'home': '🏠',
  'user': '👤',
  'users': '👥',
  'lock': '🔒',
  'unlock': '🔓',
  'key': '🗝️',
  'eye': '👁️',
  'eyeOff': '🙈',
  'camera': '📷',
  'image': '🖼️',
  'file': '📄',
  'folder': '📁',
  'link': '🔗',
  'external': '🔗',
  'lightning': '⚡',
  'flame': '🔥',
  'gem': '💎',
  'crown': '👑',
  'trophy': '🏆',
  'medal': '🏅',
  'gift': '🎁',
  'celebration': '🎉',
  
  // 🔄 Navegación específica
  'next': '▶️',
  'previous': '◀️',
  'up': '🔼',
  'down': '🔽',
  'action': '⚡',
  'critical': '🚨',
  
  // 🏥 Médicos y salud
  'medical': '🏥',
  'stethoscope': '🩺',
  'pill': '💊',
  'syringe': '💉',
  'thermometer': '🌡️',
  'heartbeat': '💓',
  'dna': '🧬',
  'microscope': '🔬',
  'test': '🧪',
  'chart': '📊',
  'graph': '📈',
  'analytics': '📊',
  'report': '📋',
  'clipboard': '📋',
  'document': '📄',
  'notepad': '📝',
  'calculator': '🧮',
  'scale': '⚖️',
  'ruler': '📏',
  'target': '🎯',
  'bullseye': '🎯',
  'crosshair': '🎯',
  'radar': '📡',
  'satellite': '🛰️',
  'rocket': '🚀',
  'airplane': '✈️',
  'train': '🚂',
  'car': '🚗',
  'bike': '🚲',
  'walk': '🚶',
  'run': '🏃',
  'fire': '🔥',
  'water': '💧',
  'leaf': '🍃',
  'flower': '🌸',
  'sun': '☀️',
  'moon': '🌙',
  'star2': '⭐',
  'sparkles': '✨',
  'magic': '✨',
  'rainbow': '🌈',
  'cloud': '☁️',
  'storm': '⛈️',
  'snow': '❄️',
  'wind': '💨'
};

// 🎯 Props del componente
interface ModernIconProps {
  name: string;
  size?: number;
  color?: string;
  style?: TextStyle;
}

// 🎨 Función para obtener emoji moderno - EXPORT NOMBRADO REQUERIDO
export const getModernEmoji = (name: string): string => {
  return MODERN_EMOJI_MAP[name] || MODERN_EMOJI_MAP['info'] || '💡';
};

// 🎯 Componente ModernIcon - EXPORT NOMBRADO REQUERIDO
export const ModernIcon: React.FC<ModernIconProps> = ({ 
  name, 
  size = 16, 
  color = '#000000',
  style = {}
}) => {
  const emoji = getModernEmoji(name);
  
  return (
    <Text 
      style={[
        {
          fontSize: size,
          color: color,
          textAlign: 'center' as const,
          lineHeight: size + 2,
        },
        style
      ]}
    >
      {emoji}
    </Text>
  );
};

// 🎯 Export por defecto también para compatibilidad
export default ModernIcon;
