import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { ShieldCheck } from 'lucide-react-native';
import { PressableScale } from '../PressableScale';
import { GradientBackground } from '../GradientBackground';
import { NumberPlate } from './NumberPlate';
import { colors, spacing } from '../../theme';

// Glassmorphism = a translucent frosted surface with a soft diagonal sheen, a
// bright top-left highlight border, and a gentle drop shadow so it appears to
// float as a pane of glass over the background.
const GLASS_FILL = 'rgba(255,255,255,0.45)';
const GLASS_SHEEN_TOP = 'rgba(255,255,255,0.85)';
const GLASS_SHEEN_BOTTOM = 'rgba(255,255,255,0.10)';
const GLASS_BORDER = 'rgba(255,255,255,0.65)';

function carTitle(car) {
  return (
    car.nickname ||
    [car.color, car.make, car.model].filter(Boolean).join(' ') ||
    car.displayLabel ||
    'Tag'
  );
}

/** Featured tag card — frosted glassmorphism pane at the top of Home. */
export function TagCard({ tag, onPress }) {
  const makeModel = [tag.make, tag.model].filter(Boolean).join(' ');

  return (
    <PressableScale style={styles.card} onPress={onPress}>
      <GradientBackground
        id="tagGlassSheen"
        colors={[GLASS_SHEEN_TOP, GLASS_SHEEN_BOTTOM]}
        radius={22}
      />

      <View style={styles.content}>
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
            {tag.plate ? <NumberPlate number={tag.plate} scale={0.95} /> : null}
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
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: GLASS_BORDER,
    backgroundColor: GLASS_FILL,
  },
  content: { padding: spacing.lg, gap: spacing.md },
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
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  activeDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.primary },
  activeText: { color: colors.primaryDark, fontSize: 11, fontWeight: '800' },
  carImage: { width: '100%', height: 140, alignSelf: 'center' },

  bottomRow: { flexDirection: 'row', alignItems: 'center' },
  plateCol: { flex: 6, alignItems: 'stretch', justifyContent: 'center' },
  divider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    backgroundColor: 'rgba(17,17,17,0.12)',
    marginHorizontal: spacing.md,
  },
  infoCol: { flex: 4, alignItems: 'flex-end' },
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
