import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import AppShell from '../components/AppShell';
import ScreenHeader from '../components/ScreenHeader';
import StretchTile from '../components/StretchTile';
import HoldRing from '../components/HoldRing';
import PrimaryButton from '../components/PrimaryButton';
import GhostButton from '../components/GhostButton';
import Chip from '../components/Chip';
import theme from '../constants/theme';
import assets from '../assets';
import { HOLD_OPTIONS, SCREEN_SLIDE_MS } from '../constants/config';
import { BreakEntry, Stretch, lastBreakMinute } from '../game/breakLog';
import { fmtClock, fmtHold } from '../game/time';
import { useHoldTimer } from '../hooks/useHoldTimer';
import {
  CONTENT_W,
  PAGE_PAD,
  PICKER_TILE_H,
  RING_SIZE,
  STRIP_H,
  TILE_GAP,
  splitRow,
} from '../utils/layout';

const CHIP_W = splitRow(CONTENT_W, HOLD_OPTIONS.length, 8);
const VISIBLE_TILES = 5;

type Props = {
  stretches: Stretch[];
  log: BreakEntry[];
  todayCount: number;
  target: number;
  onBack: () => void;
  onGameOver: (stretchId: string, heldSeconds: number) => void;
};

type Phase = 'picker' | 'timer';

