/**
 * ContactKaro design tokens — light, Apple-inspired theme.
 */
export const colors = {
  bg: '#F5F5F5', // app background (neutral grey)
  bgElevated: '#FFFFFF',
  surface: '#FFFFFF', // cards
  surfaceAlt: '#F0F0F0', // subtle neutral tint (info cards, icon chips)
  primary: '#000000', // black accent
  primaryDark: '#000000',
  primaryText: '#FFFFFF',
  text: '#111111', // near-black headings
  textMuted: '#737373', // secondary text
  textFaint: '#A6A6A6',
  border: '#E6E6E6',
  hairline: '#EEEEEE',
  danger: '#FF3B30', // iOS system red
  dangerSoft: '#FFE9E7',
  success: '#000000',
  warning: '#FF9F0A',
  chipBlue: '#F0F0F0', // light neutral accent chip (kept key for compat)
  chipOrange: '#FFF1E2',
  iconOrange: '#FF9500',
  // Dark floating tab bar
  tabBar: '#111111',
  tabInactive: '#9A9A9A',
};

// Brand gradient stops (used via react-native-svg).
export const gradients = {
  primary: ['#3A3A3A', '#1A1A1A', '#000000'],
  primaryFab: ['#3A3A3A', '#000000'],
  hero: ['#3A3A3A', '#1A1A1A', '#000000'],
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
  largeTitle: { fontSize: 32, fontWeight: '800', letterSpacing: -0.6 },
  title: { fontSize: 22, fontWeight: '800', letterSpacing: -0.4 },
  section: { fontSize: 18, fontWeight: '700', letterSpacing: -0.3 },
  body: { fontSize: 15, fontWeight: '600', letterSpacing: -0.2 },
  caption: { fontSize: 13, fontWeight: '500', letterSpacing: -0.1 },
};

// Light, subtle card shadow.
export const shadow = {
  shadowColor: '#1B2A4A',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.045,
  shadowRadius: 8,
  elevation: 2,
};

// Even tighter shadow for small elements.
export const shadowSm = {
  shadowColor: '#1B2A4A',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.04,
  shadowRadius: 5,
  elevation: 1,
};
