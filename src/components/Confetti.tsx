import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import theme from '../constants/theme';
import { CONFETTI_COUNT, CONFETTI_MS } from '../constants/config';

const COLORS = [theme.colors.brand.coral, theme.colors.brand.coralDeep, theme.colors.brand.mint];

type Props = { fire: boolean };

type Dot = {
  key: string;
  color: string;
  dx: number;
  dy: number;
  delay: number;
};

/**
 * 500ms burst of tiny dots. transform + opacity only, so the native driver is
 * allowed; pointerEvents none so it can never intercept a button tap.
 */
function Confetti({ fire }: Props) {
  const progress = useRef(new Animated.Value(0)).current;

  const dots = useMemo<Dot[]>(
    () =>
      Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
        key: 'c' + i,
        color: COLORS[i % COLORS.length],
        dx: (i % 2 === 0 ? 1 : -1) * (10 + ((i * 37) % 110)),
        dy: -(90 + ((i * 53) % 80)),
        delay: i * 18,
      })),
    [],
  );

  useEffect(() => {
    if (!fire) {
      progress.setValue(0);
      return;
    }
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: CONFETTI_MS,
      useNativeDriver: true,
    }).start();
  }, [fire, progress]);

  if (!fire) {
    return null;
  }

  return (
    <View style={styles.wrap} pointerEvents="none">
      {dots.map(dot => {
        // Each dot waits out its stagger before it starts travelling.
        // Never 0 or 1 — Animated requires a strictly increasing inputRange.
        const start = Math.min(0.5, Math.max(0.001, dot.delay / CONFETTI_MS));
        const translateX = progress.interpolate({
          inputRange: [0, start, 1],
          outputRange: [0, 0, dot.dx],
        });
        const translateY = progress.interpolate({
          inputRange: [0, start, 1],
          outputRange: [0, 0, dot.dy],
        });
        const opacity = progress.interpolate({
          inputRange: [0, 0.6, 1],
          outputRange: [1, 0.8, 0],
        });
        return (
          <Animated.View
            key={dot.key}
            style={[
              styles.dot,
              { backgroundColor: dot.color, opacity, transform: [{ translateX }, { translateY }] },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});

export default React.memo(Confetti);
