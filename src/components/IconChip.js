import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radius } from '../theme';

/** Rounded-square tinted chip holding a Lucide icon (asset/section icons). */
export function IconChip({ icon: Icon, color = colors.primary, bg = colors.chipBlue, size = 44 }) {
  return (
    <View
      style={[
        styles.chip,
        { width: size, height: size, borderRadius: radius.md, backgroundColor: bg },
      ]}>
      <Icon size={size * 0.5} color={color} strokeWidth={2} />
    </View>
  );
}

const styles = StyleSheet.create({
  chip: { alignItems: 'center', justifyContent: 'center' },
});
