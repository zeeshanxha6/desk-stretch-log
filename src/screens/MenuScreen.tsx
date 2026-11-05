import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { Activity, CalendarDays, CheckCircle2, ListChecks, Plus, Settings2, Target } from 'lucide-react-native';
import AppShell from '../components/AppShell';
import ScreenHeader from '../components/ScreenHeader';
import WorkdayRibbon from '../components/WorkdayRibbon';
import PrimaryButton from '../components/PrimaryButton';
import GhostButton from '../components/GhostButton';
import { StatRow } from '../components/StatCard';
import theme from '../constants/theme';
import assets from '../assets';
import { CTA_SPRING, FADE_MS } from '../constants/config';
import { BreakEntry, Gap } from '../game/breakLog';
import { fmtDayLine } from '../game/time';
import { CONTENT_W, PAGE_PAD, splitRow } from '../utils/layout';

const RIBBON_TRACK_W = CONTENT_W - 32;
const GHOST_W = splitRow(CONTENT_W, 3, 10);

type Props = {
  breaks: BreakEntry[];
  todayCount: number;
  target: number;
  workStart: number;
  workEnd: number;
  gap: Gap;
  newBreakId: string | null;
  onStart: () => void;
  onWeek: () => void;
  onStretches: () => void;
  onSettings: () => void;
};

/** Today's break count — the "balance" analogue, pulsing whenever it changes. */
function TodayBadge({ count }: { count: number }) {
  const scale = useRef(new Animated.Value(1)).current;
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    scale.setValue(1.18);
    Animated.spring(scale, {
      toValue: 1,
      tension: 120,
      friction: 6,
      useNativeDriver: true,
    }).start();
  }, [count, scale]);

  return (
    <Animated.View style={[styles.badge, { transform: [{ scale }] }]}>
      <Activity size={18} strokeWidth={1.5} color={theme.colors.brand.teal} />
      <Text style={styles.badgeText}>{count + ' BREAKS'}</Text>
    </Animated.View>
  );
}

/** Staggered mount: translateY + opacity only, native driver safe. */
function useRise(delay: number) {
  const value = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(value, {
      toValue: 1,
      duration: FADE_MS,
      delay,
      useNativeDriver: true,
    }).start();
  }, [delay, value]);
  return {
    opacity: value,
    transform: [
      { translateY: value.interpolate({ inputRange: [0, 1], outputRange: [18, 0] }) },
    ],
  };
}

/** M4 asymmetric / editorial: text flush left, the hero art pushed right. */
function MenuScreen({
  breaks,
  todayCount,
  target,
  workStart,
  workEnd,
  gap,
  newBreakId,
  onStart,
  onWeek,
  onStretches,
  onSettings,
}: Props) {
  const hero = useRise(0);
  const ribbon = useRise(60);
  const stats = useRise(120);
  const ctaScale = useRef(new Animated.Value(0.94)).current;

  useEffect(() => {
    Animated.spring(ctaScale, {
      toValue: 1,
      tension: CTA_SPRING.tension,
      friction: CTA_SPRING.friction,
      useNativeDriver: true,
    }).start();
  }, [ctaScale]);

  return (
    <AppShell variant="menu">
      <ScreenHeader
        surface={false}
        leftSlot={
          <View style={styles.homeCard}>
            <Image source={assets.iconHome} style={styles.homeIcon} resizeMode="contain" />
          </View>
        }
        rightSlot={<TodayBadge count={todayCount} />}
      />

      <View style={styles.body}>
        <Animated.View style={[styles.hero, hero]}>
          <View style={styles.heroText}>
            <Text style={styles.eyebrow}>{fmtDayLine()}</Text>
            <Text style={styles.heroTitle}>WORKDAY</Text>
            <Text style={styles.heroTitleAccent}>RIBBON</Text>
            <View style={styles.heroRule} />
            <Text style={styles.tagline}>Your breaks, placed along the hours you sit.</Text>
          </View>
          <Image source={assets.sprite1} style={styles.heroArt} resizeMode="contain" />
        </Animated.View>

        <Animated.View style={ribbon}>
          <WorkdayRibbon
            breaks={breaks}
            startMin={workStart}
            endMin={workEnd}
            width={RIBBON_TRACK_W}
            gap={gap}
            newBreakId={newBreakId}
          />
        </Animated.View>

        <Animated.View style={[styles.statsWrap, stats]}>
          <StatRow
            items={[
              {
                key: 'today',
                Icon: CheckCircle2,
                value: String(todayCount),
                label: 'today',
                valueColor: theme.colors.brand.teal,
              },
              {
                key: 'target',
                Icon: Target,
                value: todayCount + '/' + target,
                label: 'target',
                valueColor: theme.colors.brand.coral,
              },
            ]}
          />
        </Animated.View>

        <View style={styles.spacer} />

        <Text style={styles.hint}>TAP A STRETCH {'·'} OPTIONAL HOLD TIMER</Text>

        <Animated.View
          pointerEvents="box-none"
          style={[styles.ctaWrap, { transform: [{ scale: ctaScale }] }]}>
          <PrimaryButton label="START STRETCH" Icon={Plus} width={CONTENT_W} onPress={onStart} />
        </Animated.View>

        <View style={styles.ghostRow}>
          <GhostButton label="WEEK" Icon={CalendarDays} width={GHOST_W} onPress={onWeek} />
          <GhostButton label="LIST" Icon={ListChecks} width={GHOST_W} onPress={onStretches} />
          <GhostButton label="MORE" Icon={Settings2} width={GHOST_W} onPress={onSettings} />
        </View>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: PAGE_PAD,
    paddingTop: 4,
    paddingBottom: 16,
  },
  homeCard: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.surface.card,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1B2D2A',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  homeIcon: { width: 28, height: 28 },
  badge: {
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 14,
    backgroundColor: theme.colors.surface.card,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#1B2D2A',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  badgeText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  hero: { marginBottom: 14 },
  heroText: { maxWidth: CONTENT_W - 120 },
  heroArt: {
    position: 'absolute',
    right: 8,
    top: 28,
    width: 110,
    height: 110,
    opacity: 0.95,
  },
  eyebrow: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.text.secondary,
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 40,
    lineHeight: 42,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: theme.colors.text.primary,
  },
  heroTitleAccent: {
    fontSize: 40,
    lineHeight: 42,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: theme.colors.brand.teal,
  },
  heroRule: {
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.brand.coral,
    marginTop: 8,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '400',
    color: theme.colors.text.secondary,
    maxWidth: 240,
  },
  statsWrap: { marginTop: 12 },
  spacer: { flex: 1, minHeight: 12 },
  hint: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 1.6,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  ctaWrap: { alignItems: 'center', marginBottom: 10 },
  ghostRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
});

export default MenuScreen;
