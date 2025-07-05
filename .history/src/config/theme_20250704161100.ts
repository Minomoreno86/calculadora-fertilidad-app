// src/config/theme.ts

const PALETTE = {
  primary: '#006B7D',       // Un azul verdoso profesional y calmado
  secondary: '#495D6E',     // Gris azulado para acentos
  white: '#FFFFFF',
  black: '#0A0A0A',
  lightGrey: '#F0F2F5',     // Fondo de la app
  mediumGrey: '#A0AAB8',    // Texto secundario, bordes
  danger: '#D94545',        // Para errores o alertas
};

export const theme = {
  colors: {
    primary: PALETTE.primary,
    secondary: PALETTE.secondary,
    background: PALETTE.lightGrey,
    card: PALETTE.white,
    text: PALETTE.black,
    subtleText: PALETTE.mediumGrey,
    buttonPrimary: PALETTE.primary,
    buttonText: PALETTE.white,
    error: PALETTE.danger,
    border: PALETTE.mediumGrey,
  },
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
  },
  typography: {
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: PALETTE.black,
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
      color: PALETTE.black,
    },
    caption: {
      fontSize: 12,
      color: PALETTE.mediumGrey,
    },
  },
};