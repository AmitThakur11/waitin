import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, Shield, HelpCircle, ChevronRight, User } from 'lucide-react-native';
import { Card } from '../components/Card';
import { clearTokens } from '../api/tokenStore';
import { colors, radius, spacing } from '../theme';

export function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  async function signOut() {
    await clearTokens();
    navigation.getParent()?.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
  }

  const rows = [
    { icon: Bell, label: 'Notifications', onPress: () => navigation.navigate('Notifications') },
    { icon: Shield, label: 'Privacy', onPress: () => navigation.navigate('Privacy') },
    { icon: HelpCircle, label: 'Help & Support', onPress: () => {} },
  ];

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <Text style={styles.title}>Profile</Text>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.profile}>
          <View style={styles.avatar}>
            <User size={34} color={colors.primary} strokeWidth={2} />
          </View>
          <Text style={styles.name}>Your account</Text>
          <Text style={styles.muted}>Signed in with your phone number</Text>
        </Card>

        <Card padded={false}>
          {rows.map((r, i) => (
            <Pressable
              key={r.label}
              onPress={r.onPress}
              style={[styles.menuRow, i < rows.length - 1 && styles.divider]}>
              <r.icon size={20} color={colors.text} strokeWidth={2} />
              <Text style={styles.menuLabel}>{r.label}</Text>
              <ChevronRight size={20} color={colors.textMuted} />
            </Pressable>
          ))}
        </Card>

        <Pressable style={styles.signOut} onPress={signOut}>
          <Text style={styles.signOutText}>Sign out</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  title: { fontSize: 24, fontWeight: '800', color: colors.text, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  content: { padding: spacing.md, gap: spacing.md, paddingBottom: 120 },
  profile: { alignItems: 'center', gap: 4, paddingVertical: spacing.lg },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.chipBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  name: { fontSize: 18, fontWeight: '800', color: colors.text },
  muted: { color: colors.textMuted, fontSize: 13 },
  menuRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, gap: spacing.md },
  divider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.text },
  signOut: {
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  signOutText: { color: colors.danger, fontWeight: '700', fontSize: 16 },
});
