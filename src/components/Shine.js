import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

/**
 * A periodic diagonal "shine" sweep for drawing attention to a control.
 * Drop it as the last child of a container with `overflow: 'hidden'`; the bright
 * translucent band sweeps across and momentarily lightens whatever sits beneath
 * it (icon/text), reading as a glint. Uses the native driver so it's smooth.
 */
export function Shine({
  color = 'rgba(255,255,255,0.85)',
  bandWidth = 26,
  duration = 900,
  delay = 1600,
}) {
  const [width, setWidth] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!width) return undefined;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 1,
          duration,
          delay,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(progress, { toValue: 0, duration: 0, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [width, progress, duration, delay]);

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-bandWidth, width + bandWidth],
  });

  return (
    <View
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
      onLayout={e => setWidth(e.nativeEvent.layout.width)}>
      <Animated.View
        style={[
          styles.band,
          { width: bandWidth, backgroundColor: color, transform: [{ translateX }, { skewX: '-20deg' }] },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  band: {
    position: 'absolute',
    top: -8,
    bottom: -8,
  },
});
