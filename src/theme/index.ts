/**
 * ContactKaro design tokens — light, Apple-inspired theme.
 */
export const colors = {
  bg: '#F2F4F8', // app background (soft cool grey)
  bgElevated: '#FFFFFF',
  surface: '#FFFFFF', // cards
  surfaceAlt: '#EEF3FF', // subtle blue tint (info cards, icon chips)
  primary: '#2F6BFF', // brand blue
  primaryDark: '#1D4ED8',
  primaryText: '#FFFFFF',
  text: '#0B1220', // near-black headings
  textMuted: '#7A869A', // secondary text
  textFaint: '#A6B0C0',
  border: '#E7ECF3',
  hairline: '#EEF1F6',
  danger: '#FF3B30', // iOS system red
  dangerSoft: '#FFE9E7',
  success: '#34C759', // iOS system green
  warning: '#FF9F0A',
  chipBlue: '#E5EEFF',
  chipOrange: '#FFF1E2',
  iconOrange: '#FF9500',
};

// Brand gradient stops (used via react-native-svg).
export const gradients = {
  primary: ['#3D7BFF', '#2F6BFF', '#1F57E6'] as const,
  primaryFab: ['#4E89FF', '#2F6BFF'] as const,
  hero: ['#4C84FF', '#2F6BFF', '#1A40BE'] as const,
};

// Translucent whites for glassmorphism over the gradient hero.
export const glass = {
  fill: 'rgba(255,255,255,0.16)',
  fillStrong: 'rgba(255,255,255,0.24)',
  border: 'rgba(255,255,255,0.28)',
  text: 'rgba(255,255,255,0.92)',
  textDim: 'rgba(255,255,255,0.66)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 44,
};

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  pill: 999,
};

// Type ramp with Apple-ish tightening on large sizes.
export const type = {
  largeTitle: { fontSize: 32, fontWeight: '800' as const, letterSpacing: -0.6 },
  title: { fontSize: 22, fontWeight: '800' as const, letterSpacing: -0.4 },
  section: { fontSize: 18, fontWeight: '700' as const, letterSpacing: -0.3 },
  body: { fontSize: 15, fontWeight: '600' as const, letterSpacing: -0.2 },
  caption: { fontSize: 13, fontWeight: '500' as const, letterSpacing: -0.1 },
};

// Soft, layered card shadow.
export const shadow = {
  shadowColor: '#1B2A4A',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.08,
  shadowRadius: 18,
  elevation: 4,
} as const;

// Tighter shadow for small/raised elements.
export const shadowSm = {
  shadowColor: '#1B2A4A',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.07,
  shadowRadius: 8,
  elevation: 3,
} as const;
