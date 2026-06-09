import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../components/Screen';
import { Button } from '../components/Button';
import { TextField } from '../components/TextField';
import { createCar, CarInput } from '../api/cars';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'AddCar'>;

export function AddCarScreen({ navigation }: Props) {
  const qc = useQueryClient();
  const [form, setForm] = useState<CarInput>({});
  const [saving, setSaving] = useState(false);

  const set = (key: keyof CarInput) => (v: string) =>
    setForm(f => ({ ...f, [key]: v }));

  async function onSave() {
    setSaving(true);
    try {
      const car = await createCar(form);
      await qc.invalidateQueries({ queryKey: ['cars'] });
      navigation.replace('CarDetail', { carId: car.id });
    } catch (e: any) {
      const msg =
        e?.response?.data?.message?.[0] ?? e?.response?.data?.message ?? 'Could not save the car.';
      Alert.alert('Hmm', String(msg));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen subtitle="A QR sticker is generated automatically once you save.">
      <TextField label="Nickname" placeholder="Daily driver" onChangeText={set('nickname')} />
      <TextField label="Make" placeholder="Honda" onChangeText={set('make')} />
      <TextField label="Model" placeholder="Civic" onChangeText={set('model')} />
      <TextField label="Color" placeholder="Silver" onChangeText={set('color')} />
      <TextField label="Plate" placeholder="ABC 123" autoCapitalize="characters" onChangeText={set('plate')} />
      <TextField
        label="Public label (shown on scan)"
        placeholder="Silver Honda"
        onChangeText={set('displayLabel')}
      />
      <Button label={saving ? 'Saving…' : 'Save & get QR'} onPress={onSave} />
    </Screen>
  );
}
