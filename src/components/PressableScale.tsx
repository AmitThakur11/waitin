import React, { useRef } from 'react';
import { Animated, Pressable, ViewStyle, StyleProp } from 'react-native';

type Props = {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  scaleTo?: number;
  disabled?: boolean;
};

// Single element that is both pressable and animated, so layout styles (width,
// flex, margin) on `style` apply to the touchable itself — important for
// percentage-width grid tiles.
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * Pressable that springs down on touch — the tactile feel of iOS controls.
 * Uses the native driver so it stays at 60fps off the JS thread.
 */
export function PressableScale({ children, onPress, style, scaleTo = 0.965, disabled }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const animate = (to: number) =>
    Animated.spring(scale, {
      toValue: to,
      useNativeDriver: true,
      speed: 40,
      bounciness: 6,
    }).start();

  return (
    <AnimatedPressable
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => animate(scaleTo)}
      onPressOut={() => animate(1)}
      style={[style, { transform: [{ scale }] }]}>
      {children}
    </AnimatedPressable>
  );
}
