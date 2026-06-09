import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { QrCode, Bell, User } from 'lucide-react-native';
import { colors, radius, spacing } from '../theme';

/** Top bar: ContactKaro wordmark + notification bell + avatar. */
export function DashboardHeader({ unread = 0, onPressBell, onPressAvatar }) {
  return (
    <View style={styles.row}>
      <View style={styles.brand}>
        <View style={styles.logo}>
          <QrCode size={22} color="#fff" strokeWidth={2.5} />
        </View>
        <Text style={styles.wordmark}>
          Contact<Text style={styles.wordmarkAccent}>Karo</Text>
        </Text>
      </View>

      <View style={styles.right}>
        <Pressable style={styles.bell} onPress={onPressBell} hitSlop={8}>
          <Bell size={22} color={colors.text} strokeWidth={2} />
          {unread > 0 ? <View style={styles.dot} /> : null}
        </Pressable>
        <Pressable style={styles.avatar} onPress={onPressAvatar}>
          <User size={20} color={colors.primary} strokeWidth={2} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  logo: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordmark: { fontSize: 20, fontWeight: '800', color: colors.text },
  wordmarkAccent: { color: colors.primary },
  right: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  bell: { padding: 4 },
  dot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.danger,
    borderWidth: 1.5,
    borderColor: colors.bg,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.chipBlue,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
});
