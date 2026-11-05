import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AppShell from '../components/AppShell';
import theme from '../constants/theme';
import assets from '../assets';
import {
  BRAND_SPRING,
  BREATHE_MS,
  LOADER_DURATION_MS,
  LOADER_FADE_OUT_MS,
} from '../constants/config';

const BAR_W = 220;
const BAR_H = 6;

type Props = { onDone: () => void };

/**
 * Splash. Deliberately dark and saturated so it can never be confused with the
 * light mint Menu (rule #14): no chips, no stat cards, no CTA — just the brand
 * card, the wordmark and a thin progress bar.
 */
function LoaderScreen({ onDone }: Props) {
  const cardScale = useRef(new Animated.Value(0.82)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const breathe = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;
  const doneRef = useRef(onDone);

  doneRef.current = onDone;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(cardScale, {
        toValue: 1,
        tension: BRAND_SPRING.tension,
        friction: BRAND_SPRING.friction,
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 420,
        useNativeDriver: true,
      }),
    ]).start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, {
          toValue: 1,
          duration: BREATHE_MS / 2,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(breathe, {
          toValue: 0,
          duration: BREATHE_MS / 2,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();

    // width cannot run on the native driver (animation-gpu-properties).
    Animated.timing(progress, {
      toValue: 1,
      duration: LOADER_DURATION_MS,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: LOADER_FADE_OUT_MS,
        useNativeDriver: true,
      }).start(() => doneRef.current());
    }, LOADER_DURATION_MS);

    return () => {
      clearTimeout(timer);
      loop.stop();
    };
  }, [breathe, cardOpacity, cardScale, progress, screenOpacity]);

  const breatheScale = breathe.interpolate({ inputRange: [0, 1], outputRange: [1, 1.035] });
  const barWidth = progress.interpolate({ inputRange: [0, 1], outputRange: [0, BAR_W] });

  return (
    <AppShell variant="loader">
      <Animated.View style={[styles.root, { opacity: screenOpacity }]}>
        <Animated.View
          style={[
            styles.brandCard,
            { opacity: cardOpacity, transform: [{ scale: cardScale }, { scale: breatheScale }] },
          ]}>
          <Image source={assets.logo} style={styles.logo} resizeMode="contain" />
        </Animated.View>

        <Text style={styles.brandTop}>DESK STRETCH</Text>
        <Text style={styles.brandBottom}>LOG</Text>
        <Text style={styles.subtitle}>MOVEMENT BREAKS {'·'} ON THIS DEVICE ONLY</Text>

        <View style={styles.barTrack}>
          <Animated.View style={[styles.barFillWrap, { width: barWidth }]}>
            <LinearGradient
              colors={theme.gradients.progress}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.barFill}
            />
          </Animated.View>
        </View>
        <Text style={styles.loading}>LOADING{'…'}</Text>
      </Animated.View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  brandCard: {
    padding: 22,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    marginBottom: 26,
  },
  logo: { width: 128, height: 128 },
  brandTop: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '800',
    letterSpacing: 3,
    color: theme.colors.text.onDark,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 3 },
  },
  brandBottom: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '800',
    letterSpacing: 10,
    color: theme.colors.brand.coral,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 3 },
  },
  subtitle: {
    marginTop: 14,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2,
    color: 'rgba(255,255,255,0.62)',
    textAlign: 'center',
  },
  barTrack: {
    marginTop: 34,
    width: BAR_W,
    height: BAR_H,
    borderRadius: BAR_H / 2,
    backgroundColor: 'rgba(255,255,255,0.16)',
    overflow: 'hidden',
  },
  barFillWrap: { height: BAR_H, borderRadius: BAR_H / 2, overflow: 'hidden' },
  barFill: { flex: 1 },
  loading: {
    marginTop: 12,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 4,
    color: theme.colors.text.onDarkFaint,
  },
});

export default LoaderScreen;
