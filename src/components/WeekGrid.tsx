import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { DaySummary } from '../game/breakLog';
import { boardMetrics } from '../utils/layout';

const COLS = 7;
const PAD = 10;
const BORDER = 1;

type Props = {
  rows: DaySummary[][];
  target: number;
  maxWidth: number;
};

function fillFor(count: number, target: number): string {
  if (count <= 0) {
    return theme.colors.bg.secondary;
  }
  if (count >= target) {
    return theme.colors.brand.teal;
  }
  if (count <= 3) {
    return 'rgba(46,140,122,0.20)';
  }
  return 'rgba(46,140,122,0.50)';
}

/**
 * Rule #4 geometry: the cell size is derived from the card's inner width, and
 * the 3px gutters live on an inner view INSIDE each cell slot, so nothing can
 * ever overflow the rounded card.
 */
function WeekGrid({ rows, target, maxWidth }: Props) {
  const metrics = boardMetrics(COLS, PAD, BORDER, maxWidth);

  return (
    <View style={[styles.card, { width: metrics.width, padding: PAD, borderWidth: BORDER }]}>
      {rows.map((row, r) => (
        <View key={'row-' + r} style={styles.row}>
          {row.map((day, c) => {
            const fill = fillFor(day.count, target);
            const reached = day.count >= target && day.count > 0;
            const light = day.count > 0 && day.count < target;
            return (
              <View
                key={'cell-' + r + '-' + c}
                style={{ width: metrics.cell, height: metrics.cell }}>
                <View style={[styles.cell, { backgroundColor: fill }]}>
                  {day.count > 0 ? (
                    <Text
                      style={[
                        styles.count,
                        reached ? styles.countOnTeal : light ? styles.countMid : styles.countLow,
                      ]}>
                      {String(day.count)}
                    </Text>
                  ) : null}
                  {reached ? <View style={styles.coralDot} /> : null}
                </View>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface.card,
    borderColor: theme.colors.ui.border,
    borderRadius: 22,
    shadowColor: '#1B2D2A',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  row: { flexDirection: 'row' },
  cell: {
    flex: 1,
    margin: 3,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: { fontSize: 10, fontWeight: '800' },
  countOnTeal: { color: '#FFFFFF' },
  countMid: { color: theme.colors.brand.tealDeep },
  countLow: { color: theme.colors.text.secondary },
  coralDot: {
    position: 'absolute',
    top: 3,
    right: 3,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.brand.coral,
  },
});

export default React.memo(WeekGrid);