/** G3 split panel: work area, a thin stat strip and one big action. */
function GameScreen({ stretches, log, todayCount, target, onBack, onGameOver }: Props) {
  const tiles = useMemo(() => stretches.slice(0, VISIBLE_TILES), [stretches]);

  const [phase, setPhase] = useState<Phase>('picker');
  const [holdSec, setHoldSec] = useState(HOLD_OPTIONS[1]);
  const [selectedId, setSelectedId] = useState(tiles.length > 0 ? tiles[0].id : '');

  const slide = useRef(new Animated.Value(0)).current;
  const panel = useRef(new Animated.Value(0)).current;
  const holdRef = useRef(holdSec);
  const selectedRef = useRef(selectedId);
  const overRef = useRef(onGameOver);

  holdRef.current = holdSec;
  selectedRef.current = selectedId;
  overRef.current = onGameOver;

  const commit = useCallback((heldSeconds: number) => {
    const id = selectedRef.current;
    if (!id) {
      return;
    }
    overRef.current(id, heldSeconds);
  }, []);

  const timer = useHold(commit);
  const startHold = timer.start;
  const stopHold = timer.stop;
  const skipHold = timer.skip;

  useEffect(() => {
    slide.setValue(0);
    Animated.timing(slide, {
      toValue: 1,
      duration: SCREEN_SLIDE_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [slide]);

  useEffect(() => {
    Animated.timing(panel, {
      toValue: phase === 'timer' ? 1 : 0,
      duration: SCREEN_SLIDE_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [panel, phase]);

  const handleTile = useCallback(
    (id: string) => {
      setSelectedId(id);
      selectedRef.current = id;
      if (holdRef.current > 0) {
        setPhase('timer');
        startHold(holdRef.current);
      } else {
        overRef.current(id, 0);
      }
    },
    [startHold],
  );

  const handlePause = useCallback(() => {
    if (phase !== 'timer') {
      return;
    }
    stopHold();
    setPhase('picker');
  }, [phase, stopHold]);

  const handleSkip = useCallback(() => {
    const held = skipHold();
    setPhase('picker');
    commit(held);
  }, [commit, skipHold]);

  const handleAction = useCallback(() => {
    if (phase === 'timer') {
      return;
    }
    commit(0);
  }, [commit, phase]);

  const selected = tiles.find(s => s.id === selectedId);
  const selectedName = selected ? selected.name : 'STRETCH';
  const lastMinute = lastBreakMinute(log);

  const screenStyle = {
    opacity: slide,
    transform: [
      { translateX: slide.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) },
    ],
  };

  const listStyle = {
    opacity: panel.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
  };

  const timerStyle = {
    opacity: panel,
    transform: [
      { translateX: panel.interpolate({ inputRange: [0, 1], outputRange: [60, 0] }) },
    ],
  };

  return (
    <AppShell variant="game">
      <ScreenHeader
        title="RECORD A BREAK"
        onBack={onBack}
        rightSlot={
          <Pressable
            onPress={handlePause}
            disabled={phase !== 'timer'}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel="Stop hold timer"
            style={[styles.pauseHit, phase === 'timer' ? null : styles.pauseIdle]}>
            <View style={styles.pauseCircle}>
              <Image source={assets.iconPause} style={styles.pauseIcon} resizeMode="contain" />
            </View>
          </Pressable>
        }
      />

      <Animated.View pointerEvents="box-none" style={[styles.screen, screenStyle]}>
        <View style={styles.area}>
          {phase === 'picker' ? (
            <Animated.View pointerEvents="box-none" style={[styles.list, listStyle]}>
              {tiles.map(s => (
                <View key={s.id} style={styles.tileSlot}>
                  <StretchTile
                    name={s.name}
                    sub={
                      (holdSec > 0 ? 'HOLD ' + holdSec + 'S' : 'NO TIMER') +
                      ' · ' +
                      s.logged +
                      ' LOGGED'
                    }
                    spriteIndex={s.spriteIndex}
                    width={CONTENT_W}
                    height={PICKER_TILE_H}
                    onPress={() => handleTile(s.id)}
                  />
                </View>
              ))}
            </Animated.View>
          ) : (
            <Animated.View pointerEvents="box-none" style={[styles.timerPanel, timerStyle]}>
              <HoldRing
                size={RING_SIZE}
                durationSec={holdSec}
                remaining={timer.remaining}
                running={timer.running}
                label={selectedName}
              />
              <View style={styles.skipWrap}>
                <GhostButton
                  label={'SKIP TIMER · LOG NOW'}
                  width={CONTENT_W}
                  onPress={handleSkip}
                />
              </View>
            </Animated.View>
          )}
        </View>

        <View style={styles.strip}>
          <View style={styles.stripCell}>
            <Text style={styles.stripLabel}>TODAY</Text>
            <Text style={styles.stripValue}>{String(todayCount)}</Text>
          </View>
          <View style={styles.stripDivider} />
          <View style={styles.stripCell}>
            <Text style={styles.stripLabel}>TARGET</Text>
            <Text style={styles.stripValue}>{String(target)}</Text>
          </View>
          <View style={styles.stripDivider} />
          <View style={styles.stripCell}>
            <Text style={styles.stripLabel}>LAST</Text>
            <Text style={styles.stripValue}>
              {lastMinute >= 0 ? fmtClock(lastMinute) : '--:--'}
            </Text>
          </View>
        </View>

        <View style={styles.controls}>
          {phase === 'picker' ? (
            <View style={styles.chipRow}>
              {HOLD_OPTIONS.map(sec => (
                <Chip
                  key={'hold-' + sec}
                  label={fmtHold(sec)}
                  width={CHIP_W}
                  active={sec === holdSec}
                  onPress={() => setHoldSec(sec)}
                />
              ))}
            </View>
          ) : null}

          <PrimaryButton
            label={phase === 'timer' ? 'HOLD…' : 'LOG THIS BREAK'}
            Icon={Check}
            width={CONTENT_W}
            colors={theme.gradients.primary}
            shadow={theme.shadows.teal}
            disabled={phase === 'timer'}
            onPress={handleAction}
          />
        </View>
      </Animated.View>
    </AppShell>
  );
}

/** Small wrapper so the hook keeps a stable completion callback. */
function useHold(commit: (held: number) => void) {
  const commitRef = useRef(commit);
  commitRef.current = commit;
  const onComplete = useCallback((held: number) => {
    commitRef.current(held);
  }, []);
  return useHoldTimer({ onComplete });
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  area: {
    flex: 1,
    paddingHorizontal: PAGE_PAD,
    paddingTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // No flex:1 here — `area` is already flex:1 and the tiles carry explicit
  // heights, so a second flex:1 would only risk the collapse of rule #19a.
  list: { width: CONTENT_W },
  tileSlot: { marginBottom: TILE_GAP },
  timerPanel: { alignItems: 'center', justifyContent: 'center' },
  skipWrap: { marginTop: 26 },
  strip: {
    height: STRIP_H,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface.strip,
    borderTopWidth: 1,
    borderTopColor: theme.colors.ui.border,
  },
  stripCell: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  stripDivider: { width: 1, height: 28, backgroundColor: theme.colors.ui.border },
  stripLabel: {
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: theme.colors.text.secondary,
  },
  stripValue: {
    marginTop: 2,
    fontSize: 15,
    lineHeight: 19,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  controls: {
    backgroundColor: theme.colors.surface.card,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: PAGE_PAD,
    paddingTop: 18,
    paddingBottom: 26,
    alignItems: 'center',
    shadowColor: '#1B2D2A',
    shadowOpacity: 0.07,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: -6 },
    elevation: 10,
  },
  chipRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: CONTENT_W,
    gap: 8,
    marginBottom: 14,
  },
  pauseHit: { width: 44, height: 44 },
  pauseIdle: { opacity: 0.45 },
  pauseCircle: {
    flex: 1,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.80)',
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pauseIcon: { width: 24, height: 24 },
});

export default GameScreen;
