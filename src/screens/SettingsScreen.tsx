import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Hourglass, Repeat, Search } from 'lucide-react-native';
import AppShell from '../components/AppShell';
import ScreenHeader from '../components/ScreenHeader';
import SegmentedTabs from '../components/SegmentedTabs';
import Stepper from '../components/Stepper';
import GhostButton from '../components/GhostButton';
import { StatRow } from '../components/StatCard';
import theme from '../constants/theme';
import { BreakEntry, Gap, Stretch, StretchUse } from '../game/breakLog';
import { fmtClock, fmtDuration } from '../game/time';
import { HISTORY_ROWS } from '../constants/config';
import { CONTENT_W, PAGE_PAD } from '../utils/layout';

const TABS = ['HISTORY', 'HOURS', 'RECAP', 'PREFS'];

type Props = {
  log: BreakEntry[];
  stretches: Stretch[];
  top3: StretchUse[];
  gap: Gap;
  target: number;
  workStart: number;
  workEnd: number;
  sounds: boolean;
  localBackup: boolean;
  onBack: () => void;
  onTarget: (delta: number) => void;
  onWorkStart: (delta: number) => void;
  onWorkEnd: (delta: number) => void;
  onToggleSounds: () => void;
  onToggleBackup: () => void;
};

function Toggle({ on, onPress, label }: { on: boolean; onPress: () => void; label: string }) {
  const value = useRef(new Animated.Value(on ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(value, {
      toValue: on ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [on, value]);

  const translateX = value.interpolate({ inputRange: [0, 1], outputRange: [0, 24] });

  return (
    <Pressable
      onPress={onPress}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityRole="switch"
      accessibilityState={{ checked: on }}
      accessibilityLabel={label}
      style={styles.toggleHit}>
      <View style={[styles.toggleTrack, on ? styles.toggleOn : styles.toggleOff]}>
        <Animated.View style={[styles.toggleKnob, { transform: [{ translateX }] }]} />
      </View>
    </Pressable>
  );
}

function SwitchRow({
  label,
  value,
  on,
  onPress,
}: {
  label: string;
  value: string;
  on: boolean;
  onPress: () => void;
}) {
  return (
    <View style={styles.switchRow}>
      <View style={styles.switchText}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}</Text>
      </View>
      <Toggle on={on} onPress={onPress} label={label} />
    </View>
  );
}

function SettingsScreen(props: Props) {
  const {
    log,
    stretches,
    top3,
    gap,
    target,
    workStart,
    workEnd,
    sounds,
    localBackup,
    onBack,
    onTarget,
    onWorkStart,
    onWorkEnd,
    onToggleSounds,
    onToggleBackup,
  } = props;

  const [tab, setTab] = useState(TABS[0]);
  const [query, setQuery] = useState('');

  const nameOf = useMemo(() => {
    const map: Record<string, string> = {};
    stretches.forEach(s => {
      map[s.id] = s.name;
    });
    return map;
  }, [stretches]);

  const history = useMemo(() => {
    const needle = query.trim().toUpperCase();
    return log
      .slice()
      .reverse()
      .filter(b => needle.length === 0 || (nameOf[b.stretchId] || '').indexOf(needle) >= 0)
      .slice(0, HISTORY_ROWS);
  }, [log, nameOf, query]);

  const topCount = top3.length > 0 ? top3[0].count : 0;

  return (
    <AppShell variant="panel">
      <ScreenHeader title="MORE" onBack={onBack} />

      <View style={styles.body}>
        <SegmentedTabs tabs={TABS} active={tab} onChange={setTab} width={CONTENT_W} />

        <View style={styles.panel}>
          {tab === 'HISTORY' ? (
            <View style={styles.block}>
              <View style={styles.searchRow}>
                <Search size={20} strokeWidth={1.5} color={theme.colors.text.muted} />
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  placeholder="FILTER BY STRETCH"
                  placeholderTextColor={theme.colors.text.muted}
                  style={styles.search}
                />
              </View>
              {history.length > 0 ? (
                history.map(b => (
                  <View key={b.id} style={styles.histRow}>
                    <Text style={styles.histTime}>{fmtClock(b.minute)}</Text>
                    <Text style={styles.histName} numberOfLines={1}>
                      {nameOf[b.stretchId] || 'STRETCH'}
                    </Text>
                    <Text style={styles.histHold}>
                      {b.heldSeconds > 0 ? b.heldSeconds + 'S' : '—'}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.empty}>No break matches that name yet.</Text>
              )}
            </View>
          ) : null}

          {tab === 'HOURS' ? (
            <View style={styles.block}>
              <Stepper
                label="WORK START"
                value={fmtClock(workStart)}
                onMinus={() => onWorkStart(-1)}
                onPlus={() => onWorkStart(1)}
              />
              <Stepper
                label="WORK END"
                value={fmtClock(workEnd)}
                onMinus={() => onWorkEnd(-1)}
                onPlus={() => onWorkEnd(1)}
              />
              <Stepper
                label="DAILY TARGET"
                value={String(target) + ' BREAKS'}
                onMinus={() => onTarget(-1)}
                onPlus={() => onTarget(1)}
              />
            </View>
          ) : null}

          {tab === 'RECAP' ? (
            <View style={styles.block}>
              {top3.map((use, i) => (
                <View key={use.stretch.id} style={styles.recapRow}>
                  <Text style={styles.recapRank}>{String(i + 1)}</Text>
                  <Text style={styles.recapName} numberOfLines={1}>
                    {use.stretch.name}
                  </Text>
                  <View style={styles.recapBarTrack}>
                    {/* flex ratios instead of a percentage width — no string maths. */}
                    <View
                      style={[
                        styles.recapBarFill,
                        { flex: topCount > 0 ? Math.max(0.08, use.count / topCount) : 0.08 },
                      ]}
                    />
                    <View
                      style={{
                        flex: topCount > 0 ? Math.max(0, 1 - use.count / topCount) : 0.92,
                      }}
                    />
                  </View>
                  <Text style={styles.recapCount}>{String(use.count)}</Text>
                </View>
              ))}
              <View style={styles.statsWrap}>
                <StatRow
                  items={[
                    {
                      key: 'gap',
                      Icon: Hourglass,
                      value: fmtDuration(gap.length),
                      label: 'longest gap',
                      valueColor: theme.colors.brand.coral,
                    },
                    {
                      key: 'top',
                      Icon: Repeat,
                      value: String(topCount),
                      label: 'most used',
                      valueColor: theme.colors.brand.teal,
                    },
                  ]}
                />
              </View>
            </View>
          ) : null}

          {tab === 'PREFS' ? (
            <View style={styles.block}>
              <View style={styles.switchRow}>
                <View style={styles.switchText}>
                  <Text style={styles.rowLabel}>THEME</Text>
                  <Text style={styles.rowValue}>SOFT LIGHT</Text>
                </View>
                <View style={styles.themeSwatches}>
                  <View style={[styles.themeDot, styles.themeDotTeal]} />
                  <View style={[styles.themeDot, styles.themeDotCoral]} />
                  <View style={[styles.themeDot, styles.themeDotMint]} />
                </View>
              </View>
              <SwitchRow
                label="SOUNDS"
                value={sounds ? 'ON' : 'OFF'}
                on={sounds}
                onPress={onToggleSounds}
              />
              <SwitchRow
                label="LOCAL BACKUP"
                value={localBackup ? 'SNAPSHOT KEPT' : 'OFF'}
                on={localBackup}
                onPress={onToggleBackup}
              />
              <Text style={styles.note}>
                Everything stays on this device. No account, no cloud, no network.
              </Text>
            </View>
          ) : null}
        </View>

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
  panel: { flex: 1, width: CONTENT_W, paddingTop: 16 },
  block: { width: '100%' },
  searchRow: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: theme.colors.surface.card,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    marginBottom: 10,
  },
  search: {
    flex: 1,
    height: 48,
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.primary,
    padding: 0,
  },
  histRow: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.70)',
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    marginBottom: 6,
  },
  histTime: {
    width: 48,
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.brand.teal,
  },
  histName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  histHold: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.text.secondary,
  },
  empty: {
    marginTop: 14,
    fontSize: 13,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  recapRow: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: theme.colors.surface.card,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    marginBottom: 8,
  },
  recapRank: {
    width: 16,
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.text.muted,
  },
  recapName: {
    width: 108,
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  recapBarTrack: {
    flex: 1,
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.bg.secondary,
    overflow: 'hidden',
  },
  recapBarFill: { height: 8, borderRadius: 4, backgroundColor: theme.colors.brand.teal },
  recapCount: {
    width: 22,
    textAlign: 'right',
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.brand.teal,
  },
  statsWrap: { marginTop: 10 },
  switchRow: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: theme.colors.surface.card,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    marginBottom: 10,
  },
  switchText: { flex: 1 },
  rowLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: theme.colors.text.secondary,
  },
  rowValue: {
    marginTop: 2,
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.text.primary,
  },
  themeSwatches: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  themeDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  themeDotTeal: { backgroundColor: theme.colors.brand.teal },
  themeDotCoral: { backgroundColor: theme.colors.brand.coral },
  themeDotMint: { backgroundColor: theme.colors.brand.mint },
  toggleHit: { width: 56, height: 44, alignItems: 'flex-end', justifyContent: 'center' },
  toggleTrack: {
    width: 52,
    height: 30,
    borderRadius: 15,
    padding: 3,
    borderWidth: 1,
  },
  toggleOn: {
    backgroundColor: 'rgba(46,140,122,0.22)',
    borderColor: theme.colors.brand.teal,
  },
  toggleOff: {
    backgroundColor: theme.colors.bg.secondary,
    borderColor: theme.colors.ui.border,
  },
  toggleKnob: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: theme.colors.brand.teal,
  },
  note: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 17,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});

export default SettingsScreen;
