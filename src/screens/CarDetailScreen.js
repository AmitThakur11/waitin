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
} from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Screen } from '../components/Screen';
import { Button } from '../components/Button';
import {
  getCar,
  getQr,
  rotateQr,
  deleteCar,
  updateDisplay,
} from '../api/cars';
import { colors, radius, spacing } from '../theme';

const TOGGLES = [
  { key: 'showLabel', label: 'Show label on scan page' },
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
      message: `Scan or open to reach me about my car: ${qr.data.shareUrl}`,
      url: qr.data.shareUrl,
    });
  }

  async function onRotate() {
    Alert.alert('Rotate QR?', 'The old printed sticker will stop working.', [
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
    Alert.alert('Delete car?', 'This removes the car and its QR.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteCar(carId);
          await qc.invalidateQueries({ queryKey: ['cars'] });
          navigation.navigate('Main');
        },
      },
    ]);
  }

  const settings = car.data?.settings;
  const title =
    car.data?.nickname ||
    [car.data?.color, car.data?.make, car.data?.model].filter(Boolean).join(' ') ||
    'Car';

  return (
    <Screen title={title}>
      <View style={styles.qrCard}>
        {qr.isLoading ? (
          <ActivityIndicator color={colors.primary} />
        ) : qr.data ? (
          <>
            <Image source={{ uri: qr.data.pngDataUrl }} style={styles.qr} resizeMode="contain" />
            <Text style={styles.url} numberOfLines={1}>
              {qr.data.shareUrl}
            </Text>
          </>
        ) : (
          <Text style={styles.muted}>QR unavailable.</Text>
        )}
      </View>

      <Button label="Share / print sticker" onPress={onShare} />
      <Button label="Rotate QR (revoke old)" variant="ghost" onPress={onRotate} />

      <Text style={styles.section}>Scan-page permissions</Text>
      {settings
        ? TOGGLES.map(t => (
            <View key={t.key} style={styles.row}>
              <Text style={styles.rowLabel}>{t.label}</Text>
              <Switch
                value={Boolean(settings[t.key])}
                onValueChange={v => onToggle(t.key, v)}
                trackColor={{ true: colors.primary, false: colors.border }}
              />
            </View>
          ))
        : null}

      <Button label="Delete car" variant="ghost" onPress={onDelete} style={styles.delete} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  qrCard: {
    backgroundColor: '#fff',
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  qr: { width: 240, height: 240 },
  url: { color: '#333', fontSize: 12 },
  section: { color: colors.text, fontSize: 16, fontWeight: '700', marginTop: spacing.md },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  rowLabel: { color: colors.text, fontSize: 15, flex: 1, paddingRight: spacing.sm },
  muted: { color: colors.textMuted },
  delete: { borderColor: colors.danger, marginTop: spacing.lg },
});
