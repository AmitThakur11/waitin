import React from 'react';
import { View, StyleSheet, ViewStyle, ViewProps } from 'react-native';
import { colors, radius, shadow, spacing } from '../theme';

type Props = ViewProps & { style?: ViewStyle; padded?: boolean };

/** White rounded card with the standard soft shadow. */
export function Card({ style, padded = true, children, ...rest }: Props) {
  return (
    <View style={[styles.card, padded && styles.padded, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    ...shadow,
  },
  padded: { padding: spacing.md },
});
