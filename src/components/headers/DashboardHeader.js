import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Bell } from 'lucide-react-native';
import { colors, radius, spacing } from '../../theme';

function formatToday() {
  const now = new Date();
  const day = now.getDate();
  const month = now.toLocaleString('default', { month: 'long' });
  return `${day} ${month}`;
}

/** Top bar: greeting + today's date + notification bell. */
export function DashboardHeader({ name = 'Ronald S.', unread = 0, onPressBell }) {
  return (
    <View style={styles.row}>
      <View>
        <Text style={styles.greeting}>Hi, {name}</Text>
        <Text style={styles.date}>
          <Text style={styles.dateAccent}>Today,</Text> {formatToday()}
        </Text>
      </View>

      <Pressable style={styles.bell} onPress={onPressBell} hitSlop={8}>
        <Bell size={24} color={colors.text} strokeWidth={1.6} />
        {unread > 0 ? <View style={styles.dot} /> : null}
      </Pressable>
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
  greeting: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textMuted,
    marginBottom: 2,
  },
  date: {
    fontSize: 24,
    fontWeight: '500',
    color: colors.text,
    letterSpacing: -0.4,
  },
  dateAccent: { fontWeight: '800' },
  bell: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.danger,
    borderWidth: 1.5,
    borderColor: colors.surface,
  },
});
