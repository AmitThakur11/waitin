import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EyeOff, RefreshCw, SlidersHorizontal } from 'lucide-react-native';
import { Card } from '../components/Card';
import { IconChip } from '../components/IconChip';
import { colors, spacing } from '../theme';

const POINTS = [
  { icon: EyeOff, title: 'Your number stays hidden', body: 'Scanners reach you without ever seeing your phone number.' },
  { icon: RefreshCw, title: 'Rotate a tag anytime', body: 'Replace a tag instantly if a sticker is copied or lost.' },
  { icon: SlidersHorizontal, title: 'You control each action', body: 'Decide per tag whether people can message or call you.' },
];

export function PrivacyScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <Text style={styles.title}>Privacy</Text>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {POINTS.map(p => (
          <Card key={p.title} style={styles.row}>
            <IconChip icon={p.icon} bg={colors.surfaceAlt} />
            <View style={styles.flex}>
              <Text style={styles.rowTitle}>{p.title}</Text>
              <Text style={styles.muted}>{p.body}</Text>
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  title: { fontSize: 24, fontWeight: '800', color: colors.text, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  content: { padding: spacing.md, gap: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1 },
  rowTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 2 },
  muted: { color: colors.textMuted, fontSize: 13, lineHeight: 18 },
});
