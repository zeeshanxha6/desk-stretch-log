import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { BreakEntry, Gap } from '../game/breakLog';
import { fmtClock, fmtDuration, ribbonX } from '../game/time';
import { LONG_GAP_MIN } from '../constants/config';
import BreakPill, { PILL_W } from './BreakPill';

const TRACK_H = 56;
const MARKS = 9;

type Props = {
  breaks: BreakEntry[];
  startMin: number;
  endMin: number;
  width: number;
  gap: Gap;
  newBreakId: string | null;
};

/**
 * The signature element: the work window laid out left to right, every logged
 * break as a teal pill at its proportional position, and the widest stretch of
 * sitting marked in coral underneath.
 */
function WorkdayRibbon({ breaks, startMin, endMin, width, gap, newBreakId }: Props) {
  const trackW = width;
  const step = trackW / MARKS;
  const longGap = gap.length >= LONG_GAP_MIN;

  const marks = useMemo(
    () => Array.from({ length: MARKS - 1 }, (_, i) => Math.round((i + 1) * step)),
    [step],
  );

  const labels = useMemo(() => {
    const span = endMin - startMin;
    return [0, 2, 4, 6, 8].map(i => {
      const minute = startMin + (span * i) / MARKS;
      return { key: 'h' + i, left: Math.round(i * step), text: String(Math.floor(minute / 60)) };
    });
  }, [endMin, startMin, step]);

  const gapLeft = ribbonX(gap.start, trackW, 0, startMin, endMin);
  const gapRight = ribbonX(gap.end, trackW, 0, startMin, endMin);
  const gapW = Math.max(8, gapRight - gapLeft);

  return (
    <View style={styles.card}>
      <View style={styles.captionRow}>
        <Text style={styles.caption}>
          {'WORK HOURS ' + fmtClock(startMin) + ' — ' + fmtClock(endMin)}
        </Text>
        <Text style={[styles.gapCaption, longGap ? styles.gapHot : styles.gapCalm]}>
          {'GAP ' + fmtDuration(gap.length)}
        </Text>
      </View>

      <View style={[styles.track, { width: trackW }]}>
        {marks.map((left, i) => (
          <View key={'mark-' + i} style={[styles.mark, { left }]} />
        ))}
        {breaks.map(b => (
          <BreakPill
            key={b.id}
            left={ribbonX(b.minute, trackW, PILL_W, startMin, endMin)}
            isNew={b.id === newBreakId}
          />
        ))}
        {longGap ? (
          <View style={[styles.gapBar, { left: gapLeft, width: gapW }]} />
        ) : null}
      </View>

      <View style={[styles.labelRow, { width: trackW }]}>
        {labels.map(l => (
          <Text key={l.key} style={[styles.hourLabel, { left: l.left }]}>
            {l.text}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface.card,
    borderRadius: 22,
    padding: 16,
    shadowColor: '#1B2D2A',
    shadowOpacity: 0.07,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  captionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  caption: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.4,
    color: theme.colors.text.secondary,
  },
  gapCaption: { fontSize: 11, fontWeight: '700', letterSpacing: 1.2 },
  gapHot: { color: theme.colors.brand.coral },
  gapCalm: { color: theme.colors.text.muted },
  track: {
    height: TRACK_H,
    backgroundColor: theme.colors.surface.alt,
    borderRadius: 16,
    overflow: 'hidden',
  },
  mark: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(27,45,42,0.08)',
  },
  gapBar: {
    position: 'absolute',
    top: 50,
    height: 2,
    borderRadius: 1,
    backgroundColor: theme.colors.brand.coral,
    opacity: 0.8,
  },
  labelRow: { height: 14, marginTop: 4 },
  hourLabel: {
    position: 'absolute',
    top: 0,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: theme.colors.text.muted,
  },
});

export default React.memo(WorkdayRibbon);
