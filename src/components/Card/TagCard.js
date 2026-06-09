import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { ShieldCheck } from 'lucide-react-native';
import { PressableScale } from '../PressableScale';
import { NumberPlate } from './NumberPlate';
import { colors, spacing } from '../../theme';

// Neumorphism = the surface and its container share one background, and the
// shape is defined only by a soft light highlight (top-left) and a soft dark
// shadow (bottom-right). Keep NEU_BG identical to the screen background so the
// card looks gently extruded from it rather than floating on a drop shadow.
const NEU_BG = '#F7F7F7';
const NEU_LIGHT = '#FFFFFF';
const NEU_DARK = '#DDE1E6';

function carTitle(car) {
  return (
    car.nickname ||
    [car.color, car.make, car.model].filter(Boolean).join(' ') ||
    car.displayLabel ||
    'Tag'
  );
}

/** Featured tag card — neumorphic (soft UI) highlight at the top of Home. */
export function TagCard({ tag, onPress }) {
  const makeModel = [tag.make, tag.model].filter(Boolean).join(' ');

  return (
    <PressableScale style={styles.card} onPress={onPress}>
      <View style={styles.topRow}>
        <View style={styles.protected}>
          <ShieldCheck size={14} color={colors.primary} strokeWidth={2.4} />
          <Text style={styles.protectedText}>Protected · tap for QR</Text>
        </View>
        <View style={styles.activePill}>
          <View style={styles.activeDot} />
          <Text style={styles.activeText}>Active</Text>
        </View>
      </View>

      <Image
        source={require('../../../assets/images/red_car.png')}
        style={styles.carImage}
        resizeMode="contain"
      />

      <View style={styles.bottomRow}>
        <View style={styles.plateCol}>
          {tag.plate ? <NumberPlate number={tag.plate} scale={0.7} /> : null}
        </View>

        <View style={styles.divider} />

        <View style={styles.infoCol}>
          <Text style={styles.infoLabel}>Vehicle</Text>
          <Text style={styles.infoTitle} numberOfLines={1}>
            {carTitle(tag)}
          </Text>
          {makeModel ? (
            <Text style={styles.infoSub} numberOfLines={1}>
              {makeModel}
            </Text>
          ) : null}
        </View>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: NEU_BG,
    borderRadius: 28,
    padding: spacing.lg,
    gap:4,
    boxShadow: `9px 9px 18px ${NEU_DARK}, -9px -9px 18px ${NEU_LIGHT}`,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  protected: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  protectedText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: -0.2,
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: NEU_BG,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    boxShadow: `inset 2px 2px 4px ${NEU_DARK}, inset -2px -2px 4px ${NEU_LIGHT}`,
  },
  activeDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.primary },
  activeText: { color: colors.primaryDark, fontSize: 11, fontWeight: '800' },
  carImage: { width: '100%', height: 140, alignSelf: 'center' },

  bottomRow: { flexDirection: 'row', alignItems: 'center' },
  plateCol: { flex: 4, alignItems: 'flex-start' },
  divider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
  infoCol: { flex: 6, alignItems: 'flex-end' },
  infoLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textFaint,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  infoTitle: { fontSize: 16, fontWeight: '800', color: colors.text, letterSpacing: -0.3 },
  infoSub: { fontSize: 13, fontWeight: '600', color: colors.textMuted, marginTop: 1 },
});
