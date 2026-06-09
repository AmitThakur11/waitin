import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Line, Rect } from 'react-native-svg';
import { Car, ShieldCheck } from 'lucide-react-native';
import { colors, radius, spacing, shadow } from '../theme';

/**
 * Stylised parking-lot hero — a soft card with a faint slot grid, a few muted
 * parked cars, and the owner's car highlighted in a floating green slot. Echoes
 * the reference's 3D lot illustration without needing an image asset.
 */
export function ParkingHero({ label }) {
  return (
    <View style={styles.card}>
      {/* faint parking grid */}
      <Svg style={StyleSheet.absoluteFill} viewBox="0 0 100 60" preserveAspectRatio="none">
        {[20, 40, 60, 80].map(x => (
          <Line key={`v${x}`} x1={x} y1={6} x2={x} y2={54} stroke="#D5E2DB" strokeWidth={0.5} />
        ))}
        {[20, 40].map(y => (
          <Line key={`h${y}`} x1={6} y1={y} x2={94} y2={y} stroke="#D5E2DB" strokeWidth={0.5} />
        ))}
        <Rect x={6} y={6} width={88} height={48} rx={4} stroke="#D5E2DB" strokeWidth={0.6} fill="none" />
      </Svg>

      {/* muted parked cars */}
      <Car size={26} color="#C2D0C8" style={[styles.parked, { top: 26, left: 30 }]} />
      <Car size={26} color="#C2D0C8" style={[styles.parked, { top: 28, right: 36 }]} />
      <Car size={22} color="#CDD9D2" style={[styles.parked, { bottom: 22, left: 48 }]} />

      {/* highlighted owner car */}
      <View style={styles.slot}>
        <Car size={34} color={colors.primary} strokeWidth={2.2} />
      </View>

      {/* protected badge */}
      <View style={styles.badge}>
        <ShieldCheck size={14} color={colors.primary} strokeWidth={2.4} />
        <Text style={styles.badgeText}>{label ?? 'Protected'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 180,
    backgroundColor: '#EAF1ED',
    borderRadius: radius.xl,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  parked: { position: 'absolute' },
  slot: {
    width: 74,
    height: 74,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow,
  },
  badge: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    ...shadow,
  },
  badgeText: { fontSize: 12, fontWeight: '700', color: colors.text },
});
