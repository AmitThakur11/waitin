import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { QrCode } from 'lucide-react-native';
import { PressableScale } from '../components/PressableScale';
import { GradientBackground } from '../components/GradientBackground';
import { requestOtp } from '../api/auth';
import { colors, radius, spacing, shadow, type, gradients } from '../theme';

export function OnboardingScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [digits, setDigits] = useState('');
  const [loading, setLoading] = useState(false);

  // Keep only digits, cap at the 10 a mobile Indian number has.
  const onChange = text => setDigits(text.replace(/[^0-9]/g, '').slice(0, 10));

  const valid = digits.length === 10;

  async function onContinue() {
    if (!valid) {
      Alert.alert('Check the number', 'Enter your 10-digit mobile number.');
      return;
    }
    const phone = `+91${digits}`;
    setLoading(true);
    try {
      const { devCode } = await requestOtp(phone);
      navigation.navigate('Otp', { phone, devCode });
    } catch (e) {
      console.log(e);
      const msg =
        e?.response?.data?.message?.[0] ??
        e?.response?.data?.message ??
        'Could not send the code. Check the number and try again.';
      Alert.alert('Hmm', String(msg));
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.xl }]}>
      <View style={styles.logo}>
        <QrCode size={30} color="#fff" strokeWidth={2.4} />
      </View>
      <Text style={styles.title}>
        Contact<Text style={styles.titleAccent}>Karo</Text>
      </Text>
      <Text style={styles.subtitle}>
        Enter your mobile number and we'll text you a 6-digit code to sign in.
      </Text>

      <Text style={styles.label}>Phone number</Text>
      <View style={styles.inputRow}>
        <View style={styles.codeChip}>
          <Text style={styles.flag}>🇮🇳</Text>
          <Text style={styles.code}>+91</Text>
        </View>
        <TextInput
          style={styles.input}
          value={digits}
          onChangeText={onChange}
          keyboardType="number-pad"
          textContentType="telephoneNumber"
          autoFocus
          maxLength={10}
          placeholder="98765 43210"
          placeholderTextColor={colors.textFaint}
          returnKeyType="done"
          onSubmitEditing={onContinue}
        />
      </View>

      <PressableScale
        style={[styles.button, !valid && styles.buttonDisabled]}
        onPress={onContinue}
        disabled={loading}>
        <GradientBackground id="sendGrad" colors={gradients.primary} radius={radius.lg} />
        <View style={styles.buttonInner}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Send code</Text>
          )}
        </View>
      </PressableScale>

      <Text style={styles.hint}>Standard SMS rates may apply.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: spacing.lg },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    ...shadow,
  },
  title: { ...type.largeTitle, color: colors.text },
  titleAccent: { color: colors.primary },
  subtitle: { ...type.caption, color: colors.textMuted, lineHeight: 20, marginTop: 6, marginBottom: spacing.xl },

  label: { ...type.caption, color: colors.textMuted, marginBottom: spacing.sm },
  inputRow: { flexDirection: 'row', gap: spacing.sm },
  codeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    ...shadow,
  },
  flag: { fontSize: 18 },
  code: { fontSize: 18, fontWeight: '700', color: colors.text },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1,
    color: colors.text,
    ...shadow,
  },

  button: { height: 56, borderRadius: radius.lg, marginTop: spacing.lg, ...shadow },
  buttonDisabled: { opacity: 0.55 },
  buttonInner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: '800', letterSpacing: -0.2 },
  hint: { ...type.caption, color: colors.textFaint, textAlign: 'center', marginTop: spacing.md },
});
