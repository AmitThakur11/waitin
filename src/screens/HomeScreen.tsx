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
  Menu,
  Bell,
  Plus,
  Car as CarIcon,
  ScanLine,
  ShieldCheck,
  ChevronRight,
  LucideIcon,
} from 'lucide-react-native';
import { Card } from '../components/Card';
import { IconChip } from '../components/IconChip';
import { PressableScale } from '../components/PressableScale';
import { FadeInUp } from '../components/FadeInUp';
import { listCars, Car } from '../api/cars';
import { listNotifications } from '../api/notifications';
import { actionMeta } from '../api/actionLabels';
import { colors, radius, spacing, shadow, type } from '../theme';

function carTitle(car: Car): string {
  return (
    car.nickname ||
    [car.color, car.make, car.model].filter(Boolean).join(' ') ||
    car.displayLabel ||
    'Tag'
  );
}

function timeAgo(iso: string): string {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m} mins ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hours ago`;
  return `${Math.floor(h / 24)} days ago`;
}

export function HomeScreen({ navigation }: any) {
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

  const openCar = (id: string) => navigation.navigate('CarDetail', { carId: id });

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.xs }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Top bar */}
        <FadeInUp delay={0}>
          <View style={styles.topBar}>
            <Pressable style={styles.iconChip} onPress={() => navigation.navigate('Profile')}>
              <Menu size={20} color={colors.text} strokeWidth={2.2} />
            </Pressable>
            <Text style={styles.hello}>Hi there 👋</Text>
            <Pressable style={styles.iconChip} onPress={() => navigation.navigate('Notifications')}>
              <Bell size={20} color={colors.text} strokeWidth={2.2} />
              {unread > 0 ? <View style={styles.dot} /> : null}
            </Pressable>
          </View>
        </FadeInUp>

        <FadeInUp delay={60}>
          <Text style={styles.display}>Keep your car{'\n'}always reachable</Text>
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
                <PressableScale style={styles.featured} onPress={() => openCar(tags[0].id)}>
                  <View style={styles.featuredTop}>
                    <View style={styles.featuredChip}>
                      <CarIcon size={22} color={colors.primary} strokeWidth={2.2} />
                    </View>
                    <View style={styles.activePill}>
                      <View style={styles.activeDot} />
                      <Text style={styles.activeText}>Active</Text>
                    </View>
                  </View>
                  <Text style={styles.featuredTitle}>{carTitle(tags[0])}</Text>
                  {tags[0].plate ? <Text style={styles.muted}>{tags[0].plate}</Text> : null}
                  <View style={styles.featuredFoot}>
                    <ShieldCheck size={14} color={colors.primary} strokeWidth={2.4} />
                    <Text style={styles.featuredFootText}>Protected · tap for QR</Text>
                  </View>
                </PressableScale>
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

                <PressableScale style={[styles.tile, styles.addTile]} onPress={() => navigation.navigate('AddCar')}>
                  <View style={styles.tileChip}>
                    <Plus size={18} color={colors.primary} strokeWidth={2.6} />
                  </View>
                  <Text style={styles.tileTitle}>Add tag</Text>
                  <Text style={styles.muted}>New QR</Text>
                </PressableScale>
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
          <Card>
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
                    <View style={styles.flex}>
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

function StatTile({
  icon: Icon,
  value,
  label,
  onPress,
}: {
  icon: LucideIcon;
  value: number;
  label: string;
  onPress: () => void;
}) {
  return (
    <PressableScale style={styles.tile} onPress={onPress}>
      <View style={styles.tileChip}>
        <Icon size={18} color={colors.primary} strokeWidth={2.2} />
      </View>
      <Text style={styles.tileValue}>{value}</Text>
      <Text style={styles.muted}>{label}</Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: spacing.md },
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

  display: { fontSize: 28, fontWeight: '800', color: colors.text, letterSpacing: -0.7, lineHeight: 34, marginTop: spacing.xs, marginBottom: spacing.sm },

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
  featuredTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  featuredChip: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  featuredTitle: { fontSize: 18, fontWeight: '800', color: colors.text, letterSpacing: -0.3 },
  featuredFoot: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: spacing.sm },
  featuredFootText: { ...type.caption, color: colors.primary, fontWeight: '600' },
  activePill: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.surfaceAlt, paddingHorizontal: 9, paddingVertical: 5, borderRadius: radius.pill },
  activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary },
  activeText: { color: colors.primaryDark, fontSize: 11, fontWeight: '700' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  tile: {
    width: '48.5%',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: spacing.md,
    gap: 3,
    ...shadow,
  },
  addTile: { borderStyle: 'dashed', borderColor: colors.primary, backgroundColor: colors.surfaceAlt },
  tileChip: { width: 34, height: 34, borderRadius: 10, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  tileTitle: { ...type.body, fontSize: 14, color: colors.text },
  tileValue: { fontSize: 22, fontWeight: '800', color: colors.text, letterSpacing: -0.4 },

  flex: { flex: 1 },
  muted: { ...type.caption, color: colors.textMuted, lineHeight: 17 },
  rowWrap: { marginBottom: spacing.sm },
  activityRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.sm + 2 },
  activityTitle: { ...type.body, fontSize: 15, color: colors.text },
});
