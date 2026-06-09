import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useFocusEffect } from '@react-navigation/native';
import { Screen } from '../components/Screen';
import { Button } from '../components/Button';
import { listNotifications, markAllRead } from '../api/notifications';
import { actionMeta } from '../api/actionLabels';
import { IconChip } from '../components/IconChip';
import { colors, radius, spacing } from '../theme';

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function carName(n) {
  return n.car.nickname || n.car.displayLabel || 'your car';
}

export function NotificationHistoryScreen() {
  const qc = useQueryClient();
  const feed = useQuery({ queryKey: ['notifications'], queryFn: listNotifications });

  useFocusEffect(
    React.useCallback(() => {
      feed.refetch();
    }, [feed]),
  );

  async function onReadAll() {
    await markAllRead();
    qc.invalidateQueries({ queryKey: ['notifications'] });
  }

  return (
    <Screen subtitle="Every time someone scans your QR, it shows up here.">
      {feed.isLoading ? (
        <ActivityIndicator color={colors.primary} />
      ) : feed.data && feed.data.length > 0 ? (
        <>
          <Button label="Mark all read" variant="ghost" onPress={onReadAll} />
          {feed.data.map(n => {
            const a = actionMeta(n.actionType);
            const unread = !n.readAt;
            return (
              <View key={n.id} style={[styles.row, unread && styles.unread]}>
                <IconChip icon={a.icon} color={a.color} bg={colors.surfaceAlt} size={40} />
                <View style={styles.body}>
                  <Text style={styles.title}>{a.text}</Text>
                  <Text style={styles.meta}>
                    {carName(n)} · {timeAgo(n.createdAt)}
                  </Text>
                  {n.message ? <Text style={styles.message}>“{n.message}”</Text> : null}
                </View>
                {unread ? <View style={styles.dot} /> : null}
              </View>
            );
          })}
        </>
      ) : (
        <Text style={styles.muted}>No scans yet. Share your QR and they'll appear here.</Text>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  unread: { borderColor: colors.primary },
  body: { flex: 1, gap: 2 },
  title: { color: colors.text, fontSize: 16, fontWeight: '600' },
  meta: { color: colors.textMuted, fontSize: 13 },
  message: { color: colors.text, fontSize: 14, fontStyle: 'italic', marginTop: 2 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  muted: { color: colors.textMuted, fontSize: 14 },
});
