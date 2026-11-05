import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import theme from '../constants/theme';
import { PILL_SPRING } from '../constants/config';

export const PILL_W = 22;
export const PILL_H = 36;

type Props = {
  left: number;
  isNew: boolean;
};

/**
 * One recorded break on the workday ribbon. A freshly logged pill drops in
 * with a springy bounce — transform + opacity only, so the native driver is
 * safe here (rule: animation-gpu-properties).
 */
function BreakPill({ left, isNew }: Props) {
  const translateY = useRef(new Animated.Value(isNew ? -26 : 0)).current;
  const scale = useRef(new Animated.Value(isNew ? 0.6 : 1)).current;
  const opacity = useRef(new Animated.Value(isNew ? 0 : 1)).current;

  useEffect(() => {
    if (!isNew) {
      return;
    }
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        tension: PILL_SPRING.tension,
        friction: PILL_SPRING.friction,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        tension: PILL_SPRING.tension,
        friction: PILL_SPRING.friction,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 160,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isNew, opacity, scale, translateY]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.pill,
        { left, opacity, transform: [{ translateY }, { scale }] },
      ]}>
      <LinearGradient
        colors={theme.gradients.pill}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.grad}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  pill: {
    position: 'absolute',
    top: 10,
    width: PILL_W,
    height: PILL_H,
    borderRadius: PILL_W / 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.65)',
    overflow: 'hidden',
  },
  grad: { flex: 1 },
});

export default React.memo(BreakPill);
