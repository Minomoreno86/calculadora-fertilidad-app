import { TextStyle } from 'react-native';

const PALETTE = {
  primary: '#006B7D',       // Un azul verdoso profesional y calmado
  secondary: '#495D6E',     // Gris azulado para acentos
  white: '#FFFFFF',
  black: '#212121',         // Softer black for text
  lightGrey: '#F8F8F8',     // App background
  mediumGrey: '#B0B0B0',    // For borders, placeholders
  darkGrey: '#616161',      // For subtle text
  success: '#4CAF50',       // Green for positive feedback
  warning: '#FFC107',       // Amber for warnings
  danger: '#D32F2F',        // Red for errors
  info: '#2196F3',          // Blue for informational messages
};

export const theme = {
  colors: {
    primary: PALETTE.primary,
    secondary: PALETTE.secondary,
    background: PALETTE.lightGrey,
    card: PALETTE.white,
    text: PALETTE.black,
    subtleText: PALETTE.darkGrey,
    placeholder: PALETTE.mediumGrey,
    buttonPrimary: PALETTE.primary,
    buttonText: PALETTE.white,
    error: PALETTE.danger,
    border: PALETTE.mediumGrey,
    success: PALETTE.success,
    warning: PALETTE.warning,
    info: PALETTE.info,
    inputBackground: PALETTE.white,
  },
  spacing: {
    xxs: 4,
    xs: 8,
    s: 12,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: '700' as TextStyle['fontWeight'],
      lineHeight: 38,
      color: PALETTE.black,
    },
    h2: {
      fontSize: 24,
      fontWeight: '700' as TextStyle['fontWeight'],
      lineHeight: 30,
      color: PALETTE.black,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600' as TextStyle['fontWeight'],
      lineHeight: 26,
      color: PALETTE.black,
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as TextStyle['fontWeight'],
      lineHeight: 24,
      color: PALETTE.black,
    },
    bodyBold: {
      fontSize: 16,
      fontWeight: '600' as TextStyle['fontWeight'],
      lineHeight: 24,
      color: PALETTE.black,
    },
    caption: {
      fontSize: 12,
      fontWeight: '400' as TextStyle['fontWeight'],
      lineHeight: 18,
      color: PALETTE.darkGrey,
    },
    small: {
      fontSize: 14,
      fontWeight: '400' as TextStyle['fontWeight'],
      lineHeight: 20,
      color: PALETTE.darkGrey,
    },
    label: {
      fontSize: 14,
      fontWeight: '600' as TextStyle['fontWeight'],
      color: PALETTE.darkGrey,
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
  borderRadius: {
    s: 8,
    m: 12,
    l: 16,
  },
};