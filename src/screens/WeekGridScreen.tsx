import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CalendarDays, Flame } from 'lucide-react-native';
import AppShell from '../components/AppShell';
import ScreenHeader from '../components/ScreenHeader';
import WeekGrid from '../components/WeekGrid';
import GhostButton from '../components/GhostButton';
import { StatRow } from '../components/StatCard';
import theme from '../constants/theme';
import { DaySummary, weekMatrix } from '../game/breakLog';
import { WEEK_GRID_WEEKS } from '../constants/config';
import { BOARD_MAX_W, CONTENT_W, PAGE_PAD } from '../utils/layout';

const LEGEND = [
  { key: 'zero', label: '0', color: theme.colors.bg.secondary },
  { key: 'low', label: 'LOW', color: 'rgba(46,140,122,0.20)' },
  { key: 'mid', label: 'MID', color: 'rgba(46,140,122,0.50)' },
  { key: 'target', label: 'TARGET', color: theme.colors.brand.teal },
];

type Props = {
  days: DaySummary[];
  target: number;
  monthTotal: number;
  best: number;
  onBack: () => void;
};

function WeekGridScreen({ days, target, monthTotal, best, onBack }: Props) {
  const rows = useMemo(() => weekMatrix(days, WEEK_GRID_WEEKS), [days]);

  return (
    <AppShell variant="panel">
      <ScreenHeader title="WEEK GRID" onBack={onBack} />

      <View style={styles.body}>
        <Text style={styles.lede}>The last four weeks of standing up.</Text>

        <WeekGrid rows={rows} target={target} maxWidth={BOARD_MAX_W} />

        <View style={styles.legend}>
          {LEGEND.map(item => (
            <View key={item.key} style={styles.legendItem}>
              <View style={[styles.swatch, { backgroundColor: item.color }]} />
              <Text style={styles.legendLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.statsWrap}>
          <StatRow
            items={[
              {
                key: 'total',
                Icon: CalendarDays,
                value: String(monthTotal),
                label: '4-week total',
                valueColor: theme.colors.brand.teal,
              },
              {
                key: 'best',
                Icon: Flame,
                value: String(best),
                label: 'best day',
                valueColor: theme.colors.brand.coral,
              },
            ]}
          />
        </View>

        <View style={styles.spacer} />

        <GhostButton label="BACK TO RIBBON" width={CONTENT_W} onPress={onBack} />
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: PAGE_PAD,
    paddingTop: 14,
    paddingBottom: 24,
  },
  lede: {
    alignSelf: 'flex-start',
    fontSize: 14,
    lineHeight: 19,
    color: theme.colors.text.secondary,
    marginBottom: 14,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginTop: 14,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  swatch: {
    width: 14,
    height: 14,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  legendLabel: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.text.secondary,
  },
  statsWrap: { width: CONTENT_W, marginTop: 18 },
  spacer: { flex: 1, minHeight: 16 },
});

export default WeekGridScreen;
