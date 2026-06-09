import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme';

export function Button({ label, onPress, variant = 'primary', style }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' ? styles.primary : styles.ghost,
        pressed && styles.pressed,
        style,
      ]}>
      <Text style={variant === 'primary' ? styles.primaryText : styles.ghostText}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  primary: { backgroundColor: colors.primary },
  ghost: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border },
  pressed: { opacity: 0.8 },
  primaryText: { color: colors.primaryText, fontSize: 16, fontWeight: '600' },
  ghostText: { color: colors.text, fontSize: 16, fontWeight: '600' },
});
