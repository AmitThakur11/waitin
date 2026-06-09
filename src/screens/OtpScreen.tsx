import React, { useState } from 'react';
import { Alert, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../components/Screen';
import { Button } from '../components/Button';
import { TextField } from '../components/TextField';
import { verifyOtp } from '../api/auth';
import { colors, spacing } from '../theme';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Otp'>;

export function OtpScreen({ route, navigation }: Props) {
  const { phone, devCode } = route.params;
  const [code, setCode] = useState(devCode ?? '');
  const [loading, setLoading] = useState(false);

  async function onVerify() {
    setLoading(true);
    try {
      await verifyOtp(phone, code.trim());
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    } catch (e: any) {
      const msg =
        e?.response?.data?.message?.[0] ??
        e?.response?.data?.message ??
        'That code did not work. Try again.';
      Alert.alert('Incorrect code', String(msg));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen title="Enter code" subtitle={`Sent to ${phone}.`}>
      {devCode ? (
        <Text style={styles.devHint}>Dev mode — code prefilled: {devCode}</Text>
      ) : null}
      <TextField
        label="6-digit code"
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        maxLength={6}
        autoFocus
        placeholder="123456"
      />
      <Button label={loading ? 'Verifying…' : 'Verify'} onPress={onVerify} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  devHint: {
    color: colors.warning,
    fontSize: 13,
    marginBottom: spacing.sm,
  },
});
