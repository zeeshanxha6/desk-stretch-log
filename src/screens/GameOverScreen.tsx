import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { CheckCircle2, RotateCcw, Target } from 'lucide-react-native';
import AppShell from '../components/AppShell';
import ScreenHeader from '../components/ScreenHeader';
import PrimaryButton from '../components/PrimaryButton';
import GhostButton from '../components/GhostButton';
import Confetti from '../components/Confetti';
import { StatRow } from '../components/StatCard';
import theme from '../constants/theme';
import assets from '../assets';
import { CARD_SPRING } from '../constants/config';
import { fmtClock } from '../game/time';
import { CONTENT_W, PAGE_PAD } from '../utils/layout';

export type Recap = {
  stretchName: string;
  heldSeconds: number;
  minute: number;
  todayCount: number;
  target: number;
  reached: boolean;
};

type Props = {
  recap: Recap;
  onPlayAgain: () => void;
  onMenu: () => void;
};

/** Break Recap — the discrete result screen of the loop (rule #12). */
function GameOverScreen({ recap, onPlayAgain, onMenu }: Props) {
  const scale = useRef(new Animated.Value(0.9)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [fire, setFire] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        tension: CARD_SPRING.tension,
        friction: CARD_SPRING.friction,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, { toValue: 1, duration: 260, useNativeDriver: true }),
    ]).start();

    if (!recap.reached) {
      return;
    }
    const t = setTimeout(() => setFire(true), 180);
    return () => clearTimeout(t);
  }, [opacity, recap.reached, scale]);

  const detail =
    recap.stretchName +
    ' · ' +
    (recap.heldSeconds > 0 ? 'HELD ' + recap.heldSeconds + 'S' : 'NO TIMER') +
    ' · ' +
    fmtClock(recap.minute);

  return (
    <AppShell variant="result">
      <ScreenHeader title="BREAK RECAP" tone="dark" />

      <View style={styles.body}>
        <View style={styles.cardZone}>
          <Animated.View
            style={[
              styles.card,
              recap.reached ? styles.cardReached : styles.cardPlain,
              { opacity, transform: [{ scale }] },
            ]}>
            <Image source={assets.sprite2} style={styles.sprite} resizeMode="contain" />
            <Text style={styles.headline}>BREAK LOGGED</Text>
            <Text style={styles.detail} numberOfLines={1}>
              {detail}
            </Text>

            <View style={styles.statsWrap}>
              <StatRow
                items={[
                  {
                    key: 'today',
                    Icon: CheckCircle2,
                    value: String(recap.todayCount),
                    label: 'today',
                    valueColor: theme.colors.brand.teal,
                  },
                  {
                    key: 'target',
                    Icon: Target,
                    value: recap.todayCount + '/' + recap.target,
                    label: 'target',
                    valueColor: theme.colors.brand.coral,
                  },
                ]}
              />
            </View>

            {recap.reached ? <Text style={styles.reached}>SOFT TARGET REACHED</Text> : null}
          </Animated.View>

          <Confetti fire={fire} />
        </View>

        <Text style={styles.hint}>ANOTHER ONE WHENEVER YOU LIKE</Text>

        <PrimaryButton
          label="STRETCH AGAIN"
          Icon={RotateCcw}
          width={CONTENT_W}
          onPress={onPlayAgain}
        />

        <View style={styles.secondaryWrap}>
          <GhostButton label="BACK TO RIBBON" width={CONTENT_W} tone="dark" onPress={onMenu} />
        </View>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: PAGE_PAD,
    paddingBottom: 24,
  },
  cardZone: { flex: 1, width: CONTENT_W, alignItems: 'center', justifyContent: 'center' },
  card: {
    width: CONTENT_W,
    backgroundColor: theme.colors.surface.card,
    borderRadius: 26,
    padding: 22,
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: '#0B1F1B',
    shadowOpacity: 0.25,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  cardPlain: { borderColor: 'rgba(46,140,122,0.20)' },
  cardReached: { borderColor: theme.colors.brand.coral },
  sprite: { width: 92, height: 92, marginBottom: 10 },
  headline: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
    letterSpacing: 1,
    color: theme.colors.text.primary,
  },
  detail: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  statsWrap: { width: '100%', marginTop: 16 },
  reached: {
    marginTop: 12,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.brand.coral,
  },
  hint: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 1.4,
    color: theme.colors.text.onDarkSoft,
    marginBottom: 8,
  },
  secondaryWrap: { marginTop: 10 },
});

export default GameOverScreen;
