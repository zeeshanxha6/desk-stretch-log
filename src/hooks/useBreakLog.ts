import { useCallback, useMemo, useState } from 'react';
import {
  BreakEntry,
  DaySummary,
  Stretch,
  addBreak,
  bestDay,
  longestGap,
  makeBreak,
  moveItem,
  topStretches,
  totalBreaks,
} from '../game/breakLog';
import { minutesFromMidnight } from '../game/time';
import { SEED_STRETCHES, seedPastDays, seedTodayLog } from '../game/seed';
import {
  DEFAULT_TARGET,
  MAX_TARGET,
  MIN_TARGET,
  WORK_END_MIN,
  WORK_START_MIN,
  WORK_STEP_MIN,
} from '../constants/config';

export type Prefs = { sounds: boolean; localBackup: boolean };

export type RecordResult = {
  entry: BreakEntry;
  stretchName: string;
  todayCount: number;
  target: number;
  reachedNow: boolean;
};

/**
 * Single source of truth for the whole app. Screens receive the exact slices
 * they need as props — nobody subscribes to the entire object.
 */
export function useBreakLog() {
  const [log, setLog] = useState<BreakEntry[]>(seedTodayLog);
  const [pastDays] = useState<DaySummary[]>(seedPastDays);
  const [stretches, setStretches] = useState<Stretch[]>(SEED_STRETCHES);
  const [target, setTargetState] = useState(DEFAULT_TARGET);
  const [workStart, setWorkStart] = useState(WORK_START_MIN);
  const [workEnd, setWorkEnd] = useState(WORK_END_MIN);
  const [prefs, setPrefs] = useState<Prefs>({ sounds: true, localBackup: false });
  const [newBreakId, setNewBreakId] = useState<string | null>(null);

  const todayCount = log.length;

  const gap = useMemo(() => longestGap(log, workStart, workEnd), [log, workStart, workEnd]);

  const days = useMemo<DaySummary[]>(
    () => [{ offset: 0, count: todayCount } as DaySummary].concat(pastDays),
    [pastDays, todayCount],
  );

  const monthTotal = useMemo(() => totalBreaks(days), [days]);
  const best = useMemo(() => bestDay(days), [days]);
  const top3 = useMemo(() => topStretches(log, stretches, 3), [log, stretches]);

  const record = useCallback(
    (stretchId: string, heldSeconds: number): RecordResult => {
      const minute = Math.min(workEnd, Math.max(workStart, minutesFromMidnight()));
      const entry = makeBreak(stretchId, minute, heldSeconds);
      const prevCount = log.length;
      const nextCount = prevCount + 1;
      setLog(prev => addBreak(prev, entry));
      setNewBreakId(entry.id);
      const found = stretches.find(s => s.id === stretchId);
      return {
        entry,
        stretchName: found ? found.name : 'STRETCH',
        todayCount: nextCount,
        target,
        reachedNow: nextCount >= target && prevCount < target,
      };
    },
    [log.length, stretches, target, workEnd, workStart],
  );

  const clearNewBreak = useCallback(() => setNewBreakId(null), []);

  const setTarget = useCallback((delta: number) => {
    setTargetState(prev => Math.min(MAX_TARGET, Math.max(MIN_TARGET, prev + delta)));
  }, []);

  const shiftWorkStart = useCallback((delta: number) => {
    setWorkStart(prev => Math.min(1020, Math.max(240, prev + delta * WORK_STEP_MIN)));
  }, []);

  const shiftWorkEnd = useCallback((delta: number) => {
    setWorkEnd(prev => Math.min(1380, Math.max(600, prev + delta * WORK_STEP_MIN)));
  }, []);

  const renameStretch = useCallback((id: string, name: string) => {
    const clean = name.trim().toUpperCase();
    setStretches(prev => prev.map(s => (s.id === id ? { ...s, name: clean || s.name } : s)));
  }, []);

  const reorderStretch = useCallback((id: string, delta: number) => {
    setStretches(prev => {
      const index = prev.findIndex(s => s.id === id);
      return index < 0 ? prev : moveItem(prev, index, delta);
    });
  }, []);

  const addStretch = useCallback(() => {
    setStretches(prev => {
      const next: Stretch = {
        id: 'custom-' + (prev.length + 1) + '-' + Date.now(),
        name: 'NEW STRETCH ' + (prev.length + 1),
        spriteIndex: prev.length % 5,
        logged: 0,
      };
      return prev.concat(next);
    });
  }, []);

  const togglePref = useCallback((key: keyof Prefs) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  return {
    log,
    stretches,
    target,
    workStart,
    workEnd,
    prefs,
    todayCount,
    gap,
    days,
    monthTotal,
    best,
    top3,
    newBreakId,
    record,
    clearNewBreak,
    setTarget,
    shiftWorkStart,
    shiftWorkEnd,
    renameStretch,
    reorderStretch,
    addStretch,
    togglePref,
  };
}

export default useBreakLog;
