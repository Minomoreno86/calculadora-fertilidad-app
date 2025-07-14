import { TextStyle } from 'react-native';

const PALETTE = {
  // 🌸 PALETA FERTILIDAD REFINADA Y PROFESIONAL - MODO CLARO
  light: {
    primary: '#D96B84',      // Rosa coral profundo – confiable, cálido, profesional
    secondary: '#F2C9D1',    // Rosa lavanda/nude – complementario, elegante
    background: '#FFF7F9',   // Blanco rosado suave
    surface: '#FFFFFF',      // Tarjetas, formularios blancos puros
    textPrimary: '#2E2E2E',  // Negro suave para máxima legibilidad
    textSecondary: '#7A7A7A', // Subtítulos, notas en gris medio
    error: '#C62828',        // Alerta clara y profesional
    success: '#388E3C',      // Verde para resultados positivos
    warning: '#F57C00',      // Naranja para advertencias
    info: '#1976D2',         // Azul para información
    neutralGray: '#E0E0E0',  // Líneas, bordes, elementos desactivados
  },
  
  // 🌙 PALETA FERTILIDAD REFINADA Y PROFESIONAL - MODO OSCURO
  dark: {
    primary: '#F48FB1',      // Rosa coral claro para contraste nocturno
    secondary: '#CE93D8',    // Rosa lavanda más intenso para oscuro
    background: '#121212',   // Negro puro
    surface: '#1E1E1E',     // Superficies elevadas oscuras
    textPrimary: '#FAFAFA',  // Blanco suave
    textSecondary: '#BDBDBD', // Gris claro para texto secundario
    error: '#EF9A9A',       // Error suave en modo oscuro
    success: '#81C784',     // Verde claro para éxito
    warning: '#FFB74D',     // Naranja claro para advertencias
    info: '#64B5F6',        // Azul claro para información
    neutralGray: '#3A3A3A', // Gris oscuro para elementos neutros
  },
  
  // 🌫️ COLORES NEUTROS UNIVERSALES
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export const theme = {
  colors: {
    // 🌸 COLORES PRINCIPALES (MODO CLARO POR DEFECTO)
    primary: PALETTE.light.primary,
    secondary: PALETTE.light.secondary,
    background: PALETTE.light.background,
    surface: PALETTE.light.surface,
    
    // 📝 TEXTOS
    text: PALETTE.light.textPrimary,
    textSecondary: PALETTE.light.textSecondary,
    textTertiary: '#9E9E9E',
    placeholder: '#BDBDBD',
    
    // 🎯 ESTADOS DE FERTILIDAD
    error: PALETTE.light.error,
    success: PALETTE.light.success,
    warning: PALETTE.light.warning,
    info: PALETTE.light.info,
    
    // 🔲 BORDES Y LÍNEAS REFINADAS
    border: PALETTE.light.neutralGray,
    borderLight: '#F5F5F5',
    divider: PALETTE.light.neutralGray,
    
    // 🔘 BOTONES FERTILIDAD
    buttonPrimary: PALETTE.light.primary,
    buttonSecondary: PALETTE.light.surface,
    buttonText: PALETTE.white,
    buttonTextSecondary: PALETTE.light.textPrimary,
    
    // 📱 INPUTS DE FERTILIDAD
    inputBackground: PALETTE.light.surface,
    inputBorder: PALETTE.light.neutralGray,
    inputFocus: PALETTE.light.primary,
    inputError: PALETTE.light.error,
    
    // 🌸 COLORES ESPECÍFICOS DE FERTILIDAD
    fertility: {
      high: PALETTE.light.success,      // Fertilidad alta
      medium: PALETTE.light.warning,    // Fertilidad media  
      low: PALETTE.light.error,         // Fertilidad baja
      optimal: '#4CAF50',               // Rango óptimo
      coral: PALETTE.light.primary,     // Rosa coral principal
      nude: PALETTE.light.secondary,    // Rosa nude/lavanda
    },
    
    // 🌈 ACCESO A PALETAS COMPLETAS
    lightMode: PALETTE.light,
    darkMode: PALETTE.dark,
    white: PALETTE.white,
    black: PALETTE.black,
  },
  
  spacing: {
    // 🌸 ESPACIADO FERTILIDAD PROFESIONAL (8pt grid)
    xxxs: 2,
    xxs: 4,
    xs: 8,
    s: 12,
    m: 16,  // Base fertilidad estándar
    l: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
    
    // 🌸 ESPACIADO ESPECÍFICO DE FERTILIDAD
    component: 16, // Entre componentes de fertilidad
    section: 24,   // Entre secciones de formulario
    screen: 20,    // Padding de pantalla profesional
    card: 20,      // Padding interno de cards
    input: 16,     // Padding de inputs de datos
    button: 12,    // Padding de botones (más compacto)
    
    // 📱 ESPACIOS DE INTERACCIÓN REFINADA
    field: 16,     // Entre campos relacionados
    group: 24,     // Entre grupos de campos
    modal: 24,     // Padding de modales/alertas
    touchable: 44, // Área táctil recomendada
  },
  
  typography: {
    // 🌸 TIPOGRAFÍA FERTILIDAD PROFESIONAL (Lato)
    h1: {
      fontSize: 30,
      fontWeight: '700' as TextStyle['fontWeight'], // Bold para títulos principales
      lineHeight: 36,
      letterSpacing: -0.5,
      color: PALETTE.light.primary, // Rosa coral profundo
    },
    h2: {
      fontSize: 24,
      fontWeight: '600' as TextStyle['fontWeight'], // Semi-bold para subtítulos/secciones
      lineHeight: 30,
      letterSpacing: -0.3,
      color: PALETTE.light.textPrimary,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600' as TextStyle['fontWeight'],
      lineHeight: 26,
      letterSpacing: -0.2,
      color: PALETTE.light.textPrimary,
    },
    h4: {
      fontSize: 18,
      fontWeight: '500' as TextStyle['fontWeight'],
      lineHeight: 24,
      color: PALETTE.light.textPrimary,
    },
    
    // 📝 TEXTO DE CUERPO (Especificación Lato)
    body: {
      fontSize: 16,
      fontWeight: '400' as TextStyle['fontWeight'], // Texto general/Formularios
      lineHeight: 24,
      color: PALETTE.light.textPrimary,
    },
    bodyLarge: {
      fontSize: 18,
      fontWeight: '400' as TextStyle['fontWeight'],
      lineHeight: 28,
      color: PALETTE.light.textPrimary,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: '400' as TextStyle['fontWeight'],
      lineHeight: 20,
      color: PALETTE.light.textSecondary,
    },
    
    // 🌸 TEXTOS ESPECÍFICOS DE FERTILIDAD
    caption: {
      fontSize: 14,
      fontWeight: '400' as TextStyle['fontWeight'], // Notas/advertencias según especificación
      lineHeight: 20,
      color: PALETTE.light.textSecondary,
    },
    note: {
      fontSize: 14,
      fontWeight: '400' as TextStyle['fontWeight'],
      fontStyle: 'italic' as TextStyle['fontStyle'], // Notas clínicas de fertilidad
      lineHeight: 20,
      color: PALETTE.light.textSecondary,
    },
    warning: {
      fontSize: 14,
      fontWeight: '600' as TextStyle['fontWeight'], // Bold para advertencias
      color: PALETTE.light.error,
      lineHeight: 20,
    },
    
    // 🏷️ ETIQUETAS REFINADAS
    label: {
      fontSize: 14,
      fontWeight: '500' as TextStyle['fontWeight'],
      color: PALETTE.light.textSecondary,
      textTransform: 'none' as TextStyle['textTransform'],
      letterSpacing: 0.1,
    },
    
    // 🔘 BOTONES REFINADOS
    button: {
      fontSize: 16,
      fontWeight: '600' as TextStyle['fontWeight'],
      lineHeight: 20,
      textTransform: 'none' as TextStyle['textTransform'],
    },
    buttonSmall: {
      fontSize: 14,
      fontWeight: '600' as TextStyle['fontWeight'],
      lineHeight: 18,
    },
    
    // 🔢 MÉTRICAS DE FERTILIDAD
    metric: {
      fontSize: 28,
      fontWeight: '700' as TextStyle['fontWeight'],
      lineHeight: 32,
      color: PALETTE.light.primary, // Rosa coral para métricas importantes
    },
    number: {
      fontSize: 20,
      fontWeight: '600' as TextStyle['fontWeight'],
      lineHeight: 24,
      color: PALETTE.light.primary, // Rosa coral para números
    },
  },
  
  card: {
    borderRadius: 12,
    backgroundColor: PALETTE.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  
  // 🌸 SISTEMA DE COMPONENTES FERTILIDAD PROFESIONAL
  components: {
    // 🌸 CARDS DE FERTILIDAD
    card: {
      default: {
        borderRadius: 12, // Profesional y elegante
        backgroundColor: PALETTE.light.surface,
        shadowColor: PALETTE.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08, // Sombra sutil y profesional
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F0F0F0', // Gris muy claro
      },
      elevated: {
        borderRadius: 16,
        backgroundColor: PALETTE.white,
        shadowColor: PALETTE.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 6,
        borderWidth: 0,
      },
      flat: {
        borderRadius: 8,
        backgroundColor: PALETTE.light.background,
        borderWidth: 1,
        borderColor: '#F5F5F5',
      },
    },
    
    // 🔘 BOTONES DE FERTILIDAD
    button: {
      primary: {
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 20,
        backgroundColor: PALETTE.light.primary, // Rosa coral
        shadowColor: PALETTE.light.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 2,
      },
      secondary: {
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 20,
        backgroundColor: PALETTE.light.surface,
        borderWidth: 1,
        borderColor: PALETTE.light.secondary, // Rosa lavanda
      },
      accent: {
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 20,
        backgroundColor: PALETTE.light.secondary, // Rosa nude
        shadowColor: PALETTE.light.secondary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 2,
      },
    },
    
    // 📝 INPUTS DE FERTILIDAD
    input: {
      default: {
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: PALETTE.white,
        borderWidth: 1,
        borderColor: PALETTE.light.neutralGray,
        fontSize: 16,
      },
      focus: {
        borderColor: PALETTE.light.primary,
        shadowColor: PALETTE.light.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 1,
      },
      error: {
        borderColor: PALETTE.light.error,
        backgroundColor: '#FEF2F2',
      },
    },
    
    // 🏷️ BADGES DE FERTILIDAD
    badge: {
      success: {
        backgroundColor: '#F0FDF4', // Verde muy claro
        borderRadius: 6,
        paddingVertical: 4,
        paddingHorizontal: 8,
      },
      warning: {
        backgroundColor: '#FFFBEB', // Amarillo muy claro
        borderRadius: 6,
        paddingVertical: 4,
        paddingHorizontal: 8,
      },
      danger: {
        backgroundColor: '#FEF2F2', // Rojo muy claro
        borderRadius: 6,
        paddingVertical: 4,
        paddingHorizontal: 8,
      },
      info: {
        backgroundColor: '#F0F9FF', // Azul muy claro
        borderRadius: 6,
        paddingVertical: 4,
        paddingHorizontal: 8,
      },
    },
  },
  
  // 📐 BORDES REFINADOS
  borderRadius: {
    xs: 4,
    s: 8,
    m: 12,
    l: 16,
    xl: 20,
    xxl: 24,
    pill: 999, // Para botones redondeados
  },
  
  // 🌫️ SOMBRAS ELEGANTES
  shadows: {
    none: {},
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 20,
      elevation: 8,
    },
    colored: (color: string) => ({
      shadowColor: color,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    }),
  },
  
  // ⚡ ANIMACIONES SUAVES
  animations: {
    duration: {
      fast: 150,
      normal: 250,
      slow: 400,
    },
    easing: {
      easeInOut: 'ease-in-out',
      easeOut: 'ease-out',
      spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },
};
