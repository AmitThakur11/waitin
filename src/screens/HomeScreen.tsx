import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  ActivityIndicator,
  Animated,
  Pressable,
  StatusBar,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  QrCode,
  Plus,
  AlertTriangle,
  Car as CarIcon,
  ShieldCheck,
  Info,
  ChevronRight,
  Bell,
  ScanLine,
  Layers3,
} from 'lucide-react-native';
import { Card } from '../components/Card';
import { IconChip } from '../components/IconChip';
import { PressableScale } from '../components/PressableScale';
import { FadeInUp } from '../components/FadeInUp';
import { GradientBackground } from '../components/GradientBackground';
import { listCars, Car } from '../api/cars';
import { listNotifications, NotificationItem } from '../api/notifications';
import { actionMeta } from '../api/actionLabels';
import { colors, radius, spacing, shadow, type, gradients, glass } from '../theme';

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

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export function HomeScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [sos, setSos] = useState(false);

  const cars = useQuery({ queryKey: ['cars'], queryFn: listCars });
  const activity = useQuery({ queryKey: ['notifications'], queryFn: listNotifications });

  useFocusEffect(
    React.useCallback(() => {
      cars.refetch();
      activity.refetch();
      StatusBar.setBarStyle('light-content');
      return () => StatusBar.setBarStyle('dark-content');
    }, [cars, activity]),
  );

  const tagCount = cars.data?.length ?? 0;
  const hasTags = tagCount > 0;
  const scanCount = activity.data?.length ?? 0;
  const unread = activity.data?.filter(n => !n.readAt).length ?? 0;

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* ===== Gradient hero ===== */}
        <View style={[styles.hero, { paddingTop: insets.top + spacing.sm }]}>
          <GradientBackground id="heroGrad" colors={gradients.hero} />
          <ShieldCheck
            size={220}
            color="#FFFFFF"
            strokeWidth={1}
            style={styles.heroMotif}
          />

          <FadeInUp delay={0}>
            <View style={styles.heroBar}>
              <View style={styles.brand}>
                <View style={styles.brandLogo}>
                  <QrCode size={20} color={colors.primary} strokeWidth={2.6} />
                </View>
                <Text style={styles.brandText}>
                  Contact<Text style={styles.brandTextBold}>Karo</Text>
                </Text>
              </View>
              <View style={styles.heroIcons}>
                <Pressable
                  style={styles.glassIcon}
                  onPress={() => navigation.navigate('Notifications')}
                  hitSlop={8}>
                  <Bell size={20} color="#fff" strokeWidth={2} />
                  {unread > 0 ? <View style={styles.dot} /> : null}
                </Pressable>
                <Pressable
                  style={styles.glassIcon}
                  onPress={() => navigation.navigate('Profile')}
                  hitSlop={8}>
                  <CarIcon size={20} color="#fff" strokeWidth={2} />
                </Pressable>
              </View>
            </View>
          </FadeInUp>

          <FadeInUp delay={70}>
            <Text style={styles.heroEyebrow}>{greeting()}</Text>
            <Text style={styles.heroTitle}>{hasTags ? "You're protected" : 'Welcome'}</Text>
          </FadeInUp>

          {/* Glassy primary-vehicle status card */}
          <FadeInUp delay={140}>
            {hasTags ? (
              <PressableScale
                style={styles.glassCard}
                onPress={() => navigation.navigate('CarDetail', { carId: cars.data![0].id })}>
                <View style={styles.glassChip}>
                  <ShieldCheck size={24} color="#fff" strokeWidth={2.2} />
                </View>
                <View style={styles.flex}>
                  <Text style={styles.glassLabel}>PRIMARY TAG</Text>
                  <Text style={styles.glassTitle}>{carTitle(cars.data![0])}</Text>
                  {cars.data![0].plate ? (
                    <Text style={styles.glassSub}>{cars.data![0].plate}</Text>
                  ) : null}
                </View>
                <View style={styles.activePill}>
                  <View style={styles.activeDot} />
                  <Text style={styles.activeText}>Active</Text>
                </View>
              </PressableScale>
            ) : (
              <View style={styles.glassCard}>
                <View style={styles.glassChip}>
                  <QrCode size={22} color="#fff" strokeWidth={2.2} />
                </View>
                <View style={styles.flex}>
                  <Text style={styles.glassTitle}>No tags yet</Text>
                  <Text style={styles.glassSub}>Add one to start getting alerts</Text>
                </View>
                <PressableScale style={styles.glassCta} onPress={() => navigation.navigate('AddCar')}>
                  <Text style={styles.glassCtaText}>Add</Text>
                </PressableScale>
              </View>
            )}
          </FadeInUp>
        </View>

        {/* ===== Body ===== */}
        <View style={styles.body}>
          {/* Bento stats */}
          <FadeInUp delay={200}>
            <View style={styles.bento}>
              <StatTile icon={Layers3} value={tagCount} label="Active tags" tint={colors.primary} />
              <StatTile icon={ScanLine} value={scanCount} label="Scans" tint={colors.success} />
              <StatTile icon={Bell} value={unread} label="New alerts" tint={colors.warning} />
            </View>
          </FadeInUp>

          {/* Quick actions */}
          <FadeInUp delay={260}>
            <Text style={styles.section}>Quick Actions</Text>
            <View style={styles.actionsRow}>
              <PressableScale style={styles.actionPrimary} onPress={() => navigation.navigate('Scan')}>
                <GradientBackground id="scanGrad" colors={gradients.primary} radius={radius.lg} />
                <View style={styles.actionInner}>
                  <QrCode size={26} color="#fff" strokeWidth={2.2} />
                  <Text style={styles.actionLabelLight}>Scan Tag</Text>
                </View>
              </PressableScale>
              <PressableScale style={styles.actionGhost} onPress={() => navigation.navigate('AddCar')}>
                <View style={styles.actionInner}>
                  <View style={styles.plusRing}>
                    <Plus size={20} color={colors.primary} strokeWidth={2.6} />
                  </View>
                  <Text style={styles.actionLabel}>Add New</Text>
                </View>
              </PressableScale>
            </View>
          </FadeInUp>

          {/* Emergency */}
          <FadeInUp delay={320}>
            <EmergencyCard value={sos} onChange={setSos} />
          </FadeInUp>

          {cars.isLoading ? (
            <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
          ) : hasTags ? (
            <ActivitySection
              activity={activity.data ?? []}
            />
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

function StatTile({
  icon: Icon,
  value,
  label,
  tint,
}: {
  icon: any;
  value: number;
  label: string;
  tint: string;
}) {
  return (
    <View style={styles.statTile}>
      <View style={[styles.statIcon, { backgroundColor: tint + '1A' }]}>
        <Icon size={18} color={tint} strokeWidth={2.2} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function EmergencyCard({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  const glow = useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.timing(glow, { toValue: value ? 1 : 0, duration: 260, useNativeDriver: true }).start();
  }, [value, glow]);
  return (
    <View>
      <Animated.View style={[styles.emergencyGlow, { opacity: glow }]} pointerEvents="none" />
      <Card style={styles.emergency}>
        <IconChip icon={AlertTriangle} color={colors.danger} bg={colors.dangerSoft} />
        <View style={styles.flex}>
          <Text style={styles.rowTitle}>Emergency Mode</Text>
          <Text style={styles.muted}>Broadcast SOS on scan</Text>
        </View>
        <Switch
          value={value}
          onValueChange={onChange}
          trackColor={{ true: colors.danger, false: '#D7DEE8' }}
          thumbColor="#fff"
          ios_backgroundColor="#D7DEE8"
        />
      </Card>
    </View>
  );
}

function ActivitySection({ activity }: { activity: NotificationItem[] }) {
  return (
    <View>
      <FadeInUp delay={360}>
        <Text style={styles.section}>Recent Activity</Text>
      </FadeInUp>
      {activity.length === 0 ? (
        <Card>
          <Text style={styles.muted}>No scans yet. Share a tag and activity shows here.</Text>
        </Card>
      ) : (
        activity.slice(0, 6).map((n, i) => {
          const a = actionMeta(n.actionType);
          return (
            <FadeInUp key={n.id} delay={400 + i * 50}>
              <PressableScale style={styles.rowWrap}>
                <Card style={styles.activityRow}>
                  <IconChip icon={a.icon} color={a.color} bg={a.color + '14'} size={42} />
                  <View style={styles.flex}>
                    <Text style={styles.activityTitle}>{a.text}</Text>
                    <Text style={styles.muted}>{timeAgo(n.createdAt)}</Text>
                  </View>
                  <ChevronRight size={20} color={colors.textFaint} />
                </Card>
              </PressableScale>
            </FadeInUp>
          );
        })
      )}

      <FadeInUp delay={460}>
        <Card style={styles.help}>
          <View style={styles.helpHead}>
            <Info size={18} color={colors.primary} strokeWidth={2.2} />
            <Text style={styles.helpTitle}>Need Help?</Text>
          </View>
          <Text style={styles.muted}>
            Tags connect people to your belongings or contact info — safely and privately.
          </Text>
        </Card>
      </FadeInUp>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingBottom: spacing.xxl },

  // Hero
  hero: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
    backgroundColor: colors.primary,
  },
  heroMotif: { position: 'absolute', right: -50, top: -30, opacity: 0.08 },
  heroBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  brandLogo: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: { fontSize: 19, fontWeight: '800', color: '#fff', letterSpacing: -0.3 },
  brandTextBold: { color: '#CFE0FF' },
  heroIcons: { flexDirection: 'row', gap: spacing.sm },
  glassIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: glass.fill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: glass.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
    top: 8,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  heroEyebrow: { ...type.caption, color: glass.textDim, marginBottom: 2 },
  heroTitle: { fontSize: 30, fontWeight: '800', color: '#fff', letterSpacing: -0.6, marginBottom: spacing.md },

  glassCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: glass.fill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: glass.border,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  glassChip: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: glass.fillStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glassLabel: { fontSize: 10, fontWeight: '700', color: glass.textDim, letterSpacing: 1 },
  glassTitle: { fontSize: 17, fontWeight: '800', color: '#fff', letterSpacing: -0.3 },
  glassSub: { ...type.caption, color: glass.text },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(52,199,89,0.22)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  activeDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#5BE584' },
  activeText: { color: '#DFFBE8', fontSize: 12, fontWeight: '700' },
  glassCta: {
    backgroundColor: '#fff',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  glassCtaText: { color: colors.primary, fontWeight: '800', fontSize: 14 },

  // Body
  body: { paddingHorizontal: spacing.md, gap: spacing.xs, marginTop: spacing.md },
  flex: { flex: 1 },
  section: { ...type.section, color: colors.text, marginTop: spacing.md, marginBottom: spacing.sm },
  muted: { ...type.caption, color: colors.textMuted, lineHeight: 18 },
  rowTitle: { ...type.body, fontSize: 16, color: colors.text },

  // Bento
  bento: { flexDirection: 'row', gap: spacing.sm, marginTop: -spacing.xl + 4 },
  statTile: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: 6,
    ...shadow,
  },
  statIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  statValue: { fontSize: 24, fontWeight: '800', color: colors.text, letterSpacing: -0.5 },
  statLabel: { fontSize: 12, fontWeight: '600', color: colors.textMuted },

  // Quick actions
  actionsRow: { flexDirection: 'row', gap: spacing.md },
  actionPrimary: { flex: 1, height: 100, borderRadius: radius.lg, backgroundColor: colors.primary, ...shadow },
  actionGhost: {
    flex: 1,
    height: 100,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    ...shadow,
  },
  actionInner: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', gap: 8 },
  plusRing: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { ...type.body, fontSize: 15, color: colors.text },
  actionLabelLight: { ...type.body, fontSize: 15, color: '#fff' },

  emergencyGlow: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    borderRadius: radius.lg + 3,
    margin: -3,
    borderWidth: 2,
    borderColor: colors.danger,
  },
  emergency: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.sm },

  rowWrap: { marginBottom: spacing.sm },
  activityRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  activityTitle: { ...type.body, fontSize: 15, color: colors.text },

  help: { backgroundColor: colors.surfaceAlt, borderColor: colors.chipBlue, marginTop: spacing.sm },
  helpHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: 4 },
  helpTitle: { ...type.body, fontSize: 15, color: colors.primary },
});
