import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Bell,
  Plus,
  Car as CarIcon,
  ScanLine,
  ChevronRight,
} from 'lucide-react-native';
import { Card } from '../components/Card';
import { TagCard } from '../components/Card/TagCard';
import { IconChip } from '../components/IconChip';
import { PressableScale } from '../components/PressableScale';
import { FadeInUp } from '../components/FadeInUp';
import { Shine } from '../components/Shine';
import { listCars } from '../api/cars';
import { listNotifications } from '../api/notifications';
import { actionMeta } from '../api/actionLabels';
import { colors, radius, spacing, shadow, type } from '../theme';
import { DashboardHeader } from '../components/headers/DashboardHeader';

function carTitle(car) {
  return (
    car.nickname ||
    [car.color, car.make, car.model].filter(Boolean).join(' ') ||
    car.displayLabel ||
    'Tag'
  );
}

function timeAgo(iso) {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m} mins ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hours ago`;
  return `${Math.floor(h / 24)} days ago`;
}

export function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const cars = useQuery({ queryKey: ['cars'], queryFn: listCars });
  const activity = useQuery({ queryKey: ['notifications'], queryFn: listNotifications });

  useFocusEffect(
    React.useCallback(() => {
      cars.refetch();
      activity.refetch();
      StatusBar.setBarStyle('dark-content');
    }, [cars, activity]),
  );

  const tags = cars.data ?? [];
  const hasTags = tags.length > 0;
  const scanCount = activity.data?.length ?? 0;
  const unread = activity.data?.filter(n => !n.readAt).length ?? 0;
  const feed = activity.data ?? [];

  const openCar = id => navigation.navigate('CarDetail', { carId: id });

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.xs }]}>
      {/* Fixed top bar */}
      <DashboardHeader unread={unread} onPressBell={() => navigation.navigate('Notifications')} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <FadeInUp delay={60}>
          <View style={styles.displayRow}>
            <Text style={styles.display}>Keep your car{'\n'}always reachable</Text>
            <PressableScale style={styles.addTagBtn} onPress={() => navigation.navigate('AddCar')}>
              <Plus size={18} color={colors.text} strokeWidth={2.6} />
              <Text style={styles.addTagBtnText}>Add tag</Text>
              <Shine />
            </PressableScale>
          </View>
        </FadeInUp>

        {/* Bento */}
        <FadeInUp delay={120}>
          <View style={styles.bentoRow}>
            <Text style={styles.section}>Your Tags</Text>
            <Pressable onPress={() => navigation.navigate('Assets')}>
              <Text style={styles.seeAll}>See All</Text>
            </Pressable>
          </View>
        </FadeInUp>

        {cars.isLoading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.lg }} />
        ) : (
          <FadeInUp delay={160}>
            <View style={styles.bento}>
              {hasTags ? (
                <TagCard tag={tags[0]} onPress={() => openCar(tags[0].id)} />
              ) : (
                <PressableScale style={styles.featured} onPress={() => navigation.navigate('AddCar')}>
                  <View style={styles.featuredChip}>
                    <Plus size={22} color={colors.primary} strokeWidth={2.4} />
                  </View>
                  <Text style={styles.featuredTitle}>Add your first tag</Text>
                  <Text style={styles.muted}>Generate a QR and start getting scan alerts.</Text>
                </PressableScale>
              )}

              {/* small tiles: remaining tags, stats, add */}
              <View style={styles.grid}>
                {tags.slice(1, 3).map(tag => (
                  <PressableScale key={tag.id} style={styles.tile} onPress={() => openCar(tag.id)}>
                    <View style={styles.tileChip}>
                      <CarIcon size={18} color={colors.primary} strokeWidth={2.2} />
                    </View>
                    <Text style={styles.tileTitle} numberOfLines={1}>{carTitle(tag)}</Text>
                    {tag.plate ? (
                      <Text style={styles.muted} numberOfLines={1}>{tag.plate}</Text>
                    ) : null}
                  </PressableScale>
                ))}

                <StatTile icon={ScanLine} value={scanCount} label="Scans" onPress={() => navigation.navigate('Notifications')} />
                <StatTile icon={Bell} value={unread} label="Alerts" onPress={() => navigation.navigate('Notifications')} />
              </View>
            </View>
          </FadeInUp>
        )}

        {/* Recent activity */}
        <FadeInUp delay={220}>
          <View style={styles.bentoRow}>
            <Text style={styles.section}>Recent Activity</Text>
            <Pressable onPress={() => navigation.navigate('Notifications')}>
              <Text style={styles.seeAll}>See All</Text>
            </Pressable>
          </View>
        </FadeInUp>

        {feed.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.muted}>No scans yet. Share a tag to see activity.</Text>
          </Card>
        ) : (
          feed.slice(0, 5).map((n, i) => {
            const a = actionMeta(n.actionType);
            return (
              <FadeInUp key={n.id} delay={240 + i * 45}>
                <PressableScale style={styles.rowWrap}>
                  <Card style={styles.activityRow}>
                    <IconChip icon={a.icon} color={a.color} bg={a.color + '14'} size={40} />
                    <View style={styles.activityText}>
                      <Text style={styles.activityTitle}>{a.text}</Text>
                      <Text style={styles.muted}>{timeAgo(n.createdAt)}</Text>
                    </View>
                    <ChevronRight size={18} color={colors.textFaint} />
                  </Card>
                </PressableScale>
              </FadeInUp>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

function StatTile({ icon: Icon, value, label, onPress }) {
  return (
    <PressableScale style={[styles.tile, styles.statTile]} onPress={onPress}>
      <View style={styles.tileChip}>
        <Icon size={18} color={colors.primary} strokeWidth={2.2} />
      </View>
      <View style={styles.statData}>
        <Text style={styles.tileValue}>{value}</Text>
        <Text style={styles.muted}>{label}</Text>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F7F7F7', paddingHorizontal: spacing.md },
  scroll: { paddingBottom: 120 },

  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.sm },
  iconChip: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hello: { fontSize: 17, fontWeight: '800', color: colors.text, letterSpacing: -0.3 },
  dot: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
    borderWidth: 1.5,
    borderColor: colors.surfaceAlt,
  },

  displayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  display: { flex: 1, fontSize: 28, fontWeight: '800', color: colors.text, letterSpacing: -0.7, lineHeight: 34 },
  addTagBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.text,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  addTagBtnText: { color: colors.text, fontSize: 13, fontWeight: '700', letterSpacing: -0.2 },

  section: { ...type.section, color: colors.text },
  bentoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.md, marginBottom: spacing.sm },
  seeAll: { ...type.caption, color: colors.primary, fontWeight: '700' },

  bento: { gap: spacing.sm },
  featured: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: spacing.md,
    gap: 4,
    ...shadow,
  },
  featuredChip: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  featuredTitle: { fontSize: 18, fontWeight: '800', color: colors.text, letterSpacing: -0.3 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  tile: {
    width: '48.5%',
    backgroundColor: 'rgba(255,255,255,0.45)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.65)',
    padding: spacing.sm + 2,
    gap: 2,
  },
  tileChip: { width: 30, height: 30, borderRadius: 9, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  statTile: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  statData: { alignItems: 'flex-start' },
  tileTitle: { ...type.body, fontSize: 13, color: colors.text },
  tileValue: { fontSize: 20, fontWeight: '800', color: colors.text, letterSpacing: -0.4 },

  flex: { flex: 1 },
  activityText: { flex: 1, gap: 3 },
  muted: { ...type.caption, color: colors.textMuted, lineHeight: 17 },
  rowWrap: { marginBottom: spacing.sm },
  emptyCard: {
    backgroundColor: 'rgba(255,255,255,0.45)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.65)',
    shadowOpacity: 0,
    elevation: 0,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.sm + 2,
    backgroundColor: 'rgba(255,255,255,0.45)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.65)',
    shadowOpacity: 0,
    elevation: 0,
  },
  activityTitle: { ...type.body, fontSize: 15, color: colors.text },
});
