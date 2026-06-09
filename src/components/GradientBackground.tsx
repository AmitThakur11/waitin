import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

type Props = {
  id: string; // must be unique per gradient instance on screen
  colors: readonly string[];
  radius?: number;
  /** Diagonal by default; set vertical for a top-to-bottom sheen. */
  vertical?: boolean;
};

/**
 * Absolutely-filled gradient, drawn with react-native-svg so we get Apple-style
 * gradients without adding another native module. Place inside a parent with
 * `overflow: 'hidden'` and a matching borderRadius.
 */
export function GradientBackground({ id, colors, radius = 0, vertical = false }: Props) {
  const x2 = vertical ? '0' : '1';
  const y2 = '1';
  return (
    <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
      <Defs>
        <LinearGradient id={id} x1="0" y1="0" x2={x2} y2={y2}>
          {colors.map((c, i) => (
            <Stop key={i} offset={`${i / (colors.length - 1)}`} stopColor={c} />
          ))}
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" rx={radius} ry={radius} fill={`url(#${id})`} />
    </Svg>
  );
}
