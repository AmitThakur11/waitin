/**
 * ContactKaro design tokens — light, Apple-inspired theme.
 */
export const colors = {
  bg: '#F1F5F3', // app background (soft mint-grey)
  bgElevated: '#FFFFFF',
  surface: '#FFFFFF', // cards
  surfaceAlt: '#E8F6EE', // subtle green tint (info cards, icon chips)
  primary: '#1FBF73', // emerald accent
  primaryDark: '#149A5B',
  primaryText: '#FFFFFF',
  text: '#10211A', // near-black headings (warm)
  textMuted: '#73837C', // secondary text
  textFaint: '#A4B1AB',
  border: '#E6ECE9',
  hairline: '#EEF2F0',
  danger: '#FF3B30', // iOS system red
  dangerSoft: '#FFE9E7',
  success: '#1FBF73',
  warning: '#FF9F0A',
  chipBlue: '#E2F6EC', // light-green accent chip (kept key for compat)
  chipOrange: '#FFF1E2',
  iconOrange: '#FF9500',
  // Dark floating tab bar
  tabBar: '#10211A',
  tabInactive: '#8FA39A',
};

// Brand gradient stops (used via react-native-svg).
export const gradients = {
  primary: ['#34D88C', '#1FBF73', '#149A5B'] as const,
  primaryFab: ['#3FDB90', '#1FBF73'] as const,
  hero: ['#34D88C', '#1FBF73', '#0E8A50'] as const,
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
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
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

// Light, subtle card shadow.
export const shadow = {
  shadowColor: '#1B2A4A',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.045,
  shadowRadius: 8,
  elevation: 2,
} as const;

// Even tighter shadow for small elements.
export const shadowSm = {
  shadowColor: '#1B2A4A',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.04,
  shadowRadius: 5,
  elevation: 1,
} as const;
