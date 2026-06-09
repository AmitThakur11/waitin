import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Car as CarIcon, ChevronRight, Plus } from 'lucide-react-native';
import { Card } from '../components/Card';
import { IconChip } from '../components/IconChip';
import { listCars, Car } from '../api/cars';
import { colors, radius, spacing, shadow } from '../theme';

function carTitle(car: Car): string {
  return (
    car.nickname || [car.color, car.make, car.model].filter(Boolean).join(' ') || car.displayLabel || 'Tag'
  );
}

export function AssetsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const cars = useQuery({ queryKey: ['cars'], queryFn: listCars });

  useFocusEffect(
    React.useCallback(() => {
      cars.refetch();
    }, [cars]),
  );

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Tags</Text>
        <Pressable style={styles.addBtn} onPress={() => navigation.navigate('AddCar')}>
          <Plus size={16} color="#fff" strokeWidth={2.5} />
          <Text style={styles.addText}>Add</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {cars.isLoading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
        ) : (cars.data?.length ?? 0) > 0 ? (
          cars.data!.map(car => (
            <Pressable key={car.id} onPress={() => navigation.navigate('CarDetail', { carId: car.id })}>
              <Card style={styles.row}>
                <IconChip icon={CarIcon} />
                <View style={styles.flex}>
                  <Text style={styles.rowTitle}>{carTitle(car)}</Text>
                  {car.plate ? <Text style={styles.muted}>{car.plate}</Text> : null}
                </View>
                <ChevronRight size={20} color={colors.textMuted} />
              </Card>
            </Pressable>
          ))
        ) : (
          <Text style={[styles.muted, { textAlign: 'center', marginTop: spacing.xl }]}>
            No tags yet. Tap “Add” to create one.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  title: { fontSize: 24, fontWeight: '800', color: colors.text },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    ...shadow,
  },
  addText: { color: '#fff', fontWeight: '700' },
  content: { padding: spacing.md, gap: spacing.sm, paddingBottom: 120 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1 },
  rowTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  muted: { color: colors.textMuted, fontSize: 13 },
});
