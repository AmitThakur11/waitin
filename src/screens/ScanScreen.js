import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { QrCode } from 'lucide-react-native';
import { colors, radius, spacing } from '../theme';

/**
 * Placeholder scanner. A real camera scanner (react-native-vision-camera +
 * code scanner) lands later; the core flow is strangers scanning via their
 * phone browser, so owner-side scanning is secondary.
 */
export function ScanScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.frame}>
        <QrCode size={72} color={colors.primary} strokeWidth={1.6} />
      </View>
      <Text style={styles.title}>Scan a Tag</Text>
      <Text style={styles.muted}>
        Point your camera at a ContactKaro QR to open it. Camera scanning is coming soon —
        for now, any phone camera opens the tag link directly.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', padding: spacing.lg, gap: spacing.md },
  frame: {
    width: 220,
    height: 220,
    borderRadius: radius.xl,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  title: { fontSize: 22, fontWeight: '800', color: colors.text },
  muted: { color: colors.textMuted, fontSize: 14, textAlign: 'center', lineHeight: 20 },
});
