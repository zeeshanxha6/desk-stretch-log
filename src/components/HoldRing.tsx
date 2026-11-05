import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import theme from '../constants/theme';
import { FINAL_PULSE_FROM_SEC, PULSE_MS } from '../constants/config';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = {
  size: number;
  durationSec: number;
  remaining: number;
  running: boolean;
  label: string;
};

const STROKE = 16;

/**
 * The hold ring. The sweep drives an SVG prop, so it runs with
 * useNativeDriver:false; the final-three-seconds pulse is a pure transform and
 * keeps the native driver.
 */
function HoldRing({ size, durationSec, remaining, running, label }: Props) {
  const radius = (size - STROKE) / 2;
  const circumference = 2 * Math.PI * radius;

  const sweep = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const loopRef = useRef<Animated.CompositeAnimation | null>(null);

  const final = running && remaining > 0 && remaining <= FINAL_PULSE_FROM_SEC;
  const strokeColor = final ? theme.colors.brand.coral : theme.colors.brand.teal;

  useEffect(() => {
    sweep.stopAnimation();
    if (!running || durationSec <= 0) {
      sweep.setValue(0);
      return;
    }
    sweep.setValue(0);
    Animated.timing(sweep, {
      toValue: 1,
      duration: durationSec * 1000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [durationSec, running, sweep]);

  useEffect(() => {
    if (loopRef.current) {
      loopRef.current.stop();
      loopRef.current = null;
    }
    if (!final) {
      pulse.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: PULSE_MS / 2,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: PULSE_MS / 2,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    loopRef.current = loop;
    loop.start();
    return () => {
      loop.stop();
    };
  }, [final, pulse]);

  const dashOffset = sweep.interpolate({
    inputRange: [0, 1],
    outputRange: [0, circumference],
  });

  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.05] });

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.wrap, { width: size, height: size, transform: [{ scale }] }]}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={theme.colors.ui.border}
          strokeWidth={STROKE}
          fill="none"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={STROKE}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.center}>
        <Text
          style={[styles.seconds, final ? styles.secondsFinal : styles.secondsCalm]}
          numberOfLines={1}>
          {remaining > 0 ? String(remaining) : String(durationSec)}
        </Text>
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  center: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  seconds: { fontSize: 48, lineHeight: 54, fontWeight: '800' },
  secondsCalm: { color: theme.colors.text.primary },
  secondsFinal: { color: theme.colors.brand.coral },
  label: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: theme.colors.text.secondary,
  },
});

export default React.memo(HoldRing);
