import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Share,
  Alert,
  Switch,
  ActivityIndicator,
  Pressable,
  Clipboard,
  Platform,
  ScrollView,
} from 'react-native';
import { Copy, Share2 } from 'lucide-react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Screen } from '../components/Screen';
import { Button } from '../components/Button';
import { getCar, getQr, rotateQr, deleteCar, updateDisplay } from '../api/cars';
import { colors, radius, spacing, shadow } from '../theme';

const TOGGLES = [
  { key: 'showLabel', label: 'Show label on scan' },
  { key: 'allowMessage', label: 'Allow text messages' },
  { key: 'allowCall', label: 'Allow anonymous call' },
];

export function CarDetailScreen({ route, navigation }) {
  const { carId } = route.params;
  const qc = useQueryClient();

  const car = useQuery({ queryKey: ['car', carId], queryFn: () => getCar(carId) });
  const qr = useQuery({ queryKey: ['qr', carId], queryFn: () => getQr(carId) });

  async function onShare() {
    if (!qr.data) return;
    await Share.share({
      message: `Contact me about my car: ${qr.data.shareUrl}`,
      url: qr.data.shareUrl,
    });
  }

  function onCopy() {
    const url = qr.data?.shareUrl;
    if (!url) return;
    try {
      Clipboard.setString(url);
      Alert.alert('Copied', 'Public link copied to clipboard.');
    } catch {
      onShare();
    }
  }

  async function onRotate() {
    Alert.alert('Rotate QR Code?', 'The old sticker will stop working immediately. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Rotate',
        style: 'destructive',
        onPress: async () => {
          await rotateQr(carId);
          qc.invalidateQueries({ queryKey: ['qr', carId] });
        },
      },
    ]);
  }

  async function onToggle(key, value) {
    await updateDisplay(carId, { [key]: value });
    qc.invalidateQueries({ queryKey: ['car', carId] });
  }

  async function onDelete() {
    Alert.alert('Delete Car Profile?', 'This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete Permanently',
        style: 'destructive',
        onPress: async () => {
          await deleteCar(carId);
          await qc.invalidateQueries({ queryKey: ['cars'] });
          navigation.goBack();
        },
      },
    ]);
  }

  const title = car.data?.nickname || 'Your Car';
  const settings = car.data?.settings || {};

  return (
 
      <ScrollView
        contentContainerStyle={[  styles.scrollContent, {backgroundColor: 'white' }]}
        showsVerticalScrollIndicator={false}>

        {/* Hero QR Card */}
        <View style={{}}>
          {qr.isLoading ? (
            <View style={styles.loader}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : (
            <>
            <View style={{ borderRadius: radius.xl,padding: spacing.md, alignItems: 'center'}}>
              <View style={{ position: 'relative', borderRadius: radius.xl, padding: spacing.md, alignItems: 'center'}}>
                <View style={{ position: 'absolute', top: 8, left: 8, height: 40, width: 40, borderLeftWidth: 4, borderTopWidth: 4 }} />
                <View style={{ position: 'absolute', top: 8, right: 8, height: 40, width: 40, borderRightWidth: 4, borderTopWidth: 4 }} />
                <View style={{ position: 'absolute', bottom: 8, left: 8, height: 40, width: 40, borderLeftWidth: 4, borderBottomWidth: 4 }} />
                <View style={{ position: 'absolute', bottom: 8, right: 8, height: 40, width: 40, borderRightWidth: 4, borderBottomWidth: 4 }} />
              <Image source={{ uri: qr.data?.pngDataUrl }} style={styles.qr} />
              </View>
              </View>
              <View style={styles.linkRow}>
                <View style={styles.urlPill}>
                  <Text style={styles.urlText} numberOfLines={1}>
                    {qr.data?.shareUrl?.replace(/^https?:\/\//, '')}
                  </Text>
                  <Pressable style={styles.copyBtn} onPress={onCopy} hitSlop={6}>
                    <Copy size={18} color={colors.text} strokeWidth={2.2} />
                  </Pressable>
                </View>

                <Pressable style={styles.shareBtn} onPress={onShare} hitSlop={6}>
                  <Share2 size={18} color="#fff" strokeWidth={2.2} />
                </Pressable>
              </View>
            </>
          )}
        </View>

        {/* Primary Actions */}
        <View style={styles.actionRow}>
          <Button label="Share / Print" onPress={onShare} style={styles.flexBtn} />
          <Button label="Rotate QR" variant="ghost" onPress={onRotate} style={styles.flexBtn} />
        </View>

        {/* Settings Group */}
        <Text style={styles.sectionHeader}>Scan Page Privacy</Text>
        <View style={styles.settingsGroup}>
          {TOGGLES.map((t, i) => (
            <View key={t.key} style={[styles.row, i !== TOGGLES.length - 1 && styles.borderBottom]}>
              <Text style={styles.rowLabel}>{t.label}</Text>
              <Switch
                value={!!settings[t.key]}
                onValueChange={(val) => onToggle(t.key, val)}
                trackColor={{ true: colors.primary, false: colors.border }}
              />
            </View>
          ))}
        </View>

        {/* Danger Zone */}
        <Button 
          label="Delete Car Profile" 
          variant="primary" 
          onPress={onDelete} 
          style={styles.dangerButton} 
        />
        
      </ScrollView>

  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: spacing.lg, paddingBottom: 120 },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.6,
    marginBottom: spacing.lg,
  },
  heroCard: {

    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.08, shadowRadius: 24 },
      android: { elevation: 8 },
    }),
  },
  qr: { width: 220, height: 220, borderRadius: radius.md },
  loader: { width: 220, height: 220, justifyContent: 'center' },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    width: '100%',
    marginTop: spacing.lg,
  },
  urlPill: {
    flex: 1,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: spacing.lg,
    paddingRight: 6,
    backgroundColor: '#fff',
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow,
  },
  urlText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    letterSpacing: -0.2,
    marginRight: spacing.sm,
  },
  copyBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: colors.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.text,
    borderWidth: 1.5,
    borderColor: colors.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionRow: { flexDirection: 'row', gap: spacing.md, marginVertical: spacing.xl },
  flexBtn: { flex: 1, paddingVertical: spacing.sm + 2 },
  sectionHeader: { fontSize: 18, fontWeight: '800', color: colors.text, marginBottom: spacing.md },
  settingsGroup: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.md },
  borderBottom: { borderBottomWidth: 1, borderBottomColor: colors.border },
  rowLabel: { fontSize: 16, color: colors.text },
  dangerButton: { marginTop: spacing.xxl, backgroundColor: colors.text },
});